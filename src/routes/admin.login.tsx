import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles } from "@/hooks/use-auth";
import { logActivity } from "@/lib/audit";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "অ্যাডমিন লগইন — ঝিনাইদহ জেলা সমিতি" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const { data: roles } = useRoles();
  const nav = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    const isAdmin = roles?.some((r) => ["super_admin", "upazila_admin", "committee_admin"].includes(r.role as string));
    if (isAdmin) nav({ to: "/dashboard" });
  }, [user, loading, roles, nav]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id);
      const isAdmin = (r ?? []).some((x) => ["super_admin", "upazila_admin", "committee_admin"].includes(x.role as string));
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("এই অ্যাকাউন্টের অ্যাডমিন অ্যাক্সেস নেই");
        return;
      }
      await logActivity("login", { channel: "admin" });
      toast.success("অ্যাডমিন লগইন সফল");
      nav({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "লগইন ব্যর্থ");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!email) return toast.error("প্রথমে ইমেইল লিখুন");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("রিসেট লিঙ্ক ইমেইলে পাঠানো হয়েছে");
  }

  return (
    <PageShell title="অ্যাডমিন লগইন" subtitle="শুধু অনুমোদিত অ্যাডমিন সাইন-ইন করতে পারবেন।">
      <div className="mx-auto max-w-md">
        <div className="card-elevated p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-brand-red/5 p-3 text-xs text-brand-red">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>শুধু অনুমোদিত অ্যাডমিনদের জন্য। সাধারণ সদস্যরা <Link to="/auth" className="underline">এখানে</Link> লগইন করুন।</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="ইমেইল" type="email" value={email} onChange={setEmail} required />
            <Field label="পাসওয়ার্ড" type="password" value={password} onChange={setPassword} required />
            <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {busy ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
            <button type="button" onClick={handleReset} className="w-full text-xs text-muted-foreground hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, value, onChange, type = "text", required = true }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input required={required} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
