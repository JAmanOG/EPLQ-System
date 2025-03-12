// import { decrypt } from "./encryption"

// interface POI {
//   id: string
//   name: string
//   category: string
//   latitude: string
//   longitude: string
//   description: string
// }

// interface Location {
//   latitude: number
//   longitude: number
// }

// interface QueryParams {
//   encryptedLocation: { latitude: string; longitude: string }
//   category?: string
//   radius: number
//   privacyLevel: string
//   userId?: string
// }

// // Calculate distance between two points using Haversine formula
// function calculateDistance(point1: Location, point2: Location): number {
//   const R = 6371e3 // Earth's radius in meters
//   const φ1 = (point1.latitude * Math.PI) / 180
//   const φ2 = (point2.latitude * Math.PI) / 180
//   const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180
//   const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c
// }

// // Add noise to coordinates based on privacy level
// function addNoiseToLocation(location: Location, privacyLevel: string): Location {
//   const noiseFactor = privacyLevel === "high" ? 0.001 : privacyLevel === "medium" ? 0.0005 : 0.0001
//   return {
//     latitude: location.latitude + (Math.random() - 0.5) * noiseFactor,
//     longitude: location.longitude + (Math.random() - 0.5) * noiseFactor,
//   }
// }

// export async function processPrivacyPreservingQuery({
//   encryptedLocation,
//   category,
//   radius,
//   privacyLevel,
//   userId,
// }: QueryParams) {
//   // Decrypt the user's location
//   const userLocation: Location = {
//     latitude: Number.parseFloat(decrypt({ iv: "", content: encryptedLocation.latitude })),
//     longitude: Number.parseFloat(decrypt({ iv: "", content: encryptedLocation.longitude })),
//   }

//   // Add noise to the location based on privacy level
//   const noisyLocation = addNoiseToLocation(userLocation, privacyLevel)

//   // Simulate query processing time based on privacy level
//   const delay = privacyLevel === "high" ? 2000 : privacyLevel === "medium" ? 1500 : 1000
//   await new Promise((resolve) => setTimeout(resolve, delay))

//   // Filter POIs based on category and radius
//   const results = mockPOIs
//     .filter((poi) => {
//       if (category && category !== "all" && poi.category.toLowerCase() !== category.toLowerCase()) {
//         return false
//       }

//       const poiLocation = {
//         latitude: Number.parseFloat(decrypt({ iv: "", content: poi.latitude })),
//         longitude: Number.parseFloat(decrypt({ iv: "", content: poi.longitude })),
//       }

//       const distance = calculateDistance(noisyLocation, poiLocation)
//       return distance <= radius
//     })
//     .map((poi) => ({
//       ...poi,
//       distance: Math.round(
//         calculateDistance(noisyLocation, {
//           latitude: Number.parseFloat(decrypt({ iv: "", content: poi.latitude })),
//           longitude: Number.parseFloat(decrypt({ iv: "", content: poi.longitude })),
//         }),
//       ),
//     }))
//     .sort((a, b) => a.distance - b.distance)

//   // Apply additional privacy measures for high privacy level
//   if (privacyLevel === "high") {
//     // Reduce precision of distances
//     results.forEach((result) => {
//       result.distance = Math.round(result.distance / 100) * 100
//     })

//     // Limit the number of results
//     return results.slice(0, 5)
//   }

//   return results
// }

// // Mock POI data for demonstration
// const mockPOIs: POI[] = [
//   {
//     id: "POI-001",
//     name: "encrypted_restaurant_name_1",
//     category: "Restaurant",
//     latitude: "encrypted_37.7749",
//     longitude: "encrypted_-122.4194",
//     description: "encrypted_description_1",
//   },
//   // Add more mock POIs...
// ]

import { decrypt } from "./encryption"
import { db } from "./db"

interface Location {
  latitude: number
  longitude: number
}

