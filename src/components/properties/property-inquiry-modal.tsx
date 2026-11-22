"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { submitContactInquiry } from "@/app/actions/inquiries";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PropertyInquiryModalProps {
  property: Property | null;
  onClose: () => void;
}

export function PropertyInquiryModal({
  property,
  onClose,
}: PropertyInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    if (!formData.name.trim()) {
      toast.error("Please provide your name.");
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
          preferredDate: formData.date.trim(),
          message: formData.notes.trim(),
          propertyTitle: property.title,
          propertyLocation: property.location,
          propertyPrice: property.formattedPrice,
          source: "property-inquiry-modal",
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setSubmitted(true);
        toast.success("Inquiry Transmitted Successfully", {
          description: `Thank you, ${formData.name || "Client"}. Our concierge will contact you regarding ${property.title}.`,
        });
        setTimeout(() => {
          setTimeout(() => {
            setSubmitted(false);
            onClose();
          }, 1800);
        }, 200);
      } else {
        toast.error("Transmission Failed", {
          description: res?.error || "Failed to transmit inquiry.",
        });
      }
    } catch (err: any) {
      toast.error("Transmission Error", {
        description: err?.message || "Failed to submit inquiry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!property) return null;

  return (
    <Sheet open={!!property} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg overflow-y-auto border-l border-neutral-200 bg-white p-6 text-neutral-900 sm:max-w-md dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      >
        <SheetHeader className="mb-5 border-b border-neutral-200/80 p-0 pb-4 dark:border-neutral-800/80">
          <SheetTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Private Estate Inquiry
          </SheetTitle>
        </SheetHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Inquiry Received
            </h3>
            <p className="max-w-xs text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Our private client concierge will contact you within 2 business
              hours to coordinate an exclusive showing of {property.title}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Property Summary Card */}
            <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200 bg-neutral-100/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-950">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {property.title}
                </h4>
                <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                  {property.location}
                </p>
                <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {property.formattedPrice} • {property.bhk} BHK (
                  {property.homeAreaSqM} m²)
                </p>
              </div>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Lord / Lady / Dr. Harrison"
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="harrison@estate-family.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
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
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Special Inquiries or Confidential Requirements
                </label>
                <div className="relative">
                  <MessageSquare className="absolute top-3 left-3 size-4 text-neutral-400 dark:text-neutral-500" />
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Discuss helicopter transfer, spatial staging, or NDA requirements..."
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <span>Send Inquiry</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default PropertyInquiryModal;
