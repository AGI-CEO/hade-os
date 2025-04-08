"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Sparkles, Paperclip, Trash2, Bot, User, Lightbulb, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your real estate investment AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Improved scroll behavior to keep messages in view
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end", // Ensures we see the latest messages but keep context
        })
      }, 100)
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        "cash flow":
          "Cash flow is the net income generated from a rental property after all expenses have been paid. It's calculated by subtracting all operating expenses, mortgage payments, and vacancy losses from the total rental income. Positive cash flow means you're making money beyond your expenses, while negative cash flow means you're losing money each month.",
        "cap rate":
          "The capitalization rate (cap rate) is a real estate valuation measure used to compare different real estate investments. It's calculated by dividing a property's net operating income (NOI) by its current market value or acquisition cost. For example, if a property has an NOI of $10,000 and is valued at $200,000, the cap rate would be 5%.",
        "1031 exchange":
          "A 1031 exchange (also called a like-kind exchange) is a tax-deferred transaction that allows real estate investors to sell a property and reinvest the proceeds in a new property while deferring capital gains taxes. To qualify, the replacement property must be identified within 45 days and the exchange must be completed within 180 days.",
        "brrrr method":
          "The BRRRR method stands for Buy, Rehab, Rent, Refinance, Repeat. It's a real estate investment strategy where you buy an undervalued property, renovate it, rent it out to generate income, refinance to recover your capital, and then repeat the process with another property. This strategy allows investors to grow their portfolio without continuously injecting new capital.",
      }

      let aiResponse = "I don't have specific information about that topic. Would you like me to research it for you?"

      // Check if the user's question contains any keywords
      const lowercaseInput = input.toLowerCase()
      for (const [keyword, response] of Object.entries(aiResponses)) {
        if (lowercaseInput.includes(keyword)) {
          aiResponse = response
          break
        }
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your real estate investment AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  const suggestedPrompts = [
    "What is a good cap rate for rental properties?",
    "Explain the BRRRR method",
    "How do I calculate cash flow?",
    "What are the benefits of a 1031 exchange?",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="bg-card border-border h-[600px] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary-foreground">HADE AI Assistant</CardTitle>
                  <CardDescription>Your real estate investment guide</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={clearChat}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" ? "bg-primary/10 ml-2" : "bg-primary/10 mr-2"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-black"
                          : "bg-card/50 border border-border text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] flex-row">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <CardFooter className="p-4 border-t border-border flex-shrink-0">
            <div className="flex w-full items-center space-x-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                ref={inputRef}
                placeholder="Ask me anything about real estate investing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-card border-border min-h-10 h-10 resize-none"
              />
              <Button size="icon" onClick={handleSend} disabled={input.trim() === ""}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Suggested Prompts
            </CardTitle>
            <CardDescription>Try asking these questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => {
                    setInput(prompt)
                    inputRef.current?.focus()
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{prompt}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              AI Capabilities
            </CardTitle>
            <CardDescription>What this AI assistant can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Answer questions about real estate investing strategies and concepts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Analyze property data and provide investment insights
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Help with financial calculations and investment analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Provide market insights and trends for your target areas
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
