// "use client"

// import type React from "react"

// import { useState,useCallback } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Shield, LogOut, Search, MapPin, History, Settings, Lock } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { LocationPicker } from "@/components/location/location-picker"

// export default function UserDashboard() {
//   const [isSearching, setIsSearching] = useState(false)
//   const [searchResults, setSearchResults] = useState<any[]>([])
//   const [searchRadius, setSearchRadius] = useState([500])
//   const [privacyLevel, setPrivacyLevel] = useState("high")
//   const [encryptedLocation, setEncryptedLocation] = useState<{ latitude: string; longitude: string } | null>(null)
//   const [category, setCategory] = useState("all")
//   const [anonymous, setAnonymous] = useState(true)

//   const handleLocationSelected = useCallback((location: { latitude: string; longitude: string }) => {
//     setEncryptedLocation(location)
// }, []);

// // useEffect(() => {
// //   // For demo purposes, use a mock location
// //   const mockLocation = { latitude: 37.7749, longitude: -122.4194 }
// //   setLocation(mockLocation)
// //   // Encrypt location
// //   const encryptedLocation = encryptLocation(mockLocation.latitude, mockLocation.longitude)
// //   onLocationSelected(encryptedLocation)
// // }, [onLocationSelected])

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!encryptedLocation) {
//       return
//     }

//     setIsSearching(true)
//     setSearchResults([])

//     try {
//       // In a real implementation, this would call the API
//       // For demonstration, we'll simulate the API call
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // Mock search results
//       setSearchResults([
//         { id: "POI-042", name: "Central Park Restaurant", category: "Restaurant", distance: "320m", rating: 4.5 },
//         { id: "POI-108", name: "Grand Hotel", category: "Hotel", distance: "450m", rating: 4.8 },
//         { id: "POI-156", name: "City Museum", category: "Attraction", distance: "480m", rating: 4.7 },
//         { id: "POI-203", name: "Downtown Mall", category: "Shopping", distance: "500m", rating: 4.2 },
//       ])
//     } catch (error) {
//       console.error("Search error:", error)
//     } finally {
//       setIsSearching(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//       <div className="w-64 border-r bg-muted/30 hidden md:block">
//         <div className="p-4 border-b">
//           <div className="flex items-center gap-2">
//             <Shield className="h-6 w-6 text-primary" />
//             <span className="font-bold text-lg">EPLQ User</span>
//           </div>
//         </div>
//         <nav className="p-4 space-y-2">
//           <Link
//             href="/user/dashboard"
//             className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
//           >
//             <Search className="h-5 w-5" />
//             <span>Search POIs</span>
//           </Link>
//           <Link
//             href="/user/history"
//             className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
//           >
//             <History className="h-5 w-5" />
//             <span>Search History</span>
//           </Link>
//           <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground">
//             <Settings className="h-5 w-5" />
//             <span>Preferences</span>
//           </Link>
//           <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground">
//             <LogOut className="h-5 w-5" />
//             <span>Logout</span>
//           </Link>
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         <header className="border-b p-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold">User Dashboard</h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-muted-foreground">user@example.com</span>
//               <Link href="/">
//                 <Button variant="ghost" size="sm">
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Logout
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 p-6">
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="md:col-span-1 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Privacy-Preserving Search</CardTitle>
//                   <CardDescription>Search for Points of Interest without revealing your exact location</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSearch} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label>Your Location (Encrypted)</Label>
//                       <LocationPicker onLocationSelected={handleLocationSelected} privacyLevel={privacyLevel} />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="category">Category</Label>
//                       <Select defaultValue="all" value={category} onValueChange={setCategory}>
//                         <SelectTrigger id="category">
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Categories</SelectItem>
//                           <SelectItem value="restaurant">Restaurants</SelectItem>
//                           <SelectItem value="hotel">Hotels</SelectItem>
//                           <SelectItem value="attraction">Attractions</SelectItem>
//                           <SelectItem value="shopping">Shopping</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <Label htmlFor="radius">Search Radius: {searchRadius[0]}m</Label>
//                       </div>
//                       <Slider
//                         id="radius"
//                         min={100}
//                         max={2000}
//                         step={100}
//                         value={searchRadius}
//                         onValueChange={setSearchRadius}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="privacy-level">Privacy Level</Label>
//                       <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
//                         <SelectTrigger id="privacy-level">
//                           <SelectValue placeholder="Select privacy level" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="high">High (Most Secure)</SelectItem>
//                           <SelectItem value="medium">Medium</SelectItem>
//                           <SelectItem value="low">Low (Faster Results)</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Switch id="anonymous" checked={anonymous} onCheckedChange={setAnonymous} />
//                       <Label htmlFor="anonymous">Anonymous Search</Label>
//                     </div>

//                     <Button type="submit" className="w-full" disabled={isSearching || !encryptedLocation}>
//                       {isSearching ? "Searching..." : "Search POIs"}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Privacy Information</CardTitle>
//                   <CardDescription>How your data is protected</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
//                     <h3 className="font-medium flex items-center gap-2 mb-2">
//                       <Lock className="h-4 w-4 text-primary" />
//                       Encryption Details
//                     </h3>
//                     <p className="text-sm text-muted-foreground">
//                       Your location is encrypted using Predicate-Only Encryption (POE) before being sent to the server.
//                       This ensures that your exact coordinates remain private.
//                     </p>
//                   </div>

//                   <div className="text-sm space-y-2">
//                     <div className="flex justify-between">
//                       <span>Encryption Method:</span>
//                       <span className="font-medium">Predicate-Only Encryption</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Privacy Level:</span>
//                       <span className="font-medium capitalize">{privacyLevel}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Location Precision:</span>
//                       <span className="font-medium">
//                         {privacyLevel === "high" ? "Low (Obfuscated)" : privacyLevel === "medium" ? "Medium" : "High"}
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="md:col-span-2">
//               <Card className="h-full">
//                 <CardHeader>
//                   <CardTitle>Search Results</CardTitle>
//                   <CardDescription>Privacy-preserving POIs near your location</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {isSearching ? (
//                     <div className="flex flex-col items-center justify-center h-64 space-y-4">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//                       <p className="text-muted-foreground">Searching for POIs...</p>
//                       <p className="text-xs text-muted-foreground">
//                         Your location remains encrypted during this process
//                       </p>
//                     </div>
//                   ) : searchResults.length > 0 ? (
//                     <div className="rounded-md border">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Category</TableHead>
//                             <TableHead>Distance</TableHead>
//                             <TableHead>Rating</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {searchResults.map((poi) => (
//                             <TableRow key={poi.id}>
//                               <TableCell className="font-medium">{poi.name}</TableCell>
//                               <TableCell>{poi.category}</TableCell>
//                               <TableCell>{poi.distance}</TableCell>
//                               <TableCell>{poi.rating} ★</TableCell>
//                               <TableCell className="text-right">
//                                 <Button variant="ghost" size="sm">
//                                   Details
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-64 space-y-4">
//                       <MapPin className="h-16 w-16 text-muted-foreground/30" />
//                       <p className="text-muted-foreground">No search results yet</p>
//                       <p className="text-xs text-muted-foreground">Use the search form to find POIs near you</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState ,useCallback} from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, LogOut, Search, MapPin, History, Settings, Lock, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location/location-picker"
import { useAuth } from "@/components/auth/auth-provider"

interface SearchResult {
  id: string
  name: string
  category: string
  distance: number
  rating: number
}

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchRadius, setSearchRadius] = useState([500])
  const [privacyLevel, setPrivacyLevel] = useState("high")
  const [encryptedLocation, setEncryptedLocation] = useState<{ latitude: string; longitude: string } | null>(null)
  const [category, setCategory] = useState("all")
  const [anonymous, setAnonymous] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLocationSelected = useCallback((location: { latitude: string; longitude: string }) => {
    setEncryptedLocation(location)
}, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!encryptedLocation) {
      setError("Please select a location first")
      return
    }

    setIsSearching(true)
    setSearchResults([])
    setError(null)

    try {
      const response = await fetch("/api/poi/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedLocation,
          category,
          radius: searchRadius[0],
          privacyLevel,
          anonymous,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Search failed")
      }

      const data = await response.json()
      console.log("Search results:", data.results)
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during search")
    } finally {
      setIsSearching(false)
    }
  }

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
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
          >
            <Search className="h-5 w-5" />
            <span>Search POIs</span>
          </Link>
          <Link
            href="/user/history"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground"
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
            <h1 className="text-xl font-bold">User Dashboard</h1>
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
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy-Preserving Search</CardTitle>
                  <CardDescription>Search for Points of Interest without revealing your exact location</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Your Location (Encrypted)</Label>
                      <LocationPicker onLocationSelected={handleLocationSelected} privacyLevel={privacyLevel} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select defaultValue="all" value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Restaurant">Restaurants</SelectItem>
                          <SelectItem value="Hotel">Hotels</SelectItem>
                          <SelectItem value="Attraction">Attractions</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Park">Parks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="radius">Search Radius: {searchRadius[0]}m</Label>
                      </div>
                      <Slider
                        id="radius"
                        min={100}
                        max={2000}
                        step={100}
                        value={searchRadius}
                        onValueChange={setSearchRadius}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="privacy-level">Privacy Level</Label>
                      <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
                        <SelectTrigger id="privacy-level">
                          <SelectValue placeholder="Select privacy level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High (Most Secure)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low (Faster Results)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="anonymous" checked={anonymous} onCheckedChange={setAnonymous} />
                      <Label htmlFor="anonymous">Anonymous Search</Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSearching || !encryptedLocation}>
                      {isSearching ? "Searching..." : "Search POIs"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Information</CardTitle>
                  <CardDescription>How your data is protected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Encryption Details
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your location is encrypted using Predicate-Only Encryption (POE) before being sent to the server.
                      This ensures that your exact coordinates remain private.
                    </p>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Encryption Method:</span>
                      <span className="font-medium">Predicate-Only Encryption</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Privacy Level:</span>
                      <span className="font-medium capitalize">{privacyLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location Precision:</span>
                      <span className="font-medium">
                        {privacyLevel === "high" ? "Low (Obfuscated)" : privacyLevel === "medium" ? "Medium" : "High"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>Privacy-preserving POIs near your location</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-muted-foreground">Searching for POIs...</p>
                      <p className="text-xs text-muted-foreground">
                        Your location remains encrypted during this process
                      </p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchResults.map((poi) => (
                            <TableRow key={poi.id}>
                              <TableCell className="font-medium">{poi.name}</TableCell>
                              <TableCell>{poi.category}</TableCell>
                              <TableCell>{poi.distance}m</TableCell>
                              <TableCell>{poi.rating} ★</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <MapPin className="h-16 w-16 text-muted-foreground/30" />
                      <p className="text-muted-foreground">No search results yet</p>
                      <p className="text-xs text-muted-foreground">Use the search form to find POIs near you</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

