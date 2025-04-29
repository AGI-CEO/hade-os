"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaseTemplateEditor } from "@/components/lease-template-editor";

export default function NewLeaseTemplatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/leases/templates">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
          Create New Lease Template
        </h1>
      </div>

      <LeaseTemplateEditor />
    </div>
  );
}
