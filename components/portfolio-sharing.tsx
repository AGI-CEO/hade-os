"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Share2, Building, TrendingUp, MapPin, Plus, Filter } from "lucide-react"

// Mock data for shared portfolios
const sharedPortfolios = [
  {
    id: 1,
    title: "My Journey to 10 Rental Properties",
    author: {
      name: "Michael Scott",
      avatar: "/placeholder.svg?height=40&width=40",
      badge: "Veteran",
    },
    description:
      "How I built a portfolio of 10 cash-flowing properties in 5 years using VA loans and creative financing.",
    properties: 10,
    roi: 12.5,
    location: "Multiple States",
    likes: 156,
    comments: 42,
    shares: 28,
    tags: ["VA Loan", "Multi-Family", "Cash Flow"],
    featured: true,
  },
  {
    id: 2,
    title: "First-Year Investor Results",
    author: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description: "My first year as a real estate investor: challenges, successes, and lessons learned.",
    properties: 2,
    roi: 8.2,
    location: "Austin, TX",
    likes: 87,
    comments: 23,
    shares: 12,
    tags: ["First-Time", "Single-Family", "House Hack"],
  },
  {
    id: 3,
    title: "Commercial Property Conversion",
    author: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      badge: "Mentor",
    },
    description: "How I converted an old office building into a mixed-use property with retail and apartments.",
    properties: 1,
    roi: 18.7,
    location: "Chicago, IL",
    likes: 203,
    comments: 56,
    shares: 41,
    tags: ["Commercial", "Conversion", "Mixed-Use"],
  },
  {
    id: 4,
    title: "Building a Vacation Rental Empire",
    author: {
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description: "My strategy for acquiring and managing profitable vacation rentals in competitive markets.",
    properties: 6,
    roi: 22.3,
    location: "Florida Coast",
    likes: 178,
    comments: 39,
    shares: 32,
    tags: ["Vacation Rental", "Short-Term", "Luxury"],
  },
]

export function PortfolioSharing() {
  const [activeTab, setActiveTab] = useState("trending")

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h2 className="text-xl font-semibold text-primary">Shared Portfolios</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-primary/20 text-primary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Share Portfolio
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 bg-background/50 backdrop-blur w-full md:w-auto">
          <TabsTrigger value="trending" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Recent
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm"
          >
            Following
          </TabsTrigger>
          <TabsTrigger value="veterans" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Veterans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sharedPortfolios.map((portfolio) => (
              <Card
                key={portfolio.id}
                className={`bg-card/50 backdrop-blur hover:shadow-glow-sm transition-all cursor-pointer ${
                  portfolio.featured ? "border-primary/30" : "border-border"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={portfolio.author.avatar} alt={portfolio.author.name} />
                        <AvatarFallback>{portfolio.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{portfolio.author.name}</span>
                          {portfolio.author.badge && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {portfolio.author.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs">{portfolio.location}</CardDescription>
                      </div>
                    </div>
                    {portfolio.featured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{portfolio.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center p-2 bg-background/50 rounded-lg">
                      <Building className="h-4 w-4 text-primary mb-1" />
                      <span className="font-medium">{portfolio.properties}</span>
                      <span className="text-xs text-muted-foreground">Properties</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background/50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-primary mb-1" />
                      <span className="font-medium">{portfolio.roi}%</span>
                      <span className="text-xs text-muted-foreground">Avg. ROI</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary mb-1" />
                      <span className="font-medium truncate w-full text-center">{portfolio.location}</span>
                      <span className="text-xs text-muted-foreground">Location</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4 flex justify-between">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{portfolio.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{portfolio.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{portfolio.shares}</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-primary/20 text-primary">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
            Load More
          </Button>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6 mt-0">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6 flex items-center justify-center">
              <p className="text-muted-foreground">Switch to the "Trending" tab to see example content</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="following" className="space-y-6 mt-0">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6 flex items-center justify-center">
              <p className="text-muted-foreground">Switch to the "Trending" tab to see example content</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="veterans" className="space-y-6 mt-0">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6 flex items-center justify-center">
              <p className="text-muted-foreground">Switch to the "Trending" tab to see example content</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
