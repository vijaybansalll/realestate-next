import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ALL_PROPERTIES } from "@/data/properties";
import type { Property } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "realestate-bucket";

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseUrl.includes("your-project.supabase.co") &&
    supabaseUrl.startsWith("https://")
  );
};

// Singleton Supabase Client
let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return cachedClient;
};

// Helper: read File as base64 data URL
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Upload multiple property images to Supabase Storage (with data-url fallback)
export async function uploadPropertyImagesToSupabase(
  files: File[]
): Promise<{ urls: string[]; isLiveSupabase: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  const uploadedUrls: string[] = [];
  let uploadError: string | undefined;

  if (supabase) {
    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop() || "jpg";
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanName}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { data, error } = await supabase.storage
          .from(SUPABASE_STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.warn("Supabase storage upload failed, using data URL fallback:", error.message);
          uploadError = error.message;
          const dataUrl = await readFileAsDataUrl(file);
          uploadedUrls.push(dataUrl);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from(SUPABASE_STORAGE_BUCKET)
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      return { urls: uploadedUrls, isLiveSupabase: !uploadError, error: uploadError };
    } catch (err: any) {
      console.warn("Exception during Supabase storage upload:", err.message);
      uploadError = err.message;
    }
  }

  // Fallback: convert files to local data URLs for immediate use
  for (const file of files) {
    const dataUrl = await readFileAsDataUrl(file);
    uploadedUrls.push(dataUrl);
  }

  return { urls: uploadedUrls, isLiveSupabase: false, error: uploadError };
}

// Map DB row (snake_case) to Property type (camelCase)
export function mapRowToProperty(row: any): Property {
  return {
    id: String(row.id),
    title: row.title || "Untitled Property",
    location: row.location || "Unknown Location",
    purpose: row.purpose === "rent" ? "rent" : "buy",
    type: row.type || "estate",
    bhk: Number(row.bhk) || 3,
    bedrooms: Number(row.bedrooms) || 3,
    bathrooms: Number(row.bathrooms) || 2,
    garage: Number(row.garage) || 1,
    price: Number(row.price) || 0,
    formattedPrice: row.formatted_price || `$${Number(row.price || 0).toLocaleString()}`,
    isLuxury: Boolean(row.is_luxury),
    homeAreaSqM: Number(row.home_area_sqm) || 200,
    landAreaSqM: Number(row.land_area_sqm) || 300,
    size: row.size || `${row.home_area_sqm || 200} m²`,
    image: row.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.image].filter(Boolean),
    description: row.description || "",
    features: Array.isArray(row.features) ? row.features : [],
    featured: Boolean(row.featured),
    specs: row.specs || undefined,
  };
}

// Map Property (camelCase) to DB row (snake_case)
export function mapPropertyToRow(property: Partial<Property>) {
  const imagesList = property.images && property.images.length > 0 
    ? property.images 
    : (property.image ? [property.image] : []);
  const coverImage = property.image || (imagesList[0] || "");
  const homeArea = property.homeAreaSqM !== undefined ? Number(property.homeAreaSqM) : undefined;
  const landArea = property.landAreaSqM !== undefined ? Number(property.landAreaSqM) : undefined;
  const numPrice = property.price !== undefined ? Number(property.price) : undefined;

  const row: Record<string, any> = {};

  if (property.title !== undefined) row.title = property.title;
  if (property.location !== undefined) row.location = property.location;
  if (property.purpose !== undefined) row.purpose = property.purpose;
  if (property.type !== undefined) row.type = property.type;
  if (property.bhk !== undefined) row.bhk = Number(property.bhk);
  if (property.bedrooms !== undefined) row.bedrooms = Number(property.bedrooms);
  if (property.bathrooms !== undefined) row.bathrooms = Number(property.bathrooms);
  if (property.garage !== undefined) row.garage = Number(property.garage);
  if (numPrice !== undefined) row.price = numPrice;
  if (property.formattedPrice !== undefined) {
    row.formatted_price = property.formattedPrice;
  } else if (numPrice !== undefined) {
    row.formatted_price = `$${numPrice.toLocaleString()}`;
  }
  if (property.isLuxury !== undefined) row.is_luxury = Boolean(property.isLuxury);
  if (homeArea !== undefined) row.home_area_sqm = homeArea;
  if (landArea !== undefined) row.land_area_sqm = landArea;
  if (property.size !== undefined) {
    row.size = property.size;
  } else if (homeArea !== undefined) {
    row.size = `${homeArea} m²`;
  }
  if (property.image !== undefined || property.images !== undefined) {
    row.image = coverImage;
    row.images = imagesList.length > 0 ? imagesList : [coverImage].filter(Boolean);
  }
  if (property.description !== undefined) row.description = property.description;
  if (property.features !== undefined) row.features = property.features;
  if (property.featured !== undefined) row.featured = Boolean(property.featured);
  if (property.specs !== undefined) row.specs = property.specs;

  return row;
}

