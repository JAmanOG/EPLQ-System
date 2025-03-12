"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "user";
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear errors when user starts typing
    setFormError(null);
    clearError();
  };

  const handleLogin = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const email = role === "admin" ? formData.adminEmail : formData.userEmail;
    const password =
      role === "admin" ? formData.adminPassword : formData.userPassword;

    // Basic validation
    if (!email || !password) {
      setFormError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      // Redirect is handled in the auth provider
      if (result) {
        console.log("Redirecting to dashboard...");
        // Completely disable router.push and add a longer delay
        setTimeout(() => {
          const redirectPath =
            result.user.role === "ADMIN"
              ? "/admin/dashboard"
              : "/user/dashboard";

          // Debug step - check if token exists in cookies
          const hasToken = document.cookie.includes("auth_token");
          console.log(`Token in cookies: ${hasToken}`);
          console.log(`User role: ${result.user.role}`);
          console.log(`Redirecting to: ${redirectPath}`);

          window.location.replace(redirectPath);
        }, 1000); // Increase delay to 1 second
      }
    } catch (error) {
      // Error is handled in the auth provider
      setIsLoading(false);
    }
  };

  // Display either form error or auth error
  const displayError = formError || authError;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">
              EPLQ System Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultRole} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <form onSubmit={(e) => handleLogin(e, "user")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="user@example.com"
                        value={formData.userEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Password</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        value={formData.userPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as User"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, "admin")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as Admin"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            {displayError && (
              <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {displayError}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
