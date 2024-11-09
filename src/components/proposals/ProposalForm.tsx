"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApp } from "@/contexts/WalletContext";
import type { GeneratedProposal } from "@/lib/ai/proposalGenerator";
import { createProposalCluster } from "@/lib/blockchain/ckbService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProposalPreview from "./ProposalPreview";

export default function ProposalForm() {
  const router = useRouter();
  const { signer } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [step, setStep] = useState<"draft" | "preview">("draft");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [generatedProposal, setGeneratedProposal] =
    useState<GeneratedProposal | null>(null);

  if (!mounted) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner className="w-8 h-8 text-blue-600" />
      </div>
    );
  }

  const handleSubmitDraft = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signer) {
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
        body: JSON.stringify({
          content,
          walletAddress: await signer.getInternalAddress(),
        }),
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

  const handlePublish = async () => {
    if (!generatedProposal?.id) {
      setError("提案信息不完整，请重试");
      return;
    }
    if (!signer) {
      setError("请先连接钱包");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const { txHash, id } = await createProposalCluster(
        generatedProposal,
        signer
      );
      console.log(txHash, id);

      // 调用API更新提案状态
      const response = await fetch(
        `/api/proposals/${generatedProposal.id}/publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ txHash: txHash, clusterId: id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "发布失败");
      }

      router.push(`/proposals/${data.id}`);

      // toast.success("提案已成功发布到链上");
    } catch (error) {
      console.error("发布失败:", error);
      //   toast.error("发布失败：" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (edited: GeneratedProposal) => {
    setGeneratedProposal(edited);
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/proposals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...edited,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "更新失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失败");
    } finally {
      setIsLoading(false);
    }
    setStep("preview");
  };

  if (step === "preview" && generatedProposal) {
    return (
      <div className="space-y-6">
        <ProposalPreview
          original={content}
          generated={generatedProposal}
          onConfirm={handlePublish}
          onReject={() => setStep("draft")}
          onEdit={handleEdit}
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
