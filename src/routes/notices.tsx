import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/notices")({
  head: () => ({
    meta: [
      { title: "নোটিশ বোর্ড — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "জেলা ও উপজেলা শাখার সাম্প্রতিক নোটিশসমূহ।" },
    ],
  }),
  component: NoticesPage,
});

const TABS = [
  { key: "all", label: "সব নোটিশ" },
  { key: "district", label: "জেলা নোটিশ" },
  { key: "upazila", label: "উপজেলা নোটিশ" },
] as const;

function NoticesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const list = (data ?? []).filter((n: any) => tab === "all" || n.level === tab);

  return (
    <PageShell title="নোটিশ বোর্ড" subtitle="জেলা ও উপজেলা শাখার সকল নোটিশ এক জায়গায়।">
      <div className="mb-6 -mx-1 flex gap-1 overflow-x-auto rounded-lg border border-border bg-secondary p-1 sm:mx-0 sm:inline-flex sm:overflow-visible">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${tab === t.key ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground">লোড হচ্ছে...</p>}
      {!isLoading && list.length === 0 && <p className="text-muted-foreground">কোনো নোটিশ নেই।</p>}
      <div className="space-y-4">
        {list.map((n: any) => (
          <article key={n.id} className="card-elevated card-elevated-hover p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-full px-3 py-1 font-semibold ${n.level === "district" ? "bg-primary text-primary-foreground" : "bg-brand-red text-white"}`}>
                {n.level === "district" ? "জেলা" : n.upazila}
              </span>
              <span className="text-muted-foreground">{n.event_date || new Date(n.created_at).toLocaleDateString("bn-BD")}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold">{n.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{n.body}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
