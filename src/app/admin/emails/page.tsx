import type { Metadata } from "next";
import { EmailPreviewClient } from "@/components/admin/email-preview";

export const metadata: Metadata = {
  title: "Email Templates | Villa Lumina Real Estate Admin",
  description:
    "Preview, customize, and test the luxury minimal responsive email templates with embedded brand identity.",
};

export default function AdminEmailsPage() {
  return <EmailPreviewClient />;
}
