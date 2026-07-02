import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "হোম" },
  { to: "/upazilas", label: "উপজেলা" },
  { to: "/members", label: "সদস্য" },
  { to: "/alumni", label: "অ্যালামনাই" },
  { to: "/committee", label: "কমিটি" },
  { to: "/events", label: "ইভেন্ট" },
  { to: "/notices", label: "নোটিশ" },
  { to: "/gallery", label: "গ্যালারি" },
  { to: "/contact", label: "যোগাযোগ" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("লগআউট হয়েছে");
    navigate({ to: "/", replace: true });
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={logo} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-foreground sm:text-base">ঝিনাইদহ জেলা সমিতি</div>
            <div className="truncate text-[11px] text-muted-foreground sm:text-xs">রাজশাহী বিশ্ববিদ্যালয়</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="rounded-md px-2 py-2 text-[13px] font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
          {user ? (
            <div className="relative ml-2">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-md border border-input px-3 py-1.5 text-[13px] font-semibold hover:bg-accent">
                <UserIcon className="h-4 w-4" /> {profile?.full_name?.split(" ")[0] || "অ্যাকাউন্ট"}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent"><LayoutDashboard className="h-4 w-4" /> ড্যাশবোর্ড</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent"><UserIcon className="h-4 w-4" /> প্রোফাইল</Link>
                  <button onClick={signOut} className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-sm text-brand-red hover:bg-accent"><LogOut className="h-4 w-4" /> লগআউট</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="ml-2 rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground hover:opacity-90">লগইন</Link>
          )}
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="shrink-0 rounded-md p-2 text-foreground lg:hidden" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-primary" }}
                activeOptions={{ exact: n.to === "/" }}>
                {n.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">ড্যাশবোর্ড</Link>
                <button onClick={signOut} className="mt-2 rounded-md border border-brand-red px-3 py-2.5 text-center text-sm font-semibold text-brand-red">লগআউট</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="mt-2 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">লগইন / রেজিস্ট্রেশন</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
