"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ProposalPreview from "./ProposalPreview";
import type { GeneratedProposal } from "@/lib/ai/proposalGenerator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProposalForm() {
  const router = useRouter();
  const { address } = useAccount();

  const [step, setStep] = useState<"draft" | "preview">("draft");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [generatedProposal, setGeneratedProposal] =
    useState<GeneratedProposal | null>(null);

  const handleSubmitDraft = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setError("请先连接钱包");
      return;
    }

    if (!content.trim()) {
      setError("请输入诉求内容");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/proposals/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, walletAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "提案生成失败，请稍后重试");
      }

      setGeneratedProposal(data.generated);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!generatedProposal?.id) {
      setError("提案信息不完整，请重试");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/proposals/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: generatedProposal.id,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "确认失败");
      }

      router.push(`/proposals/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "确认失败");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "preview" && generatedProposal) {
    return (
      <div className="space-y-6">
        <ProposalPreview
          original={content}
          generated={generatedProposal}
          onConfirm={handleConfirm}
          onReject={() => setStep("draft")}
          onEdit={(edited) => setGeneratedProposal(edited)}
          isLoading={isLoading}
        />
        {error && (
          <p className="text-sm text-red-600 text-center rounded-md bg-red-50 p-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitDraft} className="space-y-6">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          您的诉求
        </label>
        <div className="mt-1">
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="请详细描述您的诉求..."
            required
            disabled={isLoading}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          请尽可能详细地描述您的诉求，这将帮助我们生成更好的提案。
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 gap-2"
        >
          {isLoading && <LoadingSpinner className="w-4 h-4" />}
          {isLoading ? "生成中..." : "生成提案"}
        </button>
      </div>
    </form>
  );
}
