import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { upazilas } from "@/lib/data";

export function DistrictMap() {
  const [active, setActive] = useState(upazilas[0].slug);
  const current = upazilas.find((u) => u.slug === active) ?? upazilas[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="districtFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-green)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--brand-red)" stopOpacity="0.14" />
            </linearGradient>
          </defs>
          {/* Stylised district boundary */}
          <path
            d="M30 8 Q55 4 72 14 Q92 26 86 48 Q92 66 78 82 Q60 96 38 92 Q14 86 10 60 Q6 36 18 22 Z"
            fill="url(#districtFill)"
            stroke="var(--brand-green-dark)"
            strokeWidth="0.6"
            strokeDasharray="1.4 1.2"
          />
          {/* Upazila pins */}
          {upazilas.map((u) => {
            const isActive = u.slug === active;
            return (
              <g
                key={u.slug}
                onMouseEnter={() => setActive(u.slug)}
                onFocus={() => setActive(u.slug)}
                className="cursor-pointer"
              >
                <circle
                  cx={u.map.x}
                  cy={u.map.y}
                  r={isActive ? 3.4 : 2.4}
                  fill={isActive ? "var(--brand-red)" : "var(--brand-green)"}
                  stroke="white"
                  strokeWidth="0.6"
                  className="transition-all duration-300"
                />
                {isActive && (
                  <circle
                    cx={u.map.x}
                    cy={u.map.y}
                    r="5.6"
                    fill="none"
                    stroke="var(--brand-red)"
                    strokeWidth="0.5"
                    opacity="0.6"
                  >
                    <animate attributeName="r" from="3.4" to="7" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.7" to="0" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <text
                  x={u.map.x}
                  y={u.map.y - 4.5}
                  textAnchor="middle"
                  className="pointer-events-none"
                  style={{
                    fontSize: "2.6px",
                    fontWeight: 700,
                    fill: isActive ? "var(--brand-red)" : "var(--foreground)",
                  }}
                >
                  {u.name}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium backdrop-blur">
          ঝিনাইদহ জেলা — ইন্টারঅ্যাকটিভ মানচিত্র
        </div>
      </div>

      <div className="flex flex-col">
        <div className="card-elevated p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-red">
            নির্বাচিত উপজেলা
          </div>
          <h3 className="mt-2 text-2xl font-bold">{current.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{current.intro}</p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-secondary p-3">
              <div className="text-lg font-bold text-primary">{current.members}</div>
              <div className="text-[11px] text-muted-foreground">সদস্য</div>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="truncate text-sm font-bold">{current.president}</div>
              <div className="text-[11px] text-muted-foreground">সভাপতি</div>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="truncate text-sm font-bold">{current.secretary}</div>
              <div className="text-[11px] text-muted-foreground">সম্পাদক</div>
            </div>
          </div>
          <Link
            to="/upazila/$slug"
            params={{ slug: current.slug }}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            শাখার বিস্তারিত দেখুন
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {upazilas.map((u) => (
            <button
              key={u.slug}
              onClick={() => setActive(u.slug)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                u.slug === active
                  ? "border-brand-red bg-accent font-semibold text-accent-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
