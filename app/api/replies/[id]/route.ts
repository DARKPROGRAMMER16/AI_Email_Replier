import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { deleteReply } from "@/lib/reply-history"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const ok = await deleteReply(id)
  if (!ok) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
  revalidatePath("/history")
  return NextResponse.json({ ok: true })
}