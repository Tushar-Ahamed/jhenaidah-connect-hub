import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, CalendarDays, MapPin, Users, GraduationCap, Heart } from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DistrictMap } from "@/components/DistrictMap";
import { events, galleryItems, notices, stats, upazilas } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const districtNotices = notices.filter((n) => n.level === "district").slice(0, 3);
  const districtEvents = events.filter((e) => e.level === "district").slice(0, 3);

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
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="container-page relative grid min-h-[78vh] items-center py-24 text-primary-foreground">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
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
              রাজশাহী বিশ্ববিদ্যালয়ে অধ্যয়নরত ঝিনাইদহ জেলার ৬টি উপজেলার শিক্ষার্থী ও
              প্রাক্তনদের অফিসিয়াল প্ল্যাটফর্ম।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/members"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                সদস্য ডিরেক্টরি <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/upazilas"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                উপজেলা শাখা
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats dashboard */}
      <section className="container-page relative z-10 -mt-14">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-xl md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-gradient-brand md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive District Map */}
      <section className="container-page py-20">
        <div className="mb-10 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">
            ইন্টারঅ্যাকটিভ মানচিত্র
          </span>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            ঝিনাইদহ জেলার <span className="text-gradient-brand">৬টি উপজেলা</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            মানচিত্রের যেকোনো উপজেলায় ক্লিক/হোভার করুন — শাখার সদস্য, কমিটি ও সাম্প্রতিক
            কার্যক্রম দেখুন।
          </p>
        </div>
        <DistrictMap />
      </section>

      {/* Upazila cards with committee preview */}
      <section className="bg-secondary/50 py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">
                উপজেলা শাখা
              </span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">৬টি উপজেলা, এক পরিবার</h2>
            </div>
            <Link to="/upazilas" className="text-sm font-semibold text-primary hover:underline">
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
                    <Users className="mr-1 inline h-3 w-3" />
                    {u.members} সদস্য
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{u.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{u.intro}</p>
                <div className="mt-4 space-y-1.5 border-t border-border pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    কমিটি প্রিভিউ
                  </div>
                  {u.committee.slice(0, 2).map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-brand-red">{c.position}</span>
                    </div>
                  ))}
                </div>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand-red" />
                <h2 className="text-2xl font-bold">জেলা নোটিশ</h2>
              </div>
              <Link to="/notices" className="text-sm font-semibold text-primary hover:underline">
                সব →
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {districtNotices.map((n) => (
                <div key={n.id} className="card-elevated card-elevated-hover p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">জেলা ইভেন্ট</h2>
              </div>
              <Link to="/events" className="text-sm font-semibold text-primary hover:underline">
                সব →
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {districtEvents.map((e) => (
                <div key={e.id} className="card-elevated card-elevated-hover flex gap-4 p-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl gradient-banner text-white">
                    <div className="text-center text-xs leading-tight">
                      <div className="text-xl font-bold">{e.date.split(" ")[0]}</div>
                      <div>{e.date.split(" ")[1]}</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">📍 {e.venue}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alumni teaser */}
      <section className="bg-secondary/50 py-20">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">
              অ্যালামনাই নেটওয়ার্ক
            </span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              ১,২০০+ প্রাক্তন সদস্যের <span className="text-gradient-brand">শক্তিশালী পরিবার</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              দেশ-বিদেশে কর্মরত আমাদের প্রাক্তন সদস্যরা — শিক্ষাবিদ, প্রকৌশলী, চিকিৎসক,
              আইনজীবী, সাংবাদিক ও উদ্যোক্তা। নেটওয়ার্কে যুক্ত হোন।
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/alumni" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <GraduationCap className="h-4 w-4" /> অ্যালামনাই দেখুন
              </Link>
              <Link to="/login" className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-secondary">
                নেটওয়ার্কে যোগ দিন
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {galleryItems.slice(0, 6).map((g, i) => (
              <img
                key={g.id}
                src={g.src}
                alt=""
                loading="lazy"
                className={`h-32 w-full rounded-xl object-cover sm:h-36 ${i % 2 ? "translate-y-4" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-red">গ্যালারি</span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">স্মৃতির পাতা থেকে</h2>
          </div>
          <Link to="/gallery" className="text-sm font-semibold text-primary hover:underline">
            পুরো গ্যালারি →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.slice(0, 4).map((g) => (
            <div key={g.id} className="group overflow-hidden rounded-xl">
              <img
                src={g.src}
                alt={g.title}
                loading="lazy"
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="mt-2 text-xs font-semibold text-muted-foreground">{g.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-page pb-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-xl md:p-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <Heart className="h-8 w-8 text-brand-red" />
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">যোগাযোগে থাকুন</h2>
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
