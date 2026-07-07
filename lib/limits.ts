/**
 * Centralized limits used across composer UI and API routes.
 * Keeping these in one place lets us tune rate limits / caps without
 * hunting through component and route files.
 */

/** Max characters accepted for the incoming email body. Used by both the
 *  composer UI (for the char counter) and the /api/generate route (hard cap). */
export const MAX_EMAIL_CHARS = 5000

/** Max characters for the optional subject field. */
export const MAX_SUBJECT_CHARS = 200

/** Max tokens Gemini can emit per generation. Keeps replies short and
 *  avoids burning the free-tier TPM quota. */
export const MAX_OUTPUT_TOKENS = 500

/** Sampling temperature for Gemini text generation. */
export const GENERATION_TEMPERATURE = 0.7

/** Display duration (ms) for transient "Saved" / "Sent" / "Copied" checkmark
 *  states on the composer action buttons. */
export const TRANSIENT_FEEDBACK_MS = 2000