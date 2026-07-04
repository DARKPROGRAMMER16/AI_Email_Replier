import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/landing/site-header"
import { ReplyHistory } from "@/components/history/reply-history"

export const metadata = {
  title: "Reply history — EmailReplier AI",
  description: "Browse, search, and reuse your past AI-generated email replies.",
}

export default function HistoryPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <Link
            href="/compose"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to composer
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Reply history</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Every reply you generate is saved here. Search, filter by tone, and copy in one click.
          </p>
        </div>
        <ReplyHistory />
      </main>
    </div>
  )
}
