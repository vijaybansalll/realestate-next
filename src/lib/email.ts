import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  subject?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyPrice?: string;
  preferredDate?: string;
  source?: "contact-page" | "property-inquiry-modal" | "property-detail-page";
}

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

export async function sendInquiryEmail(payload: ContactEmailPayload) {
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

  const transporter = getTransporter();

  // Deliver to EMAIL_USER and CONTACT_RECIPIENT_EMAIL
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

  // Compose subject
  let emailSubject = subject;
  if (!emailSubject) {
    if (propertyTitle) {
      emailSubject = `[${siteConfig.name}] Estate Inquiry: ${propertyTitle} - ${name}`;
    } else {
      emailSubject = `[${siteConfig.name}] New Contact Inquiry from ${name}`;
    }
  }

  // Compose HTML content with luxury aesthetic
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0a09; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1c1917; border: 1px solid #292524; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #292524 0%, #1c1917 100%); padding: 32px 36px; border-bottom: 1px solid #44403c;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #f59e0b; font-weight: 700;">Private Advisory Concierge</span>
                    <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 500; color: #fafaf9; letter-spacing: -0.5px;">${siteConfig.name}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner / Source Tag -->
          <tr>
            <td style="padding: 24px 36px 8px 36px;">
              <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 9999px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: #f59e0b;">
                ${
                  source === "property-inquiry-modal"
                    ? "Private Estate Modal Inquiry"
                    : source === "property-detail-page"
                    ? "Property Detail Inquiry"
                    : "Website Contact Form Submission"
                }
              </div>
            </td>
          </tr>

          <!-- Client Details -->
          <tr>
            <td style="padding: 16px 36px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #a8a29e; margin: 0 0 16px 0; border-bottom: 1px solid #292524; padding-bottom: 8px;">Client Information</h2>
              <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; color: #e7e5e4;">
                <tr>
                  <td style="padding: 8px 0; color: #a8a29e; width: 140px;">Full Name:</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #fafaf9;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #a8a29e;">Email Address:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f59e0b; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                ${
                  phone
                    ? `<tr>
                  <td style="padding: 8px 0; color: #a8a29e;">Phone Number:</td>
                  <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #fafaf9; text-decoration: none;">${phone}</a></td>
                </tr>`
                    : ""
                }
                ${
                  preferredDate
                    ? `<tr>
                  <td style="padding: 8px 0; color: #a8a29e;">Preferred Date:</td>
                  <td style="padding: 8px 0; color: #fafaf9;">${preferredDate}</td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Property Information (if applicable) -->
          ${
            propertyTitle
              ? `<tr>
            <td style="padding: 16px 36px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #a8a29e; margin: 0 0 16px 0; border-bottom: 1px solid #292524; padding-bottom: 8px;">Target Estate</h2>
              <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; background-color: #292524; border-radius: 10px; padding: 16px; border: 1px solid #44403c;">
                <tr>
                  <td style="padding: 4px 12px; font-weight: 600; font-size: 16px; color: #fafaf9;">${propertyTitle}</td>
                </tr>
                ${
                  propertyLocation
                    ? `<tr>
                  <td style="padding: 4px 12px; color: #a8a29e; font-size: 13px;">📍 ${propertyLocation}</td>
                </tr>`
                    : ""
                }
                ${
                  propertyPrice
                    ? `<tr>
                  <td style="padding: 4px 12px; color: #f59e0b; font-weight: 600; font-size: 14px;">Valuation: ${propertyPrice}</td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>`
              : ""
          }

          <!-- Message / Notes -->
          ${
            message
              ? `<tr>
            <td style="padding: 16px 36px 32px 36px;">
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #a8a29e; margin: 0 0 12px 0; border-bottom: 1px solid #292524; padding-bottom: 8px;">Message / Confidential Notes</h2>
              <div style="background-color: #292524; border-radius: 10px; padding: 18px; border: 1px solid #44403c; color: #f5f5f4; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </td>
          </tr>`
              : ""
          }

          <!-- Quick Action -->
          <tr>
            <td style="padding: 0 36px 32px 36px;" align="center">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
                emailSubject
              )}" style="display: inline-block; background-color: #f59e0b; color: #0c0a09; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 9999px; text-decoration: none;">Reply Directly to ${name}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #141210; padding: 24px 36px; border-top: 1px solid #292524; text-align: center; color: #78716c; font-size: 12px; line-height: 1.5;">
              This notification was generated automatically by ${siteConfig.name} Advisory System.<br>
              Recipient: <strong style="color: #a8a29e;">${recipientList.join(", ")}</strong> • Sender Auth: <strong style="color: #a8a29e;">${senderUser}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // Compose Plain Text fallback
  const textContent = `
[${siteConfig.name} Concierge Inquiry]
--------------------------------------------------
Source: ${source}
Client Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
${preferredDate ? `Preferred Date: ${preferredDate}` : ""}

${
  propertyTitle
    ? `Target Estate: ${propertyTitle} (${propertyLocation || ""}) - ${
        propertyPrice || ""
      }
`
    : ""
}
${
  message
    ? `Message / Notes:
${message}`
    : ""
}
--------------------------------------------------
Delivered to: ${recipientList.join(", ")}
`.trim();

  // Send the email via Nodemailer
  const info = await transporter.sendMail({
    from: fromAddress,
    to: recipientList,
    replyTo: email,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  });

  return {
    success: true,
    messageId: info.messageId,
    recipients: recipientList,
  };
}
