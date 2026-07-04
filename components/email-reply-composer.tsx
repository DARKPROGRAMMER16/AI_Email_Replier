"use client"

import { useState } from "react"
import { Check, Copy, Loader2, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { generateReply, TONES, type Tone } from "@/lib/reply-generator"

const MAX_CHARS = 5000

export function EmailReplyComposer() {
  const [email, setEmail] = useState("")
  const [tone, setTone] = useState<Tone>("Professional")
  const [reply, setReply] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const charCount = email.length
  const canGenerate = email.trim().length > 0 && !isGenerating

  async function handleGenerate() {
    if (!canGenerate) return
    setIsGenerating(true)
    setReply("")
    setSent(false)

    // Simulate a short streaming generation for a responsive feel.
    const full = generateReply(email, tone)
    await new Promise((r) => setTimeout(r, 500))
    const words = full.split(" ")
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 18))
      setReply((prev) => (prev ? prev + " " : "") + words[i])
    }
    setIsGenerating(false)
  }

  async function handleCopy() {
    if (!reply) return
    try {
      await navigator.clipboard.writeText(reply)
    } catch {
      // Clipboard API may be unavailable (e.g. insecure context or sandboxed iframe).
      const textarea = document.createElement("textarea")
      textarea.value = reply
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand("copy")
      } catch {
        // Ignore — copying is best-effort.
      }
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
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
                onClick={handleSend}
                disabled={!reply || isGenerating}
                className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Send className="size-4" />
                <span className="text-xs">{sent ? "Sent" : "Send"}</span>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[340px] flex-1 px-4 py-4">
            {reply ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{reply}</p>
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
      </div>
    </div>
  )
}
