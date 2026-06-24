import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { districtCommittee, events, galleryImages, notices, upazilas } from "@/lib/data";

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
  const members = districtCommittee.filter((m) => m.upazila === upazila.name).slice(0, 4);

  return (
    <PageShell title={`${upazila.name} উপজেলা শাখা`} subtitle={upazila.intro}>
      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="মোট সদস্য" value={`${upazila.members}+`} />
        <Stat label="সভাপতি" value={upazila.president} />
        <Stat label="সাধারণ সম্পাদক" value={upazila.secretary} />
      </div>

      {/* Committee */}
      <Section title="উপজেলা কমিটি">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{name: upazila.president, position: "সভাপতি"}, {name: upazila.secretary, position: "সাধারণ সম্পাদক"}, ...members].slice(0,4).map((m, i) => (
            <div key={i} className="card-elevated p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-banner text-xl font-bold text-white">
                {m.name.charAt(0)}
              </div>
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-xs text-brand-red">{m.position}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Member directory */}
      <Section title="সদস্য তালিকা (নমুনা)">
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
              {districtCommittee.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="p-3 font-medium">{m.name}</td>
                  <td className="p-3 text-muted-foreground">{m.department}</td>
                  <td className="p-3 text-muted-foreground">{m.session}</td>
                  <td className="p-3 text-muted-foreground">{m.hall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Notices + Events */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">নোটিশ</h2>
          <div className="mt-4 space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="card-elevated p-4">
                <div className="text-xs text-muted-foreground">{n.date}</div>
                <div className="mt-1 font-semibold">{n.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">ইভেন্ট</h2>
          <div className="mt-4 space-y-3">
            {events.slice(0, 3).map((e) => (
              <div key={e.id} className="card-elevated p-4">
                <div className="text-xs text-muted-foreground">{e.date} • {e.venue}</div>
                <div className="mt-1 font-semibold">{e.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <Section title="গ্যালারি">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((g, i) => (
            <img key={i} src={g} alt="" loading="lazy" className="h-44 w-full rounded-lg object-cover" />
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
