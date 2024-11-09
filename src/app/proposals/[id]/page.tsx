import ProposalContent from "@/components/proposals/ProposalContent";
import BackLink from "@/components/ui/BackLink";
import { db } from "@/lib/prisma";
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

  console.log(proposal);
  return proposal;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProposalPage(props: PageProps) {
  // 正确的方式是解构 props
  const { id } = await props.params;
  const proposal = await getProposal(id);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackLink href="/proposals">Back to Proposals</BackLink>
        </div>
        <ProposalContent proposal={proposal} />
      </div>
    </div>
  );
}
