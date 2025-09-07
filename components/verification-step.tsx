"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react"

interface VerificationStepProps {
  onNext: () => void
}

export function VerificationStep({ onNext }: VerificationStepProps) {
  const [isVerified, setIsVerified] = useState(false)

  const handleVerifyEmail = () => {
    // Simulate email verification
    setIsVerified(true)
    setTimeout(() => {
      onNext()
    }, 1500)
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="glass-strong shadow-2xl border-border/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 glass-subtle rounded-full flex items-center justify-center mb-4 shadow-lg">
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-primary drop-shadow-sm" />
            ) : (
              <Mail className="w-8 h-8 text-primary drop-shadow-sm" />
            )}
          </div>
          <CardTitle className="text-2xl text-balance text-foreground drop-shadow-sm">
            {isVerified ? "Email Verified!" : "Check Your Email"}
          </CardTitle>
          <CardDescription className="text-pretty text-muted-foreground">
            {isVerified
              ? "Your email has been successfully verified. Redirecting you to the next step..."
              : "We've sent a verification link to your email address. Click the button below to simulate email confirmation."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!isVerified ? (
            <Button
              onClick={handleVerifyEmail}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
            >
              Verify Email
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary drop-shadow-sm">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Verification Complete</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
