import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata: Metadata = {
  title: "Admin Overview | Villa Lumina Real Estate",
  description: "Command Center and overview dashboard for real estate properties.",
};

export default function AdminPage() {
  return <AdminOverview />;
}
