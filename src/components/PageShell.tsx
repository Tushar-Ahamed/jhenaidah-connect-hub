import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-banner text-primary-foreground">
        <div className="container-page py-10 sm:py-14 md:py-20">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">{subtitle}</p>}
        </div>
      </section>
      <main className="container-page py-8 sm:py-12 md:py-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
