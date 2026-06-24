import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "যোগাযোগ — ঝিনাইদহ জেলা সমিতি" },
      { name: "description", content: "ঝিনাইদহ জেলা সমিতির সাথে যোগাযোগ।" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell title="যোগাযোগ" subtitle="আমরা আপনার মতামত ও প্রশ্ন শুনতে আগ্রহী।">
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="card-elevated space-y-4 p-8"
          onSubmit={(e) => {
            e.preventDefault();
            alert("ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।");
          }}
        >
          <Field label="আপনার নাম" type="text" />
          <Field label="ইমেইল" type="email" />
          <Field label="বিষয়" type="text" />
          <div>
            <label className="mb-1 block text-sm font-medium">বার্তা</label>
            <textarea
              rows={5}
              required
              className="w-full rounded-lg border border-input bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            বার্তা পাঠান
          </button>
        </form>

        <div className="space-y-4">
          <Info icon={<MapPin className="h-5 w-5" />} title="ঠিকানা" value="রাজশাহী বিশ্ববিদ্যালয়, রাজশাহী–৬২০৫, বাংলাদেশ" />
          <Info icon={<Phone className="h-5 w-5" />} title="ফোন" value="+৮৮০ ১৭০০ ০০০০০০" />
          <Info icon={<Mail className="h-5 w-5" />} title="ইমেইল" value="jhenaidah@ru.ac.bd" />
          <div className="card-elevated overflow-hidden">
            <iframe
              title="Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=88.62%2C24.36%2C88.65%2C24.38&layer=mapnik"
              className="h-72 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, type }: { label: string; type: string }) {
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

function Info({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="card-elevated flex items-start gap-4 p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
