import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<div className="h-16 sm:h-20" />}>
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}