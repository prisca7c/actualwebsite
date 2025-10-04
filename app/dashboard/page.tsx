import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Clock, Target } from "lucide-react"

export default async function DashboardPage() {
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
    .limit(5)

  const { data: stats } = await supabase
    .from("practice_sessions")
    .select("duration_seconds, accuracy_score")
    .eq("user_id", user.id)

  const totalSessions = stats?.length || 0
  const totalMinutes = Math.round((stats?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0) / 60)
  const avgAccuracy = stats?.length
    ? Math.round(stats.reduce((sum, s) => sum + (Number(s.accuracy_score) || 0), 0) / stats.length)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 font-serif text-3xl font-bold">Dashboard</h1>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{totalSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{totalMinutes} min</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{avgAccuracy}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Practice Sessions</CardTitle>
            <CardDescription>Your latest practice activity</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{session.lessons?.title || "Unknown Lesson"}</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{Math.round((session.duration_seconds || 0) / 60)} min</Badge>
                      <Badge>{Math.round(Number(session.accuracy_score) || 0)}% accuracy</Badge>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/history">View All History</Link>
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No practice sessions yet</p>
                <Button asChild className="mt-4">
                  <Link href="/practice">Start Practicing</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
