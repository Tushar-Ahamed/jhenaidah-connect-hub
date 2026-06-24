import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { notices } from "@/lib/data";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "নোটিশ বোর্ড — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "জেলা ও উপজেলা শাখার সাম্প্রতিক নোটিশসমূহ।" },
    ],
  }),
  component: NoticesPage,
});

function NoticesPage() {
  return (
    <PageShell title="নোটিশ বোর্ড" subtitle="জেলা ও উপজেলা শাখার সকল নোটিশ এক জায়গায়।">
      <div className="space-y-4">
        {notices.map((n) => (
          <article key={n.id} className="card-elevated card-elevated-hover p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">
                {n.scope}
              </span>
              <span className="text-muted-foreground">{n.date}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold">{n.title}</h2>
            <p className="mt-2 text-muted-foreground">{n.excerpt}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
