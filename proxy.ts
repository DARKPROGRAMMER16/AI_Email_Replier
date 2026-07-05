import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/compose(.*)',
  '/history(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next internals and static files (but NOT api routes — Clerk needs to
    // run on /api/* so that auth() works inside route handlers).
    '/((?!_next|.*\\..*|sign-in|sign-up).*)',
    '/(api|trpc)(.*)',
  ],
}