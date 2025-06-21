"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  Check,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { formatDistanceToNow, format } from "date-fns";
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
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
        toast({
          title: "Success",
          description: "Notification marked as read",
        });
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

  // Mark multiple notifications as read
  const markSelectedAsRead = async () => {
    try {
      const promises = selectedNotifications.map((id) =>
        fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      );
      await Promise.all(promises);

      setNotifications((prev) =>
        prev.map((n) =>
          selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n
        )
      );
      setSelectedNotifications([]);
      toast({
        title: "Success",
        description: `${selectedNotifications.length} notifications marked as read`,
      });
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "RENT_DUE":
      case "RENT_OVERDUE":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "MAINTENANCE_STATUS_UPDATE":
      case "MAINTENANCE_NEW_REQUEST":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case "LEASE_RENEWAL_REMINDER":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "NEW_DOCUMENT_SHARED":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "GENERAL_SYSTEM_MESSAGE":
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get type label for notification type
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "RENT_DUE":
        return "Rent Due";
      case "RENT_OVERDUE":
        return "Rent Overdue";
      case "MAINTENANCE_STATUS_UPDATE":
        return "Maintenance Update";
      case "MAINTENANCE_NEW_REQUEST":
        return "New Maintenance";
      case "LEASE_RENEWAL_REMINDER":
        return "Lease Renewal";
      case "NEW_DOCUMENT_SHARED":
        return "New Document";
      case "GENERAL_SYSTEM_MESSAGE":
        return "System Message";
      default:
        return "Notification";
    }
  };

  // Filter notifications based on filter and search
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.isRead) ||
      (filter === "read" && notification.isRead) ||
      notification.type === filter;

    const matchesSearch =
      searchQuery === "" ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTypeLabel(notification.type).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Handle notification click for navigation
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

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

  // Handle checkbox selection
  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all visible notifications
  const selectAll = () => {
    const unreadIds = filteredNotifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);
    setSelectedNotifications(unreadIds);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your property management activities
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading notifications...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your property management activities
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="secondary">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="RENT_DUE">Rent Due</SelectItem>
              <SelectItem value="RENT_OVERDUE">Rent Overdue</SelectItem>
              <SelectItem value="MAINTENANCE_STATUS_UPDATE">Maintenance</SelectItem>
              <SelectItem value="LEASE_RENEWAL_REMINDER">Lease Renewal</SelectItem>
              <SelectItem value="NEW_DOCUMENT_SHARED">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedNotifications.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {selectedNotifications.length} selected
            </span>
            <Button size="sm" onClick={markSelectedAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notifications found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filter !== "all"
                  ? "Try adjusting your search or filter settings."
                  : "You're all caught up! No notifications to display."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              <div className="p-4 border-b bg-muted/10">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedNotifications.length > 0 &&
                      selectedNotifications.length ===
                        filteredNotifications.filter((n) => !n.isRead).length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        selectAll();
                      } else {
                        setSelectedNotifications([]);
                      }
                    }}
                  />
                  <span className="text-sm font-medium">
                    {filteredNotifications.length} notifications
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 hover:bg-muted/20 transition-colors ${
                      !notification.isRead ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={() => toggleSelection(notification.id)}
                        disabled={notification.isRead}
                      />

                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              {!notification.isRead && (
                                <Badge className="h-2 w-2 p-0 rounded-full bg-primary" />
                              )}
                            </div>
                            <p
                              className={`text-sm leading-relaxed ${
                                !notification.isRead ? "font-medium" : ""
                              }`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                              <span>
                                {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                View details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 