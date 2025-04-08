"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, MoreHorizontal, MessageSquare, FileText, X, Home, Calendar, DollarSign, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

// Sample tenant data with updated avatar images
const tenants = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    property: "123 Main St, Austin, TX",
    leaseStart: "2023-01-15",
    leaseEnd: "2024-01-15",
    status: "active",
    rentAmount: 2200,
    lastPayment: "2023-05-01",
    happinessScore: 85,
    image: "/images/avatars/avatar-7.jpg",
  },
  {
    id: 2,
    name: "Alice Rodriguez",
    email: "alice.r@example.com",
    phone: "(555) 987-6543",
    property: "789 Pine Blvd, Houston, TX",
    leaseStart: "2023-03-01",
    leaseEnd: "2024-03-01",
    status: "active",
    rentAmount: 2500,
    lastPayment: "2023-05-01",
    happinessScore: 92,
    image: "/images/avatars/avatar-1.jpg",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "(555) 456-7890",
    property: "456 Oak Ave, San Antonio, TX",
    leaseStart: "2023-06-01",
    leaseEnd: "2024-06-01",
    status: "pending",
    rentAmount: 3000,
    lastPayment: null,
    happinessScore: 0,
    image: "/images/avatars/avatar-6.jpg",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "(555) 789-0123",
    property: "123 Main St, Austin, TX",
    leaseStart: "2022-02-15",
    leaseEnd: "2023-02-15",
    status: "past",
    rentAmount: 2100,
    lastPayment: "2023-02-01",
    happinessScore: 78,
    image: "/images/avatars/avatar-4.jpg",
  },
]

type TenantsListProps = {
  filterStatus: "all" | "active" | "pending" | "past"
  searchQuery: string
}

