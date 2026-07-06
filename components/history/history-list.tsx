import { listReplies } from "@/lib/reply-history"
import { ReplyHistory } from "./reply-history"

export async function HistoryList() {
  const records = await listReplies()
  return <ReplyHistory records={records} />
}