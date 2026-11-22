// 3D House Tour & Architectural Specifications for Villa Lumina
// Coordinates are in metres, in the same coordinate system as house.json and the 3D model:
// x runs along the front of the house, y from front to back, z up.

export type Point = [x: number, y: number, z: number];

export type TourStop = {
  slug: string;
  kind: "intro" | "common" | "room" | "outro";
  camera: Point;
  target: Point;
  eyebrow: string;
  title: string;
  subtitle: string;
  text: string;
  photo?: string;
  facts?: string[];
  amenities?: string[];
  price?: number;
  sqm?: number;
  bookingUrl?: string;
};

export const TOUR_STOPS: TourStop[] = [
  {
    slug: "arrival",
    camera: [-1, -16, 3.2],
    target: [3, 4, 2.4],
    kind: "intro",
    eyebrow: "Villa Lumina • Architectural Estate",
    title: "Crafting Luxury Living Experiences",
    subtitle: "A Quiet Masterpiece of Light & Space",
    text: "Three private residential suites, open artisan lounge with wood hearth, and private garden terraces. Scroll to lift the roof and experience the architectural walkthrough room by room.",
    photo: "/media/rooms/exterior.webp",
  },
  {
    slug: "overview",
    camera: [8, -6.5, 17],
    target: [8, 4.2, 0],
    kind: "intro",
    eyebrow: "Ground Level • 380 m² Total Footprint",
    title: "Open Architecture & Harmony",
    subtitle: "Bespoke Single-Level Residence",
    text: "Single-level bespoke living designed with seamless transitions between indoor comfort and natural outdoor gardens. Click any suite on the plan or continue scrolling to inspect each space.",
    facts: ["380 m² Estate", "5 Living Volumes", "Private Woodlands"],
  },
  {
    slug: "lounge",
    camera: [3, -2.2, 11.5],
    target: [3, 2.7, 0.3],
    kind: "common",
    eyebrow: "Living Quarters",
    title: "The Grand Living Pavilion",
    subtitle: "Artisan Wood Hearth & Library",
    text: "Where arrival begins and serene evenings unfold: a sunken wood-burning hearth, deep Italian leather armchairs, and floor-to-ceiling glass framing views of the private garden grounds.",
    photo: "/media/rooms/lounge.webp",
    facts: ["68 m² Living Area", "Double-Height Ceiling", "Artisan Wood Hearth"],
    amenities: [
      "Custom masonry fireplace",
      "Curated library & wine bar",
      "Architectural acoustic insulation",
      "Concealed Bowers & Wilkins audio",
    ],
  },
  {
    slug: "breakfast-room",
    camera: [8.5, -2.2, 11.5],
    target: [8.5, 2.7, 0.3],
    kind: "common",
    eyebrow: "Culinary & Dining Suite",
    title: "The Culinary & Dining Salon",
    subtitle: "Bespoke Ten-Seat Artisan Table",
    text: "An open communal gathering space featuring a hand-hewn ten-person solid timber table, waterfall marble preparation island, and sliding glass thresholds leading out to the morning terrace.",
    photo: "/media/rooms/breakfast-room.webp",
    facts: ["Seating for 10", "Waterfall Marble Island", "East Garden Terrace"],
    amenities: [
      "Calacatta marble countertops",
      "Sub-Zero & Wolf chef appliances",
      "Custom brushed brass fixtures",
      "Dual climate wine storage",
    ],
  },
  {
    slug: "garden-room",
    camera: [13.5, -2.2, 11.5],
    target: [13.5, 2.7, 0.3],
    kind: "room",
    eyebrow: "Suite 01",
    title: "The Garden Suite",
    subtitle: "East Wing Bedroom Sanctuary",
    text: "A double residential suite with a wide glass threshold opening straight onto the manicured eastern lawn. Bathed in morning light with a tranquil reading corner and garden breezes.",
    photo: "/media/rooms/garden-room.webp",
    facts: ["Sleeps 2", "34 m²", "King-size bed"],
    amenities: [
      "Direct garden lawn access",
      "En-suite rain shower & vanity",
      "Custom white-oak built-in wardrobe",
      "Belgian linen acoustic drapery",
    ],
    price: 450,
    sqm: 34,
  },
  {
    slug: "linen-room",
    camera: [12.4, 2.8, 12.5],
    target: [12.4, 7.8, 0.3],
    kind: "room",
    eyebrow: "Suite 02",
    title: "The Orchard Suite",
    subtitle: "Dual Sleeping Alcoves & Studio",
    text: "Dual architectural sleeping alcoves framing serene views of the heritage orchard at the rear. Ideal for guests, visiting family, or as a private creative executive studio.",
    photo: "/media/rooms/linen-room.webp",
    facts: ["Sleeps 2", "38 m²", "Twin or Queen setup"],
    amenities: [
      "Heritage orchard panorama",
      "En-suite stone bathroom",
      "Bespoke solid walnut writing desk",
      "Quiet acoustic sound dampening",
    ],
    price: 380,
    sqm: 38,
  },
  {
    slug: "courtyard-suite",
    camera: [6.6, 2.6, 13],
    target: [6.7, 7.8, 0.3],
    kind: "room",
    eyebrow: "Primary Suite",
    title: "The Courtyard Master Suite",
    subtitle: "Private Terrace & Freestanding Bath",
    text: "The flagship master retreat of the estate: an emperor-size bed, private fireplace salon alcove, and a sculptural freestanding stone bathtub overlooking the secluded inner courtyard terrace.",
    photo: "/media/rooms/courtyard-suite.webp",
    facts: ["Sleeps 2", "54 m²", "Emperor-size bed"],
    amenities: [
      "Freestanding stone soaking tub",
      "Private courtyard terrace threshold",
      "Lounge salon & open hearth",
      "Concealed dressing gallery",
    ],
    price: 650,
    sqm: 54,
  },
  {
    slug: "departure",
    camera: [22, -14, 5],
    target: [8, 4, 1.5],
    kind: "outro",
    eyebrow: "Private Acquisition & Inquiries",
    title: "Reserve Your Private Experience",
    subtitle: "Villa Lumina • London & Countryside",
    text: "Nestled in pristine woodlands less than an hour from the metropolitan centre. Inquire regarding private estate acquisition, bespoke seasonal residencies, or architectural tours.",
  },
];

