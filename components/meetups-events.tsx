"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Clock, Filter, Search, Plus, ExternalLink } from "lucide-react"

// Mock data for events
const events = [
  {
    id: 1,
    title: "Real Estate Investor Networking Mixer",
    description: "Connect with fellow investors in your area and build valuable relationships.",
    date: "March 15, 2023",
    time: "6:00 PM - 8:30 PM",
    location: "Downtown Conference Center, New York, NY",
    attendees: 87,
    type: "In-Person",
    image: "/placeholder.svg?height=200&width=400",
    featured: true,
    organizer: {
      name: "NYC Real Estate Investors Club",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "VA Loan Benefits for Real Estate Investing",
    description: "Learn how to leverage VA loan benefits for building your real estate portfolio.",
    date: "March 22, 2023",
    time: "1:00 PM - 2:30 PM",
    location: "Virtual Event (Zoom)",
    attendees: 156,
    type: "Virtual",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
    organizer: {
      name: "Veteran Investors Alliance",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Multi-Family Property Analysis Workshop",
    description: "Hands-on workshop for analyzing multi-family investment opportunities.",
    date: "April 5, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Hilton Hotel, Chicago, IL",
    attendees: 42,
    type: "In-Person",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
    organizer: {
      name: "Real Estate Education Group",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Market Trends & Forecasting Webinar",
    description: "Expert analysis of current market trends and forecasts for the coming year.",
    date: "April 12, 2023",
    time: "12:00 PM - 1:30 PM",
    location: "Virtual Event (Zoom)",
    attendees: 203,
    type: "Virtual",
    image: "/placeholder.svg?height=200&width=400",
    featured: true,
    organizer: {
      name: "Investment Research Partners",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export function MeetupsEvents() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            placeholder="Search events by title, location, or date..."
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
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-background/50 backdrop-blur w-full md:w-auto">
          <TabsTrigger value="upcoming" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger
            value="my-events"
            className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm"
          >
            My Events
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Past Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className={`bg-card/50 backdrop-blur hover:shadow-glow-sm transition-all overflow-hidden ${
                  event.featured ? "border-primary/30" : "border-border"
                }`}
              >
                <div className="relative h-48 w-full">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge
                      className={`${
                        event.type === "Virtual"
                          ? "bg-blue-500/20 text-blue-500 border-blue-500/20"
                          : "bg-green-500/20 text-green-500 border-green-500/20"
                      }`}
                    >
                      {event.type}
                    </Badge>
                    {event.featured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-primary/20">
                      <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                      <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Organized by {event.organizer.name}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4 flex justify-between">
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm">
                    RSVP Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
            View All Events
          </Button>
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6 mt-0">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6 flex items-center justify-center">
              <p className="text-muted-foreground">Switch to the "Upcoming Events" tab to see example content</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-6 mt-0">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6 flex items-center justify-center">
              <p className="text-muted-foreground">Switch to the "Upcoming Events" tab to see example content</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
