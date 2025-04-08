"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Users, ArrowUp, ArrowDown, Minus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 8,
    points: 3250,
    badges: 12,
    rank: 1,
    change: "up",
    properties: 6,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 7,
    points: 2980,
    badges: 10,
    rank: 2,
    change: "up",
    properties: 5,
  },
  {
    id: 3,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 5,
    points: 1250,
    badges: 8,
    rank: 3,
    change: "down",
    properties: 3,
    isCurrentUser: true,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 6,
    points: 1890,
    badges: 9,
    rank: 4,
    change: "same",
    properties: 4,
  },
  {
    id: 5,
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 5,
    points: 1100,
    badges: 7,
    rank: 5,
    change: "up",
    properties: 2,
  },
  {
    id: 6,
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 4,
    points: 980,
    badges: 6,
    rank: 6,
    change: "down",
    properties: 2,
  },
  {
    id: 7,
    name: "Robert Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 4,
    points: 920,
    badges: 5,
    rank: 7,
    change: "same",
    properties: 2,
  },
  {
    id: 8,
    name: "Jessica Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 3,
    points: 750,
    badges: 4,
    rank: 8,
    change: "up",
    properties: 1,
  },
]

// Sample top achievers data
const topAchievers = [
  {
    id: 101,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    achievement: "Most Properties",
    value: "6 properties",
  },
  {
    id: 102,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    achievement: "Highest ROI",
    value: "12.5% annual",
  },
  {
    id: 103,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    achievement: "Most Badges",
    value: "9 badges",
  },
]

export function QuestLeaderboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly" | "allTime">("monthly")

  const filteredLeaderboard = leaderboardData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeFrame === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeFrame === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={timeFrame === "allTime" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("allTime")}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <h2 className="text-2xl font-bold text-primary-foreground">#3</h2>
              <p className="text-xs text-muted-foreground">Top 15%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Medal className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Points</p>
              <h2 className="text-2xl font-bold text-primary-foreground">1,250</h2>
              <p className="text-xs text-green-500">+150 this month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <h2 className="text-2xl font-bold text-primary-foreground">128</h2>
              <p className="text-xs text-green-500">+12 this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary-foreground flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-amber-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground px-4">
              <span className="w-12 text-center">Rank</span>
              <span className="flex-1">User</span>
              <span className="w-20 text-center">Level</span>
              <span className="w-24 text-center">Points</span>
              <span className="w-24 text-center">Badges</span>
            </div>

            <div className="space-y-2">
              {filteredLeaderboard.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center p-4 rounded-lg ${
                    user.isCurrentUser ? "border-2 border-primary bg-primary/5" : "border border-border bg-card/50"
                  }`}
                >
                  <div className="w-12 flex justify-center">
                    <div className="flex items-center">
                      <span
                        className={`font-bold ${
                          user.rank === 1
                            ? "text-amber-500"
                            : user.rank === 2
                              ? "text-gray-300"
                              : user.rank === 3
                                ? "text-amber-700"
                                : "text-muted-foreground"
                        }`}
                      >
                        #{user.rank}
                      </span>
                      <span className="ml-1">{getChangeIcon(user.change)}</span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-primary-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.properties} properties</p>
                    </div>
                    {user.isCurrentUser && <Badge className="ml-2 bg-primary">You</Badge>}
                  </div>

                  <div className="w-20 text-center">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Level {user.level}
                    </Badge>
                  </div>

                  <div className="w-24 text-center font-medium text-primary-foreground">
                    {user.points.toLocaleString()}
                  </div>

                  <div className="w-24 text-center">
                    <div className="flex items-center justify-center">
                      <Medal className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-primary-foreground">{user.badges}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary-foreground flex items-center">
            <Medal className="mr-2 h-5 w-5 text-primary" />
            Top Achievers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topAchievers.map((achiever) => (
              <div key={achiever.id} className="p-4 rounded-lg border border-border bg-card/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={achiever.avatar || "/placeholder.svg"}
                    alt={achiever.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">{achiever.name}</h4>
                  <p className="text-xs text-muted-foreground">{achiever.achievement}</p>
                  <p className="text-xs text-primary">{achiever.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
