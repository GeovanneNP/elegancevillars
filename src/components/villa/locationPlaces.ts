// Coordinates geocoded from OpenStreetMap (Nominatim), October 2026.
// Villars is the village centre, not the apartment's exact address.
export type Category = "lifestyle" | "montagne" | "education";
export type PoiId =
  | "villars" | "palace" | "golf" | "roc" | "bretaye" | "lake" | "glacier"
  | "beausoleil" | "aiglon" | "garenne" | "aigle" | "bex";

export type Poi = {
  id: PoiId;
  lngLat: [number, number];
  category: Category | "origin" | "region";
  tier: 0 | 1 | 2;
  primary?: boolean;
};

export const pois: Poi[] = [
  { id: "villars", lngLat: [7.055331, 46.297764], category: "origin", tier: 0 },
  { id: "palace", lngLat: [7.056441, 46.296794], category: "lifestyle", tier: 0, primary: true },
  { id: "golf", lngLat: [7.079067, 46.311033], category: "lifestyle", tier: 1 },
  { id: "roc", lngLat: [7.064509, 46.322558], category: "montagne", tier: 0, primary: true },
  { id: "bretaye", lngLat: [7.073356, 46.320034], category: "montagne", tier: 1 },
  { id: "lake", lngLat: [7.085751, 46.333104], category: "montagne", tier: 1 },
  { id: "glacier", lngLat: [7.205478, 46.35424], category: "montagne", tier: 2 },
  { id: "beausoleil", lngLat: [7.052551, 46.299235], category: "education", tier: 0 },
  { id: "aiglon", lngLat: [7.047016, 46.302548], category: "education", tier: 0 },
  { id: "garenne", lngLat: [7.050315, 46.304607], category: "education", tier: 0 },
  { id: "aigle", lngLat: [6.968893, 46.317901], category: "region", tier: 2 },
  { id: "bex", lngLat: [7.012388, 46.251378], category: "region", tier: 2 },
];

export const categories: Category[] = ["lifestyle", "montagne", "education"];
