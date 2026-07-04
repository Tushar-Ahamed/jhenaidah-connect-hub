import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UPAZILAS } from "@/lib/constants";
import { useRoles } from "@/hooks/use-auth";
import { Trash2, Plus, Archive } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/committee")({
  head: () => ({ meta: [{ title: "কমিটি পরিচালনা" }] }),
  component: AdminCommittee,
});

function AdminCommittee() {
  const qc = useQueryClient();
  const { data: roles } = useRoles();
  const isDA = roles?.some((r) => r.role === "district_admin");
  const upzAdminList = (roles ?? []).filter((r) => r.role === "upazila_admin").map((r) => r.upazila!).filter(Boolean);

  const [level, setLevel] = useState<"district" | "upazila">(isDA ? "district" : "upazila");
  const [upazila, setUpazila] = useState<string>(upzAdminList[0] ?? UPAZILAS[0]);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);

  const { data: list = [] } = useQuery({
    queryKey: ["admin-committee", level, level === "upazila" ? upazila : null],
    queryFn: async () => {
      let q = supabase.from("committee_positions").select("*").eq("level", level).order("order_index");
      if (level === "upazila") q = q.eq("upazila", upazila);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  async function add() {
    if (!title || !name) return toast.error("পদ ও নাম দিন");
    const row: any = { level, position_title: title, holder_name: name, order_index: order, term_start: new Date().toISOString().slice(0, 10) };
    if (level === "upazila") row.upazila = upazila;
    const { error } = await supabase.from("committee_positions").insert(row);
    if (error) return toast.error(error.message);
    toast.success("যোগ হয়েছে");
    setTitle(""); setName(""); setOrder(0);
    qc.invalidateQueries({ queryKey: ["admin-committee"] });
    qc.invalidateQueries({ queryKey: ["committee"] });
    qc.invalidateQueries({ queryKey: ["committee_summary"] });
  }

  async function endTerm(id: string) {
    const { error } = await supabase.from("committee_positions").update({ term_end: new Date().toISOString().slice(0, 10) }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-committee"] });
    qc.invalidateQueries({ queryKey: ["committee"] });
    qc.invalidateQueries({ queryKey: ["committee_summary"] });
  }

  async function del(id: string) {
    if (!confirm("সরাবেন?")) return;
    const { error } = await supabase.from("committee_positions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-committee"] });
    qc.invalidateQueries({ queryKey: ["committee"] });
    qc.invalidateQueries({ queryKey: ["committee_summary"] });
  }

  return (
    <PageShell title="কমিটি পরিচালনা" subtitle="পদ যোগ করুন, মেয়াদ শেষ করুন বা সরান। পূর্বের কমিটি ইতিহাস হিসেবে থাকবে।">
      <div className="mb-4 flex flex-wrap gap-2">
        {isDA && (
          <button onClick={() => setLevel("district")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${level === "district" ? "bg-primary text-primary-foreground" : "border border-input"}`}>জেলা কমিটি</button>
        )}
        <button onClick={() => setLevel("upazila")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${level === "upazila" ? "bg-primary text-primary-foreground" : "border border-input"}`}>উপজেলা কমিটি</button>
        {level === "upazila" && (
          <select value={upazila} onChange={(e) => setUpazila(e.target.value)}
            className="rounded-lg border border-input bg-background p-2 text-sm">
            {(isDA ? UPAZILAS : upzAdminList).map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        )}
      </div>

      <div className="card-elevated mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_100px_auto]">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="পদের নাম (যেমন: সভাপতি)"
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="দায়িত্বপ্রাপ্ত ব্যক্তির নাম"
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <input type="number" value={order} onChange={(e) => setOrder(+e.target.value)} placeholder="অর্ডার"
            className="rounded-lg border border-input bg-background p-2.5 text-sm" />
          <button onClick={add} className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> যোগ
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {list.map((p: any) => (
          <div key={p.id} className="card-elevated flex items-center justify-between gap-3 p-4">
            <div>
              <div className="text-xs font-semibold text-brand-red">{p.position_title}</div>
              <div className="font-bold">{p.holder_name}</div>
              <div className="text-xs text-muted-foreground">
                অর্ডার: {p.order_index} • {p.term_end ? `মেয়াদ শেষ: ${p.term_end}` : "বর্তমান"}
              </div>
            </div>
            <div className="flex gap-2">
              {!p.term_end && (
                <button onClick={() => endTerm(p.id)} title="মেয়াদ শেষ" className="rounded-lg border border-input p-2 text-sm">
                  <Archive className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => del(p.id)} title="মুছুন" className="rounded-lg border border-brand-red p-2 text-brand-red">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="card-elevated p-6 text-center text-muted-foreground">কোনো পদ নেই।</div>}
      </div>
    </PageShell>
  );
}
