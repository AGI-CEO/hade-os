"use client"

import { FileText, AlertCircle, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Sample lease data
const leases = [
  {
    id: 1,
    tenant: "John Smith",
    property: "123 Main St, Austin, TX",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    status: "active",
    daysRemaining: 230,
  },
  {
    id: 2,
    tenant: "Alice Rodriguez",
    property: "789 Pine Blvd, Houston, TX",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "active",
    daysRemaining: 275,
  },
  {
    id: 3,
    tenant: "Michael Johnson",
    property: "456 Oak Ave, San Antonio, TX",
    startDate: "2023-06-01",
    endDate: "2024-06-01",
    status: "pending",
    daysRemaining: 365,
  },
]

export function LeaseManagement() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {leases.map((lease) => (
        <div key={lease.id} className="p-4 rounded-lg border border-border bg-card/50 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-primary-foreground">{lease.tenant}</h4>
                <p className="text-xs text-muted-foreground truncate">{lease.property}</p>
              </div>
              <Badge
                className={
                  lease.status === "active"
                    ? "bg-green-500"
                    : lease.status === "pending"
                      ? "bg-amber-500"
                      : "bg-gray-500"
                }
              >
                {lease.status === "active" ? "Active" : lease.status === "pending" ? "Pending" : "Expired"}
              </Badge>
            </div>

            {lease.status === "active" && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                  </span>
                  <span className="text-primary-foreground">{lease.daysRemaining} days left</span>
                </div>
                <Progress
                  value={Math.round(((365 - lease.daysRemaining) / 365) * 100)}
                  className="h-1.5 [&>div]:bg-primary"
                />
              </div>
            )}

            {lease.status === "pending" && (
              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Awaiting signature</span>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>1 lease expiring soon</span>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Lease
        </Button>
      </div>
    </div>
  )
}
