import { SignUp } from "@clerk/nextjs"

export const metadata = {
  title: "Sign up — EmailReplier AI",
  description: "Create your EmailReplier AI account.",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <SignUp />
    </div>
  )
}