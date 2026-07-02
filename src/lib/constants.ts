export const UPAZILAS = [
  "ঝিনাইদহ সদর",
  "হরিণাকুণ্ডু",
  "শৈলকুপা",
  "কালীগঞ্জ",
  "কোটচাঁদপুর",
  "মহেশপুর",
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
