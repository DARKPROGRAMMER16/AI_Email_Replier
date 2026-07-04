import Link from "next/link"
import { Sparkles } from "lucide-react"

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", href: "/compose" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">EmailReplier AI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Reply to emails 10x faster with AI that matches your tone.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h4 className="text-sm font-semibold text-foreground">{column.heading}</h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EmailReplier AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made for people who hate writing emails.</p>
        </div>
      </div>
    </footer>
  )
}
