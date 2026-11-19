import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/property-form";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditPropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Property (${id}) | Villa Lumina Real Estate Admin`,
  };
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { id } = await params;
  return <PropertyForm mode="edit" propertyId={id} />;
}
