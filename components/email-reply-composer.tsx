"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Copy, Loader2, Send, Sparkles, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { TONES, type Tone } from "@/lib/reply-generator"

const MAX_CHARS = 5000
const MAX_SUBJECT_CHARS = 200
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailReplyComposer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [tone, setTone] = useState<Tone>("Professional")
  const [reply, setReply] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedReplyId, setSavedReplyId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [prefilledFromHistory, setPrefilledFromHistory] = useState(false)
  const toneGroupRef = useRef<HTMLDivElement>(null)

  // Prefill from history reuse (query params: ?email=...&tone=...&subject=...)
  useEffect(() => {
    const reuseEmail = searchParams.get("reuse")
    if (!reuseEmail) return

    try {
      const decoded = JSON.parse(decodeURIComponent(reuseEmail)) as {
        originalEmail?: string
        tone?: Tone
        subject?: string
      }
      if (decoded.originalEmail) setEmail(decoded.originalEmail.slice(0, MAX_CHARS))
      if (decoded.tone && TONES.includes(decoded.tone)) setTone(decoded.tone)
      if (decoded.subject) setSubject((decoded.subject ?? "").slice(0, MAX_SUBJECT_CHARS))
      setPrefilledFromHistory(true)
    } catch {
      // Ignore malformed reuse payloads — silent fallback to empty composer.
    }
  }, [searchParams])

  const charCount = email.length
  const canGenerate = email.trim().length > 0 && !isGenerating
  const canSave = reply.trim().length > 0 && !isGenerating && !isSaving && !saved
  const canSend =
    reply.trim().length > 0 &&
    !isGenerating &&
    !isSaving &&
    !isSending &&
    !sent

  function handleToneKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const next = (index + 1) % TONES.length
      const buttons = toneGroupRef.current?.querySelectorAll<HTMLButtonElement>("[role='radio']")
      buttons?.[next]?.focus()
      setTone(TONES[next])
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prev = (index - 1 + TONES.length) % TONES.length
      const buttons = toneGroupRef.current?.querySelectorAll<HTMLButtonElement>("[role='radio']")
      buttons?.[prev]?.focus()
      setTone(TONES[prev])
    }
  }

  async function handleGenerate() {
    if (!canGenerate) return
    setIsGenerating(true)
    setReply("")
    setSent(false)
    setSaved(false)
    setSavedReplyId(null)

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
        toast.error(data.error ?? `Generation failed (${res.status})`)
        return
      }

      const data = (await res.json()) as { text?: string; error?: string }
      if (data.error) {
        toast.error(data.error)
        return
      }
      if (!data.text) {
        toast.error("Generation returned empty text")
        return
      }
      setReply(data.text)
    } catch {
      toast.error("Network error while generating")
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

  async function saveReply(): Promise<{ id: string } | { error: string }> {
    const res = await fetch("/api/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalEmail: email,
        aiReply: reply,
        tone,
        subject: subject.trim() || null,
        recipientEmail: recipientEmail.trim() || null,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { error: data.error ?? "Failed to save reply" }
    }
    const data = (await res.json()) as { reply?: { id: string }; error?: string }
    if (!data.reply?.id) {
      return { error: "Save returned no id" }
    }
    return { id: data.reply.id }
  }

  async function handleSave() {
    if (!canSave) return
    setIsSaving(true)
    try {
      const result = await saveReply()
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      setSavedReplyId(result.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast.success("Reply saved to history")
      router.refresh()
    } catch {
      toast.error("Network error while saving")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSend() {
    if (!canSend) return
    const recipient = recipientEmail.trim()
    if (!EMAIL_RE.test(recipient)) {
      toast.error("Enter a valid recipient email address to send")
      return
    }

    setIsSending(true)

    try {
      let replyId = savedReplyId
      if (!replyId) {
        setIsSaving(true)
        const saveResult = await saveReply()
        setIsSaving(false)
        if ("error" in saveResult) {
          toast.error(saveResult.error)
          return
        }
        replyId = saveResult.id
        setSavedReplyId(replyId)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        toast.success("Reply saved to history")
        router.refresh()
      }

      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId, recipientEmail: recipient }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? `Send failed (${res.status})`)
        return
      }

      setSent(true)
      setTimeout(() => setSent(false), 2500)
      toast.success(`Email sent to ${recipient}`)
      router.refresh()
    } catch {
      toast.error("Network error while sending")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {prefilledFromHistory ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
          <span className="text-foreground">
            Prefilled from history — tweak the inputs and generate a fresh reply.
          </span>
          <button
            type="button"
            onClick={() => {
              setPrefilledFromHistory(false)
              router.replace("/compose")
            }}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Clear
          </button>
        </div>
      ) : null}

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
                disabled={!canSend}
                className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {isSending ? <Loader2 className="size-4 animate-spin" /> : sent ? <Check className="size-4 text-emerald-500" /> : <Send className="size-4" />}
                <span className="text-xs">{isSending ? "Sending…" : sent ? "Sent" : "Send"}</span>
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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="recipient-email" className="sm:w-20 text-sm text-muted-foreground">
            Recipient
          </label>
          <Input
            id="recipient-email"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Required to send — email address the reply will be sent to"
            className="sm:flex-1"
            aria-label="Recipient email (required to send)"
          />
        </div>

        <div
          ref={toneGroupRef}
          role="radiogroup"
          aria-label="Reply tone"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="mr-1 text-sm text-muted-foreground">Tone</span>
          {TONES.map((t, index) => {
            const active = t === tone
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setTone(t)}
                onKeyDown={(e) => handleToneKeyDown(e, index)}
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
      </div>
    </div>
  )
}