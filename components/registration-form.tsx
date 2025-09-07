"use client"

import type React from "react"
import { EmailVerification } from "./email-verification"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, LogIn } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { UserData } from "@/app/page"

interface RegistrationFormProps {
  onNext: () => void
  onUserData: (userData: UserData) => void
  onToggleLogin: () => void
}

export function RegistrationForm({ onNext, onUserData, onToggleLogin }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const minLength = password.length >= 8

    return hasUppercase && hasLowercase && hasNumber && hasSymbol && minLength
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, symbol, and be at least 8 characters"
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    const age = Number.parseInt(formData.age)
    if (isNaN(age) || age < 13 || age > 120) {
      newErrors.age = "Age must be between 13 and 120"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      console.log("[v0] Starting signup process for:", formData.email)

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/callback",
        },
      })

      console.log("[v0] Supabase signup response data:", data)
      console.log("[v0] Supabase signup response error:", error)

      if (error) {
        // Log full error and show serialized error to the user for debugging
        console.error("[v0] Supabase signup error full:", error)
        if ((error.message || "").includes("already registered")) {
          setErrors({ general: "An account with this email already exists. Please try signing in instead." })
        } else {
          setErrors({ general: JSON.stringify(error) })
        }
        return
      }

      if (data?.user) {
        console.log("[v0] User created successfully, user ID:", data.user.id)
        console.log("[v0] Email confirmation required:", !data.user.email_confirmed_at)
        setRegisteredEmail(formData.email)
        setShowEmailVerification(true)
      } else {
        // Unexpected empty response
        console.warn('[v0] Signup returned no user and no error', { data })
        setErrors({ general: JSON.stringify({ data, message: 'No user returned from signup' }) })
      }
    } catch (error) {
      console.error("[v0] Registration error:", error)
      setErrors({ general: "An unexpected error occurred during registration. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerified = () => {
    const userData: UserData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      age: Number.parseInt(formData.age),
    }
    onUserData(userData)
    onNext()
  }

  const handleBackFromVerification = () => {
    setShowEmailVerification(false)
    setRegisteredEmail("")
  }

  if (showEmailVerification) {
    return (
      <EmailVerification
        email={registeredEmail}
        onVerified={handleEmailVerified}
        onBack={handleBackFromVerification}
        userData={{
          username: formData.username,
          gender: formData.gender,
          age: Number.parseInt(formData.age),
        }}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="glass-strong shadow-2xl border-border/30">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">Create Your Account</CardTitle>
            <CardDescription className="text-pretty text-foreground/90 text-lg">
              Join AgriScan to start analyzing your crops with AI-powered insights
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                className={`glass-input h-12 text-foreground placeholder:text-muted-foreground ${errors.username ? "border-destructive" : ""}`}
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={`glass-input h-12 text-foreground placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className={`glass-input h-12 text-foreground placeholder:text-muted-foreground ${errors.password ? "border-destructive" : ""}`}
                placeholder="Create a strong password"
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-foreground font-medium">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`glass-input h-12 text-foreground ${errors.gender ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select your gender" style={{ color: "rgba(248, 250, 252, 0.9)" }} />
                </SelectTrigger>
                <SelectContent className="glass-strong border-border/30">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-foreground font-medium">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                className={`glass-input h-12 text-foreground placeholder:text-muted-foreground ${errors.age ? "border-destructive" : ""}`}
                placeholder="Enter your age"
                disabled={isLoading}
              />
              {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
            </div>

            {errors.general && <p className="text-destructive text-sm">{errors.general}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-foreground/80">Already have an account?</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onToggleLogin}
              className="w-full h-12 glass-subtle border-border/60 text-foreground hover:bg-primary/10 font-medium bg-transparent"
              disabled={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
