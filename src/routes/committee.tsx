import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useCommittee } from "@/lib/queries";

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
  const { data: list = [], isLoading } = useCommittee("district");

  return (
    <PageShell title="জেলা নির্বাহী কমিটি" subtitle="বর্তমান কার্যকরী কমিটির সদস্যবৃন্দ।">
      {isLoading && <div className="text-center text-muted-foreground">লোড হচ্ছে...</div>}
      {!isLoading && list.length === 0 && (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          কমিটি এখনো প্রকাশ করা হয়নি। জেলা অ্যাডমিন শীঘ্রই আপডেট করবেন।
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <div key={m.id} className="card-elevated card-elevated-hover p-6 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-banner text-2xl font-bold text-white">
              {(m.holder_name ?? "?").charAt(0)}
            </div>
            <div className="mt-4 text-lg font-bold">{m.holder_name ?? "—"}</div>
            <div className="text-sm font-semibold text-brand-red">{m.position_title}</div>
            {m.term_start && (
              <div className="mt-3 text-xs text-muted-foreground">
                মেয়াদ শুরু: {new Date(m.term_start).toLocaleDateString("bn-BD")}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
