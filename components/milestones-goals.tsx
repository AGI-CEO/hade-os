"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Flag, Plus, Calendar, TrendingUp, Home, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample goals data
const goals = [
  {
    id: 1,
    title: "Portfolio Value",
    target: "$1,000,000",
    current: "$780,000",
    progress: 78,
    icon: TrendingUp,
    deadline: "Dec 2023",
  },
  {
    id: 2,
    title: "Property Count",
    target: "5 Properties",
    current: "3 Properties",
    progress: 60,
    icon: Home,
    deadline: "Jun 2024",
  },
  {
    id: 3,
    title: "Monthly Cash Flow",
    target: "$5,000",
    current: "$2,400",
    progress: 48,
    icon: Calendar,
    deadline: "Mar 2024",
  },
]

export function MilestonesGoals() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground glow-text">Milestones & Goals</h2>
          <p className="text-muted-foreground">Track your real estate journey</p>
        </div>
        <Button className="bg-primary text-black hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4 text-black" />
          New Goal
        </Button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-6 border border-border rounded-lg bg-card/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <goal.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-primary-foreground">{goal.title}</h3>
                  <p className="text-muted-foreground">
                    Target: {goal.target} • Deadline: {goal.deadline}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Flag className={`h-5 w-5 mr-2 ${goal.progress >= 75 ? "text-amber-500" : "text-muted-foreground"}`} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Goal</DropdownMenuItem>
                    <DropdownMenuItem>Update Progress</DropdownMenuItem>
                    <DropdownMenuItem>Delete Goal</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current: {goal.current}</span>
                <span className="text-primary-foreground font-medium">{goal.progress}%</span>
              </div>
              <Progress
                value={goal.progress}
                className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-amber-500"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Goal Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Goals</span>
                <span className="text-primary-foreground font-medium">{goals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed Goals</span>
                <span className="text-primary-foreground font-medium">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Progress</span>
                <span className="text-primary-foreground font-medium">
                  {Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 2)
                .map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <goal.icon className="h-4 w-4 text-primary mr-2" />
                      <span className="text-primary-foreground">{goal.title}</span>
                    </div>
                    <span className="text-muted-foreground">{goal.deadline}</span>
                  </div>
                ))}
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View All Deadlines
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
