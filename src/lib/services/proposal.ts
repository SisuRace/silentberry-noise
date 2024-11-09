import { prisma } from "@/lib/db";

export async function getMyProposals(address?: string | null) {
  if (!address) return [];

  const proposals = await prisma.proposal.findMany({
    where: {
      authorAddress: address,
    },
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return proposals;
}
