import WalletInfo from "@/components/layout/WalletInfo";
import ProposalHeader from "@/components/proposals/ProposalHeader";
import Providers from "@/components/providers/Providers";

export const metadata = {
  title: "公民提案平台",
  description: "让每个声音都被听见，让每个建议都有价值",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <Providers>
          <WalletInfo />
          <ProposalHeader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
