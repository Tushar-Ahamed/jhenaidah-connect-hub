import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const galleryImages = [gallery1, gallery2, gallery3, gallery4];

export type CommitteeMember = { name: string; position: string };

export type Upazila = {
  slug: string;
  name: string;
  members: number;
  intro: string;
  president: string;
  secretary: string;
  committee: CommitteeMember[];
  /** approximate position (%) on the district map SVG */
  map: { x: number; y: number };
};

export const upazilas: Upazila[] = [
  {
    slug: "jhenaidah-sadar",
    name: "ঝিনাইদহ সদর",
    members: 142,
    intro:
      "ঝিনাইদহ সদর উপজেলা শাখা রাজশাহী বিশ্ববিদ্যালয়ে অধ্যয়নরত সদর উপজেলার শিক্ষার্থীদের একটি প্রাণবন্ত সংগঠন।",
    president: "মো. সাইফুল ইসলাম",
    secretary: "তানভীর হাসান",
    committee: [
      { name: "মো. সাইফুল ইসলাম", position: "সভাপতি" },
      { name: "তানভীর হাসান", position: "সাধারণ সম্পাদক" },
      { name: "নুসরাত জাহান", position: "সহ-সভাপতি" },
      { name: "আরিফুল ইসলাম", position: "অর্থ সম্পাদক" },
    ],
    map: { x: 50, y: 42 },
  },
  {
    slug: "harinakunda",
    name: "হরিণাকুণ্ডু",
    members: 78,
    intro: "হরিণাকুণ্ডু উপজেলা শাখা শিক্ষা, সংস্কৃতি ও সামাজিক উন্নয়নে নিয়মিত কাজ করছে।",
    president: "রিফাত আহমেদ",
    secretary: "নাবিলা আক্তার",
    committee: [
      { name: "রিফাত আহমেদ", position: "সভাপতি" },
      { name: "নাবিলা আক্তার", position: "সাধারণ সম্পাদক" },
      { name: "শাকিল মাহমুদ", position: "সাংগঠনিক সম্পাদক" },
    ],
    map: { x: 42, y: 22 },
  },
  {
    slug: "shailkupa",
    name: "শৈলকুপা",
    members: 96,
    intro: "শৈলকুপা উপজেলা শাখা নবীনবরণ, শিক্ষা সহায়তা ও সামাজিক কর্মকাণ্ডে অগ্রণী।",
    president: "ইমরান হোসেন",
    secretary: "ফারহানা ইয়াসমিন",
    committee: [
      { name: "ইমরান হোসেন", position: "সভাপতি" },
      { name: "ফারহানা ইয়াসমিন", position: "সাধারণ সম্পাদক" },
      { name: "মাহফুজা খাতুন", position: "প্রচার সম্পাদক" },
    ],
    map: { x: 62, y: 18 },
  },
  {
    slug: "kaliganj",
    name: "কালীগঞ্জ",
    members: 88,
    intro: "কালীগঞ্জ উপজেলা শাখা শিক্ষার্থীদের পারস্পরিক সহযোগিতা ও নেতৃত্ব বিকাশে কাজ করছে।",
    president: "আশরাফুল আলম",
    secretary: "সুমাইয়া পারভীন",
    committee: [
      { name: "আশরাফুল আলম", position: "সভাপতি" },
      { name: "সুমাইয়া পারভীন", position: "সাধারণ সম্পাদক" },
      { name: "তাহমিদ রহমান", position: "কোষাধ্যক্ষ" },
    ],
    map: { x: 68, y: 55 },
  },
  {
    slug: "kotchandpur",
    name: "কোটচাঁদপুর",
    members: 64,
    intro: "কোটচাঁদপুর উপজেলা শাখা একটি ছোট কিন্তু সক্রিয় পরিবার।",
    president: "মেহেদী হাসান",
    secretary: "জান্নাতুল ফেরদৌস",
    committee: [
      { name: "মেহেদী হাসান", position: "সভাপতি" },
      { name: "জান্নাতুল ফেরদৌস", position: "সাধারণ সম্পাদক" },
    ],
    map: { x: 40, y: 68 },
  },
  {
    slug: "moheshpur",
    name: "মহেশপুর",
    members: 71,
    intro: "মহেশপুর উপজেলা শাখা সাংস্কৃতিক ও সামাজিক কর্মকাণ্ডে সক্রিয়।",
    president: "রাকিবুল ইসলাম",
    secretary: "তাসনিম জাহান",
    committee: [
      { name: "রাকিবুল ইসলাম", position: "সভাপতি" },
      { name: "তাসনিম জাহান", position: "সাধারণ সম্পাদক" },
      { name: "ফাহিম শাহরিয়ার", position: "ক্রীড়া সম্পাদক" },
    ],
    map: { x: 32, y: 82 },
  },
];

