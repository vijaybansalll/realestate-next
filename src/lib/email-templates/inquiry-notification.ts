import { siteConfig } from "@/config/site";
import { renderEmailBaseLayout } from "./base-layout";
import type { ContactEmailPayload, EmailRenderOptions, RenderedEmail } from "./types";

export function renderInquiryNotificationEmail(
  payload: ContactEmailPayload,
  options?: EmailRenderOptions
): RenderedEmail {
  const {
    name,
    email,
    phone,
    message,
    subject,
    propertyTitle,
    propertyLocation,
    propertyPrice,
    preferredDate,
    source = "contact-page",
  } = payload;

  const isDark = options?.theme === "dark";

  // Dynamic Subject line
  let emailSubject = subject;
  if (!emailSubject) {
    if (preferredDate && propertyTitle) {
      emailSubject = `[${siteConfig.name}] Showing Request: ${propertyTitle} - ${name}`;
    } else if (propertyTitle) {
      emailSubject = `[${siteConfig.name}] Estate Inquiry: ${propertyTitle} - ${name}`;
    } else {
      emailSubject = `[${siteConfig.name}] New Client Inquiry - ${name}`;
    }
  }

  // Determine Badge Label
  const badgeText =
    source === "property-inquiry-modal"
      ? "Private Showing Request"
      : source === "property-detail-page"
      ? "Estate Listing Inquiry"
      : "General Contact Inquiry";

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

  // Format date received
  const dateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const propertyCardHtml = propertyTitle
    ? `
      <!-- Target Estate Card -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
        <tr>
          <td>
            <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${labelColor}; margin-bottom: 8px;">
              Estate of Interest
            </div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="inner-box" style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 8px; padding: 18px 20px;">
              <tr>
                <td>
                  <div style="font-size: 16px; font-weight: 600; color: ${textColor}; letter-spacing: -0.2px;">
                    ${propertyTitle}
                  </div>
                  ${
                    propertyLocation
                      ? `<div style="font-size: 13px; color: ${textSecondary}; margin-top: 4px;">
                          📍 ${propertyLocation}
                        </div>`
                      : ""
                  }
                  ${
                    propertyPrice
                      ? `<div style="font-size: 13px; font-weight: 600; color: ${goldColor}; margin-top: 6px;">
                          Valuation: ${propertyPrice}
                        </div>`
                      : ""
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    : "";

  const contentHtml = `
    <!-- Header Title -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td align="center">
          <h1 class="text-title" style="margin: 0; font-size: 22px; font-weight: 500; color: ${textColor}; letter-spacing: -0.4px;">
            ${preferredDate ? "Private Showing Request" : "New Client Inquiry"}
          </h1>
          <p class="text-secondary" style="margin: 6px 0 0 0; font-size: 13px; color: ${textSecondary};">
            Received on ${dateFormatted} via ${
              source === "property-inquiry-modal"
                ? "Estate Viewing Modal"
                : source === "property-detail-page"
                ? "Property Details Page"
                : "Website Contact Form"
            }
          </p>
        </td>
      </tr>
    </table>

    ${propertyCardHtml}

    <!-- Client Details Table -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
      <tr>
        <td>
          <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${labelColor}; margin-bottom: 8px;">
            Client Credentials
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="inner-box" style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; width: 140px; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Full Name
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; font-weight: 600; color: ${textColor};">
                ${name}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Email Address
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; color: ${textColor};">
                <a href="mailto:${email}" style="color: ${goldColor}; text-decoration: none; font-weight: 500;">${email}</a>
              </td>
            </tr>
            ${
              phone
                ? `<tr>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                      Phone Number
                    </td>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; color: ${textColor};">
                      <a href="tel:${phone.replace(/[^+\d]/g, "")}" style="color: ${textColor}; text-decoration: none; font-weight: 500;">${phone}</a>
                    </td>
                  </tr>`
                : ""
            }
            ${
              preferredDate
                ? `<tr>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                      Preferred Date
                    </td>
                    <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; font-weight: 600; color: ${textColor};">
                      🗓️ ${preferredDate}
                    </td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 18px; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Submission Channel
              </td>
              <td style="padding: 12px 18px; font-size: 13px; color: ${textSecondary};">
                ${source}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Client Message / Notes -->
    ${
      message
        ? `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
          <tr>
            <td>
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${labelColor}; margin-bottom: 8px;">
                Client Request / Specifications
              </div>
              <div class="inner-box" style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-left: 3px solid ${goldColor}; border-radius: 6px; padding: 18px 20px; font-size: 14px; line-height: 1.65; color: ${textColor}; white-space: pre-wrap;">
                ${message}
              </div>
            </td>
          </tr>
        </table>
        `
        : ""
    }

    <!-- Primary Action Button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 8px;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="border-radius: 9999px; background-color: ${btnBg};">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
                  emailSubject
                )}" target="_blank" class="mobile-btn" style="display: inline-block; padding: 13px 32px; font-size: 13px; font-weight: 600; letter-spacing: 0.4px; color: ${btnText}; text-decoration: none; border-radius: 9999px;">
                  Reply Directly to ${name} &rarr;
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
    previewText: `New client inquiry from ${name}${propertyTitle ? ` regarding ${propertyTitle}` : ""}.`,
    badgeText,
    bannerImageUrl: payload.propertyImage,
    contentHtml,
    options,
  });

  const text = `
[${siteConfig.name} Private Client Advisory]
${badgeText.toUpperCase()}
==================================================

New inquiry received from: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
${preferredDate ? `Preferred Showing Date: ${preferredDate}` : ""}
${propertyTitle ? `Estate of Interest: ${propertyTitle} (${propertyLocation || ""}) - ${propertyPrice || ""}` : ""}
Channel: ${source}

${message ? `Message / Specifications:\n"${message}"\n` : ""}
==================================================
Reply via email: ${email}
${siteConfig.name} Concierge Management System
`.trim();

  return {
    subject: emailSubject,
    html,
    text,
  };
}
