import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) return NextResponse.redirect(origin + "/auth?error=no_code")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !session) return NextResponse.redirect(origin + "/auth?error=oauth_failed")

  const userId = session.user.id
  const email  = session.user.email
  const name   = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email?.split("@")[0] || "User"
  const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users").select("id, role").eq("id", userId).single()

  if (existingUser) {
    // Returning user — redirect by role
    if (existingUser.role === "admin") return NextResponse.redirect(origin + "/dashboard/admin")
    if (existingUser.role === "agent") return NextResponse.redirect(origin + "/dashboard/agent")
    return NextResponse.redirect(origin + "/dashboard/user")
  }

  // New user — redirect to role picker with their info in query params
  const params = new URLSearchParams({
    new:    "1",
    name:   name,
    email:  email,
    avatar: avatar || "",
    uid:    userId,
  })
  return NextResponse.redirect(origin + "/auth/pick-role?" + params.toString())
}