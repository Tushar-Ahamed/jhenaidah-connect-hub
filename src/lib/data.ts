import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const galleryImages = [gallery1, gallery2, gallery3, gallery4];

export type Upazila = {
  slug: string;
  name: string;
  members: number;
  intro: string;
  president: string;
  secretary: string;
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
  },
  {
    slug: "harinakunda",
    name: "হরিণাকুণ্ডু",
    members: 78,
    intro:
      "হরিণাকুণ্ডু উপজেলা শাখা শিক্ষা, সংস্কৃতি ও সামাজিক উন্নয়নে নিয়মিতভাবে কাজ করে যাচ্ছে।",
    president: "রিফাত আহমেদ",
    secretary: "নাবিলা আক্তার",
  },
  {
    slug: "shailkupa",
    name: "শৈলকুপা",
    members: 96,
    intro:
      "শৈলকুপা উপজেলা শাখা নবীনদের অভ্যর্থনা, শিক্ষা সহায়তা ও সামাজিক কর্মকাণ্ডে অগ্রণী ভূমিকা রাখছে।",
    president: "ইমরান হোসেন",
    secretary: "ফারহানা ইয়াসমিন",
  },
  {
    slug: "kaliganj",
    name: "কালীগঞ্জ",
    members: 88,
    intro:
      "কালীগঞ্জ উপজেলা শাখা শিক্ষার্থীদের পারস্পরিক সহযোগিতা ও নেতৃত্ব বিকাশে কাজ করছে।",
    president: "আশরাফুল আলম",
    secretary: "সুমাইয়া পারভীন",
  },
  {
    slug: "kotchandpur",
    name: "কোটচাঁদপুর",
    members: 64,
    intro:
      "কোটচাঁদপুর উপজেলা শাখা একটি ছোট কিন্তু সক্রিয় পরিবার, যা ভ্রাতৃত্বে বিশ্বাসী।",
    president: "মেহেদী হাসান",
    secretary: "জান্নাতুল ফেরদৌস",
  },
  {
    slug: "moheshpur",
    name: "মহেশপুর",
    members: 71,
    intro:
      "মহেশপুর উপজেলা শাখা সাংস্কৃতিক ও সামাজিক কর্মকাণ্ডে সক্রিয় অংশগ্রহণ করে।",
    president: "রাকিবুল ইসলাম",
    secretary: "তাসনিম জাহান",
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
  scope: string;
  excerpt: string;
};

export const notices: Notice[] = [
  {
    id: "n1",
    title: "বার্ষিক পুনর্মিলনী ২০২৫ — রেজিস্ট্রেশন শুরু",
    date: "১৫ মার্চ, ২০২৫",
    scope: "জেলা",
    excerpt:
      "আগামী ২৫ এপ্রিল ঝিনাইদহ জেলা সমিতির বার্ষিক পুনর্মিলনী অনুষ্ঠিত হবে। নিবন্ধন চলছে।",
  },
  {
    id: "n2",
    title: "নবীনবরণ অনুষ্ঠান — সদর শাখা",
    date: "১০ মার্চ, ২০২৫",
    scope: "ঝিনাইদহ সদর",
    excerpt: "সদর উপজেলার নতুন সদস্যদের জন্য নবীনবরণ অনুষ্ঠানের ঘোষণা।",
  },
  {
    id: "n3",
    title: "শীতবস্ত্র বিতরণ কর্মসূচি",
    date: "০২ ফেব্রুয়ারি, ২০২৫",
    scope: "জেলা",
    excerpt: "সমিতির পক্ষ থেকে ৫০০ পরিবারের মাঝে শীতবস্ত্র বিতরণ সম্পন্ন।",
  },
  {
    id: "n4",
    title: "বৃক্ষরোপণ কর্মসূচি — শৈলকুপা",
    date: "২০ জানুয়ারি, ২০২৫",
    scope: "শৈলকুপা",
    excerpt: "শৈলকুপা শাখার উদ্যোগে ১০০০ বৃক্ষরোপণ কর্মসূচি গৃহীত।",
  },
];

export type Event = {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
};

export const events: Event[] = [
  {
    id: "e1",
    title: "বার্ষিক পুনর্মিলনী ২০২৫",
    date: "২৫ এপ্রিল, ২০২৫",
    venue: "শহীদ মিনার প্রাঙ্গণ, রা.বি.",
    description:
      "বছরের সবচেয়ে বড় আয়োজন — সাংস্কৃতিক অনুষ্ঠান, র‍্যাফেল ড্র, প্রীতিভোজ।",
  },
  {
    id: "e2",
    title: "শিক্ষাবৃত্তি প্রদান অনুষ্ঠান",
    date: "১৮ মে, ২০২৫",
    venue: "সাবাস বাংলাদেশ মাঠ",
    description: "মেধাবী ও আর্থিকভাবে অসচ্ছল ৫০ জন শিক্ষার্থীকে শিক্ষাবৃত্তি।",
  },
  {
    id: "e3",
    title: "ঈদ পুনর্মিলনী",
    date: "১২ এপ্রিল, ২০২৫",
    venue: "টিএসসিসি, রা.বি.",
    description: "ঈদ পরবর্তী পুনর্মিলনী ও সাংস্কৃতিক সন্ধ্যা।",
  },
];

export type Member = {
  id: string;
  name: string;
  position: string;
  department: string;
  session: string;
  hall: string;
  upazila: string;
};

export const districtCommittee: Member[] = [
  {
    id: "m1",
    name: "অধ্যাপক ড. কামরুল হাসান",
    position: "সভাপতি",
    department: "ইতিহাস বিভাগ",
    session: "১৯৯২-৯৩",
    hall: "শহীদ হবিবুর রহমান হল",
    upazila: "ঝিনাইদহ সদর",
  },
  {
    id: "m2",
    name: "মো. সাইফুল ইসলাম",
    position: "সাধারণ সম্পাদক",
    department: "আইন বিভাগ",
    session: "২০১৮-১৯",
    hall: "মতিহার হল",
    upazila: "ঝিনাইদহ সদর",
  },
  {
    id: "m3",
    name: "তানভীর হাসান",
    position: "সাংগঠনিক সম্পাদক",
    department: "ব্যবস্থাপনা",
    session: "২০১৯-২০",
    hall: "সৈয়দ আমীর আলী হল",
    upazila: "হরিণাকুণ্ডু",
  },
  {
    id: "m4",
    name: "ফারহানা ইয়াসমিন",
    position: "মহিলা বিষয়ক সম্পাদক",
    department: "বাংলা",
    session: "২০২০-২১",
    hall: "রোকেয়া হল",
    upazila: "শৈলকুপা",
  },
  {
    id: "m5",
    name: "রিফাত আহমেদ",
    position: "অর্থ সম্পাদক",
    department: "অ্যাকাউন্টিং",
    session: "২০১৯-২০",
    hall: "শাহ মখদুম হল",
    upazila: "হরিণাকুণ্ডু",
  },
  {
    id: "m6",
    name: "সুমাইয়া পারভীন",
    position: "প্রচার সম্পাদক",
    department: "গণযোগাযোগ ও সাংবাদিকতা",
    session: "২০২০-২১",
    hall: "তাপসী রাবেয়া হল",
    upazila: "কালীগঞ্জ",
  },
];
