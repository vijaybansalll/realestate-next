"use server";

import { sendInquiryEmail, type ContactEmailPayload } from "@/lib/email";

export type SubmitInquiryResult =
  | { success: true; message: string; messageId?: string }
  | { success: false; error: string };

export async function submitContactInquiry(
  payload: ContactEmailPayload
): Promise<SubmitInquiryResult> {
  try {
    if (!payload.name || !payload.name.trim()) {
      return { success: false, error: "Full name is required." };
    }

    if (!payload.email || !payload.email.trim() || !payload.email.includes("@")) {
      return { success: false, error: "A valid email address is required." };
    }

    const result = await sendInquiryEmail(payload);

    return {
      success: true,
      message: "Your inquiry has been successfully sent to our concierge.",
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error("Failed to send inquiry email:", error);
    return {
      success: false,
      error:
        error?.message ||
        "An unexpected error occurred while transmitting your inquiry. Please try again or reach out to us directly.",
    };
  }
}
