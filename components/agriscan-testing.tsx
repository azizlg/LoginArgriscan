"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Scan, MapPin, Coins, AlertCircle, Leaf, CreditCard } from "lucide-react"
import { MapView } from "@/components/map-view"

interface AgriScanTestingProps {
  points: number
  onUpdatePoints: (newPoints: number) => void
  onBuyPoints: () => void // Added buy points callback prop
}

export type ScanResult = {
  id: string
  status: "healthy" | "unhealthy"
  location: { lat: number; lng: number }
  timestamp: Date
  confidence: number
}

export function AgriScanTesting({ points, onUpdatePoints, onBuyPoints }: AgriScanTestingProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.log("[v0] Geolocation not supported, using default location")
        setUserLocation({ lat: 40.7128, lng: -74.006 })
        setLocationError("Geolocation not supported by this browser")
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLocationError(null)
          console.log("[v0] User location obtained:", { lat: latitude, lng: longitude })
        },
        (error) => {
          console.log("[v0] Geolocation error, using default:", error.message)
          setUserLocation({ lat: 40.7128, lng: -74.006 })
          setLocationError(`Location access denied: ${error.message}`)
        },
        {
          enableHighAccuracy: false, // Reduced accuracy for faster response
          timeout: 5000, // Reduced timeout to 5 seconds
          maximumAge: 600000, // Accept cached location up to 10 minutes
        },
      )
    }

    getUserLocation()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB")
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const runAgriScanTest = async () => {
    if (!selectedImage || points < 5 || !userLocation) return

    setIsScanning(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isHealthy = Math.random() > 0.4 // Slightly favor healthy results
    const confidence = Math.floor(Math.random() * 15) + 85 // Higher confidence range 85-99%

    const lat = userLocation.lat + (Math.random() - 0.5) * 0.002 // ~200m radius
    const lng = userLocation.lng + (Math.random() - 0.5) * 0.002

    const newResult: ScanResult = {
      id: Date.now().toString(),
      status: isHealthy ? "healthy" : "unhealthy",
      location: { lat, lng },
      timestamp: new Date(),
      confidence,
    }

    setScanResults((prev) => [newResult, ...prev])
    onUpdatePoints(points - 5)
    setIsScanning(false)

    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const canRunTest = points >= 5 && selectedImage && !isScanning && userLocation

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center glass-subtle rounded-2xl p-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/20 rounded-full">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-balance">AgriScan Testing</h1>
        </div>
        <p className="text-muted-foreground text-lg text-pretty max-w-2xl mx-auto">
          Upload crop images to analyze plant health using AI-powered scanning technology
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Upload className="w-6 h-6 text-primary" />
                  Upload Image
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent-foreground"
                  >
                    <Coins className="w-4 h-4" />
                    {points} points
                  </Badge>
                  {points < 5 && (
                    <Button
                      onClick={onBuyPoints}
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Points
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="text-base">
                Select a crop image to analyze for health assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative border-2 border-dashed border-border/60 rounded-xl p-8 text-center glass-input transition-all duration-200 hover:border-primary/60">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Selected crop"
                      className="max-w-full max-h-56 mx-auto rounded-xl object-cover shadow-lg"
                    />
                    <p className="text-sm font-medium text-muted-foreground">{selectedImage?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                      <Upload className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Click to upload an image</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {locationError && (
                <Alert className="glass-subtle border-accent/50">
                  <AlertCircle className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-accent-foreground">
                    {locationError} - Using default location for testing.
                  </AlertDescription>
                </Alert>
              )}

              {points < 5 && (
                <Alert className="glass-subtle border-destructive/50">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-destructive-foreground">
                      Insufficient points. You need at least 5 points to run a test.
                    </span>
                    <Button
                      onClick={onBuyPoints}
                      size="sm"
                      className="ml-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Buy Points
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={runAgriScanTest}
                disabled={!canRunTest}
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <Scan className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing Crop Health...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-3" />
                    Run AgriScan Test (5 points)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {scanResults.length > 0 && (
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Leaf className="w-6 h-6 text-primary" />
                  Recent Scan Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {scanResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 glass-subtle rounded-xl">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-4 h-4 rounded-full shadow-lg ${
                            result.status === "healthy"
                              ? "bg-green-500 shadow-green-500/50"
                              : "bg-red-500 shadow-red-500/50"
                          }`}
                        />
                        <div>
                          <p className="font-semibold capitalize text-lg">{result.status}</p>
                          <p className="text-sm text-muted-foreground">{result.confidence}% confidence</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{result.timestamp.toLocaleTimeString()}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.location.lat.toFixed(4)}, {result.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="glass-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="w-6 h-6 text-primary" />
              Scan Results Map
            </CardTitle>
            <CardDescription className="text-base">
              View your scan results plotted on the map with health indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden">
              <MapView results={scanResults} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
