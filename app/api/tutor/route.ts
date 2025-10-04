import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are an expert guitar tutor with years of teaching experience. You provide clear, encouraging guidance on guitar techniques, chord progressions, music theory, and practice strategies. Always be supportive and break down complex concepts into simple steps.`,
    messages,
  })

  return result.toDataStreamResponse()
}
