"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MaintenanceRequest, MaintenanceMessage, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Messaging } from "@/components/maintenance/Messaging";

type MaintenanceRequestWithDetails = MaintenanceRequest & {
  messages: (MaintenanceMessage & { user: User })[];
};

const MaintenanceRequestDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [request, setRequest] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRequest = async () => {
        try {
          const res = await fetch(`/api/maintenance/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch maintenance request");
          }
          const data = await res.json();
          setRequest(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchUser = async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data);
          }
        } catch (error) {
          console.error("Failed to fetch user");
        }
      };

      fetchRequest();
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!request) {
    return <div>Maintenance request not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{request.title}</CardTitle>
                <CardDescription>
                  Opened on {format(new Date(request.createdAt), "PPP")}
                </CardDescription>
              </div>
              <Badge variant="outline">{request.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{request.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Priority</h3>
                <p>{request.priority}</p>
              </div>
              <div>
                <h3 className="font-semibold">Cost</h3>
                <p>{request.cost ? `$${request.cost}` : "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Vendor</h3>
                <p>
                  {request.vendorName
                    ? `${request.vendorName} (${
                        request.vendorContact || "N/A"
                      })`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="h-full">
          <CardContent className="h-full p-4">
            {currentUser && (
              <Messaging
                messages={request.messages}
                requestId={request.id}
                currentUser={currentUser}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceRequestDetailPage;
