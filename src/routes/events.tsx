import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { events, galleryImages } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "ইভেন্টসমূহ — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "জেলা ও উপজেলা পর্যায়ের আসন্ন ইভেন্ট।" },
    ],
  }),
  component: EventsPage,
});

const TABS = [
  { key: "all", label: "সব ইভেন্ট" },
  { key: "district", label: "জেলা ইভেন্ট" },
  { key: "upazila", label: "উপজেলা ইভেন্ট" },
] as const;

function EventsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const list = events.filter((e) => tab === "all" || e.level === tab);

  return (
    <PageShell title="ইভেন্টসমূহ" subtitle="আসন্ন আয়োজন ও কর্মসূচি।">
      <div className="mb-6 inline-flex rounded-lg border border-border bg-secondary p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {list.map((e, i) => (
          <article key={e.id} className="card-elevated card-elevated-hover overflow-hidden">
            <img src={galleryImages[i % galleryImages.length]} alt="" loading="lazy" className="h-52 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2.5 py-1 font-semibold ${
                  e.level === "district" ? "bg-primary text-primary-foreground" : "bg-brand-red text-white"
                }`}>
                  {e.scope}
                </span>
                <span className="text-muted-foreground">{e.date} • {e.venue}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold">{e.title}</h2>
              <p className="mt-2 text-muted-foreground">{e.description}</p>
              <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                বিস্তারিত
              </button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
