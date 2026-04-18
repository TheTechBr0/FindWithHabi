import { NextResponse } from "next/server"

const SITE_URL = "https://find-with-habi.vercel.app"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error")

  if (error) return NextResponse.redirect(SITE_URL + "/auth?error=" + error)

  // Redirect to complete page — Supabase will have set session via hash fragment
  return NextResponse.redirect(SITE_URL + "/auth/callback/complete")
}