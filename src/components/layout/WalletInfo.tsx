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
    <div className="flex items-center">
      {isAuthenticated && signer && (
        <div>
          <div>
            {" "}
            {ccc.fixedPointToString(
              balance / ccc.fixedPointFrom("1", 6),
              2
            )}{" "}
            CKB
          </div>
          <button onClick={handleSignOut}>{openAction}</button>
        </div>
      )}
      {!isAuthenticated && signer && (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {!signer && <button onClick={open}>Connect Wallet</button>}
    </div>
  );
}
