"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  UploadCloudIcon,
  XIcon,
  StarIcon,
  PlusIcon,
  Loader2Icon,
  ImageIcon,
  ArrowLeftIcon,
  BuildingIcon,
  LayersIcon,
  ShieldCheckIcon,
  SparklesIcon,
  AlertTriangle,
  ExternalLink,
  Bed,
  Bath,
  Car,
  Sofa,
  Maximize2,
  Layers,
  UtensilsCrossed,
  SunMedium,
  Trees,
  Waves,
  Wine,
  ShieldCheck,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  createProperty,
  updateProperty,
  uploadPropertyImagesToSupabase,
  fetchPropertyById,
  testSupabaseConnection,
} from "@/lib/supabase";
import type {
  Property,
  PropertyPurpose,
  PropertyType,
  PropertySpecs,
} from "@/types";
import { cn } from "@/lib/utils";

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
}

const AMENITY_CONFIGS: {
  key: keyof PropertySpecs;
  label: string;
  icon: typeof UtensilsCrossed;
}[] = [
  {
    key: "pantry",
    label: "Butler's Pantry",
    icon: UtensilsCrossed,
  },
  {
    key: "alfrescoOutdoor",
    label: "Alfresco / Outdoor",
    icon: SunMedium,
  },
  {
    key: "garden",
    label: "Landscaped Garden",
    icon: Trees,
  },
  {
    key: "pool",
    label: "Swimming Pool",
    icon: Waves,
  },
  {
    key: "wineCellar",
    label: "Wine Cellar",
    icon: Wine,
  },
  {
    key: "smartHome",
    label: "Smart Home",
    icon: ShieldCheck,
  },
];

const DEFAULT_NEW_PROPERTY: Partial<Property> = {
  title: "",
  location: "",
  purpose: "buy",
  type: "estate",
  price: 5500000,
  formattedPrice: "$5,500,000",
  bhk: 4,
  bedrooms: 4,
  bathrooms: 4,
  garage: 2,
  homeAreaSqM: 450,
  landAreaSqM: 1200,
  size: "450 m² (4,844 sq ft)",
  image: "",
  images: [],
  isLuxury: true,
  featured: false,
  description:
    "An extraordinary luxury residence combining state-of-the-art architectural design, panoramic views, bespoke finishes, and expansive entertaining terraces.",
  features: [
    "Infinity Pool",
    "Panoramic Horizons",
    "Wine Sommelier Cellar",
    "Smart Home Automation",
    "Butler's Pantry",
  ],
  specs: {
    homeAreaSqM: 450,
    landAreaSqM: 1200,
    bedrooms: 4,
    bathrooms: 4,
    livingRooms: 2,
    pantry: true,
    alfrescoOutdoor: true,
    garage: 2,
    garden: true,
    pool: true,
    wineCellar: true,
    smartHome: true,
  },
};

