import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/admin/activity-logs")({
  head: () => ({ meta: [{ title: "কার্যকলাপ লগ" }] }),
  component: () => <AdminGuard superOnly><ActivityLogsPage /></AdminGuard>,
});

function ActivityLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activity_logs")
        .select("id, action, entity_type, entity_id, metadata, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PageShell title="কার্যকলাপ লগ" subtitle="সাম্প্রতিক ২০০টি ইউজার কার্যকলাপ।">
      {isLoading && <div className="text-center text-muted-foreground">লোড হচ্ছে...</div>}
      <div className="overflow-x-auto card-elevated">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs">
            <tr>
              <th className="p-3 text-left">সময়</th>
              <th className="p-3 text-left">কাজ</th>
              <th className="p-3 text-left">টার্গেট</th>
              <th className="p-3 text-left">ইউজার</th>
              <th className="p-3 text-left">বিস্তারিত</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-t border-border/50">
                <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("bn-BD")}</td>
                <td className="p-3 font-semibold">{r.action}</td>
                <td className="p-3 text-xs">{r.entity_type ?? "—"} {r.entity_id ? `(${r.entity_id.slice(0,8)})` : ""}</td>
                <td className="p-3 text-xs text-muted-foreground">{r.user_id?.slice(0,8) ?? "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{JSON.stringify(r.metadata)}</td>
              </tr>
            ))}
            {!isLoading && (data ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">কোনো লগ নেই</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
