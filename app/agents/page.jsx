"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  Search, MapPin, Star, Phone, MessageCircle, ArrowRight,
  CheckCircle, Award, TrendingUp, Shield, X, ChevronDown,
  ChevronRight, Building2, Users, Menu,
  Send, Check, Loader, BadgeCheck,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const STATES = ["All States","Lagos","Abuja","Rivers","Enugu","Delta","Kano","Anambra","Imo","Oyo","Kaduna","Cross River","Akwa Ibom","Ogun"]
const SORTS  = ["Top Rated","Most Listings","Most Reviews","Newest"]

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [authUser,  setAuthUser]  = useState(null)
  const [userRole,  setUserRole]  = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user)
      if (user) {
        supabase.from("users").select("role").eq("id", user.id).single()
          .then(({ data }) => setUserRole(data?.role || "buyer"))
      }
      setAuthReady(true)
    })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const dashboardLink = userRole === "admin" ? "/dashboard/admin"
                      : userRole === "agent" ? "/dashboard/agent"
                      : "/dashboard/user"

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? "rgba(8,15,20,0.97)" : "rgba(8,15,20,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.3s" }}>
      <div className="nav-inner" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 64, width: "auto", objectFit: "contain" }} />
        </Link>
        <nav className="desktop-nav" style={{ display: "none", alignItems: "center", gap: 28 }}>
          {[["Listings","/listings"],["Agents","/agents"],["Cities","/#cities"],["Blog","#"]].map(([label,href]) => (
            <Link key={label} href={href}
              style={{ color: label === "Agents" ? "#fff" : "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: label === "Agents" ? 800 : 600, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = label === "Agents" ? "#fff" : "rgba(255,255,255,0.7)"}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {authReady && (
            authUser
              ? <Link href={dashboardLink} className="auth-btn" style={{ display: "none", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
                  My Dashboard
                </Link>
              : <div className="auth-btn" style={{ display: "none", alignItems: "center", gap: 8 }}>
                  <Link href="/auth?mode=login" style={{ padding: "9px 18px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
                    Login
                  </Link>
                  <Link href="/auth?mode=signup" style={{ padding: "9px 18px", borderRadius: 50, background: T, color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
                    Sign Up
                  </Link>
                </div>
          )}
          <div className="hamburger-wrap" style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(p => !p)}
              style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {menuOpen ? <X size={18} color="#fff" /> : <Menu size={18} color="#fff" />}
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 20, width: 210, background: "rgba(8,15,20,0.97)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", animation: "dropIn 0.15s ease" }}>
                  {[["Listings","/listings"],["Agents","/agents"],["Blog","#"], authUser ? ["My Dashboard",dashboardLink] : ["Login","/auth"]].map(([label,href],i,arr) => (
                    <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", minHeight: 48, padding: "0 20px", color: i === arr.length-1 ? T : "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: i === arr.length-1 ? 800 : 600, textDecoration: "none", borderBottom: i === arr.length-1 ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
                      {label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen]     = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const btnRef  = useRef(null)
  const menuRef = useRef(null)
  const active  = !!(value)

  const openMenu = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setCoords({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 190) })
    }
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const fn = (e) => {
      if (btnRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [open])

  return (
    <>
      <button ref={btnRef} onClick={() => open ? setOpen(false) : openMenu()}
        style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 50, cursor: "pointer", whiteSpace: "nowrap", minHeight: 40, flexShrink: 0, border: "1.5px solid " + (open || active ? T : "#e2e8f0"), background: active ? T + "12" : "#fff", color: active ? T : "#0d1f2d", fontSize: 13, fontWeight: 700, transition: "all 0.18s" }}>
        {active ? value : label}
        <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div ref={menuRef} style={{ position: "fixed", top: coords.top, left: coords.left, minWidth: coords.width, zIndex: 9999, background: "#fff", border: "1.5px solid #e8edf2", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.16)", overflow: "hidden", animation: "dropIn 0.15s ease", maxHeight: "60vh", overflowY: "auto" }}>
          {options.map(opt => {
            const sel = value === opt
            return (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 18px", border: "none", cursor: "pointer", background: sel ? T + "12" : "#fff", color: sel ? T : "#1a2332", fontSize: 14, fontWeight: sel ? 700 : 500, borderBottom: "1px solid #f4f7fa", transition: "background 0.12s" }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "#f4f8fb" }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "#fff" }}>
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

// ─── Contact Modal ────────────────────────────────────────────────────────────
function ContactModal({ agent, onClose, authUser, userData }) {
  const agentName  = agent.users?.full_name || "Agent"
  const agentPhone = agent.users?.phone     || ""
  const [message, setMessage] = useState("Hello " + agentName.split(" ")[0] + ", I found your profile on FindWithHabi and would like to discuss a property.")
  const [phone,   setPhone]   = useState(userData?.phone || "")
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const fn = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", fn) }
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    if (!authUser) { window.location.href = "/auth"; return }
    setLoading(true)
    await supabase.from("enquiries").insert({
      agent_id:     agent.id,
      user_id:      authUser.id,
      sender_name:  userData?.full_name || authUser.email,
      sender_email: userData?.email     || authUser.email,
      sender_phone: phone,
      message,
      status:       "new",
    })
    setLoading(false)
    setSent(true)
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 15, color: "#0d1f2d", fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} className="modal-outer">
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8,15,20,0.7)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px 32px", boxShadow: "0 -24px 64px rgba(0,0,0,0.2)", animation: "slideUp 0.3s ease", maxHeight: "88svh", overflowY: "auto" }} className="modal-desktop">
        <div style={{ width: 40, height: 4, borderRadius: 50, background: "#e2e8f0", margin: "0 auto 20px" }} />
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T + "12", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={28} color={T} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Message Sent!</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Check your dashboard for the agent's reply.</p>
            <button onClick={onClose} style={{ width: "100%", padding: "14px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid #f1f5f9" }}>
              {agent.users?.avatar_url
                ? <img src={agent.users.avatar_url} alt={agentName} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2.5px solid " + T, flexShrink: 0 }} />
                : <div style={{ width: 52, height: 52, borderRadius: "50%", background: T + "20", border: "2.5px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T, flexShrink: 0 }}>{agentName.charAt(0)}</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>{agentName}</span>
                  {agent.is_verified && <BadgeCheck size={15} color="#10b981" />}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{[agent.users?.city, agent.users?.state].filter(Boolean).join(", ") || "Nigeria"}</div>
              </div>
              <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <X size={15} color="#64748b" />
              </button>
            </div>

            {agentPhone && (
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <a href={"tel:" + agentPhone} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", borderRadius: 12, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 14px " + T_GLOW }}>
                  <Phone size={14} /> Call
                </a>
                <a href={"https://wa.me/" + agentPhone.replace(/\D/g,"") + "?text=" + encodeURIComponent("Hello " + agentName.split(" ")[0] + ", I found your profile on FindWithHabi.")}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", borderRadius: 12, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            )}

            {!authUser ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#64748b" }}>Login to send a message to this agent</p>
                <a href="/auth" style={{ display: "inline-flex", padding: "11px 28px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>Login</a>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: T + "08", border: "1px solid " + T + "20" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                    {(userData?.full_name || authUser.email)?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{userData?.full_name || "User"}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{userData?.email || authUser.email}</div>
                  </div>
                </div>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number (optional)" type="tel" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                  onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "14px", borderRadius: 14, background: loading ? T + "70" : T, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52 }}>
                  {loading ? <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────
function AgentSkeleton() {
  const shimmer = { background: "linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
  return (
    <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #f1f5f9", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ ...shimmer, width: 68, height: 68, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...shimmer, height: 16, width: "60%", marginBottom: 8 }} />
          <div style={{ ...shimmer, height: 12, width: "40%" }} />
        </div>
      </div>
      <div style={{ ...shimmer, height: 12, width: "80%", marginBottom: 8 }} />
      <div style={{ ...shimmer, height: 12, width: "50%", marginBottom: 20 }} />
      <div style={{ ...shimmer, height: 40, borderRadius: 10 }} />
    </div>
  )
}

// ─── Agent Card ───────────────────────────────────────────────────────────────
function AgentCard({ agent, index, onContact }) {
  const agentName   = agent.users?.full_name  || "Agent"
  const agentCity   = agent.users?.city       || ""
  const agentState  = agent.users?.state      || ""
  const agentPhone  = agent.users?.phone      || ""
  const agentAvatar = agent.users?.avatar_url
  // Show city + state, or just state, or "Nigeria"
  const agentLocation = agentCity && agentState ? agentCity + ", " + agentState
                      : agentCity  || agentState || "Nigeria"

  return (
    <article style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid " + (agent.is_verified ? T + "20" : "#f1f5f9"), boxShadow: agent.is_verified ? "0 4px 24px rgba(0,151,178,0.08)" : "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", animation: "fadeUp 0.5s ease " + (index * 60) + "ms both", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = agent.is_verified ? "0 4px 24px rgba(0,151,178,0.08)" : "0 2px 12px rgba(0,0,0,0.05)" }}>
      {agent.is_verified && <div style={{ height: 3, background: "linear-gradient(90deg," + T + ",#8b5cf6)" }} />}

      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {agentAvatar
              ? <img src={agentAvatar} alt={agentName} loading="lazy" style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", border: "3px solid " + T }} />
              : <div style={{ width: 68, height: 68, borderRadius: "50%", background: T + "20", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: T }}>{agentName.charAt(0)}</div>}
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", border: "2.5px solid #fff" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>{agentName}</h3>
              {agent.is_verified && <BadgeCheck size={16} color="#10b981" />}
            </div>
            <p style={{ margin: "0 0 7px", fontSize: 12, color: "#64748b" }}>{agentLocation} · Property Agent</p>
            {agent.is_verified
              ? <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 50, background: "#10b98115", border: "1px solid #10b98130" }}>
                  <BadgeCheck size={11} color="#10b981" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981" }}>Verified Agent</span>
                </div>
              : <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 50, background: "#f1f5f9" }}>
                  <Shield size={11} color="#94a3b8" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>Unverified</span>
                </div>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={13} color="#f59e0b" fill={i <= Math.round(agent.rating || 0) ? "#f59e0b" : "none"} />)}
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d", marginLeft: 3 }}>{agent.rating > 0 ? agent.rating : "New"}</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>({agent.total_reviews || 0})</span>
          </div>
          {agentLocation && agentLocation !== "Nigeria" && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} color={T} />
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{agentLocation}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 0, background: "#f8fafc", borderRadius: 14, overflow: "hidden", marginBottom: 18 }}>
          {[
            { val: agent.listing_count || 0, label: "Listings"  },
            { val: agent.total_reviews || 0, label: "Reviews"   },
            { val: agent.users?.created_at ? new Date(agent.users.created_at).getFullYear() : "—", label: "Since" },
          ].map(({ val, label }, i) => (
            <div key={i} style={{ flex: 1, padding: "10px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid #f1f5f9" : "none" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#0d1f2d" }}>{val}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onContact(agent)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", borderRadius: 12, background: T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px " + T_GLOW, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = T_DARK}
            onMouseLeave={e => e.currentTarget.style.background = T}>
            <MessageCircle size={14} /> Contact
          </button>
          <Link href={"/agents/" + agent.id}
            style={{ width: 44, height: 44, borderRadius: 12, background: "#f8fafc", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T + "12"; e.currentTarget.style.borderColor = T }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0" }}>
            <ArrowRight size={16} color="#64748b" />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [agents,       setAgents]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState("")
  const [stateFilter,  setStateFilter]  = useState("All States")
  const [sort,         setSort]         = useState("Top Rated")
  const [contactAgent, setContactAgent] = useState(null)
  const [authUser,     setAuthUser]     = useState(null)
  const [userData,     setUserData]     = useState(null)
  const [visible,      setVisible]      = useState(false)
  const [stats,        setStats]        = useState({ total: 0, verified: 0, avgRating: 0 })

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 80))

    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user)
      if (user) {
        supabase.from("users").select("full_name, email, phone").eq("id", user.id).single()
          .then(({ data }) => setUserData(data))
      }
    })

    const fetchAgents = async () => {
      // Stale-while-revalidate: show cache instantly, refresh in background
      const CACHE_KEY = "fwh_agents_v1"
      const CACHE_TTL = 3 * 60 * 1000 // 3 minutes
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data: cachedData, ts } = JSON.parse(cached)
          // Always show cached data instantly
          if (cachedData.agents) setAgents(cachedData.agents)
          if (cachedData.stats)  setStats(cachedData.stats)
          setLoading(false)
          // If fresh skip network, otherwise refresh silently
          if (Date.now() - ts < CACHE_TTL) return
        }
      } catch(e) {}

      const { data } = await supabase
        .from("agents")
        .select("*, users(full_name, avatar_url, phone, city, state, created_at)")
        .order("is_verified", { ascending: false })
        .order("rating",      { ascending: false })

      if (data && data.length > 0) {
        const ids = data.map(a => a.id)
        const { data: listingsData } = await supabase
          .from("listings").select("agent_id").in("agent_id", ids).eq("status", "active")
        const counts = {}
        if (listingsData) listingsData.forEach(l => { counts[l.agent_id] = (counts[l.agent_id] || 0) + 1 })
        const formatted = data.map(a => ({ ...a, listing_count: counts[a.id] || 0 }))
        setAgents(formatted)
        const verified  = formatted.filter(a => a.is_verified).length
        const rated     = formatted.filter(a => (a.rating || 0) > 0)
        const avgRating = rated.length > 0
          ? (rated.reduce((s, a) => s + Number(a.rating), 0) / rated.length).toFixed(1) : 0
        const stats = { total: formatted.length, verified, avgRating }
        setStats(stats)
        // Save to cache
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: { agents: formatted, stats }, ts: Date.now() })) } catch(e) {}
      }
      setLoading(false)
    }

    fetchAgents()
    return () => cancelAnimationFrame(raf)
  }, [])

  const openContact  = useCallback((agent) => setContactAgent(agent), [])
  const closeContact = useCallback(() => setContactAgent(null), [])

  const filtered = agents.filter(a => {
    const name  = a.users?.full_name || ""
    const city  = a.users?.city      || ""
    const state = a.users?.state     || ""
    const matchSearch = !search.trim() ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      city.toLowerCase().includes(search.toLowerCase()) ||
      state.toLowerCase().includes(search.toLowerCase())
    const matchState = stateFilter === "All States" ||
      state.toLowerCase() === stateFilter.toLowerCase() ||
      city.toLowerCase().includes(stateFilter.toLowerCase())
    return matchSearch && matchState
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Top Rated")     return (b.rating || 0) - (a.rating || 0)
    if (sort === "Most Listings") return (b.listing_count || 0) - (a.listing_count || 0)
    if (sort === "Most Reviews")  return (b.total_reviews || 0) - (a.total_reviews || 0)
    if (sort === "Newest") return new Date(b.users?.created_at || 0) - new Date(a.users?.created_at || 0)
    return 0
  })

  const verifiedAgents = sorted.filter(a => a.is_verified)
  const otherAgents    = sorted.filter(a => !a.is_verified)
  const hasFilters     = stateFilter !== "All States" || !!search.trim()

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  })

  return (
    <>
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <NavBar />

      {/* Hero */}
      <div style={{ background: DARK, paddingTop: 64, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: "5%", width: "clamp(200px,35vw,380px)", height: "clamp(200px,35vw,380px)", borderRadius: "50%", background: "radial-gradient(circle," + T + "20 0%,transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ maxWidth: 1400, margin: "0 auto", padding: "44px 16px 40px" }}>
          <div style={{ ...anim(0), display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
            <ChevronRight size={13} color="rgba(255,255,255,0.25)" />
            <span style={{ fontSize: 13, color: T, fontWeight: 700 }}>Agents</span>
          </div>
          <div style={{ ...anim(80), marginBottom: 28, maxWidth: 640 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 50, background: T + "18", border: "1px solid " + T + "40", marginBottom: 16 }}>
              <Shield size={12} color={T} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.06em", textTransform: "uppercase" }}>Verified Professionals</span>
            </div>
            <h1 style={{ margin: "0 0 14px", fontSize: "clamp(28px,6vw,56px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.06, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
              Find Your<br /><span style={{ color: T, textShadow: "0 0 40px " + T_GLOW }}>Perfect Agent</span>
            </h1>
            <p style={{ margin: 0, fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              {loading ? "Loading agents…" : `${stats.total} property specialists across Nigeria. Rated by real buyers.`}
            </p>
          </div>
          {/* Search */}
          <div style={{ ...anim(160), display: "flex", gap: 10, maxWidth: 620 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: "0 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", minHeight: 52 }}>
              <Search size={17} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city or state…"
                type="search" autoComplete="off"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: "#0d1f2d", fontFamily: "inherit", padding: "14px 0", minWidth: 0 }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={15} color="#94a3b8" /></button>}
            </div>
          </div>
          {/* Stats */}
          <div style={{ ...anim(240), display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, marginTop: 40, maxWidth: 560, background: "rgba(255,255,255,0.04)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }} className="stats-strip">
            {[
              { val: stats.total    || "—", label: "Total Agents"    },
              { val: stats.verified || "—", label: "Verified Agents" },
              { val: stats.avgRating > 0 ? stats.avgRating : "—", label: "Avg Rating" },
              { val: "36",                  label: "States Covered"  },
            ].map(({ val, label }, i) => (
              <div key={i} style={{ padding: "16px 18px", textAlign: "center", borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontSize: "clamp(18px,3.5vw,24px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 64, zIndex: 150, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="container" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", overflowX: "auto", scrollbarWidth: "none" }}>
            <Dropdown label="State" value={stateFilter !== "All States" ? stateFilter : ""} options={STATES} onChange={setStateFilter} />
            <Dropdown label="Sort"  value={sort} options={SORTS} onChange={setSort} />
            {hasFilters && (
              <button onClick={() => { setStateFilter("All States"); setSearch("") }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 50, border: "1.5px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, minHeight: 40, whiteSpace: "nowrap" }}>
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Agents grid */}
      <div className="container" style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 16px 64px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
            {[...Array(6)].map((_,i) => <AgentSkeleton key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Users size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#0d1f2d" }}>No agents found</h3>
            <p style={{ color: "#64748b", marginBottom: 20 }}>Try adjusting your search or filter</p>
            <button onClick={() => { setStateFilter("All States"); setSearch("") }}
              style={{ padding: "11px 28px", borderRadius: 50, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Verified agents first */}
            {verifiedAgents.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: "#10b98118", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BadgeCheck size={14} color="#10b981" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#10b981", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Verified Agents ({verifiedAgents.length})
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
                  {verifiedAgents.map((agent, i) => <AgentCard key={agent.id} agent={agent} index={i} onContact={openContact} />)}
                </div>
              </div>
            )}
            {/* Other agents */}
            {otherAgents.length > 0 && (
              <div>
                {verifiedAgents.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 9, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={14} color="#64748b" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Other Agents ({otherAgents.length})
                    </span>
                  </div>
                )}
                {/* Unverified agents warning notice */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderRadius: 16, background: "#fef3c7", border: "1.5px solid #f59e0b", marginBottom: 20 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#92400e" }}>Unverified Agents — Proceed with Caution</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
                      The agents listed below have <strong>not been verified</strong> by FindWithHabi. Their identities and credentials have not been confirmed by our team. Any dealings with unverified agents are <strong>entirely at your own risk</strong>. We strongly recommend working only with <span style={{ color: "#0097B2", fontWeight: 700 }}>verified agents</span> above.
                    </p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
                  {otherAgents.map((agent, i) => <AgentCard key={agent.id} agent={agent} index={i} onContact={openContact} />)}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        {!loading && (
          <div style={{ marginTop: 64, background: DARK, borderRadius: 24, padding: "40px 28px", position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: T + "15", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 50, background: T + "20", border: "1px solid " + T + "40", marginBottom: 16 }}>
                <TrendingUp size={12} color={T} />
                <span style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.06em", textTransform: "uppercase" }}>Join Our Network</span>
              </div>
              <h2 style={{ margin: "0 0 12px", fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>Are You a Property Agent?</h2>
              <p style={{ margin: "0 auto 28px", fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 420, lineHeight: 1.7 }}>
                Join verified agents on FindWithHabi and connect with thousands of serious buyers every month.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/auth" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: "#fff", color: T, textDecoration: "none", fontSize: 14, fontWeight: 900, minHeight: 48 }}>
                  Join as Agent <ArrowRight size={15} />
                </Link>
                <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, minHeight: 48 }}>
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {contactAgent && <ContactModal agent={contactAgent} onClose={closeContact} authUser={authUser} userData={userData} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; max-width: 100vw; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:focus, textarea:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        :focus-visible { outline: 2px solid ${T}; outline-offset: 3px; border-radius: 4px; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-6px) scale(0.98)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes popIn   { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        .hamburger-wrap { display: flex !important; }
        @media (min-width: 768px) {
          .nav-inner { padding: 0 24px !important; }
          .container { padding-left: 24px !important; padding-right: 24px !important; }
          .desktop-nav { display: flex !important; }
          .auth-btn    { display: flex !important; }
          .hamburger-wrap { display: none !important; }
          .stats-strip { grid-template-columns: repeat(4,1fr) !important; }
          .stats-strip > div { border-bottom: none !important; border-right: 1px solid rgba(255,255,255,0.06) !important; }
          .stats-strip > div:last-child { border-right: none !important; }
          .modal-outer { align-items: center !important; padding: 20px !important; }
          .modal-desktop { border-radius: 24px !important; }
        }
        @media (min-width: 1024px) {
          .nav-inner { padding: 0 32px !important; }
          .container { padding-left: 32px !important; padding-right: 32px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
    <footer style={{ background: "#080f14", padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025–2026 FindWithHabi · Nigeria's Trusted Property Platform</p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["About","/about"],["Blog","/blog"],["Careers","/careers"],["Privacy","/privacy"],["Terms","/terms"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: 600 }}>{label}</Link>
          ))}
        </div>
      </div>
    </footer>
    </>
  )
}