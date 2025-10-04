"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Play, Pause, SkipForward, Camera, CameraOff } from "lucide-react"
import { toast } from "sonner"

type Lesson = {
  id: string
  title: string
  difficulty: string
  chord_sequence: string[]
}

export function PracticeSession({ lessons, userId }: { lessons: Lesson[]; userId: string }) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null)
  const [currentChordIndex, setCurrentChordIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [accuracy, setAccuracy] = useState(0)
  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const currentChord = selectedLesson?.chord_sequence[currentChordIndex]

  useEffect(() => {
    if (cameraActive) {
      startCamera()
      connectWebSocket()
    } else {
      stopCamera()
      disconnectWebSocket()
    }
    return () => {
      stopCamera()
      disconnectWebSocket()
    }
  }, [cameraActive])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      toast.error("Failed to access camera")
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const connectWebSocket = () => {
    try {
      wsRef.current = new WebSocket("ws://localhost:8000/ws")
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.detected_chord) {
          checkChord(data.detected_chord)
        }
      }
    } catch (err) {
      console.log("[v0] WebSocket connection failed - Python backend may not be running")
    }
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const checkChord = (detectedChord: string) => {
    if (detectedChord === currentChord) {
      setAccuracy((prev) => Math.min(100, prev + 10))
      toast.success(`Correct! ${detectedChord} chord detected`)
      nextChord()
    }
  }

  const togglePlay = () => {
    if (!isPlaying) {
      setSessionStart(new Date())
    }
    setIsPlaying(!isPlaying)
  }

  const nextChord = () => {
    if (selectedLesson && currentChordIndex < selectedLesson.chord_sequence.length - 1) {
      setCurrentChordIndex((prev) => prev + 1)
    } else {
      endSession()
    }
  }

  const endSession = async () => {
    if (!sessionStart || !selectedLesson) return

    const duration = Math.floor((Date.now() - sessionStart.getTime()) / 1000)

    try {
      const response = await fetch("/api/practice/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lesson_id: selectedLesson.id,
          duration_seconds: duration,
          accuracy_score: accuracy,
          chords_attempted: selectedLesson.chord_sequence,
        }),
      })

      if (response.ok) {
        toast.success("Session saved!")
      }
    } catch (err) {
      toast.error("Failed to save session")
    }

    setIsPlaying(false)
    setCurrentChordIndex(0)
    setAccuracy(0)
    setSessionStart(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Practice Session</h1>
        <Select
          value={selectedLesson?.id}
          onValueChange={(id) => {
            const lesson = lessons.find((l) => l.id === id)
            setSelectedLesson(lesson || null)
            setCurrentChordIndex(0)
            setAccuracy(0)
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a lesson" />
          </SelectTrigger>
          <SelectContent>
            {lessons.map((lesson) => (
              <SelectItem key={lesson.id} value={lesson.id}>
                {lesson.title} ({lesson.difficulty})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Camera Feed
              <Button variant="outline" size="sm" onClick={() => setCameraActive(!cameraActive)}>
                {cameraActive ? <CameraOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                {cameraActive ? "Stop" : "Start"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Camera inactive</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Practice Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Chord</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4 font-serif text-6xl font-bold text-primary">{currentChord || "Select a lesson"}</div>
              {selectedLesson && (
                <Badge variant="outline">
                  Chord {currentChordIndex + 1} of {selectedLesson.chord_sequence.length}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accuracy</span>
                <span className="font-medium">{accuracy}%</span>
              </div>
              <Progress value={accuracy} />
            </div>

            <div className="flex gap-2">
              <Button onClick={togglePlay} className="flex-1" disabled={!selectedLesson || !cameraActive}>
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? "Pause" : "Start"}
              </Button>
              <Button onClick={nextChord} variant="outline" disabled={!isPlaying}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {!cameraActive && (
              <p className="text-center text-muted-foreground text-sm">Enable camera to start practicing</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
