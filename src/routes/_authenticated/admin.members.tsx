import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { UPAZILAS } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/members")({
  head: () => ({ meta: [{ title: "সদস্য ও রোল পরিচালনা" }] }),
  component: () => <AdminGuard districtOnly><AdminMembers /></AdminGuard>,
});

function AdminMembers() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const filtered = (profiles ?? []).filter((p: any) =>
    !q || (p.full_name?.toLowerCase().includes(q.toLowerCase()) || p.roll_no?.includes(q) || p.upazila?.includes(q)),
  );

  const rolesFor = (uid: string) => (roles ?? []).filter((r: any) => r.user_id === uid);

  async function toggleRole(uid: string, role: "district_admin" | "upazila_admin", upazila?: string) {
    const existing = (roles ?? []).find((r: any) => r.user_id === uid && r.role === role && (r.upazila ?? null) === (upazila ?? null));
    if (existing) {
      const { error } = await supabase.from("user_roles").delete().eq("id", existing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role, upazila: upazila ?? null });
      if (error) return toast.error(error.message);
    }
    qc.invalidateQueries({ queryKey: ["admin-all-roles"] });
  }

  return (
    <PageShell title="সদস্য ও রোল পরিচালনা">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম / রোল / উপজেলা খুঁজুন..." className="mb-4 w-full rounded-lg border border-input bg-background p-3 text-sm" />
      <div className="space-y-3">
        {filtered.map((p: any) => {
          const r = rolesFor(p.id);
          const isDA = r.some((x: any) => x.role === "district_admin");
          return (
            <div key={p.id} className="card-elevated p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold">{p.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{p.roll_no} • {p.department} • {p.session} • {p.upazila}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.map((x: any, i: number) => (
                      <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold">
                        {x.role === "district_admin" ? "জেলা অ্যাডমিন" : x.role === "upazila_admin" ? `উপজেলা: ${x.upazila}` : "সদস্য"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => toggleRole(p.id, "district_admin")} className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${isDA ? "bg-brand-red text-white" : "border border-input"}`}>
                    <ShieldCheck className="h-3.5 w-3.5" /> {isDA ? "জেলা অ্যাডমিন —" : "জেলা অ্যাডমিন +"}
                  </button>
                  <select onChange={(e) => e.target.value && toggleRole(p.id, "upazila_admin", e.target.value)} className="rounded-lg border border-input bg-background p-1.5 text-xs">
                    <option value="">উপজেলা অ্যাডমিন যোগ/সরান</option>
                    {UPAZILAS.map((u) => {
                      const has = r.some((x: any) => x.role === "upazila_admin" && x.upazila === u);
                      return <option key={u} value={u}>{has ? "— সরান: " : "+ "} {u}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
