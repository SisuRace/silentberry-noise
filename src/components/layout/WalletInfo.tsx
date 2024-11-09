"use client";

import { useApp } from "@/contexts/WalletContext";
import { ccc } from "@ckb-ccc/connector-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WalletInfo() {
  const { signer, openAction, openSigner } = useApp();
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
    await signOut({ redirect: true, redirectTo: "/" });
    disconnect();
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
            onClick={openSigner}
            className="ml-3 h-7 py-0 text-sm flex items-center text-nowrap whitespace-nowrap rounded-md bg-gray-200 hover:bg-gray-300 "
            style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
          >
            {openAction}
          </button>
          <button
            onClick={handleSignOut}
            className="h-7 text-sm px-4 py-0 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            Sign Out
          </button>
        </div>
      )}
      {!isAuthenticated && signer && (
        <button
          onClick={handleSignIn}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Sign In
        </button>
      )}
      {!signer && (
        <button
          onClick={open}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
