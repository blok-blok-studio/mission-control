import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Control — Cortana ⚡",
  description: "Chase & Cortana's command center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen`}>
        <ConvexClientProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <CommandPalette />
            <main className="flex-1 ml-56 p-8">{children}</main>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
