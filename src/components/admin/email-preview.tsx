"use client";

import { useState, useMemo } from "react";
import {
  Mail,
  Send,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Code,
  FileText,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Building,
  Calendar,
  User,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  type EmailTemplateType,
  type ContactEmailPayload,
  renderEmailTemplate,
} from "@/lib/email-templates";
import { sendTestEmailAction } from "@/app/admin/emails/actions";
import { cn } from "@/lib/utils";

const defaultSamplePayload: ContactEmailPayload = {
  name: "Lord Sterling Archer",
  email: "sterling.archer@estates-client.com",
  phone: "+44 20 7946 0912",
  propertyTitle: "Villa Lumina Estate",
  propertyLocation: "London & Countryside, UK",
  propertyPrice: "$14,500,000",
  preferredDate: "Thursday, December 10 at 2:00 PM GMT",
  source: "property-inquiry-modal",
  message:
    "I am inquiring regarding the private acquisition of Villa Lumina. Kindly arrange a private showing for my principal and forward the architectural specifications dossier.",
};

const TEMPLATE_METADATA: Record<
  EmailTemplateType,
  {
    name: string;
    description: string;
    target: "Internal Concierge" | "Client Auto-Reply" | "Client Showing";
    icon: typeof Mail;
  }
> = {
  "inquiry-notification": {
    name: "Advisory Notification",
    description:
      "Dispatched instantly to estate managers & concierge when a new inquiry or private tour is requested.",
    target: "Internal Concierge",
    icon: Mail,
  },
  "client-confirmation": {
    name: "Client Confirmation",
    description:
      "Sent to the prospective buyer/client reassuring them that their inquiry has been received by an advisor.",
    target: "Client Auto-Reply",
    icon: Sparkles,
  },
  "viewing-request": {
    name: "Showing & Tour Schedule",
    description:
      "Dedicated itinerary and preparation details sent when a private showing date is requested.",
    target: "Client Showing",
    icon: Calendar,
  },
};

