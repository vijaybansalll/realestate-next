import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Compass, Sparkles } from "lucide-react";
import { ContactSection } from "@/components/contact";
import { SectionHeader } from "@/components/common";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact Us | Private Concierge & Advisory | ${siteConfig.name}`,
  description:
    "Connect with the Villa Lumina private advisory team. Inquire about bespoke acquisitions, private architectural viewings, and off-market residences.",
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description:
      "Connect with the Villa Lumina private advisory team. Inquire about bespoke acquisitions, private architectural viewings, and off-market residences.",
    url: `${siteConfig.url}/contact-us`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact Us | ${siteConfig.name}`,
    description:
      "Connect with the Villa Lumina private advisory team. Inquire about bespoke acquisitions, private architectural viewings, and off-market residences.",
  },
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-24 pb-20 text-neutral-900 transition-colors duration-200 selection:bg-amber-500 selection:text-neutral-950 sm:pt-28 md:pt-32 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mx-auto mb-8 max-w-4xl">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Page Header */}
        <SectionHeader
          align="center"
          badge="Private Advisory & Concierge"
          badgeIcon={<Sparkles className="size-3.5" />}
          title="Connect With Our Studio"
          titleAs="h1"
          size="xl"
          description="Whether seeking private acquisition details, scheduling an architectural walkthrough, or commissioning a bespoke retreat, our concierge associates provide dedicated representation."
          className="mx-auto mb-10 max-w-3xl sm:mb-14"
        />

        {/* ContactSection Component */}
        <div className="mx-auto max-w-4xl">
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
