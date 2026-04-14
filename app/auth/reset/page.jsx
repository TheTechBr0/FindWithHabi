"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

const T      = "#0097B2"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [showPw,    setShowPw]    = useState(false)
  const [showConf,  setShowConf]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState("")
  const [ready,     setReady]     = useState(false)

  useEffect(() => {
    // Supabase handles the token from URL automatically via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    if (password !== confirm) { setError("Passwords do not match."); return }
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => router.push("/auth"), 3000)
  }

  const inputBase = {
    flex: 1, padding: "13px 14px", background: "transparent", border: "none",
    outline: "none", fontSize: 15, color: "#fff",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  }

  return (
    <div style={{ minHeight: "100svh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif", padding: "20px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/">
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 56, width: "auto", objectFit: "contain" }} />
          </Link>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "36px 28px" }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#10b98118", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={34} color="#10b981" />
              </div>
              <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#fff" }}>Password Updated!</h2>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Redirecting you to login…</p>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f59e0b18", border: "2px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <AlertCircle size={28} color="#f59e0b" />
              </div>
              <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 900, color: "#fff" }}>Invalid or expired link</h2>
              <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                This reset link may have already been used or expired. Please request a new one.
              </p>
              <Link href="/auth" style={{ display: "inline-flex", padding: "11px 28px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#fff" }}>Set New Password</h2>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Choose a strong password for your account.</p>
              </div>

              {error && (
                <div style={{ padding: "12px 16px", borderRadius: 12, background: "#ef444420", border: "1px solid #ef444440", color: "#ef4444", fontSize: 13 }}>{error}</div>
              )}

              {/* New password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textTransform: "uppercase" }}>New Password</label>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14 }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = T}
                  onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
                  <div style={{ paddingLeft: 14 }}><Lock size={16} color="rgba(255,255,255,0.35)" /></div>
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" style={inputBase} />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{ paddingRight: 14, background: "none", border: "none", cursor: "pointer" }}>
                    {showPw ? <EyeOff size={16} color="rgba(255,255,255,0.4)" /> : <Eye size={16} color="rgba(255,255,255,0.4)" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Confirm Password</label>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14 }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = T}
                  onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
                  <div style={{ paddingLeft: 14 }}><Lock size={16} color="rgba(255,255,255,0.35)" /></div>
                  <input type={showConf ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={inputBase} />
                  <button type="button" onClick={() => setShowConf(p => !p)} style={{ paddingRight: 14, background: "none", border: "none", cursor: "pointer" }}>
                    {showConf ? <EyeOff size={16} color="rgba(255,255,255,0.4)" /> : <Eye size={16} color="rgba(255,255,255,0.4)" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 14, background: loading ? T + "70" : T, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", minHeight: 52, boxShadow: "0 6px 24px " + T_GLOW }}>
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { outline: none; }
      `}</style>
    </div>
  )
}