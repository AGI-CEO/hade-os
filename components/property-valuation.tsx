"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building,
  DollarSign,
  Calculator,
  Home,
  MapPin,
  Calendar,
  ArrowRight,
  Info,
  BarChart2,
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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

export function PropertyValuation() {
  // Property details
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("Single Family");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [squareFeet, setSquareFeet] = useState(1800);
  const [yearBuilt, setYearBuilt] = useState(2000);
  const [lotSize, setLotSize] = useState(0.25);

  // Condition and features
  const [condition, setCondition] = useState(4);
  const [recentRenovation, setRecentRenovation] = useState(false);
  const [hasGarage, setHasGarage] = useState(true);
  const [hasPool, setHasPool] = useState(false);

  // Sample valuation result
  const [showValuation, setShowValuation] = useState(false);
  const valuationResult = {
    estimatedValue: 425000,
    valueRange: [405000, 445000],
    comparableProperties: [
      {
        address: "456 Oak St",
        price: 430000,
        distance: 0.3,
        sqft: 1900,
        beds: 3,
        baths: 2,
      },
      {
        address: "789 Elm St",
        price: 415000,
        distance: 0.5,
        sqft: 1780,
        beds: 3,
        baths: 2,
      },
      {
        address: "321 Pine St",
        price: 440000,
        distance: 0.7,
        sqft: 2100,
        beds: 4,
        baths: 2,
      },
    ],
    marketTrends: [
      { month: "Jan", value: 410000 },
      { month: "Feb", value: 412000 },
      { month: "Mar", value: 415000 },
      { month: "Apr", value: 418000 },
      { month: "May", value: 422000 },
      { month: "Jun", value: 425000 },
    ],
    confidenceScore: 85,
    appreciationForecast: 8.2,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const runValuation = () => {
    setShowValuation(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Building className="mr-2 h-5 w-5 text-primary" />
            Property Valuation Tool
          </CardTitle>
          <CardDescription>
            Get an accurate estimate of a property's market value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                  <Home className="mr-2 h-5 w-5 text-primary" />
                  Property Details
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">
                      Property Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter full address"
                        className="pl-9 bg-card border-border"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Property Type
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-border bg-card text-primary-foreground"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                      >
                        <option>Single Family</option>
                        <option>Multi-Family</option>
                        <option>Condo/Townhouse</option>
                        <option>Commercial</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Year Built
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-9 bg-card border-border"
                          value={yearBuilt}
                          onChange={(e) => setYearBuilt(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Bedrooms
                      </label>
                      <Input
                        type="number"
                        className="bg-card border-border"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Bathrooms
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        className="bg-card border-border"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Square Feet
                      </label>
                      <Input
                        type="number"
                        className="bg-card border-border"
                        value={squareFeet}
                        onChange={(e) => setSquareFeet(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">
                      Lot Size (acres)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      className="bg-card border-border"
                      value={lotSize}
                      onChange={(e) => setLotSize(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-primary" />
                  Condition & Features
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label htmlFor="condition">Property Condition</label>
                      <span className="text-primary-foreground">
                        {condition === 1
                          ? "Poor"
                          : condition === 2
                          ? "Fair"
                          : condition === 3
                          ? "Good"
                          : condition === 4
                          ? "Very Good"
                          : "Excellent"}
                      </span>
                    </div>
                    <Slider
                      id="condition"
                      min={1}
                      max={5}
                      step={1}
                      value={[condition]}
                      onValueChange={(value) => setCondition(value[0])}
                      className="[&>span]:bg-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">
                      Recent Renovations
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={recentRenovation ? "default" : "outline"}
                        onClick={() => setRecentRenovation(true)}
                        className="w-full"
                      >
                        Yes
                      </Button>
                      <Button
                        variant={!recentRenovation ? "default" : "outline"}
                        onClick={() => setRecentRenovation(false)}
                        className="w-full"
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Garage
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={hasGarage ? "default" : "outline"}
                          onClick={() => setHasGarage(true)}
                          className="w-full"
                          size="sm"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!hasGarage ? "default" : "outline"}
                          onClick={() => setHasGarage(false)}
                          className="w-full"
                          size="sm"
                        >
                          No
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">
                        Pool
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={hasPool ? "default" : "outline"}
                          onClick={() => setHasPool(true)}
                          className="w-full"
                          size="sm"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!hasPool ? "default" : "outline"}
                          onClick={() => setHasPool(false)}
                          className="w-full"
                          size="sm"
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Info className="h-3 w-3 mr-1" />
                    <span>
                      Additional features can be added in the detailed valuation
                    </span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={runValuation}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Property Value
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showValuation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Valuation Results
              </CardTitle>
              <CardDescription>
                AI-powered property valuation based on market data and
                comparables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-border bg-card/50 col-span-2">
                  <h3 className="text-sm text-muted-foreground mb-1">
                    Estimated Market Value
                  </h3>
                  <div className="text-3xl font-bold text-primary-foreground glow-text">
                    {formatCurrency(valuationResult.estimatedValue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Value Range: {formatCurrency(valuationResult.valueRange[0])}{" "}
                    - {formatCurrency(valuationResult.valueRange[1])}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Confidence Score
                      </span>
                      <span className="text-primary-foreground">
                        {valuationResult.confidenceScore}%
                      </span>
                    </div>
                    <Progress
                      value={valuationResult.confidenceScore}
                      className="h-1.5 [&>div]:bg-primary"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <h3 className="text-sm text-muted-foreground mb-1">
                    Appreciation Forecast
                  </h3>
                  <div className="text-2xl font-bold text-green-500">
                    +{valuationResult.appreciationForecast}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Projected 1-year growth
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      5-Year Forecast
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground mb-4">
                    Market Trends
                  </h3>
                  <div className="h-64 rounded-lg border border-border bg-card/50 p-4">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Property Value",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="w-full h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={valuationResult.marketTrends}
                          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="month"
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tickFormatter={(value) =>
                              `$${Math.round(value / 1000)}k`
                            }
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-value)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 1 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-primary-foreground mb-4">
                    Comparable Properties
                  </h3>
                  <div className="space-y-3">
                    {valuationResult.comparableProperties.map(
                      (property, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
                        >
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
                                {property.address}
                              </h4>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{formatCurrency(property.price)}</span>
                                <span className="mx-2">•</span>
                                <span>
                                  {property.beds} bed, {property.baths} bath
                                </span>
                                <span className="mx-2">•</span>
                                <span>{property.sqft} sqft</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {property.distance} miles away
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">
                      Valuation Factors
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Key elements influencing this property's value
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="text-primary-foreground">
                          Very High Impact
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
                          Property Size
                        </span>
                        <span className="text-primary-foreground">
                          High Impact
                        </span>
                      </div>
                      <Progress
                        value={80}
                        className="h-1.5 [&>div]:bg-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Property Condition
                        </span>
                        <span className="text-primary-foreground">
                          Medium Impact
                        </span>
                      </div>
                      <Progress
                        value={65}
                        className="h-1.5 [&>div]:bg-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Recent Sales
                        </span>
                        <span className="text-primary-foreground">
                          High Impact
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
                          Market Trends
                        </span>
                        <span className="text-primary-foreground">
                          Medium Impact
                        </span>
                      </div>
                      <Progress
                        value={70}
                        className="h-1.5 [&>div]:bg-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Property Features
                        </span>
                        <span className="text-primary-foreground">
                          Medium Impact
                        </span>
                      </div>
                      <Progress
                        value={60}
                        className="h-1.5 [&>div]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Detailed Report
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Cash Flow Analysis
                  </Button>
                  <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Save Valuation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
