export type Tone = "Professional" | "Friendly" | "Brief" | "Apologetic" | "Enthusiastic"

export const TONES: Tone[] = ["Professional", "Friendly", "Brief", "Apologetic", "Enthusiastic"]

function firstName(email: string): string {
  const match = email.match(/(?:hi|hello|hey|dear)\s+([a-z]+)/i)
  if (match) return match[1].replace(/^\w/, (c) => c.toUpperCase())
  return "there"
}

function subjectHint(email: string): string {
  const clean = email.replace(/\s+/g, " ").trim()
  const sentence = clean.split(/[.!?]/)[0] ?? ""
  return sentence.length > 90 ? sentence.slice(0, 90).trim() + "…" : sentence
}

/**
 * Produces a drafted reply locally so the interface is fully functional
 * without an external API. Swap this out for a real model call later.
 */
export function generateReply(email: string, tone: Tone): string {
  const name = firstName(email)
  const hint = subjectHint(email)
  const ref = hint ? ` regarding "${hint}"` : ""

  switch (tone) {
    case "Professional":
      return `Hi ${name},

Thank you for your message${ref}. I appreciate you taking the time to reach out and share the details.

I've reviewed everything you outlined and will follow up with the next steps shortly. Please let me know if there is anything else you'd like me to prioritize in the meantime.

Best regards`
    case "Friendly":
      return `Hey ${name}!

Thanks so much for reaching out${ref} — really glad you did. I read through everything and it all makes sense.

I'll get the ball rolling on my end and circle back to you soon. In the meantime, don't hesitate to shoot me a note if anything else comes up!

Talk soon`
    case "Brief":
      return `Hi ${name},

Got it, thanks for the note${ref}. I'll take care of it and follow up shortly.

Best`
    case "Apologetic":
      return `Hi ${name},

Thank you for your patience, and I'm sorry for any inconvenience this may have caused${ref}. That wasn't the experience we wanted for you.

I'm looking into this right away and will make sure it's resolved. I'll keep you posted every step of the way — please let me know if there's anything I can do sooner.

Sincerely`
    case "Enthusiastic":
      return `Hi ${name}!

This is fantastic — thank you so much for reaching out${ref}! I'm genuinely excited about this and can't wait to dig in.

I'll get started right away and keep you in the loop on our progress. Really looking forward to making this happen together!

Cheers`
    default:
      return ""
  }
}
