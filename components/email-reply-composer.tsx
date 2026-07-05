"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Loader2, Send, Sparkles, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { TONES, type Tone } from "@/lib/reply-generator"

const MAX_CHARS = 5000
const MAX_SUBJECT_CHARS = 200

export function EmailReplyComposer() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [tone, setTone] = useState<Tone>("Professional")
  const [reply, setReply] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const charCount = email.length
  const canGenerate = email.trim().length > 0 && !isGenerating
  const canSave = reply.trim().length > 0 && !isGenerating && !isSaving && !saved

  async function handleGenerate() {
    if (!canGenerate) return
    setIsGenerating(true)
    setReply("")
    setSent(false)
    setSaved(false)
    setSaveError(null)
    setGenerateError(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tone,
          subject: subject.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setGenerateError(data.error ?? `Generation failed (${res.status})`)
        return
      }

      const data = (await res.json()) as { text?: string; error?: string }
      if (data.error) {
        setGenerateError(data.error)
        return
      }
      if (!data.text) {
        setGenerateError("Generation returned empty text")
        return
      }
      setReply(data.text)
    } catch {
      setGenerateError("Network error while generating")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    if (!reply) return
    try {
      await navigator.clipboard.writeText(reply)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = reply
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand("copy")
      } catch {
        // best-effort
      }
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  async function handleSave() {
    if (!canSave) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalEmail: email,
          aiReply: reply,
          tone,
          subject: subject.trim() || null,
          recipientEmail: null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSaveError(data.error ?? "Failed to save reply")
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch {
      setSaveError("Network error while saving")
    } finally {
      setIsSaving(false)
    }
  }

  function handleSend() {
    if (!reply) return
    setSent(true)
    setTimeout(() => setSent(false), 1600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input column */}
        <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <label htmlFor="source-email" className="text-sm font-medium text-foreground">
              Paste the email you want to reply to
            </label>
            <span
              className={cn(
                "font-mono text-xs tabular-nums",
                charCount > MAX_CHARS ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
          <Textarea
            id="source-email"
            value={email}
            onChange={(e) => setEmail(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Hi, I wanted to follow up on our conversation last week about the project timeline…"
            className="min-h-[340px] flex-1 resize-none rounded-none border-0 bg-transparent px-4 py-4 text-sm leading-relaxed shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Output column */}
        <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <span className="text-sm font-medium text-foreground">Generated reply</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!reply || isGenerating}
                className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={!canSave}
                className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4 text-emerald-500" /> : <Save className="size-4" />}
                <span className="text-xs">{isSaving ? "Saving…" : saved ? "Saved" : "Save"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSend}
                disabled={!reply || isGenerating}
                className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Send className="size-4" />
                <span className="text-xs">{sent ? "Sent" : "Send"}</span>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[340px] max-h-[60vh] flex-1 overflow-y-auto px-4 py-4">
            {reply ? (
              <p className="whitespace-pre-wrap pr-1 text-sm leading-relaxed text-foreground">{reply}</p>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {isGenerating ? "Drafting your reply…" : "Your reply will appear here"}
                </p>
              </div>
            )}
            {isGenerating && (
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-foreground align-middle" />
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="subject" className="sm:w-20 text-sm text-muted-foreground">
            Subject
          </label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value.slice(0, MAX_SUBJECT_CHARS))}
            placeholder="Optional — used when saving to history"
            maxLength={MAX_SUBJECT_CHARS}
            className="sm:flex-1"
            aria-label="Subject (optional)"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-muted-foreground">Tone</span>
          {TONES.map((t) => {
            const active = t === tone
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {t}
              </button>
            )
          })}
        </div>

        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="h-12 w-full gap-2 text-base font-medium"
        >
          {isGenerating ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Sparkles className="size-5" />
          )}
          {isGenerating ? "Generating…" : "Generate Reply"}
        </Button>

        {generateError ? (
          <p className="text-xs text-destructive" role="alert">
            {generateError}
          </p>
        ) : null}
        {saveError ? (
          <p className="text-xs text-destructive" role="alert">
            {saveError}
          </p>
        ) : null}
      </div>
    </div>
  )
}