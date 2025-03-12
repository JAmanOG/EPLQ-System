// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// type User = {
//   id: string
//   name: string
//   email: string
//   role: string
//   status: string
//   lastLogin: string
// }

// const mockUsers: User[] = [
//   {
//     id: "USR-001",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     role: "User",
//     status: "Active",
//     lastLogin: "2023-11-15 09:45 AM",
//   },
//   {
//     id: "USR-002",
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     role: "User",
//     status: "Active",
//     lastLogin: "2023-11-14 14:30 PM",
//   },
//   {
//     id: "USR-003",
//     name: "Robert Johnson",
//     email: "robert.j@example.com",
//     role: "User",
//     status: "Inactive",
//     lastLogin: "2023-11-01 10:15 AM",
//   },
//   {
//     id: "ADM-001",
//     name: "Admin User",
//     email: "admin@example.com",
//     role: "Admin",
//     status: "Active",
//     lastLogin: "2023-11-15 08:00 AM",
//   },
//   {
//     id: "USR-004",
//     name: "Emily Davis",
//     email: "emily.d@example.com",
//     role: "User",
//     status: "Active",
//     lastLogin: "2023-11-13 11:20 AM",
//   },
//   {
//     id: "USR-005",
//     name: "Michael Wilson",
//     email: "michael.w@example.com",
//     role: "User",
//     status: "Active",
//     lastLogin: "2023-11-12 16:45 PM",
//   },
//   {
//     id: "USR-006",
//     name: "Sarah Brown",
//     email: "sarah.b@example.com",
//     role: "User",
//     status: "Inactive",
//     lastLogin: "2023-10-28 09:30 AM",
//   },
// ]

// export function UserTable() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")

//   const filteredUsers = mockUsers.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()
//     return matchesSearch && matchesStatus
//   })

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <Input
//             placeholder="Search by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="w-full sm:w-48">
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger>
//               <SelectValue placeholder="All Statuses" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Last Login</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredUsers.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell>{user.id}</TableCell>
//                 <TableCell>{user.name}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.role}</TableCell>
//                 <TableCell>
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       user.status === "Active"
//                         ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
//                         : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
//                     }`}
//                   >
//                     {user.status}
//                   </span>
//                 </TableCell>
//                 <TableCell>{user.lastLogin}</TableCell>
//                 <TableCell className="text-right">
//                   <Button variant="ghost" size="sm">
//                     Manage
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin: string | null
}

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/user")

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error instanceof Error ? error.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update user")
      }

      // Update the user in the local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    } catch (error) {
      console.error("Error updating user:", error)
      setError(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never"

    const date = new Date(lastLogin)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={fetchUsers} className="shrink-0">
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {users.length === 0 ? "No users found." : "No users match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatLastLogin(user.lastLogin)}</TableCell>
                  <TableCell className="text-right">
                    {user.status === "ACTIVE" ? (
                      <Button variant="outline" size="sm" onClick={() => updateUserStatus(user.id, "INACTIVE")}>
                        Deactivate
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => updateUserStatus(user.id, "ACTIVE")}>
                        Activate
                      </Button>
                    )}
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