export function PropertyForm({ mode, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] =
    useState<Partial<Property>>(DEFAULT_NEW_PROPERTY);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(mode === "edit");
  const [dragActive, setDragActive] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    isConnected: boolean;
    tableExists: boolean;
    isPermissionDenied?: boolean;
    message: string;
    error?: string;
  } | null>(null);

  // Check Supabase connection & schema status on mount
  useEffect(() => {
    let isMounted = true;
    testSupabaseConnection().then((status) => {
      if (isMounted) setDbStatus(status);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Load existing property when in edit mode
  useEffect(() => {
    if (mode === "edit" && propertyId) {
      let isMounted = true;
      async function loadProp() {
        setIsLoadingProperty(true);
        try {
          const res = await fetchPropertyById(propertyId!);
          if (res.data && isMounted) {
            const existingImages =
              Array.isArray(res.data.images) && res.data.images.length > 0
                ? res.data.images
                : res.data.image
                  ? [res.data.image]
                  : [];

            const propData = res.data;
            const existingSpecs: PropertySpecs = {
              homeAreaSqM:
                propData.specs?.homeAreaSqM ?? propData.homeAreaSqM ?? 400,
              landAreaSqM:
                propData.specs?.landAreaSqM ?? propData.landAreaSqM ?? 1000,
              bedrooms: propData.specs?.bedrooms ?? propData.bedrooms ?? 3,
              bathrooms: propData.specs?.bathrooms ?? propData.bathrooms ?? 2,
              garage: propData.specs?.garage ?? propData.garage ?? 1,
              livingRooms:
                propData.specs?.livingRooms ??
                Math.max(1, Math.floor((propData.bedrooms || 3) / 2)),
              pantry:
                propData.specs?.pantry !== undefined
                  ? propData.specs.pantry
                  : propData.bedrooms >= 3
                    ? "Walk-in Butler's Pantry"
                    : false,
              alfrescoOutdoor:
                propData.specs?.alfrescoOutdoor !== undefined
                  ? propData.specs.alfrescoOutdoor
                  : propData.isLuxury
                    ? "Large alfresco + pool"
                    : "Outdoor Terrace",
              garden:
                propData.specs?.garden !== undefined
                  ? propData.specs.garden
                  : (propData.landAreaSqM || 0) > 500
                    ? "Private Landscaped Grounds"
                    : false,
              pool:
                propData.specs?.pool !== undefined
                  ? propData.specs.pool
                  : propData.features?.some((f) =>
                      f.toLowerCase().includes("pool")
                    ) || false,
              wineCellar:
                propData.specs?.wineCellar !== undefined
                  ? propData.specs.wineCellar
                  : propData.features?.some((f) =>
                      f.toLowerCase().includes("wine")
                    ) || false,
              smartHome:
                propData.specs?.smartHome !== undefined
                  ? propData.specs.smartHome
                  : propData.features?.some((f) =>
                      f.toLowerCase().includes("smart")
                    ) || false,
            };

            setFormData({
              ...propData,
              images: existingImages,
              image: propData.image || existingImages[0] || "",
              specs: existingSpecs,
            });
          }
        } finally {
          if (isMounted) setIsLoadingProperty(false);
        }
      }
      loadProp();
      return () => {
        isMounted = false;
      };
    }
  }, [mode, propertyId]);

  const handleChange = (field: keyof Property, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecChange = (specKey: keyof PropertySpecs, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...(prev.specs || {}),
        homeAreaSqM: prev.homeAreaSqM || 400,
        landAreaSqM: prev.landAreaSqM || 1000,
        bedrooms: prev.bedrooms || 3,
        bathrooms: prev.bathrooms || 2,
        livingRooms: prev.specs?.livingRooms || 2,
        pantry: prev.specs?.pantry ?? false,
        alfrescoOutdoor: prev.specs?.alfrescoOutdoor ?? false,
        garage: prev.garage || 1,
        garden: prev.specs?.garden ?? false,
        pool: prev.specs?.pool ?? false,
        wineCellar: prev.specs?.wineCellar ?? false,
        smartHome: prev.specs?.smartHome ?? false,
        [specKey]: value,
      },
    }));
  };

  // Upload multiple images to Supabase storage bucket
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const res = await uploadPropertyImagesToSupabase(fileArray);

      setFormData((prev) => {
        const currentImages = prev.images || [];
        const updatedImages = [...currentImages, ...res.urls];
        return {
          ...prev,
          images: updatedImages,
          image: prev.image || updatedImages[0] || "",
        };
      });

      if (res.error) {
        toast.info("Images Loaded Locally", {
          description: `Supabase storage notice: ${res.error}`,
        });
      } else {
        toast.success("Images Uploaded", {
          description: `Successfully uploaded ${res.urls.length} image${res.urls.length > 1 ? "s" : ""} to storage.`,
        });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Add image by URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();

    setFormData((prev) => {
      const currentImages = prev.images || [];
      const updatedImages = [...currentImages, url];
      return {
        ...prev,
        images: updatedImages,
        image: prev.image || updatedImages[0] || "",
      };
    });

    setUrlInput("");
  };

  // Remove single image from list
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const current = prev.images || [];
      const filtered = current.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered,
        image:
          prev.image === current[indexToRemove]
            ? filtered[0] || ""
            : prev.image || filtered[0] || "",
      };
    });
  };

  // Set an image as primary cover image
  const handleSetCover = (index: number) => {
    setFormData((prev) => {
      const current = prev.images || [];
      const target = current[index];
      if (!target) return prev;
      const reordered = [target, ...current.filter((_, idx) => idx !== index)];
      return {
        ...prev,
        image: target,
        images: reordered,
      };
    });
  };

  // Feature tag adder
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const text = newFeatureText.trim();
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), text],
    }));
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idxToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, idx) => idx !== idxToRemove),
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title?.trim() ||
      !formData.location?.trim() ||
      !formData.price
    ) {
      toast.error("Validation Incomplete", {
        description:
          "Please provide the property title, location, and price before saving.",
      });
      return;
    }

    const currentImages = formData.images || [];
    const coverImage = formData.image || currentImages[0] || "";

    setIsSubmitting(true);
    try {
      const specsData: PropertySpecs = {
        homeAreaSqM: Number(
          formData.homeAreaSqM || formData.specs?.homeAreaSqM || 200
        ),
        landAreaSqM: Number(
          formData.landAreaSqM || formData.specs?.landAreaSqM || 300
        ),
        bedrooms: Number(formData.bedrooms || formData.specs?.bedrooms || 3),
        bathrooms: Number(formData.bathrooms || formData.specs?.bathrooms || 2),
        garage: Number(formData.garage || formData.specs?.garage || 1),
        livingRooms:
          formData.specs?.livingRooms ||
          Math.max(1, Math.floor(Number(formData.bedrooms || 3) / 2)),
        pantry: formData.specs?.pantry ?? false,
        alfrescoOutdoor: formData.specs?.alfrescoOutdoor ?? false,
        garden: formData.specs?.garden ?? false,
        pool: formData.specs?.pool ?? false,
        wineCellar: formData.specs?.wineCellar ?? false,
        smartHome: formData.specs?.smartHome ?? false,
      };

      const payload: Partial<Property> = {
        ...formData,
        specs: specsData,
        image: coverImage,
        images:
          currentImages.length > 0
            ? currentImages
            : [coverImage].filter(Boolean),
        formattedPrice: `$${Number(formData.price).toLocaleString()}`,
      };

      let saveRes;
      if (mode === "edit" && propertyId) {
        saveRes = await updateProperty(propertyId, payload);
      } else {
        saveRes = await createProperty(payload as Omit<Property, "id">);
      }

      if (saveRes && !saveRes.isLiveSupabase) {
        toast.warning("Saved Locally Only", {
          description: `Notice: ${saveRes.error || "Supabase table missing"}. Run 'supabase/schema.sql' in Supabase to sync live.`,
          duration: 6000,
        });
      } else {
        toast.success(
          mode === "edit" ? "Property Updated" : "Property Published",
          {
            description: `"${payload.title}" is now active in the portfolio.`,
          }
        );
      }

      router.refresh();
      router.push("/admin/properties");
    } catch (err: unknown) {
      toast.error("Failed to Save Property", {
        description:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImages = formData.images || [];

  if (isLoadingProperty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center text-sm text-neutral-400">
        <Loader2Icon className="size-6 animate-spin text-amber-400" />
        <span>Loading property details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Action Header Bar */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <div>
          <Link
            href="/admin/properties"
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Properties Directory
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
              <BuildingIcon className="size-5 shrink-0 text-amber-500 sm:size-6 dark:text-amber-400" />
              <span className="line-clamp-1">
                {mode === "edit"
                  ? `Edit Listing: ${formData.title || "Estate"}`
                  : "Add New Property Listing"}
              </span>
            </h1>
            <Badge
              variant="outline"
              className="border-amber-500/30 text-[10px] text-amber-700 sm:text-xs dark:border-amber-400/30 dark:text-amber-300"
            >
              {mode === "edit" ? "Edit Mode" : "New Listing"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Fill in architectural specifications, upload multiple photos, and
            publish to catalog.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          <Link
            href="/admin/properties"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 justify-center border-neutral-200 bg-white text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            )}
          >
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="h-9 cursor-pointer justify-center gap-1.5 bg-amber-500 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : mode === "edit" ? (
              "Save Changes"
            ) : (
              "Publish Property"
            )}
          </Button>
        </div>
      </div>

      {/* Supabase Connection / Table Missing Warning Banner */}
      {dbStatus && (dbStatus.isPermissionDenied || !dbStatus.tableExists) && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-800 backdrop-blur-md dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500 dark:text-amber-400" />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {dbStatus.isPermissionDenied
                    ? "Supabase Permission Denied: Table 'properties' is present, but missing role permissions"
                    : "Supabase Table Missing: Property will not be saved in Supabase"}
                </h3>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 text-[10px] text-amber-700 dark:border-amber-400/40 dark:text-amber-300"
                >
                  Local Store Only
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                {dbStatus.isPermissionDenied ? (
                  <>
                    The{" "}
                    <code className="rounded bg-neutral-200/80 px-1.5 py-0.5 font-mono text-amber-800 dark:bg-neutral-900/80 dark:text-amber-300">
                      public.properties
                    </code>{" "}
                    table exists, but Postgres denied access to the API key role
                    (
                    <code className="font-mono text-neutral-600 dark:text-neutral-400">
                      anon
                    </code>
                    , error code 42501). Table privileges (
                    <code className="font-mono text-amber-800 dark:text-amber-300">
                      GRANT ALL
                    </code>
                    ) and RLS policy must be granted in SQL Editor.
                  </>
                ) : (
                  <>
                    The database table{" "}
                    <code className="rounded bg-neutral-200/80 px-1.5 py-0.5 font-mono text-amber-800 dark:bg-neutral-900/80 dark:text-amber-300">
                      public.properties
                    </code>{" "}
                    does not exist yet in your Supabase project (
                    <code className="font-mono text-neutral-600 dark:text-neutral-400">
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
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 underline underline-offset-4 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  Open Supabase SQL Editor <ExternalLink className="size-3" />
                </a>
                <span className="text-neutral-400 dark:text-neutral-600">
                  •
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Run{" "}
                  <strong className="text-neutral-800 dark:text-neutral-200">
                    supabase/schema.sql
                  </strong>{" "}
                  to grant permissions and enable live Supabase CRUD.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT TWO COLUMNS: Main Details & Specs */}
        <div className="space-y-6 lg:col-span-2">
          {/* SECTION 1: MULTI-IMAGE GALLERY UPLOADER */}
          <Card className="border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-xl">
            <CardHeader className="border-b border-neutral-200 pb-3 dark:border-neutral-800/80">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    <ImageIcon className="size-4 text-amber-500 dark:text-amber-400" />
                    Property Media Gallery & Cover Photo
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Upload multiple high-resolution photos. The primary cover
                    photo will be featured across the website.
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="self-start border-neutral-300 text-xs text-neutral-700 sm:self-auto dark:border-neutral-700 dark:text-neutral-300"
                >
                  {currentImages.length}{" "}
                  {currentImages.length === 1 ? "Image" : "Images"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-all sm:p-8 ${
                  dragActive
                    ? "border-amber-500 bg-amber-500/10 dark:border-amber-400 dark:bg-amber-400/10"
                    : "border-neutral-200 bg-neutral-50/70 hover:border-neutral-300 hover:bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-950/70 dark:hover:border-neutral-700 dark:hover:bg-neutral-950"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 py-3 text-amber-400">
                    <Loader2Icon className="size-8 animate-spin" />
                    <p className="text-xs font-medium">
                      Uploading images to Supabase storage bucket...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full border border-neutral-200 bg-neutral-100 p-3 text-neutral-700 sm:p-3.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                      <UploadCloudIcon className="size-6 text-amber-500 sm:size-7 dark:text-amber-400" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                        Click to browse photos
                      </span>{" "}
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        or drop here
                      </span>
                    </div>
                    <p className="max-w-sm text-xs text-neutral-500">
                      Supports JPG, PNG, WEBP. Uploads directly to Supabase
                      Storage.
                    </p>
                  </div>
                )}
              </div>

              {/* URL Input Bar */}
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  placeholder="Or paste an image URL (e.g. https://images.unsplash.com/...)"
                  className="h-9 border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
                <Button
                  type="button"
                  onClick={handleAddUrl}
                  size="sm"
                  variant="outline"
                  className="h-9 shrink-0 cursor-pointer justify-center border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <PlusIcon className="mr-1 size-3.5" /> Add URL
                </Button>
              </div>

              {/* Thumbnails Gallery Grid */}
              {currentImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                  {currentImages.map((imgUrl, index) => {
                    const isCover = index === 0 || imgUrl === formData.image;
                    return (
                      <div
                        key={`${imgUrl}-${index}`}
                        className={`group relative aspect-[4/3] overflow-hidden rounded-xl border bg-neutral-100 transition-all dark:bg-neutral-950 ${
                          isCover
                            ? "border-amber-500 ring-2 ring-amber-500/30 dark:border-amber-400 dark:ring-amber-400/30"
                            : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Property preview ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="flex items-center gap-1 bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-neutral-950 shadow-lg dark:bg-amber-400">
                              <StarIcon className="size-3 fill-current" /> Cover
                              Photo
                            </Badge>
                          </div>
                        )}

                        {/* Action Overlay: visible on mobile, hover on desktop */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/20 to-black/50 p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-colors hover:bg-rose-600 sm:size-6"
                              title="Delete photo"
                              aria-label="Delete photo"
                            >
                              <XIcon className="size-3.5" />
                            </button>
                          </div>

                          {!isCover && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetCover(index);
                              }}
                              className="w-full cursor-pointer rounded-md bg-neutral-900/90 py-1 text-center text-[10px] font-semibold text-neutral-200 shadow-md transition-colors hover:bg-amber-400 hover:text-neutral-950 sm:text-[11px]"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-5 text-center dark:border-neutral-800 dark:bg-neutral-950/40">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    No images uploaded yet. Browse files above or paste an image
                    URL.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 2: BASIC PROPERTY INFORMATION */}
          <Card className="border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-xl">
            <CardHeader className="border-b border-neutral-200 pb-3 dark:border-neutral-800/80">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                <BuildingIcon className="size-4 text-amber-500 dark:text-amber-400" />
                Primary Estate Details
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Core identity, location, architecture category, and listing
                purpose.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Property Title *
                </Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Modern Cascading Villa on Whistler Ridge"
                  className="border-neutral-200 bg-white text-neutral-900 focus-visible:border-amber-500/80 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus-visible:border-amber-400/80"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Location Address / City *
                </Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. Beverly Hills, California"
                  className="border-neutral-200 bg-white text-neutral-900 focus-visible:border-amber-500/80 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus-visible:border-amber-400/80"
                  required
                />
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Listing Purpose
                </Label>
                <Select
                  value={formData.purpose || "buy"}
                  onValueChange={(val) =>
                    handleChange("purpose", val as PropertyPurpose)
                  }
                >
                  <SelectTrigger className="w-full border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-200 bg-white text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                    <SelectItem value="buy">For Sale (Acquisition)</SelectItem>
                    <SelectItem value="rent">For Lease (Rental)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Architecture Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Property Architecture
                </Label>
                <Select
                  value={formData.type || "estate"}
                  onValueChange={(val) =>
                    handleChange("type", val as PropertyType)
                  }
                >
                  <SelectTrigger className="w-full border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-200 bg-white text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                    <SelectItem value="estate">Estate</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Price ($ USD) *
                </Label>
                <Input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("price", num);
                    handleChange("formattedPrice", `$${num.toLocaleString()}`);
                  }}
                  className="border-neutral-200 bg-white font-mono font-semibold text-emerald-600 text-neutral-900 focus-visible:border-amber-500/80 dark:border-neutral-800 dark:bg-neutral-950 dark:text-emerald-400 dark:text-neutral-100 dark:focus-visible:border-amber-400/80"
                  required
                />
              </div>

              {/* Formatted Price */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Display Formatted Price
                </Label>
                <Input
                  value={formData.formattedPrice || ""}
                  onChange={(e) =>
                    handleChange("formattedPrice", e.target.value)
                  }
                  placeholder="e.g. $14,500,000"
                  className="border-neutral-200 bg-white text-neutral-900 focus-visible:border-amber-500/80 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus-visible:border-amber-400/80"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Detailed Residence Overview
                </Label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  placeholder="Provide a comprehensive narrative describing the property, materials, views, and lifestyle amenities..."
                  className="w-full rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:border-amber-500/80 focus-visible:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:border-amber-400/80"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: ARCHITECTURAL DIMENSIONS & SPECS */}
          <Card className="border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-xl">
            <CardHeader className="border-b border-neutral-200 pb-3 dark:border-neutral-800/80">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                <LayersIcon className="size-4 text-amber-500 dark:text-amber-400" />
                Dimensions & Specifications
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Bedrooms, baths, garage bays, and interior/lot areas shown in
                the specification grid.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <Bed className="size-3.5 text-amber-500" />
                  <span>Bedrooms</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.bedrooms || 3}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("bedrooms", num);
                    handleChange("bhk", num);
                    handleSpecChange("bedrooms", num);
                  }}
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <Bath className="size-3.5 text-amber-500" />
                  <span>Bathrooms</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.bathrooms || 2}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("bathrooms", num);
                    handleSpecChange("bathrooms", num);
                  }}
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <Car className="size-3.5 text-amber-500" />
                  <span>Garage Bays</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.garage || 1}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("garage", num);
                    handleSpecChange("garage", num);
                  }}
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <Sofa className="size-3.5 text-amber-500" />
                  <span>Living Rooms</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.specs?.livingRooms || 2}
                  onChange={(e) =>
                    handleSpecChange("livingRooms", Number(e.target.value))
                  }
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <Maximize2 className="size-3.5 text-amber-500" />
                  <span>Interior Home Area (m²)</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.homeAreaSqM || 350}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("homeAreaSqM", num);
                    handleChange(
                      "size",
                      `${num} m² (${Math.round(num * 10.764).toLocaleString()} sq ft)`
                    );
                    handleSpecChange("homeAreaSqM", num);
                  }}
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <Layers className="size-3.5 text-amber-500" />
                  <span>Land Parcel Area (m²)</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.landAreaSqM || 1000}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("landAreaSqM", num);
                    handleSpecChange("landAreaSqM", num);
                  }}
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Size Summary Label
                </Label>
                <Input
                  value={formData.size || ""}
                  onChange={(e) => handleChange("size", e.target.value)}
                  placeholder="e.g. 650 m² (7,000 sq ft)"
                  className="border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Settings, Features & Amenities */}
        <div className="space-y-6">
          {/* SECTION 4: VISIBILITY & BADGES */}
          <Card className="border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-xl">
            <CardHeader className="border-b border-neutral-200 pb-3 dark:border-neutral-800/80">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                <SparklesIcon className="size-4 text-amber-500 dark:text-amber-400" />
                Showcase & Tiers
              </CardTitle>
            </CardHeader>

            <CardContent className="gap-0 divide-y divide-solid divide-neutral-200 dark:divide-neutral-700">
              <div className="flex items-center justify-between py-4">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                  Luxury Designation
                </p>

                <Switch
                  checked={Boolean(formData.isLuxury)}
                  onCheckedChange={(checked) =>
                    handleChange("isLuxury", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                  Featured Showcase
                </p>
                <Switch
                  checked={Boolean(formData.featured)}
                  onCheckedChange={(checked) =>
                    handleChange("featured", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: FEATURES & AMENITIES LIST */}
          <Card className="border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-xl">
            <CardHeader className="border-b border-neutral-200 pb-3 dark:border-neutral-800/80">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                <ShieldCheckIcon className="size-4 text-emerald-500 dark:text-emerald-400" />
                Amenities & Features
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Key selling points showcased on the property page.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-4">
              {/* Feature Tags Adder */}
              <div className="flex items-center gap-2">
                <Input
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Heated Infinity Pool"
                  className="border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  size="sm"
                  className="shrink-0 cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <PlusIcon className="size-3.5" />
                </Button>
              </div>

              {/* Tag Badges List */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(formData.features || []).map((feat, index) => (
                  <Badge
                    key={`${feat}-${index}`}
                    variant="outline"
                    className="flex items-center gap-1.5 border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="cursor-pointer text-neutral-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 6: PROPERTY SPECIFICATIONS & AMENITIES */}
          <Card className="border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-xl">
            <CardHeader className="border-b border-neutral-200 pb-3 dark:border-neutral-800/80">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                <SparklesIcon className="size-4 text-amber-500 dark:text-amber-400" />
                Property Specifications & Amenities
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Toggle and customize the 6 signature luxury amenity values
                displayed in the public grid.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-0 divide-y divide-solid divide-neutral-200 dark:divide-neutral-700">
              {AMENITY_CONFIGS.map((item) => {
                const Icon = item.icon;
                const rawVal = formData.specs?.[item.key];
                const isChecked =
                  typeof rawVal === "boolean"
                    ? rawVal
                    : typeof rawVal === "string"
                      ? rawVal.trim().length > 0 &&
                        !["false", "no", "none", ""].includes(
                          rawVal.trim().toLowerCase()
                        )
                      : false;

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-amber-500 dark:text-amber-400">
                        <Icon className="size-5" />
                      </div>
                      <Label
                        htmlFor={`amenity-${item.key}`}
                        className="cursor-pointer text-sm font-medium text-neutral-900 dark:text-neutral-200"
                      >
                        {item.label}
                      </Label>
                    </div>

                    <Switch
                      id={`amenity-${item.key}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        handleSpecChange(item.key, checked);
                      }}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <Link
          href="/admin/properties"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 w-full justify-center border-neutral-200 bg-white text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 sm:h-9 sm:w-auto dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          )}
        >
          ← Cancel and Return
        </Link>

        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="h-10 w-full cursor-pointer justify-center bg-amber-500 px-6 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-400 sm:h-9 sm:w-auto dark:bg-amber-400 dark:hover:bg-amber-300"
        >
          {isSubmitting
            ? "Saving to Supabase..."
            : mode === "edit"
              ? "Save Property Updates"
              : "Publish Property to Catalog"}
        </Button>
      </div>
    </form>
  );
}

export default PropertyForm;
