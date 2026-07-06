import { Search } from "lucide-react"

export function HistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <div className="h-8 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-3" />
        </div>
        <div className="h-8 w-full rounded-lg border border-input bg-muted/40 sm:w-52" />
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <article
            key={i}
            className="rounded-xl border border-border bg-card p-4 sm:p-5"
            aria-hidden="true"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <div className="h-5 w-20 rounded-full bg-muted/60 animate-pulse" />
                <div className="h-4 w-40 rounded bg-muted/60 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="size-8 rounded-md bg-muted/40 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-16 rounded bg-muted/40" />
                <div className="h-2 w-full rounded bg-muted/40 animate-pulse" />
                <div className="h-2 w-5/6 rounded bg-muted/40 animate-pulse" />
                <div className="h-2 w-2/3 rounded bg-muted/40 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 rounded bg-muted/40" />
                <div className="h-2 w-full rounded bg-muted/40 animate-pulse" />
                <div className="h-2 w-4/5 rounded bg-muted/40 animate-pulse" />
                <div className="h-2 w-3/4 rounded bg-muted/40 animate-pulse" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}