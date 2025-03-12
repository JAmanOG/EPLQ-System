import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, MapPin, Lock, Search, Database, UserCog } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EPLQ</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="font-medium">
              Home
            </Link>
            <Link href="#features" className="font-medium">
              Features
            </Link>
            <Link href="#about" className="font-medium">
              About
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">Privacy-Preserving Location Queries</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Search for Points of Interest without revealing your exact location. EPLQ ensures your privacy while
              providing efficient location-based services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/login?role=user">
                <Button size="lg">User Access</Button>
              </Link>
              <Link href="/login?role=admin">
                <Button size="lg" variant="outline">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Privacy-Preserving Queries</CardTitle>
                  <CardDescription>Search for POIs without revealing your exact location</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our system uses predicate-only encryption to ensure that your location data remains private while
                    still allowing you to find nearby points of interest.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Database className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Encrypted Data Processing</CardTitle>
                  <CardDescription>End-to-end security for all POI data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    All POI data is encrypted, ensuring that even if the database is compromised, your sensitive
                    information remains secure and protected.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Search className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Efficient Search Algorithm</CardTitle>
                  <CardDescription>Fast query processing with tree index structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our proprietary tree index structure enhances query speed, allowing for efficient searches even with
                    large datasets of encrypted spatial data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-muted/50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">About EPLQ</h2>
                <p className="text-lg mb-4">
                  EPLQ (Efficient Privacy-Preserving Location-Based Query) is a secure, privacy-focused system for
                  Location-Based Services (LBS).
                </p>
                <p className="text-lg mb-4">
                  Our system leverages advanced cryptographic techniques to ensure that user locations remain private
                  while still allowing them to query Points of Interest (POIs) within a defined spatial range.
                </p>
                <p className="text-lg">
                  With query generation taking only ~0.9 seconds on mobile devices and POI searches completing in just a
                  few seconds on the cloud, EPLQ offers both security and performance.
                </p>
              </div>
              <div className="bg-primary/10 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">System Modules</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/20 p-3 rounded-full h-fit">
                      <UserCog className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">Admin Module</h4>
                      <ul className="list-disc list-inside text-muted-foreground">
                        <li>Register & Login</li>
                        <li>Upload Encrypted POI Data</li>
                        <li>Manage User Permissions</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/20 p-3 rounded-full h-fit">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">User Module</h4>
                      <ul className="list-disc list-inside text-muted-foreground">
                        <li>Register & Login</li>
                        <li>Search POIs (Decrypted Query Processing)</li>
                        <li>Privacy-Preserving Query Execution</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold">EPLQ</span>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EPLQ. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

