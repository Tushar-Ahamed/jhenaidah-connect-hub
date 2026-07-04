import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { UPAZILAS, MEMBER_TYPES, rollToEmail } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "লগইন / রেজিস্ট্রেশন — ঝিনাইদহ জেলা সমিতি" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading, nav]);

  const [roll, setRoll] = useState("");
  const [reg, setReg] = useState("");

  const [rName, setRName] = useState("");
  const [rRoll, setRRoll] = useState("");
  const [rReg, setRReg] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rDept, setRDept] = useState("");
  const [rSession, setRSession] = useState("");
  const [rHall, setRHall] = useState("");
  const [rUpazila, setRUpazila] = useState<string>(UPAZILAS[0]);
  const [rPhone, setRPhone] = useState("");
  const [rType, setRType] = useState<"student" | "alumni" | "teacher">("student");
  const [rInstitution, setRInstitution] = useState("");
  const [rDesignation, setRDesignation] = useState("");
  const [rCurrent, setRCurrent] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: rollToEmail(roll), password: reg.trim(),
      });
      if (error) throw error;
      toast.success("লগইন সফল");
      nav({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "লগইন ব্যর্থ");
    } finally { setBusy(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: rollToEmail(rRoll),
        password: rReg.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: rName,
            roll_no: rRoll.trim(),
            reg_no: rReg.trim(),
            department: rDept,
            session: rSession,
            hall: rHall,
            upazila: rUpazila,
            phone: rPhone,
            real_email: rEmail,
            member_type: rType,
            institution: rType === "teacher" ? rInstitution : null,
            designation: rType === "teacher" ? rDesignation : null,
            is_alumni: rType === "alumni",
            current_position: rType === "alumni" ? rCurrent : null,
          },
        },
      });
      if (error) throw error;
      toast.success("নিবন্ধন সম্পন্ন! লগইন করুন।");
      setMode("login");
      setRoll(rRoll); setReg(rReg);
    } catch (err: any) {
      toast.error(err?.message ?? "নিবন্ধন ব্যর্থ");
    } finally { setBusy(false); }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) throw res.error;
      if (!res.redirected) nav({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Google লগইন ব্যর্থ");
    } finally { setBusy(false); }
  }

  return (
    <PageShell title={mode === "login" ? "অ্যাকাউন্টে লগইন" : "নতুন অ্যাকাউন্ট"}
      subtitle="ইউজারনেম = রোল নম্বর, পাসওয়ার্ড = রেজিস্ট্রেশন নম্বর। অথবা Google দিয়ে সাইন ইন করুন।">
      <div className="mx-auto max-w-xl">
        <div className="mb-4 grid grid-cols-2 rounded-lg border border-border bg-secondary p-1">
          {(["login", "register"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${mode === m ? "bg-primary text-primary-foreground" : "text-foreground/70"}`}>
              {m === "login" ? "লগইন" : "রেজিস্ট্রেশন"}
            </button>
          ))}
        </div>

        <div className="card-elevated p-6 sm:p-8">
          <button type="button" onClick={handleGoogle} disabled={busy}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold hover:bg-accent">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Google দিয়ে {mode === "login" ? "লগইন" : "সাইন আপ"}
          </button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> অথবা <div className="h-px flex-1 bg-border" />
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="রোল নম্বর (ইউজারনেম)" value={roll} onChange={setRoll} placeholder="যেমন: 21012345" />
              <Field label="রেজিস্ট্রেশন নম্বর (পাসওয়ার্ড)" value={reg} onChange={setReg} type="password" />
              <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {busy ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">আপনি কে?</label>
                <div className="grid grid-cols-3 gap-2">
                  {MEMBER_TYPES.map((t) => (
                    <button key={t.value} type="button" onClick={() => setRType(t.value)}
                      className={`rounded-lg border p-2 text-xs font-semibold ${rType === t.value ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="পূর্ণ নাম" value={rName} onChange={setRName} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="রোল নম্বর" value={rRoll} onChange={setRRoll} />
                <Field label="রেজিস্ট্রেশন নম্বর (কমপক্ষে ৬ সংখ্যা)" value={rReg} onChange={setRReg} />
              </div>
              <Field label="ইমেইল" type="email" value={rEmail} onChange={setREmail} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="বিভাগ" value={rDept} onChange={setRDept} />
                <Field label="সেশন" value={rSession} onChange={setRSession} placeholder="২০২১-২২" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="হল" value={rHall} onChange={setRHall} required={false} />
                <div>
                  <label className="mb-1 block text-sm font-medium">উপজেলা</label>
                  <select value={rUpazila} onChange={(e) => setRUpazila(e.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-sm">
                    {UPAZILAS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <Field label="মোবাইল" value={rPhone} onChange={setRPhone} required={false} />
              {rType === "teacher" && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="প্রতিষ্ঠান" value={rInstitution} onChange={setRInstitution} />
                  <Field label="পদবি" value={rDesignation} onChange={setRDesignation} />
                </div>
              )}
              {rType === "alumni" && (
                <Field label="বর্তমান পদ / প্রতিষ্ঠান" value={rCurrent} onChange={setRCurrent} required={false} />
              )}
              <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {busy ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
              </button>
            </form>
          )}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← হোমে ফিরে যান</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required = true }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input required={required} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
