import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { galleryCategories, galleryItems, type GalleryCategory } from "@/lib/data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "গ্যালারি — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "নবীনবরণ, পুনর্মিলনী, রক্তদান, ইফতার মাহফিল ও সাংস্কৃতিক অনুষ্ঠানের ছবি।" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [cat, setCat] = useState<"all" | GalleryCategory>("all");
  const list = galleryItems.filter((g) => cat === "all" || g.category === cat);

  return (
    <PageShell title="ছবির গ্যালারি" subtitle="আয়োজন, কর্মসূচি ও পুনর্মিলনীর মুহূর্ত।">
      <div className="mb-8 flex flex-wrap gap-2">
        <CategoryPill active={cat === "all"} onClick={() => setCat("all")}>সব</CategoryPill>
        {galleryCategories.map((c) => (
          <CategoryPill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</CategoryPill>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => (
          <figure key={g.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-hidden">
              <img
                src={g.src}
                alt={g.title}
                loading="lazy"
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-red">{g.category}</div>
              <div className="mt-1 font-semibold">{g.title}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </PageShell>
  );
}

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "border border-border bg-card text-foreground/70 hover:border-primary hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
