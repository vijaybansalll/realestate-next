export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  subject?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyPrice?: string;
  propertyImage?: string;
  preferredDate?: string;
  source?: "contact-page" | "property-inquiry-modal" | "property-detail-page";
}

export interface EmailRenderOptions {
  /**
   * If true, renders with relative or direct URLs suitable for web/browser preview
   * rather than CID inline attachments.
   */
  isWebPreview?: boolean;
  /**
   * Custom logo URL to override the default.
   */
  customLogoUrl?: string;
  /**
   * Custom banner image URL to override the default real estate house banner.
   */
  customBannerUrl?: string;
  /**
   * Whether to display the architectural house banner at the top of the email header.
   * Defaults to true.
   */
  showBanner?: boolean;
  /**
   * Preferred color theme: light (default) or dark.
   */
  theme?: "light" | "dark";
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}
