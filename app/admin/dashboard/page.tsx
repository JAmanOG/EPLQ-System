"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  LogOut,
  Database,
  Users,
  Settings,
  AlertCircle,
} from "lucide-react";
import { POIUpload } from "@/components/poi/poi-upload";
import { POITable } from "@/components/poi/poi-table";
import { useAuth } from "@/components/auth/auth-provider";
import { useState, useEffect } from "react";
// import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

import { Loader2, CheckCircle2 } from "lucide-react";

type SystemSettings = {
  id: string;
  encryptionAlgorithm: string;
  queryTimeout: number;
  maxResultsPerQuery: number;
  indexRefreshInterval: number;
  updatedAt: string;
};

function SystemSettingsTab() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [queryTimeout, setQueryTimeout] = useState<number>(30);
  const [maxResults, setMaxResults] = useState<number>(100);
  const [indexRefresh, setIndexRefresh] = useState<number>(24);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await fetch("/api/settings");

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = await response.json();
        setSettings(data);

        // Initialize form values
        setQueryTimeout(data.queryTimeout);
        setMaxResults(data.maxResultsPerQuery);
        setIndexRefresh(data.indexRefreshInterval);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Could not load system settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUpdating(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryTimeout,
          maxResultsPerQuery: maxResults,
          indexRefreshInterval: indexRefresh,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update settings");
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess("System settings updated successfully");
      toast({
        title: "Settings Updated",
        description: "System settings have been updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setError(err.message || "Failed to update settings");
      toast({
        title: "Update Failed",
        description: err.message || "Could not update system settings",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system-wide settings for the EPLQ platform
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure system-wide settings for the EPLQ platform
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 p-3 rounded-md flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
            <Input
              id="encryption-algorithm"
              value={
                settings?.encryptionAlgorithm ||
                "AES-256 / Predicate-Only Encryption"
              }
              readOnly
            />
            <p className="text-xs text-muted-foreground">
              Encryption algorithm cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="query-timeout">Query Timeout (seconds)</Label>
            <Input
              id="query-timeout"
              type="number"
              min="1"
              max="120"
              value={queryTimeout}
              onChange={(e) => setQueryTimeout(Number(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Maximum time allowed for query execution (1-120 seconds)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-results">Maximum Results Per Query</Label>
            <Input
              id="max-results"
              type="number"
              min="1"
              max="1000"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Limits the number of results returned by queries (1-1000)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="index-refresh">
              Index Refresh Interval (hours)
            </Label>
            <Input
              id="index-refresh"
              type="number"
              min="1"
              max="168"
              value={indexRefresh}
              onChange={(e) => setIndexRefresh(Number(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              How often the search index is refreshed (1-168 hours)
            </p>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            Last updated:{" "}
            {settings?.updatedAt
              ? new Date(settings.updatedAt).toLocaleString()
              : "Never"}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updating}>
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalPOIs: 0,
    databaseStatus: "Online",
    encryptionService: "Active",
    queryProcessing: "Running",
    lastUpdate: "Loading...",
  });

  useEffect(() => {
    // Fetch system stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/poi");
        if (response.ok) {
          const data = await response.json();
          setStats({
            ...stats,
            totalPOIs: data.pois.length,
            lastUpdate: new Date().toLocaleString(),
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
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
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
          >
            <Database className="h-5 w-5" />
            <span>POI Management</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
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
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Tabs defaultValue="poi-management">
            <TabsList className="mb-6">
              <TabsTrigger value="poi-management">POI Management</TabsTrigger>
              <TabsTrigger value="system-settings">System Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="poi-management" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload POI Data</CardTitle>
                    <CardDescription>
                      Upload encrypted POI data to the system. The data will be
                      processed and indexed for efficient querying.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <POIUpload />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>
                      Current status of the EPLQ system and database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Database Status
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                          {stats.databaseStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Encryption Service
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                          {stats.encryptionService}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Query Processing
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                          {stats.queryProcessing}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total POIs</span>
                        <span className="text-sm">{stats.totalPOIs}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Update</span>
                        <span className="text-sm">{stats.lastUpdate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>POI Database</CardTitle>
                  <CardDescription>
                    Manage Points of Interest in the encrypted database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <POITable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system-settings" className="space-y-6">
              {/* <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings for the EPLQ platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
                    <Input id="encryption-algorithm" value="AES-256 / Predicate-Only Encryption" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="query-timeout">Query Timeout (seconds)</Label>
                    <Input id="query-timeout" type="number" defaultValue={30} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-results">Maximum Results Per Query</Label>
                    <Input id="max-results" type="number" defaultValue={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="index-refresh">Index Refresh Interval (hours)</Label>
                    <Input id="index-refresh" type="number" defaultValue={24} />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card> */}
              <SystemSettingsTab />

              <Card>
                <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-900/30">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <CardTitle className="text-yellow-600 dark:text-yellow-400">
                      System Maintenance
                    </CardTitle>
                  </div>
                  <CardDescription className="text-yellow-700 dark:text-yellow-300">
                    Use these options with caution. They affect the entire
                    system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                  >
                    Rebuild Spatial Index
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                  >
                    Rotate Encryption Keys
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Reset System
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
