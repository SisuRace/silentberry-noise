import Link from "next/link";
import { db } from "@/lib/prisma";

export const revalidate = 60; // 每分钟重新验证一次

async function getProposals() {
  const proposals = await db.proposal.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      creator: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return proposals;
}

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">活跃提案</h1>
        <Link
          href="/proposals/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          创建提案
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{proposal.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {proposal.summary}
              </p>
              <div className="flex gap-2 mb-4">
                {proposal.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  提案人: {proposal.creator.walletAddress.slice(0, 6)}...
                  {proposal.creator.walletAddress.slice(-4)}
                </span>
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  查看详情 →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
