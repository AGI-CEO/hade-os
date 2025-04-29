"use client";

import { useSearchParams } from "next/navigation";
import { LeaseGenerator } from "@/components/lease-generator";

export default function NewLeaseClient() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  return <LeaseGenerator initialTemplateId={templateId || ""} />;
}
