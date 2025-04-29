"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaseGenerator } from "@/components/lease-generator";

export default function NewLeasePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/leases">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
          Create New Lease
        </h1>
      </div>

      <LeaseGenerator />
    </div>
  );
}
