import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles } from "@/hooks/use-auth";
import { GALLERY_CATEGORIES, UPAZILAS } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  head: () => ({ meta: [{ title: "গ্যালারি পরিচালনা" }] }),
  component: () => <AdminGuard><AdminGallery /></AdminGuard>,
});

function AdminGallery() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: roles } = useRoles();
  const isDistrict = roles?.some((r) => r.role === "super_admin");
  const upazilaScope = roles?.find((r) => r.role === "upazila_admin")?.upazila;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [upazila, setUpazila] = useState<string>(upazilaScope || "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (upazilaScope) setUpazila(upazilaScope); }, [upazilaScope]);

  const { data: items } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // resolve signed URLs
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {
      if (!items) return;
      const res: Record<string, string> = {};
      for (const i of items as any[]) {
        const { data } = await supabase.storage.from("gallery").createSignedUrl(i.image_url, 3600);
        if (data?.signedUrl) res[i.id] = data.signedUrl;
      }
      setUrls(res);
    })();
  }, [items]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user!.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file);
      if (upErr) throw upErr;
      const { error } = await supabase.from("gallery").insert({
        title, category, image_url: path,
        upazila: isDistrict && !upazila ? null : (upazila || upazilaScope || null),
      });
      if (error) throw error;
      toast.success("আপলোড সম্পন্ন");
      setTitle(""); setFile(null);
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err: any) {
      toast.error(err?.message ?? "আপলোড ব্যর্থ");
    } finally { setBusy(false); }
  }

  async function del(id: string, path: string) {
    if (!confirm("মুছে ফেলবেন?")) return;
    await supabase.storage.from("gallery").remove([path]);
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }

  return (
    <PageShell title="গ্যালারি পরিচালনা">
      <form onSubmit={upload} className="card-elevated space-y-3 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <input placeholder="শিরোনাম" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border border-input bg-background p-3 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-input bg-background p-3 text-sm">
            {GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {isDistrict && (
          <select value={upazila} onChange={(e) => setUpazila(e.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-sm">
            <option value="">জেলা পর্যায়ের</option>
            {UPAZILAS.map((u) => <option key={u}>{u}</option>)}
          </select>
        )}
        <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
        <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          <Upload className="h-4 w-4" /> {busy ? "আপলোড হচ্ছে..." : "আপলোড"}
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items?.map((i: any) => (
          <div key={i.id} className="card-elevated overflow-hidden">
            {urls[i.id] && <img src={urls[i.id]} className="h-40 w-full object-cover" alt={i.title} />}
            <div className="flex items-start justify-between gap-2 p-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{i.title || "শিরোনামহীন"}</div>
                <div className="text-xs text-muted-foreground">{i.category} • {i.upazila || "জেলা"}</div>
              </div>
              <button onClick={() => del(i.id, i.image_url)} className="rounded p-2 text-brand-red hover:bg-accent"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
