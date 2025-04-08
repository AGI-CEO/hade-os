"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertCircle, MapPin, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample market insights data
const insights = [
  {
    id: 1,
    title: "Austin market heating up",
    description: "Property values expected to rise 8% in Q3",
    trend: "up",
    confidence: 85,
    location: "Austin, TX",
    category: "market",
  },
  {
    id: 2,
    title: "Rental demand increasing",
    description: "Vacancy rates down 3% across your portfolio area",
    trend: "up",
    confidence: 92,
    location: "Houston, TX",
    category: "rental",
  },
  {
    id: 3,
    title: "Interest rates may rise",
    description: "Prepare for potential 0.5% increase in Q4",
    trend: "down",
    confidence: 75,
    location: "National",
    category: "finance",
  },
  {
    id: 4,
    title: "New tax incentives",
    description: "Property improvements eligible for additional deductions",
    trend: "up",
    confidence: 88,
    location: "Texas",
    category: "tax",
  },
  {
    id: 5,
    title: "Construction costs stabilizing",
    description: "Material prices expected to decrease by 5% in coming months",
    trend: "up",
    confidence: 80,
    location: "National",
    category: "market",
  },
]

export function MarketInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground glow-text">Market Insights</h2>
          <p className="text-muted-foreground">AI-powered market predictions</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          AI Oracle
        </Badge>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="rental">Rental</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </TabsContent>

        {["market", "rental", "finance", "tax"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {insights
              .filter((insight) => insight.category === category)
              .map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Market Hotspots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-primary-foreground">Austin, TX</span>
                </div>
                <span className="text-green-500 font-medium">+8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-primary-foreground">Houston, TX</span>
                </div>
                <span className="text-green-500 font-medium">+6.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-primary-foreground">Dallas, TX</span>
                </div>
                <span className="text-green-500 font-medium">+5.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Economic Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mortgage Rates</span>
                <div className="flex items-center">
                  <span className="text-primary-foreground font-medium mr-2">6.5%</span>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Inflation</span>
                <div className="flex items-center">
                  <span className="text-primary-foreground font-medium mr-2">3.2%</span>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Housing Inventory</span>
                <div className="flex items-center">
                  <span className="text-primary-foreground font-medium mr-2">Low</span>
                  <TrendingDown className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InsightCard({ insight }: { insight: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="p-6 border border-border rounded-lg bg-card/50 flex items-start"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
          insight.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        }`}
      >
        {insight.trend === "up" ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-primary-foreground">{insight.title}</h3>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
            <span
              className={`${
                insight.confidence > 80 ? "text-green-500" : insight.confidence > 60 ? "text-amber-500" : "text-red-500"
              }`}
            >
              {insight.confidence}% confidence
            </span>
          </div>
        </div>
        <p className="text-muted-foreground mb-3">{insight.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {insight.location}
        </div>
      </div>
    </motion.div>
  )
}
