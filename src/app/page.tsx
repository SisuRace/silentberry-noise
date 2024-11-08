import Link from "next/link";
import { db } from "@/lib/prisma";

async function getRecentProposals() {
  const proposals = await db.proposal.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      creator: true,
      votes: true,
    },
  });

  return proposals || [];
}

export default async function Home() {
  const recentProposals = await getRecentProposals();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold mb-6">公民提案平台</h1>
          <p className="text-xl mb-8">让每个声音都被听见，让每个建议都有价值</p>
          <Link
            href="/proposals/create"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50"
          >
            提交提案
          </Link>
        </div>
      </div>

      {/* Recent Proposals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">最新提案</h2>
          <Link href="/proposals" className="text-blue-600 hover:text-blue-800">
            查看全部 →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recentProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{proposal.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {proposal.summary}
                </p>
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  了解更多 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">去中心化</h3>
              <p className="text-gray-600">
                基于区块链技术，确保提案的公开透明
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">AI 辅助</h3>
              <p className="text-gray-600">智能分析和优化您的提案内容</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">社区共治</h3>
              <p className="text-gray-600">让每个社区成员都能参与决策</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
