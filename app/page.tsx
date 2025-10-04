import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Brain, Target, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="container relative mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Master Guitar with
            <br />
            <span className="text-primary">AI-Powered Guidance</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Real-time hand tracking, intelligent chord detection, and personalized feedback to accelerate your guitar
            learning journey.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/sign-up">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold">Why Choose AI Guitar Tutor</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <Brain className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold text-xl">AI-Powered</h3>
              <p className="text-muted-foreground text-sm">
                Get instant feedback from our intelligent tutor that adapts to your skill level
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Target className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold text-xl">Hand Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Real-time finger position detection ensures you're playing chords correctly
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Music className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold text-xl">Chord Detection</h3>
              <p className="text-muted-foreground text-sm">
                Advanced audio analysis identifies the chords you're playing in real-time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold text-xl">Track Progress</h3>
              <p className="text-muted-foreground text-sm">
                Monitor your improvement with detailed statistics and practice history
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold">How It Works</h2>
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-xl">Choose Your Lesson</h3>
                <p className="text-muted-foreground">
                  Select from beginner to advanced lessons tailored to your skill level
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-xl">Practice with AI Feedback</h3>
                <p className="text-muted-foreground">
                  Our AI tracks your hand positions and listens to your playing in real-time
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-xl">Track Your Progress</h3>
                <p className="text-muted-foreground">View detailed analytics and watch your skills improve over time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 font-serif text-4xl font-bold">Ready to Start Your Journey?</h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          Join thousands of guitarists improving their skills with AI-powered guidance
        </p>
        <Button asChild size="lg" className="text-lg">
          <Link href="/auth/sign-up">Get Started Free</Link>
        </Button>
      </section>
    </div>
  )
}
