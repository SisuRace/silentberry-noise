"use client";

import { useApp } from "@/contexts/WalletContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProposalHeader() {
  const session = useSession();
  const { signer } = useApp();

  const isAuthenticated = !!session?.data?.user?.walletAddress;

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Proposal List</h1>
      <div className="flex items-center space-x-4">
        {isAuthenticated && signer && (
          <Link
            href="/proposals/my"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            My Proposals
          </Link>
        )}
        <Link
          href="/proposals/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Proposal
        </Link>
      </div>
    </div>
  );
}
