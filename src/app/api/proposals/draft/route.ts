import { generateProposal } from "@/lib/ai/proposalGenerator";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    // 生成提案内容
    const generated = await generateProposal(content);

    // 保存到数据库
    const savedProposal = await db.proposal.create({
      data: {
        ...generated,
        rawContent: content,
        creatorId: session.user.id,
        status: "DRAFT",
      },
    });

    return NextResponse.json({
      success: true,
      generated: savedProposal,
    });
  } catch (error) {
    console.error("Failed to generate proposal:", error);
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
