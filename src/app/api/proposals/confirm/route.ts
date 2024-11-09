import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
// import { submitToCKB } from "@/lib/blockchain/ckbService";

export async function POST(req: Request) {
  try {
    const { proposalId, walletAddress } = await req.json();

    if (!proposalId || !walletAddress) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 获取提案信息
    const proposal = await db.proposal.findUnique({
      where: {
        id: proposalId,
      },
      include: {
        creator: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "提案不存在" }, { status: 404 });
    }

    if (proposal.creator.walletAddress !== walletAddress) {
      return NextResponse.json({ error: "无权操作此提案" }, { status: 403 });
    }

    // 更新提案状态
    const updatedProposal = await db.proposal.update({
      where: {
        id: proposalId,
      },
      data: {
        status: "PENDING",
        // txHash: txHash,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProposal,
    });
  } catch (error) {
    console.error("提案确认失败:", error);
    return NextResponse.json(
      { error: "提案确认失败，请稍后重试" },
      { status: 500 }
    );
  }
}
