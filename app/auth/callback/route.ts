import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const supabase = await createClient()

  // Debug: log all incoming params
  const paramsObj: Record<string, string | null> = {}
  searchParams.forEach((v, k) => (paramsObj[k] = v))
  console.log("[auth/callback] Incoming params:", paramsObj)

  /**
   * 1) OAuth-style flow: ?code=...
   * (used when signing in with providers like Google, GitHub, etc.)
   */
  if (code) {
    console.log("[auth/callback] Handling OAuth code flow:", code)
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error("[auth/callback] exchangeCodeForSession error:", error)
        return NextResponse.redirect(`${origin}/auth/error?message=exchange_failed`)
      }
      if (data?.user) {
        console.log("[auth/callback] Session created for user:", data.user.id)
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error("[auth/callback] Exception in exchangeCodeForSession:", err)
      return NextResponse.redirect(`${origin}/auth/error?message=exchange_exception`)
    }
  }

  /**
   * 2) Access token + refresh token (email link / magic link flow)
   */
const accessToken = searchParams.get("access_token")
const refreshToken = searchParams.get("refresh_token")

if (accessToken) {
  console.log("[auth/callback] Handling access_token flow")
  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken ?? undefined,
    })

    if (error) {
      console.error("[auth/callback] setSession error:", error)
      return NextResponse.redirect(`${origin}/auth/error?message=set_session_failed`)
    }

    if (data?.user) {
      console.log("[auth/callback] Session restored for user:", data.user.id)
      return NextResponse.redirect(`${origin}${next}`)
    }
  } catch (err) {
    console.error("[auth/callback] Exception in setSession:", err)
    return NextResponse.redirect(`${origin}/auth/error?message=set_session_exception`)
  }
}


  /**
   * 3) Fallback: nothing matched
   */
  console.warn("[auth/callback] No auth params found, redirecting to login")
  return NextResponse.redirect(`${origin}/`)
}
