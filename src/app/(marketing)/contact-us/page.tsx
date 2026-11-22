import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Compass,
  Building,
  Sparkles,
} from "lucide-react";
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

const advisoryHighlights = [
  {
    icon: <ShieldCheck className="size-5 text-amber-500 dark:text-amber-400" />,
    title: "Confidential Advisory",
    description:
      "Every inquiry and transaction is handled under strict non-disclosure protocols and private banking standards.",
  },
  {
    icon: <Compass className="size-5 text-amber-500 dark:text-amber-400" />,
    title: "Curated Estate Tours",
    description:
      "Experience private escorted walkthroughs with our lead architectural associates and property historians.",
  },
  {
    icon: <Clock className="size-5 text-amber-500 dark:text-amber-400" />,
    title: "24-Hour Commitment",
    description:
      "Our concierge team guarantees dedicated response times within one business day for all bespoke requests.",
  },
];

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

        {/* Advisory Highlights & Assurances */}
        <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {advisoryHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-xs transition-colors dark:border-neutral-800/80 dark:bg-neutral-900/40"
              >
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-100/80 dark:border-neutral-700/80 dark:bg-neutral-800/80">
                  {item.icon}
                </div>
                <h3 className="font-heading text-base font-medium text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Office Details */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-neutral-200/80 bg-neutral-100/50 p-6 sm:p-8 dark:border-neutral-800/80 dark:bg-neutral-900/30">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="size-4 text-amber-500 dark:text-amber-400" />
                <h4 className="font-heading text-sm font-semibold tracking-wide text-neutral-900 uppercase dark:text-neutral-100">
                  Villa Lumina Main Gallery & Office
                </h4>
              </div>
              <p className="text-xs text-neutral-600 sm:text-sm dark:text-neutral-400">
                {siteConfig.contact.address}
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
              <div>
                <span className="block font-medium text-neutral-900 dark:text-neutral-200">
                  Gallery Hours
                </span>
                <span>Mon–Fri: 09:00 – 18:00 GMT</span>
              </div>
              <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700" />
              <div>
                <span className="block font-medium text-neutral-900 dark:text-neutral-200">
                  Private Viewings
                </span>
                <span>By Appointment Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
