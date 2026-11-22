import { AppShell } from "@/components/admin";

export const metadata = {
  title: "Admin Command Center | Villa Lumina Real Estate",
  description: "Manage real estate properties and estate listings.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
