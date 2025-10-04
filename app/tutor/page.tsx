import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Nav } from "@/components/nav"
import { TutorChat } from "@/components/tutor-chat"

export default async function TutorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <TutorChat />
    </div>
  )
}
