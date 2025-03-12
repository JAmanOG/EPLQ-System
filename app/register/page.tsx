// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Shield, ArrowLeft } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function RegisterPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)

//   const handleRegister = (e: React.FormEvent, role: string) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate registration process
//     setTimeout(() => {
//       setIsLoading(false)
//       router.push("/login?role=" + role)
//     }, 1500)
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="container py-4">
//         <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
//           <ArrowLeft className="h-4 w-4" />
//           Back to Home
//         </Link>
//       </div>

//       <div className="flex-1 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md">
//           <CardHeader className="space-y-1">
//             <div className="flex justify-center mb-2">
//               <Shield className="h-10 w-10 text-primary" />
//             </div>
//             <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
//             <CardDescription className="text-center">Register to access the EPLQ system</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="user" className="w-full">
//               <TabsList className="grid w-full grid-cols-2 mb-6">
//                 <TabsTrigger value="user">User</TabsTrigger>
//                 <TabsTrigger value="admin">Admin</TabsTrigger>
//               </TabsList>

//               <TabsContent value="user">
//                 <form onSubmit={(e) => handleRegister(e, "user")}>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="user-first-name">First Name</Label>
//                         <Input id="user-first-name" required />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="user-last-name">Last Name</Label>
//                         <Input id="user-last-name" required />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="user-email">Email</Label>
//                       <Input id="user-email" type="email" placeholder="user@example.com" required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="user-password">Password</Label>
//                       <Input id="user-password" type="password" required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="user-confirm-password">Confirm Password</Label>
//                       <Input id="user-confirm-password" type="password" required />
//                     </div>
//                     <Button type="submit" className="w-full" disabled={isLoading}>
//                       {isLoading ? "Creating account..." : "Register as User"}
//                     </Button>
//                   </div>
//                 </form>
//               </TabsContent>

//               <TabsContent value="admin">
//                 <form onSubmit={(e) => handleRegister(e, "admin")}>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="admin-first-name">First Name</Label>
//                         <Input id="admin-first-name" required />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="admin-last-name">Last Name</Label>
//                         <Input id="admin-last-name" required />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="admin-email">Email</Label>
//                       <Input id="admin-email" type="email" placeholder="admin@example.com" required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="admin-password">Password</Label>
//                       <Input id="admin-password" type="password" required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="admin-confirm-password">Confirm Password</Label>
//                       <Input id="admin-confirm-password" type="password" required />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="admin-code">Admin Registration Code</Label>
//                       <Input id="admin-code" type="text" required />
//                     </div>
//                     <Button type="submit" className="w-full" disabled={isLoading}>
//                       {isLoading ? "Creating account..." : "Register as Admin"}
//                     </Button>
//                   </div>
//                 </form>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-2">
//             <div className="text-sm text-center text-muted-foreground">
//               Already have an account?{" "}
//               <Link href="/login" className="text-primary hover:underline">
//                 Login
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null)
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRegister = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register({
        ...formData,
        role: role.toUpperCase()
      })
      setIsLoading(false)
      router.push("/login?role=" + role)
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-4">
        <Link  prefetch={false} href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
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
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">Register to access the EPLQ system</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <form onSubmit={(e) => handleRegister(e, "user")}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-first-name">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-last-name">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input id="email" type="email" placeholder="user@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-password">Password</Label>
                      <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-confirm-password">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Register as User"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={(e) => handleRegister(e, "admin")}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-first-name">First Name</Label>
                        <Input id="admin-first-name" value={formData.firstName} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-last-name">Last Name</Label>
                        <Input id="admin-last-name" value={formData.lastName} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input id="admin-email" type="email" placeholder="admin@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input id="admin-password" type="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                      <Input id="admin-confirm-password" value={formData.password} onChange={handleChange} type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-code">Admin Registration Code</Label>
                      <Input id="admin-code" type="text" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Register as Admin"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link prefetch={false}  href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

