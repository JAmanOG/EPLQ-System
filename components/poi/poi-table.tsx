"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"

type POI = {
  id: string
  name: string
  category: string
  location: string
  lastUpdated: string
  createdBy: string
}

export function POITable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [pois, setPois] = useState<POI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPOIs()
  }, [categoryFilter])

  const fetchPOIs = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = `/api/poi${categoryFilter !== "all" ? `?category=${categoryFilter}` : ""}`
      const response = await fetch(url)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch POIs")
      }

      const data = await response.json()
      setPois(data.pois || [])
    } catch (error) {
      console.error("Error fetching POIs:", error)
      setError(error instanceof Error ? error.message : "Failed to load POIs")
    } finally {
      setLoading(false)
    }
  }

  const filteredPOIs = pois.filter((poi) => {
    return (
      poi.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Restaurant">Restaurant</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Attraction">Attraction</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Park">Park</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={fetchPOIs} className="shrink-0">
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name (Encrypted)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location (Encrypted)</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                    <span>Loading POIs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPOIs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {pois.length === 0 ? "No POIs found. Add some POIs to get started." : "No POIs match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredPOIs.map((poi) => (
                <TableRow key={poi.id}>
                  <TableCell>{poi.id}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted p-1 rounded">{poi.name}</code>
                  </TableCell>
                  <TableCell>{poi.category}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted p-1 rounded">{poi.location}</code>
                  </TableCell>
                  <TableCell>{poi.lastUpdated}</TableCell>
                  <TableCell>{poi.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

