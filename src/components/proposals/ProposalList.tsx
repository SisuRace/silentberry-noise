import ProposalCard from "./ProposalCard";
import EmptyState from "./EmptyState";
import { type Proposal } from "@prisma/client";
import { Key } from "react";

interface ProposalListProps {
  proposals: Proposal &
    {
      id: Key | null | undefined;
      creator: { walletAddress: string };
      votes: { support: boolean }[];
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
