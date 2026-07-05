import { SignIn } from "@clerk/nextjs"

export const metadata = {
  title: "Sign in — EmailReplier AI",
  description: "Sign in to your EmailReplier AI account.",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <SignIn />
    </div>
  )
}