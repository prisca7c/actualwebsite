import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Nav } from "@/components/nav"
import { PracticeSession } from "@/components/practice-session"

export default async function PracticePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: lessons } = await supabase.from("lessons").select("*").order("difficulty")

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <PracticeSession lessons={lessons || []} userId={user.id} />
    </div>
  )
}
