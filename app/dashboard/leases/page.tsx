"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Filter,
  Search,
  FileSignature,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeaseManagement } from "@/components/lease-management";
import { LeaseTemplatesList } from "@/components/lease-templates-list";

export default function LeasesPage() {
  const [activeTab, setActiveTab] = useState("leases");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "draft" | "expired" | "renewed"
  >("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Lease Management
        </h1>
        <p className="text-muted-foreground">
          Create, manage, and track lease agreements for your properties
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs
          defaultValue="leases"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="leases" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Leases</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <FileSignature className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {activeTab === "leases" && (
            <>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leases..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("all")}
                    className={filterStatus === "all" ? "bg-muted" : ""}
                  >
                    All Leases
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("active")}
                    className={filterStatus === "active" ? "bg-muted" : ""}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("draft")}
                    className={filterStatus === "draft" ? "bg-muted" : ""}
                  >
                    <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("expired")}
                    className={filterStatus === "expired" ? "bg-muted" : ""}
                  >
                    <FileText className="mr-2 h-4 w-4 text-gray-500" />
                    Expired
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("renewed")}
                    className={filterStatus === "renewed" ? "bg-muted" : ""}
                  >
                    <FileSignature className="mr-2 h-4 w-4 text-blue-500" />
                    Renewed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {activeTab === "leases" ? (
            <Link href="/dashboard/leases/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Lease
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/leases/templates/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </Link>
          )}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "leases" ? (
          <LeaseManagement />
        ) : (
          <LeaseTemplatesList />
        )}
      </motion.div>
    </div>
  );
}
