"use client"

import { motion } from "framer-motion"
import { Smile, Frown, Meh, Gift, Wrench, MessageSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

// Sample tenant happiness data
const tenantHappiness = [
  {
    id: 1,
    name: "John Smith",
    score: 85,
    trend: "up",
    property: "123 Main St, Austin, TX",
  },
  {
    id: 2,
    name: "Alice Rodriguez",
    score: 92,
    trend: "up",
    property: "789 Pine Blvd, Houston, TX",
  },
]

// Average happiness score
const averageScore = Math.round(tenantHappiness.reduce((sum, tenant) => sum + tenant.score, 0) / tenantHappiness.length)

export function TenantHappiness() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {averageScore > 80 ? (
              <Smile className="h-8 w-8 text-green-500" />
            ) : averageScore > 50 ? (
              <Meh className="h-8 w-8 text-amber-500" />
            ) : (
              <Frown className="h-8 w-8 text-red-500" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary-foreground glow-text">{averageScore}%</h3>
            <p className="text-muted-foreground">Average Happiness</p>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-sm text-muted-foreground">Active Tenants</div>
          <div className="text-xl font-bold text-primary-foreground">{tenantHappiness.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {tenantHappiness.map((tenant) => (
          <motion.div
            key={tenant.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-lg border border-border bg-card/50"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {tenant.score > 80 ? (
                    <Smile className="h-5 w-5 text-green-500" />
                  ) : tenant.score > 50 ? (
                    <Meh className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Frown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">{tenant.name}</h4>
                  <p className="text-xs text-muted-foreground">{tenant.property}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-primary-foreground">{tenant.score}%</div>
                <div className="text-xs text-green-500">{tenant.trend === "up" ? "↑ Improving" : "↓ Declining"}</div>
              </div>
            </div>
            <Progress
              value={tenant.score}
              className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-green-500"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="flex items-center justify-center">
          <Wrench className="mr-2 h-4 w-4" />
          Approve Repair
        </Button>
        <Button variant="outline" size="sm" className="flex items-center justify-center">
          <Gift className="mr-2 h-4 w-4" />
          Send Gift
        </Button>
        <Button variant="outline" size="sm" className="flex items-center justify-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          Check In
        </Button>
      </div>
    </div>
  )
}
