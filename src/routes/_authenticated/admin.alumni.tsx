import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UPAZILAS } from "@/lib/constants";
import { useRoles } from "@/hooks/use-auth";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/alumni")({
  head: () => ({ meta: [{ title: "অ্যালামনাই পরিচালনা" }] }),
  component: () => <AdminGuard><AdminAlumni /></AdminGuard>,
});

function AdminAlumni() {
  const qc = useQueryClient();
  const { data: roles } = useRoles();
  const isDA = roles?.some((r) => r.role === "district_admin");
  const upzList = (roles ?? []).filter((r) => r.role === "upazila_admin").map((r) => r.upazila!).filter(Boolean);
  const options = isDA ? [...UPAZILAS] : upzList;

  const [f, setF] = useState<any>({ full_name: "", department: "", session: "", hall: "", upazila: options[0] ?? UPAZILAS[0], current_position: "" });

  const { data: list = [] } = useQuery({
    queryKey: ["admin-alumni-manual"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alumni_manual").select("*").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  async function add() {
    if (!f.full_name || !f.upazila) return toast.error("নাম ও উপজেলা দিন");
    const { error } = await supabase.from("alumni_manual").insert(f);
    if (error) return toast.error(error.message);
    toast.success("যোগ হয়েছে");
    setF({ ...f, full_name: "", department: "", session: "", hall: "", current_position: "" });
    qc.invalidateQueries({ queryKey: ["admin-alumni-manual"] });
    qc.invalidateQueries({ queryKey: ["alumni_manual"] });
  }

  async function del(id: string) {
    if (!confirm("সরাবেন?")) return;
    const { error } = await supabase.from("alumni_manual").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-alumni-manual"] });
    qc.invalidateQueries({ queryKey: ["alumni_manual"] });
  }

  const visible = isDA ? list : list.filter((a: any) => upzList.includes(a.upazila));

  return (
    <PageShell title="অ্যালামনাই পরিচালনা (ম্যানুয়াল)" subtitle="যারা রেজিস্টার করেননি — তাদের এখান থেকে যোগ করুন।">
      <div className="card-elevated mb-6 space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input placeholder="পূর্ণ নাম *" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })}
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <select value={f.upazila} onChange={(e) => setF({ ...f, upazila: e.target.value })}
            className="rounded-lg border border-input bg-background p-2.5 text-sm">
            {options.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input placeholder="বিভাগ" value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })}
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <input placeholder="সেশন" value={f.session} onChange={(e) => setF({ ...f, session: e.target.value })}
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <input placeholder="হল" value={f.hall} onChange={(e) => setF({ ...f, hall: e.target.value })}
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <input placeholder="বর্তমান পদ / প্রতিষ্ঠান" value={f.current_position} onChange={(e) => setF({ ...f, current_position: e.target.value })}
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
        </div>
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> যোগ করুন
        </button>
      </div>

      <div className="space-y-2">
        {visible.map((a: any) => (
          <div key={a.id} className="card-elevated flex items-center justify-between p-4">
            <div>
              <div className="font-bold">{a.full_name}</div>
              <div className="text-xs text-muted-foreground">{a.department} • {a.session} • {a.upazila}</div>
              {a.current_position && <div className="text-xs">{a.current_position}</div>}
            </div>
            <button onClick={() => del(a.id)} className="rounded-lg border border-brand-red p-2 text-brand-red">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {visible.length === 0 && <div className="card-elevated p-6 text-center text-muted-foreground">কোনো এন্ট্রি নেই।</div>}
      </div>
    </PageShell>
  );
}
