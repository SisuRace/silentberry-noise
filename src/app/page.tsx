"use server";

import { db } from "@/lib/prisma";
import Link from "next/link";

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
      <div
        className="bg-blue-600 text-white flex justify-center items-center relative"
        style={{
          backgroundImage: `url("/hero.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative items-center flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6 text-center">
            From Noise to Power
          </h1>
          <p className="text-xl mb-8 text-center">
            Empowering Every Citizen&apos;s Voice
          </p>
          <div className="flex justify-center">
            <Link
              href="/proposals/create"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 text-center"
            >
              Submit Proposal
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Proposals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Proposals</h2>
          <Link href="/proposals" className="text-blue-600 hover:text-blue-800">
            View All →
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
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                DID Identity and Privacy Protection
              </h3>
              <p className="text-gray-600 text-justify">
                DID Identity and Privacy Protection •Anonymous DID Identifier: A
                DID represents a blockchain address. Each verified user receives
                an anonymous blockchain address as their identity identifier,
                without needing to disclose personal information. This DID can
                be linked to user interactions to accumulate reputation and
                rewards, while ensuring personal information remains unlinked.
                Dynamic DID Updates: With each behavior verification, the DID
                automatically updates its status to reflect the most recent
                verification time. This approach ensures the continuous validity
                of the identity without requiring frequent re-verification,
                while the blockchain record maintains both anonymity and
                authenticity.
              </p>
            </div>
            <div className="text-center bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Simplified Expression
              </h3>
              <p className="text-gray-600 text-justify">
                Using their blockchain identity, citizens can express their
                opinions via brief statements, texts, or videos, covering both
                daily suggestions and deeper social issues. The platform
                encourages easy expression, lowering the threshold for
                participation and making every voice part of social change.
              </p>
            </div>
            <div className="text-center bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                AI-Powered Capture and Initiative Generation
              </h3>
              <p className="text-gray-600 text-justify">
                AI-Powered Capture and Initiative Generation Noise-Based
                Proposal Creation: Using AI, the platform captures public
                opinions on civic matters and organizes them into actionable
                citizen initiatives. This process respects individual expression
                and turns it into constructive social feedback. Dynamic Analysis
                and Merging: AI automatically consolidates similar feedback from
                different sources, creating representative initiatives,
                minimizing manual intervention, and simplifying the refinement
                process.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">About Us</h2>
          <div className="grid gap-8 md:grid-cols-1">
            <div className="text-center bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-justify">
                Silentberry Noise is an innovative platform designed to respect
                individual voices, lower the threshold for citizen initiatives,
                and promote bottom-up governance. The platform captures and
                consolidates citizens&apos; &quot;noise&quot; (such as minor
                complaints or suggestions) into powerful citizen initiatives.
                Silentberry Noise is not just a technology platform but a
                spontaneous governance mechanism that enables everyone to
                participate in public decision-making easily, turning diverse
                voices into a force for social progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
