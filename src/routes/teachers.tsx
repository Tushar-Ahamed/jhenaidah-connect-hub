import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { UPAZILAS } from "@/lib/constants";
import { useProfiles } from "@/lib/queries";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "শিক্ষকবৃন্দ — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "রাজশাহী বিশ্ববিদ্যালয় ও অন্যান্য প্রতিষ্ঠানে কর্মরত ঝিনাইদহের শিক্ষকবৃন্দ।" },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const [q, setQ] = useState("");
  const [u, setU] = useState("");
  const { data: all = [], isLoading } = useProfiles({ member_type: "teacher" });
  const list = all.filter((t) =>
    (!q || (t.full_name ?? "").includes(q) || (t.institution ?? "").includes(q)) &&
    (!u || t.upazila === u),
  );

  return (
    <PageShell title="শিক্ষকবৃন্দ" subtitle="আমাদের জেলার গৌরব — শিক্ষকমণ্ডলী।">
      <div className="card-elevated mb-6 grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="নাম বা প্রতিষ্ঠান অনুসন্ধান..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={u} onChange={(e) => setU(e.target.value)}
          className="rounded-lg border border-input bg-background p-2.5 text-sm">
          <option value="">সব উপজেলা</option>
          {UPAZILAS.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>

      {isLoading && <div className="text-center text-muted-foreground">লোড হচ্ছে...</div>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <div key={t.id} className="card-elevated card-elevated-hover p-6">
            <div className="flex items-center gap-2 text-xs">
              <BookOpen className="h-4 w-4 text-brand-red" />
              <span className="font-semibold text-brand-red">শিক্ষক</span>
            </div>
            <div className="mt-3 flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full gradient-banner text-xl font-bold text-white">
                {(t.full_name ?? "?").charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-bold">{t.full_name}</div>
                {t.designation && <div className="text-xs text-muted-foreground">{t.designation}</div>}
                {t.institution && <div className="text-xs text-muted-foreground">{t.institution}</div>}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {t.department && <Info label="বিভাগ" value={t.department} />}
              {t.upazila && <Info label="উপজেলা" value={t.upazila} />}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && list.length === 0 && (
        <div className="card-elevated p-10 text-center text-muted-foreground">এখনো কোনো শিক্ষক নিবন্ধিত হননি।</div>
      )}
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="truncate font-medium">{value}</div>
    </div>
  );
}
