export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: "USER" | "ADMIN"
  status: "ACTIVE" | "INACTIVE"
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date | null
}

export interface POI {
  id: string
  name: string
  category: string
  latitude: string
  longitude: string
  description?: string
  encryptionType: string
  createdAt: Date
  updatedAt: Date
  createdById: string
}

export interface QueryHistory {
  id: string
  userId: string
  category?: string
  radius: number
  privacyLevel: string
  resultCount: number
  createdAt: Date
}

