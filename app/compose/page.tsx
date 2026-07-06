import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft, Sparkles, History, Loader2 } from "lucide-react"
import { Show, UserButton } from "@clerk/nextjs"
import { EmailReplyComposer } from "@/components/email-reply-composer"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ComposePage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight text-foreground">EmailReplier AI</span>
              <span className="mt-1 text-xs text-muted-foreground">Email reply assistant</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Show when="signed-in">
              <Link
                href="/history"
                aria-label="Reply history"
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "gap-1.5")}
              >
                <History className="size-4" />
                <span className="hidden sm:inline">History</span>
              </Link>
            </Show>
            <ThemeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </header>

        <div className="mb-8 max-w-2xl">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Reply to any email in seconds
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Paste the message you received, pick a tone, and generate a polished, ready-to-send reply.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          }
        >
          <EmailReplyComposer />
        </Suspense>
      </div>
    </main>
  )
}
