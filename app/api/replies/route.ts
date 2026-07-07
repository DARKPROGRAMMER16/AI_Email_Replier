import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { insertReply, type NewReply } from "@/lib/reply-history"
import type { Tone } from "@/lib/tone"

export async function POST(request: Request) {
  let body: Partial<NewReply> & { tone?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body.originalEmail || !body.aiReply || !body.tone) {
    return NextResponse.json(
      { error: "originalEmail, aiReply, and tone are required" },
      { status: 400 },
    )
  }

  const { record: created, error: insertError } = await insertReply({
    originalEmail: body.originalEmail,
    aiReply: body.aiReply,
    tone: body.tone as Tone,
    subject: body.subject ?? null,
    recipientEmail: body.recipientEmail ?? null,
  })

  if (insertError || !created) {
    return NextResponse.json(
      { error: insertError ?? "Insert failed" },
      { status: 500 },
    )
  }

  revalidatePath("/history")
  return NextResponse.json({ reply: created }, { status: 201 })
}