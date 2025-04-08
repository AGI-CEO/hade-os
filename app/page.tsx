"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PropertyDashboard } from "@/components/property-dashboard"
import { FinancialProjections } from "@/components/financial-projections"
import { MilestonesGoals } from "@/components/milestones-goals"
import { AchievementsBadges } from "@/components/achievements-badges"
import { MarketInsights } from "@/components/market-insights"
import { Home, BarChart2, Flag, Award, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "properties" | "financials" | "goals" | "achievements" | "insights"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("properties")

  const tabs = [
    { id: "properties", label: "Properties", icon: Home },
    { id: "financials", label: "Financials", icon: BarChart2 },
    { id: "goals", label: "Goals", icon: Flag },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "insights", label: "Insights", icon: Compass },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Dashboard</h1>
        <p className="text-muted-foreground">Manage your real estate portfolio and track your progress</p>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "relative flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all text-white",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
              )}
            >
              <tab.icon className={cn("h-5 w-5", activeTab === tab.id && "glow-icon")} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {activeTab === "properties" && <PropertyDashboard />}
            {activeTab === "financials" && <FinancialProjections />}
            {activeTab === "goals" && <MilestonesGoals />}
            {activeTab === "achievements" && <AchievementsBadges />}
            {activeTab === "insights" && <MarketInsights />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
