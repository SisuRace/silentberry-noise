"use client";

import { useApp } from "@/contexts/WalletContext";
import { createProposalVoteDob } from "@/lib/blockchain/ckbService";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VoteButtonsProps {
  proposalId: string;
  clusterId: string;
}

export default function VoteButtons({
  proposalId,
  clusterId,
}: VoteButtonsProps) {
  const router = useRouter();
  const { signer } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleVote = async (support: boolean) => {
    if (!signer) {
      setError("请先连接钱包");
      return;
    }

    const walletAddress = await signer.getInternalAddress();
    try {
      setIsLoading(true);
      setError("");

      const { txHash, id } = await createProposalVoteDob(
        clusterId,
        proposalId,
        signer,
        support
      );

      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId,
          clusterId,
          txHash,
          dobId: id,
          walletAddress,
          support,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "投票失败");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "投票失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <button
          onClick={() => handleVote(true)}
          disabled={isLoading || !signer}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          支持
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isLoading || !signer}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          反对
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
