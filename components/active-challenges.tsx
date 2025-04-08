"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Clock, CheckCircle, Calendar, ArrowRight, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample challenges data
const challenges = [
  {
    id: 1,
    name: "Cash Flow Boost",
    description: "Increase your monthly cash flow by $500 within 60 days",
    category: "financial",
    difficulty: "medium",
    deadline: "2023-07-15",
    progress: 40,
    reward: { xp: 200, points: 400 },
    status: "active",
  },
  {
    id: 2,
    name: "Perfect Tenant Streak",
    description: "Maintain 100% on-time rent payments for 3 consecutive months",
    category: "tenant",
    difficulty: "easy",
    deadline: "2023-08-01",
    progress: 67,
    reward: { xp: 150, points: 300 },
    status: "active",
  },
  {
    id: 3,
    name: "Property Expansion",
    description: "Add a new property to your portfolio",
    category: "portfolio",
    difficulty: "hard",
    deadline: "2023-09-30",
    progress: 25,
    reward: { xp: 300, points: 600 },
    status: "active",
  },
  {
    id: 4,
    name: "Renovation Challenge",
    description: "Complete a property renovation under budget",
    category: "property",
    difficulty: "medium",
    deadline: "2023-08-15",
    progress: 10,
    reward: { xp: 250, points: 500 },
    status: "active",
  },
  {
    id: 5,
    name: "Tax Optimization",
    description: "Identify and document 5 new tax deductions",
    category: "financial",
    difficulty: "medium",
    deadline: "2023-07-01",
    progress: 80,
    reward: { xp: 200, points: 400 },
    status: "active",
  },
]

// Sample completed challenges
const completedChallenges = [
  {
    id: 101,
    name: "First Property Purchase",
    description: "Purchase your first investment property",
    category: "portfolio",
    difficulty: "hard",
    completedDate: "2022-01-15",
    reward: { xp: 300, points: 600 },
  },
  {
    id: 102,
    name: "Tenant Screening Pro",
    description: "Successfully screen and place 3 tenants",
    category: "tenant",
    difficulty: "medium",
    completedDate: "2022-06-22",
    reward: { xp: 200, points: 400 },
  },
]

export function ActiveChallenges() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredChallenges =
    filter === "completed" ? completedChallenges : challenges.filter((c) => c.status === "active")

  const categoriesFiltered =
    categoryFilter === "all" ? filteredChallenges : filteredChallenges.filter((c) => c.category === categoryFilter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-amber-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-primary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
            Active Challenges
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("financial")}>Financial</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("tenant")}>Tenant</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("portfolio")}>Portfolio</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("property")}>Property</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Challenge
          </Button>
        </div>
      </div>

      {categoriesFiltered.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-primary-foreground mb-2">No challenges found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new challenge</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesFiltered.map((challenge) => (
            <motion.div
              key={challenge.id}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {challenge.category}
                      </Badge>
                      {filter === "active" ? (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Deadline: {formatDate(challenge.deadline)}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          Completed: {formatDate(challenge.completedDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {filter === "active" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-amber-500">{getDaysRemaining(challenge.deadline)} days left</span>
                      </div>
                      <div className="w-full max-w-[200px] space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary-foreground">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-1.5 [&>div]:bg-primary" />
                      </div>
                    </>
                  )}
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{challenge.reward.xp} XP</span>
                    <span>•</span>
                    <span>{challenge.reward.points} Points</span>
                  </div>
                </div>
              </div>
              {filter === "active" && (
                <Button size="sm" className="mt-3 w-full sm:w-auto">
                  Update Progress
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-primary-foreground mb-4">Recommended Challenges</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">Maintenance Cost Reduction</h4>
                  <p className="text-xs text-muted-foreground">Reduce maintenance costs by 15%</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-3 w-3" />
                Accept
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">Tenant Satisfaction Survey</h4>
                  <p className="text-xs text-muted-foreground">Collect feedback from all tenants</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-3 w-3" />
                Accept
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">Mortgage Refinance</h4>
                  <p className="text-xs text-muted-foreground">Refinance at least one property</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-3 w-3" />
                Accept
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-3">
            <ArrowRight className="mr-2 h-4 w-4" />
            View More Challenges
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
