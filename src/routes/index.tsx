import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, CalendarDays, MapPin, Users } from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { events, galleryImages, notices, stats, upazilas } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="রাজশাহী বিশ্ববিদ্যালয় ক্যাম্পাস"
          width={1920}
          height={960}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container-page relative grid min-h-[78vh] items-center py-24 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand-red" />
              প্রতিষ্ঠা ১৯৯৮ • রাজশাহী বিশ্ববিদ্যালয়
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              ঝিনাইদহ জেলা সমিতি
              <span className="mt-2 block text-2xl font-medium text-white/85 sm:text-3xl">
                একতাই আমাদের শক্তি, শিক্ষাই আমাদের আলো
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
              রাজশাহী বিশ্ববিদ্যালয়ে অধ্যয়নরত ঝিনাইদহ জেলার ৬টি উপজেলার শিক্ষার্থীদের একটি
              পরিবার। সদস্যদের কল্যাণ, সামাজিক দায়িত্ব ও নেতৃত্ব বিকাশে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/upazilas"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                উপজেলা শাখা দেখুন <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/committee"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                জেলা কমিটি
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-14 relative z-10">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-xl md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-gradient-brand md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="container-page py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">
              আমাদের সম্পর্কে
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              জ্ঞান, সংস্কৃতি ও সেবার <span className="text-gradient-brand">মেলবন্ধন</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয় — একটি অরাজনৈতিক, অলাভজনক ও
              স্বেচ্ছাসেবী ছাত্র সংগঠন। ১৯৯৮ সাল থেকে আমরা নবীনবরণ, বিদায় সংবর্ধনা,
              শিক্ষাবৃত্তি, রক্তদান, শীতবস্ত্র বিতরণ ও বিভিন্ন সাংস্কৃতিক কর্মকাণ্ডের মাধ্যমে
              শিক্ষার্থীদের পাশে আছি।
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-border bg-card p-4">
                <Users className="h-5 w-5 text-primary" />
                <div className="mt-2 font-semibold">পারিবারিক বন্ধন</div>
                <p className="mt-1 text-muted-foreground">৬টি উপজেলার শিক্ষার্থীদের এক ছাতার নিচে।</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <MapPin className="h-5 w-5 text-brand-red" />
                <div className="mt-2 font-semibold">সামাজিক দায়িত্ব</div>
                <p className="mt-1 text-muted-foreground">জেলায় নিয়মিত কল্যাণমূলক কর্মসূচি।</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.map((g, i) => (
              <img
                key={i}
                src={g}
                alt=""
                loading="lazy"
                className={`h-48 w-full rounded-xl object-cover md:h-56 ${i % 2 ? "translate-y-6" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upazilas */}
      <section className="bg-secondary/50 py-20">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">
                উপজেলা শাখা
              </span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">৬টি উপজেলা, এক পরিবার</h2>
            </div>
            <Link to="/upazilas" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">
              সব দেখুন →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upazilas.map((u) => (
              <Link
                key={u.slug}
                to="/upazila/$slug"
                params={{ slug: u.slug }}
                className="card-elevated card-elevated-hover group block p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-banner text-lg font-bold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {u.members} সদস্য
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{u.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{u.intro}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                  বিস্তারিত
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Notices + Events */}
      <section className="container-page py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-red" />
              <h2 className="text-2xl font-bold">সর্বশেষ নোটিশ</h2>
            </div>
            <div className="mt-6 space-y-3">
              {notices.slice(0, 4).map((n) => (
                <div key={n.id} className="card-elevated card-elevated-hover p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-secondary px-2 py-1 font-semibold text-secondary-foreground">
                      {n.scope}
                    </span>
                    <span className="text-muted-foreground">{n.date}</span>
                  </div>
                  <h3 className="mt-3 font-semibold">{n.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">আসন্ন ইভেন্ট</h2>
            </div>
            <div className="mt-6 space-y-3">
              {events.map((e) => (
                <div key={e.id} className="card-elevated card-elevated-hover flex gap-4 p-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl gradient-banner text-white">
                    <div className="text-center text-xs leading-tight">
                      <div className="text-xl font-bold">{e.date.split(" ")[0]}</div>
                      <div>{e.date.split(" ")[1]}</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      📍 {e.venue}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-secondary/50 py-20">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">গ্যালারি</span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">স্মৃতির পাতা থেকে</h2>
            </div>
            <Link to="/gallery" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">
              পুরো গ্যালারি →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((g, i) => (
              <div key={i} className="group overflow-hidden rounded-xl">
                <img
                  src={g}
                  alt=""
                  loading="lazy"
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-page py-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-xl md:p-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">যোগাযোগে থাকুন</h2>
              <p className="mt-3 text-muted-foreground">
                নতুন সদস্য হতে চান, প্রশ্ন আছে অথবা সহযোগিতা করতে চান? আমাদের সাথে যোগাযোগ করুন।
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  মেসেজ পাঠান
                </Link>
                <Link to="/login" className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary">
                  সদস্য হোন
                </Link>
              </div>
            </div>
            <ul className="grid gap-3 text-sm">
              <li className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                <MapPin className="h-5 w-5 text-brand-red" /> রাজশাহী বিশ্ববিদ্যালয়, রাজশাহী–৬২০৫
              </li>
              <li className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                ✉ jhenaidah@ru.ac.bd
              </li>
              <li className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                ☎ +৮৮০ ১৭০০ ০০০০০০
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
