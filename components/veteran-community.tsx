"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  MessageSquare,
  Calendar,
  MapPin,
  Search,
  Filter,
  User,
  Star,
  Shield,
  Award,
  Building,
  Clock,
  ThumbsUp,
  MessageCircle,
  Share2,
  Briefcase,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type VeteranCommunityProps = {
  searchQuery: string
}

export function VeteranCommunity({ searchQuery }: VeteranCommunityProps) {
  const [filter, setFilter] = useState<"all" | "local" | "online">("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")

  // Sample community members data
  const communityMembers = [
    {
      id: 1,
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "Army",
      location: "San Diego, CA",
      specialty: "Multi-Family Investing",
      properties: 12,
      joinedDate: "2 years ago",
      isVeteran: true,
      isOnline: true,
    },
    {
      id: 2,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "Navy",
      location: "Norfolk, VA",
      specialty: "House Hacking",
      properties: 5,
      joinedDate: "1 year ago",
      isVeteran: true,
      isOnline: false,
    },
    {
      id: 3,
      name: "David Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "Marines",
      location: "Austin, TX",
      specialty: "Fix and Flip",
      properties: 8,
      joinedDate: "3 years ago",
      isVeteran: true,
      isOnline: true,
    },
    {
      id: 4,
      name: "Jennifer Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "Air Force",
      location: "Denver, CO",
      specialty: "Commercial Real Estate",
      properties: 3,
      joinedDate: "6 months ago",
      isVeteran: true,
      isOnline: false,
    },
    {
      id: 5,
      name: "Robert Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "Coast Guard",
      location: "Seattle, WA",
      specialty: "Vacation Rentals",
      properties: 6,
      joinedDate: "1.5 years ago",
      isVeteran: true,
      isOnline: true,
    },
    {
      id: 6,
      name: "Lisa Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "Army",
      location: "Tampa, FL",
      specialty: "BRRRR Strategy",
      properties: 10,
      joinedDate: "2.5 years ago",
      isVeteran: true,
      isOnline: false,
    },
  ]

  // Sample discussion topics data
  const discussionTopics = [
    {
      id: 1,
      title: "Using VA Loans for House Hacking",
      author: "Michael Johnson",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "2 days ago",
      replies: 24,
      views: 156,
      likes: 42,
      isHot: true,
    },
    {
      id: 2,
      title: "Best Markets for Veteran Investors in 2023",
      author: "Sarah Williams",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 week ago",
      replies: 18,
      views: 132,
      likes: 35,
      isHot: false,
    },
    {
      id: 3,
      title: "Transitioning from Military to Real Estate Full-Time",
      author: "David Rodriguez",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "3 days ago",
      replies: 31,
      views: 203,
      likes: 56,
      isHot: true,
    },
    {
      id: 4,
      title: "VA Loan Funding Fee Exemptions",
      author: "Jennifer Chen",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "5 days ago",
      replies: 12,
      views: 98,
      likes: 27,
      isHot: false,
    },
  ]

  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Veteran Real Estate Investor Meetup",
      date: "May 15, 2023",
      time: "6:00 PM - 8:00 PM",
      location: "San Diego, CA",
      attendees: 42,
      isVirtual: false,
    },
    {
      id: 2,
      title: "VA Loan Masterclass Webinar",
      date: "May 22, 2023",
      time: "1:00 PM - 3:00 PM",
      location: "Online",
      attendees: 128,
      isVirtual: true,
    },
    {
      id: 3,
      title: "Veteran Investor Networking Breakfast",
      date: "June 5, 2023",
      time: "8:00 AM - 10:00 AM",
      location: "Austin, TX",
      attendees: 35,
      isVirtual: false,
    },
  ]

  // Filter community members based on search query and filters
  const filteredMembers = communityMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.branch.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "online" && member.isOnline) ||
      (filter === "local" && member.location.includes("San Diego")) // Example for local filtering

    const matchesBranch = branchFilter === "all" || member.branch === branchFilter

    return matchesSearch && matchesFilter && matchesBranch
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="discussions">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All Members
            </Button>
            <Button variant={filter === "online" ? "default" : "outline"} size="sm" onClick={() => setFilter("online")}>
              Online Now
            </Button>
            <Button variant={filter === "local" ? "default" : "outline"} size="sm" onClick={() => setFilter("local")}>
              Near Me
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {branchFilter === "all" ? "All Branches" : branchFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setBranchFilter("all")}>All Branches</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBranchFilter("Army")}>Army</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBranchFilter("Navy")}>Navy</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBranchFilter("Air Force")}>Air Force</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBranchFilter("Marines")}>Marines</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBranchFilter("Coast Guard")}>Coast Guard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6">
          <TabsContent value="members" className="mt-0">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-primary-foreground mb-2">No members found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button>Browse All Members</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-primary-foreground">{member.name}</h3>
                          <Shield className="h-4 w-4 text-primary ml-1" />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            {member.branch}
                          </Badge>
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{member.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Specialty:</span> {member.specialty}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Properties:</span> {member.properties}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3">
                      <Button size="sm" variant="outline">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <Star className="mr-2 h-5 w-5 text-amber-500" />
                  Featured Veteran Investors
                </CardTitle>
                <CardDescription>Top contributors in our veteran investor community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="James Wilson" />
                        <AvatarFallback>JW</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-primary-foreground">James Wilson</h4>
                          <Award className="h-4 w-4 text-amber-500 ml-1" />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            Army
                          </Badge>
                          <Building className="h-3 w-3 mr-1" />
                          <span>42 Properties</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Maria Gonzalez" />
                        <AvatarFallback>MG</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-primary-foreground">Maria Gonzalez</h4>
                          <Award className="h-4 w-4 text-amber-500 ml-1" />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            Marines
                          </Badge>
                          <Building className="h-3 w-3 mr-1" />
                          <span>28 Properties</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Thomas Lee" />
                        <AvatarFallback>TL</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-primary-foreground">Thomas Lee</h4>
                          <Award className="h-4 w-4 text-amber-500 ml-1" />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            Navy
                          </Badge>
                          <Building className="h-3 w-3 mr-1" />
                          <span>35 Properties</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="mt-0">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium text-primary-foreground">Recent Discussions</h3>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </div>

            <div className="space-y-4">
              {discussionTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-primary-foreground">{topic.title}</h3>
                        {topic.isHot && (
                          <Badge className="ml-2 bg-red-500">
                            <Star className="h-3 w-3 mr-1 fill-white" />
                            Hot
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                          <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{topic.author}</span>
                        <span className="text-xs text-muted-foreground mx-2">•</span>
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{topic.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span>{topic.replies} replies</span>
                        <span className="mx-2">•</span>
                        <span>{topic.views} views</span>
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <span className="text-xs text-muted-foreground mr-2">{topic.likes}</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Popular Categories
                </CardTitle>
                <CardDescription>Browse discussions by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-primary-foreground mb-2">VA Loans</h3>
                      <p className="text-xs text-muted-foreground mb-2 flex-grow">
                        Discussions about VA loan strategies and benefits
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>156 topics</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-primary-foreground mb-2">Investment Strategies</h3>
                      <p className="text-xs text-muted-foreground mb-2 flex-grow">
                        Share and learn about different real estate investment approaches
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>243 topics</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-primary-foreground mb-2">Military Transition</h3>
                      <p className="text-xs text-muted-foreground mb-2 flex-grow">
                        Support for transitioning from military to civilian real estate careers
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>128 topics</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium text-primary-foreground">Upcoming Events</h3>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs text-primary-foreground">
                          {event.date.split(",")[0].split(" ")[0]}
                        </span>
                        <span className="text-lg font-bold text-primary">{event.date.split(",")[0].split(" ")[1]}</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-primary-foreground">{event.title}</h3>
                          {event.isVirtual && (
                            <Badge className="ml-2 bg-blue-500">
                              <span>Virtual</span>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{event.time}</span>
                          <MapPin className="h-3 w-3 ml-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      RSVP
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Find Events Near You
                </CardTitle>
                <CardDescription>Veteran investor events in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg border border-border bg-card/50 flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Interactive map will be displayed here</p>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Events
                  </Button>
                  <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Search by Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
