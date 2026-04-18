"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

const T    = "#0097B2"
const DARK = "#080f14"

function PickRole() {
  const router     = useRouter()
  const params     = useSearchParams()
  const [picking, setPicking] = useState(false)

  const uid    = params.get("uid")
  const name   = params.get("name")   || "User"
  const email  = params.get("email")  || ""
  const avatar = params.get("avatar") || null

  // If no uid in URL, not a valid Google flow — send back to auth
  useEffect(() => {
    if (!uid) router.push("/auth")
  }, [uid])

  const pickRole = async (role) => {
    if (!uid || picking) return
    setPicking(true)

    // Insert user with chosen role
    await supabase.from("users").insert({
      id:         uid,
      email,
      full_name:  name,
      avatar_url: avatar || null,
      role,
    })

    // If agent, create agents row
    if (role === "agent") {
      await supabase.from("agents").insert({
        user_id:       uid,
        is_verified:   false,
        rating:        0,
        total_reviews: 0,
      })
    }

    // Redirect to correct dashboard
    if (role === "agent") { router.push("/dashboard/agent"); return }
    router.push("/dashboard/user")
  }

  return (
    <div style={{
      minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
      background: DARK, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "24px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.5s ease both" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 48, objectFit: "contain" }} />
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, padding: "32px 28px",
        }}>
          {/* User info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {avatar
              ? <img src={avatar} alt={name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T }} />
              : <div style={{ width: 44, height: 44, borderRadius: "50%", background: T + "30", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: T }}>{name.charAt(0)}</div>}
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{email}</div>
            </div>
          </div>

          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            How will you use FindWithHabi?
          </h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            Choose your account type — this determines what you can do on the platform.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Buyer */}
            <button onClick={() => pickRole("buyer")} disabled={picking}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 16, border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", cursor: picking ? "not-allowed" : "pointer", textAlign: "left", transition: "all 0.2s", opacity: picking ? 0.6 : 1, width: "100%" }}
              onMouseEnter={e => { if (!picking) { e.currentTarget.style.border = "1.5px solid " + T; e.currentTarget.style.background = T + "12" } }}
              onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🏠</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 3 }}>I am looking for a property</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>Browse listings, save homes, contact agents</div>
              </div>
            </button>

            {/* Agent */}
            <button onClick={() => pickRole("agent")} disabled={picking}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 16, border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", cursor: picking ? "not-allowed" : "pointer", textAlign: "left", transition: "all 0.2s", opacity: picking ? 0.6 : 1, width: "100%" }}
              onMouseEnter={e => { if (!picking) { e.currentTarget.style.border = "1.5px solid #f59e0b"; e.currentTarget.style.background = "#f59e0b12" } }}
              onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f59e0b20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🏢</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 3 }}>I am a property agent</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>List properties, manage enquiries, get verified</div>
              </div>
            </button>
          </div>

          {picking && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 20, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Setting up your account…
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          You can only have one account type per Google account
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,700;9..40,800;9..40,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  )
}

export default function PickRolePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080f14" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0097B2" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    }>
      <PickRole />
    </Suspense>
  )
}