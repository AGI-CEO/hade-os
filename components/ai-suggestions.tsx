"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  MapPin,
  DollarSign,
  BarChart2,
  ArrowRight,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample property suggestions
const propertySuggestions = [
  {
    id: 1,
    address: "123 Main St, Austin, TX",
    price: 425000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    image: "/house-placeholder.svg",
    dealScore: 85,
    cashFlow: 450,
    capRate: 6.2,
    cashOnCash: 8.5,
    appreciationPotential: "High",
    neighborhood: "Central Austin",
    propertyType: "Single Family",
    yearBuilt: 2005,
    favorite: false,
  },
  {
    id: 2,
    address: "456 Oak Ave, Houston, TX",
    price: 320000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    image: "/house-placeholder.svg",
    dealScore: 78,
    cashFlow: 380,
    capRate: 6.8,
    cashOnCash: 9.2,
    appreciationPotential: "Medium",
    neighborhood: "Spring Branch",
    propertyType: "Single Family",
    yearBuilt: 1998,
    favorite: true,
  },
  {
    id: 3,
    address: "789 Pine Blvd, San Antonio, TX",
    price: 275000,
    beds: 3,
    baths: 1,
    sqft: 1450,
    image: "/house-placeholder.svg",
    dealScore: 82,
    cashFlow: 350,
    capRate: 7.1,
    cashOnCash: 9.8,
    appreciationPotential: "Medium",
    neighborhood: "Alamo Heights",
    propertyType: "Single Family",
    yearBuilt: 1985,
    favorite: false,
  },
  {
    id: 4,
    address: "101 Cedar St, Austin, TX",
    price: 510000,
    beds: 4,
    baths: 3,
    sqft: 2200,
    image: "/house-placeholder.svg",
    dealScore: 75,
    cashFlow: 420,
    capRate: 5.8,
    cashOnCash: 7.5,
    appreciationPotential: "Very High",
    neighborhood: "South Austin",
    propertyType: "Single Family",
    yearBuilt: 2012,
    favorite: false,
  },
];

type AISuggestionsProps = {
  searchCriteria: {
    location: string;
    priceRange: string;
    propertyType: string;
    bedrooms: string;
    cashFlow: string;
    capRate: string;
  };
  setShowPropertyDetails: (show: boolean) => void;
};

export function AISuggestions({
  searchCriteria,
  setShowPropertyDetails,
}: AISuggestionsProps) {
  const [favorites, setFavorites] = useState<number[]>(
    propertySuggestions.filter((p) => p.favorite).map((p) => p.id)
  );

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-primary-foreground">
                AI-Powered Recommendations
              </h3>
              <p className="text-xs text-muted-foreground">
                Based on your search criteria and investment goals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-border bg-card/30">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-primary-foreground">
                {searchCriteria.location}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/30">
              <p className="text-xs text-muted-foreground">Price Range</p>
              <p className="text-sm font-medium text-primary-foreground">
                {searchCriteria.priceRange}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/30">
              <p className="text-xs text-muted-foreground">Property Type</p>
              <p className="text-sm font-medium text-primary-foreground">
                {searchCriteria.propertyType}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/30">
              <p className="text-xs text-muted-foreground">Bedrooms</p>
              <p className="text-sm font-medium text-primary-foreground">
                {searchCriteria.bedrooms}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/30">
              <p className="text-xs text-muted-foreground">Min. Cash Flow</p>
              <p className="text-sm font-medium text-primary-foreground">
                {searchCriteria.cashFlow}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/30">
              <p className="text-xs text-muted-foreground">Min. Cap Rate</p>
              <p className="text-sm font-medium text-primary-foreground">
                {searchCriteria.capRate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {propertySuggestions.map((property) => (
          <motion.div
            key={property.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-border bg-card/50 overflow-hidden cursor-pointer"
            onClick={() => setShowPropertyDetails(true)}
          >
            <div className="relative h-48">
              <img
                src={property.image || "/house-placeholder.svg"}
                alt={property.address}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => toggleFavorite(property.id, e)}
                >
                  <Star
                    className={`h-4 w-4 ${
                      favorites.includes(property.id)
                        ? "fill-amber-500 text-amber-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-primary mb-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Deal Score: {property.dealScore}
                </Badge>
                <div className="text-white text-lg font-bold drop-shadow-md">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-primary-foreground">
                    {property.address}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{property.beds} bed</span>
                    <span className="mx-1">•</span>
                    <span>{property.baths} bath</span>
                    <span className="mx-1">•</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                    <span className="mx-1">•</span>
                    <span>Built {property.yearBuilt}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {property.propertyType}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 rounded-lg border border-border bg-card/30">
                  <p className="text-xs text-muted-foreground">Cash Flow</p>
                  <p className="text-sm font-medium text-green-500">
                    ${property.cashFlow}/mo
                  </p>
                </div>
                <div className="p-2 rounded-lg border border-border bg-card/30">
                  <p className="text-xs text-muted-foreground">Cap Rate</p>
                  <p className="text-sm font-medium text-primary-foreground">
                    {property.capRate}%
                  </p>
                </div>
                <div className="p-2 rounded-lg border border-border bg-card/30">
                  <p className="text-xs text-muted-foreground">CoC Return</p>
                  <p className="text-sm font-medium text-primary-foreground">
                    {property.cashOnCash}%
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Why These Properties?
          </CardTitle>
          <CardDescription>
            AI insights on your recommended properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground">
                  Cash Flow Potential
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                These properties were selected because they all meet or exceed
                your minimum cash flow requirement of $200/month. The Austin and
                Houston markets currently offer strong rental demand relative to
                purchase prices.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground">
                  Appreciation Potential
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Properties in Austin have shown consistent appreciation over the
                past 5 years, with projections indicating continued growth. The
                South Austin neighborhood in particular is experiencing rapid
                development and price increases.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground">
                  Location Analysis
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                These neighborhoods were selected based on their proximity to
                amenities, good school districts, and low crime rates. The
                Central Austin and Alamo Heights areas in particular offer
                excellent rental demand due to their desirable locations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
