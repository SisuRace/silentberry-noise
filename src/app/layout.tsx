import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/providers/Providers";
import "./globals.css";

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
    <html lang="en">
      <body suppressHydrationWarning={true} className="min-h-screen bg-gray-50">
        <Providers>
          <Navbar />
          <main className="pt-6 pb-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
