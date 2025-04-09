"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PayRentPage() {
  const { data: session } = useSession();
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tenants/me");

        if (!response.ok) {
          throw new Error("Failed to fetch tenant data");
        }

        const data = await response.json();
        setTenantData(data);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        toast({
          title: "Error",
          description: "Failed to load your tenant information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [toast]);

  const handlePayment = () => {
    // In a real app, this would process the payment
    toast({
      title: "Payment Successful",
      description: "Your rent payment has been processed.",
    });
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
            Payment Confirmation
          </h1>
          <p className="text-muted-foreground">
            Your rent payment has been successfully processed
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground mb-2">
              Payment Successful
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your payment. A receipt has been sent to your email.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-xl font-bold text-primary-foreground">
                  ${tenantData?.rentAmount || "0.00"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="text-xl font-bold text-primary-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowConfirmation(false)}>
              Return to Payment Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Pay Rent
        </h1>
        <p className="text-muted-foreground">
          Make your monthly rent payment securely online
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground">
                Payment Details
              </CardTitle>
              <CardDescription>
                Choose your payment method and enter your details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-primary/10 rounded"></div>
                  <div className="h-20 bg-primary/10 rounded"></div>
                  <div className="h-10 bg-primary/10 rounded"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="credit-card"
                        id="credit-card"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="credit-card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        <span className="text-sm font-medium">Credit Card</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="bank-transfer"
                        id="bank-transfer"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="bank-transfer"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <DollarSign className="mb-3 h-6 w-6" />
                        <span className="text-sm font-medium">
                          Bank Transfer
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="scheduled"
                        id="scheduled"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="scheduled"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Calendar className="mb-3 h-6 w-6" />
                        <span className="text-sm font-medium">Scheduled</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-name">Name on Card</Label>
                          <Input id="card-name" placeholder="John Doe" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank-transfer" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input id="account-name" placeholder="John Doe" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="routing-number">Routing Number</Label>
                          <Input id="routing-number" placeholder="123456789" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input id="account-number" placeholder="1234567890" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "scheduled" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-date">Payment Date</Label>
                        <Input id="payment-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <select
                          id="payment-method"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="credit-card">Credit Card</option>
                          <option value="bank-transfer">Bank Transfer</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <Button onClick={handlePayment} className="w-full">
                    Pay ${tenantData?.rentAmount || "0.00"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground">
                Payment Summary
              </CardTitle>
              <CardDescription>Details of your rent payment</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-primary/10 rounded"></div>
                  <div className="h-6 bg-primary/10 rounded"></div>
                  <div className="h-6 bg-primary/10 rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="font-medium">
                      ${tenantData?.rentAmount || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium">
                      {tenantData?.rentDue
                        ? new Date(tenantData.rentDue).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property</span>
                    <span className="font-medium">
                      {tenantData?.property?.address
                        ? `${tenantData.property.address.split(" ")[0]}...`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="font-medium">
                      {paymentMethod === "credit-card"
                        ? "Credit Card"
                        : paymentMethod === "bank-transfer"
                        ? "Bank Transfer"
                        : "Scheduled"}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ${tenantData?.rentAmount || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
