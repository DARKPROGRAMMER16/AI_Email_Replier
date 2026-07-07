"use client"

import { useMemo, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Inbox, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReplyCard } from "./reply-card"
import type { ReplyRecord } from "@/lib/reply-history"
import { TONES } from "@/lib/tone"

export function ReplyHistory({ records }: { records: ReplyRecord[] }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [tone, setTone] = useState<string>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records.filter((r) => {
      const matchesTone = tone === "all" || r.tone === tone
      const matchesQuery =
        q === "" ||
        (r.subject?.toLowerCase().includes(q) ?? false) ||
        (r.recipientEmail?.toLowerCase().includes(q) ?? false) ||
        r.originalEmail.toLowerCase().includes(q) ||
        r.aiReply.toLowerCase().includes(q)
      return matchesTone && matchesQuery
    })
  }, [records, query, tone])

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id)
      try {
        const res = await fetch(`/api/replies/${id}`, { method: "DELETE" })
        if (res.ok) {
          toast.success("Reply deleted")
          router.refresh()
        } else {
          const data = await res.json().catch(() => ({}))
          toast.error(data.error ?? `Delete failed (${res.status})`)
        }
      } catch {
        toast.error("Network error while deleting")
      } finally {
        setDeletingId(null)
      }
    },
    [router],
  )

  const hasRecords = records.length > 0
  const hasResults = filtered.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search replies, subjects, or recipients…"
            className="pl-9"
            aria-label="Search replies"
          />
        </div>
        <Select value={tone} onValueChange={(v) => v !== null && setTone(v)}>
          <SelectTrigger className="w-full sm:w-52" aria-label="Filter by tone">
            <SelectValue placeholder="Filter by tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tones</SelectItem>
            {TONES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hasRecords ? (
        <EmptyState
          icon={<Inbox className="size-7 text-muted-foreground" />}
          title="No replies yet"
          description="Your generated replies will show up here so you can revisit, copy, or reuse them anytime."
          action
        />
      ) : !hasResults ? (
        <EmptyState
          icon={<Search className="size-7 text-muted-foreground" />}
          title="No matching replies"
          description="Try a different search term or clear the tone filter to see everything."
        />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "reply" : "replies"}
          </p>
          <div className="space-y-3">
            {filtered.map((record) => (
              <ReplyCard
                key={record.id}
                record={record}
                onDelete={handleDelete}
                isDeleting={deletingId === record.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">{icon}</div>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1.5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? (
        <Button asChild className="mt-5">
          <Link href="/compose">
            <Sparkles className="size-4" />
            Generate your first reply
          </Link>
        </Button>
      ) : null}
    </div>
  )
}