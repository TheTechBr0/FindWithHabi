"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const T    = "#0097B2"
const DARK = "#080f14"

export default function PickRolePage() {
  const router      = useRouter()
  const [info, setInfo] = useState("Loading...")

  useEffect(() => {
    // Dynamically import supabase to catch any import errors
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) { setInfo("Error: " + error.message); return }
        if (!session) { setInfo("No session. Redirecting..."); setTimeout(() => router.push("/auth"), 2000); return }
        setInfo("Session found: " + session.user.email)
      }).catch(e => setInfo("getSession error: " + e.message))
    }).catch(e => setInfo("Import error: " + e.message))
  }, [])

  return (
    <div style={{ minHeight: "100svh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <p style={{ color: "#fff", fontSize: 16, fontFamily: "sans-serif", margin: 0 }}>{info}</p>
      </div>
    </div>
  )
}