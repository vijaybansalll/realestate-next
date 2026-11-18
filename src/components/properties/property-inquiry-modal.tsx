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
} from "lucide-react";
import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after showing thank you
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }, 200);
  };

  if (!property) return null;

  return (
    <Sheet open={!!property} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-6 text-neutral-100 sm:max-w-md"
      >
        <SheetHeader className="mb-5 border-b border-neutral-800/80 pb-4">
          <SheetTitle className="text-base font-semibold text-neutral-100">
            Private Estate Inquiry
          </SheetTitle>
        </SheetHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-medium text-neutral-100">
              Inquiry Received
            </h3>
            <p className="max-w-xs text-xs leading-relaxed text-neutral-400">
              Our private client concierge will contact you within 2 business
              hours to coordinate an exclusive showing of {property.title}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Property Summary Card */}
            <div className="flex items-center gap-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-950">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-neutral-100">
                  {property.title}
                </h4>
                <p className="truncate text-xs text-neutral-400">
                  {property.location}
                </p>
                <p className="mt-1 text-xs font-semibold text-amber-400">
                  {property.formattedPrice} • {property.bhk} BHK (
                  {property.homeAreaSqM} m²)
                </p>
              </div>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Lord / Lady / Dr. Harrison"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pr-3 pl-9 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="harrison@estate-family.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pr-3 pl-9 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pr-3 pl-9 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-300">
                  Preferred Viewing Date
                </label>
                <div className="relative">
                  <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pr-3 pl-9 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-300">
                  Special Inquiries or Confidential Requirements
                </label>
                <div className="relative">
                  <MessageSquare className="absolute top-3 left-3 size-4 text-neutral-500" />
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Discuss helicopter transfer, spatial staging, or NDA requirements..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pr-3 pl-9 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-neutral-100 py-3 text-xs font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95"
                >
                  Request Private Tour
                </Button>
                <p className="mt-2 text-center text-[10px] text-neutral-500">
                  Strict client confidentiality assured. NDA available on
                  request.
                </p>
              </div>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default PropertyInquiryModal;
