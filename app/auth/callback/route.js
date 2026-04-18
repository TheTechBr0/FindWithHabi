import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://find-with-habi.vercel.app"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) return NextResponse.redirect(SITE_URL + "/auth?error=no_code")

  const cookieStore = cookies()
  const response = NextResponse.redirect(SITE_URL + "/auth/pick-role")

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { response.cookies.set({ name, value, ...options }) },
        remove(name, options) { response.cookies.set({ name, value: "", ...options }) },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !session) return NextResponse.redirect(SITE_URL + "/auth?error=oauth_failed")

  const userId = session.user.id
  const email  = session.user.email
  const name   = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email?.split("@")[0] || "User"
  const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users").select("id, role").eq("id", userId).single()

  if (existingUser) {
    if (existingUser.role === "admin") { response.headers.set("Location", SITE_URL + "/dashboard/admin"); return response }
    if (existingUser.role === "agent") { response.headers.set("Location", SITE_URL + "/dashboard/agent"); return response }
    response.headers.set("Location", SITE_URL + "/dashboard/user")
    return response
  }

  // New user — create with buyer role, let pick-role update it
  await supabase.from("users").insert({
    id:         userId,
    email,
    full_name:  name,
    avatar_url: avatar || null,
    role:       "buyer",
  })

  // response already redirects to /auth/pick-role with session cookie set
  return response
}