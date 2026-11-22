import { siteConfig } from "@/config/site";
import { renderEmailBaseLayout } from "./base-layout";
import type { ContactEmailPayload, EmailRenderOptions, RenderedEmail } from "./types";

export function renderViewingRequestEmail(
  payload: ContactEmailPayload,
  options?: EmailRenderOptions
): RenderedEmail {
  const {
    name,
    email,
    phone,
    propertyTitle = "Villa Lumina Estate",
    propertyLocation = "London, United Kingdom",
    propertyPrice = "Price on Application",
    preferredDate = "To Be Confirmed",
    message,
  } = payload;

  const isDark = options?.theme === "dark";
  const firstName = name.trim().split(" ")[0] || "Client";

  const emailSubject = `Private Showing Details: ${propertyTitle} | ${siteConfig.name}`;

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
            Private Showing Request Received
          </h1>
          <p class="text-secondary" style="margin: 6px 0 0 0; font-size: 13px; color: ${textSecondary};">
            Discreet Architectural Walkthrough &amp; Acquisition Briefing
          </p>
        </td>
      </tr>
    </table>

    <!-- Salutation -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
      <tr>
        <td style="font-size: 14px; line-height: 1.7; color: ${textSecondary};">
          Dear <strong style="color: ${textColor}; font-weight: 600;">${firstName}</strong>,
          <br><br>
          We are pleased to receive your private viewing request for <strong style="color: ${textColor};">${propertyTitle}</strong>. Our concierge advisory team is coordinating with the estate steward to prepare your private walkthrough.
        </td>
      </tr>
    </table>

    <!-- Showing Itinerary Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td>
          <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${labelColor}; margin-bottom: 8px;">
            Showing Specification
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="inner-box" style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; width: 140px; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Target Estate
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; font-weight: 600; color: ${textColor};">
                ${propertyTitle}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Location
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${textSecondary};">
                📍 ${propertyLocation}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Valuation
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; font-weight: 600; color: ${goldColor};">
                ${propertyPrice}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Requested Date
              </td>
              <td style="padding: 12px 18px; border-bottom: 1px solid ${dividerColor}; font-size: 14px; font-weight: 600; color: ${textColor};">
                🗓️ ${preferredDate}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 18px; font-size: 13px; color: ${labelColor}; vertical-align: top;">
                Viewing Format
              </td>
              <td style="padding: 12px 18px; font-size: 13px; color: ${textColor};">
                Private In-Person Tour / Interactive 3D Walkthrough
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Arrival & Privacy Information -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 8px; padding: 18px 20px;">
          <div style="font-size: 12px; font-weight: 600; color: ${textColor}; margin-bottom: 8px;">
            What to Expect During Your Private Tour
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; line-height: 1.6; color: ${textSecondary};">
            <tr>
              <td style="padding-bottom: 6px; vertical-align: top; width: 16px; color: ${goldColor}; font-weight: bold;">&bull;</td>
              <td style="padding-bottom: 6px; padding-left: 8px;">
                <strong>Discreet Arrival:</strong> Secure private parking and gate clearance arranged in advance.
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 6px; vertical-align: top; width: 16px; color: ${goldColor}; font-weight: bold;">&bull;</td>
              <td style="padding-bottom: 6px; padding-left: 8px;">
                <strong>Architectural Briefing:</strong> A tailored dossier containing floorplans, engineering specs, and deed particulars.
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; width: 16px; color: ${goldColor}; font-weight: bold;">&bull;</td>
              <td style="padding-left: 8px;">
                <strong>Dedicated Partner:</strong> Unhurried private walkthrough accompanied by an executive advisor.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${
      message
        ? `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
          <tr>
            <td>
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${labelColor}; margin-bottom: 8px;">
                Special Requests
              </div>
              <div class="inner-box" style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 6px; padding: 14px 18px; font-size: 13px; line-height: 1.6; color: ${textSecondary};">
                &ldquo;${message}&rdquo;
              </div>
            </td>
          </tr>
        </table>
        `
        : ""
    }

    <!-- Call to action button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="border-radius: 9999px; background-color: ${btnBg};">
                <a href="${siteConfig.url}/properties" target="_blank" class="mobile-btn" style="display: inline-block; padding: 13px 32px; font-size: 13px; font-weight: 600; letter-spacing: 0.4px; color: ${btnText}; text-decoration: none; border-radius: 9999px;">
                  View Estate Dossier &rarr;
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
    previewText: `Private showing request received for ${propertyTitle} on ${preferredDate}.`,
    badgeText: "Private Showing Request",
    bannerImageUrl: payload.propertyImage,
    contentHtml,
    options,
  });

  const text = `
Dear ${firstName},

We have received your private showing request for ${propertyTitle}.

SHOWING SPECIFICATIONS:
--------------------------------------------------
Estate: ${propertyTitle}
Location: ${propertyLocation}
Valuation: ${propertyPrice}
Requested Date: ${preferredDate}
Client Email: ${email}
${phone ? `Client Phone: ${phone}\n` : ""}
${message ? `Notes: "${message}"\n` : ""}
--------------------------------------------------

Our concierge desk will confirm your scheduled arrival time and gate clearance shortly.
For immediate adjustments, please contact us at ${siteConfig.contact.phone}.

Warm regards,
The Private Advisory Concierge
${siteConfig.name}
`.trim();

  return {
    subject: emailSubject,
    html,
    text,
  };
}
