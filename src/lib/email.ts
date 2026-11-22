import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import {
  type ContactEmailPayload,
  type EmailRenderOptions,
  type RenderedEmail,
  type EmailTemplateType,
  renderEmailTemplate,
  renderInquiryNotificationEmail,
  renderClientConfirmationEmail,
  renderViewingRequestEmail,
} from "./email-templates";

export type {
  ContactEmailPayload,
  EmailRenderOptions,
  RenderedEmail,
  EmailTemplateType,
};
export { renderEmailTemplate };

function getTransporter() {
  const user = process.env.EMAIL_USER?.trim();
  const rawPass = process.env.EMAIL_PASS;
  // Gmail app passwords often contain spaces e.g. "lagv mhxo juke syyd"
  const pass = rawPass ? rawPass.replace(/\s+/g, "").trim() : "";

  if (!user || !pass) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS environment variables are not configured."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Returns the default logo and real estate house banner attachments for CID embedding.
 */
function getEmailAttachments(customBannerUrl?: string) {
  const attachments: Array<{ filename: string; path: string; cid: string }> = [];

  try {
    const logoPath = path.join(process.cwd(), "public", "logo-email.png");
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: "logo.png",
        path: logoPath,
        cid: "brand-logo", // matches <img src="cid:brand-logo" />
      });
    }

    // Attach default real estate house banner as CID attachment if using local default
    if (!customBannerUrl) {
      const bannerPath = path.join(process.cwd(), "public", "email-banner.jpg");
      if (fs.existsSync(bannerPath)) {
        attachments.push({
          filename: "banner.jpg",
          path: bannerPath,
          cid: "header-banner", // matches <img src="cid:header-banner" />
        });
      }
    }
  } catch (err) {
    console.warn("Could not prepare email CID attachments:", err);
  }

  return attachments;
}


export interface SendInquiryOptions {
  /**
   * Whether to send an automatic luxury confirmation email to the client's email address.
   * Defaults to true.
   */
  sendClientConfirmation?: boolean;
  /**
   * Optional custom options for rendering.
   */
  renderOptions?: EmailRenderOptions;
}

/**
 * Sends a client inquiry email to the estate concierge/admin, and optionally
 * sends a confirmation auto-response to the prospective client.
 */
export async function sendInquiryEmail(
  payload: ContactEmailPayload,
  options: SendInquiryOptions = { sendClientConfirmation: true }
) {
  const { name, email } = payload;
  const transporter = getTransporter();

  // Deliver notification to EMAIL_USER and CONTACT_RECIPIENT_EMAIL
  const recipientList = Array.from(
    new Set(
      [
        process.env.EMAIL_USER?.trim(),
        process.env.CONTACT_RECIPIENT_EMAIL?.trim(),
      ].filter((addr): addr is string => Boolean(addr && addr.includes("@")))
    )
  );

  if (recipientList.length === 0) {
    throw new Error("No recipient email configured. Please check EMAIL_USER in .env");
  }

  const senderUser = process.env.EMAIL_USER?.trim();
  const fromAddress = `"${siteConfig.name} Concierge" <${senderUser}>`;

  // Render the primary concierge notification email
  const notificationEmail = renderInquiryNotificationEmail(
    payload,
    options.renderOptions
  );

  // Attach logo and real estate house banner via CID for bulletproof offline/retina display across email clients
  const attachments = getEmailAttachments(
    options.renderOptions?.customBannerUrl || payload.propertyImage
  );

  // 1. Dispatch internal advisory notification
  const info = await transporter.sendMail({
    from: fromAddress,
    to: recipientList,
    replyTo: email,
    subject: notificationEmail.subject,
    text: notificationEmail.text,
    html: notificationEmail.html,
    attachments,
  });

  let clientMessageId: string | undefined;

  // 2. Dispatch client confirmation receipt if enabled and client email looks valid
  if (options.sendClientConfirmation && email && email.includes("@")) {
    try {
      // Pick appropriate template: if preferredDate is specified, send viewing request template
      const clientEmailResult = payload.preferredDate
        ? renderViewingRequestEmail(payload, options.renderOptions)
        : renderClientConfirmationEmail(payload, options.renderOptions);

      const clientInfo = await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: senderUser,
        subject: clientEmailResult.subject,
        text: clientEmailResult.text,
        html: clientEmailResult.html,
        attachments,
      });

      clientMessageId = clientInfo.messageId;
    } catch (clientErr) {
      // Log client dispatch issue without breaking the primary notification
      console.warn("Client confirmation auto-reply could not be sent:", clientErr);
    }
  }

  return {
    success: true,
    messageId: info.messageId,
    clientMessageId,
    recipients: recipientList,
  };
}

/**
 * Sends a test email to a given destination address for validation and testing.
 */
export async function sendTestEmail(
  toEmail: string,
  templateType: EmailTemplateType = "inquiry-notification"
) {
  const transporter = getTransporter();
  const senderUser = process.env.EMAIL_USER?.trim();
  const fromAddress = `"${siteConfig.name} Concierge" <${senderUser}>`;

  const samplePayload: ContactEmailPayload = {
    name: "Lord Sterling Archer",
    email: toEmail,
    phone: "+44 20 7946 0912",
    propertyTitle: "Villa Lumina Estate",
    propertyLocation: "London & Countryside, UK",
    propertyPrice: "$14,500,000",
    preferredDate: "Thursday, December 10 at 2:00 PM GMT",
    source: "property-inquiry-modal",
    message:
      "I am inquiring regarding the private acquisition of Villa Lumina. Kindly arrange a private showing for my principal and forward the architectural specifications dossier.",
  };

  const rendered = renderEmailTemplate(templateType, samplePayload);
  const attachments = getEmailAttachments();

  const info = await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: `[TEST PREVIEW] ${rendered.subject}`,
    text: rendered.text,
    html: rendered.html,
    attachments,
  });

  return {
    success: true,
    messageId: info.messageId,
    recipient: toEmail,
  };
}
