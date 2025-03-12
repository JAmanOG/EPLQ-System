"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Download, Send } from "lucide-react";

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

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

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

  // Handle adding a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newUserData,
          role: "USER",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      setActionSuccess("User created successfully!");
      setNewUserData({ firstName: "", lastName: "", email: "", password: "" });
      setAddUserOpen(false);

      // Refresh user stats after adding
      fetchUserStats();
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle exporting user data
  const handleExportUserData = async () => {
    setActionLoading(true);

    try {
      const response = await fetch("/api/user/export");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to export data");
      }

      const data = await response.json();

      // Create and download file
      const blob = new Blob([JSON.stringify(data.users, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setActionSuccess("User data exported successfully!");
    } catch (err) {
      console.error("Error exporting user data:", err);
      setError(err instanceof Error ? err.message : "Failed to export data");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle sending notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: notification }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send notification");
      }

      setActionSuccess("Notification sent to all users!");
      setNotification("");
      setNotificationOpen(false);
    } catch (err) {
      console.error("Error sending notification:", err);
      setError(
        err instanceof Error ? err.message : "Failed to send notification"
      );
    } finally {
      setActionLoading(false);
    }
  };

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
                  {actionSuccess && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-3">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {actionSuccess}
                      </p>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => setAddUserOpen(true)}
                  >
                    Add New User
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleExportUserData}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export User Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setNotificationOpen(true)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Notification to All Users
                  </Button>
                </CardContent>
              </Card>{" "}
            </div>
          </div>
        </main>
      </div>
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUserData.firstName}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUserData.lastName}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Send a notification to all users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendNotification}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notification">Message</Label>
                <Textarea
                  id="notification"
                  placeholder="Enter your notification message..."
                  value={notification}
                  onChange={(e) => setNotification(e.target.value)}
                  required
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Notification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
