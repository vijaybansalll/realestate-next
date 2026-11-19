"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PropertyTable } from "@/components/admin/property-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fetchProperties,
  getInitialProperties,
  deleteProperty,
} from "@/lib/supabase";
import type { Property } from "@/types";
import {
  PlusIcon,
  RefreshCwIcon,
  CheckCircle2Icon,
  BuildingIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<Property[]>(() => getInitialProperties());
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveDb, setIsLiveDb] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadProperties = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const res = await fetchProperties();
      setProperties(res.data);
      setIsLiveDb(res.isLiveSupabase);
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(false);
  }, []);

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast("Property listing deleted successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-neutral-900/95 px-4 py-3 text-sm text-emerald-400 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3">
          <CheckCircle2Icon className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <BuildingIcon className="size-6 text-amber-400" />
              Properties Management (CRUD)
            </h1>
            <Badge
              variant="outline"
              className={
                isLiveDb
                  ? "border-emerald-500/30 text-emerald-400 text-xs"
                  : "border-amber-500/30 text-amber-400 text-xs"
              }
            >
              {isLiveDb ? "Supabase Live" : "Local Demo Store"}
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Create new listings on a dedicated page with multiple image uploads, update pricing, edit architectural details, and manage deletions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={() => loadProperties(true)}
            disabled={isLoading}
            className="size-9 border-neutral-800 text-neutral-400 hover:text-neutral-100 cursor-pointer"
            title="Refresh listings"
          >
            <RefreshCwIcon className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Link
            href="/admin/properties/new"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 transition-colors text-xs gap-1.5"
            )}
          >
            <PlusIcon className="size-4 mr-1.5" />
            Add New Property
          </Link>
        </div>
      </div>

      {/* Property Table with Multi-Image preview support */}
      <PropertyTable
        properties={properties}
        onDeleteProperty={handleDeleteProperty}
        isLoading={isLoading}
      />
    </div>
  );
}
