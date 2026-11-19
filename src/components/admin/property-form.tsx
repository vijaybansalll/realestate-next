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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  UploadCloudIcon,
  XIcon,
  StarIcon,
  PlusIcon,
  Loader2Icon,
  ImageIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  BuildingIcon,
  LayersIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import {
  createProperty,
  updateProperty,
  uploadPropertyImagesToSupabase,
  fetchPropertyById,
} from "@/lib/supabase";
import type { Property, PropertyPurpose, PropertyType, PropertySpecs } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
}

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
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  ],
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
    pantry: "Walk-in Butler's Pantry",
    alfrescoOutdoor: "Terrace with outdoor kitchen and lounge",
    garage: 2,
    garden: "Private landscaped grounds",
    pool: "Heated Infinity Pool",
    wineCellar: "Climate-controlled cellar",
    smartHome: "Full automation system",
  },
};

export function PropertyForm({ mode, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Partial<Property>>(DEFAULT_NEW_PROPERTY);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(mode === "edit");
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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

            setFormData({
              ...res.data,
              images: existingImages,
              image: res.data.image || existingImages[0] || "",
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

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecChange = (specKey: keyof PropertySpecs, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...(prev.specs || {}),
        homeAreaSqM: prev.homeAreaSqM || 400,
        landAreaSqM: prev.landAreaSqM || 1000,
        bedrooms: prev.bedrooms || 3,
        bathrooms: prev.bathrooms || 2,
        livingRooms: prev.specs?.livingRooms || 2,
        pantry: prev.specs?.pantry || "",
        alfrescoOutdoor: prev.specs?.alfrescoOutdoor || "",
        garage: prev.garage || 1,
        garden: prev.specs?.garden || "",
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

      setNotification(`Uploaded ${res.urls.length} images successfully.`);
      setTimeout(() => setNotification(null), 3500);
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
    if (!formData.title?.trim() || !formData.location?.trim() || !formData.price) {
      alert("Please provide the property title, location, and price.");
      return;
    }

    const currentImages = formData.images || [];
    const coverImage = formData.image || currentImages[0] || "";

    setIsSubmitting(true);
    try {
      const payload: Partial<Property> = {
        ...formData,
        image: coverImage,
        images: currentImages.length > 0 ? currentImages : [coverImage].filter(Boolean),
        formattedPrice: `$${Number(formData.price).toLocaleString()}`,
      };

      if (mode === "edit" && propertyId) {
        await updateProperty(propertyId, payload);
      } else {
        await createProperty(payload as Omit<Property, "id">);
      }

      router.push("/admin/properties");
    } catch (err: any) {
      alert(`Failed to save property: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImages = formData.images || [];

  if (isLoadingProperty) {
    return (
      <div className="py-24 text-center text-sm text-neutral-400 flex flex-col items-center justify-center gap-3">
        <Loader2Icon className="size-6 animate-spin text-amber-400" />
        <span>Loading property details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-neutral-900/95 px-4 py-3 text-sm text-emerald-400 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3">
          <CheckCircle2Icon className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Action Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-colors mb-2"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Properties Directory
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <BuildingIcon className="size-6 text-amber-400" />
              {mode === "edit" ? `Edit Listing: ${formData.title || "Estate"}` : "Add New Property Listing"}
            </h1>
            <Badge
              variant="outline"
              className="border-amber-400/30 text-amber-300 text-xs"
            >
              {mode === "edit" ? "Edit Mode" : "New Listing Page"}
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Fill in the architectural specifications, upload multiple photos, and publish to the live catalog.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/properties"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-neutral-800 text-xs text-neutral-300 hover:text-white"
            )}
          >
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 transition-colors cursor-pointer text-xs gap-1.5"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TWO COLUMNS: Main Details & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: MULTI-IMAGE GALLERY UPLOADER */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-neutral-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                    <ImageIcon className="size-4 text-amber-400" />
                    Property Media Gallery & Cover Photo
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-400 mt-0.5">
                    Upload multiple high-resolution photos. The primary cover photo will be featured across the website.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">
                  {currentImages.length} {currentImages.length === 1 ? "Image" : "Images"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                  dragActive
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-950"
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
                  <div className="flex flex-col items-center gap-2 text-amber-400 py-3">
                    <Loader2Icon className="size-8 animate-spin" />
                    <p className="text-xs font-medium">Uploading images to Supabase storage bucket...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800">
                      <UploadCloudIcon className="size-7 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-neutral-200">
                        Click to browse multiple photos
                      </span>{" "}
                      <span className="text-sm text-neutral-400">or drag and drop them here</span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Supports JPG, PNG, WEBP. Uploads directly to Supabase Storage bucket (`realestate-bucket`).
                    </p>
                  </div>
                )}
              </div>

              {/* URL Input Bar */}
              <div className="flex items-center gap-2">
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
                  className="text-xs bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                />
                <Button
                  type="button"
                  onClick={handleAddUrl}
                  size="sm"
                  variant="outline"
                  className="border-neutral-800 text-xs text-neutral-200 shrink-0 hover:bg-neutral-800 cursor-pointer"
                >
                  <PlusIcon className="size-3.5 mr-1" /> Add URL
                </Button>
              </div>

              {/* Thumbnails Gallery Grid */}
              {currentImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 pt-2">
                  {currentImages.map((imgUrl, index) => {
                    const isCover = index === 0 || imgUrl === formData.image;
                    return (
                      <div
                        key={`${imgUrl}-${index}`}
                        className={`group relative aspect-[4/3] rounded-xl overflow-hidden border bg-neutral-950 transition-all ${
                          isCover
                            ? "border-amber-400 ring-2 ring-amber-400/30"
                            : "border-neutral-800 hover:border-neutral-700"
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
                            <Badge className="bg-amber-400 text-neutral-950 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-lg">
                              <StarIcon className="size-3 fill-current" /> Cover Photo
                            </Badge>
                          </div>
                        )}

                        {/* Hover Overlay with Action Buttons */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-between p-2.5 bg-gradient-to-t from-black/85 via-black/20 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              className="p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                              title="Delete photo"
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
                              className="w-full py-1.5 text-[11px] font-semibold bg-neutral-900/90 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 rounded-md transition-colors text-center cursor-pointer shadow-md"
                            >
                              Set as Cover Photo
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 2: BASIC PROPERTY INFORMATION */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-neutral-800/80">
              <CardTitle className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <BuildingIcon className="size-4 text-amber-400" />
                Primary Estate Details
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Core identity, location, architecture category, and listing purpose.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-neutral-300">Property Title *</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Modern Cascading Villa on Whistler Ridge"
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 focus-visible:border-amber-400/80"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-neutral-300">Location Address / City *</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. Beverly Hills, California"
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 focus-visible:border-amber-400/80"
                  required
                />
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Listing Purpose</Label>
                <Select
                  value={formData.purpose || "buy"}
                  onValueChange={(val) => handleChange("purpose", val as PropertyPurpose)}
                >
                  <SelectTrigger className="w-full bg-neutral-950 border-neutral-800 text-neutral-100">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                    <SelectItem value="buy">For Sale (Acquisition)</SelectItem>
                    <SelectItem value="rent">For Lease (Rental)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Architecture Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Property Architecture</Label>
                <Select
                  value={formData.type || "estate"}
                  onValueChange={(val) => handleChange("type", val as PropertyType)}
                >
                  <SelectTrigger className="w-full bg-neutral-950 border-neutral-800 text-neutral-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
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
                <Label className="text-xs font-medium text-neutral-300">Price ($ USD) *</Label>
                <Input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("price", num);
                    handleChange("formattedPrice", `$${num.toLocaleString()}`);
                  }}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 font-mono font-semibold text-emerald-400 focus-visible:border-amber-400/80"
                  required
                />
              </div>

              {/* Formatted Price */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Display Formatted Price</Label>
                <Input
                  value={formData.formattedPrice || ""}
                  onChange={(e) => handleChange("formattedPrice", e.target.value)}
                  placeholder="e.g. $14,500,000"
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 focus-visible:border-amber-400/80"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-neutral-300">Detailed Residence Overview</Label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  placeholder="Provide a comprehensive narrative describing the property, materials, views, and lifestyle amenities..."
                  className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:border-amber-400/80 focus-visible:outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: ARCHITECTURAL DIMENSIONS & SPECS */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-neutral-800/80">
              <CardTitle className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <LayersIcon className="size-4 text-amber-400" />
                Dimensions & Specifications
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Bedrooms, baths, garage bays, and interior/lot areas.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Bedrooms</Label>
                <Input
                  type="number"
                  value={formData.bedrooms || 3}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("bedrooms", num);
                    handleChange("bhk", num);
                  }}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Bathrooms</Label>
                <Input
                  type="number"
                  value={formData.bathrooms || 2}
                  onChange={(e) => handleChange("bathrooms", Number(e.target.value))}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Garage Bays</Label>
                <Input
                  type="number"
                  value={formData.garage || 1}
                  onChange={(e) => handleChange("garage", Number(e.target.value))}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-300">Living Rooms</Label>
                <Input
                  type="number"
                  value={formData.specs?.livingRooms || 2}
                  onChange={(e) => handleSpecChange("livingRooms", Number(e.target.value))}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-medium text-neutral-300">Interior Area (m²)</Label>
                <Input
                  type="number"
                  value={formData.homeAreaSqM || 350}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    handleChange("homeAreaSqM", num);
                    handleChange("size", `${num} m² (${Math.round(num * 10.764).toLocaleString()} sq ft)`);
                  }}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-medium text-neutral-300">Land Area (m²)</Label>
                <Input
                  type="number"
                  value={formData.landAreaSqM || 1000}
                  onChange={(e) => handleChange("landAreaSqM", Number(e.target.value))}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <Label className="text-xs font-medium text-neutral-300">Size Summary Label</Label>
                <Input
                  value={formData.size || ""}
                  onChange={(e) => handleChange("size", e.target.value)}
                  placeholder="e.g. 650 m² (7,000 sq ft)"
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Settings, Features & Amenities */}
        <div className="space-y-6">
          {/* SECTION 4: VISIBILITY & BADGES */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-neutral-800/80">
              <CardTitle className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <SparklesIcon className="size-4 text-amber-400" />
                Showcase & Tiers
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                <div>
                  <p className="text-xs font-medium text-neutral-200">Luxury Designation</p>
                  <p className="text-[11px] text-neutral-400">Mark as ultra-luxury residence</p>
                </div>
                <Switch
                  checked={Boolean(formData.isLuxury)}
                  onCheckedChange={(checked) => handleChange("isLuxury", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                <div>
                  <p className="text-xs font-medium text-neutral-200">Featured Showcase</p>
                  <p className="text-[11px] text-neutral-400">Highlight on homepage hero</p>
                </div>
                <Switch
                  checked={Boolean(formData.featured)}
                  onCheckedChange={(checked) => handleChange("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: FEATURES & AMENITIES LIST */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-neutral-800/80">
              <CardTitle className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-emerald-400" />
                Amenities & Features
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Key selling points showcased on the property page.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3.5">
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
                  className="text-xs bg-neutral-950 border-neutral-800 text-neutral-100"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  size="sm"
                  className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs shrink-0 cursor-pointer"
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
                    className="border-neutral-800 bg-neutral-950 text-neutral-300 text-xs py-1 px-2.5 flex items-center gap-1.5"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 6: ARCHITECTURAL AMENITIES */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-neutral-800/80">
              <CardTitle className="text-sm font-semibold text-neutral-100">
                Architectural Highlights
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-neutral-400">Butler's Pantry</Label>
                <Input
                  value={String(formData.specs?.pantry || "")}
                  onChange={(e) => handleSpecChange("pantry", e.target.value)}
                  placeholder="e.g. Walk-in Butler's Pantry"
                  className="text-xs bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-neutral-400">Pool / Spa</Label>
                <Input
                  value={String(formData.specs?.pool || "")}
                  onChange={(e) => handleSpecChange("pool", e.target.value)}
                  placeholder="e.g. Heated Infinity Edge Pool"
                  className="text-xs bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-neutral-400">Wine Cellar</Label>
                <Input
                  value={String(formData.specs?.wineCellar || "")}
                  onChange={(e) => handleSpecChange("wineCellar", e.target.value)}
                  placeholder="e.g. 1,200-bottle Sommelier Room"
                  className="text-xs bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-neutral-400">Smart Home Automation</Label>
                <Input
                  value={String(formData.specs?.smartHome || "")}
                  onChange={(e) => handleSpecChange("smartHome", e.target.value)}
                  placeholder="e.g. Crestron Home Automation"
                  className="text-xs bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
        <Link
          href="/admin/properties"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-neutral-800 text-xs text-neutral-300 hover:text-white"
          )}
        >
          ← Cancel and Return
        </Link>

        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 transition-colors cursor-pointer text-xs px-6 py-2"
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
