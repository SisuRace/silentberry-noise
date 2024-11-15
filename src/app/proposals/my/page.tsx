import ProposalList from "@/components/proposals/ProposalList";
import BackLink from "@/components/ui/BackLink";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";

async function getMyProposals(id?: string | null) {
  if (!id) return [];

  const proposals = await db.proposal.findMany({
    where: {
      creatorId: id,
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

export default async function MyProposalsPage() {
  const session = await auth();
  const proposals = await getMyProposals(session?.user?.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackLink href="/proposals">Back to Proposals</BackLink>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
        </div>
        <ProposalList proposals={proposals} />
      </div>
    </div>
  );
}
