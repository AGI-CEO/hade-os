"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaseEditor } from "@/components/lease-editor";

export default function EditLeasePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/leases/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
          Edit Lease
        </h1>
      </div>

      <LeaseEditor leaseId={params.id} />
    </div>
  );
}
