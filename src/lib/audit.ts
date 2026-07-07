import { supabase } from "@/integrations/supabase/client";

export type ActivityAction =
  | "login"
  | "logout"
  | "user_created"
  | "role_granted"
  | "role_revoked"
  | "notice_created"
  | "event_created"
  | "member_approved"
  | "member_suspended"
  | "member_rejected"
  | "member_transferred"
  | "file_uploaded";

export async function logActivity(
  action: ActivityAction,
  meta?: { entity_type?: string; entity_id?: string; [k: string]: unknown },
) {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { entity_type, entity_id, ...rest } = meta ?? {};
    await supabase.from("activity_logs").insert({
      user_id: u.user.id,
      action,
      entity_type: entity_type ?? null,
      entity_id: entity_id ?? null,
      metadata: rest,
    });
  } catch {
    // non-fatal
  }
}

export async function logAudit(
  action: string,
  target: { type: string; id: string },
  changes?: { before?: unknown; after?: unknown },
) {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("audit_logs").insert({
      actor_id: u.user.id,
      actor_email: u.user.email ?? null,
      action,
      target_type: target.type,
      target_id: target.id,
      before_data: (changes?.before ?? null) as never,
      after_data: (changes?.after ?? null) as never,
    });
  } catch {
    // non-fatal
  }
}

export async function notify(userId: string, title: string, body?: string, link?: string) {
  try {
    await supabase.from("notifications").insert({ user_id: userId, title, body: body ?? null, link: link ?? null });
  } catch {
    // non-fatal
  }
}
