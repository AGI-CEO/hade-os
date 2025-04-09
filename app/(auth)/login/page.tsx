"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  // Using NextAuth.js signIn instead of custom auth
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to sign in with credentials:", data.email);

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        throw new Error(result.error || "Login failed");
      }

      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome back to HADE!",
      });

      // Fetch user data to determine redirect
      console.log("Fetching user data to determine redirect");
      const userResponse = await fetch("/api/auth/me");

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("User data received:", userData);

        // Redirect based on user type
        if (userData.userType === "landlord") {
          console.log("Redirecting to landlord dashboard");
          router.push("/");
          return;
        } else if (userData.userType === "tenant") {
          console.log("Redirecting to tenant dashboard");
          router.push("/connect");
          return;
        }
      } else {
        console.error("Failed to fetch user data:", await userResponse.text());
      }

      // Default redirect if we can't determine user type
      console.log("Using default redirect");
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 h-16 w-16 relative">
            <Image
              src="/images/hade-logo.png"
              alt="HADE Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
            HADE
          </h1>
          <p className="text-muted-foreground">Housing Agent Does Everything</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-primary-foreground">
              Log in to your account
            </CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="bg-background"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-background"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <span>
                Don't have an account? Contact your property manager for access.
              </span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
