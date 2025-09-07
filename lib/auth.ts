import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  return { data, error }
}

export async function updateUserPoints(userId: string, newPoints: number) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({ points: newPoints })
    .eq("id", userId)
    .select()
    .single()

  return { data, error }
}

export async function createScan(scanData: {
  user_id: string
  image_url?: string
  result: string
  confidence: number
  treatment?: string
  location?: string
  points_used?: number
}) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("scans").insert(scanData).select().single()

  return { data, error }
}

export async function getUserScans(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function createPayment(paymentData: {
  user_id: string
  amount: number
  points_purchased: number
  payment_method: string
}) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("payments").insert(paymentData).select().single()

  return { data, error }
}
