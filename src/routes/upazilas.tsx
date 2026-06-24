import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { upazilas } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/upazilas")({
  head: () => ({
    meta: [
      { title: "উপজেলা শাখা — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "ঝিনাইদহ জেলার ৬টি উপজেলা শাখা।" },
    ],
  }),
  component: UpazilasPage,
});

function UpazilasPage() {
  return (
    <PageShell title="উপজেলা শাখাসমূহ" subtitle="৬টি উপজেলা — একটি পরিবার। আপনার উপজেলা শাখার বিস্তারিত দেখুন।">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {upazilas.map((u) => (
          <Link
            key={u.slug}
            to="/upazila/$slug"
            params={{ slug: u.slug }}
            className="card-elevated card-elevated-hover group block p-6"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl gradient-banner text-xl font-bold text-white">
                {u.name.charAt(0)}
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {u.members} সদস্য
              </span>
            </div>
            <h3 className="mt-5 text-xl font-bold">{u.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{u.intro}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-secondary p-2">
                <div className="text-muted-foreground">সভাপতি</div>
                <div className="truncate font-semibold">{u.president}</div>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <div className="text-muted-foreground">সম্পাদক</div>
                <div className="truncate font-semibold">{u.secretary}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
              বিস্তারিত <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
