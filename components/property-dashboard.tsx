"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building, Home, MoreHorizontal, Plus, X, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

// Sample property data
const properties = [
  {
    id: 1,
    address: "123 Main St, Austin, TX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%201-2A4jS3pKxw2ZYNnZw1suipKoGBkriL.jpeg",
    value: 450000,
    occupancy: "occupied",
    rentAmount: 2200,
    rentDue: "2023-05-01",
    dateAdded: "2022-01-15",
  },
  {
    id: 2,
    address: "456 Oak Ave, San Antonio, TX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house2-jcDyCtfDDcUMusg6iM6KDVh2JwqXri.webp",
    value: 1250000,
    occupancy: "vacant",
    rentAmount: 0,
    rentDue: null,
    dateAdded: "2022-06-22",
  },
  {
    id: 3,
    address: "789 Pine Blvd, Houston, TX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house3-4j1H5hKH2a7fRUYyOCfp5CHZ1OwBxU.webp",
    value: 510000,
    occupancy: "occupied",
    rentAmount: 2500,
    rentDue: "2023-05-15",
    dateAdded: "2022-11-03",
  },
]

type PropertyDashboardProps = {
  filterStatus?: "all" | "occupied" | "vacant"
  sortBy?: "value" | "date" | "name"
}

export function PropertyDashboard({ filterStatus = "all", sortBy = "value" }: PropertyDashboardProps) {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter properties based on occupancy status
  const filteredProperties = properties.filter((property) => {
    if (filterStatus === "all") return true
    return property.occupancy === filterStatus
  })

  // Sort properties based on selected criteria
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "value") return b.value - a.value
    if (sortBy === "date") return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    return a.address.localeCompare(b.address) // sort by name
  })

  const property = selectedProperty ? properties.find((p) => p.id === selectedProperty) : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {sortedProperties.map((property) => (
          <motion.div
            key={property.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-lg overflow-hidden border border-border bg-card/50 cursor-pointer"
            onClick={() => setSelectedProperty(property.id)}
          >
            <div className="relative h-40">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.address}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <Badge
                className={`absolute top-2 right-2 ${
                  property.occupancy === "occupied" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {property.occupancy === "occupied" ? "Occupied" : "Vacant"}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-primary-foreground truncate">{property.address}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-primary glow-text">{formatCurrency(property.value)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Property</DropdownMenuItem>
                    <DropdownMenuItem>Remove Property</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-lg overflow-hidden border border-dashed border-border bg-card/30 cursor-pointer h-full min-h-[220px] flex flex-col items-center justify-center p-6"
          onClick={() => setIsAddPropertyOpen(true)}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium text-primary-foreground text-center">Add New Property</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">Expand your portfolio with a new investment</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto"
            >
              {property && (
                <>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-primary-foreground">Property Details</h2>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedProperty(null)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <Badge
                        className={`absolute top-2 right-2 ${
                          property.occupancy === "occupied" ? "bg-green-500" : "bg-gray-500"
                        }`}
                      >
                        {property.occupancy === "occupied" ? "Occupied" : "Vacant"}
                      </Badge>
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
                        variant={activeTab === "tenants" ? "default" : "outline"}
                        onClick={() => setActiveTab("tenants")}
                        className="flex-1"
                      >
                        Tenants
                      </Button>
                      <Button
                        variant={activeTab === "financials" ? "default" : "outline"}
                        onClick={() => setActiveTab("financials")}
                        className="flex-1"
                      >
                        Financials
                      </Button>
                      <Button
                        variant={activeTab === "maintenance" ? "default" : "outline"}
                        onClick={() => setActiveTab("maintenance")}
                        className="flex-1"
                      >
                        Maintenance
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
                            <div className="grid grid-cols-2 gap-4">
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">Address</div>
                                  <div className="font-medium text-primary-foreground">{property.address}</div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">Property Value</div>
                                  <div className="font-medium text-primary-foreground">
                                    {formatCurrency(property.value)}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">Property Type</div>
                                  <div className="font-medium text-primary-foreground">Single Family</div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">Purchase Date</div>
                                  <div className="font-medium text-primary-foreground">{property.dateAdded}</div>
                                </CardContent>
                              </Card>
                            </div>
                            <Button className="w-full">
                              <Building className="mr-2 h-4 w-4" />
                              Virtual Tour
                            </Button>
                          </div>
                        )}

                        {activeTab === "tenants" && (
                          <div className="space-y-4">
                            {property.occupancy === "occupied" ? (
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="font-medium text-primary-foreground">John Smith</h3>
                                      <p className="text-sm text-muted-foreground">Lease: Jan 2023 - Jan 2024</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-primary font-medium">JS</span>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Rent Payment</span>
                                      <span className="text-primary-foreground">Due May 1, 2023</span>
                                    </div>
                                    <Progress value={0} className="h-2" />
                                  </div>
                                  <Button className="w-full mt-4">Message Tenant</Button>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8">
                                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-primary-foreground mb-2">No Active Tenants</h3>
                                <p className="text-sm text-muted-foreground mb-4">This property is currently vacant</p>
                                <Button>Add Tenant</Button>
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === "financials" && (
                          <div className="space-y-4">
                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4">
                                <h3 className="font-medium text-primary-foreground mb-4">Monthly Cash Flow</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Rental Income</span>
                                    <span className="text-primary-foreground">
                                      {formatCurrency(property.rentAmount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mortgage</span>
                                    <span className="text-primary-foreground">-$1,200</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Property Tax</span>
                                    <span className="text-primary-foreground">-$350</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Insurance</span>
                                    <span className="text-primary-foreground">-$100</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Maintenance</span>
                                    <span className="text-primary-foreground">-$150</span>
                                  </div>
                                  <div className="border-t border-border my-2" />
                                  <div className="flex justify-between font-medium">
                                    <span className="text-primary-foreground">Net Cash Flow</span>
                                    <span className="text-primary glow-text">
                                      {formatCurrency(property.rentAmount - 1800)}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Button className="w-full">View Financial Projections</Button>
                          </div>
                        )}

                        {activeTab === "maintenance" && (
                          <div className="space-y-4">
                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4">
                                <h3 className="font-medium text-primary-foreground mb-4">Maintenance Tickets</h3>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-primary-foreground">Leaking Faucet</h4>
                                      <p className="text-sm text-muted-foreground">Reported: Apr 28, 2023</p>
                                    </div>
                                    <Badge>In Progress</Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-primary-foreground">HVAC Service</h4>
                                      <p className="text-sm text-muted-foreground">Scheduled: May 15, 2023</p>
                                    </div>
                                    <Badge variant="outline">Scheduled</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Button className="w-full">Create Maintenance Ticket</Button>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Property Modal */}
      <AnimatePresence>
        {isAddPropertyOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-primary-foreground">Add New Property</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddPropertyOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium text-primary-foreground">
                        Property Address
                      </label>
                      <Input id="address" placeholder="123 Main St, Austin, TX" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium text-primary-foreground">
                        Property Type
                      </label>
                      <select
                        id="type"
                        className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="single-family">Single Family</option>
                        <option value="multi-family">Multi-Family</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="purchase-price" className="text-sm font-medium text-primary-foreground">
                        Purchase Price
                      </label>
                      <Input id="purchase-price" type="number" placeholder="450000" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="purchase-date" className="text-sm font-medium text-primary-foreground">
                        Purchase Date
                      </label>
                      <Input id="purchase-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bedrooms" className="text-sm font-medium text-primary-foreground">
                        Bedrooms
                      </label>
                      <Input id="bedrooms" type="number" placeholder="3" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bathrooms" className="text-sm font-medium text-primary-foreground">
                        Bathrooms
                      </label>
                      <Input id="bathrooms" type="number" placeholder="2" step="0.5" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="square-feet" className="text-sm font-medium text-primary-foreground">
                        Square Feet
                      </label>
                      <Input id="square-feet" type="number" placeholder="1800" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="year-built" className="text-sm font-medium text-primary-foreground">
                        Year Built
                      </label>
                      <Input id="year-built" type="number" placeholder="2005" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="property-image" className="text-sm font-medium text-primary-foreground">
                      Property Image
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
                      <Button variant="outline" size="sm">
                        Upload Image
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-primary-foreground">
                      Property Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Describe the property..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddPropertyOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Add Property</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
