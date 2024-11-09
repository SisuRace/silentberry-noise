"use client";

import Link from "next/link";
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/proposals/${proposal.id}`}>
            <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
              {proposal.title}
            </h2>
          </Link>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(
              proposal.status
            )}`}
          >
            {proposal.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{proposal.summary}</p>

        <div className="flex gap-2 mb-4">
          {proposal.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>提案人:</span>
            <a
              href={`https://pudge.explorer.nervos.org/address/${proposal.creator.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
              onClick={(e) => e.stopPropagation()}
            >
              {proposal.creator.walletAddress.slice(0, 6)}...
              {proposal.creator.walletAddress.slice(-4)}
            </a>
          </div>
          <Link
            href={`/proposals/${proposal.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            查看详情 →
          </Link>
        </div>

        {voteCount > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${supportPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">
                {supportPercentage}% 支持
              </span>
              <span className="text-sm text-gray-500">({voteCount} 票)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
