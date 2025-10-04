"use client"

import { useChat } from "ai"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Send, Sparkles } from "lucide-react"

const suggestedPrompts = [
  "How do I play a C major chord?",
  "What are some beginner exercises?",
  "Explain chord progressions",
  "Tips for finger positioning",
]

export function TutorChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/tutor",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Guitar Tutor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <Badge
                key={prompt}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleSubmit(new Event("submit") as any, { data: { message: prompt } })}
              >
                {prompt}
              </Badge>
            ))}
          </div>

          <div className="mb-4 h-96 space-y-4 overflow-y-auto rounded-lg border border-border p-4">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <p>Ask me anything about guitar! I'm here to help you learn.</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-100" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about guitar techniques, chords, or practice tips..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
