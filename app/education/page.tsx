"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  Play,
  Clock,
  Award,
  Star,
  ChevronRight,
  Sparkles,
  GraduationCap,
  FileText,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VALoanHub } from "@/components/va-loan-hub"
import { TutorialsList } from "@/components/tutorials-list"
import { PropertySimulator } from "@/components/property-simulator"

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCourseDetails, setShowCourseDetails] = useState(false)

  // Calculate overall learning progress
  const completedCourses = 3
  const totalCourses = 12
  const progressPercentage = Math.round((completedCourses / totalCourses) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Education</h1>
        <p className="text-muted-foreground">Learn real estate investing strategies and grow your knowledge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Learning Progress</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">{progressPercentage}%</h2>
              <p className="text-sm text-muted-foreground">
                {completedCourses} of {totalCourses} courses completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Continue Learning</p>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Play className="h-4 w-4 text-primary" />
              </Button>
            </div>
            <h3 className="font-medium text-primary-foreground mb-1">Real Estate Tax Strategies</h3>
            <Progress value={45} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-amber-500" />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">45% complete</p>
              <p className="text-xs text-muted-foreground">15 min left</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VA Loan Resources</p>
              <h2 className="text-lg font-bold text-primary-foreground">Specialized Content</h2>
              <Button size="sm" variant="outline" className="mt-1">
                <Shield className="mr-2 h-4 w-4" />
                Explore VA Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses and tutorials..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Topics</DropdownMenuItem>
              <DropdownMenuItem>Beginner Friendly</DropdownMenuItem>
              <DropdownMenuItem>Advanced Topics</DropdownMenuItem>
              <DropdownMenuItem>Recently Added</DropdownMenuItem>
              <DropdownMenuItem>Most Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Bookmark className="mr-2 h-4 w-4" />
            Saved Content
          </Button>
        </div>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="featured">
            <Star className="mr-2 h-4 w-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="va-loans">
            <Shield className="mr-2 h-4 w-4" />
            VA Loans
          </TabsTrigger>
          <TabsTrigger value="tutorials">
            <BookOpen className="mr-2 h-4 w-4" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="simulator">
            <Sparkles className="mr-2 h-4 w-4" />
            Simulator
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="featured" className="mt-0">
                <FeaturedContent setShowCourseDetails={setShowCourseDetails} />
              </TabsContent>
            </motion.div>

            <motion.div
              key="va-loans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="va-loans" className="mt-0">
                <VALoanHub />
              </TabsContent>
            </motion.div>

            <motion.div
              key="tutorials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="tutorials" className="mt-0">
                <TutorialsList searchQuery={searchQuery} />
              </TabsContent>
            </motion.div>

            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="simulator" className="mt-0">
                <PropertySimulator />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Learning Achievements
          </CardTitle>
          <CardDescription>Track your educational progress and earn badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card/50 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium text-primary-foreground text-center">Beginner Investor</h3>
              <Badge className="mt-2 bg-green-500">Completed</Badge>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium text-primary-foreground text-center">VA Loan Expert</h3>
              <div className="w-full mt-2">
                <Progress value={75} className="h-1.5 [&>div]:bg-primary" />
                <p className="text-xs text-center text-muted-foreground mt-1">75% Complete</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium text-primary-foreground text-center">Tax Strategist</h3>
              <div className="w-full mt-2">
                <Progress value={45} className="h-1.5 [&>div]:bg-primary" />
                <p className="text-xs text-center text-muted-foreground mt-1">45% Complete</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-muted-foreground text-center">Advanced Investor</h3>
              <Badge variant="outline" className="mt-2">
                Locked
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showCourseDetails && <CourseDetailsModal onClose={() => setShowCourseDetails(false)} />}
      </AnimatePresence>
    </div>
  )
}

