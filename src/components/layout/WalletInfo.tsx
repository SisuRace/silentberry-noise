"use client";

import { useApp } from "@/contexts/WalletContext";
import { ccc } from "@ckb-ccc/connector-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WalletInfo() {
  const { signer, openAction } = useApp();
  const { data: session } = useSession();
  const [balance, setBalance] = useState(ccc.Zero);
  useEffect(() => {
    if (!signer) {
      return;
    }

    signer.getBalance().then((v) => setBalance(v));
  }, [signer]);

  const { open, disconnect } = ccc.useCcc();
  const isAuthenticated = !!session?.user;

  const handleSignIn = async () => {
    if (!isAuthenticated && signer) {
      await signIn("credentials", {
        walletAddress: await signer.getInternalAddress(),
        redirect: false,
      });
    }
  };

  const handleSignOut = async () => {
    disconnect();
    await signOut({ redirect: true, redirectTo: "/" });
  };

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated && signer && (
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              {ccc.fixedPointToString(balance / ccc.fixedPointFrom("1", 6), 2)}
            </span>{" "}
            CKB
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            退出登录
          </button>
        </div>
      )}
      {!isAuthenticated && signer && (
        <button
          onClick={handleSignIn}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          登录
        </button>
      )}
      {!signer && (
        <button
          onClick={open}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          连接钱包
        </button>
      )}
    </div>
  );
}