// In-Memory / Local Storage Store Fallback
let inMemoryProperties: Property[] = [...ALL_PROPERTIES];

export function getInitialProperties(): Property[] {
  return inMemoryProperties;
}

export async function fetchProperties(): Promise<{
  data: Property[];
  isLiveSupabase: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase query failed, falling back to local dataset:", error.message);
        return {
          data: inMemoryProperties,
          isLiveSupabase: false,
          error: error.message,
        };
      }

      if (!error && data) {
        const mapped = data.map(mapRowToProperty);
        inMemoryProperties = mapped;
        return { data: mapped, isLiveSupabase: true };
      }
    } catch (err: any) {
      console.warn("Supabase fetch exception, using fallback:", err.message);
    }
  }

  return {
    data: inMemoryProperties,
    isLiveSupabase: false,
  };
}

export async function fetchPropertyById(
  id: string
): Promise<{ data: Property | null; isLiveSupabase: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return { data: mapRowToProperty(data), isLiveSupabase: true };
      }
    } catch (err: any) {
      console.warn("Supabase fetch by ID error:", err.message);
    }
  }

  const found = inMemoryProperties.find((p) => p.id === id) || null;
  return { data: found, isLiveSupabase: false };
}

export async function createProperty(
  propertyData: Omit<Property, "id">
): Promise<{ data: Property; isLiveSupabase: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  const newId = `prop-${Date.now()}`;
  
  const coverImage = propertyData.image || (propertyData.images && propertyData.images[0]) || "";
  const allImages = propertyData.images && propertyData.images.length > 0 
    ? propertyData.images 
    : [coverImage].filter(Boolean);

  const newProperty: Property = {
    ...propertyData,
    id: newId,
    image: coverImage,
    images: allImages,
    formattedPrice:
      propertyData.formattedPrice || `$${Number(propertyData.price || 0).toLocaleString()}`,
  };

  if (supabase) {
    try {
      const row = {
        id: newId,
        ...mapPropertyToRow(newProperty),
      };
      const { data, error } = await supabase.from("properties").insert([row]).select().single();

      if (error) {
        console.warn("Supabase create failed, saving to local state:", error.message);
        inMemoryProperties = [newProperty, ...inMemoryProperties];
        return { data: newProperty, isLiveSupabase: false, error: error.message };
      } else if (data) {
        const saved = mapRowToProperty(data);
        inMemoryProperties = [saved, ...inMemoryProperties];
        return { data: saved, isLiveSupabase: true };
      }
    } catch (err: any) {
      console.warn("Supabase insert exception:", err.message);
      inMemoryProperties = [newProperty, ...inMemoryProperties];
      return { data: newProperty, isLiveSupabase: false, error: err.message };
    }
  }

  inMemoryProperties = [newProperty, ...inMemoryProperties];
  return { data: newProperty, isLiveSupabase: false, error: "Supabase client not configured" };
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<{ data: Property; isLiveSupabase: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  // Ensure cover image and images array sync
  if (updates.images && updates.images.length > 0 && !updates.image) {
    updates.image = updates.images[0];
  } else if (updates.image && (!updates.images || updates.images.length === 0)) {
    updates.images = [updates.image];
  }

  let dbError: string | undefined;

  if (supabase) {
    try {
      const rowUpdates = mapPropertyToRow(updates);
      const { data, error } = await supabase
        .from("properties")
        .update(rowUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.warn("Supabase update failed:", error.message);
        dbError = error.message;
      } else if (data) {
        const updated = mapRowToProperty(data);
        inMemoryProperties = inMemoryProperties.map((p) => (p.id === id ? updated : p));
        return { data: updated, isLiveSupabase: true };
      }
    } catch (err: any) {
      console.warn("Supabase update exception:", err.message);
      dbError = err.message;
    }
  }

  // Fallback to in-memory state update
  inMemoryProperties = inMemoryProperties.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        ...updates,
        image: updates.image || p.image,
        images: updates.images || p.images || [updates.image || p.image],
        formattedPrice:
          updates.price !== undefined
            ? `$${Number(updates.price).toLocaleString()}`
            : updates.formattedPrice || p.formattedPrice,
      };
    }
    return p;
  });

  const updatedProperty = inMemoryProperties.find((p) => p.id === id)!;
  return { data: updatedProperty, isLiveSupabase: false, error: dbError };
}

