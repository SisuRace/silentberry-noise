import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type GeneratedProposal = {
  id?: string; // 添加可选的 id 字段
  title: string;
  content: string;
  summary: string;
  tags: string[];
};

export async function generateProposal(
  rawContent: string
): Promise<GeneratedProposal> {
  try {
    const prompt = `
请将以下公民诉求转换为正式的提案格式。请使用中文回复，并严格按照以下JSON格式输出：

原始诉求：
${rawContent}

请生成一个包含以下字段的JSON：
{
  "title": "简明扼要的提案标题",
  "content": "完整的提案内容，包含以下部分：\n1. 背景说明\n2. 问题分析\n3. 具体建议\n4. 预期效果",
  "summary": "100字以内的提案摘要",
  "tags": ["相关标签，最多3个"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的政策分析师，擅长将公民诉求转化为规范的政策提案。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });
    if (!response.choices[0].message.content) {
      throw new Error("生成的提案内容为空");
    }
    const result = JSON.parse(
      response.choices[0].message.content
    ) as GeneratedProposal;
    validateProposal(result);
    return result;
  } catch (error) {
    console.error("AI 生成提案失败:", error);
    throw new Error("生成提案失败，请稍后重试");
  }
}

function validateProposal(
  proposal: GeneratedProposal
): asserts proposal is GeneratedProposal {
  const requiredFields = ["title", "content", "summary", "tags"];

  for (const field of requiredFields) {
    if (!proposal[field as keyof GeneratedProposal]) {
      throw new Error(`生成的提案缺少必要字段: ${field}`);
    }
  }

  if (typeof proposal.title !== "string" || proposal.title.length < 5) {
    throw new Error("提案标题格式不正确");
  }

  if (typeof proposal.content !== "string" || proposal.content.length < 100) {
    throw new Error("提案内容过短");
  }

  if (typeof proposal.summary !== "string" || proposal.summary.length > 200) {
    throw new Error("提案摘要格式不正确");
  }

  if (!Array.isArray(proposal.tags) || proposal.tags.length === 0) {
    throw new Error("提案标签格式不正确");
  }
}
