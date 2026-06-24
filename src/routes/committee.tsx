import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { districtCommittee } from "@/lib/data";

export const Route = createFileRoute("/committee")({
  head: () => ({
    meta: [
      { title: "জেলা কমিটি — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "ঝিনাইদহ জেলা সমিতির বর্তমান নির্বাহী কমিটি।" },
    ],
  }),
  component: CommitteePage,
});

function CommitteePage() {
  return (
    <PageShell title="জেলা নির্বাহী কমিটি" subtitle="বর্তমান কার্যকরী কমিটির সদস্যবৃন্দ।">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {districtCommittee.map((m) => (
          <div key={m.id} className="card-elevated card-elevated-hover p-6 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-banner text-2xl font-bold text-white">
              {m.name.charAt(0)}
            </div>
            <div className="mt-4 text-lg font-bold">{m.name}</div>
            <div className="text-sm font-semibold text-brand-red">{m.position}</div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>{m.department} • {m.session}</div>
              <div>{m.hall}</div>
              <div>উপজেলা: {m.upazila}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
