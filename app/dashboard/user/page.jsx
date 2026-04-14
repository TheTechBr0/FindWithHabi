"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Heart, MessageCircle, Search, Settings, LogOut, Bell,
  MapPin, Bed, Bath, Maximize2, ArrowRight, ChevronRight,
  X, Menu, Phone, CheckCircle, Clock, Home, Building2,
  Trash2, Filter, Shield, Loader, BadgeCheck, RefreshCw,Send,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const NAV = [
  { key: "overview",   label: "Overview",        icon: Home          },
  { key: "listings",   label: "Browse Listings", icon: Building2     },
  { key: "saved",      label: "Saved Homes",     icon: Heart         },
  { key: "enquiries",  label: "My Enquiries",    icon: MessageCircle },
  { key: "settings",   label: "Settings",        icon: Settings      },
]

const inputBase = {
  width: "100%", padding: "12px 14px", borderRadius: 12,
  border: "1.5px solid #e2e8f0", fontSize: 15, color: "#0d1f2d",
  fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
  background: "#f8fafc", boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose, user, savedCount, enquiryCount, unreadNotifs }) {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  const badges = {
    saved:         savedCount    || 0,
    enquiries:     enquiryCount  || 0,
    notifications: unreadNotifs  || 0,
  }

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 149, backdropFilter: "blur(2px)" }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 150, width: 260, background: "#080f14", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: open ? "8px 0 32px rgba(0,0,0,0.4)" : "none" }} className="sidebar">

        <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          </Link>
          <button onClick={onClose} className="sidebar-close"
            style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {user?.avatar_url
                ? <img src={user.avatar_url} alt={user.full_name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2.5px solid " + T }} />
                : <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "20", border: "2.5px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T }}>
                    {user?.full_name?.charAt(0) || "U"}
                  </div>}
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.full_name || "User"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2, textTransform: "capitalize" }}>{user?.role || "buyer"} · {user?.city || "Nigeria"}</div>
            </div>
          </div>
          <Link href="/listings" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 14px", borderRadius: 10, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 14px " + T_GLOW }}>
            <Search size={14} /> Browse Properties
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            const badge    = badges[key] || 0
            return (
              <button key={key} onClick={() => { onNav(key); onClose() }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", background: isActive ? T + "18" : "transparent", color: isActive ? T : "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: isActive ? 800 : 600, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.18s" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {label}
                {badge > 0 && (
                  <span style={{ marginLeft: "auto", background: isActive ? T : "rgba(255,255,255,0.12)", color: isActive ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444" }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8" }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>
    </>
  )
}


// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell({ userId, onOpen }) {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
  const unread = notifs.filter(n => !n.is_read).length

  const ICONS = {
    general: "🔔", warning: "⚠️", feature: "🚀",
    announcement: "📢", policy: "📋", personal: "💬",
  }

  const fetchNotifs = () => {
    if (!userId) return
    // Try recipient_id first, fall back to user_id column
    supabase.from("notifications").select("*")
      .or(`recipient_id.eq.${userId},user_id.eq.${userId}`)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data, error }) => {
        if (error) {
          // If or() fails, just use recipient_id
          supabase.from("notifications").select("*").eq("recipient_id", userId)
            .order("created_at", { ascending: false }).limit(20)
            .then(({ data: d }) => setNotifs(d || []))
        } else {
          setNotifs(data || [])
        }
      })
  }

  useEffect(() => { fetchNotifs() }, [userId])

  const toggle = () => {
    setOpen(p => !p)
    fetchNotifs()
  }

  const markRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read: true } : n))
    if (onOpen) onOpen()
  }

  const markAllRead = async () => {
    const ids = notifs.filter(n => !n.is_read).map(n => n.id)
    if (!ids.length) return
    await supabase.from("notifications").update({ is_read: true }).in("id", ids)
    setNotifs(p => p.map(n => ({ ...n, is_read: true })))
    if (onOpen) onOpen()
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={toggle}
        style={{ position: "relative", width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Bell size={17} color="#64748b" />
        {unread > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 200, width: 320, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.15)", overflow: "hidden", animation: "fadeUp 0.2s ease" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>
                Notifications {unread > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 50, marginLeft: 4 }}>{unread}</span>}
              </span>
              {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 11, color: T, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>}
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div style={{ padding: "32px 20px", textAlign: "center", color: "#94a3b8" }}>
                  <Bell size={28} color="#e2e8f0" style={{ marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: 13 }}>No notifications yet</p>
                </div>
              ) : notifs.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: "1px solid #f8fafc", background: n.is_read ? "#fff" : T + "06", cursor: "pointer", transition: "background 0.15s" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[n.type] || "🔔"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.message}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString()}</div>
                  </div>
                  {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T, flexShrink: 0, marginTop: 4 }} />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title, onMenuOpen, userId, onRefresh }) {
  return (
    <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onMenuOpen} className="menu-btn"
          style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Menu size={18} color="#64748b" />
        </button>
        <h1 style={{ margin: 0, fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{title}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NotificationBell userId={userId} onOpen={onRefresh} />
        <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", minHeight: 40, boxShadow: "0 4px 14px " + T_GLOW }}>
          <Search size={14} /> Find Property
        </Link>
      </div>
    </header>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Loader size={28} color={T} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 13, color: "#94a3b8" }}>Loading…</span>
      </div>
    </div>
  )
}