export async function deleteProperty(
  id: string
): Promise<{ success: boolean; isLiveSupabase: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (!error) {
        inMemoryProperties = inMemoryProperties.filter((p) => p.id !== id);
        return { success: true, isLiveSupabase: true };
      } else {
        console.warn("Supabase delete failed:", error.message);
        inMemoryProperties = inMemoryProperties.filter((p) => p.id !== id);
        return { success: true, isLiveSupabase: false, error: error.message };
      }
    } catch (err: any) {
      console.warn("Supabase delete exception:", err.message);
      inMemoryProperties = inMemoryProperties.filter((p) => p.id !== id);
      return { success: true, isLiveSupabase: false, error: err.message };
    }
  }

  inMemoryProperties = inMemoryProperties.filter((p) => p.id !== id);
  return { success: true, isLiveSupabase: false, error: "Supabase client not configured" };
}

export async function testSupabaseConnection(): Promise<{
  isConnected: boolean;
  tableExists: boolean;
  isPermissionDenied?: boolean;
  bucketExists: boolean;
  message: string;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      isConnected: false,
      tableExists: false,
      bucketExists: false,
      message: "Supabase credentials are missing or not configured in .env.",
    };
  }

  try {
    const { error: tableError } = await supabase.from("properties").select("id").limit(1);
    const isPermissionDenied =
      tableError?.code === "42501" ||
      tableError?.message?.toLowerCase().includes("permission denied");
    const tableExists = !tableError;

    let bucketExists = false;
    try {
      const { error: listError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .list("", { limit: 1 });
      bucketExists = !listError;
    } catch {
      bucketExists = false;
    }

    if (isPermissionDenied) {
      return {
        isConnected: true,
        tableExists: true,
        isPermissionDenied: true,
        bucketExists,
        message: `Table "public.properties" is present in Supabase, but permission is denied for the anon API role (code 42501). Run the GRANT permissions snippet in Supabase SQL Editor.`,
        error: tableError?.message,
      };
    }

    if (!tableExists) {
      return {
        isConnected: true,
        tableExists: false,
        bucketExists,
        message: `Project authenticated, but table "public.properties" was not found in schema cache. Run the schema.sql in Supabase SQL Editor.`,
        error: tableError?.message,
      };
    }

    return {
      isConnected: true,
      tableExists: true,
      bucketExists,
      message: "Connected to Supabase! Table 'properties' is live and ready for CRUD operations.",
    };
  } catch (err: any) {
    return {
      isConnected: false,
      tableExists: false,
      bucketExists: false,
      message: `Connection failed: ${err.message}`,
      error: err.message,
    };
  }
}