export const stats = [
  { label: "মোট সদস্য", value: "৫৩৯+" },
  { label: "অ্যালামনাই", value: "১,২০০+" },
  { label: "উপজেলা শাখা", value: "০৬" },
  { label: "প্রতিষ্ঠা সাল", value: "১৯৯৮" },
];

export type Notice = {
  id: string;
  title: string;
  date: string;
  scope: "জেলা" | string;
  level: "district" | "upazila";
  excerpt: string;
};

export const notices: Notice[] = [
  {
    id: "n1",
    title: "বার্ষিক পুনর্মিলনী ২০২৫ — রেজিস্ট্রেশন শুরু",
    date: "১৫ মার্চ, ২০২৫",
    scope: "জেলা",
    level: "district",
    excerpt: "আগামী ২৫ এপ্রিল ঝিনাইদহ জেলা সমিতির বার্ষিক পুনর্মিলনী অনুষ্ঠিত হবে। নিবন্ধন চলছে।",
  },
  {
    id: "n2",
    title: "নবীনবরণ অনুষ্ঠান — সদর শাখা",
    date: "১০ মার্চ, ২০২৫",
    scope: "ঝিনাইদহ সদর",
    level: "upazila",
    excerpt: "সদর উপজেলার নতুন সদস্যদের জন্য নবীনবরণ অনুষ্ঠানের ঘোষণা।",
  },
  {
    id: "n3",
    title: "শীতবস্ত্র বিতরণ কর্মসূচি",
    date: "০২ ফেব্রুয়ারি, ২০২৫",
    scope: "জেলা",
    level: "district",
    excerpt: "সমিতির পক্ষ থেকে ৫০০ পরিবারের মাঝে শীতবস্ত্র বিতরণ সম্পন্ন।",
  },
  {
    id: "n4",
    title: "বৃক্ষরোপণ কর্মসূচি — শৈলকুপা",
    date: "২০ জানুয়ারি, ২০২৫",
    scope: "শৈলকুপা",
    level: "upazila",
    excerpt: "শৈলকুপা শাখার উদ্যোগে ১০০০ বৃক্ষরোপণ কর্মসূচি গৃহীত।",
  },
  {
    id: "n5",
    title: "রক্তদান কর্মসূচি — কালীগঞ্জ",
    date: "১২ জানুয়ারি, ২০২৫",
    scope: "কালীগঞ্জ",
    level: "upazila",
    excerpt: "কালীগঞ্জ শাখার আয়োজনে স্বেচ্ছায় রক্তদান কর্মসূচি অনুষ্ঠিত।",
  },
  {
    id: "n6",
    title: "জেলা কার্যনির্বাহী সভা",
    date: "০৫ জানুয়ারি, ২০২৫",
    scope: "জেলা",
    level: "district",
    excerpt: "মাসিক কার্যনির্বাহী সভা টিএসসিসিতে অনুষ্ঠিত হবে।",
  },
];

export type Event = {
  id: string;
  title: string;
  date: string;
  venue: string;
  level: "district" | "upazila";
  scope: string;
  description: string;
};

export const events: Event[] = [
  {
    id: "e1",
    title: "বার্ষিক পুনর্মিলনী ২০২৫",
    date: "২৫ এপ্রিল, ২০২৫",
    venue: "শহীদ মিনার প্রাঙ্গণ, রা.বি.",
    level: "district",
    scope: "জেলা",
    description: "বছরের সবচেয়ে বড় আয়োজন — সাংস্কৃতিক অনুষ্ঠান, র‍্যাফেল ড্র, প্রীতিভোজ।",
  },
  {
    id: "e2",
    title: "শিক্ষাবৃত্তি প্রদান অনুষ্ঠান",
    date: "১৮ মে, ২০২৫",
    venue: "সাবাস বাংলাদেশ মাঠ",
    level: "district",
    scope: "জেলা",
    description: "মেধাবী ও আর্থিকভাবে অসচ্ছল ৫০ জন শিক্ষার্থীকে শিক্ষাবৃত্তি।",
  },
  {
    id: "e3",
    title: "ঈদ পুনর্মিলনী",
    date: "১২ এপ্রিল, ২০২৫",
    venue: "টিএসসিসি, রা.বি.",
    level: "district",
    scope: "জেলা",
    description: "ঈদ পরবর্তী পুনর্মিলনী ও সাংস্কৃতিক সন্ধ্যা।",
  },
  {
    id: "e4",
    title: "নবীনবরণ — সদর শাখা",
    date: "২২ মার্চ, ২০২৫",
    venue: "জুবেরী ভবন",
    level: "upazila",
    scope: "ঝিনাইদহ সদর",
    description: "সদর উপজেলার নবীন শিক্ষার্থীদের অভ্যর্থনা।",
  },
  {
    id: "e5",
    title: "ইফতার মাহফিল — মহেশপুর",
    date: "২৮ মার্চ, ২০২৫",
    venue: "ক্যাফেটেরিয়া, রা.বি.",
    level: "upazila",
    scope: "মহেশপুর",
    description: "মহেশপুর শাখার আয়োজনে ইফতার ও দোয়া মাহফিল।",
  },
  {
    id: "e6",
    title: "ক্রীড়া প্রতিযোগিতা — হরিণাকুণ্ডু",
    date: "০৫ এপ্রিল, ২০২৫",
    venue: "শহীদ মিনার মাঠ",
    level: "upazila",
    scope: "হরিণাকুণ্ডু",
    description: "আন্তঃসদস্য ক্রিকেট ও ফুটবল টুর্নামেন্ট।",
  },
];

