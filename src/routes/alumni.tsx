import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GraduationCap, Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { alumni, upazilas } from "@/lib/data";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [
      { title: "অ্যালামনাই নেটওয়ার্ক — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "প্রাক্তন সদস্যদের নেটওয়ার্ক ও পরিচিতি।" },
    ],
  }),
  component: AlumniPage,
});

function AlumniPage() {
  const [q, setQ] = useState("");
  const [u, setU] = useState("");
  const filtered = useMemo(() =>
    alumni.filter((a) =>
      (!q || a.name.includes(q) || a.current?.includes(q)) &&
      (!u || a.upazila === u)
    ), [q, u]);

  return (
    <PageShell title="অ্যালামনাই নেটওয়ার্ক" subtitle="দেশ-বিদেশে কর্মরত আমাদের প্রাক্তন সদস্যবৃন্দ।">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat value="১,২০০+" label="মোট অ্যালামনাই" />
        <Stat value="৩৫+" label="দেশে কর্মরত" />
        <Stat value="৬টি" label="পেশাগত খাত" />
      </div>

      <div className="card-elevated mb-6 grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="নাম বা পেশা অনুসন্ধান..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={u}
          onChange={(e) => setU(e.target.value)}
          className="rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">সব উপজেলা</option>
          {upazilas.map((x) => <option key={x.slug} value={x.name}>{x.name}</option>)}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <div key={a.id} className="card-elevated card-elevated-hover p-6">
            <div className="flex items-center gap-2 text-xs">
              <GraduationCap className="h-4 w-4 text-brand-red" />
              <span className="font-semibold text-brand-red">অ্যালামনাই</span>
              <span className="text-muted-foreground">• {a.session}</span>
            </div>
            <div className="mt-3 flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full gradient-banner text-xl font-bold text-white">
                {a.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-bold">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.department}</div>
                <div className="text-xs text-muted-foreground">{a.hall}</div>
              </div>
            </div>
            {a.current && (
              <div className="mt-4 rounded-lg bg-secondary p-3 text-xs">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">বর্তমান পদ</div>
                <div className="mt-1 font-semibold">{a.current}</div>
              </div>
            )}
            <div className="mt-3 text-xs text-muted-foreground">উপজেলা: {a.upazila}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-elevated p-5 text-center">
      <div className="text-3xl font-bold text-gradient-brand">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
