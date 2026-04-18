import { NextResponse } from "next/server"

export async function GET(request) {
  const { origin, searchParams } = new URL(request.url)
  const code  = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) return NextResponse.redirect(origin + "/auth?error=" + error)
  if (!code) return NextResponse.redirect(origin + "/auth?error=no_code")

  return NextResponse.redirect(origin + "/auth/callback/complete?code=" + code)
}