"use client";

import { useApp } from "@/contexts/WalletContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import WalletInfo from "./WalletInfo";

export default function Navbar() {
  const session = useSession();
  const { signer } = useApp();

  const isAuthenticated = !!session?.data?.user?.walletAddress;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              公民提案平台
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <WalletInfo />
            {isAuthenticated && signer && (
              <Link
                href="/proposals/my"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                我的提案
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
