-- ==============================================================================
-- Supabase Schema & Initial Data for Villa Lumina Real Estate Admin
-- Run this complete script in the Supabase SQL Editor:
-- Dashboard -> Your Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('buy', 'rent')),
    type TEXT NOT NULL CHECK (type IN ('estate', 'villa', 'penthouse', 'townhouse', 'apartment')),
    bhk INTEGER NOT NULL DEFAULT 3,
    bedrooms INTEGER NOT NULL DEFAULT 3,
    bathrooms INTEGER NOT NULL DEFAULT 2,
    garage INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL,
    formatted_price TEXT NOT NULL,
    is_luxury BOOLEAN NOT NULL DEFAULT false,
    home_area_sqm NUMERIC NOT NULL DEFAULT 200,
    land_area_sqm NUMERIC NOT NULL DEFAULT 300,
    size TEXT NOT NULL,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured BOOLEAN DEFAULT false,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe re-runs
DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;
DROP POLICY IF EXISTS "Allow admin full access to properties" ON public.properties;

-- Allow public read access (for public website visitors)
CREATE POLICY "Allow public read access to properties" 
ON public.properties FOR SELECT 
TO public 
USING (true);

-- Allow full CRUD operations for admin panel
CREATE POLICY "Allow admin full access to properties" 
ON public.properties FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- 3. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_properties_updated ON public.properties;
CREATE TRIGGER on_properties_updated
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Storage Bucket & Policies for realestate-bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('realestate-bucket', 'realestate-bucket', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for realestate-bucket
DROP POLICY IF EXISTS "Allow public to view realestate-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to upload realestate-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to update realestate-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to delete realestate-bucket" ON storage.objects;

CREATE POLICY "Allow public to view realestate-bucket" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'realestate-bucket');

CREATE POLICY "Allow admin to upload realestate-bucket" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'realestate-bucket');

CREATE POLICY "Allow admin to update realestate-bucket" 
ON storage.objects FOR UPDATE 
TO public 
USING (bucket_id = 'realestate-bucket');

CREATE POLICY "Allow admin to delete realestate-bucket" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'realestate-bucket');

