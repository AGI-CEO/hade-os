"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gift,
  Star,
  Trophy,
  Tag,
  X,
  Check,
  Filter,
  Search,
  Info,
  BarChart3,
  BookOpen,
  HeartHandshake,
  Users,
  Building,
  FileCheck,
  Video,
  Clipboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Update the rewards data to include icon information
const rewards = [
  {
    id: 1,
    name: "Premium Analytics",
    description: "Unlock advanced analytics and reporting features for 1 month",
    category: "digital",
    points: 500,
    icon: "analytics",
    featured: true,
  },
  {
    id: 2,
    name: "Property Management Book",
    description: "Digital copy of 'Advanced Property Management Strategies'",
    category: "digital",
    points: 300,
    icon: "book",
    featured: false,
  },
  {
    id: 3,
    name: "Tax Consultation",
    description: "30-minute consultation with a real estate tax expert",
    category: "service",
    points: 1000,
    icon: "consultation",
    featured: true,
  },
  {
    id: 4,
    name: "Investor Community Access",
    description: "1-month access to exclusive investor community",
    category: "membership",
    points: 750,
    icon: "community",
    featured: false,
  },
  {
    id: 5,
    name: "Property Listing Boost",
    description: "Featured listing for your rental property for 2 weeks",
    category: "service",
    points: 600,
    icon: "property",
    featured: false,
  },
  {
    id: 6,
    name: "Tenant Screening Credit",
    description: "5 free tenant screening reports",
    category: "service",
    points: 400,
    icon: "screening",
    featured: true,
  },
  {
    id: 7,
    name: "Real Estate Webinar Access",
    description: "Access to exclusive webinar on market trends",
    category: "digital",
    points: 250,
    icon: "webinar",
    featured: false,
  },
  {
    id: 8,
    name: "Property Inspection Tool",
    description: "Digital property inspection checklist and tool",
    category: "digital",
    points: 350,
    icon: "inspection",
    featured: false,
  },
]

// Add a new RewardIcon component to render the appropriate SVG for each reward
const RewardIcon = ({ icon, className = "" }) => {
  const iconSize = "w-full h-full"
  const iconClass = `${iconSize} ${className}`

  switch (icon) {
    case "analytics":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 p-8 rounded-lg">
          <BarChart3 className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "book":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 p-8 rounded-lg">
          <BookOpen className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "consultation":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 p-8 rounded-lg">
          <HeartHandshake className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "community":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-400 to-purple-600 p-8 rounded-lg">
          <Users className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "property":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 p-8 rounded-lg">
          <Building className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "screening":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 p-8 rounded-lg">
          <FileCheck className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "webinar":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-pink-400 to-rose-600 p-8 rounded-lg">
          <Video className={iconClass} strokeWidth={1.5} />
        </div>
      )
    case "inspection":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-teal-400 to-cyan-600 p-8 rounded-lg">
          <Clipboard className={iconClass} strokeWidth={1.5} />
        </div>
      )
    default:
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-400 to-slate-600 p-8 rounded-lg">
          <Gift className={iconClass} strokeWidth={1.5} />
        </div>
      )
  }
}

export function RewardShop() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedReward, setSelectedReward] = useState<number | null>(null)

  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || reward.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const reward = selectedReward ? rewards.find((r) => r.id === selectedReward) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards..."
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
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("digital")}>Digital</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("service")}>Services</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("membership")}>Memberships</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2 bg-card/50 border border-border rounded-md px-3 py-1">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">1,250 points</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRewards.map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-border bg-card/50 overflow-hidden cursor-pointer"
            onClick={() => setSelectedReward(reward.id)}
          >
            <div className="relative h-40">
              <RewardIcon icon={reward.icon} className="text-white" />
              {reward.featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-amber-500">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {reward.category}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-primary-foreground mb-1">{reward.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm font-medium text-amber-500">{reward.points} points</span>
                </div>
                <Button size="sm">Redeem</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-primary-foreground">How It Works</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary-foreground">Earn Points</h4>
                <p className="text-sm text-muted-foreground">
                  Complete challenges and achievements to earn Quest Points
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary-foreground">Redeem Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Use your points to redeem exclusive rewards and benefits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary-foreground">Special Offers</h4>
                <p className="text-sm text-muted-foreground">Look out for limited-time offers and featured rewards</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View Reward History
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedReward && (
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
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
            >
              {reward && (
                <>
                  <div className="relative h-48">
                    <RewardIcon icon={reward.icon} className="text-white" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setSelectedReward(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {reward.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-primary-foreground mb-2">{reward.name}</h2>
                    <p className="text-muted-foreground mb-4">{reward.description}</p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                        <span className="text-lg font-bold text-amber-500">{reward.points} points</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-4 w-4 mr-1" />
                        <span>Your balance: 1,250</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 rounded-lg border border-border bg-card/50">
                        <h4 className="font-medium text-primary-foreground mb-1">Redemption Details</h4>
                        <p className="text-sm text-muted-foreground">
                          This reward will be delivered to your email within 24 hours of redemption.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border bg-card/50">
                        <h4 className="font-medium text-primary-foreground mb-1">Terms & Conditions</h4>
                        <p className="text-sm text-muted-foreground">
                          Reward must be used within 30 days of redemption. No refunds on redeemed points.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" className="flex-1" onClick={() => setSelectedReward(null)}>
                        Cancel
                      </Button>
                      <Button className="flex-1">
                        <Check className="mr-2 h-4 w-4" />
                        Confirm Redemption
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
