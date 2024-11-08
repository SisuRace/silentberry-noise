"use client";

import { useWalletAuth } from "@/hooks/useWalletAuth";

export default function Navbar() {
  const {
    address,
    ckbAddress,
    balance,
    handleConnect,
    handleDisconnect,
    isAuthenticated,
  } = useWalletAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">{/* Logo 和其他导航链接 */}</div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div>
                <div>ETH Address: {address}</div>
                <div>CKB Address: {ckbAddress}</div>
                <div>Balance: {balance?.toNumber() ?? 0}</div>
                <button onClick={handleDisconnect}>Disconnect</button>
              </div>
            ) : (
              <button onClick={handleConnect}>Connect Wallet</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
