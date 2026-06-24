import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-brand-green-dark text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold">ঝিনাইদহ জেলা সমিতি</h3>
          <p className="mt-1 text-sm text-primary-foreground/70">রাজশাহী বিশ্ববিদ্যালয়</p>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/80">
            ঝিনাইদহ জেলার শিক্ষার্থীদের একতা, কল্যাণ ও নেতৃত্ব বিকাশের লক্ষ্যে ১৯৯৮ সাল থেকে
            পথচলা।
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            দ্রুত লিংক
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/upazilas" className="hover:underline">উপজেলা শাখা</Link></li>
            <li><Link to="/committee" className="hover:underline">জেলা কমিটি</Link></li>
            <li><Link to="/events" className="hover:underline">ইভেন্ট</Link></li>
            <li><Link to="/notices" className="hover:underline">নোটিশ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            যোগাযোগ
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> রাজশাহী বিশ্ববিদ্যালয়, রাজশাহী–৬২০৫</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> +৮৮০ ১৭০০ ০০০০০০</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> jhenaidah@ru.ac.bd</li>
            <li className="flex items-center gap-2"><Facebook className="h-4 w-4 shrink-0" /> facebook.com/jzs.ru</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} ঝিনাইদহ জেলা সমিতি, রাজশাহী বিশ্ববিদ্যালয়। সর্বস্বত্ব সংরক্ষিত।</span>
          <span>সাইট তৈরি — শিক্ষার্থীদের জন্য, শিক্ষার্থীদের দ্বারা।</span>
        </div>
      </div>
    </footer>
  );
}
