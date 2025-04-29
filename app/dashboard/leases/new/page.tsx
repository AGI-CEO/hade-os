import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { LeaseGenerator } from "@/components/lease-generator";
import NewLeaseClient from "./new-lease-client";

export default function NewLeasePage() {
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

      <Suspense fallback={<div>Loading...</div>}>
        <NewLeaseClient />
      </Suspense>
    </div>
  );
}
