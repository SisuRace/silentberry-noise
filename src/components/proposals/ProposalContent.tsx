"use client";

import { useApp } from "@/contexts/WalletContext";
import { createProposalCluster } from "@/lib/blockchain/ckbService";
import { formatDate } from "@/lib/utils/date";
import { $Enums, Profile, Proposal, Vote } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import VoteButtons from "./VoteButtons";

interface ProposalProps extends Proposal {
  votes: Vote[];
  creator: Profile;
}

export default function ProposalContent({
  proposal,
}: {
  proposal: ProposalProps;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { signer } = useApp();
  const voteCount = proposal.votes?.length || 0;
  const supportCount = proposal.votes?.filter((v) => v.support).length || 0;
  const supportPercentage =
    voteCount > 0 ? Math.round((supportCount / voteCount) * 100) : 0;

  const handlePublish = async () => {
    if (!signer) {
      toast.error("请先连接钱包");
      return;
    }

    try {
      setIsPublishing(true);
      const { txHash, id } = await createProposalCluster(proposal, signer);
      console.log(txHash, id);

      // 调用API更新提案状态
      const response = await fetch(`/api/proposals/${proposal.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: txHash, clusterId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "提案发布失败，请稍后重试");
      }

      toast.success("提案已成功发布到链上");
    } catch (error) {
      console.error("发布失败:", error);
      //   toast.error("发布失败：" + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {proposal.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>由 {proposal.creator.walletAddress} 发起</span>
              <span>·</span>
              <span>{formatDate(proposal.createdAt)}</span>
              {proposal.txHash && (
                <>
                  <span>·</span>
                  <a
                    href={`https://explorer.nervos.org/transaction/${proposal.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-blue-600"
                  >
                    查看交易
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {proposal.status}
            </span>
          </div>
        </div>

        {proposal.status !== $Enums.ProposalStatus.ACTIVE && (
          <div className="mb-8">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium
                ${
                  isPublishing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isPublishing ? "发布中..." : "发布到链上"}
            </button>
          </div>
        )}

        <div className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: proposal.content }} />
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">投票结果</h2>
            <div className="text-sm text-gray-500">
              总投票数：{voteCount} · 支持率：{supportPercentage}%
            </div>
          </div>

          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="absolute h-full bg-green-500"
              style={{ width: `${supportPercentage}%` }}
            />
          </div>

          {proposal.txHash && (
            <VoteButtons
              proposalId={proposal.id}
              clusterId={proposal.clusterId}
            />
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">投票信息</h2>
          <ul className="mt-4 space-y-2">
            {proposal.votes.map((vote) => (
              <li key={vote.id} className="flex items-center justify-between">
                <span>
                  {vote.user.walletAddress} - {vote.support ? "支持" : "反对"}
                </span>
                {vote.txHash && (
                  <a
                    href={`https://explorer.nervos.org/transaction/${vote.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    查看链上交易
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
