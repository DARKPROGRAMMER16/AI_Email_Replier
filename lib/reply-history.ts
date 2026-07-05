import { createSupabaseClient } from "@/lib/supabase/server"
import type { Tone } from "@/lib/reply-generator"

export type ReplyRecord = {
  id: string
  tone: Tone
  subject: string | null
  recipientEmail: string | null
  originalEmail: string
  aiReply: string
  sentAt: string | null
  createdAt: string
}

type ReplyRow = {
  id: string
  user_id: string
  original_email: string
  ai_reply: string
  tone: string
  subject: string | null
  recipient_email: string | null
  sent_at: string | null
  created_at: string
}

function toReplyRecord(row: ReplyRow): ReplyRecord {
  return {
    id: row.id,
    tone: row.tone as Tone,
    subject: row.subject,
    recipientEmail: row.recipient_email,
    originalEmail: row.original_email,
    aiReply: row.ai_reply,
    sentAt: row.sent_at,
    createdAt: row.created_at,
  }
}

export async function listReplies(): Promise<ReplyRecord[]> {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[listReplies] error", error.message)
    return []
  }

  return (data as ReplyRow[] ?? []).map(toReplyRecord)
}

export type NewReply = {
  originalEmail: string
  aiReply: string
  tone: Tone
  subject?: string | null
  recipientEmail?: string | null
}

export async function insertReply(
  input: NewReply,
): Promise<{ record: ReplyRecord | null; error: string | null }> {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from("replies")
    .insert({
      original_email: input.originalEmail,
      ai_reply: input.aiReply,
      tone: input.tone,
      subject: input.subject ?? null,
      recipient_email: input.recipientEmail ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error("[insertReply] error", error.message)
    return { record: null, error: error.message }
  }
  return { record: toReplyRecord(data as ReplyRow), error: null }
}

export async function deleteReply(id: string): Promise<boolean> {
  const supabase = await createSupabaseClient()
  const { error } = await supabase.from("replies").delete().eq("id", id)
  if (error) {
    console.error("[deleteReply] error", error.message)
    return false
  }
  return true
}