"use client"

import { useState } from "react"
import { Check, Copy, Trash2 } from "lucide-react"
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
}: {
  record: ReplyRecord
  onDelete: (id: string) => void
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    copyText(record.reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <article className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <ToneBadge tone={record.tone} />
          <span className="text-sm font-medium text-foreground">{record.subject}</span>
          <span className="text-xs text-muted-foreground">· {record.sender}</span>
        </div>

        <div className="flex items-center gap-1">
          <time
            dateTime={record.createdAt}
            className="mr-1 hidden text-xs text-muted-foreground sm:inline"
            title={new Date(record.createdAt).toLocaleString()}
          >
            {timeAgo(record.createdAt)}
          </time>
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
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(record.id)}
            aria-label="Delete reply"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">Original</p>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{record.original}</p>
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">AI reply</p>
          <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{record.reply}</p>
        </div>
      </div>

      <time
        dateTime={record.createdAt}
        className="mt-3 block text-xs text-muted-foreground sm:hidden"
      >
        {timeAgo(record.createdAt)}
      </time>
    </article>
  )
}
