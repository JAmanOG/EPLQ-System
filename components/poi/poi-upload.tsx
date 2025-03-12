"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, Lock, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function POIUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    latitude: "",
    longitude: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    // Validate form
    if (!formData.name || !formData.category || !formData.latitude || !formData.longitude) {
      setError("Please fill in all required fields")
      setIsUploading(false)
      return
    }

    // Validate coordinates
    const lat = Number.parseFloat(formData.latitude)
    const lng = Number.parseFloat(formData.longitude)
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180")
      setIsUploading(false)
      return
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const response = await fetch("/api/poi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload POI")
      }

      // Complete progress
      setUploadProgress(100)

      // Clear form
      setFormData({
        name: "",
        category: "",
        latitude: "",
        longitude: "",
        description: "",
      })

      toast({
        title: "POI uploaded successfully",
        description: "The Point of Interest has been encrypted and stored in the database.",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed")
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading the POI data.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">POI Name *</Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter POI name"
            required
          />
          <div className="absolute right-3 top-3">
            <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">This will be encrypted before storage</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Restaurant">Restaurant</SelectItem>
            <SelectItem value="Hotel">Hotel</SelectItem>
            <SelectItem value="Attraction">Attraction</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Park">Park</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <div className="relative">
            <Input
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              type="number"
              step="0.000001"
              placeholder="e.g. 37.7749"
              required
            />
            <div className="absolute right-3 top-3">
              <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <div className="relative">
            <Input
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              type="number"
              step="0.000001"
              placeholder="e.g. -122.4194"
              required
            />
            <div className="absolute right-3 top-3">
              <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="relative">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter POI description"
            rows={3}
          />
          <div className="absolute right-3 top-3">
            <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Encrypting and uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button type="submit" disabled={isUploading} className="w-full">
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload POI Data"}
      </Button>
    </form>
  )
}

