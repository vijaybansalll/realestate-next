"use client";

import * as React from "react";
import { useState } from "react";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircle2,
  Loader2,
  Send,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import {
  SectionBadge,
  SectionHeading,
  SectionDescription,
} from "@/components/common";

export interface ContactInfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

const defaultContactInfo: ContactInfoItem[] = [
  {
    icon: <MailIcon className="size-4.5 text-amber-500 dark:text-amber-400" />,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: <PhoneIcon className="size-4.5 text-amber-500 dark:text-amber-400" />,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`,
  },
  {
    icon: <MapPinIcon className="size-4.5 text-amber-500 dark:text-amber-400" />,
    label: "Office",
    value: siteConfig.contact.address,
  },
];

export interface ContactSectionProps {
  className?: string;
  title?: string;
  description?: string;
  responseNotice?: string;
  contactItems?: ContactInfoItem[];
}

export function ContactSection({
  className,
  title = "Contact With Us",
  description = "If you have any questions regarding our Services or need help, please fill out the form here.",
  responseNotice = "We do our best to respond within 1 business day.",
  contactItems = defaultContactInfo,
}: ContactSectionProps = {}) {
  return (
    <div
      className={cn(
        "relative mx-auto grid w-full max-w-4xl rounded-2xl border border-neutral-200/90 bg-white/95 shadow-xl md:grid-cols-[1fr_0.75fr] dark:border-neutral-800/90 dark:bg-neutral-900/90 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-sm transition-all duration-200",
        className
      )}
    >
      <div className="col-span-1 flex flex-col justify-between space-y-6 p-8 lg:p-10">
        <div className="space-y-4">
          <SectionBadge variant="pill" pulse>
            Direct Concierge
          </SectionBadge>
          <SectionHeading size="default">
            {title}
          </SectionHeading>
          <SectionDescription size="default" className="max-w-md">
            {description}
          </SectionDescription>
          <SectionDescription size="sm" className="max-w-md opacity-80">
            {responseNotice}
          </SectionDescription>
        </div>

        <div className="grid gap-3 pt-2">
          {contactItems?.map((info) => (
            <ContactInfo key={info.label} {...info} />
          ))}
        </div>
      </div>

      <div className="col-span-1 flex items-center border-t border-neutral-200/80 p-8 sm:p-10 md:border-t-0 md:border-l dark:border-neutral-800/80">
        <ContactForm />
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          source: "contact-page",
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setIsSubmitted(true);
        toast.success("Inquiry Submitted Successfully!", {
          description:
            "Our advisory team has received your message and will respond within 1 business day.",
        });
      } else {
        toast.error("Submission Failed", {
          description: res?.error || "Failed to transmit inquiry.",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.";
      toast.error("Submission Error", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-6 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="font-heading text-xl font-medium text-neutral-900 dark:text-neutral-100">
          Thank You, {formData.fullName.split(" ")[0]}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Your inquiry has been routed to our concierge team. We will be in touch shortly at{" "}
          <span className="font-medium text-neutral-900 dark:text-neutral-200">{formData.email}</span>.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 rounded-full text-xs"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ fullName: "", email: "", phone: "", message: "" });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="full-name">Full name</FieldLabel>
          <Input
            autoComplete="name"
            id="full-name"
            placeholder="John Doe"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="email"
            placeholder="johndoe@example.com"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input
            autoComplete="tel"
            id="phone"
            placeholder="+1 (555) 123-4567"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea
            autoComplete="off"
            id="message"
            placeholder="Tell us about the property or service you are interested in..."
            rows={3}
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
          />
        </Field>
      </FieldGroup>
      <Button
        className="mt-6 w-full cursor-pointer rounded-xl font-medium"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Submit Inquiry</span>
            <Send className="size-4 ml-1.5" />
          </>
        )}
      </Button>
    </form>
  );
}

type ContactInfoProps = React.ComponentProps<"div"> & ContactInfoItem;

function ContactInfo({
  icon,
  label,
  value,
  href,
  className,
  ...props
}: ContactInfoProps) {
  const content = (
    <div
      className={cn(
        "group flex items-center gap-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 transition-all duration-200 hover:border-amber-500/30 hover:bg-neutral-100/80 dark:border-neutral-800/70 dark:bg-neutral-800/40 dark:hover:border-amber-500/30 dark:hover:bg-neutral-800/80",
        className
      )}
      {...props}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200/80 bg-white shadow-xs group-hover:scale-105 transition-transform dark:border-neutral-700/80 dark:bg-neutral-800">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors truncate dark:text-neutral-100 dark:group-hover:text-amber-400">
          {value}
        </p>
      </div>
      {href && (
        <ArrowRight className="size-4 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 mr-1" />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default ContactSection;
