import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { events, galleryItems, members, notices, upazilas } from "@/lib/data";

export const Route = createFileRoute("/upazila/$slug")({
  loader: ({ params }) => {
    const u = upazilas.find((x) => x.slug === params.slug);
    if (!u) throw notFound();
    return { upazila: u };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.upazila.name ?? "উপজেলা"} শাখা — ঝিনাইদহ জেলা সমিতি` },
      { name: "description", content: loaderData?.upazila.intro ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <PageShell title="উপজেলা পাওয়া যায়নি">
      <Link to="/upazilas" className="text-primary hover:underline">← সব উপজেলা দেখুন</Link>
    </PageShell>
  ),
  component: UpazilaPage,
});

function UpazilaPage() {
  const { upazila } = Route.useLoaderData();
  const upMembers = members.filter((m) => m.upazila === upazila.name);
  const upNotices = notices.filter((n) => n.scope === upazila.name);
  const upEvents = events.filter((e) => e.scope === upazila.name);

  return (
    <PageShell title={`${upazila.name} উপজেলা শাখা`} subtitle={upazila.intro}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="মোট সদস্য" value={`${upazila.members}+`} />
        <Stat label="সভাপতি" value={upazila.president} />
        <Stat label="সাধারণ সম্পাদক" value={upazila.secretary} />
      </div>

      <Section title="উপজেলা কমিটি">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upazila.committee.map((m) => (
            <div key={m.name} className="card-elevated p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-banner text-xl font-bold text-white">
                {m.name.charAt(0)}
              </div>
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-xs text-brand-red">{m.position}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="সদস্য তালিকা">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3">নাম</th>
                <th className="p-3">বিভাগ</th>
                <th className="p-3">সেশন</th>
                <th className="p-3">হল</th>
              </tr>
            </thead>
            <tbody>
              {upMembers.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="p-3 font-medium">{m.name}</td>
                  <td className="p-3 text-muted-foreground">{m.department}</td>
                  <td className="p-3 text-muted-foreground">{m.session}</td>
                  <td className="p-3 text-muted-foreground">{m.hall}</td>
                </tr>
              ))}
              {upMembers.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">কোনো সদস্য পাওয়া যায়নি</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">উপজেলা নোটিশ</h2>
          <div className="mt-4 space-y-3">
            {upNotices.length === 0 && <div className="card-elevated p-4 text-sm text-muted-foreground">কোনো নোটিশ নেই</div>}
            {upNotices.map((n) => (
              <div key={n.id} className="card-elevated p-4">
                <div className="text-xs text-muted-foreground">{n.date}</div>
                <div className="mt-1 font-semibold">{n.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">উপজেলা ইভেন্ট</h2>
          <div className="mt-4 space-y-3">
            {upEvents.length === 0 && <div className="card-elevated p-4 text-sm text-muted-foreground">কোনো ইভেন্ট নেই</div>}
            {upEvents.map((e) => (
              <div key={e.id} className="card-elevated p-4">
                <div className="text-xs text-muted-foreground">{e.date} • {e.venue}</div>
                <div className="mt-1 font-semibold">{e.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section title="গ্যালারি">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.slice(0, 4).map((g) => (
            <img key={g.id} src={g.src} alt={g.title} loading="lazy" className="h-44 w-full rounded-lg object-cover" />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-elevated p-5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
