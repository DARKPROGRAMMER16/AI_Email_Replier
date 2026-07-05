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
    // Skip Next internals, static files, API routes, and Clerk auth routes
    '/((?!_next|.*\\..*|sign-in|sign-up|api).*)',
  ],
}