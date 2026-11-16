import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Villa Lumina | Luxury Real Estate Experience",
  description:
    "Explore Villa Lumina with an interactive 60FPS scroll-driven architectural walkthrough.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-950 font-sans text-slate-100">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
