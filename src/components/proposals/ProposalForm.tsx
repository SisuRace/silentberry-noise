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
      setError("Please connect your wallet first");
      return;
    }

    if (!content.trim()) {
      setError("Please enter your request");
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
        throw new Error(
          data.error || "Failed to generate proposal, please try again later"
        );
      }

      setGeneratedProposal(data.generated);
      setStep("preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error, please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedProposal?.id) {
      setError("Incomplete proposal information, please try again");
      return;
    }
    if (!signer) {
      setError("Please connect your wallet first");
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
        throw new Error(data.error || "Failed to publish");
      }

      router.push(`/proposals/${data.id}`);

      // toast.success("提案已成功发布到链上");
    } catch (error) {
      console.error("Publish failed:", error);
      //   toast.error("Publish failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (edited: GeneratedProposal) => {
    setGeneratedProposal(edited);
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`/api/proposals/${edited.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...edited,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
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
          Your Request
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
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            placeholder="Please describe your request in detail..."
            required
            disabled={isLoading}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Please describe your request in detail, this will help us generate a
          better proposal.
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
          {isLoading ? "Generating..." : "Generate Proposal"}
        </button>
      </div>
    </form>
  );
}