export const TOUR_ROOMS = TOUR_STOPS.filter(
  (stop) => stop.kind === "room" || stop.kind === "common"
);

/** Which side of the viewport the detail card sits on */
export function getCardSide(stop: TourStop): "left" | "right" {
  const index = TOUR_ROOMS.indexOf(stop);
  return index >= 0 && index % 2 === 0 ? "right" : "left";
}

export const HOUSE_LAYOUT = {
  footprint: { x: 0, y: 0, w: 16, d: 10 },
  wallHeight: 2.8,
  rooms: [
    { slug: "lounge", x: 0, y: 0, w: 6, d: 5, label: "Grand Lounge" },
    { slug: "breakfast-room", x: 6, y: 0, w: 5, d: 5, label: "Dining Salon" },
    { slug: "garden-room", x: 11, y: 0, w: 5, d: 5, label: "Garden Suite" },
    { slug: "courtyard-suite", x: 0, y: 5, w: 9, d: 5, label: "Master Courtyard" },
    { slug: "linen-room", x: 9, y: 5, w: 7, d: 5, label: "Orchard Suite" },
  ],
  baths: [
    { room: "garden-room", x: 11, y: 3.25, w: 1.6, d: 1.75 },
    { room: "linen-room", x: 14.05, y: 5, w: 1.95, d: 1.75 },
    { room: "courtyard-suite", x: 7.35, y: 6.3, w: 1.65, d: 3.7 },
  ],
};
