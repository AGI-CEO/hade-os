"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Home,
  Users,
  DollarSign,
  FileText,
  File,
  Trophy,
  GraduationCap,
  Search,
  Bot,
  Users2,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: React.ReactNode;
    variant: "default" | "ghost";
    href: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
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
                  "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
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
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              )}
              asChild
            >
              <Link href={link.href} className="flex items-center gap-2">
                {link.icon}
                <span>{link.title}</span>
                {link.label && (
                  <span className="ml-auto text-xs">{link.label}</span>
                )}
              </Link>
            </Button>
          )
        )}
      </nav>
    </div>
  );
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Update the data-sidebar-collapsed attribute when sidebar state changes
  React.useEffect(() => {
    const mainContent = document.querySelector("[data-sidebar-collapsed]");
    if (mainContent) {
      mainContent.setAttribute(
        "data-sidebar-collapsed",
        isCollapsed.toString()
      );
      if (isCollapsed) {
        mainContent.classList.remove("ml-56");
        mainContent.classList.add("ml-16");
      } else {
        mainContent.classList.remove("ml-16");
        mainContent.classList.add("ml-56");
      }
    }
  }, [isCollapsed]);

  // Only hide the sidebar for tenant users
  // For now, we'll show it for everyone else (including when user is null)
  if (session?.user?.userType === "tenant") {
    return null;
  }

  const iconClasses = "h-4 w-4";
  const links = [
    {
      title: "Dashboard",
      label: "",
      icon: <LayoutDashboard className={iconClasses} />,
      variant: pathname === "/dashboard" ? "default" : "ghost",
      href: "/dashboard",
    },
    {
      title: "Portfolio",
      label: "",
      icon: <Home className={iconClasses} />,
      variant: pathname === "/dashboard/portfolio" ? "default" : "ghost",
      href: "/dashboard/portfolio",
    },
    {
      title: "Tenants",
      label: "",
      icon: <Users className={iconClasses} />,
      variant: pathname === "/dashboard/tenants" ? "default" : "ghost",
      href: "/dashboard/tenants",
    },
    {
      title: "Leases",
      label: "",
      icon: <FileText className={iconClasses} />,
      variant: pathname.startsWith("/dashboard/leases") ? "default" : "ghost",
      href: "/dashboard/leases",
    },
    {
      title: "Documents",
      label: "",
      icon: <File className={iconClasses} />,
      variant: pathname.startsWith("/dashboard/documents")
        ? "default"
        : "ghost",
      href: "/dashboard/documents",
    },
    {
      title: "Finances",
      label: "",
      icon: <DollarSign className={iconClasses} />,
      variant: pathname === "/dashboard/finances" ? "default" : "ghost",
      href: "/dashboard/finances",
    },
    {
      title: "Reports",
      label: "",
      icon: <FileText className={iconClasses} />,
      variant: pathname === "/dashboard/reports" ? "default" : "ghost",
      href: "/dashboard/reports",
    },
    {
      title: "Quests",
      label: "",
      icon: <Trophy className={iconClasses} />,
      variant: pathname === "/dashboard/quests" ? "default" : "ghost",
      href: "/dashboard/quests",
    },
    {
      title: "Education",
      label: "",
      icon: <GraduationCap className={iconClasses} />,
      variant: pathname === "/dashboard/education" ? "default" : "ghost",
      href: "/dashboard/education",
    },
    {
      title: "Prospecting",
      label: "",
      icon: <Search className={iconClasses} />,
      variant: pathname === "/dashboard/prospecting" ? "default" : "ghost",
      href: "/dashboard/prospecting",
    },
    {
      title: "AI Tools",
      label: "",
      icon: <Bot className={iconClasses} />,
      variant: pathname === "/dashboard/ai-tools" ? "default" : "ghost",
      href: "/dashboard/ai-tools",
    },
    {
      title: "Community",
      label: "",
      icon: <Users2 className={iconClasses} />,
      variant: pathname === "/dashboard/community" ? "default" : "ghost",
      href: "/dashboard/community",
    },
    {
      title: "Veteran Resources",
      label: "",
      icon: <Shield className={iconClasses} />,
      variant:
        pathname === "/dashboard/veteran-resources" ? "default" : "ghost",
      href: "/dashboard/veteran-resources",
    },
  ];

  return (
    <aside
      data-collapsed={isCollapsed}
      className="group fixed top-0 left-0 z-40 flex flex-col h-screen bg-card border-r border-border data-[collapsed=true]:w-16 w-56 transition-all duration-300 ease-in-out"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 relative">
            <Image
              src="/images/hade-logo.png"
              alt="HADE Logo"
              fill
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg font-bold tracking-tight glow-text"
            >
              HADE
            </motion.span>
          )}
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <Nav links={links} isCollapsed={isCollapsed} />
      </ScrollArea>
      <div className="sticky bottom-0 mt-auto h-16 border-t border-border p-2 bg-card">
        <UserButton isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}

function UserButton({ isCollapsed }: { isCollapsed: boolean }) {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {session?.user?.name?.charAt(0) || "L"}
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {session?.user?.name || "Landlord"}
            </span>
            <span className="text-xs text-muted-foreground">Landlord</span>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-8 w-8"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      )}
    </div>
  );
}
