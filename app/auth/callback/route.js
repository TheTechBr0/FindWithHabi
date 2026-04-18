import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://find-with-habi.vercel.app"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) return NextResponse.redirect(SITE_URL + "/auth?error=no_code")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.session) return NextResponse.redirect(SITE_URL + "/auth?error=oauth_failed")

  const session = data.session
  const userId  = session.user.id
  const email   = session.user.email
  const name    = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email?.split("@")[0] || "User"
  const avatar  = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users").select("id, role").eq("id", userId).single()

  if (existingUser) {
    // Returning user — redirect by role
    if (existingUser.role === "admin") return NextResponse.redirect(SITE_URL + "/dashboard/admin")
    if (existingUser.role === "agent") return NextResponse.redirect(SITE_URL + "/dashboard/agent")
    return NextResponse.redirect(SITE_URL + "/dashboard/user")
  }

  // New user — always create as buyer
  await supabase.from("users").insert({
    id:         userId,
    email,
    full_name:  name,
    avatar_url: avatar || null,
    role:       "buyer",
  })

  return NextResponse.redirect(SITE_URL + "/dashboard/user")
}