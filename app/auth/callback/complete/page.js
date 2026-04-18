"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Suspense } from "react"

const T    = "#0097B2"
const DARK = "#080f14"

function Complete() {
  const router         = useRouter()
  const [status, setStatus] = useState("Signing you in…")

  useEffect(() => {
    const run = async () => {
      try {
        // Wait a moment for Supabase to process the hash fragment automatically
        await new Promise(r => setTimeout(r, 1500))

        // Supabase JS automatically detects the hash fragment and sets the session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          setStatus("No session found. Redirecting to login…")
          setTimeout(() => router.push("/auth"), 2000)
          return
        }

        const userId = session.user.id
        const email  = session.user.email
        const name   = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email?.split("@")[0] || "User"
        const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null

        setStatus("Setting up your account…")

        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users").select("id, role").eq("id", userId).single()

        if (existingUser) {
          setStatus("Welcome back! Redirecting…")
          if (existingUser.role === "admin") { router.push("/dashboard/admin"); return }
          if (existingUser.role === "agent") { router.push("/dashboard/agent"); return }
          router.push("/dashboard/user")
          return
        }

        // New user — create as buyer
        await supabase.from("users").insert({
          id:         userId,
          email,
          full_name:  name,
          avatar_url: avatar || null,
          role:       "buyer",
        })

        setStatus("Account created! Redirecting…")
        router.push("/dashboard/user")

      } catch (e) {
        setStatus("Error: " + e.message)
        setTimeout(() => router.push("/auth"), 3000)
      }
    }

    run()
  }, [])

  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: DARK, fontFamily: "sans-serif", gap: 16 }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100svh", background: "#080f14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0097B2" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    }>
      <Complete />
    </Suspense>
  )
}