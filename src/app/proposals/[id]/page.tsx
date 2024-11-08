import VoteButtons from "@/components/proposals/VoteButtons";
import BackLink from "@/components/ui/BackLink";
import { db } from "@/lib/prisma";
import { formatDate } from "@/lib/utils/date";
import { notFound } from "next/navigation";

async function getProposal(id: string) {
  const proposal = await db.proposal.findUnique({
    where: { id },
    include: {
      creator: true,
      votes: {
        include: {
          user: true,
        },
      },
    },
  });

  return proposal;
}

export default async function ProposalPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const proposal = await getProposal(id);

  if (!proposal) {
    notFound();
  }

  const voteCount = proposal.votes.length;
  const supportCount = proposal.votes.filter((v) => v.support).length;
  const supportPercentage =
    voteCount > 0 ? Math.round((supportCount / voteCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 导航链接 */}
        <div className="mb-6">
          <BackLink href="/proposals">返回提案列表</BackLink>
        </div>

        {/* 提案内容卡片 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* 提案头部 */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    proposal.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : proposal.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {proposal.status === "ACTIVE"
                    ? "进行中"
                    : proposal.status === "PENDING"
                    ? "待审核"
                    : "已结束"}
                </span>
                <div className="flex gap-2">
                  {proposal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {proposal.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width={12}
                    height={12}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  提案人：{proposal.creator.walletAddress.slice(0, 6)}...
                  {proposal.creator.walletAddress.slice(-4)}
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width={12}
                    height={12}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  提交时间：{formatDate(proposal.createdAt)}
                </span>
              </div>
            </div>

            {/* 提案摘要 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                提案摘要
              </h2>
              <p className="text-gray-600">
                {proposal.summary || proposal.content.slice(0, 200) + "..."}
              </p>{" "}
            </div>

            {/* 提案正文 */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                提案详情
              </h2>
              <div className="whitespace-pre-wrap text-gray-600">
                {proposal.content}
              </div>
            </div>

            {/* 原始内容 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                原始诉求
              </h2>
              <p className="text-gray-600">{proposal.rawContent}</p>
            </div>

            {/* 投票统计 */}
            <div className="border-t pt-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  投票统计
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {voteCount}
                    </div>
                    <div className="text-sm text-gray-500">总票数</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {supportCount}
                    </div>
                    <div className="text-sm text-green-600">支持票数</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {voteCount - supportCount}
                    </div>
                    <div className="text-sm text-red-600">反对票数</div>
                  </div>
                </div>
              </div>

              {/* 投票进度条 */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>支持率</span>
                  <span>{supportPercentage}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${supportPercentage}%` }}
                  />
                </div>
              </div>

              {/* 投票按钮 */}
              {proposal.status === "ACTIVE" && (
                <div className="flex justify-center">
                  <VoteButtons proposalId={proposal.id} />
                </div>
              )}
            </div>

            {/* 投票记录 */}
            {voteCount > 0 && (
              <div className="border-t pt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  最近投票
                </h2>
                <div className="space-y-4">
                  {proposal.votes.slice(0, 5).map((vote) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {vote.user.walletAddress.slice(0, 6)}...
                          {vote.user.walletAddress.slice(-4)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(vote.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          vote.support
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vote.support ? "支持" : "反对"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 区块链信息 */}
            {proposal.txHash && (
              <div className="border-t pt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  链上记录
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">交易哈希</span>
                    <a
                      href={`https://explorer.nervos.org/transaction/${proposal.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {proposal.txHash.slice(0, 10)}...
                      {proposal.txHash.slice(-8)}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
