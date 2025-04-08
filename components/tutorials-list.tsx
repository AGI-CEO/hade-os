"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, Star, Filter, Play, Bookmark, CheckCircle, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample tutorials data
const tutorials = [
  {
    id: 1,
    title: "Understanding Cap Rates",
    description: "Learn how to calculate and interpret capitalization rates for property valuation",
    duration: "15 min",
    level: "Intermediate",
    category: "Financial Analysis",
    image: "/placeholder.svg?height=100&width=200",
    completed: false,
    bookmarked: true,
  },
  {
    id: 2,
    title: "Rental Property Screening Process",
    description: "Step-by-step guide to screening potential tenants effectively",
    duration: "20 min",
    level: "Beginner",
    category: "Property Management",
    image: "/placeholder.svg?height=100&width=200",
    completed: true,
    bookmarked: false,
  },
  {
    id: 3,
    title: "Tax Deductions for Landlords",
    description: "Maximize your tax benefits with these deduction strategies",
    duration: "25 min",
    level: "Intermediate",
    category: "Tax Planning",
    image: "/placeholder.svg?height=100&width=200",
    completed: false,
    bookmarked: true,
  },
  {
    id: 4,
    title: "Analyzing Rental Markets",
    description: "How to research and evaluate potential rental markets",
    duration: "30 min",
    level: "Advanced",
    category: "Market Analysis",
    image: "/placeholder.svg?height=100&width=200",
    completed: false,
    bookmarked: false,
  },
  {
    id: 5,
    title: "Property Renovation Budgeting",
    description: "Create accurate renovation budgets to maximize ROI",
    duration: "22 min",
    level: "Intermediate",
    category: "Renovations",
    image: "/placeholder.svg?height=100&width=200",
    completed: true,
    bookmarked: false,
  },
  {
    id: 6,
    title: "Creating a Real Estate Business Plan",
    description: "Develop a comprehensive business plan for your real estate investments",
    duration: "35 min",
    level: "Beginner",
    category: "Business Planning",
    image: "/placeholder.svg?height=100&width=200",
    completed: false,
    bookmarked: false,
  },
]

type TutorialsListProps = {
  searchQuery: string
}

export function TutorialsList({ searchQuery }: TutorialsListProps) {
  const [filter, setFilter] = useState<"all" | "bookmarked" | "completed">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  // Filter tutorials based on search query and filters
  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "bookmarked" && tutorial.bookmarked) ||
      (filter === "completed" && tutorial.completed)

    const matchesCategory = categoryFilter === "all" || tutorial.category === categoryFilter

    const matchesLevel = levelFilter === "all" || tutorial.level === levelFilter

    return matchesSearch && matchesFilter && matchesCategory && matchesLevel
  })

  const toggleBookmark = (id: number) => {
    // In a real app, this would update the state or call an API
    console.log(`Toggle bookmark for tutorial ${id}`)
  }

  const toggleCompleted = (id: number) => {
    // In a real app, this would update the state or call an API
    console.log(`Toggle completed for tutorial ${id}`)
  }

  // Get unique categories for filter
  const categories = Array.from(new Set(tutorials.map((t) => t.category)))

  // Get unique levels for filter
  const levels = Array.from(new Set(tutorials.map((t) => t.level)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All Tutorials
          </Button>
          <Button
            variant={filter === "bookmarked" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("bookmarked")}
          >
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarked
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {levelFilter === "all" ? "All Levels" : levelFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLevelFilter("all")}>All Levels</DropdownMenuItem>
              {levels.map((level) => (
                <DropdownMenuItem key={level} onClick={() => setLevelFilter(level)}>
                  {level}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredTutorials.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-primary-foreground mb-2">No tutorials found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button>Browse All Tutorials</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutorials.map((tutorial) => (
            <motion.div
              key={tutorial.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border border-border bg-card/50 overflow-hidden"
            >
              <div className="relative h-40">
                <img
                  src={tutorial.image || "/placeholder.svg"}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(tutorial.id)
                    }}
                  >
                    <Bookmark className={`h-4 w-4 ${tutorial.bookmarked ? "fill-white" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCompleted(tutorial.id)
                    }}
                  >
                    <CheckCircle className={`h-4 w-4 ${tutorial.completed ? "fill-white" : ""}`} />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {tutorial.level}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-primary-foreground mb-1">{tutorial.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                  </div>
                  <Badge variant="outline">{tutorial.category}</Badge>
                </div>
                <Button size="sm" className="w-full mt-3">
                  <Play className="mr-2 h-4 w-4" />
                  {tutorial.completed ? "Rewatch Tutorial" : "Start Tutorial"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Star className="mr-2 h-5 w-5 text-amber-500" />
            Popular Tutorials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Tutorial thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">House Hacking Strategies</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>18 min</span>
                    <span className="mx-2">•</span>
                    <span>Beginner</span>
                  </div>
                </div>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Tutorial thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">BRRRR Method Explained</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>25 min</span>
                    <span className="mx-2">•</span>
                    <span>Intermediate</span>
                  </div>
                </div>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Tutorial thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">1031 Exchange Basics</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>22 min</span>
                    <span className="mx-2">•</span>
                    <span>Advanced</span>
                  </div>
                </div>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View All Popular Tutorials
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
