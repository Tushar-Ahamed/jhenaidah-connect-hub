import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UPAZILAS } from "@/lib/constants";
import { useRoles } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin/upazila-info")({
  head: () => ({ meta: [{ title: "উপজেলা পরিচিতি পরিচালনা" }] }),
  component: () => <AdminGuard><AdminUpazilaInfo /></AdminGuard>,
});

function AdminUpazilaInfo() {
  const qc = useQueryClient();
  const { data: roles } = useRoles();
  const isDA = roles?.some((r) => r.role === "super_admin");
  const upzList = (roles ?? []).filter((r) => r.role === "upazila_admin").map((r) => r.upazila!).filter(Boolean);
  const options = isDA ? [...UPAZILAS] : upzList;

  const [upazila, setUpazila] = useState<string>(options[0] ?? UPAZILAS[0]);
  const [intro, setIntro] = useState("");
  const [cover, setCover] = useState("");

  const { data } = useQuery({
    queryKey: ["upazila_info_row", upazila],
    queryFn: async () => {
      const { data, error } = await supabase.from("upazila_info").select("*").eq("upazila", upazila).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!upazila,
  });

  useEffect(() => {
    setIntro((data as any)?.intro ?? "");
    setCover((data as any)?.cover_url ?? "");
  }, [data]);

  async function save() {
    const { error } = await supabase.from("upazila_info").upsert({ upazila, intro, cover_url: cover });
    if (error) return toast.error(error.message);
    toast.success("সংরক্ষণ হয়েছে");
    qc.invalidateQueries({ queryKey: ["upazila_info"] });
    qc.invalidateQueries({ queryKey: ["upazila_info_row", upazila] });
  }

  return (
    <PageShell title="উপজেলা পরিচিতি পরিচালনা" subtitle="প্রতিটি উপজেলার ইন্ট্রো ও কভার আপডেট করুন।">
      <div className="card-elevated space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">উপজেলা</label>
          <select value={upazila} onChange={(e) => setUpazila(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm">
            {options.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">ইন্ট্রো</label>
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={5}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">কভার ইমেজ URL (ঐচ্ছিক)</label>
          <input value={cover} onChange={(e) => setCover(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
        </div>
        <button onClick={save} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
          সংরক্ষণ করুন
        </button>
      </div>
    </PageShell>
  );
}
