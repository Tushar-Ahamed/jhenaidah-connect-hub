import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { UPAZILAS, MEMBER_TYPES } from "@/lib/constants";
import { useProfiles } from "@/lib/queries";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "সদস্য ডিরেক্টরি — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "নাম, বিভাগ, সেশন, হল ও উপজেলা অনুসারে সদস্য অনুসন্ধান করুন।" },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [session, setSession] = useState("");
  const [hall, setHall] = useState("");
  const [upazila, setUpazila] = useState("");
  const [type, setType] = useState("");

  const { data: members = [], isLoading } = useProfiles();

  const departments = useMemo(
    () => Array.from(new Set(members.map((m) => m.department).filter(Boolean) as string[])),
    [members],
  );
  const sessions = useMemo(
    () => Array.from(new Set(members.map((m) => m.session).filter(Boolean) as string[])).sort(),
    [members],
  );
  const halls = useMemo(
    () => Array.from(new Set(members.map((m) => m.hall).filter(Boolean) as string[])),
    [members],
  );

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (q && !(m.full_name ?? "").toLowerCase().includes(q.toLowerCase())) return false;
      if (dept && m.department !== dept) return false;
      if (session && m.session !== session) return false;
      if (hall && m.hall !== hall) return false;
      if (upazila && m.upazila !== upazila) return false;
      if (type && m.member_type !== type) return false;
      return true;
    });
  }, [members, q, dept, session, hall, upazila, type]);

  return (
    <PageShell title="সদস্য ডিরেক্টরি" subtitle="নাম, বিভাগ, সেশন, হল বা উপজেলা দিয়ে সদস্য খুঁজুন।">
      <div className="card-elevated mb-6 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="নাম দিয়ে অনুসন্ধান করুন..."
            className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={type} onChange={setType} label="ধরন" options={MEMBER_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
          <Select value={dept} onChange={setDept} label="বিভাগ" options={departments.map((o) => ({ value: o, label: o }))} />
          <Select value={session} onChange={setSession} label="সেশন" options={sessions.map((o) => ({ value: o, label: o }))} />
          <Select value={hall} onChange={setHall} label="হল" options={halls.map((o) => ({ value: o, label: o }))} />
          <Select value={upazila} onChange={setUpazila} label="উপজেলা" options={UPAZILAS.map((o) => ({ value: o, label: o }))} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>মোট {filtered.length} জন সদস্য পাওয়া গেছে</span>
          <button
            onClick={() => { setQ(""); setDept(""); setSession(""); setHall(""); setUpazila(""); setType(""); }}
            className="font-semibold text-brand-red hover:underline"
          >
            ফিল্টার রিসেট
          </button>
        </div>
      </div>

      {isLoading && <div className="text-center text-muted-foreground">লোড হচ্ছে...</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="card-elevated card-elevated-hover p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full gradient-banner text-lg font-bold text-white">
                {(m.full_name ?? "?").charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate font-bold">{m.full_name}</div>
                <div className="text-[10px] font-semibold uppercase text-brand-red">
                  {MEMBER_TYPES.find((t) => t.value === m.member_type)?.label ?? "সদস্য"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.department}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {m.session && <Info label="সেশন" value={m.session} />}
              {m.hall && <Info label="হল" value={m.hall} />}
              {m.upazila && <Info label="উপজেলা" value={m.upazila} />}
              {m.designation && <Info label="পদবি" value={m.designation} />}
              {m.institution && <Info label="প্রতিষ্ঠান" value={m.institution} />}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          এই ফিল্টারে কোনো সদস্য পাওয়া যায়নি।
        </div>
      )}
    </PageShell>
  );
}

function Select({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">সব {label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="truncate font-medium">{value}</div>
    </div>
  );
}
