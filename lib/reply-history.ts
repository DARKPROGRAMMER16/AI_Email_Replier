import type { Tone } from "./reply-generator"

export type ReplyRecord = {
  id: string
  tone: Tone
  subject: string
  sender: string
  original: string
  reply: string
  createdAt: string // ISO timestamp
}

export const sampleHistory: ReplyRecord[] = [
  {
    id: "r1",
    tone: "Professional",
    subject: "Q3 report status",
    sender: "Sarah Chen",
    original:
      "Hi, I wanted to check in on the status of the Q3 report we discussed last week. Could you send over an update when you get a chance? We need it before the board meeting on Friday.",
    reply:
      "Hi Sarah,\n\nThanks for following up on the Q3 report. I'm putting the finishing touches on the figures now and will have the complete draft to you by end of day Thursday, well ahead of Friday's board meeting.\n\nIf anything urgent comes up before then, feel free to reach out.\n\nBest regards",
    createdAt: "2026-07-05T09:12:00Z",
  },
  {
    id: "r2",
    tone: "Friendly",
    subject: "Coffee next week?",
    sender: "Marcus",
    original:
      "Hey! It's been way too long. Are you free to grab coffee sometime next week? Would love to catch up and hear how the new role is going.",
    reply:
      "Hey Marcus!\n\nIt really has been too long — I'd love that. Next week works great for me; I'm pretty open Tuesday and Thursday afternoons. Want to meet at that place near the park?\n\nCan't wait to catch up and fill you in on everything.\n\nTalk soon!",
    createdAt: "2026-07-04T16:45:00Z",
  },
  {
    id: "r3",
    tone: "Apologetic",
    subject: "Delayed shipment #48213",
    sender: "Customer Support",
    original:
      "I placed an order two weeks ago and it still hasn't arrived. This is really frustrating — I needed it for an event that has now passed. Can you tell me what's going on?",
    reply:
      "Dear Customer,\n\nI'm truly sorry for the delay with order #48213, and I completely understand your frustration — especially with your event now having passed. This isn't the experience we want for you.\n\nI've escalated your shipment and issued a full refund for the delivery cost. Please let me know if there's anything else I can do to make this right.\n\nSincerely",
    createdAt: "2026-07-03T11:20:00Z",
  },
  {
    id: "r4",
    tone: "Brief",
    subject: "Meeting moved to 3pm",
    sender: "Priya",
    original:
      "Quick heads up — I need to move our sync from 2pm to 3pm today. Does that still work for you?",
    reply: "Hi Priya,\n\n3pm works for me. See you then.\n\nThanks",
    createdAt: "2026-07-02T08:05:00Z",
  },
  {
    id: "r5",
    tone: "Enthusiastic",
    subject: "You got the grant!",
    sender: "Foundation Team",
    original:
      "Congratulations! We're thrilled to let you know that your project has been selected for this year's innovation grant. Next steps will follow shortly.",
    reply:
      "Hi there,\n\nThis is incredible news — thank you so much! I'm absolutely thrilled that the project was selected for the innovation grant. It means the world to the whole team and we can't wait to get started.\n\nLooking forward to the next steps. Thank you again for this amazing opportunity!\n\nWarmly",
    createdAt: "2026-06-30T14:30:00Z",
  },
  {
    id: "r6",
    tone: "Professional",
    subject: "Contract renewal terms",
    sender: "Daniel Reyes",
    original:
      "Please find attached our proposed terms for the contract renewal. Let us know if the pricing structure works on your end or if you'd like to discuss adjustments.",
    reply:
      "Hi Daniel,\n\nThank you for sending over the renewal terms. I've reviewed the proposed pricing structure and it looks largely aligned with our expectations. I'd like to discuss two minor adjustments before we finalize.\n\nAre you available for a brief call this week?\n\nBest regards",
    createdAt: "2026-06-28T10:15:00Z",
  },
]
