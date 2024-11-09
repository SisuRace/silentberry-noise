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
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 flex items-center gap-2"
            >
              <img
                src="/logo.svg"
                alt="Silentberry Noise"
                className="h-12 w-auto"
              />{" "}
              <label className="text-3xl h-10 py-1 text-gray-900 font-sans font-normal    items-baseline">
                Noise
              </label>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <WalletInfo />
            {isAuthenticated && signer && (
              <Link
                href="/proposals/my"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                My Proposals
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
