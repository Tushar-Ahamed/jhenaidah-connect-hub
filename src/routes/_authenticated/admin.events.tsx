import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/use-auth";
import { UPAZILAS } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/events")({
  head: () => ({ meta: [{ title: "ইভেন্ট পরিচালনা" }] }),
  component: () => <AdminGuard><AdminEvents /></AdminGuard>,
});

function AdminEvents() {
  const qc = useQueryClient();
  const { data: roles } = useRoles();
  const isDistrict = roles?.some((r) => r.role === "district_admin");
  const upazilaScope = roles?.find((r) => r.role === "upazila_admin")?.upazila;

  const { data: events } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  const [editing, setEditing] = useState<any>(null);

  async function save(row: any) {
    const payload = {
      title: row.title, description: row.description, event_date: row.event_date || null,
      venue: row.venue, level: row.level, upazila: row.level === "upazila" ? row.upazila : null,
    };
    const { error } = row.id
      ? await supabase.from("events").update(payload).eq("id", row.id)
      : await supabase.from("events").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("সংরক্ষণ হয়েছে");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  async function del(id: string) {
    if (!confirm("নিশ্চিত?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  return (
    <PageShell title="ইভেন্ট পরিচালনা">
      <button onClick={() => setEditing({ level: isDistrict ? "district" : "upazila", upazila: upazilaScope })} className="mb-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        <Plus className="h-4 w-4" /> নতুন ইভেন্ট
      </button>
      {editing && <Editor row={editing} onSave={save} onCancel={() => setEditing(null)} isDistrict={!!isDistrict} upazilaScope={upazilaScope} />}
      <div className="mt-4 space-y-3">
        {events?.map((e: any) => (
          <div key={e.id} className="card-elevated flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{e.level === "district" ? "জেলা" : e.upazila} • {e.event_date} • {e.venue}</div>
              <div className="font-bold">{e.title}</div>
              <p className="text-sm text-muted-foreground">{e.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(e)} className="rounded p-2 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(e.id)} className="rounded p-2 text-brand-red hover:bg-accent"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Editor({ row, onSave, onCancel, isDistrict, upazilaScope }: any) {
  const [f, setF] = useState(row);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="card-elevated space-y-3 p-6">
      <input required placeholder="শিরোনাম" value={f.title || ""} onChange={(e) => setF({ ...f, title: e.target.value })} className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
      <textarea placeholder="বিবরণ" value={f.description || ""} onChange={(e) => setF({ ...f, description: e.target.value })} rows={4} className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="date" value={f.event_date || ""} onChange={(e) => setF({ ...f, event_date: e.target.value })} className="rounded-lg border border-input bg-background p-3 text-sm" />
        <input placeholder="স্থান" value={f.venue || ""} onChange={(e) => setF({ ...f, venue: e.target.value })} className="rounded-lg border border-input bg-background p-3 text-sm" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {isDistrict && (
          <select value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })} className="rounded-lg border border-input bg-background p-3 text-sm">
            <option value="district">জেলা</option>
            <option value="upazila">উপজেলা</option>
          </select>
        )}
        {f.level === "upazila" && (
          <select value={f.upazila || upazilaScope || ""} onChange={(e) => setF({ ...f, upazila: e.target.value })} className="rounded-lg border border-input bg-background p-3 text-sm">
            <option value="">উপজেলা নির্বাচন</option>
            {UPAZILAS.map((u) => (!isDistrict && upazilaScope !== u ? null : <option key={u}>{u}</option>))}
          </select>
        )}
      </div>
      <div className="flex gap-2">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">সংরক্ষণ</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-input px-4 py-2 text-sm">বাতিল</button>
      </div>
    </form>
  );
}
