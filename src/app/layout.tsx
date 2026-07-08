import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { FloatingBackground } from "@/components/shared/FloatingBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vera - Content Planning Assistant",
  description: "Your AI-powered content planning assistant for creators",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased" style={{ margin: 0 }}>
        <FloatingBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
