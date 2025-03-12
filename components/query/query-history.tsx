// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { History, Search } from "lucide-react"

// type QueryRecord = {
//   id: string
//   date: string
//   time: string
//   category: string
//   radius: number
//   privacyLevel: string
//   resultCount: number
// }

// const mockQueryHistory: QueryRecord[] = [
//   {
//     id: "Q-001",
//     date: "2023-11-15",
//     time: "10:30 AM",
//     category: "Restaurant",
//     radius: 500,
//     privacyLevel: "High",
//     resultCount: 3,
//   },
//   {
//     id: "Q-002",
//     date: "2023-11-15",
//     time: "02:45 PM",
//     category: "Hotel",
//     radius: 1000,
//     privacyLevel: "Medium",
//     resultCount: 5,
//   },
//   {
//     id: "Q-003",
//     date: "2023-11-14",
//     time: "09:15 AM",
//     category: "All Categories",
//     radius: 750,
//     privacyLevel: "High",
//     resultCount: 8,
//   },
//   {
//     id: "Q-004",
//     date: "2023-11-13",
//     time: "04:20 PM",
//     category: "Shopping",
//     radius: 300,
//     privacyLevel: "Low",
//     resultCount: 2,
//   },
//   {
//     id: "Q-005",
//     date: "2023-11-12",
//     time: "11:50 AM",
//     category: "Attraction",
//     radius: 1500,
//     privacyLevel: "Medium",
//     resultCount: 6,
//   },
// ]

// export function QueryHistory() {
//   const [categoryFilter, setCategoryFilter] = useState("all")

//   const filteredHistory = mockQueryHistory.filter((query) => {
//     return (
//       categoryFilter === "all" ||
//       query.category.toLowerCase() === categoryFilter.toLowerCase() ||
//       (categoryFilter === "other" && query.category === "All Categories")
//     )
//   })

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <History className="h-5 w-5 text-primary" />
//             <CardTitle>Query History</CardTitle>
//           </div>
//           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               <SelectItem value="restaurant">Restaurant</SelectItem>
//               <SelectItem value="hotel">Hotel</SelectItem>
//               <SelectItem value="attraction">Attraction</SelectItem>
//               <SelectItem value="shopping">Shopping</SelectItem>
//               <SelectItem value="other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <CardDescription>Your recent privacy-preserving location queries</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {filteredHistory.length > 0 ? (
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date & Time</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Radius</TableHead>
//                   <TableHead>Privacy Level</TableHead>
//                   <TableHead>Results</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredHistory.map((query) => (
//                   <TableRow key={query.id}>
//                     <TableCell>
//                       <div className="font-medium">{query.date}</div>
//                       <div className="text-xs text-muted-foreground">{query.time}</div>
//                     </TableCell>
//                     <TableCell>{query.category}</TableCell>
//                     <TableCell>{query.radius}m</TableCell>
//                     <TableCell>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           query.privacyLevel === "High"
//                             ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
//                             : query.privacyLevel === "Medium"
//                               ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
//                               : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
//                         }`}
//                       >
//                         {query.privacyLevel}
//                       </span>
//                     </TableCell>
//                     <TableCell>{query.resultCount}</TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm">
//                         <Search className="h-4 w-4 mr-2" />
//                         Repeat
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-8 text-center">
//             <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
//             <p className="text-muted-foreground">No query history found for this category</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type QueryRecord = {
  id: string
  date: string
  time: string
  category: string
  radius: number
  privacyLevel: string
  resultCount: number
}

export function QueryHistory() {
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [history, setHistory] = useState<QueryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true)
      setError(null)
      
      try {
        const url = categoryFilter !== 'all' 
          ? `/api/query-history?category=${categoryFilter}`
          : '/api/query-history'
          
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch history')
        }
        
        const data = await response.json()
        setHistory(data.history || [])
      } catch (err) {
        console.error('Error fetching query history:', err)
        setError('Could not load history. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistory()
  }, [categoryFilter])

  const repeatSearch = (query: QueryRecord) => {
    router.push(`/user/dashboard?category=${query.category}&radius=${query.radius}&privacyLevel=${query.privacyLevel}`)
  }

  const filteredHistory = history.filter((query) => {
    return (
      categoryFilter === "all" ||
      query.category.toLowerCase() === categoryFilter.toLowerCase() ||
      (categoryFilter === "other" && query.category === "All Categories")
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Query History</CardTitle>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="attraction">Attraction</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Your recent privacy-preserving location queries</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your query history...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Privacy Level</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div className="font-medium">{query.date}</div>
                      <div className="text-xs text-muted-foreground">{query.time}</div>
                    </TableCell>
                    <TableCell>{query.category}</TableCell>
                    <TableCell>{query.radius}m</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          query.privacyLevel === "High"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                            : query.privacyLevel === "Medium"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                        }`}
                      >
                        {query.privacyLevel}
                      </span>
                    </TableCell>
                    <TableCell>{query.resultCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => repeatSearch(query)}>
                        <Search className="h-4 w-4 mr-2" />
                        Repeat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No query history found for this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}