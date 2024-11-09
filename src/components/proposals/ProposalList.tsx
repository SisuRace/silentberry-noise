import { Key } from "react";
import EmptyState from "./EmptyState";
import ProposalCard from "./ProposalCard";

interface ProposalListProps {
  proposals: {
    id: Key | null | undefined;
    title: string;
    summary: string;
    tags: string[];
    status: string;
    creator: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      walletAddress: string;
    };
    votes: {
      id: string;
      txHash: string | null;
      clusterId: string | null;
      createdAt: Date;
      support: boolean;
      dobId: string | null;
      proposalId: string;
      userId: string;
    }[];
  }[];
}

export default function ProposalList({ proposals }: ProposalListProps) {
  if (proposals.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  );
}
