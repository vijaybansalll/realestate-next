"use client";

import { useState } from "react";
import { User, Mail, Phone, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface PropertyDetailInquiryFormProps {
  property: Property;
}

export function PropertyDetailInquiryForm({
  property,
}: PropertyDetailInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          propertyTitle: property.title,
          propertyLocation: property.location,
          propertyPrice: property.formattedPrice,
          propertyImage: property.image || property.images?.[0],
          source: "property-detail-page",
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setSubmitted(true);
        toast.success("Viewing Request Transmitted", {
          description: `Our advisory team will contact you regarding ${property.title}.`,
        });
      } else {
        toast.error("Request Failed", {
          description: res?.error || "Failed to submit viewing request.",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit viewing request.";
      toast.error("Submission Error", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
        <CheckCircle2 className="size-10 text-amber-500 dark:text-amber-400 mb-2" />
        <h4 className="font-heading text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Request Confirmed
        </h4>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          We have forwarded your viewing request for{" "}
          <strong className="text-neutral-900 dark:text-neutral-200">
            {property.title}
          </strong>{" "}
          to our listing partner.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", phone: "", message: "" });
          }}
          className="mt-4 text-xs font-medium text-amber-600 hover:underline dark:text-amber-400 cursor-pointer"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            required
            type="text"
            placeholder="Sir / Lady Harrison"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            required
            type="email"
            placeholder="harrison@estate-family.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Message / Special Requirements
        </label>
        <div className="relative">
          <MessageSquare className="absolute top-3 left-3 size-4 text-neutral-400 dark:text-neutral-500" />
          <textarea
            rows={3}
            placeholder="Preferred tour date, specific questions, or NDA requirements..."
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400 resize-none"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-2 w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <span>Request Showing</span>
        )}
      </Button>
    </form>
  );
}

export default PropertyDetailInquiryForm;
