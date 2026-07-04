"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Inbox, Sparkles } from "lucide-react"
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
import { sampleHistory } from "@/lib/reply-history"
import { TONES } from "@/lib/reply-generator"

export function ReplyHistory() {
  const [records, setRecords] = useState(sampleHistory)
  const [query, setQuery] = useState("")
  const [tone, setTone] = useState<string>("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records.filter((r) => {
      const matchesTone = tone === "all" || r.tone === tone
      const matchesQuery =
        q === "" ||
        r.subject.toLowerCase().includes(q) ||
        r.sender.toLowerCase().includes(q) ||
        r.original.toLowerCase().includes(q) ||
        r.reply.toLowerCase().includes(q)
      return matchesTone && matchesQuery
    })
  }, [records, query, tone])

  function handleDelete(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

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
            placeholder="Search replies, subjects, or senders…"
            className="pl-9"
            aria-label="Search replies"
          />
        </div>
        <Select value={tone} onValueChange={setTone}>
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
              <ReplyCard key={record.id} record={record} onDelete={handleDelete} />
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
