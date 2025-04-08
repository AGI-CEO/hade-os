"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Star, Home, TrendingUp, Users, Award, Lock, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    xp: 100,
    points: 250,
  },
  {
    id: 2,
    name: "Cash Flow King",
    description: "Achieve $2,000 monthly cash flow",
    icon: TrendingUp,
    color: "text-amber-500",
    earned: true,
    date: "Nov 3, 2022",
    xp: 150,
    points: 300,
  },
  {
    id: 3,
    name: "Tenant Master",
    description: "Successfully manage 5 tenants",
    icon: Users,
    color: "text-primary",
    earned: false,
    progress: 60,
    xp: 150,
    points: 300,
  },
  {
    id: 4,
    name: "Portfolio Pro",
    description: "Own 5 properties simultaneously",
    icon: Award,
    color: "text-amber-500",
    earned: false,
    progress: 40,
    xp: 300,
    points: 750,
  },
  {
    id: 5,
    name: "Tax Wizard",
    description: "Maximize tax deductions",
    icon: Sparkles,
    color: "text-primary",
    earned: true,
    date: "Apr 15, 2023",
    xp: 200,
    points: 400,
  },
  {
    id: 6,
    name: "Renovation Master",
    description: "Complete 3 property renovations",
    icon: Home,
    color: "text-amber-500",
    earned: false,
    progress: 33,
    xp: 250,
    points: 500,
  },
  {
    id: 7,
    name: "Passive Income Pro",
    description: "Achieve $5,000 monthly cash flow",
    icon: TrendingUp,
    color: "text-primary",
    earned: false,
    progress: 38,
    xp: 400,
    points: 800,
  },
  {
    id: 8,
    name: "Community Leader",
    description: "Help 5 other investors",
    icon: Users,
    color: "text-amber-500",
    earned: false,
    progress: 20,
    xp: 300,
    points: 600,
  },
]

// Sample locked badges
const lockedBadges = [
  {
    id: 9,
    name: "Million Dollar Club",
    description: "Reach $1M in portfolio value",
    icon: Award,
    color: "text-amber-500",
    xp: 500,
    points: 1000,
  },
  {
    id: 10,
    name: "Real Estate Mogul",
    description: "Own 10 properties simultaneously",
    icon: Award,
    color: "text-primary",
    xp: 750,
    points: 1500,
  },
]

export function UserAchievements() {
  // Calculate stats
  const earnedBadges = badges.filter((badge) => badge.earned).length
  const totalBadges = badges.length + lockedBadges.length
  const earnedXP = badges.filter((badge) => badge.earned).reduce((sum, badge) => sum + badge.xp, 0)
  const earnedPoints = badges.filter((badge) => badge.earned).reduce((sum, badge) => sum + badge.points, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-xl font-bold text-primary-foreground">
                {earnedBadges}/{totalBadges}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP Earned</p>
              <p className="text-xl font-bold text-primary-foreground">{earnedXP} XP</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quest Points</p>
              <p className="text-xl font-bold text-amber-500">{earnedPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-primary-foreground">Your Badges</h3>
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
              {badge.icon && (
                <badge.icon className={cn("h-8 w-8", badge.earned ? badge.color : "text-muted-foreground")} />
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
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
              <span>{badge.xp} XP</span>
              <span>•</span>
              <span>{badge.points} Points</span>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="text-xl font-bold text-primary-foreground">Locked Badges</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lockedBadges.map((badge) => (
          <div key={badge.id} className="flex items-center p-4 rounded-lg border border-border bg-card/30">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mr-4">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-muted-foreground font-medium">{badge.name}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{badge.xp} XP</span>
                <span>•</span>
                <span>{badge.points} Points</span>
              </div>
            </div>
            <Badge variant="outline" className="ml-2">
              Level 10+
            </Badge>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        View All Badges
      </Button>
    </div>
  )
}

function Trophy({ className, ...props }: React.ComponentProps<typeof Award>) {
  return <Award className={cn("", className)} {...props} />
}
