"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  Search, MapPin, Home, Building2, Key, ArrowRight, ArrowUpRight,
  Star, Shield, Zap, Heart, Phone, Eye,
  Globe, MessageCircle, Share2, TrendingUp, CheckCircle,
  X, Sparkles, Award, Clock, Menu, ChevronDown, BadgeCheck, Bed, Bath, Maximize2,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const CITIES = [
  { name: "Lagos",         count: "300+", img: "/lagos.jpg",    accent: T          },
  { name: "Abuja",         count: "140+", img: "/abj.jpg",      accent: "#f59e0b"  },
  { name: "Port Harcourt", count: "88+",  img: "/ph.jpg",       accent: "#10b981"  },
  { name: "Enugu",         count: "70+",  img: "/enugu.jpg",    accent: "#8b5cf6"  },
  { name: "Imo",           count: "102+", img: "/owerri.jpg",   accent: "#ef4444"  },
  { name: "Anambra",       count: "40+",  img: "/anambra.jpg",  accent: "#f97316"  },
]

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setInView(true); return }
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ scrollY }) {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [authUser,  setAuthUser]  = useState(null)
  const [userRole,  setUserRole]  = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const solid = scrollY > 60

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => { if (e.key === "Escape") setMenuOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [menuOpen])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user)
      if (user) {
        supabase.from("users").select("role").eq("id", user.id).single()
          .then(({ data }) => setUserRole(data?.role || "buyer"))
      }
      setAuthReady(true)
    })
  }, [])

  const dashboardLink = userRole === "admin" ? "/dashboard/admin"
                      : userRole === "agent" ? "/dashboard/agent"
                      : "/dashboard/user"

  const mobileAuthItem = authUser
    ? ["My Dashboard", dashboardLink]
    : ["Login", "/auth?mode=login"]

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "background 0.4s ease, backdrop-filter 0.4s ease", background: solid ? "rgba(8,15,20,0.96)" : "transparent", backdropFilter: solid ? "blur(20px)" : "none", borderBottom: solid ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
      <div className="nav-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 64, width: "auto", objectFit: "contain" }} />
        </Link>

        <nav className="desktop-nav" style={{ display: "none", alignItems: "center", gap: 28 }}>
          {[["Listings","/listings"],["Agents","/agents"],["Blog","/blog"],["About","/about"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color="#fff"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.7)"}>
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {authReady && (
            authUser
              ? <Link href={dashboardLink} className="list-btn"
                  style={{ display: "none", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", transition: "background 0.2s" }}>
                  My Dashboard
                </Link>
              : <div style={{ display: "none", alignItems: "center", gap: 8 }} className="list-btn">
                  <Link href="/auth?mode=login"
                    style={{ alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", display: "flex" }}>
                    Login
                  </Link>
                  <Link href="/auth?mode=signup"
                    style={{ alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 50, background: T, color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", display: "flex", boxShadow: `0 4px 20px ${T_GLOW}` }}>
                    Sign Up
                  </Link>
                </div>
          )}
          <div className="hamburger-wrap" style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(p => !p)}
              style={{ width: 44, height: 44, borderRadius: 10, background: menuOpen ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {menuOpen ? <X size={18} color="#fff" /> : <Menu size={18} color="#fff" />}
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 20, width: 220, background: "rgba(8,15,20,0.97)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", animation: "dropIn 0.18s ease" }}>
                  {[["Listings","/listings"],["Agents","/agents"],["Blog","/blog"],["About","/about"], mobileAuthItem].map(([label,href],i,arr) => (
                    <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", padding: "0 20px", minHeight: 48, color: i === arr.length-1 ? T : "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: i === arr.length-1 ? 800 : 600, textDecoration: "none", borderBottom: i === arr.length-1 ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ stats }) {
  const [query,    setQuery]    = useState("")
  const [propType, setPropType] = useState("Any")
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 80))
    return () => cancelAnimationFrame(raf)
  }, [])

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(28px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("search", query.trim())
    if (propType !== "Any") params.set("type", propType.toLowerCase())
    window.location.href = "/listings" + (params.toString() ? "?" + params.toString() : "")
  }

  return (
    <section style={{ minHeight: "100svh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", background: DARK }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80" alt="" aria-hidden="true"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} loading="eager" />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${DARK} 0%, rgba(8,15,20,0.72) 50%, rgba(0,80,100,0.3) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,15,20,1) 0%, transparent 60%)" }} />
      </div>
      <div className="ambient-glow" style={{ position: "absolute", top: "15%", right: "10%", width: "min(300px,40vw)", height: "min(300px,40vw)", borderRadius: "50%", background: `radial-gradient(circle, ${T}20 0%, transparent 65%)`, zIndex: 1, pointerEvents: "none" }} />

      <div className="hero-inner" style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "calc(64px + 40px) 16px 56px", width: "100%" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ ...anim(0), display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 50, background: "rgba(0,151,178,0.12)", border: `1px solid ${T}44`, marginBottom: 20 }}>
            <Sparkles size={12} color={T} />
            <span style={{ color: T, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Nigeria&apos;s #1 Property Platform</span>
          </div>

          <h1 style={{ ...anim(100), margin: "0 0 18px", lineHeight: 1.06, letterSpacing: "-0.04em", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <span style={{ display: "block", fontSize: "clamp(36px,8.5vw,88px)", fontWeight: 900, color: "#fff" }}>Find Your</span>
            <span style={{ display: "block", fontSize: "clamp(36px,8.5vw,88px)", fontWeight: 900, color: T, textShadow: `0 0 60px ${T_GLOW}` }}>Dream Home</span>
            <span style={{ display: "block", fontSize: "clamp(36px,8.5vw,88px)", fontWeight: 900, color: "#fff" }}>Across Nigeria</span>
          </h1>

          <p style={{ ...anim(200), fontSize: "clamp(14px,2vw,18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
            Browse {stats.totalListings > 0 ? stats.totalListings.toLocaleString() + "+" : "thousands of"} verified properties across all 36 states. Buy, rent, or lease with total confidence.
          </p>

          {/* Search box */}
          <div className="hero-search" style={{ ...anim(300), background: "#fff", borderRadius: 18, padding: 8, display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 24px 64px rgba(0,0,0,0.4)", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, background: "#f8fafc", flex: 1 }}>
              <Search size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="City, neighbourhood, state…"
                className="search-input"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, color: "#0d1f2d", fontFamily: "inherit", minWidth: 0 }}
              />
            </div>
            <div className="search-controls" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={propType} onChange={e => setPropType(e.target.value)}
                  style={{ flex: 1, padding: "11px 12px", borderRadius: 12, border: "none", background: "#f8fafc", fontSize: 14, color: "#0d1f2d", outline: "none", cursor: "pointer", fontFamily: "inherit", minHeight: 44 }}>
                  {["Any","Buy","Rent","Lease","Commercial"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <button onClick={handleSearch}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 20px", borderRadius: 12, background: T, color: "#fff", fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: `0 4px 20px ${T_GLOW}`, minHeight: 44 }}>
                <Search size={15} /> Search Properties
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div style={{ ...anim(400), display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {[{ label: "Buy", icon: Home }, { label: "Rent", icon: Key }, { label: "Lease", icon: Building2 }, { label: "Commercial", icon: TrendingUp }].map(({ label, icon: Icon }) => (
              <Link key={label} href={`/listings?type=${label.toLowerCase()}`}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 50, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(10px)", flexShrink: 0, minHeight: 40 }}>
                <Icon size={13} /> {label}
              </Link>
            ))}
          </div>

          <div className="hero-list-cta" style={{ ...anim(450) }}>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <Link href="/auth?mode=signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: "#fff", color: T, fontSize: 14, fontWeight: 900, textDecoration: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", minHeight: 48 }}>
                Get Started Free
              </Link>
              <Link href="/auth?mode=login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", minHeight: 48 }}>
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Real stats strip */}
        <div className="stats-strip" style={{ ...anim(500), display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, marginTop: 48, maxWidth: 600, background: "rgba(255,255,255,0.04)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
          {[
            { val: stats.totalListings > 0 ? stats.totalListings.toLocaleString() + "+" : null, label: "Properties Listed" },
            { val: stats.totalUsers    > 0 ? stats.totalUsers.toLocaleString()    + "+" : null, label: "Registered Users"  },
            { val: stats.totalAgents   > 0 ? stats.totalAgents.toLocaleString()   + "+" : null, label: "Verified Agents"   },
            { val: "36",                                                                         label: "States Covered"   },
          ].map(({ val, label }, i) => (
            <div key={i} style={{ padding: "16px 18px", textAlign: "center", borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              {val === null ? (
                <div style={{ height: 28, width: 60, borderRadius: 8, background: "rgba(255,255,255,0.08)", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%", margin: "0 auto 4px" }} />
              ) : (
                <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</div>
              )}
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "bounce 2s ease-in-out infinite" }}>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Scroll</span>
        <ChevronDown size={14} color="rgba(255,255,255,0.25)" />
      </div>
    </section>
  )
}

// ─── Skeleton Cards ───────────────────────────────────────────────────────────
function ListingSkeleton() {
  const sh = { background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
  return (
    <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9", flexShrink: 0, width: "clamp(220px,58vw,265px)" }}>
      <div style={{ ...sh, height: 180, borderRadius: 0 }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...sh, height: 14, width: "70%" }} />
        <div style={{ ...sh, height: 11, width: "45%" }} />
        <div style={{ ...sh, height: 16, width: "40%", marginTop: 4 }} />
      </div>
    </div>
  )
}

function AgentCardSkeleton() {
  const sh = { background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #f1f5f9", minWidth: 200 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ ...sh, width: 52, height: 52, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...sh, height: 13, width: "65%", marginBottom: 7 }} />
          <div style={{ ...sh, height: 11, width: "45%" }} />
        </div>
      </div>
      <div style={{ ...sh, height: 36, borderRadius: 10 }} />
    </div>
  )
}

// ─── Featured Listings ────────────────────────────────────────────────────────
function FeaturedListings({ listings, loading }) {
  const [ref, inView] = useInView()
  const [saved, setSaved] = useState([])

  const toggleSave = useCallback((id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  if (!loading && listings.length === 0) return null

  return (
    <section ref={ref} className="section-listings" style={{ background: "#f8fafc", padding: "clamp(40px,8vw,72px) 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>✦ Hand-picked</div>
            <h2 style={{ margin: 0, fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Featured Listings
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>Hand-picked premium properties on FindWithHabi</p>
          </div>
          <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 50, border: `2px solid ${T}`, color: T, fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", minHeight: 44 }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal scroll strip */}
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
          {loading ? (
            [...Array(4)].map((_,i) => {
              const sh = { background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
              return (
                <div key={i} style={{ flexShrink: 0, width: "clamp(240px,70vw,300px)", background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9" }}>
                  <div style={{ ...sh, height: 196, borderRadius: 0 }} />
                  <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ ...sh, height: 15, width: "70%" }} />
                    <div style={{ ...sh, height: 11, width: "45%" }} />
                    <div style={{ ...sh, height: 18, width: "40%", marginTop: 4 }} />
                  </div>
                </div>
              )
            })
          ) : listings.map((l, i) => (
            <Link key={l.id} href={`/listings/${l.id}`}
              style={{ textDecoration: "none", flexShrink: 0, width: "clamp(240px,70vw,300px)", borderRadius: 20, overflow: "hidden", background: "#fff", border: "2px solid #f59e0b30", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "block", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ position: "relative", height: 196, background: "#f1f5f9", overflow: "hidden" }}>
                {l.cover_image
                  ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={36} color="#cbd5e1" /></div>}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                  <span style={{ background: "#f59e0b", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 50 }}>✦ Featured</span>
                </div>
                <button onClick={e => { e.preventDefault(); toggleSave(l.id) }} style={{ position: "absolute", top: 8, right: 8, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Heart size={14} color={saved.includes(l.id) ? "#ef4444" : "#94a3b8"} fill={saved.includes(l.id) ? "#ef4444" : "none"} />
                </button>
                <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                  <span style={{ background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 50 }}>{l.listing_type || "Buy"}</span>
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                  <MapPin size={11} color={T} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{l.city}, {l.state}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#fff", background: T, padding: "4px 12px", borderRadius: 50, boxShadow: "0 2px 8px rgba(0,151,178,0.3)" }}>{l.price_label}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{(l.views || 0).toLocaleString()} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


function CitiesSection() {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} id="cities" style={{ background: "#fff", padding: "72px 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 44, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Nationwide</div>
          <h2 style={{ margin: 0, fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", fontFamily: "'DM Sans', system-ui, sans-serif" }}>Explore by City</h2>
        </div>
        <div className="cities-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {CITIES.map((city, i) => (
            <Link key={i} href={`/listings?state=${encodeURIComponent(city.name)}`} className={i === 0 || i === 3 ? "city-wide" : ""}
              style={{ borderRadius: 18, overflow: "hidden", position: "relative", textDecoration: "none", display: "block", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms` }}>
              <img src={city.img} alt={city.name} loading="lazy" className={i === 0 || i === 3 ? "city-wide-img" : "city-img"} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{city.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>{city.count} properties</div>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={13} color="#fff" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why FindWithHabi ─────────────────────────────────────────────────────────
function WhySection() {
  const [ref, inView] = useInView()
  const features = [
    { icon: Shield,       title: "100% Verified Listings",  desc: "Every property personally vetted by licensed agents before going live.", color: T         },
    { icon: Zap,          title: "Lightning Fast Search",   desc: "Smart filters, map views, and instant results across all 36 states.", color: "#f59e0b"   },
    { icon: Award,        title: "Top-Rated Agents",        desc: "Nigeria's most trusted agents — rated and reviewed by real buyers.",  color: "#8b5cf6"   },
    { icon: CheckCircle,  title: "Secure Transactions",     desc: "Escrow-backed payments ensure your money is always protected.",        color: "#10b981"   },
    { icon: Clock,        title: "24/7 Support",            desc: "Property experts available around the clock to answer instantly.",     color: "#ef4444"   },
    { icon: TrendingUp,   title: "Market Insights",         desc: "Real-time pricing trends, neighbourhood scores, and ROI data.",        color: "#f97316"   },
  ]
  return (
    <section ref={ref} style={{ background: DARK, padding: "72px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "min(500px,80vw)", height: "min(300px,40vw)", borderRadius: "50%", background: `radial-gradient(ellipse, ${T}15 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 52, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Why Choose Us</div>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(22px,5vw,52px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'DM Sans', system-ui, sans-serif" }}>Built for Nigerians,<br />by Nigerians</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Making property discovery seamless, safe, and trustworthy across every state.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,260px),1fr))", gap: 14 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} style={{ padding: "24px", borderRadius: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 800, color: "#fff" }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Agents ───────────────────────────────────────────────────────────────────
function AgentsSection({ agents }) {
  const [ref, inView] = useInView()

  const displayAgents = agents.length > 0 ? agents : []

  return (
    <section ref={ref} id="agents" className="section-agents" style={{ background: "#f8fafc", padding: "clamp(40px,8vw,72px) 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 44, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Our People</div>
            <h2 style={{ margin: 0, fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", fontFamily: "'DM Sans', system-ui, sans-serif" }}>Top Agents</h2>
          </div>
          <Link href="/agents" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 50, border: `2px solid ${T}`, color: T, fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", minHeight: 44 }}>
            Meet All Agents <ArrowRight size={14} />
          </Link>
        </div>

        {displayAgents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
            <Shield size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>No agents yet — be the first to join!</p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {displayAgents.slice(0, 4).map((agent, i) => (
              <div key={agent.id} style={{ background: "#fff", borderRadius: 22, padding: "24px 20px", textAlign: "center", border: "1px solid " + (agent.is_verified ? T + "20" : "#f1f5f9"), boxShadow: agent.is_verified ? "0 4px 20px rgba(0,151,178,0.08)" : "0 2px 8px rgba(0,0,0,0.04)", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`, display: "flex", flexDirection: "column", flexShrink: 0, width: "clamp(240px,70vw,280px)" }}>
                {agent.is_verified && <div style={{ height: 3, background: "linear-gradient(90deg," + T + ",#8b5cf6)", borderRadius: "3px 3px 0 0", margin: "-24px -20px 16px" }} />}
                <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 12px", flexShrink: 0 }}>
                  {agent.users?.avatar_url
                    ? <img src={agent.users.avatar_url} alt={agent.users.full_name} loading="lazy" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid " + T }} />
                    : <div style={{ width: 72, height: 72, borderRadius: "50%", background: T + "20", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: T }}>{agent.users?.full_name?.charAt(0) || "A"}</div>}
                  <div style={{ position: "absolute", bottom: 2, right: 2, width: 13, height: 13, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 3 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{agent.users?.full_name || "Agent"}</h3>
                  {agent.is_verified && <BadgeCheck size={15} color="#10b981" />}
                </div>
                <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748b" }}>
                  {[agent.users?.city, agent.users?.state].filter(Boolean).join(", ") || "Nigeria"} · Agent
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16, padding: "10px 0", borderTop: "1px solid #f8fafc", borderBottom: "1px solid #f8fafc" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>{agent.listing_count || 0}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>Listings</div>
                  </div>
                  <div style={{ width: 1, background: "#f1f5f9" }} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0d1f2d", display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={13} color="#f59e0b" fill="#f59e0b" /> {agent.rating > 0 ? agent.rating : "—"}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>Rating</div>
                  </div>
                  <div style={{ width: 1, background: "#f1f5f9" }} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>{agent.total_reviews || 0}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>Reviews</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <Link href={"/agents/" + agent.id}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 11, background: T, color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 14px " + T_GLOW }}>
                    View Profile
                  </Link>
                  {agent.users?.phone && (
                    <a href={"tel:" + agent.users.phone}
                      style={{ width: 42, height: 42, borderRadius: 11, background: "#f8fafc", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
                      <Phone size={16} color="#64748b" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


// ─── Popular Listings ─────────────────────────────────────────────────────────
function PopularListings({ listings }) {
  if (listings.length === 0) return null

  return (
    <section style={{ background: "#fff", padding: "clamp(40px,8vw,72px) 0", overflow: "hidden" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>🔥 Trending Now</div>
            <h2 style={{ margin: 0, fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "'DM Sans', system-ui, sans-serif" }}>Most Popular</h2>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#94a3b8" }}>The most viewed properties on FindWithHabi right now</p>
          </div>
          <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 50, border: "2px solid #ef4444", color: "#ef4444", fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", minHeight: 44 }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal scroll strip */}
        <div style={{
          display: "flex", gap: 16,
          overflowX: "auto", paddingBottom: 12,
          scrollbarWidth: "none", msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}>
          {listings.map((l, i) => (
            <Link key={l.id} href={`/listings/${l.id}`}
              style={{ textDecoration: "none", flexShrink: 0, width: "clamp(240px, 70vw, 300px)", borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "block", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)" }}>

              {/* Image */}
              <div style={{ position: "relative", height: 180, background: "#f1f5f9", overflow: "hidden" }}>
                {l.cover_image
                  ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={36} color="#cbd5e1" /></div>}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />

                {/* Rank badge */}
                <div style={{ position: "absolute", top: 10, left: 10, width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                  #{i + 1}
                </div>

                {/* Views badge */}
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 50, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
                  <Eye size={11} color="#fff" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{(l.views || 0).toLocaleString()}</span>
                </div>

                {/* Type badge */}
                <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                  <span style={{ background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 50 }}>{l.listing_type || "Buy"}</span>
                </div>

                {/* Featured badge */}
                {l.is_featured && (
                  <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                    <span style={{ background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 50 }}>✦ Featured</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#0d1f2d", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                  <MapPin size={11} color={T} />
                  <span style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.city}, {l.state}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  {l.beds  > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bed  size={10} color="#94a3b8" />{l.beds} Bed</span>}
                  {l.baths > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bath size={10} color="#94a3b8" />{l.baths} Bath</span>}
                  {l.sqft  &&     <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Maximize2 size={10} color="#94a3b8" />{Number(l.sqft).toLocaleString()} sqft</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 17, fontWeight: 900, color: T, letterSpacing: "-0.02em" }}>{l.price_label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}>
                    <TrendingUp size={12} color="#ef4444" />
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>Trending</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll hint on mobile */}
        <div className="scroll-hint" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "center" }}>
          <div style={{ height: 2, width: 24, borderRadius: 2, background: "#e2e8f0" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Scroll to see more</span>
          <div style={{ height: 2, width: 24, borderRadius: 2, background: "#e2e8f0" }} />
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} style={{ background: "#f8fafc", padding: "72px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", borderRadius: 24, overflow: "hidden", background: `linear-gradient(135deg, ${DARK} 0%, ${T_DARK} 100%)`, position: "relative", padding: "52px 24px", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: "all 0.8s ease", boxShadow: `0 32px 80px ${T_GLOW}` }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Get Started Today</div>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(22px,5vw,52px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "'DM Sans', system-ui, sans-serif" }}>Join FindWithHabi<br />Today</h2>
          <p style={{ margin: "0 auto 32px", fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 380, lineHeight: 1.7 }}>Join thousands of buyers, landlords and agents who trust FindWithHabi to find and list properties across Nigeria.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth?mode=signup" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: "#fff", color: T, fontSize: 14, fontWeight: 900, textDecoration: "none", minHeight: 48 }}>
              Sign Up Free
            </Link>
            <a href="tel:+2348001234567" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", minHeight: 48 }}>
              <Phone size={14} /> Talk to an Expert
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const footerLinks = [
    { title: "Platform", links: [["Browse Listings","/listings"],["Find Agents","/agents"],["Login","/auth?mode=login"],["Sign Up","/auth?mode=signup"],["Privacy Policy","/privacy"],["Terms of Service","/terms"]] },
    { title: "Company",  links: [["About Us","/about"],["Blog & News","/blog"],["Careers","/careers"],["Press","/press"]] },
    { title: "Contact",  links: [["findwithhabi@gmail.com","mailto:findwithhabi@gmail.com"],["Lagos, Nigeria","#"],["Support","/blog"]] },
  ]
  return (
    <footer id="contact" style={{ background: DARK, color: "#fff", padding: "56px 16px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 36, marginBottom: 44 }}>
          <div>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 64, width: "auto", objectFit: "contain", marginBottom: 14 }} />
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 280, marginBottom: 20 }}>Nigeria&apos;s most trusted property platform. Verified listings, expert agents, and seamless transactions.</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[[Globe,"Website"],[MessageCircle,"Chat"],[Share2,"Share"]].map(([Icon,label],i) => (
                <a key={i} href="#" aria-label={label} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color="rgba(255,255,255,0.6)" />
                </a>
              ))}
            </div>
          </div>
          <div className="footer-links-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {footerLinks.map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</h4>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                  {links.map(([label, href]) => (
                    <li key={label}><Link href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile app coming soon */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Phone icon SVG */}
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T + "18", border: "1px solid " + T + "30", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 3 }}>FindWithHabi Mobile App</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Search listings, chat with agents & save properties on the go.</div>
                {/* App store badges */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {/* App Store */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", opacity: 0.6 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", lineHeight: 1 }}>Download on the</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>App Store</div>
                    </div>
                  </div>
                  {/* Google Play */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", opacity: 0.6 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" fill="#fff"/>
                      <path d="M3 3.5l10.5 10.5L3 24.5" fill="none"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", lineHeight: 1 }}>Get it on</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span style={{ padding: "6px 16px", borderRadius: 50, background: T + "20", border: "1px solid " + T + "50", color: T, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", flexShrink: 0, alignSelf: "flex-start" }}>🚀 Coming Soon</span>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>© 2025–2026 FindWithHabi. All rights reserved.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Cookie Policy","#"]].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrollY,  setScrollY]  = useState(0)
  const [listings,        setListings]        = useState([])
  const [popularListings, setPopularListings] = useState([])
  const [agents,          setAgents]          = useState([])
  const [stats,           setStats]           = useState({ totalListings: 0, totalUsers: 0, totalAgents: 0 })

  useEffect(() => {
    // Scroll listener
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // Fetch real data — with session cache for instant navigation
    const fetchData = async () => {
      const CACHE_KEY = "fwh_home_v1"
      const CACHE_TTL = 3 * 60 * 1000 // 3 minutes
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data: c, ts } = JSON.parse(cached)
          // Always restore from cache instantly
          if (c.listings) setListings(c.listings)
          if (c.agents)   setAgents(c.agents)
          if (c.stats)    setStats(c.stats)
          if (c.popular)  setPopularListings(c.popular)
          // If fresh enough, skip network
          if (Date.now() - ts < CACHE_TTL) return
          // Otherwise refresh in background
        }
      } catch(e) {}

      // Fetch everything in parallel — much faster than sequential
      const [
        { data: listingsData },
        { data: agentsData },
        { data: popularData },
        { count: totalListings },
        { count: totalUsers },
        { count: totalAgents },
      ] = await Promise.all([
        supabase.from("listings").select("*").eq("status", "active").eq("is_flagged", false).eq("is_featured", true).order("created_at", { ascending: false }).limit(12),
        supabase.from("agents").select("*, users(full_name, avatar_url, phone, city, state)").order("is_verified", { ascending: false }).order("rating", { ascending: false }).limit(6),
        supabase.from("listings").select("*, agents(rating)").eq("status", "active").eq("is_flagged", false).order("views", { ascending: false }).limit(30),
        supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "active").eq("is_flagged", false),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("agents").select("*", { count: "exact", head: true }).eq("is_verified", true),
      ])

      // Process featured listings + images
      let formatted = []
      if (listingsData?.length > 0) {
        const ids = listingsData.map(l => l.id)
        const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        formatted = listingsData.map(l => {
          const imgs = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
          return { ...l, cover_image: imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null }
        })
        setListings(formatted)
      }

      // Process agents + listing counts
      let agentsFormatted = []
      if (agentsData?.length > 0) {
        const agentIds = agentsData.map(a => a.id)
        const { data: listingCounts } = await supabase.from("listings").select("agent_id").in("agent_id", agentIds).eq("status", "active")
        const counts = {}
        if (listingCounts) listingCounts.forEach(l => { counts[l.agent_id] = (counts[l.agent_id] || 0) + 1 })
        agentsFormatted = agentsData.map(a => ({ ...a, listing_count: counts[a.id] || 0 }))
        setAgents(agentsFormatted)
      }

      // Stats
      const newStats = { totalListings: totalListings || 0, totalUsers: totalUsers || 0, totalAgents: totalAgents || 0 }
      setStats(newStats)

      // Process popular listings
      let popularFormatted = []
      if (popularData?.length > 0) {
        const scored = popularData
          .map(l => ({ ...l, _score: (l.views || 0) * 0.6 + ((l.agents?.rating || 0) * 20) * 0.4 }))
          .sort((a, b) => b._score - a._score)
          .slice(0, 10)
        const pIds = scored.map(l => l.id)
        const { data: pImages } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", pIds)
        popularFormatted = scored.map(l => {
          const imgs = pImages ? pImages.filter(i => i.listing_id === l.id) : []
          return { ...l, cover_image: imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null }
        })
        setPopularListings(popularFormatted)
      }

      // Save to cache
      try {
        sessionStorage.setItem("fwh_home_v1", JSON.stringify({
          data: { listings: formatted, agents: agentsFormatted, stats: newStats, popular: popularFormatted },
          ts: Date.now()
        }))
      } catch(e) {}
    }

    fetchData()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: "hidden" }}>
      <NavBar scrollY={scrollY} />
      <main>
        <Hero stats={stats} />
        <FeaturedListings listings={listings} loading={listings.length === 0} />
        <PopularListings listings={popularListings} />
        <CitiesSection />
        <WhySection />
        <AgentsSection agents={agents} />
        <CTABanner />
      </main>
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; -webkit-font-smoothing: antialiased; }
        html, body { max-width: 100vw; overflow-x: hidden; }
        @keyframes bounce  { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { display: none; }
        .desktop-nav { display: none !important; }
        .list-btn    { display: none !important; }
        .section-listings { display: block; }
        .section-agents   { display: block; }
        /* Dark mode overrides */
        html.dark .bg-white-card { background: #1c2128 !important; border-color: #30363d !important; }
        html.dark .text-dark { color: #e6edf3 !important; }
        html.dark .text-muted { color: #8b949e !important; }
        html.dark .bg-light { background: #161b22 !important; }
        .hero-list-cta { display: block; }
        @media (min-width: 768px) {
          .nav-inner { padding: 0 24px !important; }
          .container { padding: 0 24px !important; }
          .desktop-nav { display: flex !important; }
          .list-btn    { display: flex !important; }
          .hamburger-wrap { display: none !important; }
          .hero-search { flex-direction: row !important; align-items: center !important; }
          .search-controls { flex-direction: row !important; flex: 0 0 auto !important; gap: 8px !important; }
          .search-input { font-size: 14px !important; }
          .stats-strip { grid-template-columns: repeat(4,1fr) !important; }
          .stats-strip > div { border-right: 1px solid rgba(255,255,255,0.06) !important; border-bottom: none !important; }
          .stats-strip > div:last-child { border-right: none !important; }
          .cities-grid { grid-template-columns: repeat(3,1fr) !important; }
          .city-wide { grid-column: span 2 !important; }
          .city-img { height: 220px !important; }
          .city-wide-img { height: 280px !important; }
          .footer-grid { grid-template-columns: 1.5fr 2fr !important; gap: 48px !important; }
          .footer-links-grid { grid-template-columns: repeat(3,1fr) !important; }
          .section-listings, .section-agents { display: block !important; }
          .hero-list-cta { display: none !important; }
        }
        @media (min-width: 1024px) {
          .nav-inner { padding: 0 32px !important; }
          .container { padding: 0 32px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
          .ambient-glow { display: none; }
        }
        :focus-visible { outline: 2px solid ${T}; outline-offset: 3px; border-radius: 4px; }
        a, button { -webkit-tap-highlight-color: transparent; }
        footer { padding-bottom: calc(32px + env(safe-area-inset-bottom,0px)) !important; }
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  )
}