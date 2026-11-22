"use server";

import { sendTestEmail, type EmailTemplateType } from "@/lib/email";

export interface SendTestEmailResult {
  success: boolean;
  message: string;
  messageId?: string;
}

export async function sendTestEmailAction(
  recipientEmail: string,
  templateType: EmailTemplateType = "inquiry-notification"
): Promise<SendTestEmailResult> {
  try {
    if (!recipientEmail || !recipientEmail.trim() || !recipientEmail.includes("@")) {
      return {
        success: false,
        message: "Please provide a valid recipient email address.",
      };
    }

    const result = await sendTestEmail(recipientEmail.trim(), templateType);

    return {
      success: true,
      message: `Test email successfully dispatched to ${recipientEmail.trim()}!`,
      messageId: result.messageId,
    };
  } catch (err: unknown) {
    console.error("sendTestEmailAction error:", err);
    const msg =
      err instanceof Error
        ? err.message
        : "Failed to transmit test email. Please ensure EMAIL_USER and EMAIL_PASS are set in .env.";
    return {
      success: false,
      message: msg,
    };
  }
}
