import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/admin/audit-logs")({
  head: () => ({ meta: [{ title: "অডিট লগ" }] }),
  component: () => <AdminGuard superOnly><AuditLogsPage /></AdminGuard>,
});

function AuditLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs")
        .select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PageShell title="অডিট লগ" subtitle="সব অ্যাডমিন অ্যাকশনের ট্রেইল।">
      {isLoading && <div className="text-center text-muted-foreground">লোড হচ্ছে...</div>}
      <div className="space-y-2">
        {(data ?? []).map((r) => (
          <div key={r.id} className="card-elevated p-4 text-sm">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{new Date(r.created_at).toLocaleString("bn-BD")}</span>
              <span>{r.actor_email ?? r.actor_id?.slice(0,8)}</span>
            </div>
            <div className="mt-1 font-bold">{r.action}</div>
            <div className="text-xs text-muted-foreground">{r.target_type} · {r.target_id}</div>
            {(r.before_data || r.after_data) && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-muted-foreground">বিস্তারিত</summary>
                <pre className="mt-1 overflow-auto rounded bg-secondary p-2 text-[10px]">{JSON.stringify({ before: r.before_data, after: r.after_data }, null, 2)}</pre>
              </details>
            )}
          </div>
        ))}
        {!isLoading && (data ?? []).length === 0 && (
          <div className="card-elevated p-10 text-center text-muted-foreground">কোনো অডিট লগ নেই</div>
        )}
      </div>
    </PageShell>
  );
}
