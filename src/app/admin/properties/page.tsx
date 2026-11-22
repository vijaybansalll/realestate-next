"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropertyTable } from "@/components/admin/property-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  fetchProperties,
  getInitialProperties,
  deleteProperty,
  subscribeToProperties,
  testSupabaseConnection,
} from "@/lib/supabase";
import type { Property } from "@/types";
import {
  PlusIcon,
  RefreshCwIcon,
  BuildingIcon,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/common";

export default function PropertiesAdminPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(() =>
    getInitialProperties()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    isConnected: boolean;
    tableExists: boolean;
    isPermissionDenied?: boolean;
    bucketExists: boolean;
    message: string;
    error?: string;
  } | null>(null);

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
      if (showSpinner) {
        toast.success("Database Refreshed", {
          description: `Loaded ${res.data.length} listing${res.data.length === 1 ? "" : "s"} from Supabase.`,
        });
      }
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      const [res, status] = await Promise.all([
        fetchProperties(),
        testSupabaseConnection(),
      ]);
      if (isMounted) {
        setProperties(res.data);
        setIsLiveDb(res.isLiveSupabase);
        setDbStatus(status);
      }
    }
    init();

    const unsubscribe = subscribeToProperties((updatedList) => {
      if (isMounted) {
        setProperties(updatedList);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
    router.refresh();
    toast.success("Property Deleted", {
      description: "Listing removed from the database successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-3.5 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <div>
          <Heading as="h1" size="md" className="flex items-center gap-2">
            <BuildingIcon className="size-5 sm:size-6 text-amber-500 dark:text-amber-400" />
            Properties Management
          </Heading>
          <Text variant="muted" size="xs" className="mt-1">
            Create listings, update pricing, edit architectural specs, and manage deletions.
          </Text>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="icon"
            variant="outline"
            onClick={() => loadProperties(true)}
            disabled={isLoading}
            className="size-9 shrink-0 cursor-pointer border-neutral-200 text-neutral-600 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
            title="Refresh listings"
          >
            <RefreshCwIcon
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          <Link
            href="/admin/properties/new"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "flex-1 sm:flex-initial justify-center gap-1.5 bg-amber-500 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 h-9"
            )}
          >
            <PlusIcon className="size-4" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Supabase Connection Warning Banner */}
      {dbStatus &&
        (!isLiveDb || dbStatus.isPermissionDenied || !dbStatus.tableExists) && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-amber-300">
                    {dbStatus.isPermissionDenied
                      ? "Supabase Permission Denied: Table 'properties' is present, but missing role permissions"
                      : "Supabase Table Missing: Currently running in Local Demo Store mode"}
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-amber-400/40 text-[10px] text-amber-300"
                  >
                    Local Store Only
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-neutral-300">
                  {dbStatus.isPermissionDenied ? (
                    <>
                      The{" "}
                      <code className="rounded bg-neutral-900/80 px-1.5 py-0.5 font-mono text-amber-300">
                        public.properties
                      </code>{" "}
                      table exists, but Postgres denied access to the API key
                      role (
                      <code className="font-mono text-neutral-400">anon</code>,
                      error code 42501). Table privileges (
                      <code className="font-mono text-amber-300">
                        GRANT ALL
                      </code>
                      ) and RLS policy must be granted in SQL Editor.
                    </>
                  ) : (
                    <>
                      Table{" "}
                      <code className="rounded bg-neutral-900/80 px-1.5 py-0.5 font-mono text-amber-300">
                        public.properties
                      </code>{" "}
                      does not exist in your Supabase project (
                      <code className="font-mono text-neutral-400">
                        wjxxmqkuhjhurpvyngxq
                      </code>
                      ).
                    </>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <a
                    href="https://supabase.com/dashboard/project/wjxxmqkuhjhurpvyngxq/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
                  >
                    Open Supabase SQL Editor <ExternalLink className="size-3" />
                  </a>
                  <span className="text-neutral-600">•</span>
                  <span className="text-neutral-400">
                    Run{" "}
                    <strong className="text-neutral-200">
                      supabase/schema.sql
                    </strong>{" "}
                    to grant permissions and enable live Supabase CRUD.
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
