"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, LogOut, Search, History, Settings } from "lucide-react"
import { QueryHistory } from "@/components/query/query-history"
import { useAuth } from "@/components/auth/auth-provider"

export default function UserHistoryPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">EPLQ User</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/user/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
          >
            <Search className="h-5 w-5" />
            <span>Search POIs</span>
          </Link>
          <Link
            href="/user/history"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
          >
            <History className="h-5 w-5" />
            <span>Search History</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground">
            <Settings className="h-5 w-5" />
            <span>Preferences</span>
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
            <h1 className="text-xl font-bold">Search History</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Information</CardTitle>
                <CardDescription>How your search history is protected</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your search history is stored securely and only includes the category, radius, privacy level, and
                  result count of your queries. Your actual location data is never stored in our database, ensuring your
                  privacy is maintained even when reviewing past searches.
                </p>
              </CardContent>
            </Card>

            <QueryHistory />
          </div>
        </main>
      </div>
    </div>
  )
}

