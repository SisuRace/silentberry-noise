"use client";

import { SessionProvider } from "next-auth/react";

import { AppProvider } from "@/contexts/WalletContext";
import { ccc } from "@ckb-ccc/connector-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ccc.Provider
      clientOptions={[
        {
          name: "ckb Testnet",
          client: new ccc.ClientPublicTestnet(),
        },
        {
          name: "ckb Mainnet",
          client: new ccc.ClientPublicMainnet(),
        },
      ]}
    >
      <AppProvider>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SessionProvider>
      </AppProvider>
    </ccc.Provider>
  );
}
