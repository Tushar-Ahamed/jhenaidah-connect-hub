import { Link } from "@tanstack/react-router";
import { useRoles } from "@/hooks/use-auth";
import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** If true, only district_admin passes. Otherwise any admin (district or upazila) passes. */
  superOnly?: boolean;
};

export function AdminGuard({ children, superOnly = false }: Props) {
  const { data: roles, isLoading } = useRoles();

  if (isLoading) {
    return (
      <div className="container-page py-20 text-center text-muted-foreground">
        যাচাই করা হচ্ছে...
      </div>
    );
  }

  const isDA = roles?.some((r) => r.role === "super_admin");
  const isUA = roles?.some((r) => r.role === "upazila_admin");
  const ok = superOnly ? isDA : isDA || isUA;

  if (!ok) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-brand-red" />
          <h2 className="mt-4 text-xl font-bold">অ্যাক্সেস নেই</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            এই পেজটি শুধু {superOnly ? "জেলা অ্যাডমিন" : "অ্যাডমিন"}দের জন্য।
            পদ পেতে হলে জেলা অ্যাডমিনের সাথে যোগাযোগ করুন।
          </p>
          <Link to="/dashboard" className="mt-5 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            ড্যাশবোর্ডে ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
