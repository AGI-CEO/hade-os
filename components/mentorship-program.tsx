"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, Users, Filter, Search, Building } from "lucide-react"

// Mock data for mentors
const mentors = [
  {
    id: 1,
    name: "Robert Anderson",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "Commercial Real Estate Expert",
    experience: 15,
    specialties: ["Commercial", "Multi-Family", "Financing"],
    rating: 4.9,
    reviews: 87,
    students: 34,
    availability: "Available next week",
    featured: true,
    bio: "Former commercial banker with 15+ years of real estate investing experience. Specializes in commercial property acquisition and creative financing strategies.",
  },
  {
    id: 2,
    name: "Jennifer Lee",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "Residential Rental Specialist",
    experience: 8,
    specialties: ["Single-Family", "House Hacking", "Property Management"],
    rating: 4.8,
    reviews: 62,
    students: 28,
    availability: "Available this week",
    featured: false,
    bio: "Full-time real estate investor who built a portfolio of 20+ single-family rentals. Expert in tenant screening, property management, and maximizing rental income.",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "Veteran Housing Advisor",
    experience: 12,
    specialties: ["VA Loans", "First-Time Buyers", "Wealth Building"],
    rating: 5.0,
    reviews: 93,
    students: 41,
    availability: "Limited availability",
    featured: true,
    bio: "Navy veteran who used VA loans to build a real estate portfolio. Now helps other veterans leverage their benefits to build wealth through real estate.",
  },
  {
    id: 4,
    name: "Sophia Williams",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "BRRRR Method Expert",
    experience: 6,
    specialties: ["BRRRR", "Rehab", "Scaling"],
    rating: 4.7,
    reviews: 45,
    students: 22,
    availability: "Available next week",
    featured: false,
    bio: "Scaled from 0 to 15 properties in 6 years using the BRRRR method (Buy, Rehab, Rent, Refinance, Repeat). Specializes in finding undervalued properties and forced appreciation.",
  },
]

// Mock data for mentorship programs
const programs = [
  {
    id: 1,
    title: "One-on-One Mentorship",
    description: "Get personalized guidance from an experienced investor matched to your goals",
    features: [
      "Weekly 1-hour video calls",
      "Unlimited email support",
      "Deal analysis assistance",
      "Customized investment plan",
      "3-month minimum commitment",
    ],
    price: "$299/month",
    popular: true,
  },
  {
    id: 2,
    title: "Group Coaching",
    description: "Learn with a small group of investors with similar goals and experience levels",
    features: [
      "Bi-weekly group sessions",
      "Monthly Q&A calls",
      "Private community access",
      "Deal analysis templates",
      "6-month program",
    ],
    price: "$149/month",
    popular: false,
  },
  {
    id: 3,
    title: "Deal Analysis Review",
    description: "Get expert feedback on specific investment opportunities",
    features: [
      "Detailed property analysis",
      "Cash flow projections",
      "Risk assessment",
      "Improvement recommendations",
      "Follow-up consultation",
    ],
    price: "$99/deal",
    popular: false,
  },
]

export function MentorshipProgram() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            placeholder="Search mentors by name, specialty, or location..."
            className="w-full pl-10 py-2 bg-background/50 border border-primary/20 rounded-md focus:border-primary focus:ring-primary/20 focus:outline-none"
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
            Become a Mentor
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mentors" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-background/50 backdrop-blur w-full md:w-auto">
          <TabsTrigger value="mentors" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Find a Mentor
          </TabsTrigger>
          <TabsTrigger value="programs" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Mentorship Programs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className={`bg-card/50 backdrop-blur hover:shadow-glow-sm transition-all ${
                  mentor.featured ? "border-primary/30" : "border-border"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <CardDescription className="text-sm">{mentor.title}</CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          <span className="text-xs text-muted-foreground">({mentor.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    {mentor.featured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Top Mentor
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{mentor.bio}</p>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 bg-background/50 rounded-lg">
                      <Building className="h-4 w-4 text-primary mb-1" />
                      <span className="font-medium">{mentor.experience}+ yrs</span>
                      <span className="text-xs text-muted-foreground">Experience</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background/50 rounded-lg">
                      <Users className="h-4 w-4 text-primary mb-1" />
                      <span className="font-medium">{mentor.students}</span>
                      <span className="text-xs text-muted-foreground">Students</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background/50 rounded-lg">
                      <Clock className="h-4 w-4 text-primary mb-1" />
                      <span className="font-medium text-xs truncate w-full text-center">{mentor.availability}</span>
                      <span className="text-xs text-muted-foreground">Availability</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mentor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/30">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4 flex justify-between">
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                    View Profile
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm">
                    Request Mentorship
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
            View All Mentors
          </Button>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card
                key={program.id}
                className={`bg-card/50 backdrop-blur hover:shadow-glow-sm transition-all ${
                  program.popular ? "border-primary/30" : "border-border"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    {program.popular && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-4">
                    <span className="text-2xl font-bold text-primary">{program.price}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
