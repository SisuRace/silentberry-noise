"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils/date";
// import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { type Proposal } from "@prisma/client";

interface ProposalCardProps {
  proposal: Proposal & {
    creator: { walletAddress: string };
    votes: { support: boolean }[];
  };
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  // 计算投票统计
  const voteCount = proposal.votes.length;
  const supportCount = proposal.votes.filter((v) => v.support).length;
  const supportPercentage =
    voteCount > 0 ? Math.round((supportCount / voteCount) * 100) : 0;

  // 获取状态标签的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <Link href={`/proposals/${proposal.id}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
              {proposal.title}
            </h2>
            <span
              className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(
                proposal.status
              )}`}
            >
              {proposal.status}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 line-clamp-2">
              {proposal.summary || proposal.content}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    查看交易
                    {/* <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" /> */}
                  </a>
                </>
              )}
            </div>

            {voteCount > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${supportPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {supportPercentage}% 支持
                </span>
                <span className="text-sm text-gray-500">({voteCount} 票)</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
