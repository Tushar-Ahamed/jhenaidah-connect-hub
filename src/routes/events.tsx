import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { events, galleryImages } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "ইভেন্টসমূহ — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "আসন্ন ও পূর্ববর্তী ইভেন্টসমূহ।" },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <PageShell title="ইভেন্টসমূহ" subtitle="আসন্ন আয়োজন ও কর্মসূচি।">
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((e, i) => (
          <article key={e.id} className="card-elevated card-elevated-hover overflow-hidden">
            <img src={galleryImages[i % galleryImages.length]} alt="" loading="lazy" className="h-52 w-full object-cover" />
            <div className="p-6">
              <div className="text-xs text-muted-foreground">{e.date} • {e.venue}</div>
              <h2 className="mt-2 text-xl font-bold">{e.title}</h2>
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
