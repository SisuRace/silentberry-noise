import { generateProposal } from "@/lib/ai/proposalGenerator";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // 需要安装 uuid 包

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    // 生成提案内容
    const generated = await generateProposal(content);

    // 添加临时 ID
    const proposalWithId = {
      ...generated,
      id: uuidv4(),
    };

    return NextResponse.json({
      success: true,
      generated: proposalWithId,
    });
  } catch (error) {
    console.error("生成提案失败:", error);
    return NextResponse.json(
      { error: "生成提案失败，请稍后重试" },
      { status: 500 }
    );
  }
}
