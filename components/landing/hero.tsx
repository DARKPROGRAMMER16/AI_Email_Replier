import Link from "next/link"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle background pattern + glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] [background-size:22px_22px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_18%,transparent),transparent)]"
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 lg:pt-28">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Zap className="size-3.5 text-primary" />
          Write replies in 5 seconds
        </div>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Reply to emails 10x faster
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          EmailReplier AI reads any message and drafts a polished, on-tone reply in seconds. Paste, pick a tone, and
          send — no more staring at a blank inbox.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full gap-1.5 sm:w-auto">
            <Link href="/compose">
              Start Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          {/* <Button asChild size="lg" variant="outline" className="w-full gap-1.5 sm:w-auto bg-transparent">
            <a href="#features">
              <Sparkles className="size-4" />
              Try the demo
            </a>
          </Button> */}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free forever plan</p>

        {/* preview mock */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-xl border border-border bg-card p-2 shadow-2xl shadow-primary/5">
            <div className="rounded-lg border border-border/60 bg-background">
              <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="grid gap-4 p-6 text-left sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Incoming email</p>
                  <div className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3">
                    <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
                    <div className="h-2 w-full rounded bg-muted-foreground/20" />
                    <div className="h-2 w-5/6 rounded bg-muted-foreground/20" />
                    <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-primary">AI reply · Professional</p>
                  <div className="space-y-2 rounded-md border border-primary/30 bg-primary/5 p-3">
                    <div className="h-2 w-2/3 rounded bg-primary/30" />
                    <div className="h-2 w-full rounded bg-primary/25" />
                    <div className="h-2 w-full rounded bg-primary/25" />
                    <div className="h-2 w-1/2 rounded bg-primary/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