-- 5. Seed Initial Luxury Properties (14 estates)
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-1', 'Villa Lumina Estate', 'Beverly Hills, California', 'buy', 'estate',
  5, 5, 6, 4,
  14500000, '$14,500,000', true, 650, 2200, '650 m² (7,000 sq ft)',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'A benchmark architectural masterpiece situated on an elevated ridge with panoramic valley horizons, bespoke stone accents, and an infinity pool.', ARRAY['Infinity Pool', 'Panoramic Valley View', 'Wine Cellar', 'Smart Home']::TEXT[], true, '{"homeAreaSqM":650,"landAreaSqM":2200,"bedrooms":5,"bathrooms":6,"livingRooms":3,"pantry":"Yes (Walk-in Butler''s Pantry)","alfrescoOutdoor":"Large alfresco + pool","garage":4,"garden":"Yes (Private Italian Cypress Gardens)","pool":"Yes (Heated Infinity Edge Pool)","wineCellar":"Yes (1,200-bottle Sommelier Room)","smartHome":"Yes (Crestron Architecture)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-2', 'The Azure Coast Sanctuary', 'Malibu, California', 'buy', 'villa',
  6, 6, 7, 4,
  22800000, '$22,800,000', true, 820, 3500, '820 m² (8,826 sq ft)',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Direct Pacific oceanfront villa featuring dramatic cantilevered teak decks, private tidal beach access, and floor-to-ceiling structural glass.', ARRAY['Private Beach Access', 'Cantilevered Terrace', 'Helipad Access', 'Wellness Spa']::TEXT[], true, '{"homeAreaSqM":820,"landAreaSqM":3500,"bedrooms":6,"bathrooms":7,"livingRooms":4,"pantry":"Yes (Chef''s Scullery)","alfrescoOutdoor":"Large alfresco + pool","garage":4,"garden":"Yes (Private Beachfront Palm Terrace)","pool":"Yes (Pacific Oceanfront Lap Pool)","wineCellar":"Yes (Sub-zero Reserve)","smartHome":"Yes (Full Lutron Control)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-3', 'Aura Modern Penthouse', 'Tribeca, New York', 'buy', 'penthouse',
  3, 3, 4, 2,
  8750000, '$8,750,000', true, 340, 400, '340 m² (3,660 sq ft)',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Tri-level crown penthouse with private keyed elevator access, 360-degree skyline vistas, wrap-around bronze terrace, and rooftop plunge pool.', ARRAY['Private Keyed Elevator', 'Rooftop Plunge Pool', 'Skyline Views', '360° Glass Facade']::TEXT[], true, '{"homeAreaSqM":340,"landAreaSqM":400,"bedrooms":3,"bathrooms":4,"livingRooms":2,"pantry":"Yes (Custom Poliform Pantry)","alfrescoOutdoor":"Large alfresco + pool","garage":2,"garden":"Yes (Rooftop Zen Terrace)","pool":"Yes (Private Rooftop Plunge Pool)","wineCellar":"Yes (Custom Glass Enclosure)","smartHome":"Yes (Savant System)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-4', 'Solaria Crest Pavilion', 'Paradise Valley, Arizona', 'buy', 'villa',
  4, 4, 5, 3,
  5900000, '$5,900,000', true, 460, 1800, '460 m² (4,950 sq ft)',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Desert modernism brought to life with rammed earth walls, shaded courtyards, reflective water bodies, and custom acoustic ceiling timber.', ARRAY['Desert Mountain Scenery', 'Courtyard Water Features', 'Solar Microgrid']::TEXT[], true, '{"homeAreaSqM":460,"landAreaSqM":1800,"bedrooms":4,"bathrooms":5,"livingRooms":2,"pantry":"Yes (Walk-in Scullery)","alfrescoOutdoor":"Large alfresco + pool","garage":3,"garden":"Yes (Desert Botanical Courtyard)","pool":"Yes (Zero-edge Heated Pool)","wineCellar":false,"smartHome":"Yes (Solar Microgrid Automation)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-5', 'Highland Vista Retreat', 'Aspen, Colorado', 'rent', 'estate',
  5, 5, 6, 4,
  42000, '$42,000/mo', true, 710, 4200, '710 m² (7,640 sq ft)',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Iconic alpine timber-and-glass retreat with ski-in/ski-out privileges, stone fireplaces, radiant heat flagstone, and year-round mountain views.', ARRAY['Ski-in/Ski-out', 'Heated Driveway', 'Outdoor Cedar Hot Tub', 'Library Hearth']::TEXT[], true, '{"homeAreaSqM":710,"landAreaSqM":4200,"bedrooms":5,"bathrooms":6,"livingRooms":3,"pantry":"Yes (Butler''s Pantry)","alfrescoOutdoor":"Large alfresco + heated spa","garage":4,"garden":"Yes (Alpine Pine Meadow)","pool":"Yes (Outdoor Cedar Hot Tub & Thermal Spa)","wineCellar":"Yes (Alpine Stone Cellar)","smartHome":"Yes (Radiant Heat Automation)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-6', 'Serenity Desert Haven', 'Scottsdale, Arizona', 'rent', 'villa',
  4, 4, 4, 3,
  18500, '$18,500/mo', true, 390, 1400, '390 m² (4,200 sq ft)',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'A serene desert sanctuary crafted with polished aggregate floors, expansive shaded loggias, integrated outdoor kitchen, and infinity spa.', ARRAY['Zero-edge Pool', 'Chef''s Scullery', 'Zen Garden', 'Bespoke Staging']::TEXT[], true, '{"homeAreaSqM":390,"landAreaSqM":1400,"bedrooms":4,"bathrooms":4,"livingRooms":2,"pantry":"Yes (Chef''s Scullery)","alfrescoOutdoor":"Large alfresco + pool","garage":3,"garden":"Yes (Zen Desert Oasis)","pool":"Yes (Infinity Spa & Pool)","wineCellar":false,"smartHome":"Yes (Integrated Smart Living)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-7', 'Nordic Minimalist Loft', 'SoHo, New York', 'rent', 'apartment',
  1, 1, 1, 1,
  6800, '$6,800/mo', false, 95, 95, '95 m² (1,022 sq ft)',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Sun-drenched authentic cast-iron loft with soaring 14-foot ceilings, bespoke custom walnut millwork, and top-tier Miele appliances.', ARRAY['Cast Iron Columns', 'Exposed Brick', 'Designer Italian Kitchen']::TEXT[], false, '{"homeAreaSqM":95,"landAreaSqM":95,"bedrooms":1,"bathrooms":1,"livingRooms":1,"pantry":false,"alfrescoOutdoor":false,"garage":1,"garden":false,"pool":false,"wineCellar":false,"smartHome":"Yes (Lutron Lighting)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-8', 'Glass Pavilion Studio', 'Venice Beach, California', 'buy', 'apartment',
  1, 1, 1, 1,
  1250000, '$1,250,000', false, 88, 110, '88 m² (947 sq ft)',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Architecturally refined modern coastal studio with a private balcony, polished microcement floors, and sustainable cross-laminated timber beams.', ARRAY['Private Balcony', 'Walk to Canals', 'Polished Terrazzo']::TEXT[], false, '{"homeAreaSqM":88,"landAreaSqM":110,"bedrooms":1,"bathrooms":1,"livingRooms":1,"pantry":false,"alfrescoOutdoor":"Yes (Private teak sundeck)","garage":1,"garden":"Yes (Private Bamboo Courtyard)","pool":false,"wineCellar":false,"smartHome":"Yes (Smart Keyless Entry)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-9', 'Kensington Garden Residence', 'Chelsea, London', 'rent', 'apartment',
  2, 2, 2, 1,
  9500, '$9,500/mo', true, 145, 180, '145 m² (1,560 sq ft)',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Period elegance meets contemporary minimalism overlooking private communal gardens with 24-hour uniformed concierge service.', ARRAY['Private Garden Access', 'High Ceilings', 'Herringbone Parquet', 'Concierge']::TEXT[], false, '{"homeAreaSqM":145,"landAreaSqM":180,"bedrooms":2,"bathrooms":2,"livingRooms":2,"pantry":"Yes (Bespoke English Pantry)","alfrescoOutdoor":"Yes (Balcony overlooking communal gardens)","garage":1,"garden":"Yes (Access to Private Communal Garden)","pool":false,"wineCellar":false,"smartHome":"Yes (Smart Climate & Concierge)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-10', 'The Hudson Corner Suite', 'Jersey City, New Jersey', 'buy', 'apartment',
  2, 2, 2, 1,
  1850000, '$1,850,000', false, 160, 160, '160 m² (1,722 sq ft)',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Modern dual-aspect corner residence boasting panoramic views of Manhattan skyline, marble waterfall kitchen island, and dedicated private parking.', ARRAY['River Views', 'Floor-to-Ceiling Glass', 'EV Charging', 'Fitness Club']::TEXT[], false, '{"homeAreaSqM":160,"landAreaSqM":160,"bedrooms":2,"bathrooms":2,"livingRooms":1,"pantry":false,"alfrescoOutdoor":"Yes (Dual-aspect wrap balcony)","garage":1,"garden":false,"pool":"Yes (Building Rooftop Infinity Pool)","wineCellar":false,"smartHome":"Yes (Smart Access System)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-11', 'Bel Air Modernist Villa', 'Bel Air, California', 'buy', 'villa',
  3, 3, 3, 2,
  4750000, '$4,750,000', true, 310, 950, '310 m² (3,336 sq ft)',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Intimate architectural gem shielded by mature olive groves with an indoor-outdoor seamless glass pocket door system and heated saltwater lap pool.', ARRAY['Lap Pool', 'Architectural Concrete', 'Olive Grove Patio']::TEXT[], false, '{"homeAreaSqM":310,"landAreaSqM":950,"bedrooms":3,"bathrooms":3,"livingRooms":2,"pantry":"Yes (Butler''s Pantry)","alfrescoOutdoor":"Large alfresco + pool","garage":2,"garden":"Yes (Mature Olive Grove Patio)","pool":"Yes (Saltwater Lap Pool)","wineCellar":false,"smartHome":"Yes (Seamless Pocket Door Automation)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-12', 'Canyon Rim Townhouse', 'Austin, Texas', 'rent', 'townhouse',
  3, 3, 3, 2,
  8200, '$8,200/mo', false, 260, 420, '260 m² (2,798 sq ft)',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Three-story architectural townhouse bordering greenbelt nature reserves with a panoramic private rooftop deck and smart energy storage.', ARRAY['Rooftop Deck', 'Greenbelt Access', 'Smart Lock Automation']::TEXT[], false, '{"homeAreaSqM":260,"landAreaSqM":420,"bedrooms":3,"bathrooms":3,"livingRooms":2,"pantry":"Yes (Walk-in Pantry)","alfrescoOutdoor":"Large alfresco + rooftop deck","garage":2,"garden":"Yes (Greenbelt Border Garden)","pool":false,"wineCellar":false,"smartHome":"Yes (Tesla Powerwall & Solar Storage)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-13', 'Pacifica Heights Estate', 'Pacific Palisades, California', 'buy', 'estate',
  4, 4, 5, 3,
  11200000, '$11,200,000', true, 520, 1950, '520 m² (5,597 sq ft)',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Sublime coastal compound poised above Santa Monica bay featuring private gated drive, limestone floors, dual master retreats, and curated sculpture gardens.', ARRAY['Ocean Breezes', 'Infinity Edge Hot Tub', 'Sub-Zero Staging', 'Security Guarded']::TEXT[], false, '{"homeAreaSqM":520,"landAreaSqM":1950,"bedrooms":4,"bathrooms":5,"livingRooms":3,"pantry":"Yes (Sub-Zero Staging Pantry)","alfrescoOutdoor":"Large alfresco + pool","garage":3,"garden":"Yes (Curated Sculpture Gardens)","pool":"Yes (Infinity Edge Oceanview Hot Tub & Pool)","wineCellar":"Yes (Dual Temperature Cellar)","smartHome":"Yes (Gated Security & Automation)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.properties (
  id, title, location, purpose, type, bhk, bedrooms, bathrooms, garage,
  price, formatted_price, is_luxury, home_area_sqm, land_area_sqm, size,
  image, images, description, features, featured, specs
) VALUES (
  'prop-14', 'Golden Gate Classical Manor', 'Presidio Heights, San Francisco', 'buy', 'estate',
  5, 5, 6, 3,
  16900000, '$16,900,000', true, 740, 1600, '740 m² (7,965 sq ft)',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80', ARRAY['https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80']::TEXT[], 'Timeless classical architectural estate renovated to contemporary passive-house standards with uninterrupted views of the Golden Gate Bridge.', ARRAY['Golden Gate Bridge Views', 'Private Courtyard', 'Wine Tasting Lounge']::TEXT[], true, '{"homeAreaSqM":740,"landAreaSqM":1600,"bedrooms":5,"bathrooms":6,"livingRooms":4,"pantry":"Yes (Catering Scullery & Pantry)","alfrescoOutdoor":"Large alfresco + courtyard","garage":3,"garden":"Yes (Formal Parterre Courtyard Garden)","pool":false,"wineCellar":"Yes (Tasting Room & Cellar)","smartHome":"Yes (Passive House Energy Management)"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
