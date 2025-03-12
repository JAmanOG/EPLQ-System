"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Lock } from "lucide-react"
import { encryptLocation } from "@/lib/encryption"

type LocationPickerProps = {
  onLocationSelected: (encryptedLocation: { latitude: string; longitude: string }) => void
  privacyLevel: string
}

export function LocationPicker({ onLocationSelected, privacyLevel }: LocationPickerProps) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const detectLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })

        // Encrypt location before sending to parent component
        const encryptedLocation = encryptLocation(latitude, longitude)
        onLocationSelected(encryptedLocation)

        setLoading(false)
      },
      (error) => {
        setError("Unable to retrieve your location")
        setLoading(false)
        console.error("Geolocation error:", error)
      },
    )
  }

  // Simulate location detection on component mount
  useEffect(() => {
    // Set loading state while getting location
    setLoading(true);
    
    // Use the browser's geolocation API to get the user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          // Update state with the real location
          setLocation(userLocation);
          
          // Encrypt location and call the callback
          const encryptedLocation = encryptLocation(userLocation.latitude, userLocation.longitude);
          onLocationSelected(encryptedLocation);
          
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Unable to retrieve your location");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, [onLocationSelected]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">Your Location</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-xs text-muted-foreground">Encrypted</span>
        </div>
      </div>

      {location ? (
        <Card className="p-3 bg-muted/50 relative">
          <div className="absolute right-3 top-3">
            <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm mb-1">Location detected and encrypted:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs bg-background p-2 rounded border">
              <span className="text-muted-foreground">Latitude:</span>{" "}
              <code className="text-xs">
                {privacyLevel === "high" ? "POE[****...]" : `POE[${location.latitude.toString().substring(0, 4)}...]`}
              </code>
            </div>
            <div className="text-xs bg-background p-2 rounded border">
              <span className="text-muted-foreground">Longitude:</span>{" "}
              <code className="text-xs">
                {privacyLevel === "high" ? "POE[****...]" : `POE[${location.longitude.toString().substring(0, 4)}...]`}
              </code>
            </div>
          </div>
        </Card>
      ) : (
        <Button variant="outline" className="w-full" onClick={detectLocation} disabled={loading}>
          {loading ? "Detecting..." : "Detect My Location"}
        </Button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Your location is encrypted using Predicate-Only Encryption before being sent to the server.
        {privacyLevel === "high" && " High privacy mode adds additional obfuscation."}
      </p>
    </div>
  )
}