// ─── Property Mini Card ───────────────────────────────────────────────────────
function PropertyMiniCard({ listing, onRemove }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 170, overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
        {listing.cover_image
          ? <img src={listing.cover_image} alt={listing.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Home size={32} color="#cbd5e1" /></div>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)" }} />
        {listing.is_featured && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "#f59e0b22", color: "#b45309", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 50, border: "1px solid #f59e0b33" }}>✦ Featured</span>
        )}
        {onRemove && (
          <button onClick={() => onRemove(listing.id)} aria-label="Remove from saved"
            style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={13} color="#ef4444" />
          </button>
        )}
        <span style={{ position: "absolute", bottom: 8, left: 10, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>{listing.listing_type || "Buy"}</span>
      </div>
      <div style={{ padding: "13px 15px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 5px", fontSize: 13, fontWeight: 800, color: "#0d1f2d", letterSpacing: "-0.01em", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <MapPin size={10} color={T} />
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{listing.city}, {listing.state}</span>
        </div>
        {(listing.beds > 0 || listing.baths > 0) && (
          <div style={{ display: "flex", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f8fafc" }}>
            {listing.beds  > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b" }}><Bed size={11} color="#cbd5e1" />{listing.beds}bd</span>}
            {listing.baths > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b" }}><Bath size={11} color="#cbd5e1" />{listing.baths}ba</span>}
            {listing.sqft  &&     <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b" }}><Maximize2 size={11} color="#cbd5e1" />{Number(listing.sqft).toLocaleString()}</span>}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: T, letterSpacing: "-0.02em" }}>{listing.price_label}</span>
          <Link href={"/listings/" + listing.id}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 9, background: "#f1f5f9", color: "#0d1f2d", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T; e.currentTarget.style.color = "#fff" }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0d1f2d" }}>
            View <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function Overview({ user, savedListings, enquiries, notifications, onNav, loading }) {
  const newReplies   = enquiries.filter(e => e.agent_reply).length
  const unreadNotifs = notifications.filter(n => !n.is_read).length

  if (loading) return <LoadingCard />

  return (
    <div>
      {/* Hero greeting */}
      <div style={{ background: "linear-gradient(135deg," + DARK + " 0%," + T_DARK + " 100%)", borderRadius: 24, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, right: 60, width: 140, height: 140, borderRadius: "50%", background: T + "20", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {user?.avatar_url
            ? <img src={user.avatar_url} alt={user.full_name} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "3px solid " + T, flexShrink: 0 }} />
            : <div style={{ width: 60, height: 60, borderRadius: "50%", background: T + "30", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: T, flexShrink: 0 }}>{user?.full_name?.charAt(0) || "U"}</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Welcome back</p>
            <h2 style={{ margin: "0 0 6px", fontSize: "clamp(18px,3.5vw,26px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
              {user?.full_name || "User"} 👋
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{user?.city || "Nigeria"} · {user?.role || "Buyer"}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 14, marginBottom: 28, animation: "fadeUp 0.5s ease 80ms both" }}>
        {[
          { label: "Saved Homes",    value: savedListings.length, icon: Heart,         color: "#ef4444", onClick: () => onNav("saved")         },
          { label: "My Enquiries",   value: enquiries.length,     icon: MessageCircle, color: "#8b5cf6", onClick: () => onNav("enquiries")      },
          { label: "Agent Replies",  value: newReplies,           icon: CheckCircle,   color: "#10b981", onClick: () => onNav("enquiries")      },
          { label: "Notifications",  value: unreadNotifs,         icon: Bell,          color: T,         onClick: () => onNav("notifications")  },
        ].map(({ label, value, icon: Icon, color, onClick }, i) => (
          <button key={i} onClick={onClick}
            style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", cursor: "pointer", textAlign: "left", transition: "all 0.2s", animation: "fadeUp 0.5s ease " + (i * 70 + 80) + "ms both" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, fontWeight: 600 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* New replies alert */}
      {newReplies > 0 && (
        <div style={{ background: T + "10", border: "1.5px solid " + T + "30", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.5s ease 200ms both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageCircle size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{newReplies} agent {newReplies === 1 ? "reply" : "replies"}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Agents have responded to your enquiries</div>
            </div>
          </div>
          <button onClick={() => onNav("enquiries")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
            View <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Saved homes preview */}
      <div style={{ marginBottom: 28, animation: "fadeUp 0.5s ease 280ms both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Saved Homes</h2>
          <button onClick={() => onNav("saved")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: T, background: "none", border: "none", cursor: "pointer" }}>
            See all ({savedListings.length}) <ChevronRight size={14} />
          </button>
        </div>
        {savedListings.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", textAlign: "center", border: "1px solid #f1f5f9" }}>
            <Heart size={36} color="#e2e8f0" style={{ marginBottom: 12 }} />
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "#94a3b8" }}>No saved properties yet</p>
            <Link href="/listings" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
              Browse Properties
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {savedListings.slice(0, 4).map(l => (
              <div key={l.id} style={{ flexShrink: 0, width: "clamp(220px,60vw,260px)" }}>
                <PropertyMiniCard listing={l} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent enquiries preview */}
      {enquiries.length > 0 && (
        <div style={{ animation: "fadeUp 0.5s ease 360ms both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Recent Enquiries</h2>
            <button onClick={() => onNav("enquiries")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: T, background: "none", border: "none", cursor: "pointer" }}>
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {enquiries.slice(0, 3).map(e => (
              <div key={e.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 36, borderRadius: 8, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                  {e.listings?.cover_image && <img src={e.listings.cover_image} alt={e.listings.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.listings?.title || "Property"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(e.created_at).toLocaleDateString()}</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 50, background: e.agent_reply ? "#10b98112" : "#f59e0b12", color: e.agent_reply ? "#059669" : "#d97706", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                  {e.agent_reply ? "Replied" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Saved Homes Tab ──────────────────────────────────────────────────────────
function SavedHomes({ savedListings, loading, onRefresh }) {
  const [filter, setFilter] = useState("All")
  const types = ["All", "Buy", "Rent", "Lease", "Commercial"]

  const filtered = filter === "All" ? savedListings : savedListings.filter(l => l.listing_type?.toLowerCase() === filter.toLowerCase())

  const remove = async (listingId) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("saved_listings").delete().eq("user_id", user.id).eq("listing_id", listingId)
    onRefresh()
  }

  if (loading) return <LoadingCard />

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Saved Homes ({savedListings.length})</h2>
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 3, gap: 2 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === t ? "#fff" : "transparent", color: filter === t ? "#0d1f2d" : "#64748b", boxShadow: filter === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Heart size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: "0 0 8px", color: "#0d1f2d", fontSize: 18, fontWeight: 800 }}>{savedListings.length === 0 ? "No saved properties" : "No " + filter + " properties saved"}</h3>
          <p style={{ color: "#94a3b8", margin: "0 0 20px" }}>Tap the heart icon on any listing to save it</p>
          <Link href="/listings" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
            <Search size={15} /> Browse Properties
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
          {filtered.map((l, i) => (
            <div key={l.id} style={{ animation: "fadeUp 0.4s ease " + (i * 60) + "ms both" }}>
              <PropertyMiniCard listing={l} onRemove={remove} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Enquiries Tab ────────────────────────────────────────────────────────────
function MyEnquiries({ enquiries, loading, onRefresh }) {
  const [selected,    setSelected]    = useState(null)
  const [messages,    setMessages]    = useState([])
  const [reply,       setReply]       = useState("")
  const [sending,     setSending]     = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const bottomRef = useRef(null)

  const currentEnquiry = selected
    ? enquiries.find(e => e.id === selected)
    : enquiries[0] || null

  useEffect(() => {
    const id = selected || enquiries[0]?.id
    if (!id) return
    setLoadingMsgs(true)
    supabase.from("enquiry_messages").select("*")
      .eq("enquiry_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(data || [])
        setLoadingMsgs(false)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
      })
  }, [selected, enquiries, sending])

  const sendReply = async () => {
    if (!reply.trim() || !currentEnquiry) return
    setSending(true)
    await supabase.from("enquiry_messages").insert({
      enquiry_id: currentEnquiry.id,
      sender:     "user",
      message:    reply.trim(),
    })
    setReply("")
    setSending(false)
    if (onRefresh) onRefresh()
  }

  const statusMap = {
    new:     { bg: "#f59e0b12", color: "#d97706", label: "Pending" },
    replied: { bg: "#10b98112", color: "#059669", label: "Replied" },
    closed:  { bg: "#94a3b812", color: "#94a3b8", label: "Closed"  },
  }

  if (loading) return <LoadingCard />

  if (enquiries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <MessageCircle size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
        <h3 style={{ margin: "0 0 8px", color: "#0d1f2d", fontSize: 18, fontWeight: 800 }}>No enquiries yet</h3>
        <p style={{ color: "#94a3b8", margin: "0 0 20px" }}>Find a property and contact an agent to get started</p>
        <Link href="/listings" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
          Browse Properties
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>My Enquiries ({enquiries.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="enquiry-layout">
        {/* List */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden" }}>
          {enquiries.map(e => {
            const sc = statusMap[e.status] || statusMap.new
            const isActive = (selected || enquiries[0]?.id) === e.id
            return (
              <button key={e.id} onClick={() => setSelected(e.id)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", border: "none", width: "100%", textAlign: "left", cursor: "pointer", background: isActive ? T + "08" : "#fff", borderBottom: "1px solid #f8fafc", transition: "background 0.15s", borderLeft: isActive ? "3px solid " + T : "3px solid transparent" }}>
                <div style={{ width: 52, height: 44, borderRadius: 10, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                  {e.listings?.cover_image && <img src={e.listings.cover_image} alt={e.listings.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.listings?.title || "Property"}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{new Date(e.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 5 }}>{e.listings?.city}, {e.listings?.state}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 800 }}>{sc.label}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Chat panel */}
        {currentEnquiry && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 480 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 44, height: 40, borderRadius: 10, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                  {currentEnquiry.listings?.cover_image && <img src={currentEnquiry.listings.cover_image} alt={currentEnquiry.listings.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{currentEnquiry.listings?.title || "Property"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{currentEnquiry.listings?.city}, {currentEnquiry.listings?.state} · {currentEnquiry.listings?.price_label}</div>
                </div>
              </div>
              {currentEnquiry.agents?.users?.phone && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8fafc", borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: T + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: T }}>
                      {currentEnquiry.agents?.users?.full_name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d" }}>{currentEnquiry.agents?.users?.full_name || "Agent"}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Property Agent</div>
                    </div>
                  </div>
                  <a href={"tel:" + currentEnquiry.agents.users.phone}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 10, background: T, color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 800 }}>
                    <Phone size={13} /> Call
                  </a>
                </div>
              )}
            </div>

            <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
              {loadingMsgs ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <Loader size={20} color={T} style={{ animation: "spin 1s linear infinite" }} />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: T, borderRadius: "16px 16px 4px 16px", padding: "12px 16px", maxWidth: "80%" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#fff", lineHeight: 1.6 }}>{currentEnquiry.message}</p>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", display: "block", marginTop: 5 }}>{new Date(currentEnquiry.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : messages.map(msg => {
                const isUser = msg.sender === "user"
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                    <div style={{ background: isUser ? T : "#f1f5f9", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "12px 16px", maxWidth: "80%" }}>
                      <p style={{ margin: 0, fontSize: 14, color: isUser ? "#fff" : "#374151", lineHeight: 1.6 }}>{msg.message}</p>
                      <span style={{ fontSize: 10, color: isUser ? "rgba(255,255,255,0.6)" : "#94a3b8", display: "block", marginTop: 5 }}>
                        {new Date(msg.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: "14px 20px", borderTop: "1px solid #f8fafc", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                  placeholder="Type a message… (Enter to send)"
                  rows={2}
                  style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc" }}
                  onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
                />
                <button onClick={sendReply} disabled={sending || !reply.trim()}
                  style={{ width: 44, height: 44, borderRadius: 12, background: sending || !reply.trim() ? T + "60" : T, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: sending || !reply.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>
                  {sending ? <Loader size={17} color="#fff" style={{ animation: "spin 1s linear infinite" }} /> : <Send size={17} color="#fff" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab({ notifications, loading, onRefresh }) {
  const markAllRead = async () => {
    const ids = notifications.filter(n => !n.is_read).map(n => n.id)
    if (ids.length === 0) return
    await supabase.from("notifications").update({ is_read: true }).in("id", ids)
    onRefresh()
  }

  const markRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    onRefresh()
  }

  const NOTIF_ICONS = {
    general:      { icon: "🔔", color: T        },
    warning:      { icon: "⚠️", color: "#ef4444" },
    feature:      { icon: "🚀", color: "#8b5cf6" },
    announcement: { icon: "📢", color: "#f59e0b" },
    policy:       { icon: "📋", color: "#64748b" },
    personal:     { icon: "💬", color: "#10b981" },
  }

  if (loading) return <LoadingCard />

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Notifications ({notifications.length})</h2>
        {notifications.some(n => !n.is_read) && (
          <button onClick={markAllRead}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, border: "1.5px solid " + T + "40", background: T + "10", color: T, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <CheckCircle size={13} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Bell size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: "0 0 8px", color: "#0d1f2d", fontSize: 18, fontWeight: 800 }}>No notifications yet</h3>
          <p style={{ color: "#94a3b8", margin: 0 }}>We will notify you about agent replies, new listings and platform updates</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifications.map((n, i) => {
            const cfg = NOTIF_ICONS[n.type] || NOTIF_ICONS.general
            return (
              <div key={n.id} onClick={() => !n.is_read && markRead(n.id)}
                style={{ background: n.is_read ? "#fff" : T + "06", borderRadius: 14, padding: "16px 18px", border: "1px solid " + (n.is_read ? "#f1f5f9" : T + "20"), display: "flex", alignItems: "flex-start", gap: 14, cursor: n.is_read ? "default" : "pointer", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both", transition: "background 0.2s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{n.message}</p>
                  {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T, marginTop: 8 }} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// ─── Browse Listings Tab ──────────────────────────────────────────────────────
function BrowseListings({ onSave }) {
  const [listings,    setListings]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState("All")
  const [search,      setSearch]      = useState("")
  const [savedIds,    setSavedIds]    = useState([])
  const [authUser,    setAuthUser]    = useState(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAuthUser(user)

      // Fetch listings
      const { data: listingsData } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .eq("is_flagged", false)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50)

      if (listingsData && listingsData.length > 0) {
        const ids = listingsData.map(l => l.id)
        const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        setListings(listingsData.map(l => {
          const imgs  = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
          const cover = imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null
          return { ...l, cover_image: cover }
        }))

        // Fetch user saved IDs
        if (user) {
          const { data: savedData } = await supabase.from("saved_listings").select("listing_id").eq("user_id", user.id)
          if (savedData) setSavedIds(savedData.map(s => s.listing_id))
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const toggleSave = async (listingId) => {
    if (!authUser) { router.push("/auth"); return }
    if (savedIds.includes(listingId)) {
      await supabase.from("saved_listings").delete().eq("user_id", authUser.id).eq("listing_id", listingId)
      setSavedIds(p => p.filter(id => id !== listingId))
    } else {
      await supabase.from("saved_listings").insert({ user_id: authUser.id, listing_id: listingId })
      supabase.rpc("increment_saves", { listing_id: listingId }).then(() => {})
      setSavedIds(p => [...p, listingId])
    }
    if (onSave) onSave()
  }

  const types = ["All", "Buy", "Rent", "Lease", "Commercial"]
  const filtered = listings.filter(l => {
    const matchType   = filter === "All" || l.listing_type?.toLowerCase() === filter.toLowerCase()
    const matchSearch = !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  if (loading) return <LoadingCard />

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Browse Listings ({filtered.length})</h2>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500) }}
          style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <RefreshCw size={15} color="#64748b" />
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 48, marginBottom: 14 }}>
        <Search size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, city…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 20, overflowX: "auto" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === t ? "#fff" : "transparent", color: filter === t ? "#0d1f2d" : "#64748b", boxShadow: filter === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", whiteSpace: "nowrap" }}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Building2 size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", margin: 0 }}>No listings found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
          {filtered.map((l, i) => {
            const isSaved = savedIds.includes(l.id)
            return (
              <div key={l.id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid " + (l.is_featured ? "#f59e0b40" : "#f1f5f9"), boxShadow: "0 2px 10px rgba(0,0,0,0.05)", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
                <div style={{ position: "relative", height: 175, background: "#f1f5f9", overflow: "hidden" }}>
                  {l.cover_image
                    ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={36} color="#cbd5e1" /></div>}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 55%)" }} />
                  {l.is_featured && <span style={{ position: "absolute", top: 10, left: 10, background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 50 }}>✦ Featured</span>}
                  <button onClick={() => toggleSave(l.id)}
                    style={{ position: "absolute", top: 8, right: 8, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Heart size={14} color={isSaved ? "#ef4444" : "#94a3b8"} fill={isSaved ? "#ef4444" : "none"} />
                  </button>
                  <span style={{ position: "absolute", bottom: 8, left: 10, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>{l.listing_type || "Buy"}</span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                    <MapPin size={11} color={T} />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{l.city}, {l.state}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    {l.beds  > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bed  size={10} color="#94a3b8" />{l.beds}bd</span>}
                    {l.baths > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bath size={10} color="#94a3b8" />{l.baths}ba</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: T }}>{l.price_label}</span>
                    <Link href={"/listings/" + l.id}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", borderRadius: 10, background: T, color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                      View <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function UserSettings({ user, onUpdate }) {
  const [name,   setName]   = useState(user?.full_name || "")
  const [phone,  setPhone]  = useState(user?.phone || "")
  const [city,   setCity]   = useState(user?.city || "")
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("users").update({ full_name: name, phone, city }).eq("id", authUser.id)
    setSaving(false)
    setSaved(true)
    onUpdate()
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease both" }}>
        <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>My Profile</h3>

        {/* User avatar initial */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #f8fafc" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T + "20", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: T, flexShrink: 0 }}>
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1f2d", marginBottom: 2 }}>{name || "User"}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{user?.email}</div>
          </div>
        </div>

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Full Name",    value: name,  set: setName,  type: "text", placeholder: "Your full name"    },
            { label: "Phone Number", value: phone, set: setPhone, type: "tel",  placeholder: "+234 800 000 0000" },
            { label: "City / State", value: city,  set: setCity,  type: "text", placeholder: "Lagos, Nigeria"    },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
              <input value={value} onChange={e => set(e.target.value)} type={type} placeholder={placeholder}
                style={{ ...inputBase }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
              />
            </div>
          ))}
          <button type="submit" disabled={saving}
            style={{ padding: "13px", borderRadius: 14, background: saved ? "#10b981" : saving ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, transition: "background 0.3s", boxShadow: "0 6px 20px " + T_GLOW }}>
            {saving ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : saved ? <><CheckCircle size={17} /> Saved!</> : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginTop: 16, animation: "fadeUp 0.5s ease 80ms both" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Account Info</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Email",    value: user?.email || "—",  icon: Shield     },
            { label: "Role",     value: user?.role  || "buyer", icon: BadgeCheck },
            { label: "Member",   value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-NG", { month: "long", year: "numeric" }) : "—", icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "#f8fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} color="#94a3b8" />
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{label}</span>
              </div>
              <span style={{ fontSize: 13, color: "#0d1f2d", fontWeight: 700, textTransform: "capitalize" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const router = useRouter()
  const [tab,          setTab]          = useState("overview")
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [user,         setUser]         = useState(null)
  const [savedListings,setSavedListings]= useState([])
  const [enquiries,    setEnquiries]    = useState([])
  const [notifications,setNotifications]= useState([])
  const [loading,      setLoading]      = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) { router.push("/auth"); return }

    const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
    setUser(userData)

    // Saved listings
    const { data: savedData } = await supabase
      .from("saved_listings")
      .select("listing_id")
      .eq("user_id", authUser.id)

    if (savedData && savedData.length > 0) {
      const ids = savedData.map(s => s.listing_id)
      const { data: listingsData } = await supabase
        .from("listings")
        .select("*")
        .in("id", ids)
        .eq("status", "active")

      if (listingsData && listingsData.length > 0) {
        const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        setSavedListings(listingsData.map(l => {
          const imgs  = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
          const cover = imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null
          return { ...l, cover_image: cover }
        }))
      } else {
        setSavedListings([])
      }
    } else {
      setSavedListings([])
    }

    // Enquiries with listing + agent info
    const { data: enquiriesData } = await supabase
      .from("enquiries")
      .select("*, listings(id, title, city, state, price_label), agents(id, users(full_name, phone))")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false })

    // Attach listing cover images to enquiries
    if (enquiriesData && enquiriesData.length > 0) {
      const listingIds = [...new Set(enquiriesData.map(e => e.listing_id).filter(Boolean))]
      const { data: eImages } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", listingIds)
      setEnquiries(enquiriesData.map(e => {
        const imgs  = eImages ? eImages.filter(i => i.listing_id === e.listing_id) : []
        const cover = imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null
        return { ...e, listings: { ...e.listings, cover_image: cover } }
      }))
    } else {
      setEnquiries([])
    }

    // Notifications
    const { data: notifData } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", authUser.id)
      .order("created_at", { ascending: false })
    setNotifications(notifData || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const fn = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const unreadNotifs = notifications.filter(n => !n.is_read).length

  const titles = {
    overview:      "Overview",
    listings:      "Browse Listings",
    saved:         "Saved Homes",
    enquiries:     "My Enquiries",
    notifications: "Notifications",
    settings:      "Settings",
  }

  const renderTab = () => {
    if (tab === "overview")      return <Overview user={user} savedListings={savedListings} enquiries={enquiries} notifications={notifications} onNav={setTab} loading={loading} />
    if (tab === "listings")      return <BrowseListings onSave={fetchData} />
    if (tab === "saved")         return <SavedHomes savedListings={savedListings} loading={loading} onRefresh={fetchData} />
    if (tab === "enquiries")     return <MyEnquiries enquiries={enquiries} loading={loading} onRefresh={fetchData} />
    if (tab === "notifications") return <NotificationsTab notifications={notifications} loading={loading} onRefresh={fetchData} />
    if (tab === "settings")      return <UserSettings user={user} onUpdate={fetchData} />
    return null
  }

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex" }}>
      <Sidebar
        active={tab} onNav={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        user={user} savedCount={savedListings.length} enquiryCount={enquiries.length} unreadNotifs={unreadNotifs}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="main-area">
        <Topbar title={titles[tab]} onMenuOpen={() => setSidebarOpen(true)} userId={user?.id} onRefresh={fetchData} />
        <main style={{ flex: 1, padding: "24px 16px 48px", maxWidth: 1100, width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="main-container">
          {renderTab()}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; max-width: 100vw; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:focus, textarea:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        :focus-visible { outline: 2px solid ${T}; outline-offset: 3px; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .sidebar-close { display: flex !important; }
        @media (min-width: 768px) {
          .main-container { padding: 24px 24px 48px !important; }
          .enquiry-layout { grid-template-columns: 280px 1fr !important; }
        }
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .sidebar-close { display: none !important; }
          .main-area { margin-left: 260px !important; }
          .menu-btn  { display: none !important; }
          .main-container { padding: 28px 32px 64px !important; }
          .enquiry-layout { grid-template-columns: 300px 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}