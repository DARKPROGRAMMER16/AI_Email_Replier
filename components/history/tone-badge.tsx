import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Tone } from "@/lib/tone"

const toneStyles: Record<Tone, string> = {
  Professional: "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  Friendly: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Brief: "border-zinc-500/25 bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
  Apologetic: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Enthusiastic: "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

export function ToneBadge({ tone, className }: { tone: Tone; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", toneStyles[tone], className)}>
      {tone}
    </Badge>
  )
}