interface QueryParams {
  encryptedLocation: { latitude: string; longitude: string }
  category?: string
  radius: number
  privacyLevel: string
  userId?: string
}

interface POIResult {
  id: string
  name: string
  category: string
  distance: number
  rating: number
}

// Calculate distance between two points using Haversine formula
// function calculateDistance(point1: Location, point2: Location): number {
//   const R = 6371e3 // Earth's radius in meters
//   const φ1 = (point1.latitude * Math.PI) / 180
//   const φ2 = (point2.latitude * Math.PI) / 180
//   const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180
//   const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c
// }

function calculateDistance(point1: Location, point2: Location): number {
  // Check if inputs are valid numbers
  console.log("Distance calculation inputs:", point1, point2);
  
  // Earth's radius in meters
  const earthRadius = 6371000;
  
  // Convert degrees to radians
  const lat1 = (point1.latitude * Math.PI) / 180;
  const lon1 = (point1.longitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;
  const lon2 = (point2.longitude * Math.PI) / 180;
  
  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return distance;
}

// Add noise to coordinates based on privacy level
function addNoiseToLocation(location: Location, privacyLevel: string): Location {
  const noiseFactor = privacyLevel === "high" ? 0.001 : privacyLevel === "medium" ? 0.0005 : 0.0001
  return {
    latitude: location.latitude + (Math.random() - 0.5) * noiseFactor,
    longitude: location.longitude + (Math.random() - 0.5) * noiseFactor,
  }
}

// Generate a random rating between 3.5 and 5.0
function generateRating(): number {
  return Math.round((3.5 + Math.random() * 1.5) * 10) / 10
}

export async function processPrivacyPreservingQuery({
  encryptedLocation,
  category,
  radius,
  privacyLevel,
  userId,
}: QueryParams): Promise<POIResult[]> {
  // Decrypt the user's location
  const userLocation: Location = {
    latitude: Number.parseFloat(decrypt(encryptedLocation.latitude)),
    longitude: Number.parseFloat(decrypt(encryptedLocation.longitude))
  };

  console.log("User location:", userLocation); // Add this

  // Add noise to the location based on privacy level
  const noisyLocation = addNoiseToLocation(userLocation, privacyLevel)

  console.log("Search radius:", radius); // Add this

  // Simulate query processing time based on privacy level
  const delay = privacyLevel === "high" ? 2000 : privacyLevel === "medium" ? 1500 : 1000
  await new Promise((resolve) => setTimeout(resolve, delay))

  try {
    // Get POIs from database
    const whereClause = category && category !== "all" ? { category } : {}

    const pois = await db.pOI.findMany({
      where: whereClause,
    })
    console.log(`Found ${pois.length} POIs in database`); // Add this

    // Process POIs
    const results = pois
      .map((poi) => {
        try {
          // Decrypt POI coordinates
          const poiLocation = {
            latitude: Number.parseFloat(decrypt({ iv: "", content: poi.latitude })),
            longitude: Number.parseFloat(decrypt({ iv: "", content: poi.longitude })),
          }

          // Calculate distance
          const distance = calculateDistance(noisyLocation, poiLocation)

          // Only include POIs within radius
          if (distance <= radius) {
            return {
              id: poi.id,
              name: decrypt({ iv: "", content: poi.name }),
              category: poi.category,
              distance: Math.round(distance),
              rating: generateRating(),
            }
          }
          return null
        } catch (error) {
          console.error(`Error processing POI ${poi.id}:`, error)
          return null
        }
      })
      .filter((poi): poi is POIResult => poi !== null)
      .sort((a, b) => a.distance - b.distance)

    // Apply additional privacy measures for high privacy level
    if (privacyLevel === "high") {
      // Reduce precision of distances
      results.forEach((result) => {
        result.distance = Math.round(result.distance / 100) * 100
      })

      // Limit the number of results
      return results.slice(0, 5)
    }

    return results
  } catch (error) {
    console.error("Error in spatial query processing:", error)
    return []
  }
}

