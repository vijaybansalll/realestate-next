import { siteConfig } from "@/config/site";
import { renderEmailBaseLayout } from "./base-layout";
import type { ContactEmailPayload, EmailRenderOptions, RenderedEmail } from "./types";

export function renderClientConfirmationEmail(
  payload: ContactEmailPayload,
  options?: EmailRenderOptions
): RenderedEmail {
  const {
    name,
    email,
    phone,
    propertyTitle,
    propertyLocation,
    preferredDate,
    message,
  } = payload;

  const isDark = options?.theme === "dark";

  const firstName = name.trim().split(" ")[0] || "Valued Client";

  const emailSubject = propertyTitle
    ? `Inquiry Confirmation: ${propertyTitle} | ${siteConfig.name}`
    : `Thank You for Inquiring with ${siteConfig.name} Concierge`;

  // Color tokens
  const textColor = isDark ? "#f5f5f4" : "#18181b";
  const textSecondary = isDark ? "#a8a29e" : "#52525b";
  const labelColor = isDark ? "#78716c" : "#71717a";
  const boxBg = isDark ? "#1f1c19" : "#fafaf8";
  const boxBorder = isDark ? "#342f2b" : "#eaeae6";
  const dividerColor = isDark ? "#292524" : "#f0f0ed";
  const goldColor = isDark ? "#d4a359" : "#9a7332";
  const btnBg = isDark ? "#f5f5f4" : "#18181b";
  const btnText = isDark ? "#0c0a09" : "#ffffff";

  const contentHtml = `
    <!-- Header Title -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center">
          <h1 class="text-title" style="margin: 0; font-size: 22px; font-weight: 500; color: ${textColor}; letter-spacing: -0.4px;">
            We Have Received Your Inquiry
          </h1>
          <p class="text-secondary" style="margin: 6px 0 0 0; font-size: 13px; color: ${textSecondary};">
            Reference: Private Client Advisory Desk
          </p>
        </td>
      </tr>
    </table>

    <!-- Personal Salutation -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
      <tr>
        <td style="font-size: 14px; line-height: 1.7; color: ${textSecondary};">
          Dear <strong style="color: ${textColor}; font-weight: 600;">${firstName}</strong>,
          <br><br>
          Thank you for contacting <strong style="color: ${textColor}; font-weight: 600;">${siteConfig.name}</strong>. Your inquiry ${
            propertyTitle
              ? `regarding <strong style="color: ${textColor};">${propertyTitle}</strong>`
              : "regarding our private architectural properties"
          } has been logged and assigned directly to our senior private advisory team.
          <br><br>
          A dedicated advisor is currently reviewing your specifications and will connect with you within <strong style="color: ${textColor};">one business day</strong> to discuss your private consultation or showing arrangements.
        </td>
      </tr>
    </table>

    <!-- Inquiry Record Summary Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td>
          <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${labelColor}; margin-bottom: 8px;">
            Your Inquiry Summary
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="inner-box" style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 8px; overflow: hidden;">
            ${
              propertyTitle
                ? `<tr>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; width: 140px; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                      Target Estate
                    </td>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; font-weight: 600; color: ${textColor};">
                      ${propertyTitle} ${propertyLocation ? `(${propertyLocation})` : ""}
                    </td>
                  </tr>`
                : ""
            }
            ${
              preferredDate
                ? `<tr>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                      Requested Date
                    </td>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; font-weight: 600; color: ${textColor};">
                      🗓️ ${preferredDate}
                    </td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Registered Email
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; color: ${textColor};">
                ${email}
              </td>
            </tr>
            ${
              phone
                ? `<tr>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                      Contact Telephone
                    </td>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; color: ${textColor};">
                      ${phone}
                    </td>
                  </tr>`
                : ""
            }
            ${
              message
                ? `<tr>
                    <td style="padding: 12px 18px; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                      Client Notes
                    </td>
                    <td style="padding: 12px 18px; font-size: 13px; color: ${textSecondary}; line-height: 1.5; font-style: italic;">
                      &ldquo;${message}&rdquo;
                    </td>
                  </tr>`
                : ""
            }
          </table>
        </td>
      </tr>
    </table>

    <!-- Direct Concierge Contact Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
      <tr>
        <td style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 8px; padding: 18px 20px;">
          <div style="font-size: 12px; font-weight: 600; color: ${textColor}; margin-bottom: 4px;">
            Need Immediate Assistance?
          </div>
          <div style="font-size: 13px; color: ${textSecondary}; line-height: 1.6;">
            If your schedule requires immediate priority response, our private concierge desk is available directly at <a href="tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}" style="color: ${goldColor}; font-weight: 600; text-decoration: none;">${siteConfig.contact.phone}</a> or via <a href="mailto:${siteConfig.contact.email}" style="color: ${goldColor}; text-decoration: none;">${siteConfig.contact.email}</a>.
          </div>
        </td>
      </tr>
    </table>

    <!-- Browse Collection CTA -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="border-radius: 9999px; background-color: ${btnBg};">
                <a href="${siteConfig.url}/properties" target="_blank" class="mobile-btn" style="display: inline-block; padding: 13px 32px; font-size: 13px; font-weight: 600; letter-spacing: 0.4px; color: ${btnText}; text-decoration: none; border-radius: 9999px;">
                  Explore The Collection &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const html = renderEmailBaseLayout({
    title: emailSubject,
    previewText: `Thank you for contacting ${siteConfig.name}. We have received your inquiry.`,
    badgeText: "Inquiry Confirmed",
    bannerImageUrl: payload.propertyImage,
    contentHtml,
    options,
  });

  const text = `
Dear ${firstName},

Thank you for contacting ${siteConfig.name}.

We have received your inquiry ${propertyTitle ? `regarding ${propertyTitle}` : "regarding our private architectural collection"}.
A senior private client advisor has been assigned to your request and will reach out to you within one business day.

SUMMARY OF SUBMITTED DETAILS:
--------------------------------------------------
${propertyTitle ? `Estate: ${propertyTitle} (${propertyLocation || ""})\n` : ""}
${preferredDate ? `Requested Showing Date: ${preferredDate}\n` : ""}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ""}
${message ? `Notes: "${message}"\n` : ""}
--------------------------------------------------

DIRECT CONCIERGE ASSISTANCE:
Phone: ${siteConfig.contact.phone}
Email: ${siteConfig.contact.email}
Address: ${siteConfig.contact.address}

Sincerely,
The Private Advisory Concierge
${siteConfig.name}
`.trim();

  return {
    subject: emailSubject,
    html,
    text,
  };
}
