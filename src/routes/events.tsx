import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { galleryImages } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "ইভেন্টসমূহ — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "জেলা ও উপজেলা পর্যায়ের আসন্ন ইভেন্ট।" },
    ],
  }),
  component: EventsPage,
});

const TABS = [
  { key: "all", label: "সব ইভেন্ট" },
  { key: "district", label: "জেলা ইভেন্ট" },
  { key: "upazila", label: "উপজেলা ইভেন্ট" },
] as const;

function EventsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });
  const list = (data ?? []).filter((e: any) => tab === "all" || e.level === tab);

  return (
    <PageShell title="ইভেন্টসমূহ" subtitle="আসন্ন আয়োজন ও কর্মসূচি।">
      <div className="mb-6 -mx-1 flex gap-1 overflow-x-auto rounded-lg border border-border bg-secondary p-1 sm:mx-0 sm:inline-flex sm:overflow-visible">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${tab === t.key ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground">লোড হচ্ছে...</p>}
      {!isLoading && list.length === 0 && <p className="text-muted-foreground">কোনো ইভেন্ট নেই।</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {list.map((e: any, i: number) => (
          <article key={e.id} className="card-elevated card-elevated-hover overflow-hidden">
            <img src={galleryImages[i % galleryImages.length]} alt="" loading="lazy" className="h-52 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2.5 py-1 font-semibold ${e.level === "district" ? "bg-primary text-primary-foreground" : "bg-brand-red text-white"}`}>
                  {e.level === "district" ? "জেলা" : e.upazila}
                </span>
                <span className="text-muted-foreground">{e.event_date} • {e.venue}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold">{e.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{e.description}</p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
