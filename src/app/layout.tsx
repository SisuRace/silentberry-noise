import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/providers/Providers";
import "./globals.css";

export const metadata = {
  title: "Silentberry Noise",
  description: "Let every voice be heard, let every suggestion have value",
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
