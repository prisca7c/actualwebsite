import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Nav } from "@/components/nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select("*, lessons(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const groupedSessions = sessions?.reduce(
    (acc, session) => {
      const date = new Date(session.created_at).toLocaleDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(session)
      return acc
    },
    {} as Record<string, typeof sessions>,
  )

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-serif text-3xl font-bold">Practice History</h1>
        </div>

        {groupedSessions && Object.keys(groupedSessions).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date}>
                <h2 className="mb-4 font-semibold text-lg text-muted-foreground">{date}</h2>
                <div className="space-y-4">
                  {dateSessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{session.lessons?.title || "Unknown Lesson"}</h3>
                            <div className="flex gap-2">
                              <Badge variant="outline">{session.lessons?.difficulty || "N/A"}</Badge>
                              <Badge variant="secondary">{Math.round((session.duration_seconds || 0) / 60)} min</Badge>
                              <Badge>{Math.round(Number(session.accuracy_score) || 0)}% accuracy</Badge>
                            </div>
                            {session.chords_attempted && (
                              <p className="text-muted-foreground text-sm">
                                Chords: {(session.chords_attempted as string[]).join(", ")}
                              </p>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {new Date(session.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">No practice history yet</p>
              <Button asChild>
                <Link href="/practice">Start Your First Session</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
