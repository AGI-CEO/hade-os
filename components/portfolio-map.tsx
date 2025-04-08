"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

// Sample property data
const properties = [
  {
    id: 1,
    address: "123 Main St, Austin, TX",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%201-2A4jS3pKxw2ZYNnZw1suipKoGBkriL.jpeg",
    value: 450000,
    occupancy: "occupied",
    rentAmount: 2200,
    lat: 30.2672,
    lng: -97.7431,
  },
  {
    id: 2,
    address: "456 Oak Ave, San Antonio, TX",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house2-jcDyCtfDDcUMusg6iM6KDVh2JwqXri.webp",
    value: 1250000,
    occupancy: "vacant",
    rentAmount: 0,
    lat: 29.4241,
    lng: -98.4936,
  },
  {
    id: 3,
    address: "789 Pine Blvd, Houston, TX",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house3-4j1H5hKH2a7fRUYyOCfp5CHZ1OwBxU.webp",
    value: 510000,
    occupancy: "occupied",
    rentAmount: 2500,
    lat: 29.7604,
    lng: -95.3698,
  },
];

type PortfolioMapProps = {
  filterStatus?: "all" | "occupied" | "vacant";
};

export function PortfolioMap({ filterStatus = "all" }: PortfolioMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const filteredProperties = properties.filter((property) => {
    if (filterStatus === "all") return true;
    return property.occupancy === filterStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const property = selectedProperty
    ? properties.find((p) => p.id === selectedProperty)
    : null;

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div className="h-[600px] rounded-lg border border-border bg-card/30 overflow-hidden">
        {!isMapLoaded ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="h-full relative bg-[#0A0A0A] p-4">
            {/* Map placeholder with futuristic grid lines */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover opacity-20"></div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>

            {/* Property pins */}
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${((property.lng + 100) / 10) * 100}%`,
                  top: `${((property.lat + 100) / 10) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    property.occupancy === "occupied"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-current rounded-full animate-ping" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Property info card */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-4 right-4 w-80"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {property && (
                <div className="relative">
                  <div className="relative h-32">
                    <img
                      src={property.image || "/house-placeholder.svg"}
                      alt={property.address}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-lg" />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        property.occupancy === "occupied"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {property.occupancy === "occupied"
                        ? "Occupied"
                        : "Vacant"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 h-8 w-8 bg-black/50 hover:bg-black/70"
                      onClick={() => setSelectedProperty(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-primary-foreground mb-1">
                      {property.address}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary glow-text">
                        {formatCurrency(property.value)}
                      </span>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
