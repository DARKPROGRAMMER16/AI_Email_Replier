"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Trash2, Loader2, Send, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ToneBadge } from "./tone-badge"
import type { ReplyRecord } from "@/lib/reply-history"

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const mins = Math.round(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function copyText(text: string) {
  try {
    void navigator.clipboard.writeText(text)
    return
  } catch {
    // fall through to legacy fallback
  }
  const textarea = document.createElement("textarea")
  textarea.value = text
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

export function ReplyCard({
  record,
  onDelete,
  isDeleting = false,
}: {
  record: ReplyRecord
  onDelete: (id: string) => void
  isDeleting?: boolean
}) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isSending, setIsSending] = useState(false)

  function handleCopy() {
    copyText(record.aiReply)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const canResend = !!record.recipientEmail && !isSending

  async function handleResend() {
    if (!canResend || !record.recipientEmail) return
    setIsSending(true)
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replyId: record.id,
          recipientEmail: record.recipientEmail,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? `Send failed (${res.status})`)
        return
      }
      toast.success(`Email sent to ${record.recipientEmail}`)
      router.refresh()
    } catch {
      toast.error("Network error while sending")
    } finally {
      setIsSending(false)
    }
  }

  function handleReuseClick() {
    const payload = JSON.stringify({
      originalEmail: record.originalEmail,
      tone: record.tone,
      subject: record.subject,
    })
    router.push(`/compose?reuse=${encodeURIComponent(payload)}`)
  }

  return (
    <article className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <ToneBadge tone={record.tone} />
          <span className="text-sm font-medium text-foreground">
            {record.subject ?? "Untitled reply"}
          </span>
          {record.recipientEmail ? (
            <span className="text-xs text-muted-foreground">· {record.recipientEmail}</span>
          ) : null}
          {record.sentAt ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Send className="size-3" />
              Sent
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <time
            dateTime={record.createdAt}
            className="mr-1 hidden text-xs text-muted-foreground sm:inline"
            title={new Date(record.createdAt).toLocaleString()}
            suppressHydrationWarning
          >
            {timeAgo(record.createdAt)}
          </time>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={handleReuseClick}
            aria-label="Reuse this email as a starting point"
            title="Reuse this email as a starting point"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            aria-label="Copy reply"
          >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={handleResend}
            disabled={!canResend}
            aria-label={record.recipientEmail ? `Resend to ${record.recipientEmail}` : "Recipient email missing"}
            title={record.recipientEmail ? `Resend to ${record.recipientEmail}` : "Recipient email missing"}
          >
            {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(record.id)}
            disabled={isDeleting}
            aria-label="Delete reply"
          >
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">Original</p>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{record.originalEmail}</p>
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">AI reply</p>
          <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{record.aiReply}</p>
        </div>
      </div>

      <time
        dateTime={record.createdAt}
        className="mt-3 block text-xs text-muted-foreground sm:hidden"
        suppressHydrationWarning
      >
        {timeAgo(record.createdAt)}
      </time>
    </article>
  )
}