import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "লগইন — ঝিনাইদহ জেলা সমিতি" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <PageShell title={mode === "login" ? "সদস্য লগইন" : "নতুন সদস্য নিবন্ধন"} subtitle="আপনার অ্যাকাউন্টে প্রবেশ করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।">
      <div className="mx-auto max-w-md">
        <div className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-secondary p-1">
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
            alert("ডেমো — ব্যাকএন্ড সংযুক্ত হলে কাজ করবে।");
          }}
        >
          {mode === "register" && (
            <>
              <Input label="পূর্ণ নাম" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="বিভাগ" />
                <Input label="সেশন" />
              </div>
              <Input label="উপজেলা" />
            </>
          )}
          <Input label="ইমেইল" type="email" />
          <Input label="পাসওয়ার্ড" type="password" />
          <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            {mode === "login" ? "লগইন করুন" : "নিবন্ধন করুন"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← হোমে ফিরে যান</Link>
          </p>
        </form>
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
