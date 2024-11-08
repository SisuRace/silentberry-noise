import { getCapacities } from "@/lib/blockchain/balance";
import { BI, commons, config, helpers } from "@ckb-lumos/lumos";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function useWalletAuth() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const { data: session } = useSession();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = useState<BI | null>(null);

  const lock = useMemo(() => {
    if (!address) return;
    return commons.omnilock.createOmnilockScript(
      {
        auth: { flag: "ETHEREUM", content: address ?? "0x" },
      },
      { config: config.predefined.AGGRON4 }
    );
  }, [address]);

  const ckbAddress = useMemo(() => {
    if (!lock) return;
    return helpers.encodeToAddress(lock, { config: config.predefined.AGGRON4 });
  }, [lock]);

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

  const handleConnect = async () => {
    try {
      // wagmi 连接钱包
      connect(
        { connector: metaMask() },
        {
          onSuccess: async () => {
            console.log("address", address);
            await signIn("credentials", {
              walletAddress: address,
              redirect: false,
            });
          },
        }
      );
    } catch (error) {
      console.error("钱包连接失败:", error);
      // 处理错误
    }
  };

  const isAuthenticated = !!session?.user;

  return {
    address,
    lock,
    ckbAddress,
    isAuthenticated,
    balance,
    handleConnect,
    handleDisconnect,
  };
}
