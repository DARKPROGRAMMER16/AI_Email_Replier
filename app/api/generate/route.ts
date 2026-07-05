import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateText } from "ai"
import { createGoogle } from "@ai-sdk/google"
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts"
import type { Tone } from "@/lib/reply-generator"

const VALID_TONES: Tone[] = ["Professional", "Friendly", "Brief", "Apologetic", "Enthusiastic"]
const MAX_EMAIL_CHARS = 5000

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { email?: unknown; tone?: unknown; subject?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.slice(0, MAX_EMAIL_CHARS) : ""
  const tone = typeof body.tone === "string" && VALID_TONES.includes(body.tone as Tone)
    ? (body.tone as Tone)
    : "Professional"
  const subject = typeof body.subject === "string" && body.subject.trim().length > 0 ? body.subject.trim() : null

  if (!email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 })
  }

  const provider = createGoogle({ apiKey: process.env.GEMINI_API_KEY })
  const model = provider("gemini-2.5-flash")

  try {
    const result = await generateText({
      model,
      system: buildSystemPrompt(tone),
      prompt: buildUserPrompt({ email, tone, subject }),
      temperature: 0.7,
      maxOutputTokens: 500,
    })

    return NextResponse.json({ text: result.text })
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    console.error("[generate] error", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}