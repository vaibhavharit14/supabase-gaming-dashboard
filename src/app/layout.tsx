import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Digital Heroes Golf | Performance, Prizes & Charity",
  description: "A subscription-based golf platform combining performance tracking, monthly prize draws, and charitable giving. Join the next generation of golf rewards.",
  keywords: ["golf", "charity", "subscription", "stableford", "prize draw", "rewards"],
  openGraph: {
    title: "Digital Heroes Golf",
    description: "Combine your golf game with a positive social impact.",
  },
};

import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body suppressHydrationWarning className="bg-background text-foreground antialiased min-h-screen">
        <Toaster position="top-right" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

