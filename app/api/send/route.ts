import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { auth } from "@clerk/nextjs/server"
import { getReply, markSent } from "@/lib/reply-history"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { replyId?: unknown; recipientEmail?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const replyId = typeof body.replyId === "string" ? body.replyId : null
  const recipientEmail =
    typeof body.recipientEmail === "string" ? body.recipientEmail.trim() : ""

  if (!replyId) {
    return NextResponse.json({ error: "replyId is required" }, { status: 400 })
  }
  if (!EMAIL_RE.test(recipientEmail)) {
    return NextResponse.json(
      { error: "A valid recipient email is required" },
      { status: 400 },
    )
  }

  // Ownership is enforced by RLS: getReply uses the per-user Clerk-scoped
  // Supabase client, so a request for another user's reply returns null.
  const reply = await getReply(replyId)
  if (!reply) {
    return NextResponse.json(
      { error: "Reply not found (or does not belong to you)" },
      { status: 404 },
    )
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json(
      { error: "Resend is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL missing)" },
      { status: 500 },
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const subject = reply.subject || "Your AI reply"
  const textBody = reply.aiReply
  const htmlBody = `<pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${escapeHtml(reply.aiReply)}</pre>`

  const { error: sendError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: recipientEmail,
    subject,
    text: textBody,
    html: htmlBody,
  })

  if (sendError) {
    console.error("[send] Resend error", sendError.message, sendError.name)
    return NextResponse.json(
      { error: `Resend error: ${sendError.message}` },
      { status: 502 },
    )
  }

  const ok = await markSent(replyId)
  if (!ok) {
    // Email sent but marking the row failed — log it but don't fail the
    // whole request since the email itself went out successfully.
    console.error("[send] email sent but markSent failed for reply", replyId)
  }

  revalidatePath("/history")
  return NextResponse.json({ ok: true, sentAt: new Date().toISOString() })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}