export function TenantsList({ filterStatus, searchQuery }: TenantsListProps) {
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter tenants based on status and search query
  const filteredTenants = tenants.filter((tenant) => {
    const matchesStatus = filterStatus === "all" || tenant.status === filterStatus
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const tenant = selectedTenant ? tenants.find((t) => t.id === selectedTenant) : null

  return (
    <div className="space-y-4">
      {filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-primary-foreground mb-2">No tenants found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button>Add New Tenant</Button>
        </div>
      ) : (
        filteredTenants.map((tenant) => (
          <motion.div
            key={tenant.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-lg border border-border bg-card/50 cursor-pointer"
            onClick={() => setSelectedTenant(tenant.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {tenant.image ? (
                    <img
                      src={tenant.image || "/placeholder.svg"}
                      alt={tenant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                      }}
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-primary-foreground">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">{tenant.property}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Lease</div>
                  <div className="text-sm font-medium text-primary-foreground">
                    {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                  </div>
                </div>
                <Badge
                  className={
                    tenant.status === "active"
                      ? "bg-green-500"
                      : tenant.status === "pending"
                        ? "bg-amber-500"
                        : "bg-gray-500"
                  }
                >
                  {tenant.status === "active" ? "Active" : tenant.status === "pending" ? "Pending" : "Past"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTenant(tenant.id)
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Message Tenant</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit Tenant</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Remove Tenant</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        ))
      )}

      <AnimatePresence>
        {selectedTenant && (
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
              {tenant && (
                <>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {tenant.image ? (
                            <img
                              src={tenant.image || "/placeholder.svg"}
                              alt={tenant.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                              }}
                            />
                          ) : (
                            <User className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-primary-foreground">{tenant.name}</h2>
                          <p className="text-muted-foreground">
                            {tenant.email} • {tenant.phone}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedTenant(null)}>
                        <X className="h-5 w-5" />
                      </Button>
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
                        variant={activeTab === "lease" ? "default" : "outline"}
                        onClick={() => setActiveTab("lease")}
                        className="flex-1"
                      >
                        Lease
                      </Button>
                      <Button
                        variant={activeTab === "payments" ? "default" : "outline"}
                        onClick={() => setActiveTab("payments")}
                        className="flex-1"
                      >
                        Payments
                      </Button>
                      <Button
                        variant={activeTab === "communications" ? "default" : "outline"}
                        onClick={() => setActiveTab("communications")}
                        className="flex-1"
                      >
                        Communications
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
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Home className="h-5 w-5 text-primary" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Property</div>
                                      <div className="font-medium text-primary-foreground">{tenant.property}</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Lease Period</div>
                                      <div className="font-medium text-primary-foreground">
                                        {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Rent Amount</div>
                                      <div className="font-medium text-primary-foreground">
                                        {formatCurrency(tenant.rentAmount)}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-primary" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Status</div>
                                      <div className="font-medium text-primary-foreground capitalize">
                                        {tenant.status}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {tenant.status === "active" && (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm text-muted-foreground">Happiness Score</div>
                                  <div className="text-sm font-medium text-primary-foreground">
                                    {tenant.happinessScore}%
                                  </div>
                                </div>
                                <Progress
                                  value={tenant.happinessScore}
                                  className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-green-500"
                                />
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button className="flex-1">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <FileText className="mr-2 h-4 w-4" />
                                View Documents
                              </Button>
                            </div>
                          </div>
                        )}

                        {activeTab === "lease" && (
                          <div className="space-y-6">
                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4 space-y-4">
                                <h3 className="font-medium text-primary-foreground">Lease Details</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Start Date</span>
                                    <span className="text-primary-foreground">{formatDate(tenant.leaseStart)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">End Date</span>
                                    <span className="text-primary-foreground">{formatDate(tenant.leaseEnd)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monthly Rent</span>
                                    <span className="text-primary-foreground">{formatCurrency(tenant.rentAmount)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Security Deposit</span>
                                    <span className="text-primary-foreground">{formatCurrency(tenant.rentAmount)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Due Date</span>
                                    <span className="text-primary-foreground">1st of month</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <div className="flex gap-2">
                              <Button className="flex-1">
                                <FileText className="mr-2 h-4 w-4" />
                                View Lease Document
                              </Button>
                              {tenant.status === "active" && (
                                <Button variant="outline" className="flex-1">
                                  Renew Lease
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {activeTab === "payments" && (
                          <div className="space-y-6">
                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4">
                                <h3 className="font-medium text-primary-foreground mb-4">Payment History</h3>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-primary-foreground">May 2023</div>
                                      <div className="text-sm text-muted-foreground">Paid on May 1, 2023</div>
                                    </div>
                                    <Badge className="bg-green-500">Paid</Badge>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-primary-foreground">April 2023</div>
                                      <div className="text-sm text-muted-foreground">Paid on April 1, 2023</div>
                                    </div>
                                    <Badge className="bg-green-500">Paid</Badge>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-primary-foreground">March 2023</div>
                                      <div className="text-sm text-muted-foreground">Paid on March 3, 2023</div>
                                    </div>
                                    <Badge className="bg-green-500">Paid</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4">
                                <h3 className="font-medium text-primary-foreground mb-4">Payment Summary</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monthly Rent</span>
                                    <span className="text-primary-foreground">{formatCurrency(tenant.rentAmount)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Method</span>
                                    <span className="text-primary-foreground">Direct Deposit</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Next Due Date</span>
                                    <span className="text-primary-foreground">June 1, 2023</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Button className="w-full">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Record Payment
                            </Button>
                          </div>
                        )}

                        {activeTab === "communications" && (
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img
                                      src={tenant.image || "/placeholder.svg"}
                                      alt={tenant.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                                      }}
                                    />
                                  </div>
                                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                    <p className="text-sm text-primary-foreground">
                                      Hi, I wanted to report an issue with the kitchen sink. It's been leaking for a
                                      couple of days.
                                    </p>
                                    <span className="text-xs text-muted-foreground mt-1 block">
                                      May 10, 2023 • 2:34 PM
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3 self-end">
                                  <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none">
                                    <p className="text-sm text-primary-foreground">
                                      Thanks for letting me know. I'll send a plumber tomorrow between 10 AM and 12 PM.
                                      Will you be home?
                                    </p>
                                    <span className="text-xs text-muted-foreground mt-1 block">
                                      May 10, 2023 • 3:15 PM
                                    </span>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img
                                      src="/images/headshot.jpg"
                                      alt="You"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.onerror = null
                                        e.currentTarget.parentElement!.innerHTML =
                                          '<span class="text-primary font-medium text-sm">You</span>'
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img
                                      src={tenant.image || "/placeholder.svg"}
                                      alt={tenant.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                                      }}
                                    />
                                  </div>
                                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                    <p className="text-sm text-primary-foreground">
                                      Yes, I'll be home. Thank you for the quick response!
                                    </p>
                                    <span className="text-xs text-muted-foreground mt-1 block">
                                      May 10, 2023 • 3:22 PM
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Input placeholder="Type your message..." className="flex-1" />
                              <Button>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send
                              </Button>
                            </div>
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
    </div>
  )
}
