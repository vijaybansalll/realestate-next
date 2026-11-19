import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = {
  title: "Add New Property | Villa Lumina Real Estate Admin",
  description: "Create and publish a new property listing with multiple high-resolution photos and architectural specifications.",
};

export default function NewPropertyPage() {
  return <PropertyForm mode="create" />;
}
