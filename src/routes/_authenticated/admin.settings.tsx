import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "সিস্টেম সেটিংস" }] }),
  component: () => <AdminGuard superOnly><SettingsPage /></AdminGuard>,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("system_settings").select("*");
      if (error) throw error;
      const map: Record<string, any> = {};
      (data ?? []).forEach((r) => (map[r.key] = r.value));
      return map;
    },
  });

  const [siteName, setSiteName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [autoApprove, setAutoApprove] = useState(false);

  useEffect(() => {
    if (!data) return;
    setSiteName(data.site_name?.value ?? data.site_name ?? "");
    setContactEmail(data.contact_email?.value ?? data.contact_email ?? "");
    setAutoApprove(!!(data.auto_approve?.value ?? data.auto_approve));
  }, [data]);

  async function save() {
    const rows = [
      { key: "site_name", value: siteName as unknown as never },
      { key: "contact_email", value: contactEmail as unknown as never },
      { key: "auto_approve", value: autoApprove as unknown as never },
    ];
    const { error } = await supabase.from("system_settings").upsert(rows, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success("সেটিংস সংরক্ষিত");
    qc.invalidateQueries({ queryKey: ["system-settings"] });
  }

  return (
    <PageShell title="সিস্টেম সেটিংস" subtitle="সাইট-ব্যাপী কনফিগারেশন।">
      <div className="mx-auto max-w-lg card-elevated space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-semibold">সাইটের নাম</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-lg border border-input bg-background p-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">যোগাযোগ ইমেইল</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background p-2.5 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} />
          নতুন সদস্য অটো-অনুমোদন
        </label>
        <button onClick={save} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">সংরক্ষণ করুন</button>
      </div>
    </PageShell>
  );
}
