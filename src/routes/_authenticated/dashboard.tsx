import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useAuth, useProfile, useRoles } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CalendarDays, Image, LogOut, ShieldCheck, User, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "ড্যাশবোর্ড — ঝিনাইদহ জেলা সমিতি" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: roles } = useRoles();
  const qc = useQueryClient();
  const nav = useNavigate();

  const isDistrictAdmin = roles?.some((r) => r.role === "district_admin");
  const isUpazilaAdmin = roles?.some((r) => r.role === "upazila_admin");
  const isAdmin = isDistrictAdmin || isUpazilaAdmin;

  const { data: stats } = useQuery({
    queryKey: ["dash-stats"],
    queryFn: async () => {
      const [m, n, e, g] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("notices").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
      ]);
      return { members: m.count ?? 0, notices: n.count ?? 0, events: e.count ?? 0, gallery: g.count ?? 0 };
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("লগআউট হয়েছে");
    nav({ to: "/auth", replace: true });
  }

  return (
    <PageShell title="ড্যাশবোর্ড" subtitle={`স্বাগতম, ${profile?.full_name || user?.email}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="সদস্য" value={stats?.members ?? "-"} />
        <Stat icon={Bell} label="নোটিশ" value={stats?.notices ?? "-"} />
        <Stat icon={CalendarDays} label="ইভেন্ট" value={stats?.events ?? "-"} />
        <Stat icon={Image} label="গ্যালারি" value={stats?.gallery ?? "-"} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card-elevated p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold"><User className="h-4 w-4" /> আপনার তথ্য</h3>
          <dl className="space-y-2 text-sm">
            <Row label="নাম" value={profile?.full_name} />
            <Row label="রোল" value={profile?.roll_no} />
            <Row label="বিভাগ" value={profile?.department} />
            <Row label="সেশন" value={profile?.session} />
            <Row label="হল" value={profile?.hall} />
            <Row label="উপজেলা" value={profile?.upazila} />
          </dl>
          <Link to="/profile" className="mt-4 inline-block rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-accent">প্রোফাইল সম্পাদনা</Link>
        </div>

        <div className="card-elevated p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4" /> ভূমিকা</h3>
          <div className="flex flex-wrap gap-2">
            {roles?.length ? roles.map((r, i) => (
              <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {r.role === "district_admin" ? "জেলা অ্যাডমিন" : r.role === "upazila_admin" ? `উপজেলা অ্যাডমিন — ${r.upazila}` : "সাধারণ সদস্য"}
              </span>
            )) : <span className="text-sm text-muted-foreground">সাধারণ সদস্য</span>}
          </div>
          {isAdmin && (
            <div className="mt-5 grid grid-cols-2 gap-2">
              <AdminLink to="/admin/notices" label="নোটিশ পরিচালনা" />
              <AdminLink to="/admin/events" label="ইভেন্ট পরিচালনা" />
              <AdminLink to="/admin/gallery" label="গ্যালারি" />
              <AdminLink to="/admin/committee" label="কমিটি" />
              <AdminLink to="/admin/upazila-info" label="উপজেলা পরিচিতি" />
              <AdminLink to="/admin/alumni" label="অ্যালামনাই (ম্যানুয়াল)" />
              {isDistrictAdmin && <AdminLink to="/admin/members" label="সদস্য ও রোল" />}
            </div>
          )}
          <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-red hover:text-white">
            <LogOut className="h-4 w-4" /> লগআউট
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="card-elevated p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/50 pb-1.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}

function AdminLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground">{label}</Link>
  );
}
