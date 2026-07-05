import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For occasional email replies.",
    features: ["10 AI replies per day", "3 reply tones", "Copy to clipboard", "7-day reply history"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For professionals who live in their inbox.",
    features: [
      "Unlimited AI replies",
      "All 5 reply tones",
      "One-click send",
      "Unlimited reply history",
      "Priority AI models",
      "Email support",
    ],
    cta: "Start Free",
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-8",
                tier.highlighted ? "border-primary shadow-lg shadow-primary/10" : "border-border",
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={tier.highlighted ? "default" : "outline"}
                className={cn("mt-8 w-full", !tier.highlighted && "bg-transparent")}
              >
                <a href="#top">{tier.cta}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