export type Member = {
  id: string;
  name: string;
  position?: string;
  department: string;
  session: string;
  hall: string;
  upazila: string;
  isAlumni?: boolean;
  current?: string;
};

export const districtCommittee: Member[] = [
  { id: "m1", name: "অধ্যাপক ড. কামরুল হাসান", position: "সভাপতি", department: "ইতিহাস বিভাগ", session: "১৯৯২-৯৩", hall: "শহীদ হবিবুর রহমান হল", upazila: "ঝিনাইদহ সদর" },
  { id: "m2", name: "মো. সাইফুল ইসলাম", position: "সাধারণ সম্পাদক", department: "আইন বিভাগ", session: "২০১৮-১৯", hall: "মতিহার হল", upazila: "ঝিনাইদহ সদর" },
  { id: "m3", name: "তানভীর হাসান", position: "সাংগঠনিক সম্পাদক", department: "ব্যবস্থাপনা", session: "২০১৯-২০", hall: "সৈয়দ আমীর আলী হল", upazila: "হরিণাকুণ্ডু" },
  { id: "m4", name: "ফারহানা ইয়াসমিন", position: "মহিলা বিষয়ক সম্পাদক", department: "বাংলা", session: "২০২০-২১", hall: "রোকেয়া হল", upazila: "শৈলকুপা" },
  { id: "m5", name: "রিফাত আহমেদ", position: "অর্থ সম্পাদক", department: "অ্যাকাউন্টিং", session: "২০১৯-২০", hall: "শাহ মখদুম হল", upazila: "হরিণাকুণ্ডু" },
  { id: "m6", name: "সুমাইয়া পারভীন", position: "প্রচার সম্পাদক", department: "গণযোগাযোগ ও সাংবাদিকতা", session: "২০২০-২১", hall: "তাপসী রাবেয়া হল", upazila: "কালীগঞ্জ" },
];

export const members: Member[] = [
  ...districtCommittee,
  { id: "g1", name: "আরিফুল ইসলাম", department: "পদার্থবিজ্ঞান", session: "২০২১-২২", hall: "শাহ মখদুম হল", upazila: "ঝিনাইদহ সদর" },
  { id: "g2", name: "নুসরাত জাহান", department: "ইংরেজি", session: "২০২২-২৩", hall: "রোকেয়া হল", upazila: "ঝিনাইদহ সদর" },
  { id: "g3", name: "শাকিল মাহমুদ", department: "রসায়ন", session: "২০২১-২২", hall: "মাদার বখ্শ হল", upazila: "হরিণাকুণ্ডু" },
  { id: "g4", name: "মাহফুজা খাতুন", department: "অর্থনীতি", session: "২০২০-২১", hall: "মন্নুজান হল", upazila: "শৈলকুপা" },
  { id: "g5", name: "তাহমিদ রহমান", department: "ফাইন্যান্স", session: "২০১৯-২০", hall: "মতিহার হল", upazila: "কালীগঞ্জ" },
  { id: "g6", name: "ফাহিম শাহরিয়ার", department: "ফার্মেসি", session: "২০২২-২৩", hall: "শের-ই-বাংলা হল", upazila: "মহেশপুর" },
  { id: "g7", name: "জান্নাতুল ফেরদৌস", department: "সমাজবিজ্ঞান", session: "২০২১-২২", hall: "তাপসী রাবেয়া হল", upazila: "কোটচাঁদপুর" },
  { id: "g8", name: "মেহেদী হাসান", department: "পরিসংখ্যান", session: "২০২০-২১", hall: "শহীদ জিয়াউর রহমান হল", upazila: "কোটচাঁদপুর" },
  { id: "g9", name: "তাসনিম জাহান", department: "মনোবিজ্ঞান", session: "২০২২-২৩", hall: "বেগম খালেদা জিয়া হল", upazila: "মহেশপুর" },
  { id: "g10", name: "ইমরান হোসেন", department: "মার্কেটিং", session: "২০১৯-২০", hall: "নবাব আব্দুল লতিফ হল", upazila: "শৈলকুপা" },
];

