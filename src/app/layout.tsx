import type { Metadata } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/shadcn-space/blocks/footer-01/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn(
        "h-full",
        "dark",
        "antialiased",
        instrumentSans.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="flex min-h-full flex-col bg-slate-950 font-sans text-slate-100">
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
