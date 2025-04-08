"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Wrench,
  FileText,
  FileSignature,
  Shield,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: React.ReactNode
    variant: "default" | "ghost"
    href: string
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Button
              key={index}
              variant={link.href === pathname ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-9 w-9",
                link.variant === "default" &&
                  "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
              )}
              asChild
            >
              <Link href={link.href}>
                {link.icon}
                <span className="sr-only">{link.title}</span>
              </Link>
            </Button>
          ) : (
            <Button
              key={index}
              variant={link.href === pathname ? "default" : "ghost"}
              size="sm"
              className={cn(
                "justify-start",
                link.variant === "default" && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              )}
              asChild
            >
              <Link href={link.href} className="flex items-center gap-2">
                {link.icon}
                <span>{link.title}</span>
                {link.label && <span className="ml-auto text-xs">{link.label}</span>}
              </Link>
            </Button>
          ),
        )}
      </nav>
    </div>
  )
}

export function TenantSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const iconClasses = "h-4 w-4"
  const links = [
    {
      title: "Home",
      label: "",
      icon: <Home className={iconClasses} />,
      variant: pathname === "/connect" ? "default" : "ghost",
      href: "/connect",
    },
    {
      title: "Pay Rent",
      label: "",
      icon: <CreditCard className={iconClasses} />,
      variant: pathname === "/connect/pay-rent" ? "default" : "ghost",
      href: "/connect/pay-rent",
    },
    {
      title: "Maintenance",
      label: "",
      icon: <Wrench className={iconClasses} />,
      variant: pathname === "/connect/maintenance" ? "default" : "ghost",
      href: "/connect/maintenance",
    },
    {
      title: "Documents",
      label: "",
      icon: <FileText className={iconClasses} />,
      variant: pathname === "/connect/documents" ? "default" : "ghost",
      href: "/connect/documents",
    },
    {
      title: "Lease",
      label: "",
      icon: <FileSignature className={iconClasses} />,
      variant: pathname === "/connect/lease" ? "default" : "ghost",
      href: "/connect/lease",
    },
    {
      title: "Insurance",
      label: "",
      icon: <Shield className={iconClasses} />,
      variant: pathname === "/connect/insurance" ? "default" : "ghost",
      href: "/connect/insurance",
    },
    {
      title: "Settings",
      label: "",
      icon: <Settings className={iconClasses} />,
      variant: pathname === "/connect/settings" ? "default" : "ghost",
      href: "/connect/settings",
    },
  ]

  return (
    <aside
      data-collapsed={isCollapsed}
      className="group relative flex flex-col h-full bg-card border-r border-border data-[collapsed=true]:w-16 w-56 transition-all duration-300 ease-in-out"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 relative">
            <Image src="/images/hade-logo.png" alt="HADE Logo" fill className="object-contain" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg font-bold tracking-tight glow-text"
            >
              HADE Connect
            </motion.span>
          )}
        </motion.div>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <Nav links={links} isCollapsed={isCollapsed} />
      </ScrollArea>
      <div className="h-16 border-t border-border p-2">
        <TenantButton isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}

function TenantButton({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuth()
  
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
        {user?.name?.charAt(0) || "T"}
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name || "Tenant"}</span>
          <span className="text-xs text-muted-foreground">Tenant</span>
        </div>
      )}
    </div>
  )
}
