"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, LogOut, Database, Users, Settings } from "lucide-react";
import { UserTable } from "@/components/user/user-table";
import { Loader2 } from "lucide-react";

type UserStats = {
  totalUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  newUsers: number;
};

export default function AdminUsersPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserStats() {
      try {
        setLoading(true);
        const response = await fetch("/api/user/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch user statistics");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError("Could not load user statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchUserStats();
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">EPLQ Admin</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
          >
            <Database className="h-5 w-5" />
            <span>POI Management</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
          >
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
          >
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">User Management</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                admin@example.com
              </span>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>Overview of user activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : error ? (
                    <div className="text-destructive text-sm">{error}</div>
                  ) : stats ? (
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Users</span>
                        <span className="text-sm">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Inactive Users
                        </span>
                        <span className="text-sm">{stats.inactiveUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Admin Users</span>
                        <span className="text-sm">{stats.adminUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          New Users (Last 30 Days)
                        </span>
                        <span className="text-sm">{stats.newUsers}</span>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Actions</CardTitle>
                  <CardDescription>Manage user accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">Add New User</Button>
                  <Button variant="outline" className="w-full">
                    Export User Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    Send Notification to All Users
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
