import Link from "next/link"
import { History, Sparkles } from "lucide-react"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">EmailReplier AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Show when="signed-in">
            <Link href="/compose" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Compose
            </Link>
            <Link href="/history" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              History
            </Link>
          </Show>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Start Free</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/history"
              aria-label="Reply history"
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "gap-1.5")}
            >
              <History className="size-4" />
              <span className="hidden sm:inline">History</span>
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  )
}