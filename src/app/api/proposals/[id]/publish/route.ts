import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { txHash, clusterId } = await request.json();
    const session = await auth();

    const updatedProposal = await db.proposal.update({
      where: { id: params.id, creatorId: session?.user.id },
      data: {
        txHash,
        clusterId,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error("提案确认失败:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}
