"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PropertyDashboard } from "@/components/property-dashboard"
import { FinancialProjections } from "@/components/financial-projections"
import { MilestonesGoals } from "@/components/milestones-goals"
import { AchievementsBadges } from "@/components/achievements-badges"
import { MarketInsights } from "@/components/market-insights"
import { Home, BarChart2, Flag, Award, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("properties")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your real estate command center
        </p>
      </div>

      <Tabs defaultValue="properties" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 h-auto">
          <TabsTrigger value="properties" className="flex flex-col py-2 h-auto">
            <Home className="h-4 w-4 mb-1" />
            <span className="text-xs">Properties</span>
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex flex-col py-2 h-auto">
            <BarChart2 className="h-4 w-4 mb-1" />
            <span className="text-xs">Projections</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex flex-col py-2 h-auto">
            <Flag className="h-4 w-4 mb-1" />
            <span className="text-xs">Milestones</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex flex-col py-2 h-auto">
            <Award className="h-4 w-4 mb-1" />
            <span className="text-xs">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex flex-col py-2 h-auto">
            <Compass className="h-4 w-4 mb-1" />
            <span className="text-xs">Market</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="properties" className="space-y-4">
              <PropertyDashboard />
            </TabsContent>

            <TabsContent value="projections" className="space-y-4">
              <FinancialProjections />
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <MilestonesGoals />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <AchievementsBadges />
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <MarketInsights />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
