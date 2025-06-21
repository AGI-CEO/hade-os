"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  User,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

export function TopBar({ className }: { className?: string }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { data: session } = useSession();

  return (
    <div
      className={`border-b border-border p-4 flex items-center justify-between ${
        className || ""
      }`}
    >
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <motion.div
            initial={false}
            animate={searchFocused ? { width: "100%" } : { width: "240px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-60"
          >
            <Input
              placeholder="Search..."
              className="pl-9 bg-card border-border focus-visible:ring-primary"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border-border"
          >
            <DropdownMenuLabel>
              {session?.user?.name ||
                (session?.user?.userType === "landlord"
                  ? "Landlord"
                  : "Tenant")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href={session?.user?.userType === "landlord" ? "/" : "/connect"}
                className="cursor-pointer"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={
                  session?.user?.userType === "landlord"
                    ? "/profile"
                    : "/connect/settings"
                }
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="cursor-pointer text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