function FeaturedContent({ setShowCourseDetails }: { setShowCourseDetails: (show: boolean) => void }) {
  const featuredCourses = [
    {
      id: 1,
      title: "Real Estate Investing Fundamentals",
      description: "Learn the basics of real estate investing and build a strong foundation",
      duration: "2 hours",
      level: "Beginner",
      instructor: "Sarah Johnson",
      image: "/placeholder.svg?height=200&width=400",
      rating: 4.8,
      reviews: 124,
      featured: true,
    },
    {
      id: 2,
      title: "VA Loan Masterclass",
      description: "Everything veterans need to know about using VA loans for real estate",
      duration: "1.5 hours",
      level: "Intermediate",
      instructor: "Michael Chen",
      image: "/placeholder.svg?height=200&width=400",
      rating: 4.9,
      reviews: 87,
      featured: true,
    },
    {
      id: 3,
      title: "Advanced Rental Property Analysis",
      description: "Deep dive into analyzing potential rental properties for maximum ROI",
      duration: "3 hours",
      level: "Advanced",
      instructor: "David Kim",
      image: "/placeholder.svg?height=200&width=400",
      rating: 4.7,
      reviews: 56,
      featured: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCourses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-border bg-card/50 overflow-hidden cursor-pointer"
            onClick={() => setShowCourseDetails(true)}
          >
            <div className="relative h-48">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
              {course.featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-amber-500">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {course.level}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-primary-foreground mb-1">{course.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{course.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                  <span className="text-xs text-muted-foreground">
                    {course.rating} ({course.reviews})
                  </span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                <Play className="mr-2 h-4 w-4" />
                Start Learning
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Recommended Learning Paths
          </CardTitle>
          <CardDescription>Curated courses to help you achieve your real estate goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground">Beginner Investor Path</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect for those just starting their real estate journey
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">
                      5 Courses
                    </Badge>
                    <Badge variant="outline">8 Hours</Badge>
                  </div>
                </div>
                <Button>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View Path
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground">VA Loan Specialist</h3>
                  <p className="text-sm text-muted-foreground">Master using VA loans for real estate investment</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">
                      4 Courses
                    </Badge>
                    <Badge variant="outline">6 Hours</Badge>
                  </div>
                </div>
                <Button>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View Path
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground">Rental Property Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Everything you need to know about managing rental properties
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">
                      6 Courses
                    </Badge>
                    <Badge variant="outline">10 Hours</Badge>
                  </div>
                </div>
                <Button>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View Path
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CourseDetailsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <div className="relative h-64">
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="Real Estate Investing Fundamentals"
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <ChevronRight className="h-4 w-4 rotate-45" />
          </Button>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-amber-500 mb-2">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Featured
            </Badge>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">Real Estate Investing Fundamentals</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Clock className="h-3 w-3 mr-1" />2 hours
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <BookOpen className="h-3 w-3 mr-1" />
              Beginner
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-1" />
              4.8 (124 reviews)
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <GraduationCap className="h-3 w-3 mr-1" />
              Sarah Johnson
            </Badge>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeTab === "overview" ? "default" : "outline"}
              onClick={() => setActiveTab("overview")}
              className="flex-1"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "curriculum" ? "default" : "outline"}
              onClick={() => setActiveTab("curriculum")}
              className="flex-1"
            >
              Curriculum
            </Button>
            <Button
              variant={activeTab === "reviews" ? "default" : "outline"}
              onClick={() => setActiveTab("reviews")}
              className="flex-1"
            >
              Reviews
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground mb-2">About This Course</h3>
                    <p className="text-muted-foreground">
                      This comprehensive course is designed for beginners who want to learn the fundamentals of real
                      estate investing. You'll learn how to analyze properties, understand market trends, and build a
                      successful investment strategy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground mb-2">What You'll Learn</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">How to analyze potential investment properties</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">Understanding cash flow and ROI calculations</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">Financing options for real estate investments</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">Risk management strategies for new investors</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">Building your real estate investment portfolio</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground mb-2">Requirements</h3>
                    <p className="text-muted-foreground">
                      No prior real estate knowledge is required. Basic understanding of financial concepts is helpful
                      but not necessary.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "curriculum" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-primary-foreground">
                        Module 1: Introduction to Real Estate Investing
                      </h3>
                      <Badge variant="outline">25 min</Badge>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Why Real Estate Investing?</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Types of Real Estate Investments</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Setting Your Investment Goals</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-primary-foreground">Module 2: Property Analysis Fundamentals</h3>
                      <Badge variant="outline">40 min</Badge>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Understanding Market Analysis</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Property Valuation Methods</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Cash Flow Analysis</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">ROI Calculations</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-primary-foreground">Module 3: Financing Your Investments</h3>
                      <Badge variant="outline">35 min</Badge>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Traditional Mortgage Options</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Creative Financing Strategies</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Working with Lenders</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-primary-foreground">Module 4: Building Your Portfolio</h3>
                      <Badge variant="outline">20 min</Badge>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Long-term Investment Strategies</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Play className="h-3 w-3 text-primary mr-2" />
                        <span className="text-muted-foreground">Scaling Your Real Estate Business</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground">Student Reviews</h3>
                      <p className="text-muted-foreground">124 reviews with an average rating of 4.8</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-border bg-card/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium text-sm">JD</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-foreground">John Doe</h4>
                            <p className="text-xs text-muted-foreground">2 weeks ago</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This course was exactly what I needed as a beginner. The concepts are explained clearly and the
                        examples are very practical. Highly recommended!
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium text-sm">AR</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-foreground">Alice Rodriguez</h4>
                            <p className="text-xs text-muted-foreground">1 month ago</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sarah is an excellent instructor. She breaks down complex concepts into easy-to-understand
                        pieces. The section on cash flow analysis was particularly helpful for me.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium text-sm">MJ</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-foreground">Michael Johnson</h4>
                            <p className="text-xs text-muted-foreground">2 months ago</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great course overall. I would have liked more advanced content on financing strategies, but it's
                        perfect for beginners as advertised.
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View All Reviews
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Start Course
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
