import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { UPAZILAS } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, UserPlus, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/members")({
  head: () => ({ meta: [{ title: "সদস্য ও রোল পরিচালনা" }] }),
  component: () => <AdminGuard superOnly><AdminMembers /></AdminGuard>,
});

type RoleKind = "super_admin" | "upazila_admin";

function AdminMembers() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  // Assignment panel state
  const [pickedId, setPickedId] = useState<string>("");
  const [pickerQ, setPickerQ] = useState("");
  const [roleKind, setRoleKind] = useState<RoleKind>("upazila_admin");
  const [targetUpazila, setTargetUpazila] = useState<string>(UPAZILAS[0]);
  const [confirm, setConfirm] = useState<null | { action: "grant" | "revoke"; uid: string; role: RoleKind; upazila?: string; name: string }>(null);

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (profiles ?? []).filter((p: any) =>
    !q || (p.full_name?.toLowerCase().includes(q.toLowerCase()) || p.roll_no?.includes(q) || p.upazila?.includes(q)),
  );

  const pickerList = useMemo(() => {
    const s = pickerQ.toLowerCase().trim();
    return (profiles ?? []).filter((p: any) =>
      !s || p.full_name?.toLowerCase().includes(s) || p.roll_no?.includes(s) || p.upazila?.toLowerCase().includes(s),
    ).slice(0, 8);
  }, [profiles, pickerQ]);

  const picked = (profiles ?? []).find((p: any) => p.id === pickedId);
  const rolesFor = (uid: string) => (roles ?? []).filter((r: any) => r.user_id === uid);

  function requestGrant() {
    if (!picked) return toast.error("প্রথমে একজন সদস্য বেছে নিন");
    const upazila = roleKind === "upazila_admin" ? targetUpazila : undefined;
    const exists = (roles ?? []).some((r: any) => r.user_id === picked.id && r.role === roleKind && (r.upazila ?? null) === (upazila ?? null));
    if (exists) return toast.info("এই রোল ইতিমধ্যেই আছে");
    if (roleKind === "upazila_admin") {
      const count = (roles ?? []).filter((r: any) => r.role === "upazila_admin" && r.upazila === upazila).length;
      if (count >= 2) return toast.error(`${upazila}-এ ইতিমধ্যে ২ জন উপজেলা অ্যাডমিন আছেন`);
    }
    setConfirm({ action: "grant", uid: picked.id, role: roleKind, upazila, name: picked.full_name || picked.roll_no || "—" });
  }

  function requestRevoke(uid: string, role: RoleKind, upazila: string | null, name: string) {
    setConfirm({ action: "revoke", uid, role, upazila: upazila ?? undefined, name });
  }

  async function runConfirm() {
    if (!confirm) return;
    if (confirm.action === "grant") {
      const { error } = await supabase.from("user_roles").insert({ user_id: confirm.uid, role: confirm.role, upazila: confirm.upazila ?? null });
      if (error) { toast.error(error.message); return; }
      toast.success("রোল যোগ হয়েছে");
    } else {
      const existing = (roles ?? []).find((r: any) => r.user_id === confirm.uid && r.role === confirm.role && (r.upazila ?? null) === (confirm.upazila ?? null));
      if (existing) {
        const { error } = await supabase.from("user_roles").delete().eq("id", existing.id);
        if (error) { toast.error(error.message); return; }
      }
      toast.success("রোল সরানো হয়েছে");
    }
    setConfirm(null);
    qc.invalidateQueries({ queryKey: ["admin-all-roles"] });
  }

  const roleLabel = (r: RoleKind, u?: string) =>
    r === "super_admin" ? "জেলা অ্যাডমিন" : `উপজেলা অ্যাডমিন — ${u ?? ""}`;

  return (
    <PageShell title="সদস্য ও রোল পরিচালনা" subtitle="একজন রেজিস্টার্ড সদস্য বেছে নিন, উপযুক্ত রোল ও উপজেলা সিলেক্ট করুন, তারপর কনফার্ম করুন।">
      {/* Assignment Panel */}
      <div className="card-elevated mb-6 space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm font-bold">
          <UserPlus className="h-4 w-4 text-brand-red" /> নতুন রোল অ্যাসাইন করুন
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">১. সদস্য বেছে নিন</label>
          <input
            value={pickerQ}
            onChange={(e) => { setPickerQ(e.target.value); setPickedId(""); }}
            placeholder="নাম / রোল / উপজেলা লিখে খুঁজুন"
            className="w-full rounded-lg border border-input bg-background p-2.5 text-sm"
          />
          {pickerQ && !pickedId && (
            <div className="mt-1 max-h-56 overflow-auto rounded-lg border border-border bg-background">
              {pickerList.length === 0 && <div className="p-3 text-xs text-muted-foreground">কেউ পাওয়া যায়নি</div>}
              {pickerList.map((p: any) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setPickedId(p.id); setPickerQ(p.full_name || p.roll_no || ""); }}
                  className="flex w-full items-center justify-between gap-2 border-b border-border p-2 text-left text-sm last:border-0 hover:bg-accent"
                >
                  <span className="font-semibold">{p.full_name || "নামহীন"}</span>
                  <span className="text-xs text-muted-foreground">{p.roll_no} • {p.upazila}</span>
                </button>
              ))}
            </div>
          )}
          {picked && (
            <div className="mt-2 flex items-center justify-between rounded-lg border border-primary/50 bg-primary/5 p-2.5 text-sm">
              <div>
                <div className="font-bold">{picked.full_name}</div>
                <div className="text-xs text-muted-foreground">{picked.roll_no} • {picked.upazila} • {picked.department}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rolesFor(picked.id).map((x: any, i: number) => (
                    <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                      {x.role === "super_admin" ? "জেলা অ্যাডমিন" : x.role === "upazila_admin" ? `উপজেলা: ${x.upazila}` : "সদস্য"}
                    </span>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => { setPickedId(""); setPickerQ(""); }} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">২. রোল</label>
            <select value={roleKind} onChange={(e) => setRoleKind(e.target.value as RoleKind)} className="w-full rounded-lg border border-input bg-background p-2.5 text-sm">
              <option value="upazila_admin">উপজেলা অ্যাডমিন</option>
              <option value="super_admin">জেলা অ্যাডমিন</option>
            </select>
          </div>
          {roleKind === "upazila_admin" && (
            <div>
              <label className="mb-1 block text-xs font-semibold">৩. উপজেলা</label>
              <select value={targetUpazila} onChange={(e) => setTargetUpazila(e.target.value)} className="w-full rounded-lg border border-input bg-background p-2.5 text-sm">
                {UPAZILAS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={requestGrant}
          disabled={!picked}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          রোল অ্যাসাইন করুন
        </button>
      </div>

      {/* Existing directory */}
      <div className="mb-2 text-sm font-bold">সব সদস্য</div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম / রোল / উপজেলা খুঁজুন..." className="mb-4 w-full rounded-lg border border-input bg-background p-3 text-sm" />
      <div className="space-y-3">
        {filtered.map((p: any) => {
          const r = rolesFor(p.id);
          return (
            <div key={p.id} className="card-elevated p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold">{p.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{p.roll_no} • {p.department} • {p.session} • {p.upazila}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.filter((x: any) => x.role !== "member").map((x: any) => (
                      <button
                        key={x.id}
                        onClick={() => requestRevoke(p.id, x.role, x.upazila, p.full_name || p.roll_no || "—")}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 px-2 py-0.5 text-[11px] font-semibold text-brand-red hover:bg-brand-red hover:text-white"
                        title="ক্লিক করে সরান"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {x.role === "super_admin" ? "জেলা অ্যাডমিন" : `উপজেলা: ${x.upazila}`}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {r.filter((x: any) => x.role !== "member").length === 0 && (
                      <span className="text-[11px] text-muted-foreground">সাধারণ সদস্য</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setPickedId(p.id); setPickerQ(p.full_name || p.roll_no || ""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-lg border border-input px-3 py-1.5 text-xs font-semibold hover:bg-accent"
                >
                  অ্যাসাইন
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirm(null)}>
          <div className="w-full max-w-sm rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-base font-bold">নিশ্চিত?</div>
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{confirm.name}</span>-কে{" "}
              <span className="font-semibold text-foreground">{roleLabel(confirm.role, confirm.upazila)}</span>{" "}
              হিসেবে {confirm.action === "grant" ? "নিযুক্ত" : "থেকে অপসারণ"} করা হবে।
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} className="rounded-lg border border-input px-4 py-2 text-sm">বাতিল</button>
              <button onClick={runConfirm} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${confirm.action === "grant" ? "bg-primary" : "bg-brand-red"}`}>
                {confirm.action === "grant" ? "অ্যাসাইন" : "সরান"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
