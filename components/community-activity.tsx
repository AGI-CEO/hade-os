"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart, Share2, Award, Building, BookOpen } from "lucide-react"

// Mock data for community activity
const activities = [
  {
    id: 1,
    type: "forum",
    user: {
      name: "Alex Johnson",
      avatar: "/images/avatars/avatar-7.jpg",
      badge: "Veteran",
    },
    content: "Started a new discussion: 'Best markets for multi-family properties in 2023'",
    time: "2 hours ago",
    interactions: {
      comments: 12,
      likes: 34,
    },
    link: "#",
  },
  {
    id: 2,
    type: "portfolio",
    user: {
      name: "Maria Rodriguez",
      avatar: "/images/avatars/avatar-2.jpg",
    },
    content: "Shared their portfolio: 'My journey from 0 to 5 properties in 3 years'",
    time: "4 hours ago",
    interactions: {
      comments: 8,
      likes: 42,
      shares: 5,
    },
    link: "#",
  },
  {
    id: 3,
    type: "achievement",
    user: {
      name: "David Chen",
      avatar: "/images/avatars/avatar-6.jpg",
    },
    content: "Earned the 'Cash Flow Master' badge for optimizing rental income",
    time: "Yesterday",
    interactions: {
      likes: 28,
    },
    link: "#",
  },
  {
    id: 4,
    type: "event",
    user: {
      name: "Sarah Williams",
      avatar: "/images/avatars/avatar-4.jpg",
      badge: "Mentor",
    },
    content: "Is hosting a virtual meetup: 'VA Loan Strategies for First-Time Investors'",
    time: "Tomorrow, 7:00 PM",
    interactions: {
      comments: 3,
      likes: 15,
    },
    link: "#",
  },
  {
    id: 5,
    type: "resource",
    user: {
      name: "James Wilson",
      avatar: "/images/avatars/avatar-5.jpg",
    },
    content: "Shared a resource: 'Ultimate Guide to Property Tax Deductions'",
    time: "2 days ago",
    interactions: {
      comments: 7,
      likes: 31,
      shares: 12,
    },
    link: "#",
  },
]

// Helper function to get icon based on activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case "forum":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "portfolio":
      return <Building className="h-4 w-4 text-green-500" />
    case "achievement":
      return <Award className="h-4 w-4 text-yellow-500" />
    case "event":
      return <MessageSquare className="h-4 w-4 text-purple-500" />
    case "resource":
      return <BookOpen className="h-4 w-4 text-orange-500" />
    default:
      return <MessageSquare className="h-4 w-4 text-primary" />
  }
}

export function CommunityActivity() {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
          <Avatar className="h-10 w-10 border border-primary/20 overflow-hidden">
            <AvatarImage
              src={activity.user.avatar}
              alt={activity.user.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=40&width=40"
              }}
            />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{activity.user.name}</span>
              {activity.user.badge && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {activity.user.badge}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                {getActivityIcon(activity.type)}
                <span className="capitalize">{activity.type}</span>
              </Badge>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>

            <p className="text-sm">{activity.content}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {activity.interactions.likes && (
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.interactions.likes}</span>
                  </Button>
                )}
                {activity.interactions.comments && (
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.interactions.comments}</span>
                  </Button>
                )}
                {activity.interactions.shares && (
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.interactions.shares}</span>
                  </Button>
                )}
              </div>
              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
