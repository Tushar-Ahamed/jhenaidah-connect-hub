import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { galleryImages } from "@/lib/data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "গ্যালারি — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "বিভিন্ন আয়োজনের ছবির গ্যালারি।" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const grid = [...galleryImages, ...galleryImages, ...galleryImages];
  return (
    <PageShell title="ছবির গ্যালারি" subtitle="আয়োজন, কর্মসূচি ও পুনর্মিলনীর মুহূর্ত।">
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {grid.map((g, i) => (
          <img
            key={i}
            src={g}
            alt=""
            loading="lazy"
            className="mb-4 w-full break-inside-avoid rounded-xl object-cover"
          />
        ))}
      </div>
    </PageShell>
  );
}
