"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, TrendingUp, Star, Filter, Search, Plus } from "lucide-react"

// Mock data for forums
const forumCategories = [
  {
    id: 1,
    name: "Investment Strategies",
    description: "Discuss various real estate investment approaches and strategies",
    topics: 156,
    posts: 2345,
    icon: TrendingUp,
    featured: true,
  },
  {
    id: 2,
    name: "Market Analysis",
    description: "Share insights and analysis about different real estate markets",
    topics: 98,
    posts: 1432,
    icon: TrendingUp,
  },
  {
    id: 3,
    name: "Beginner Questions",
    description: "A safe space for newcomers to ask questions about real estate investing",
    topics: 210,
    posts: 3567,
    icon: MessageSquare,
  },
  {
    id: 4,
    name: "Property Management",
    description: "Tips and discussions about managing rental properties effectively",
    topics: 124,
    posts: 1876,
    icon: Users,
  },
  {
    id: 5,
    name: "Veteran Investors",
    description: "For experienced investors to discuss advanced topics and strategies",
    topics: 87,
    posts: 1245,
    icon: Star,
  },
]

// Mock data for recent topics
const recentTopics = [
  {
    id: 1,
    title: "How to analyze cash flow for multi-family properties?",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Investment Strategies",
    replies: 24,
    views: 342,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    title: "VA Loan experiences in the current market",
    author: {
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Veteran Investors",
    replies: 18,
    views: 256,
    lastActivity: "5 hours ago",
  },
  {
    id: 3,
    title: "Best markets for rental properties in 2023",
    author: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Market Analysis",
    replies: 32,
    views: 478,
    lastActivity: "1 day ago",
  },
  {
    id: 4,
    title: "How to screen tenants effectively?",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Property Management",
    replies: 15,
    views: 210,
    lastActivity: "2 days ago",
  },
]

export function ForumsList() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search forums and topics..."
            className="pl-10 bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-primary/20 text-primary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Topic
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-primary">Forum Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forumCategories.map((category) => (
            <Card
              key={category.id}
              className={`bg-card/50 backdrop-blur hover:shadow-glow-sm transition-all cursor-pointer ${
                category.featured ? "border-primary/30" : "border-border"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  {category.featured && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <span>{category.topics} topics</span>
                  <span>{category.posts} posts</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-primary">Recent Topics</h2>
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentTopics.map((topic) => (
                <div key={topic.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                      <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <h3 className="font-medium hover:text-primary cursor-pointer">{topic.title}</h3>
                        <Badge variant="outline" className="w-fit text-xs">
                          {topic.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>By {topic.author.name}</span>
                        <span>{topic.replies} replies</span>
                        <span>{topic.views} views</span>
                        <span>Last activity: {topic.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border px-6 py-4">
            <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
              View All Topics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
