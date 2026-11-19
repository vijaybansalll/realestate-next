import type { Metadata } from "next";
import { PropertiesCatalog } from "@/components/properties";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Architectural Estates & Residences | ${siteConfig.name}`,
  description:
    "Browse our premier portfolio of coastal retreats, hillside villas, and penthouses available for private acquisition and luxury lease.",
  openGraph: {
    title: `Architectural Estates & Residences | ${siteConfig.name}`,
    description:
      "Explore curated luxury architectural estates, penthouses, and coastal retreats.",
    url: `${siteConfig.url}/properties`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Architectural Estates & Residences | ${siteConfig.name}`,
    description:
      "Explore curated luxury architectural estates, penthouses, and coastal retreats.",
  },
};

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-24 pb-20 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <PropertiesCatalog />
    </main>
  );
}
