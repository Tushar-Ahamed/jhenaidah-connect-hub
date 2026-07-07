import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "পাসওয়ার্ড রিসেট — ঝিনাইদহ জেলা সমিতি" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("কমপক্ষে ৬ অক্ষর দিন");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("পাসওয়ার্ড আপডেট হয়েছে");
    nav({ to: "/dashboard" });
  }

  return (
    <PageShell title="নতুন পাসওয়ার্ড" subtitle="আপনার নতুন পাসওয়ার্ড সেট করুন।">
      <form onSubmit={handleSubmit} className="mx-auto max-w-md card-elevated space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">নতুন পাসওয়ার্ড</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required
            className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
        </div>
        <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
        </button>
      </form>
    </PageShell>
  );
}
