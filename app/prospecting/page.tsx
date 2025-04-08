"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Star,
  Building,
  BarChart2,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  Save,
  Home,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AISuggestions } from "@/components/ai-suggestions";
import { PropertyValuation } from "@/components/property-valuation";
import { CashFlowAnalyzer } from "@/components/cash-flow-analyzer";

export default function ProspectingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [priceRange, setPriceRange] = useState([100000, 500000]);
  const [cashFlowMin, setCashFlowMin] = useState(200);
  const [capRateMin, setCapRateMin] = useState(5);

  // Sample search criteria
  const searchCriteria = {
    location: "Austin, TX",
    priceRange: `$${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`,
    propertyType: "Single Family",
    bedrooms: "3+",
    cashFlow: `$${cashFlowMin}+`,
    capRate: `${capRateMin}%+`,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Prospecting
        </h1>
        <p className="text-muted-foreground">
          Discover and analyze potential real estate investment opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI-Powered</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">
                Suggestions
              </h2>
              <p className="text-sm text-muted-foreground">
                Personalized for your goals
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart2 className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Analysis</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">
                Insights
              </h2>
              <p className="text-sm text-muted-foreground">
                Trends and opportunities
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deal Score</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">
                Analysis
              </h2>
              <p className="text-sm text-muted-foreground">
                Find the best investments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address, city, or zip code..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            Map View
          </Button>
          <Button variant="outline" size="sm">
            <Star className="mr-2 h-4 w-4" />
            Saved
          </Button>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary-foreground">
            Search Criteria
          </CardTitle>
          <CardDescription>Customize your property search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City, State, or Zip"
                  className="pl-9 bg-card border-border"
                  defaultValue="Austin, TX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Property Type
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Single Family</span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Single Family</DropdownMenuItem>
                  <DropdownMenuItem>Multi-Family</DropdownMenuItem>
                  <DropdownMenuItem>Condo/Townhouse</DropdownMenuItem>
                  <DropdownMenuItem>Commercial</DropdownMenuItem>
                  <DropdownMenuItem>Land</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Bedrooms
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>3+ Bedrooms</span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Any</DropdownMenuItem>
                  <DropdownMenuItem>1+</DropdownMenuItem>
                  <DropdownMenuItem>2+</DropdownMenuItem>
                  <DropdownMenuItem>3+</DropdownMenuItem>
                  <DropdownMenuItem>4+</DropdownMenuItem>
                  <DropdownMenuItem>5+</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="price-range">Price Range</label>
                <span className="text-primary-foreground">
                  ${priceRange[0].toLocaleString()} - $
                  {priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                id="price-range"
                min={50000}
                max={2000000}
                step={10000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                className="[&>span]:bg-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label htmlFor="cash-flow">Minimum Monthly Cash Flow</label>
                  <span className="text-primary-foreground">
                    ${cashFlowMin}
                  </span>
                </div>
                <Slider
                  id="cash-flow"
                  min={0}
                  max={2000}
                  step={50}
                  value={[cashFlowMin]}
                  onValueChange={(value) => setCashFlowMin(value[0])}
                  className="[&>span]:bg-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label htmlFor="cap-rate">Minimum Cap Rate</label>
                  <span className="text-primary-foreground">{capRateMin}%</span>
                </div>
                <Slider
                  id="cap-rate"
                  min={0}
                  max={15}
                  step={0.5}
                  value={[capRateMin]}
                  onValueChange={(value) => setCapRateMin(value[0])}
                  className="[&>span]:bg-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Search
            </Button>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search Properties
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="suggestions">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="valuation">
            <Building className="mr-2 h-4 w-4" />
            Valuation
          </TabsTrigger>
          <TabsTrigger value="cash-flow">
            <BarChart2 className="mr-2 h-4 w-4" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="suggestions" className="mt-0">
                <AISuggestions
                  searchCriteria={searchCriteria}
                  setShowPropertyDetails={setShowPropertyDetails}
                />
              </TabsContent>
            </motion.div>

            <motion.div
              key="valuation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="valuation" className="mt-0">
                <PropertyValuation />
              </TabsContent>
            </motion.div>

            <motion.div
              key="cash-flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="cash-flow" className="mt-0">
                <CashFlowAnalyzer />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Compass className="mr-2 h-5 w-5 text-primary" />
            Market Insights
          </CardTitle>
          <CardDescription>
            Current trends in your target markets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-primary-foreground">
                  Austin, TX
                </h3>
                <Badge className="bg-green-500">Hot Market</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Median Price</span>
                  <span className="text-primary-foreground">$450,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    YoY Appreciation
                  </span>
                  <span className="text-green-500">+8.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Rent (3BR)</span>
                  <span className="text-primary-foreground">$2,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Cap Rate</span>
                  <span className="text-primary-foreground">5.8%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-primary-foreground">
                  Houston, TX
                </h3>
                <Badge className="bg-green-500">Rising</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Median Price</span>
                  <span className="text-primary-foreground">$320,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    YoY Appreciation
                  </span>
                  <span className="text-green-500">+6.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Rent (3BR)</span>
                  <span className="text-primary-foreground">$1,850</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Cap Rate</span>
                  <span className="text-primary-foreground">6.2%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-primary-foreground">
                  San Antonio, TX
                </h3>
                <Badge className="bg-amber-500">Stable</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Median Price</span>
                  <span className="text-primary-foreground">$280,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    YoY Appreciation
                  </span>
                  <span className="text-green-500">+5.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Rent (3BR)</span>
                  <span className="text-primary-foreground">$1,650</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Cap Rate</span>
                  <span className="text-primary-foreground">6.8%</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <ArrowRight className="mr-2 h-4 w-4" />
            View Full Market Report
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showPropertyDetails && (
          <PropertyDetailsModal onClose={() => setShowPropertyDetails(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyDetailsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");

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
            src="/house-placeholder.svg"
            alt="123 Main St, Austin, TX"
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <ArrowRight className="h-4 w-4 rotate-45" />
          </Button>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-green-500 mb-2">
              <Zap className="h-3 w-3 mr-1" />
              Deal Score: 85
            </Badge>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              123 Main St, Austin, TX
            </h2>
            <p className="text-white drop-shadow-md">
              $425,000 • 3 bed • 2 bath • 1,850 sqft
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="text-sm text-muted-foreground mb-1">
                Estimated Cash Flow
              </h3>
              <div className="text-2xl font-bold text-green-500">$450/mo</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on current market rents
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="text-sm text-muted-foreground mb-1">Cap Rate</h3>
              <div className="text-2xl font-bold text-primary-foreground">
                6.2%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Above market average
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="text-sm text-muted-foreground mb-1">
                Cash on Cash Return
              </h3>
              <div className="text-2xl font-bold text-primary-foreground">
                8.5%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                With 20% down payment
              </p>
            </div>
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
              variant={activeTab === "financials" ? "default" : "outline"}
              onClick={() => setActiveTab("financials")}
              className="flex-1"
            >
              Financials
            </Button>
            <Button
              variant={activeTab === "market" ? "default" : "outline"}
              onClick={() => setActiveTab("market")}
              className="flex-1"
            >
              Market
            </Button>
            <Button
              variant={activeTab === "ai-analysis" ? "default" : "outline"}
              onClick={() => setActiveTab("ai-analysis")}
              className="flex-1"
            >
              AI Analysis
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-primary-foreground mb-2">
                          Property Details
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-lg border border-border bg-card/50">
                            <p className="text-xs text-muted-foreground">
                              Property Type
                            </p>
                            <p className="text-sm font-medium text-primary-foreground">
                              Single Family
                            </p>
                          </div>
                          <div className="p-3 rounded-lg border border-border bg-card/50">
                            <p className="text-xs text-muted-foreground">
                              Year Built
                            </p>
                            <p className="text-sm font-medium text-primary-foreground">
                              2005
                            </p>
                          </div>
                          <div className="p-3 rounded-lg border border-border bg-card/50">
                            <p className="text-xs text-muted-foreground">
                              Lot Size
                            </p>
                            <p className="text-sm font-medium text-primary-foreground">
                              0.25 acres
                            </p>
                          </div>
                          <div className="p-3 rounded-lg border border-border bg-card/50">
                            <p className="text-xs text-muted-foreground">
                              Square Feet
                            </p>
                            <p className="text-sm font-medium text-primary-foreground">
                              1,850
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-primary-foreground mb-2">
                          Features
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                            <span className="text-muted-foreground">
                              Recently renovated kitchen
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                            <span className="text-muted-foreground">
                              New HVAC system (2022)
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                            <span className="text-muted-foreground">
                              Fenced backyard
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                            <span className="text-muted-foreground">
                              Two-car garage
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                            <span className="text-muted-foreground">
                              Close to schools and shopping
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-primary-foreground mb-2">
                          Location
                        </h3>
                        <div className="h-40 rounded-lg border border-border bg-card/50 flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                          <span className="ml-2 text-muted-foreground">
                            Map View
                          </span>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              School District
                            </span>
                            <span className="text-primary-foreground">
                              Austin ISD
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Walk Score
                            </span>
                            <span className="text-primary-foreground">
                              72/100
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Crime Rate
                            </span>
                            <span className="text-primary-foreground">Low</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-primary-foreground mb-2">
                          Property History
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Last Sold
                            </span>
                            <span className="text-primary-foreground">
                              Jun 2018 for $375,000
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Price Change
                            </span>
                            <span className="text-green-500">
                              +13.3% ($50,000)
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Days on Market
                            </span>
                            <span className="text-primary-foreground">15</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "financials" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-2">
                        Income
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Estimated Monthly Rent
                          </span>
                          <span className="text-primary-foreground">
                            $2,200
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Other Income
                          </span>
                          <span className="text-primary-foreground">$0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Vacancy Loss (5%)
                          </span>
                          <span className="text-red-500">-$110</span>
                        </div>
                        <div className="border-t border-border my-2"></div>
                        <div className="flex justify-between font-medium">
                          <span className="text-primary-foreground">
                            Effective Income
                          </span>
                          <span className="text-primary-foreground">
                            $2,090
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-2">
                        Expenses
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Mortgage (5%, 30yr, 20% down)
                          </span>
                          <span className="text-red-500">-$1,370</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Property Tax
                          </span>
                          <span className="text-red-500">-$350</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Insurance
                          </span>
                          <span className="text-red-500">-$120</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Maintenance
                          </span>
                          <span className="text-red-500">-$150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Property Management
                          </span>
                          <span className="text-red-500">-$176</span>
                        </div>
                        <div className="border-t border-border my-2"></div>
                        <div className="flex justify-between font-medium">
                          <span className="text-primary-foreground">
                            Total Expenses
                          </span>
                          <span className="text-red-500">-$2,166</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-primary-foreground">
                        Monthly Cash Flow
                      </h3>
                      <span className="text-xl font-bold text-green-500">
                        $450
                      </span>
                    </div>
                    <Progress
                      value={65}
                      className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-green-500"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This property ranks in the top 35% for cash flow in this
                      area
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-card/50">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Cap Rate
                      </h3>
                      <div className="text-xl font-bold text-primary-foreground">
                        6.2%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Market average: 5.8%
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card/50">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Cash on Cash Return
                      </h3>
                      <div className="text-xl font-bold text-primary-foreground">
                        8.5%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on 20% down payment
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card/50">
                      <h3 className="text-sm text-muted-foreground mb-1">
                        Break-even Ratio
                      </h3>
                      <div className="text-xl font-bold text-primary-foreground">
                        78%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lower is better (expenses/income)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "market" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-2">
                        Market Trends
                      </h3>
                      <div className="h-40 rounded-lg border border-border bg-card/50 flex items-center justify-center">
                        <BarChart2 className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">
                          Price Trend Chart
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            1-Year Appreciation
                          </span>
                          <span className="text-green-500">+8.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            5-Year Forecast
                          </span>
                          <span className="text-green-500">+24.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Median Days on Market
                          </span>
                          <span className="text-primary-foreground">
                            18 days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-2">
                        Rental Market
                      </h3>
                      <div className="h-40 rounded-lg border border-border bg-card/50 flex items-center justify-center">
                        <BarChart2 className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">
                          Rent Trend Chart
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            1-Year Rent Growth
                          </span>
                          <span className="text-green-500">+5.3%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Vacancy Rate
                          </span>
                          <span className="text-primary-foreground">3.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Rent-to-Price Ratio
                          </span>
                          <span className="text-primary-foreground">0.62%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-primary-foreground mb-2">
                      Comparable Properties
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src="/house-placeholder.svg"
                              alt="Comparable property"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-foreground">
                              456 Oak St
                            </h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>$430,000</span>
                              <span className="mx-2">•</span>
                              <span>3 bed, 2 bath</span>
                              <span className="mx-2">•</span>
                              <span>1,900 sqft</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">0.3 miles away</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src="/house-placeholder.svg"
                              alt="Comparable property"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-foreground">
                              789 Elm St
                            </h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>$415,000</span>
                              <span className="mx-2">•</span>
                              <span>3 bed, 2 bath</span>
                              <span className="mx-2">•</span>
                              <span>1,780 sqft</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">0.5 miles away</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src="/house-placeholder.svg"
                              alt="Comparable property"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-foreground">
                              321 Pine St
                            </h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>$440,000</span>
                              <span className="mx-2">•</span>
                              <span>4 bed, 2 bath</span>
                              <span className="mx-2">•</span>
                              <span>2,100 sqft</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">0.7 miles away</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ai-analysis" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-foreground">
                          AI Investment Analysis
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Personalized insights for your investment goals
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Plus className="h-3 w-3 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-primary-foreground">
                            This property offers strong cash flow potential with
                            a projected return above the market average for
                            Austin.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Plus className="h-3 w-3 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-primary-foreground">
                            The neighborhood has shown consistent appreciation
                            over the past 5 years, suggesting good long-term
                            value growth.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Plus className="h-3 w-3 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-primary-foreground">
                            Recent renovations reduce the likelihood of major
                            maintenance expenses in the near term.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="h-3 w-3 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm text-primary-foreground">
                            Property taxes in this area have increased by an
                            average of 6% annually, which could impact future
                            cash flow.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-card/50">
                      <h3 className="font-medium text-primary-foreground mb-2">
                        Deal Score Breakdown
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Cash Flow
                            </span>
                            <span className="text-primary-foreground">
                              90/100
                            </span>
                          </div>
                          <Progress
                            value={90}
                            className="h-1.5 [&>div]:bg-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Appreciation Potential
                            </span>
                            <span className="text-primary-foreground">
                              85/100
                            </span>
                          </div>
                          <Progress
                            value={85}
                            className="h-1.5 [&>div]:bg-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Risk Level
                            </span>
                            <span className="text-primary-foreground">
                              75/100
                            </span>
                          </div>
                          <Progress
                            value={75}
                            className="h-1.5 [&>div]:bg-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Overall Score
                            </span>
                            <span className="text-primary-foreground">
                              85/100
                            </span>
                          </div>
                          <Progress
                            value={85}
                            className="h-1.5 [&>div]:bg-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card/50">
                      <h3 className="font-medium text-primary-foreground mb-2">
                        Investment Strategy Fit
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Buy and Hold
                          </span>
                          <Badge className="bg-green-500">Excellent</Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            BRRRR Strategy
                          </span>
                          <Badge className="bg-amber-500">Good</Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Short-term Rental
                          </span>
                          <Badge className="bg-amber-500">Good</Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Fix and Flip
                          </span>
                          <Badge variant="outline">Fair</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose}>
              Back to Search
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Property
              </Button>
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
