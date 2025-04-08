"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Square, Volume2, VolumeX, Sparkles, Lightbulb, Zap, Bot, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

type Transcript = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<Transcript[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your voice assistant. You can ask me questions about real estate investing by clicking the microphone button.",
      timestamp: new Date(),
    },
  ])
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [transcript])

  useEffect(() => {
    return () => {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)

    // Simulate audio level changes
    audioLevelInterval.current = setInterval(() => {
      setAudioLevel(Math.random() * 100)
    }, 100)

    // Simulate user speaking after 3 seconds
    setTimeout(() => {
      const userMessage: Transcript = {
        id: Date.now().toString(),
        role: "user",
        content: "What's the average cap rate for residential properties in Austin?",
        timestamp: new Date(),
      }
      setTranscript((prev) => [...prev, userMessage])
      stopListening()

      // Simulate AI response after 1 second
      setTimeout(() => {
        setIsSpeaking(true)

        const assistantMessage: Transcript = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "In Austin, the average cap rate for residential properties typically ranges from 4% to 6%, depending on the neighborhood and property type. Class A properties in prime locations might see cap rates as low as 3.5%, while properties in emerging areas could offer cap rates up to 7%. Keep in mind that cap rates are inversely related to property values, so lower cap rates often indicate higher property values and potentially lower risk.",
          timestamp: new Date(),
        }
        setTranscript((prev) => [...prev, assistantMessage])

        // Simulate end of AI speaking after 5 seconds
        setTimeout(() => {
          setIsSpeaking(false)
        }, 5000)
      }, 1000)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current)
      setAudioLevel(0)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const exampleCommands = [
    "What's a good cash on cash return?",
    "Calculate mortgage payment for $300,000 at 5% interest",
    "What are the best neighborhoods in Houston for investment?",
    "Explain the 1% rule in real estate",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="bg-card border-border h-[600px] flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Volume2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-primary-foreground">Voice Assistant</CardTitle>
                <CardDescription>Ask questions using your voice</CardDescription>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {transcript.map((entry) => (
                <div key={entry.id} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[80%] ${entry.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.role === "user" ? "bg-primary/10 ml-2" : "bg-primary/10 mr-2"
                      }`}
                    >
                      {entry.role === "user" ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        entry.role === "user"
                          ? "bg-primary text-black"
                          : "bg-card/50 border border-border text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{entry.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {entry.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </ScrollArea>

          <CardFooter className="p-4 border-t border-border">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-32">
                    <Progress value={isMuted ? 0 : volume} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isSpeaking && (
                    <Button variant="outline" size="sm" onClick={() => setIsSpeaking(false)}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}

                  <div className="relative">
                    <Button
                      size="icon"
                      className={`h-12 w-12 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
                      onClick={toggleListening}
                    >
                      {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </Button>

                    {isListening && (
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        className="absolute -inset-3 rounded-full border-2 border-red-500 opacity-50"
                      ></motion.div>
                    )}
                  </div>
                </div>
              </div>

              {isListening && (
                <div className="w-full">
                  <div className="text-center text-sm text-muted-foreground mb-2">Listening...</div>
                  <div className="h-8 flex items-center justify-center space-x-1">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = Math.max(4, Math.min(32, audioLevel * Math.random() * 0.8))
                      return (
                        <motion.div
                          key={i}
                          initial={{ height: 4 }}
                          animate={{ height }}
                          transition={{ duration: 0.1 }}
                          className="w-1 bg-primary rounded-full"
                        ></motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Voice Commands
            </CardTitle>
            <CardDescription>Try these example commands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exampleCommands.map((command, index) => (
                <div key={index} className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center">
                    <Mic className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm text-primary-foreground">{command}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Voice Assistant Tips
            </CardTitle>
            <CardDescription>Get the most out of voice interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Speak clearly and at a moderate pace for best recognition
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Use specific terms and numbers when asking about properties
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    You can ask for calculations, market data, and investment advice
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Say "stop" or click the stop button to interrupt the assistant
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
