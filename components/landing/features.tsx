import { History, SlidersHorizontal, Send } from "lucide-react"

const features = [
  {
    icon: SlidersHorizontal,
    title: "Multi-tone AI",
    description:
      "Generate replies in Professional, Friendly, Brief, Apologetic, or Enthusiastic tones. Match every conversation perfectly.",
  },
  {
    icon: History,
    title: "Reply history",
    description:
      "Every draft is saved and searchable. Revisit past replies, reuse your best answers, and never lose your work.",
  },
  {
    icon: Send,
    title: "One-click send",
    description:
      "Copy to clipboard or send directly to your inbox. Go from received to replied without ever leaving the app.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to reply faster
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Built for people who live in their inbox and want their time back.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
