"use client"

import { useState } from "react"
import { RegistrationForm } from "@/components/registration-form"
import { LoginForm } from "@/components/login-form"
import { VerificationStep } from "@/components/verification-step"
import { TokenCreation } from "@/components/token-creation"
import { AgriScanTesting } from "@/components/agriscan-testing"
import { PaymentForm } from "@/components/payment-form"
import { Dashboard } from "@/components/dashboard"
import { SignedIn, SignOutButton } from "@clerk/nextjs"

export type UserData = {
  username: string
  email: string
  password: string
  gender: string
  age: number
}

export type AppState = {
  step: number
  userData: UserData | null
  token: string | null
  points: number
  isLogin: boolean
  showPayment: boolean
  showDashboard: boolean
}

export default function AgriScanApp() {
  const [appState, setAppState] = useState<AppState>({
    step: 1,
    userData: null,
    token: null,
    points: 1000,
    isLogin: false,
    showPayment: false,
    showDashboard: false,
  })

  const nextStep = () => {
    setAppState((prev) => ({ ...prev, step: prev.step + 1 }))
  }

  const setUserData = (userData: UserData) => {
    setAppState((prev) => ({ ...prev, userData }))
  }

  const setToken = (token: string) => {
    setAppState((prev) => ({ ...prev, token }))
  }

  const updatePoints = (newPoints: number) => {
    setAppState((prev) => ({ ...prev, points: newPoints }))
  }

  const toggleLoginMode = () => {
    setAppState((prev) => ({ ...prev, isLogin: !prev.isLogin }))
  }

  const showPaymentForm = () => {
    setAppState((prev) => ({ ...prev, showPayment: true }))
  }

  const hidePaymentForm = () => {
    setAppState((prev) => ({ ...prev, showPayment: false }))
  }

  const handlePaymentComplete = (pointsPurchased: number) => {
    setAppState((prev) => ({
      ...prev,
      points: prev.points + pointsPurchased,
      showPayment: false,
    }))
  }

  const showDashboard = () => {
    setAppState((prev) => ({ ...prev, showDashboard: true }))
  }

  const hideDashboard = () => {
    setAppState((prev) => ({ ...prev, showDashboard: false }))
  }

  const skipToTesting = () => {
    setAppState((prev) => ({ ...prev, step: 4 }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lush-green-agricultural-fields-with-crops-and-farm.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <header className="relative z-10 glass-strong border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">AS</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground drop-shadow-sm">AgriScan</h1>
            </div>
            <div className="flex items-center gap-3">
              {appState.step === 4 && !appState.showDashboard && (
                <button
                  onClick={showDashboard}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Dashboard
                </button>
              )}
              {appState.showDashboard && (
                <button
                  onClick={hideDashboard}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                >
                  Back to Scanner
                </button>
              )}

              <SignedIn>
                <SignOutButton>
                  <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium">
                    Logout
                  </button>
                </SignOutButton>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {appState.showPayment && <PaymentForm onPaymentComplete={handlePaymentComplete} onCancel={hidePaymentForm} />}

          {appState.showDashboard && appState.step === 4 && (
            <Dashboard points={appState.points} userData={appState.userData} onBuyPoints={showPaymentForm} />
          )}

          {!appState.showDashboard && (
            <>
              {appState.step === 1 && !appState.isLogin && (
                <RegistrationForm onNext={nextStep} onUserData={setUserData} onToggleLogin={toggleLoginMode} />
              )}
              {appState.step === 1 && appState.isLogin && (
                <LoginForm onNext={skipToTesting} onUserData={setUserData} onToggleRegister={toggleLoginMode} />
              )}
              {appState.step === 2 && <VerificationStep onNext={nextStep} />}
              {appState.step === 3 && (
                <TokenCreation onNext={nextStep} onTokenCreated={setToken} points={appState.points} />
              )}
              {appState.step === 4 && (
                <AgriScanTesting points={appState.points} onUpdatePoints={updatePoints} onBuyPoints={showPaymentForm} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
