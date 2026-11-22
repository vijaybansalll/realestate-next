import { siteConfig } from "@/config/site";
import type { EmailRenderOptions } from "./types";

export interface BaseLayoutProps {
  title: string;
  previewText?: string;
  badgeText?: string;
  badgeVariant?: "gold" | "neutral" | "dark";
  bannerImageUrl?: string;
  contentHtml: string;
  options?: EmailRenderOptions;
}

export function renderEmailBaseLayout({
  title,
  previewText,
  badgeText,
  badgeVariant = "gold",
  bannerImageUrl,
  contentHtml,
  options = {},
}: BaseLayoutProps): string {
  const isDark = options.theme === "dark";
  const isWebPreview = Boolean(options.isWebPreview);
  const showBanner = options.showBanner !== false;

  // Logo source determination:
  // For web preview, use direct public asset path.
  // For actual email sending, use the CID attachment "cid:brand-logo"
  const defaultLogoFile = isDark ? "/logo-dark-email.png" : "/logo-email.png";
  const logoSrc = options.customLogoUrl
    ? options.customLogoUrl
    : isWebPreview
    ? defaultLogoFile
    : "cid:brand-logo";

  // Banner source determination:
  // Can use customBannerUrl from options, or bannerImageUrl from payload, or default to email-banner.jpg
  const defaultBannerFile = "/email-banner.jpg";
  const effectiveBannerUrl = options.customBannerUrl || bannerImageUrl;
  const bannerSrc = effectiveBannerUrl
    ? effectiveBannerUrl
    : isWebPreview
    ? defaultBannerFile
    : "cid:header-banner";

  const currentYear = new Date().getFullYear();

  // Color tokens
  const colors = isDark
    ? {
        pageBg: "#0c0a09",
        cardBg: "#171513",
        cardBorder: "#292524",
        textPrimary: "#f5f5f4",
        textSecondary: "#a8a29e",
        textMuted: "#78716c",
        divider: "#292524",
        innerBoxBg: "#1f1c19",
        innerBoxBorder: "#342f2b",
        goldPrimary: "#d4a359",
        goldBadgeBg: "rgba(212, 163, 89, 0.12)",
        goldBadgeBorder: "rgba(212, 163, 89, 0.3)",
        goldBadgeText: "#e5b86e",
        buttonBg: "#f5f5f4",
        buttonText: "#0c0a09",
        footerBg: "#12100e",
      }
    : {
        pageBg: "#f7f7f5",
        cardBg: "#ffffff",
        cardBorder: "#e8e8e5",
        textPrimary: "#18181b",
        textSecondary: "#52525b",
        textMuted: "#71717a",
        divider: "#ebebe8",
        innerBoxBg: "#fafaf8",
        innerBoxBorder: "#eaeae6",
        goldPrimary: "#b38343",
        goldBadgeBg: "#fbf6ec",
        goldBadgeBorder: "#edd9b3",
        goldBadgeText: "#8c6527",
        buttonBg: "#18181b",
        buttonText: "#ffffff",
        footerBg: "#fafaf8",
      };

  const badgeHtml = badgeText
    ? `
      <tr>
        <td align="center" style="padding: 0 0 16px 0;">
          <span class="badge" style="display: inline-block; background-color: ${colors.goldBadgeBg}; border: 1px solid ${colors.goldBadgeBorder}; color: ${colors.goldBadgeText}; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 9999px;">
            ${badgeText}
          </span>
        </td>
      </tr>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  ${
    previewText
      ? `<!--[if !mso]><!-->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-width: 0px; opacity: 0;">
    ${previewText}
    ${"&nbsp;&zwnj;".repeat(20)}
  </div>
  <!--<![endif]-->`
      : ""
  }
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
      border-collapse: collapse !important;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    a {
      text-decoration: none;
    }
    /* Mobile Responsive */
    @media only screen and (max-width: 620px) {
      .container-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .mobile-header-padding {
        padding: 24px 20px 18px 20px !important;
      }
      .mobile-body-padding {
        padding: 24px 20px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .mobile-full-width {
        width: 100% !important;
        display: block !important;
      }
      .mobile-btn {
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .banner-image {
        height: 160px !important;
      }
    }
    /* Dark Mode Media Query for supported email clients */
    @media (prefers-color-scheme: dark) {
      body, .email-canvas {
        background-color: #0c0a09 !important;
      }
      .email-card {
        background-color: #171513 !important;
        border-color: #292524 !important;
      }
      .text-title {
        color: #f5f5f4 !important;
      }
      .text-secondary {
        color: #a8a29e !important;
      }
      .text-muted {
        color: #78716c !important;
      }
      .inner-box {
        background-color: #1f1c19 !important;
        border-color: #342f2b !important;
      }
      .divider-line {
        border-color: #292524 !important;
      }
      .footer-section {
        background-color: #12100e !important;
        border-color: #292524 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.pageBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Outer Wrapper Table -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-canvas" style="background-color: ${colors.pageBg}; min-height: 100%;">
    <tr>
      <td align="center" style="padding: 36px 16px 48px 16px;">
        <!-- Container 600px Max -->
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="container-table email-card" style="max-width: 600px; background-color: ${colors.cardBg}; border: 1px solid ${colors.cardBorder}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);">
          
          ${
            showBanner
              ? `
          <!-- Top Real Estate House Banner -->
          <tr>
            <td style="padding: 0; line-height: 0; font-size: 0; border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; background-color: #262320;">
              <a href="${siteConfig.url}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none;">
                <img
                  src="${bannerSrc}"
                  alt="${siteConfig.name} Architectural Estate"
                  width="600"
                  height="220"
                  class="mobile-full-width banner-image"
                  style="display: block; width: 100%; max-width: 600px; height: 220px; object-fit: cover; border: 0; outline: none; border-top-left-radius: 12px; border-top-right-radius: 12px;"
                />
              </a>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Accent Gold Hairline Divider -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #b38343 0%, #e5c378 50%, #b38343 100%); line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>

          <!-- Header with Logo -->
          <tr>
            <td align="center" class="mobile-header-padding" style="padding: 28px 40px 22px 40px; border-bottom: 1px solid ${colors.divider};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${siteConfig.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
                      <img src="${logoSrc}" alt="${siteConfig.name}" width="150" height="auto" style="display: block; max-width: 150px; width: 150px; height: auto; border: 0; outline: none; margin: 0 auto;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 10px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: ${colors.goldPrimary}; display: inline-block;">
                      Private Client Advisory
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td class="mobile-body-padding" style="padding: 36px 40px 32px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${badgeHtml}
                <tr>
                  <td>
                    ${contentHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td class="footer-section mobile-padding" style="background-color: ${colors.footerBg}; padding: 28px 40px; border-top: 1px solid ${colors.divider}; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="font-size: 12px; line-height: 1.6; color: ${colors.textMuted};">
                    <strong style="color: ${colors.textSecondary}; font-weight: 600;">${siteConfig.name} Private Advisory Concierge</strong><br>
                    ${siteConfig.contact.address} &bull; <a href="tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}" style="color: ${colors.textMuted}; text-decoration: none;">${siteConfig.contact.phone}</a> &bull; <a href="mailto:${siteConfig.contact.email}" style="color: ${colors.textMuted}; text-decoration: none;">${siteConfig.contact.email}</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px; font-size: 11px; line-height: 1.5; color: ${colors.textMuted}; opacity: 0.85;">
                    This communication is intended strictly for the intended recipient. All estate valuations and consultation notes are treated with absolute discretion.<br>
                    &copy; ${currentYear} ${siteConfig.name}. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}
