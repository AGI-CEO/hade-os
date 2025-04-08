"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Star, TrendingUp, Users, Zap, Home, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

// Sample badges data
const badges = [
  {
    id: 1,
    name: "First Property",
    description: "Purchased your first property",
    icon: Home,
    color: "text-primary",
    earned: true,
    date: "Jan 15, 2022",
  },
  {
    id: 2,
    name: "Cash Flow King",
    description: "Achieve $2,000 monthly cash flow",
    icon: TrendingUp,
    color: "text-amber-500",
    earned: true,
    date: "Nov 3, 2022",
  },
  {
    id: 3,
    name: "Tenant Master",
    description: "Successfully manage 5 tenants",
    icon: Users,
    color: "text-primary",
    earned: false,
    progress: 60,
  },
  {
    id: 4,
    name: "Portfolio Pro",
    description: "Own 5 properties simultaneously",
    icon: Award,
    color: "text-amber-500",
    earned: false,
    progress: 40,
  },
]

// Sample locked badges
const lockedBadges = [
  {
    id: 5,
    name: "Million Dollar Club",
    description: "Reach $1M in portfolio value",
    icon: Award,
    color: "text-amber-500",
  },
  {
    id: 6,
    name: "Passive Income Pro",
    description: "Achieve $10,000 monthly cash flow",
    icon: TrendingUp,
    color: "text-primary",
  },
]

export function AchievementsBadges() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground glow-text">Achievements</h2>
          <p className="text-muted-foreground">Your real estate milestones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-lg border border-border bg-card/50 relative",
              badge.earned ? "border-amber-500/30" : "",
            )}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                badge.earned ? "bg-amber-500/10" : "bg-primary/10",
              )}
            >
              {badge.icon === Home ? (
                <Home className={cn("h-8 w-8", badge.earned ? badge.color : "text-muted-foreground")} />
              ) : badge.icon === TrendingUp ? (
                <TrendingUp className={cn("h-8 w-8", badge.earned ? badge.color : "text-muted-foreground")} />
              ) : badge.icon === Users ? (
                <Users className={cn("h-8 w-8", badge.earned ? badge.color : "text-muted-foreground")} />
              ) : (
                <Award className={cn("h-8 w-8", badge.earned ? badge.color : "text-muted-foreground")} />
              )}
            </div>
            <h3
              className={cn(
                "text-lg font-medium text-center mb-1",
                badge.earned ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {badge.name}
            </h3>
            <p className="text-xs text-muted-foreground text-center mb-2">{badge.description}</p>
            {badge.earned && (
              <div className="absolute -top-2 -right-2">
                <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
              </div>
            )}
            {!badge.earned && badge.progress && (
              <div className="w-full space-y-1">
                <div className="text-xs text-center text-muted-foreground">{badge.progress}% Complete</div>
                <Progress value={badge.progress} className="h-1.5 w-full [&>div]:bg-primary" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground">Locked Achievements</CardTitle>
          <CardDescription>Complete more milestones to unlock these badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center p-4 rounded-lg border border-border bg-card/30">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mr-4">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-muted-foreground font-medium">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center p-6 rounded-lg border border-border bg-card/50">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-amber-500 mr-4" />
          <div>
            <h3 className="text-xl font-medium text-primary-foreground">Level 5</h3>
            <p className="text-muted-foreground">Real Estate Investor</p>
          </div>
        </div>
        <div className="w-48">
          <div className="text-sm text-right text-muted-foreground mb-1">250/300 XP</div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div className="bg-gradient-to-r from-primary to-amber-500 h-2 rounded-full w-[83%]" />
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        View All Achievements
      </Button>
    </div>
  )
}
