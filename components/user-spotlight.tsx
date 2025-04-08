"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Building, TrendingUp, Users } from "lucide-react"

// Mock data for featured users
const featuredUsers = [
  {
    id: 1,
    name: "Robert Anderson",
    avatar: "/images/avatars/avatar-7.jpg",
    badge: "Top Mentor",
    role: "Commercial Real Estate Expert",
    stats: {
      properties: 25,
      mentees: 34,
      contributions: 87,
    },
    achievements: ["Deal Analyzer", "Community Leader", "Knowledge Sharer"],
  },
  {
    id: 2,
    name: "Jennifer Lee",
    avatar: "/images/avatars/avatar-3.jpg",
    badge: "Rising Star",
    role: "Residential Rental Specialist",
    stats: {
      properties: 12,
      mentees: 0,
      contributions: 42,
    },
    achievements: ["Portfolio Builder", "Cash Flow Master"],
  },
  {
    id: 3,
    name: "Marcus Johnson",
    avatar: "/images/avatars/avatar-6.jpg",
    badge: "Veteran",
    role: "VA Loan Expert",
    stats: {
      properties: 18,
      mentees: 22,
      contributions: 65,
    },
    achievements: ["VA Loan Specialist", "Mentor of the Month"],
  },
]

export function UserSpotlight() {
  return (
    <div className="space-y-6">
      {featuredUsers.map((user) => (
        <Card
          key={user.id}
          className="bg-background/50 backdrop-blur border-primary/20 hover:shadow-glow-sm transition-all"
        >
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20 overflow-hidden">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=80&width=80"
                  }}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {user.badge}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{user.role}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center p-2 bg-background/80 rounded-lg">
                <Building className="h-3 w-3 text-primary mb-1" />
                <span className="font-medium">{user.stats.properties}</span>
                <span className="text-xs text-muted-foreground">Properties</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-background/80 rounded-lg">
                <Users className="h-3 w-3 text-primary mb-1" />
                <span className="font-medium">{user.stats.mentees}</span>
                <span className="text-xs text-muted-foreground">Mentees</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-background/80 rounded-lg">
                <TrendingUp className="h-3 w-3 text-primary mb-1" />
                <span className="font-medium">{user.stats.contributions}</span>
                <span className="text-xs text-muted-foreground">Contributions</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {user.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary/30 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {achievement}
                </Badge>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary/10">
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
