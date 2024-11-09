import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export type GeneratedProposal = {
  id?: string; // Adds an optional id field
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
Please convert the following citizen's appeal into a formal proposal format. Please use English and strictly follow the following JSON format output:

Original appeal:
${rawContent}

Please generate a JSON with the following fields:
{
  "title": "A concise proposal title",
  "content": "Complete proposal content, including the following parts:\n1. Background explanation\n2. Problem analysis\n3. Specific recommendations\n4. Expected outcomes",
  "summary": "A summary of the proposal within 100 words",
  "tags": ["related tags, up to 3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional policy analyst, skilled in converting citizen appeals into standardized policy proposals.",
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
      throw new Error("Generated proposal content is empty");
    }
    const result = JSON.parse(
      response.choices[0].message.content
    ) as GeneratedProposal;
    validateProposal(result);
    return result;
  } catch (error) {
    console.error("AI proposal generation failed:", error);
    throw new Error("Proposal generation failed, please try again later");
  }
}

function validateProposal(
  proposal: GeneratedProposal
): asserts proposal is GeneratedProposal {
  const requiredFields = ["title", "content", "summary", "tags"];
  console.log(proposal);

  for (const field of requiredFields) {
    if (!proposal[field as keyof GeneratedProposal]) {
      throw new Error(`Generated proposal lacks necessary field: ${field}`);
    }
  }

  if (typeof proposal.title !== "string" || proposal.title.length < 5) {
    throw new Error("Proposal title format is incorrect");
  }

  if (typeof proposal.content !== "string" || proposal.content.length < 100) {
    throw new Error("Proposal content is too short");
  }

  if (typeof proposal.summary !== "string" || proposal.summary.length > 200) {
    // 英文1个单词 = 1字节
    throw new Error("Proposal summary format is incorrect");
  }

  if (!Array.isArray(proposal.tags) || proposal.tags.length === 0) {
    throw new Error("Proposal tags format is incorrect");
  }
}
