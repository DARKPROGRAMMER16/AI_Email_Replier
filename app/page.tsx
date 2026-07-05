import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Pricing } from "@/components/landing/pricing"
import { SiteFooter } from "@/components/landing/site-footer"

export default function Page() {
  return (
    <div id="top" className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <SiteFooter />
    </div>
  )
}
