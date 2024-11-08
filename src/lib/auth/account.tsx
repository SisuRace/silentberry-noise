"use client";

import { BI, commons, config, helpers } from "@ckb-lumos/lumos";
import { signOut } from "next-auth/react"; // 改用 next-auth/react
import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { getCapacities } from "../blockchain/balance";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = useState<BI | null>(null);

  const ckbAddress = useMemo(() => {
    if (!address) return;

    const lock = commons.omnilock.createOmnilockScript({
      auth: { flag: "ETHEREUM", content: address ?? "0x" },
    });
    return helpers.encodeToAddress(lock, { config: config.predefined.AGGRON4 });
  }, [address]);

  const handleDisconnect = async () => {
    disconnect();
    await signOut({ redirect: true, redirectTo: "/" });
  };

  useEffect(() => {
    if (!ckbAddress) {
      return;
    }
    getCapacities(ckbAddress).then((capacities) => {
      setBalance(capacities.div(10 ** 8));
    });
  }, [ckbAddress]);

  return (
    <div>
      <div>CKB Address: {ckbAddress && <div>{ckbAddress}</div>}</div>
      <div>Balance: {balance && <div>{balance.toNumber() ?? 0}</div>}</div>
      <button onClick={() => handleDisconnect()}>Disconnect</button>
    </div>
  );
}
