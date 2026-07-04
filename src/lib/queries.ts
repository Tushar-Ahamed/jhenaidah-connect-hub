import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  roll_no: string | null;
  reg_no: string | null;
  department: string | null;
  session: string | null;
  hall: string | null;
  upazila: string | null;
  phone: string | null;
  real_email: string | null;
  avatar_url: string | null;
  is_alumni: boolean;
  current_position: string | null;
  member_type: string;
  institution: string | null;
  designation: string | null;
};

export type CommitteePosition = {
  id: string;
  level: "district" | "upazila";
  upazila: string | null;
  position_title: string;
  holder_user_id: string | null;
  holder_name: string | null;
  term_start: string | null;
  term_end: string | null;
  order_index: number;
};

export type AlumniManual = {
  id: string;
  full_name: string;
  department: string | null;
  session: string | null;
  hall: string | null;
  upazila: string;
  current_position: string | null;
  avatar_url: string | null;
};

export type UpazilaInfo = {
  upazila: string;
  intro: string | null;
  cover_url: string | null;
};

export function useProfiles(filter?: { upazila?: string; member_type?: string }) {
  return useQuery({
    queryKey: ["profiles", filter],
    queryFn: async () => {
      let q = supabase.from("profiles").select("*").order("full_name");
      if (filter?.upazila) q = q.eq("upazila", filter.upazila);
      if (filter?.member_type) q = q.eq("member_type", filter.member_type);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as ProfileRow[];
    },
  });
}

export function useCommittee(level: "district" | "upazila", upazila?: string) {
  return useQuery({
    queryKey: ["committee", level, upazila ?? null],
    queryFn: async () => {
      let q = supabase
        .from("committee_positions")
        .select("*")
        .eq("level", level)
        .is("term_end", null)
        .order("order_index");
      if (level === "upazila" && upazila) q = q.eq("upazila", upazila);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CommitteePosition[];
    },
  });
}

export function useAlumniManual(upazila?: string) {
  return useQuery({
    queryKey: ["alumni_manual", upazila ?? null],
    queryFn: async () => {
      let q = supabase.from("alumni_manual").select("*").order("full_name");
      if (upazila) q = q.eq("upazila", upazila);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as AlumniManual[];
    },
  });
}

export function useUpazilaInfo(upazila?: string) {
  return useQuery({
    queryKey: ["upazila_info", upazila ?? "all"],
    queryFn: async () => {
      if (upazila) {
        const { data, error } = await supabase
          .from("upazila_info")
          .select("*")
          .eq("upazila", upazila)
          .maybeSingle();
        if (error) throw error;
        return (data ?? null) as unknown as UpazilaInfo | null;
      }
      const { data, error } = await supabase.from("upazila_info").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as UpazilaInfo[];
    },
  });
}

// Global counts per upazila (member_type student/alumni/teacher included)
export function useUpazilaCounts() {
  return useQuery({
    queryKey: ["upazila_counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("upazila");
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of (data ?? []) as { upazila: string | null }[]) {
        if (row.upazila) counts[row.upazila] = (counts[row.upazila] ?? 0) + 1;
      }
      return counts;
    },
  });
}

export function useCommitteeSummary() {
  // Returns { [upazila]: { president?: string, secretary?: string } }
  return useQuery({
    queryKey: ["committee_summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("committee_positions")
        .select("*")
        .is("term_end", null);
      if (error) throw error;
      const summary: Record<string, { president?: string; secretary?: string }> = {};
      for (const p of (data ?? []) as unknown as CommitteePosition[]) {
        const key = p.level === "district" ? "__district__" : p.upazila ?? "";
        if (!summary[key]) summary[key] = {};
        const name = p.holder_name ?? "";
        if (/সভাপতি/.test(p.position_title) && !summary[key].president) summary[key].president = name;
        if (/সাধারণ সম্পাদক|সেক্রেটারি/.test(p.position_title) && !summary[key].secretary)
          summary[key].secretary = name;
      }
      return summary;
    },
  });
}
