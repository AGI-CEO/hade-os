"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building, BarChart2, Flag, Filter, ArrowUpDown, Grid3X3, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PropertyDashboard } from "@/components/property-dashboard"
import { FinancialProjections } from "@/components/financial-projections"
import { MilestonesGoals } from "@/components/milestones-goals"
import { PortfolioStats } from "@/components/portfolio-stats"
import { PortfolioMap } from "@/components/portfolio-map"

export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "occupied" | "vacant">("all")
  const [sortBy, setSortBy] = useState<"value" | "date" | "name">("value")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Portfolio</h1>
        <p className="text-muted-foreground">Manage your real estate investments and track performance</p>
      </div>

      <PortfolioStats />

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="properties">
                <Building className="mr-2 h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="financials">
                <BarChart2 className="mr-2 h-4 w-4" />
                Financials
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Flag className="mr-2 h-4 w-4" />
                Goals
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {filterStatus === "all" ? "All Properties" : filterStatus === "occupied" ? "Occupied" : "Vacant"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Properties</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("occupied")}>Occupied</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("vacant")}>Vacant</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort by: {sortBy === "value" ? "Value" : sortBy === "date" ? "Date Added" : "Name"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("value")}>Value</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("date")}>Date Added</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                  className="h-8 w-8"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                <TabsContent value="properties" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {viewMode === "grid" ? (
                      <PropertyDashboard filterStatus={filterStatus} sortBy={sortBy} />
                    ) : (
                      <PortfolioMap filterStatus={filterStatus} />
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="financials" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FinancialProjections />
                  </motion.div>
                </TabsContent>

                <TabsContent value="goals" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MilestonesGoals />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
