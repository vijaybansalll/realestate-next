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
  testSupabaseConnection,
} from "@/lib/supabase";
import type { Property } from "@/types";
import {
  PlusIcon,
  RefreshCwIcon,
  CheckCircle2Icon,
  BuildingIcon,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<Property[]>(() => getInitialProperties());
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    isConnected: boolean;
    tableExists: boolean;
    isPermissionDenied?: boolean;
    bucketExists: boolean;
    message: string;
    error?: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadProperties = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const [res, status] = await Promise.all([
        fetchProperties(),
        testSupabaseConnection(),
      ]);
      setProperties(res.data);
      setIsLiveDb(res.isLiveSupabase);
      setDbStatus(status);
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

      {/* Supabase Connection Warning Banner */}
      {dbStatus && (!isLiveDb || dbStatus.isPermissionDenied || !dbStatus.tableExists) && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-300">
                  {dbStatus.isPermissionDenied
                    ? "Supabase Permission Denied: Table 'properties' is present, but missing role permissions"
                    : "Supabase Table Missing: Currently running in Local Demo Store mode"}
                </h3>
                <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px]">
                  Local Store Only
                </Badge>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {dbStatus.isPermissionDenied ? (
                  <>
                    The <code className="bg-neutral-900/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">public.properties</code> table exists, but Postgres denied access to the API key role (<code className="text-neutral-400 font-mono">anon</code>, error code 42501). Table privileges (<code className="text-amber-300 font-mono">GRANT ALL</code>) and RLS policy must be granted in SQL Editor.
                  </>
                ) : (
                  <>
                    Table <code className="bg-neutral-900/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">public.properties</code> does not exist in your Supabase project (<code className="text-neutral-400 font-mono">wjxxmqkuhjhurpvyngxq</code>).
                  </>
                )}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                <a
                  href="https://supabase.com/dashboard/project/wjxxmqkuhjhurpvyngxq/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                >
                  Open Supabase SQL Editor <ExternalLink className="size-3" />
                </a>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">
                  Run <strong className="text-neutral-200">supabase/schema.sql</strong> to grant permissions and enable live Supabase CRUD.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Table with Multi-Image preview support */}
      <PropertyTable
        properties={properties}
        onDeleteProperty={handleDeleteProperty}
        isLoading={isLoading}
      />
    </div>
  );
}
