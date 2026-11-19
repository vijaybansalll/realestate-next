import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/layout";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "antialiased",
        instrumentSans.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-screen overflow-x-clip bg-neutral-950 font-sans text-neutral-100">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
