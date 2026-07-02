import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { UPAZILAS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "প্রোফাইল — ঝিনাইদহ জেলা সমিতি" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: p } = useProfile();
  const qc = useQueryClient();
  const [f, setF] = useState<any>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (p) setF(p); }, [p]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: f.full_name, department: f.department, session: f.session, hall: f.hall,
      upazila: f.upazila, phone: f.phone, real_email: f.real_email, is_alumni: f.is_alumni,
      current_position: f.current_position, roll_no: f.roll_no, reg_no: f.reg_no,
    }).eq("id", user!.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("সংরক্ষণ হয়েছে");
    qc.invalidateQueries({ queryKey: ["profile", user!.id] });
  }

  return (
    <PageShell title="প্রোফাইল" subtitle="আপনার তথ্য সম্পাদনা করুন">
      <form onSubmit={save} className="mx-auto max-w-2xl card-elevated space-y-3 p-6 sm:p-8">
        <Text label="পূর্ণ নাম" value={f.full_name || ""} onChange={(v) => setF({ ...f, full_name: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Text label="রোল নম্বর" value={f.roll_no || ""} onChange={(v) => setF({ ...f, roll_no: v })} />
          <Text label="রেজিস্ট্রেশন নম্বর" value={f.reg_no || ""} onChange={(v) => setF({ ...f, reg_no: v })} />
        </div>
        <Text label="ইমেইল" value={f.real_email || ""} onChange={(v) => setF({ ...f, real_email: v })} />
        <Text label="মোবাইল" value={f.phone || ""} onChange={(v) => setF({ ...f, phone: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Text label="বিভাগ" value={f.department || ""} onChange={(v) => setF({ ...f, department: v })} />
          <Text label="সেশন" value={f.session || ""} onChange={(v) => setF({ ...f, session: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Text label="হল" value={f.hall || ""} onChange={(v) => setF({ ...f, hall: v })} />
          <div>
            <label className="mb-1 block text-sm font-medium">উপজেলা</label>
            <select value={f.upazila || ""} onChange={(e) => setF({ ...f, upazila: e.target.value })} className="w-full rounded-lg border border-input bg-background p-3 text-sm">
              <option value="">নির্বাচন করুন</option>
              {UPAZILAS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!f.is_alumni} onChange={(e) => setF({ ...f, is_alumni: e.target.checked })} />
          আমি অ্যালামনাই
        </label>
        {f.is_alumni && <Text label="বর্তমান পদ/প্রতিষ্ঠান" value={f.current_position || ""} onChange={(v) => setF({ ...f, current_position: v })} />}
        <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </form>
    </PageShell>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
    </div>
  );
}