export const alumni: Member[] = [
  { id: "a1", name: "ড. মাহবুবুর রহমান", department: "অর্থনীতি", session: "১৯৮৮-৮৯", hall: "শহীদ হবিবুর রহমান হল", upazila: "ঝিনাইদহ সদর", isAlumni: true, current: "অধ্যাপক, ঢাকা বিশ্ববিদ্যালয়" },
  { id: "a2", name: "ব্যারিস্টার শারমিন আক্তার", department: "আইন", session: "১৯৯৫-৯৬", hall: "রোকেয়া হল", upazila: "কালীগঞ্জ", isAlumni: true, current: "সিনিয়র অ্যাডভোকেট, সুপ্রিম কোর্ট" },
  { id: "a3", name: "প্রকৌশলী সাজ্জাদ হোসেন", department: "ফলিত পদার্থবিজ্ঞান", session: "২০০০-০১", hall: "মতিহার হল", upazila: "শৈলকুপা", isAlumni: true, current: "সিনিয়র ইঞ্জিনিয়ার, বুয়েট" },
  { id: "a4", name: "ডা. ফারজানা ইয়াসমিন", department: "প্রাণরসায়ন", session: "২০০২-০৩", hall: "মন্নুজান হল", upazila: "মহেশপুর", isAlumni: true, current: "মেডিকেল অফিসার, বিএসএমএমইউ" },
  { id: "a5", name: "মো. আশরাফুল হক", department: "ব্যবস্থাপনা", session: "১৯৯৮-৯৯", hall: "সৈয়দ আমীর আলী হল", upazila: "হরিণাকুণ্ডু", isAlumni: true, current: "জিএম, ব্র্যাক ব্যাংক" },
  { id: "a6", name: "সাংবাদিক রুমানা পারভীন", department: "গণযোগাযোগ ও সাংবাদিকতা", session: "২০০৫-০৬", hall: "তাপসী রাবেয়া হল", upazila: "কোটচাঁদপুর", isAlumni: true, current: "সিনিয়র রিপোর্টার, প্রথম আলো" },
];

export const galleryCategories = [
  "নবীনবরণ",
  "পুনর্মিলনী",
  "রক্তদান",
  "ইফতার মাহফিল",
  "সাংস্কৃতিক অনুষ্ঠান",
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryItem = { id: string; src: string; title: string; category: GalleryCategory };
export const galleryItems: GalleryItem[] = [
  { id: "p1", src: gallery1, title: "নবীনবরণ ২০২৪", category: "নবীনবরণ" },
  { id: "p2", src: gallery2, title: "সদর শাখা নবীনবরণ", category: "নবীনবরণ" },
  { id: "p3", src: gallery3, title: "বার্ষিক পুনর্মিলনী ২০২৪", category: "পুনর্মিলনী" },
  { id: "p4", src: gallery4, title: "প্রাক্তনদের মিলনমেলা", category: "পুনর্মিলনী" },
  { id: "p5", src: gallery1, title: "রক্তদান কর্মসূচি", category: "রক্তদান" },
  { id: "p6", src: gallery2, title: "স্বেচ্ছায় রক্তদান", category: "রক্তদান" },
  { id: "p7", src: gallery3, title: "ইফতার মাহফিল", category: "ইফতার মাহফিল" },
  { id: "p8", src: gallery4, title: "রমজান মাহফিল", category: "ইফতার মাহফিল" },
  { id: "p9", src: gallery1, title: "সাংস্কৃতিক সন্ধ্যা", category: "সাংস্কৃতিক অনুষ্ঠান" },
  { id: "p10", src: gallery2, title: "লোকসংগীত পরিবেশনা", category: "সাংস্কৃতিক অনুষ্ঠান" },
];

export const departments = Array.from(new Set([...members, ...alumni].map((m) => m.department)));
export const sessions = Array.from(new Set([...members, ...alumni].map((m) => m.session))).sort();
export const halls = Array.from(new Set([...members, ...alumni].map((m) => m.hall)));
