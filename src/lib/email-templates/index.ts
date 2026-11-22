import type { ContactEmailPayload, EmailRenderOptions, RenderedEmail } from "./types";
import { renderInquiryNotificationEmail } from "./inquiry-notification";
import { renderClientConfirmationEmail } from "./client-confirmation";
import { renderViewingRequestEmail } from "./viewing-request";

export * from "./types";
export * from "./base-layout";
export * from "./inquiry-notification";
export * from "./client-confirmation";
export * from "./viewing-request";

export type EmailTemplateType =
  | "inquiry-notification"
  | "client-confirmation"
  | "viewing-request";

/**
 * Pure template renderer (safe for both client-side preview and server-side SMTP)
 */
export function renderEmailTemplate(
  templateType: EmailTemplateType,
  payload: ContactEmailPayload,
  options?: EmailRenderOptions
): RenderedEmail {
  switch (templateType) {
    case "client-confirmation":
      return renderClientConfirmationEmail(payload, options);
    case "viewing-request":
      return renderViewingRequestEmail(payload, options);
    case "inquiry-notification":
    default:
      return renderInquiryNotificationEmail(payload, options);
  }
}
