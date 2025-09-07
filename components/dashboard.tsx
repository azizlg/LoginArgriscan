"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Calendar,
  MapPin,
  Download,
  Eye,
  TrendingUp,
  Leaf,
  AlertTriangle,
  CheckCircle,
  User,
  CreditCard,
  Key,
} from "lucide-react"

interface DashboardProps {
  points: number
  userData: any
  onBuyPoints: () => void
}

// Mock data for demonstration
const mockScans = [
  {
    id: 1,
    date: "2024-01-15",
    time: "14:30",
    image: "/placeholder-uwum6.png",
    result: "Healthy",
    confidence: 95,
    treatment: "Continue current care routine",
    location: "Field A-1",
  },
  {
    id: 2,
    date: "2024-01-14",
    time: "09:15",
    image: "/placeholder-w5qcg.png",
    result: "Wheat Rust",
    confidence: 87,
    treatment: "Apply fungicide treatment within 48 hours",
    location: "Field B-3",
  },
  {
    id: 3,
    date: "2024-01-13",
    time: "16:45",
    image: "/placeholder-bzzds.png",
    result: "Healthy",
    confidence: 92,
    treatment: "Maintain current irrigation schedule",
    location: "Field C-2",
  },
  {
    id: 4,
    date: "2024-01-12",
    time: "11:20",
    image: "/placeholder-0hsth.png",
    result: "Late Blight",
    confidence: 89,
    treatment: "Remove affected plants, apply copper-based fungicide",
    location: "Field A-4",
  },
]

const diseaseData = [
  { name: "Healthy", value: 65, color: "#22c55e" },
  { name: "Wheat Rust", value: 15, color: "#ef4444" },
  { name: "Late Blight", value: 12, color: "#f97316" },
  { name: "Powdery Mildew", value: 8, color: "#eab308" },
]

const timelineData = [
  { month: "Oct", healthy: 45, diseased: 12 },
  { month: "Nov", healthy: 52, diseased: 8 },
  { month: "Dec", healthy: 48, diseased: 15 },
  { month: "Jan", healthy: 65, diseased: 10 },
]

export function Dashboard({ points, userData, onBuyPoints }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const totalScans = mockScans.length
  const healthyScans = mockScans.filter((scan) => scan.result === "Healthy").length
  const diseaseScans = totalScans - healthyScans
  const mostCommonDisease = "Wheat Rust"

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="glass-strong rounded-xl p-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">AgriScan Dashboard</h2>
        <p className="text-muted-foreground">Monitor your crop health and scan analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-subtle">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scans" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            My Scans
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Scans</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalScans}</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Healthy Plants</CardTitle>
                <CheckCircle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{healthyScans}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((healthyScans / totalScans) * 100)}% of total scans
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Diseased Plants</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{diseaseScans}</div>
                <p className="text-xs text-muted-foreground">Most common: {mostCommonDisease}</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Remaining Credits</CardTitle>
                <CreditCard className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{points}</div>
                <Button onClick={onBuyPoints} size="sm" className="mt-2 w-full">
                  Buy More Points
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription>Your latest scan results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScans.slice(0, 3).map((scan) => (
                  <div key={scan.id} className="flex items-center space-x-4 p-3 glass-subtle rounded-lg">
                    <img
                      src={scan.image || "/placeholder.svg"}
                      alt="Scan"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{scan.result}</p>
                        <Badge variant={scan.result === "Healthy" ? "default" : "destructive"}>
                          {scan.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {scan.date} at {scan.time} • {scan.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-foreground">Scan History</CardTitle>
              <CardDescription>Complete list of all your plant scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScans.map((scan) => (
                  <div key={scan.id} className="flex items-start space-x-4 p-4 glass-subtle rounded-lg">
                    <img
                      src={scan.image || "/placeholder.svg"}
                      alt="Scan"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">{scan.result}</h3>
                        <Badge variant={scan.result === "Healthy" ? "default" : "destructive"}>
                          {scan.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {scan.date} at {scan.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {scan.location}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{scan.treatment}</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-foreground">Disease Distribution</CardTitle>
                <CardDescription>Breakdown of detected conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diseaseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {diseaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-foreground">Health Trends</CardTitle>
                <CardDescription>Plant health over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="healthy" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="diseased" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Scan Activity</CardTitle>
              <CardDescription>Number of scans performed each month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="healthy" fill="#22c55e" />
                  <Bar dataKey="diseased" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <p className="text-muted-foreground">{userData?.username || "John Farmer"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <p className="text-muted-foreground">{userData?.email || "john@example.com"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Points Remaining</label>
                  <div className="flex items-center gap-2">
                    <Progress value={(points / 1000) * 100} className="flex-1" />
                    <span className="text-sm font-medium text-accent">{points}</span>
                  </div>
                </div>
                <Button onClick={onBuyPoints} className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase More Points
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-foreground">API Access</CardTitle>
                <CardDescription>For advanced users and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API Token</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
                      agri_scan_***************
                    </code>
                    <Button size="sm" variant="outline">
                      <Key className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Usage This Month</label>
                  <Progress value={75} />
                  <p className="text-xs text-muted-foreground">750 / 1000 API calls used</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  View API Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
