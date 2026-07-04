import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { slugToUpazila } from "@/lib/constants";
import { useCommittee, useProfiles, useUpazilaInfo } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { galleryImages } from "@/lib/data";

export const Route = createFileRoute("/upazila/$slug")({
  loader: ({ params }) => {
    const name = slugToUpazila(params.slug);
    if (!name) throw notFound();
    return { upazila: name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.upazila ?? "উপজেলা"} শাখা — ঝিনাইদহ জেলা সমিতি` },
    ],
  }),
  notFoundComponent: () => (
    <PageShell title="উপজেলা পাওয়া যায়নি">
      <Link to="/upazilas" className="text-primary hover:underline">← সব উপজেলা দেখুন</Link>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell title="সমস্যা"><p className="text-muted-foreground">{error.message}</p></PageShell>
  ),
  component: UpazilaPage,
});

function UpazilaPage() {
  const { upazila } = Route.useLoaderData();
  const { data: info } = useUpazilaInfo(upazila);
  const { data: committee = [] } = useCommittee("upazila", upazila);
  const { data: members = [] } = useProfiles({ upazila });

  const { data: notices = [] } = useQuery({
    queryKey: ["upazila_notices", upazila],
    queryFn: async () => {
      const { data, error } = await supabase.from("notices").select("*")
        .eq("upazila", upazila).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: events = [] } = useQuery({
    queryKey: ["upazila_events", upazila],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*")
        .eq("upazila", upazila).order("event_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const president = committee.find((c) => /সভাপতি/.test(c.position_title))?.holder_name ?? "—";
  const secretary = committee.find((c) => /সাধারণ সম্পাদক|সেক্রেটারি/.test(c.position_title))?.holder_name ?? "—";
  const info_ = info as { intro?: string | null } | null | undefined;

  return (
    <PageShell title={`${upazila} উপজেলা শাখা`} subtitle={info_?.intro ?? "উপজেলার পরিচিতি শীঘ্রই আপডেট করা হবে।"}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="মোট সদস্য" value={String(members.length)} />
        <Stat label="সভাপতি" value={president} />
        <Stat label="সাধারণ সম্পাদক" value={secretary} />
      </div>

      <Section title="উপজেলা কমিটি">
        {committee.length === 0 && <div className="card-elevated p-6 text-center text-muted-foreground">কমিটি এখনো প্রকাশ করা হয়নি।</div>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {committee.map((m) => (
            <div key={m.id} className="card-elevated p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-banner text-xl font-bold text-white">
                {(m.holder_name ?? "?").charAt(0)}
              </div>
              <div className="mt-3 font-semibold">{m.holder_name ?? "—"}</div>
              <div className="text-xs text-brand-red">{m.position_title}</div>
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
              {members.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="p-3 font-medium">{m.full_name}</td>
                  <td className="p-3 text-muted-foreground">{m.department}</td>
                  <td className="p-3 text-muted-foreground">{m.session}</td>
                  <td className="p-3 text-muted-foreground">{m.hall}</td>
                </tr>
              ))}
              {members.length === 0 && (
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
            {notices.length === 0 && <div className="card-elevated p-4 text-sm text-muted-foreground">কোনো নোটিশ নেই</div>}
            {notices.map((n: any) => (
              <div key={n.id} className="card-elevated p-4">
                <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString("bn-BD")}</div>
                <div className="mt-1 font-semibold">{n.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">উপজেলা ইভেন্ট</h2>
          <div className="mt-4 space-y-3">
            {events.length === 0 && <div className="card-elevated p-4 text-sm text-muted-foreground">কোনো ইভেন্ট নেই</div>}
            {events.map((e: any) => (
              <div key={e.id} className="card-elevated p-4">
                <div className="text-xs text-muted-foreground">{e.event_date} • {e.venue}</div>
                <div className="mt-1 font-semibold">{e.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section title="গ্যালারি">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="h-44 w-full rounded-lg object-cover" />
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
