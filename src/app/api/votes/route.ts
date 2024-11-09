import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const { proposalId, clusterId, txHash, dobId, walletAddress, support } =
      await req.json();

    if (!proposalId || !walletAddress || !clusterId || !txHash || !dobId) {
      console.log(proposalId, clusterId, txHash, dobId, walletAddress, support);
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 记录投票
    const vote = await db.vote.create({
      data: {
        proposalId,
        userId: session?.user.id,
        support,
        txHash,
        clusterId,
        dobId,
      },
      include: {
        proposal: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: vote,
    });
  } catch (error) {
    console.error("Failed to vote:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
