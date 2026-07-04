export const UPAZILAS = [
  "ঝিনাইদহ সদর",
  "হরিণাকুণ্ডু",
  "শৈলকুপা",
  "কালীগঞ্জ",
  "কোটচাঁদপুর",
  "মহেশপুর",
] as const;

export type UpazilaName = (typeof UPAZILAS)[number];

// Static map metadata (slug + approximate coord on the SVG); data comes from DB
export const UPAZILA_META: Record<
  UpazilaName,
  { slug: string; map: { x: number; y: number } }
> = {
  "ঝিনাইদহ সদর": { slug: "jhenaidah-sadar", map: { x: 50, y: 42 } },
  "হরিণাকুণ্ডু": { slug: "harinakunda", map: { x: 42, y: 22 } },
  "শৈলকুপা": { slug: "shailkupa", map: { x: 62, y: 18 } },
  "কালীগঞ্জ": { slug: "kaliganj", map: { x: 68, y: 55 } },
  "কোটচাঁদপুর": { slug: "kotchandpur", map: { x: 40, y: 68 } },
  "মহেশপুর": { slug: "moheshpur", map: { x: 32, y: 82 } },
};

export const UPAZILA_LIST = UPAZILAS.map((name) => ({
  name,
  slug: UPAZILA_META[name].slug,
  map: UPAZILA_META[name].map,
}));

export const slugToUpazila = (slug: string): UpazilaName | undefined =>
  UPAZILAS.find((n) => UPAZILA_META[n].slug === slug);

export const MEMBER_TYPES = [
  { value: "student", label: "বর্তমান শিক্ষার্থী" },
  { value: "alumni", label: "অ্যালামনাই" },
  { value: "teacher", label: "শিক্ষক" },
] as const;

export const GALLERY_CATEGORIES = [
  "নবীনবরণ",
  "পুনর্মিলনী",
  "রক্তদান",
  "ইফতার মাহফিল",
  "সাংস্কৃতিক অনুষ্ঠান",
] as const;

// convert roll number to internal email for Supabase auth
export const rollToEmail = (roll: string) =>
  `${roll.trim().toLowerCase().replace(/[^a-z0-9]/g, "")}@zsru.local`;
