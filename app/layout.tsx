import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CatalogProvider } from "./components/common/CatalogProvider";
import { ChatBotWidget } from "./components/common/ChatBotWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Potent Hygiene",
  description: "Potent Hygiene",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        <CatalogProvider>{children}</CatalogProvider>
        <Toaster position="top-right" richColors />
        <ChatBotWidget />
      </body>
    </html>
  );
}
