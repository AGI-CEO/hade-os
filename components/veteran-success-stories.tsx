"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star,
  Building,
  DollarSign,
  Play,
  ChevronRight,
  Quote,
  Award,
  ThumbsUp,
  MessageCircle,
  Share2,
  BookOpen,
  FileText,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VeteranSuccessStories() {
  const [showStoryDetails, setShowStoryDetails] = useState(false)

  // Sample success stories data
  const successStories = [
    {
      id: 1,
      name: "James Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      branch: "Army",
      title: "From Military Service to Real Estate Empire",
      summary: "How I used my VA loan to purchase my first property and built a portfolio of 42 units over 10 years.",
      image: "/placeholder.svg?height=200&width=400",
      properties: 42,
      annualIncome: "$380,000",
      yearsInvesting: 10,
      featured: true,
    },
    {
      id: 2,
      name: "Maria Gonzalez",
      avatar: "/placeholder.svg?height=100&width=100",
      branch: "Marines",
      title: "House Hacking My Way to Financial Freedom",
      summary: "How I used the house hacking strategy with VA loans to acquire 8 properties in just 5 years.",
      image: "/placeholder.svg?height=200&width=400",
      properties: 8,
      annualIncome: "$120,000",
      yearsInvesting: 5,
      featured: false,
    },
    {
      id: 3,
      name: "Thomas Lee",
      avatar: "/placeholder.svg?height=100&width=100",
      branch: "Navy",
      title: "Building a Commercial Real Estate Portfolio",
      summary: "My journey from residential to commercial real estate investing after my naval career.",
      image: "/placeholder.svg?height=200&width=400",
      properties: 12,
      annualIncome: "$250,000",
      yearsInvesting: 8,
      featured: true,
    },
  ]

  // Sample case studies data
  const caseStudies = [
    {
      id: 1,
      title: "VA Loan House Hack: 4-Unit Property Analysis",
      description: "Detailed analysis of a successful 4-unit property purchase using a VA loan with no money down.",
      image: "/placeholder.svg?height=100&width=200",
      metrics: {
        purchasePrice: "$450,000",
        cashFlow: "$1,200/month",
        roi: "22%",
        appreciation: "8% annually",
      },
    },
    {
      id: 2,
      title: "BRRRR Strategy with VA Loan Rotation",
      description: "Case study of using the VA loan rotation strategy combined with the BRRRR method.",
      image: "/placeholder.svg?height=100&width=200",
      metrics: {
        purchasePrice: "$320,000",
        cashFlow: "$850/month",
        roi: "18%",
        appreciation: "6% annually",
      },
    },
    {
      id: 3,
      title: "From VA Loan to Commercial Multifamily",
      description: "How a veteran leveraged initial VA loan properties to scale into commercial multifamily investing.",
      image: "/placeholder.svg?height=100&width=200",
      metrics: {
        purchasePrice: "$1.2 million",
        cashFlow: "$4,500/month",
        roi: "15%",
        appreciation: "7% annually",
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="stories">
            <Star className="mr-2 h-4 w-4" />
            Success Stories
          </TabsTrigger>
          <TabsTrigger value="case-studies">
            <FileText className="mr-2 h-4 w-4" />
            Case Studies
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="stories" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border bg-card/50 overflow-hidden cursor-pointer"
                  onClick={() => setShowStoryDetails(true)}
                >
                  <div className="relative h-48">
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    {story.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-amber-500">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {story.branch}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={story.avatar} alt={story.name} />
                        <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium text-primary-foreground">{story.name}</h3>
                    </div>
                    <h3 className="font-medium text-primary-foreground mb-1">{story.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{story.summary}</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 rounded-md bg-primary/5">
                        <Building className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Properties</p>
                        <p className="text-sm font-medium text-primary-foreground">{story.properties}</p>
                      </div>
                      <div className="text-center p-2 rounded-md bg-primary/5">
                        <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Annual</p>
                        <p className="text-sm font-medium text-primary-foreground">{story.annualIncome}</p>
                      </div>
                      <div className="text-center p-2 rounded-md bg-primary/5">
                        <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Years</p>
                        <p className="text-sm font-medium text-primary-foreground">{story.yearsInvesting}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Read Full Story
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <Quote className="mr-2 h-5 w-5 text-primary" />
                  Veteran Testimonials
                </CardTitle>
                <CardDescription>Hear from our veteran real estate investors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robert Johnson" />
                        <AvatarFallback>RJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-primary-foreground">Robert Johnson</h4>
                          <Badge variant="outline" className="ml-2">
                            Army
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          "The VA loan benefit was a game-changer for me. I was able to purchase my first duplex with no
                          money down, live in one unit, and rent out the other. This kickstarted my real estate journey
                          and I've never looked back."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jennifer Martinez" />
                        <AvatarFallback>JM</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-primary-foreground">Jennifer Martinez</h4>
                          <Badge variant="outline" className="ml-2">
                            Air Force
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          "As a veteran, I've found that the discipline and leadership skills I gained in the military
                          have been invaluable in my real estate business. Combined with the VA loan benefit, I've been
                          able to build a portfolio that provides financial freedom for my family."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Michael Chen" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-primary-foreground">Michael Chen</h4>
                          <Badge variant="outline" className="ml-2">
                            Marines
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          "The resources and community available to veteran real estate investors have been incredible.
                          I've connected with mentors who helped me navigate the challenges of scaling my portfolio from
                          2 to 15 properties in just 4 years."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-studies" className="mt-0">
            <div className="space-y-6">
              {caseStudies.map((study) => (
                <motion.div
                  key={study.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4">
                      <img
                        src={study.image || "/placeholder.svg"}
                        alt={study.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-lg font-medium text-primary-foreground mb-2">{study.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{study.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-2 rounded-md bg-primary/5 text-center">
                          <p className="text-xs text-muted-foreground">Purchase Price</p>
                          <p className="text-sm font-medium text-primary-foreground">{study.metrics.purchasePrice}</p>
                        </div>
                        <div className="p-2 rounded-md bg-primary/5 text-center">
                          <p className="text-xs text-muted-foreground">Cash Flow</p>
                          <p className="text-sm font-medium text-primary-foreground">{study.metrics.cashFlow}</p>
                        </div>
                        <div className="p-2 rounded-md bg-primary/5 text-center">
                          <p className="text-xs text-muted-foreground">ROI</p>
                          <p className="text-sm font-medium text-primary-foreground">{study.metrics.roi}</p>
                        </div>
                        <div className="p-2 rounded-md bg-primary/5 text-center">
                          <p className="text-xs text-muted-foreground">Appreciation</p>
                          <p className="text-sm font-medium text-primary-foreground">{study.metrics.appreciation}</p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button>
                          <FileText className="mr-2 h-4 w-4" />
                          View Full Case Study
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
                  <Award className="mr-2 h-5 w-5 text-primary" />
                  Submit Your Success Story
                </CardTitle>
                <CardDescription>Share your veteran real estate investing journey with the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    We're always looking for inspiring stories from veteran real estate investors. Share your journey,
                    strategies, and results to help other veterans succeed in real estate investing.
                  </p>
                  <div className="flex justify-center">
                    <Button>
                      <FileText className="mr-2 h-4 w-4" />
                      Submit Your Story
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary-foreground mb-2">Video Interviews</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Watch in-depth interviews with successful veteran real estate investors.
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Videos
                  </Button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary-foreground mb-2">E-Books & Guides</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Download free e-books and guides written by and for veteran real estate investors.
                  </p>
                  <Button size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Resources
                  </Button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary-foreground mb-2">Podcasts</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Listen to podcasts featuring veteran real estate investors sharing their experiences.
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Listen Now
                  </Button>
                </div>
              </motion.div>
            </div>

            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Recommended Books
                </CardTitle>
                <CardDescription>Top books for veteran real estate investors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-lg border border-border bg-card/50">
                    <div className="w-16 h-24 bg-muted rounded mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-primary-foreground">Military to Millionaire</h4>
                      <p className="text-xs text-muted-foreground">By David Pere</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        A comprehensive guide to real estate investing for military members and veterans.
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">(128 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg border border-border bg-card/50">
                    <div className="w-16 h-24 bg-muted rounded mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-primary-foreground">From Service to Success</h4>
                      <p className="text-xs text-muted-foreground">By Mark Dolfini</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        How to leverage military experience for success in real estate investing.
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">(96 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg border border-border bg-card/50">
                    <div className="w-16 h-24 bg-muted rounded mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-primary-foreground">VA Loan Mastery</h4>
                      <p className="text-xs text-muted-foreground">By John Smith</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        The ultimate guide to maximizing VA loan benefits for real estate investing.
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">(112 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {showStoryDetails && <SuccessStoryModal onClose={() => setShowStoryDetails(false)} />}
    </div>
  )
}

function SuccessStoryModal({ onClose }: { onClose: () => void }) {
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
            alt="James Wilson Success Story"
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
              Featured Story
            </Badge>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              From Military Service to Real Estate Empire
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src="/placeholder.svg?height=100&width=100" alt="James Wilson" />
              <AvatarFallback>JW</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-primary-foreground">James Wilson</h3>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Army Veteran
                </Badge>
                <span className="text-xs text-muted-foreground">10 years investing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-primary/5 text-center">
              <Building className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Properties</p>
              <p className="text-lg font-medium text-primary-foreground">42</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 text-center">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Annual Income</p>
              <p className="text-lg font-medium text-primary-foreground">$380,000</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 text-center">
              <Award className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="text-lg font-medium text-primary-foreground">$6.2M</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">My Story</h3>
              <p className="text-muted-foreground">
                After serving 8 years in the Army, I transitioned to civilian life with a clear goal: to build wealth
                through real estate investing. I started with absolutely nothing except my VA loan benefit and a
                determination to succeed.
              </p>
              <p className="text-muted-foreground mt-2">
                My first property was a duplex in San Antonio that I purchased with my VA loan. I lived in one unit and
                rented out the other, which covered most of my mortgage payment. This strategy, known as house hacking,
                allowed me to live almost for free while building equity.
              </p>
              <p className="text-muted-foreground mt-2">
                After a year, I moved out and rented both units, then used my remaining VA loan entitlement to purchase
                a 4-unit property. I repeated this process, eventually transitioning to conventional financing as my
                portfolio and income grew.
              </p>
              <p className="text-muted-foreground mt-2">
                Today, 10 years later, I own 42 units across multiple properties, generating over $380,000 in annual
                rental income. The skills I learned in the military—discipline, leadership, and strategic thinking—have
                been invaluable in my real estate journey.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Key Strategies</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Started with house hacking using VA loans with no money down
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Focused on multi-unit properties to maximize cash flow and returns
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Implemented the BRRRR strategy (Buy, Rehab, Rent, Refinance, Repeat)
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Built a reliable team of property managers, contractors, and real estate agents
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">Reinvested profits to accelerate portfolio growth</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Advice for Veterans</h3>
              <p className="text-muted-foreground">
                If you're a veteran looking to get started in real estate investing, here's my advice:
              </p>
              <ul className="space-y-2 mt-2">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Use your VA loan benefit strategically—it's one of the most powerful tools you have
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Start with house hacking to minimize living expenses while building your first asset
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Connect with other veteran investors for support, advice, and potential partnerships
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Apply the discipline and leadership skills you learned in the military to your real estate business
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Don't be afraid to start small—everyone begins somewhere
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </Button>
              <span className="text-xs text-muted-foreground mr-2">128</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
              <span className="text-xs text-muted-foreground mr-2">24</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
