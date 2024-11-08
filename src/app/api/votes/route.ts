import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { submitVoteToCKB } from "@/lib/blockchain/ckbService";

export async function POST(req: Request) {
  try {
    const { proposalId, walletAddress, support } = await req.json();

    if (!proposalId || !walletAddress) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 获取用户信息
    const profile = await db.profile.findUnique({
      where: { walletAddress },
    });

    if (!profile) {
      return NextResponse.json({ error: "用户未找到" }, { status: 404 });
    }

    // 检查是否已经投票
    const existingVote = await db.vote.findUnique({
      where: {
        proposalId_userId: {
          proposalId,
          userId: profile.id,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "您已经对此提案投过票" },
        { status: 400 }
      );
    }

    // 提交投票到 CKB
    const txHash = await submitVoteToCKB(proposalId, walletAddress, support);

    // 记录投票
    const vote = await db.vote.create({
      data: {
        proposalId,
        userId: profile.id,
        support,
        txHash,
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
    console.error("投票失败:", error);
    return NextResponse.json(
      { error: "投票失败，请稍后重试" },
      { status: 500 }
    );
  }
}