export function EmailPreviewClient() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateType>("inquiry-notification");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"preview" | "text" | "html">("preview");

  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Editable sample payload
  const [payload, setPayload] = useState<ContactEmailPayload>(defaultSamplePayload);
  const [isEditingData, setIsEditingData] = useState(false);

  // Render the template with isWebPreview: true so images render seamlessly in browser
  const rendered = useMemo(() => {
    return renderEmailTemplate(selectedTemplate, payload, {
      isWebPreview: true,
      showBanner,
      theme,
    });
  }, [selectedTemplate, payload, showBanner, theme]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(rendered.html);
      setIsCopied(true);
      toast.success("Email HTML copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy HTML to clipboard.");
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await sendTestEmailAction(testEmailAddress, selectedTemplate);
      if (res.success) {
        toast.success("Test Email Dispatched!", {
          description: `Delivered to ${testEmailAddress}. Message ID: ${res.messageId || "Sent"}`,
        });
        setTestEmailAddress("");
      } else {
        toast.error("Dispatch Failed", {
          description: res.message,
        });
      }
    } catch (err) {
      toast.error("Dispatch Error", {
        description:
          err instanceof Error ? err.message : "Failed to transmit test email.",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const resetSampleData = () => {
    setPayload(defaultSamplePayload);
    toast.info("Sample data reset to default.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/80 dark:bg-neutral-900/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Email Templates
            </h1>
            <Badge
              variant="outline"
              className="border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400"
            >
              Minimal Luxury &bull; High DPI Logo
            </Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Preview, test, and inspect the responsive luxury email system built for Villa Lumina Concierge.
          </p>
        </div>

        {/* Send Test Email Form */}
        <form
          onSubmit={handleSendTestEmail}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="relative min-w-[240px]">
            <Input
              type="email"
              placeholder="Send test to your email..."
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              className="h-9 pr-8 text-xs"
            />
            <Mail className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isSendingTest || !testEmailAddress}
            className="h-9 gap-1.5 px-3 text-xs"
          >
            {isSendingTest ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                <span>Send Test</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Template Selection Tabs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(TEMPLATE_METADATA) as EmailTemplateType[]).map((key) => {
          const meta = TEMPLATE_METADATA[key];
          const Icon = meta.icon;
          const isSelected = selectedTemplate === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-amber-600/60 bg-amber-500/5 shadow-sm ring-1 ring-amber-500/40 dark:border-amber-500/50 dark:bg-amber-500/10"
                  : "border-neutral-200/80 bg-white hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-neutral-700"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-amber-600 text-white dark:bg-amber-500"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    isSelected
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-neutral-400"
                  )}
                >
                  {meta.target}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {meta.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {meta.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Control Bar & Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200/80 bg-white/80 p-3 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/80">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="h-8 gap-1.5 text-xs"
          >
            <Eye className="size-3.5" />
            <span>Interactive Preview</span>
          </Button>
          <Button
            variant={viewMode === "text" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("text")}
            className="h-8 gap-1.5 text-xs"
          >
            <FileText className="size-3.5" />
            <span>Plain Text</span>
          </Button>
          <Button
            variant={viewMode === "html" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("html")}
            className="h-8 gap-1.5 text-xs"
          >
            <Code className="size-3.5" />
            <span>HTML Source</span>
          </Button>
        </div>

        {/* Right: Device Viewport & Theme Toggles */}
        <div className="flex items-center gap-2">
          {viewMode === "preview" && (
            <>
              {/* Viewport Width */}
              <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  title="Desktop View (640px)"
                  className={cn(
                    "flex items-center gap-1 rounded px-2.5 py-1 text-xs transition-colors",
                    viewport === "desktop"
                      ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  <Monitor className="size-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  title="Mobile View (375px)"
                  className={cn(
                    "flex items-center gap-1 rounded px-2.5 py-1 text-xs transition-colors",
                    viewport === "mobile"
                      ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  <Smartphone className="size-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Theme Canvas Toggle */}
              <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  title="Light Canvas"
                  className={cn(
                    "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
                    theme === "light"
                      ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  <Sun className="size-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  title="Dark Canvas"
                  className={cn(
                    "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
                    theme === "dark"
                      ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  <Moon className="size-3.5" />
                  <span>Dark</span>
                </button>
              </div>

              {/* House Banner Toggle */}
              <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowBanner(!showBanner)}
                  title={showBanner ? "Hide House Banner" : "Show House Banner"}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors",
                    showBanner
                      ? "bg-amber-500/10 font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-400"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  <Building className="size-3.5" />
                  <span>Banner: {showBanner ? "On" : "Off"}</span>
                </button>
              </div>
            </>
          )}

          {/* Edit Mock Data Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingData(!isEditingData)}
            className="h-8 gap-1.5 text-xs"
          >
            <User className="size-3.5" />
            <span>{isEditingData ? "Hide Sample Data" : "Edit Sample Data"}</span>
          </Button>

          {/* Copy HTML Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyHtml}
            className="h-8 gap-1.5 text-xs"
          >
            {isCopied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy HTML</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editable Sample Data Drawer / Panel */}
      {isEditingData && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Customize Sample Payload Values
              </h4>
              <p className="text-xs text-neutral-400">
                Changes update the preview in real-time.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSampleData}
              className="h-7 gap-1 text-xs text-neutral-500"
            >
              <RefreshCw className="size-3" />
              <span>Reset Defaults</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-xs">Client Full Name</Label>
              <Input
                value={payload.name}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Client Email</Label>
              <Input
                value={payload.email}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Client Telephone</Label>
              <Input
                value={payload.phone || ""}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, phone: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Estate / Property Title</Label>
              <Input
                value={payload.propertyTitle || ""}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, propertyTitle: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Estate Valuation / Price</Label>
              <Input
                value={payload.propertyPrice || ""}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, propertyPrice: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Preferred Showing Date</Label>
              <Input
                value={payload.preferredDate || ""}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, preferredDate: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div className="sm:col-span-3">
              <Label className="text-xs">Custom Banner URL (Optional, defaults to architectural villa banner)</Label>
              <Input
                placeholder="https://... or /email-banner.jpg"
                value={payload.propertyImage || ""}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, propertyImage: e.target.value }))
                }
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div className="sm:col-span-3">
              <Label className="text-xs">Client Message / Notes</Label>
              <Textarea
                rows={2}
                value={payload.message || ""}
                onChange={(e) =>
                  setPayload((p) => ({ ...p, message: e.target.value }))
                }
                className="mt-1 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Preview Screen */}
      <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100/80 shadow-inner dark:border-neutral-800/80 dark:bg-neutral-950/80">
        {/* Subject Bar Display */}
        <div className="flex items-center gap-2 border-b border-neutral-200/80 bg-white px-4 py-2.5 text-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <span className="font-semibold text-neutral-400">Subject:</span>
          <span className="font-mono text-neutral-800 dark:text-neutral-200">
            {rendered.subject}
          </span>
        </div>

        {/* View Mode: Interactive Iframe Preview */}
        {viewMode === "preview" && (
          <div
            className={cn(
              "flex min-h-[720px] items-start justify-center p-4 sm:p-8 transition-colors",
              theme === "dark" ? "bg-[#090807]" : "bg-[#f2f2ef]"
            )}
          >
            <div
              className={cn(
                "overflow-hidden rounded-xl transition-all duration-300",
                viewport === "desktop"
                  ? "w-full max-w-[640px] shadow-2xl"
                  : "w-[375px] shadow-2xl ring-8 ring-neutral-800"
              )}
            >
              <iframe
                title="Email Preview"
                srcDoc={rendered.html}
                className="h-[750px] w-full border-0 bg-transparent"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* View Mode: Plain Text Fallback */}
        {viewMode === "text" && (
          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-neutral-500">
              Plain Text Fallback (Used by screen readers, smart watches, and text-only clients):
            </div>
            <pre className="max-h-[600px] overflow-auto rounded-lg border border-neutral-200 bg-white p-5 font-mono text-xs leading-relaxed text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              {rendered.text}
            </pre>
          </div>
        )}

        {/* View Mode: HTML Source Code */}
        {viewMode === "html" && (
          <div className="p-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-neutral-500">
              <span>Inline Styled Responsive HTML:</span>
              <button
                type="button"
                onClick={handleCopyHtml}
                className="text-amber-600 hover:underline dark:text-amber-400"
              >
                Copy Full Markup
              </button>
            </div>
            <pre className="max-h-[600px] overflow-auto rounded-lg border border-neutral-200 bg-neutral-950 p-5 font-mono text-xs leading-relaxed text-emerald-400 dark:border-neutral-800">
              {rendered.html}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
