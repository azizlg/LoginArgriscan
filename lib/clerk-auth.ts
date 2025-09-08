import { auth, currentUser } from "@clerk/nextjs/server"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  return await currentUser()
}

export async function getCurrentUserId() {
  const { userId } = await auth()
  return userId
}

export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", userId)  // Using clerk_id instead of id
    .single()

  return { data, error }
}

export async function createUserProfile(clerkUser: any) {
  const supabase = await createSupabaseClient()
  
  // Generate a unique token for the user
  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const profileData = {
    clerk_id: clerkUser.id,
    username: clerkUser.username || `user_${clerkUser.id.slice(0, 8)}`,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    gender: clerkUser.publicMetadata?.gender || null,
    age: clerkUser.publicMetadata?.age || null,
    points: 1000,
    token: generateToken()
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert(profileData)
    .select()
    .single()

  return { data, error }
}

export async function updateUserPoints(userId: string, newPoints: number) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({ points: newPoints })
    .eq("clerk_id", userId)  // Using clerk_id instead of id
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
  const supabase = await createSupabaseClient()
  
  // Get the profile id from clerk_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", scanData.user_id)
    .single()

  if (!profile) {
    return { data: null, error: { message: "Profile not found" } }
  }

  const { data, error } = await supabase
    .from("scans")
    .insert({
      ...scanData,
      user_id: profile.id  // Use the profile UUID instead of clerk_id
    })
    .select()
    .single()

  return { data, error }
}

export async function getUserScans(userId: string) {
  const supabase = await createSupabaseClient()
  
  // Get the profile id from clerk_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()

  if (!profile) {
    return { data: [], error: { message: "Profile not found" } }
  }

  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function createPayment(paymentData: {
  user_id: string
  amount: number
  points_purchased: number
  payment_method: string
}) {
  const supabase = await createSupabaseClient()
  
  // Get the profile id from clerk_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", paymentData.user_id)
    .single()

  if (!profile) {
    return { data: null, error: { message: "Profile not found" } }
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      ...paymentData,
      user_id: profile.id  // Use the profile UUID instead of clerk_id
    })
    .select()
    .single()

  return { data, error }
}
