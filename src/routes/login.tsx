import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, ShieldCheck, User } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "লগইন — ঝিনাইদহ জেলা সমিতি" }],
  }),
  component: LoginPage,
});

type Role = "member" | "upazila_admin" | "district_admin";

const ROLES: { key: Role; label: string; icon: typeof User; desc: string }[] = [
  { key: "member", label: "সাধারণ সদস্য", icon: User, desc: "প্রোফাইল, ইভেন্ট ও নোটিশ অ্যাক্সেস" },
  { key: "upazila_admin", label: "উপজেলা অ্যাডমিন", icon: Shield, desc: "নিজ উপজেলার সদস্য ও কন্টেন্ট পরিচালনা" },
  { key: "district_admin", label: "জেলা অ্যাডমিন", icon: ShieldCheck, desc: "পুরো জেলার সর্বোচ্চ পরিচালনা ক্ষমতা" },
];

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("member");

  return (
    <PageShell
      title={mode === "login" ? "অ্যাকাউন্টে লগইন" : "নতুন অ্যাকাউন্ট"}
      subtitle="রোল ভিত্তিক অ্যাক্সেস সহ অফিসিয়াল মেম্বার পোর্টাল।"
    >
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-lg font-bold">রোল নির্বাচন করুন</h2>
          <div className="mt-4 space-y-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-brand-red bg-accent shadow-md"
                      : "border-border bg-card hover:border-primary"
                  }`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${active ? "gradient-banner text-white" : "bg-secondary text-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-4 grid grid-cols-2 rounded-lg border border-border bg-secondary p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  mode === m ? "bg-primary text-primary-foreground" : "text-foreground/70"
                }`}
              >
                {m === "login" ? "লগইন" : "রেজিস্ট্রেশন"}
              </button>
            ))}
          </div>

          <form
            className="card-elevated space-y-4 p-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`ডেমো — ${ROLES.find((x) => x.key === role)?.label} হিসেবে ${mode === "login" ? "লগইন" : "নিবন্ধন"}। ব্যাকএন্ড সংযুক্ত হলে কাজ করবে।`);
            }}
          >
            {mode === "register" && (
              <>
                <Input label="পূর্ণ নাম" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="বিভাগ" />
                  <Input label="সেশন" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="হল" />
                  <Input label="উপজেলা" />
                </div>
              </>
            )}
            <Input label="ইমেইল" type="email" />
            <Input label="পাসওয়ার্ড" type="password" />
            <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
              নির্বাচিত রোল: <span className="font-semibold text-foreground">{ROLES.find((x) => x.key === role)?.label}</span>
            </div>
            <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
              {mode === "login" ? "লগইন করুন" : "নিবন্ধন করুন"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:underline">← হোমে ফিরে যান</Link>
            </p>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        required
        className="w-full rounded-lg border border-input bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
