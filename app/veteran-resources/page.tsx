"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Users,
  BookOpen,
  Award,
  Calendar,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  FileText,
  Star,
  ChevronRight,
  Clock,
  Sparkles,
  Heart,
  Building,
  DollarSign,
  Briefcase,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VALoanCalculator } from "@/components/va-loan-calculator"
import { VeteranBenefits } from "@/components/veteran-benefits"
import { VeteranCommunity } from "@/components/veteran-community"
import { VeteranSuccessStories } from "@/components/veteran-success-stories"

export default function VeteranResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResourceDetails, setShowResourceDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("va-loans")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Veteran Resources</h1>
        <p className="text-muted-foreground">Specialized tools and information for veteran real estate investors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VA Loan Benefits</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">0% Down</h2>
              <p className="text-sm text-muted-foreground">No PMI required</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Veteran Community</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">5,280+</h2>
              <p className="text-sm text-muted-foreground">Veteran investors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Specialized Training</p>
              <h2 className="text-lg font-bold text-primary-foreground">Veteran Programs</h2>
              <Button size="sm" variant="outline" className="mt-1">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search veteran resources..."
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
              <DropdownMenuItem>All Resources</DropdownMenuItem>
              <DropdownMenuItem>VA Loans</DropdownMenuItem>
              <DropdownMenuItem>Housing Benefits</DropdownMenuItem>
              <DropdownMenuItem>Training Programs</DropdownMenuItem>
              <DropdownMenuItem>Support Services</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Veteran Support
          </Button>
        </div>
      </div>

      <Tabs defaultValue="va-loans" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="va-loans">
            <Shield className="mr-2 h-4 w-4" />
            VA Loans
          </TabsTrigger>
          <TabsTrigger value="benefits">
            <Award className="mr-2 h-4 w-4" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="mr-2 h-4 w-4" />
            Community
          </TabsTrigger>
          <TabsTrigger value="success">
            <Star className="mr-2 h-4 w-4" />
            Success Stories
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="va-loans" className="mt-0">
            <VALoanCalculator />
          </TabsContent>

          <TabsContent value="benefits" className="mt-0">
            <VeteranBenefits />
          </TabsContent>

          <TabsContent value="community" className="mt-0">
            <VeteranCommunity searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="success" className="mt-0">
            <VeteranSuccessStories />
          </TabsContent>
        </div>
      </Tabs>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Upcoming Veteran Events
          </CardTitle>
          <CardDescription>Connect with fellow veteran investors at these events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-xs text-primary-foreground">MAY</span>
                    <span className="text-lg font-bold text-primary">15</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground">Veteran Real Estate Summit</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn from successful veteran investors and network with peers
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>10:00 AM - 4:00 PM</span>
                      <MapPin className="h-3 w-3 ml-3 mr-1" />
                      <span>Virtual Event</span>
                    </div>
                  </div>
                </div>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  RSVP
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-xs text-primary-foreground">JUN</span>
                    <span className="text-lg font-bold text-primary">08</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground">VA Loan Workshop</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed walkthrough of using VA loans for investment properties
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>1:00 PM - 3:00 PM</span>
                      <MapPin className="h-3 w-3 ml-3 mr-1" />
                      <span>San Diego, CA</span>
                    </div>
                  </div>
                </div>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  RSVP
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-xs text-primary-foreground">JUL</span>
                    <span className="text-lg font-bold text-primary">22</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground">Veteran Investor Networking</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with other veteran real estate investors in your area
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>6:00 PM - 8:00 PM</span>
                      <MapPin className="h-3 w-3 ml-3 mr-1" />
                      <span>Multiple Locations</span>
                    </div>
                  </div>
                </div>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  RSVP
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View All Events
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-primary" />
            Veteran Support Services
          </CardTitle>
          <CardDescription>Resources to help veterans succeed in real estate investing</CardDescription>
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
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground mb-2">VA Home Loan Guide</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Comprehensive guide to understanding and utilizing VA home loans
                </p>
                <Button size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Guide
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
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground mb-2">Career Transition Support</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Resources for veterans transitioning to careers in real estate
                </p>
                <Button size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Explore Resources
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
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground mb-2">Mental Health Resources</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Support services for veterans' mental health and well-being
                </p>
                <Button size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Access Support
                </Button>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {showResourceDetails && <ResourceDetailsModal onClose={() => setShowResourceDetails(false)} />}
    </div>
  )
}

function ResourceDetailsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <div className="relative h-64">
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="VA Loan Investment Strategies"
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
            <Badge className="bg-primary mb-2">
              <Shield className="h-3 w-3 mr-1" />
              Veteran Resource
            </Badge>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">VA Loan Investment Strategies</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Clock className="h-3 w-3 mr-1" />
              Updated 2 weeks ago
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <BookOpen className="h-3 w-3 mr-1" />
              Comprehensive Guide
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-1" />
              4.9 (87 reviews)
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Users className="h-3 w-3 mr-1" />
              1,240 veterans using
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
              variant={activeTab === "strategies" ? "default" : "outline"}
              onClick={() => setActiveTab("strategies")}
              className="flex-1"
            >
              Strategies
            </Button>
            <Button
              variant={activeTab === "resources" ? "default" : "outline"}
              onClick={() => setActiveTab("resources")}
              className="flex-1"
            >
              Resources
            </Button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-2">About This Resource</h3>
                <p className="text-muted-foreground">
                  This comprehensive guide is designed for veterans who want to leverage their VA loan benefits for real
                  estate investing. You'll learn strategies to maximize your benefits while building a successful real
                  estate portfolio.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-2">What You'll Learn</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">How to use VA loans for investment properties</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">House hacking strategies with VA financing</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Navigating VA loan requirements for investment properties
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Combining VA benefits with other investment strategies
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Success stories from veteran real estate investors</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-2">Who This Is For</h3>
                <p className="text-muted-foreground">
                  This resource is ideal for veterans who are interested in using their VA loan benefits to start or
                  expand their real estate investment portfolio. Whether you're a beginner or have some experience, this
                  guide provides valuable insights specific to veterans.
                </p>
              </div>
            </div>
          )}

          {activeTab === "strategies" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-primary-foreground">Strategy 1: House Hacking with VA Loans</h3>
                  <Badge variant="outline">Beginner Friendly</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Purchase a multi-unit property (up to 4 units) with your VA loan, live in one unit, and rent out the
                  others. This allows you to use 0% down payment while generating rental income.
                </p>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-muted-foreground">Potential monthly cash flow: $500-$2,000</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-primary-foreground">Strategy 2: VA Loan Rotation</h3>
                  <Badge variant="outline">Intermediate</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Purchase a property with your VA loan, live in it for the minimum required time (typically 1 year),
                  then rent it out and purchase another property with a new VA loan.
                </p>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 text-primary mr-1" />
                  <span className="text-muted-foreground">Portfolio growth: 1 property every 1-2 years</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-primary-foreground">Strategy 3: VA Loan for Short-Term Rentals</h3>
                  <Badge variant="outline">Advanced</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Purchase a property in a vacation destination with your VA loan, live in it part-time, and rent it out
                  as a short-term rental when you're not using it.
                </p>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-muted-foreground">Potential annual return: 15-25%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-primary-foreground">
                    Strategy 4: Combining VA Loans with Other Financing
                  </h3>
                  <Badge variant="outline">Advanced</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Strategically use VA loans alongside conventional financing, FHA loans, or private money to build a
                  diverse real estate portfolio.
                </p>
                <div className="flex items-center text-sm">
                  <Sparkles className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-muted-foreground">Portfolio diversification strategy</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-primary-foreground">VA Loan Eligibility Checklist</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive checklist to determine your VA loan eligibility and entitlement amount.
                  </p>
                  <Button size="sm">Download PDF</Button>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-primary-foreground">VA Loan Calculator Spreadsheet</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Excel spreadsheet to analyze potential investment properties using VA loan financing.
                  </p>
                  <Button size="sm">Download Spreadsheet</Button>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center mb-2">
                    <ExternalLink className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-primary-foreground">VA Regional Loan Centers</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Directory of VA Regional Loan Centers with contact information and service areas.
                  </p>
                  <Button size="sm">Visit Website</Button>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-primary-foreground">Veteran Investor Network</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect with a community of veteran real estate investors for networking and mentorship.
                  </p>
                  <Button size="sm">Join Network</Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-medium text-primary-foreground mb-3">Recommended Books for Veteran Investors</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-12 h-16 bg-muted rounded mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-primary-foreground">Military to Millionaire</h4>
                      <p className="text-xs text-muted-foreground">
                        A guide to real estate investing for military members and veterans
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-16 bg-muted rounded mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-primary-foreground">VA Loan Mastery</h4>
                      <p className="text-xs text-muted-foreground">
                        Maximizing your VA loan benefits for real estate investing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-16 bg-muted rounded mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-primary-foreground">From Service to Success</h4>
                      <p className="text-xs text-muted-foreground">
                        Transitioning military skills to real estate entrepreneurship
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Access Full Resource
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
