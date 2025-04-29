import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div
        className="ml-56 transition-all duration-300 ease-in-out"
        data-sidebar-collapsed="false"
      >
        <TopBar className="sticky top-0 z-30 bg-background" />
        <main className="p-4 md:p-6 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
