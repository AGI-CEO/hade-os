"use client";

import { useEffect, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import {
  Building,
  DollarSign,
  Bed,
  Bath,
  Calendar,
  User,
  ImageIcon,
} from "lucide-react";
import { PropertyImageManager } from "@/components/properties/PropertyImageManager";
import { FinancialsDashboard } from "@/components/financials/FinancialsDashboard";

// Define the Property type to include images
type PropertyImage = {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
};

type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  value: number;
  occupancy: string;
  rentAmount: number | null;
  dateAdded: string;
  propertyImages: PropertyImage[];
};

export default function PropertyDetailPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropertyData = useCallback(() => {
    // We can set a soft loading state if we want visual feedback on refetch
    fetch(`/api/properties/${params.propertyId}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Property not found");
          }
          throw new Error("Failed to fetch property details");
        }
        return res.json();
      })
      .then((data) => {
        setProperty(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false); // Only stop full page loading on initial fetch
      });
  }, [params.propertyId]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading property details...</div>
      </div>
    );
  }

  if (error === "Property not found") {
    notFound();
  }

  if (error || !property) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">
          Error loading property. Please try again later.
        </div>
      </div>
    );
  }

  const primaryImage =
    property.propertyImages?.find((img) => img.isPrimary)?.imageUrl ||
    "/house-placeholder.svg";

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">{property.address}</h1>
          <p className="text-lg text-muted-foreground">
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg text-primary font-bold text-2xl">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(property.value)}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Gallery & Management */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyImageManager
            propertyId={property.id}
            images={property.propertyImages || []}
            onImageUpdate={fetchPropertyData}
          />
        </div>

        {/* Right Column: Property Details */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <DollarSign className="mr-3 h-5 w-5 text-primary" />
                <span>
                  Rent:{" "}
                  <span className="font-semibold">
                    {property.rentAmount
                      ? `${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(property.rentAmount)}/mo`
                      : "N/A"}
                  </span>
                </span>
              </li>
              <li className="flex items-center">
                <User className="mr-3 h-5 w-5 text-primary" />
                <span>
                  Occupancy:{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full text-xs ${
                      property.occupancy === "occupied"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {property.occupancy}
                  </span>
                </span>
              </li>
              <li className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                <span>
                  Date Added:{" "}
                  <span className="font-semibold">
                    {new Date(property.dateAdded).toLocaleDateString()}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Financials Section */}
      <div>
        <FinancialsDashboard propertyId={property.id} />
      </div>
    </div>
  );
}
