"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageSquare,
  Home,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  DollarSign,
  Eye,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  propertyId?: string;
  tenantId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      
      // Set up polling to refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "RENT_DUE":
      case "RENT_OVERDUE":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "MAINTENANCE_STATUS_UPDATE":
      case "MAINTENANCE_NEW_REQUEST":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "LEASE_RENEWAL_REMINDER":
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case "NEW_DOCUMENT_SHARED":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "GENERAL_SYSTEM_MESSAGE":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get color scheme for notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "RENT_DUE":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      case "RENT_OVERDUE":
        return "border-l-red-500 bg-red-50 dark:bg-red-950";
      case "MAINTENANCE_STATUS_UPDATE":
      case "MAINTENANCE_NEW_REQUEST":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950";
      case "LEASE_RENEWAL_REMINDER":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950";
      case "NEW_DOCUMENT_SHARED":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-950";
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950";
    }
  };

  // Handle notification click for navigation
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type and related entity
    if (notification.relatedEntityType === "MaintenanceRequest" && notification.relatedEntityId) {
      if (session?.user?.userType === "landlord") {
        router.push(`/dashboard/maintenance/${notification.relatedEntityId}`);
      } else {
        router.push("/connect/maintenance");
      }
    } else if (notification.relatedEntityType === "RentPayment") {
      if (session?.user?.userType === "landlord") {
        router.push("/dashboard/finances");
      } else {
        router.push("/connect/pay-rent");
      }
    } else if (notification.relatedEntityType === "Lease") {
      if (session?.user?.userType === "landlord") {
        router.push("/dashboard/leases");
      } else {
        router.push("/connect/lease");
      }
    } else if (notification.propertyId) {
      if (session?.user?.userType === "landlord") {
        router.push(`/dashboard/properties/${notification.propertyId}`);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-card border-border">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 bg-card border-border">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No notifications yet
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DropdownMenuItem
                    className={`p-4 cursor-pointer border-l-4 ${getNotificationColor(
                      notification.type
                    )} ${!notification.isRead ? "font-medium" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <p className="text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                          {!notification.isRead && (
                            <Badge className="h-2 w-2 p-0 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer justify-center text-primary hover:text-primary"
              onClick={() => router.push("/dashboard/notifications")}
            >
              <Eye className="h-4 w-4 mr-2" />
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 