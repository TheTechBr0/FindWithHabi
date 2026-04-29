"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/Toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Users, Home, Flag, ArrowRight, ArrowLeft, Heart, Building2, MessageCircle, TrendingUp, Settings, LogOut,
  Bell, Plus, Eye, Phone, MapPin, Star, CheckCircle,
  ChevronRight, MoreHorizontal, Trash2, X, Menu,
  Bed, Bath, Maximize2, Clock, Activity,
  Search, Send, Check, Loader, Shield, AlertCircle,
  Upload, BadgeCheck, RefreshCw, Sparkles, Zap, Pencil,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const NAV = [
  { key: "overview",     label: "Overview",      icon: Activity      },
  { key: "listings",     label: "My Listings",   icon: Building2     },
  { key: "enquiries",    label: "Enquiries",      icon: MessageCircle },
  { key: "featured",     label: "Boost Listing",  icon: Sparkles      },
  { key: "verification", label: "Verification",  icon: BadgeCheck    },
  { key: "performance",  label: "Performance",   icon: TrendingUp    },
  { key: "settings",     label: "Settings",      icon: Settings      },
  { key: "support",      label: "Help & Support", icon: MessageCircle },
]

const inputBase = {
  width: "100%", padding: "12px 14px", borderRadius: 12,
  border: "1.5px solid #e2e8f0", fontSize: 15, color: "#0d1f2d",
  fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
  background: "#f8fafc", boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
}

const NIGERIAN_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose, agent, user }) {
  const router = useRouter()
  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/auth") }
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 149, backdropFilter: "blur(2px)" }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 150, width: 260, background: DARK, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: open ? "8px 0 32px rgba(0,0,0,0.4)" : "none" }} className="sidebar">
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          </Link>
          <button onClick={onClose} className="sidebar-close" style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {user?.avatar_url
                ? <img key={user.avatar_url} src={user.avatar_url} alt={user?.full_name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2.5px solid " + T }} />
                : <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "30", border: "2.5px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T }}>{user?.full_name?.charAt(0) || "A"}</div>}
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid " + DARK }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.full_name || "Agent"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                Property Agent{user?.city ? " · " + user.city : ""}{user?.state ? ", " + user.state : ""}
              </div>
            </div>
          </div>
          {agent?.is_verified
            ? <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 50, background: "#10b98120", border: "1px solid #10b98140" }}>
                <BadgeCheck size={11} color="#10b981" /><span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Verified Agent</span>
              </div>
            : <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 50, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <Shield size={11} color="rgba(255,255,255,0.4)" /><span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Unverified</span>
              </div>}
        </div>
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            const isVerif  = key === "verification"
            const isFeat   = key === "featured"
            return (
              <button key={key} onClick={() => { onNav(key); onClose() }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", background: isActive ? T + "18" : "transparent", color: isActive ? T : isVerif && !agent?.is_verified ? "#f59e0b" : isFeat ? "#f59e0b" : "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: isActive ? 800 : 600, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.18s", borderLeft: isActive ? "3px solid " + T : "3px solid transparent" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                <Icon size={18} style={{ flexShrink: 0 }} />{label}
                {isVerif && !agent?.is_verified && <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>NEW</span>}
                {isFeat && <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>✦</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444" }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell({ userId, onNavToEnquiries }) {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(false)
  const unread = notifs.filter(n => !n.is_read).length

  const TYPE_CONFIG = {
    personal:     { icon: "💬", color: "#0097B2", bg: "#e0f7fa" },
    general:      { icon: "🔔", color: "#64748b", bg: "#f1f5f9" },
    warning:      { icon: "⚠️", color: "#f59e0b", bg: "#fffbeb" },
    feature:      { icon: "🚀", color: "#8b5cf6", bg: "#f5f3ff" },
    announcement: { icon: "📢", color: "#ec4899", bg: "#fdf2f8" },
    policy:       { icon: "📋", color: "#64748b", bg: "#f8fafc" },
  }

  const load = async () => {
    if (!userId) return
    const { data } = await supabase.from("notifications")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false }).limit(20)
    setNotifs(data || [])
  }

  useEffect(() => { load() }, [userId])
  useEffect(() => {
    if (!userId) return
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [userId])

  const toggle = () => { setOpen(p => !p); if (!open) load() }

  const markRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllRead = async () => {
    const ids = notifs.filter(n => !n.is_read).map(n => n.id)
    if (!ids.length) return
    await supabase.from("notifications").update({ is_read: true }).in("id", ids)
    setNotifs(p => p.map(n => ({ ...n, is_read: true })))
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)
    if (diff < 60)   return "just now"
    if (diff < 3600) return Math.floor(diff/60) + "m ago"
    if (diff < 86400) return Math.floor(diff/3600) + "h ago"
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" })
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button onClick={toggle}
        style={{ position: "relative", width: 40, height: 40, borderRadius: 12, background: open ? T + "12" : "#f8fafc", border: `1.5px solid ${open ? T + "40" : "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
        <Bell size={17} color={open ? T : "#64748b"} />
        {unread > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, background: "#ef4444", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", padding: "0 3px", animation: "popIn 0.3s ease" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 190 }} />
          <div style={{ position: "fixed", top: 70, right: 8, left: 8, zIndex: 200, maxWidth: 400, marginLeft: "auto", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)", overflow: "hidden", animation: "fadeUp 0.2s ease" }}>

            {/* Header */}
            <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: T + "12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={15} color={T} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>Notifications</div>
                  {unread > 0 && <div style={{ fontSize: 11, color: "#94a3b8" }}>{unread} unread</div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {unread > 0 && (
                  <button onClick={markAllRead}
                    style={{ fontSize: 11, color: T, fontWeight: 800, background: T + "10", border: "none", cursor: "pointer", padding: "5px 10px", borderRadius: 8 }}>
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  style={{ width: 28, height: 28, borderRadius: 8, background: "#f8fafc", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={14} color="#64748b" />
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <Bell size={24} color="#cbd5e1" />
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#64748b" }}>All caught up!</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>No notifications yet</p>
                </div>
              ) : notifs.map((n, i) => {
                const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.general
                const isEnquiry = n.type === "personal" || n.title?.toLowerCase().includes("enquir") || n.title?.toLowerCase().includes("sent you")
                const enquiryId = n.link || null
                return (
                  <div key={n.id}
                    style={{ padding: "14px 18px", borderBottom: i < notifs.length - 1 ? "1px solid #f8fafc" : "none", background: n.is_read ? "#fff" : T + "05", cursor: "pointer", transition: "background 0.15s" }}
                    onClick={() => markRead(n.id)}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc" }}
                    onMouseLeave={e => { e.currentTarget.style.background = n.is_read ? "#fff" : T + "05" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      {/* Icon */}
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {tc.icon}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: n.is_read ? 600 : 800, color: "#0d1f2d", lineHeight: 1.4 }}>{n.title}</span>
                          <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{formatTime(n.created_at)}</span>
                        </div>
                        {(n.body || n.message) && (
                          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {n.body || n.message}
                          </p>
                        )}
                        {isEnquiry && onNavToEnquiries && (
                          <button onClick={e => { e.stopPropagation(); markRead(n.id); setOpen(false); onNavToEnquiries(enquiryId) }}
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: T, border: "none", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                            Open Chat →
                          </button>
                        )}
                      </div>
                      {/* Unread dot */}
                      {!n.is_read && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T, flexShrink: 0, marginTop: 5 }} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title, onMenuOpen, userId, onNavToEnquiries, onNav }) {
  return (
    <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onMenuOpen} className="menu-btn" style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Menu size={18} color="#64748b" />
        </button>
        <h1 style={{ margin: 0, fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{title}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NotificationBell userId={userId} onNavToEnquiries={onNavToEnquiries} />
        <button onClick={() => onNav("browse")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0d1f2d", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 }}>
          <Search size={14} color="#64748b" /> Browse
        </button>
        <Link href="/dashboard/agent/add-listing" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: T, color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", minHeight: 40, boxShadow: "0 4px 16px " + T_GLOW }}>
          <Plus size={15} /> Add Listing
        </Link>
      </div>
    </header>
  )
}

function LoadingCard() {
  const sh = { background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stat cards skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))", gap: 16 }}>
        {[...Array(4)].map((_,i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #f1f5f9" }}>
            <div style={{ ...sh, width: 44, height: 44, borderRadius: 14, marginBottom: 14 }} />
            <div style={{ ...sh, height: 28, width: "50%", marginBottom: 8 }} />
            <div style={{ ...sh, height: 13, width: "70%" }} />
          </div>
        ))}
      </div>
      {/* Listings skeleton */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {[...Array(3)].map((_,i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "16px 20px", borderBottom: "1px solid #f8fafc" }}>
            <div style={{ ...sh, width: 120, height: 90, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
              <div style={{ ...sh, height: 15, width: "60%" }} />
              <div style={{ ...sh, height: 12, width: "40%" }} />
              <div style={{ ...sh, height: 20, width: "30%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active:   { bg: "#10b98112", color: "#059669", label: "Active"   },
    pending:  { bg: "#f59e0b12", color: "#d97706", label: "Pending"  },
    sold:     { bg: "#6366f112", color: "#4f46e5", label: "Sold"     },
    rejected: { bg: "#ef444412", color: "#ef4444", label: "Rejected" },
    leased:   { bg: "#8b5cf612", color: "#7c3aed", label: "Leased"   },
  }
  const s = map[status] || map.pending
  return <span style={{ padding: "3px 10px", borderRadius: 50, background: s.bg, color: s.color, fontSize: 11, fontWeight: 800 }}>{s.label}</span>
}

// ─── Verification Banner ──────────────────────────────────────────────────────
function VerificationBanner({ agent, verifRequest, onApply }) {
  if (agent?.is_verified) return null
  if (verifRequest?.status === "pending") {
    return (
      <div style={{ background: "#f59e0b08", border: "1.5px solid #f59e0b30", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f59e0b18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Clock size={20} color="#f59e0b" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 2 }}>Verification Under Review</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Your application is being reviewed — usually within 24-48 hours.</div>
        </div>
        <span style={{ padding: "5px 12px", borderRadius: 50, background: "#f59e0b12", color: "#d97706", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>Pending</span>
      </div>
    )
  }
  if (verifRequest?.status === "rejected") {
    return (
      <div style={{ background: "#ef444408", border: "1.5px solid #ef444430", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#ef444418", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={20} color="#ef4444" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 2 }}>Application Not Approved</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{verifRequest.admin_note || "Please reapply with correct information."}</div>
        </div>
        <button onClick={onApply} style={{ padding: "8px 16px", borderRadius: 50, background: T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>Reapply</button>
      </div>
    )
  }
  return (
    <div style={{ background: "linear-gradient(135deg," + DARK + " 0%," + T_DARK + " 100%)", borderRadius: 20, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: T + "20", pointerEvents: "none" }} />
      <div style={{ width: 48, height: 48, borderRadius: 14, background: T + "30", border: "1.5px solid " + T + "60", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BadgeCheck size={24} color={T} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Get Verified — Build Trust with Buyers</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Verified agents get a blue badge, appear higher in search and close 3x more deals.</div>
      </div>
      <button onClick={onApply} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 50, background: "#fff", border: "none", color: T, fontSize: 13, fontWeight: 900, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
        <BadgeCheck size={15} /> Apply Now
      </button>
    </div>
  )
}

// ─── Feature Listing Tab ──────────────────────────────────────────────────────
function FeatureListingTab({ agent, user, listings, onRefresh }) {
  const PLANS = [
    { id: "week",  label: "1 Week",   days: 7,  amount: 2500,  popular: false },
    { id: "month", label: "1 Month",  days: 30, amount: 7500,  popular: true  },
    { id: "three", label: "3 Months", days: 90, amount: 18000, popular: false },
  ]
  const [selectedListing, setSelectedListing] = useState(null)
  const [selectedPlan,    setSelectedPlan]    = useState("month")
  const [paying,          setPaying]          = useState(false)
  const [success,         setSuccess]         = useState(null)
  const activeListings  = listings.filter(l => l.status === "active")
  const alreadyFeatured = listings.filter(l => l.is_featured)
  const plan            = PLANS.find(p => p.id === selectedPlan)

  const handlePay = () => {
    if (!selectedListing) { alert("Please select a listing to feature."); return }
    if (typeof window === "undefined" || !window.PaystackPop) { alert("Payment system not loaded. Please refresh and try again."); return }
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || "agent@findwithhabi.com",
      amount: plan.amount * 100, currency: "NGN",
      ref: "feat_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      metadata: { custom_fields: [{ display_name: "Listing", variable_name: "listing", value: selectedListing.title }, { display_name: "Duration", variable_name: "duration", value: plan.label }] },
      onClose: function() {},
      callback: function(response) {
        const expiresAt = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString()
        const listingId = selectedListing.id; const listingTitle = selectedListing.title
        const planLabel = plan.label; const planAmount = plan.amount; const planDays = plan.days; const agentId = agent.id
        setPaying(true)
        supabase.from("listings").update({ is_featured: true, featured_until: expiresAt }).eq("id", listingId)
          .then(function() {
            return supabase.from("featured_payments").insert({ listing_id: listingId, agent_id: agentId, amount: planAmount, duration_days: planDays, paystack_ref: response.reference, status: "active", expires_at: expiresAt })
          })
          .then(function() { setPaying(false); setSuccess({ listing: listingTitle, plan: planLabel, expiresAt }); onRefresh() })
      },
    })
    handler.openIframe()
  }

  if (success) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f59e0b12", border: "3px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.4s ease" }}><Sparkles size={38} color="#f59e0b" /></div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Listing Boosted! 🎉</h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}><strong>{success.listing}</strong> is now featured for <strong>{success.plan}</strong>.</p>
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "#94a3b8" }}>Expires</span><span style={{ color: "#0d1f2d", fontWeight: 700 }}>{new Date(success.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span></div>
          </div>
          <button onClick={() => setSuccess(null)} style={{ width: "100%", padding: "13px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Feature Another Listing</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ background: "linear-gradient(135deg,#78350f 0%,#b45309 100%)", borderRadius: 20, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={30} color="#fef3c7" /></div>
          <div><h2 style={{ margin: "0 0 5px", fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>Boost Your Listing</h2><p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Get featured on the homepage and listings page · More eyes, more enquiries</p></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 10, marginBottom: 24, animation: "fadeUp 0.5s ease 80ms both" }}>
        {[{ icon: Sparkles, color: "#f59e0b", text: "Featured badge on listing" }, { icon: Eye, color: T, text: "Top of listings page" }, { icon: Star, color: "#10b981", text: "Homepage featured strip" }, { icon: Zap, color: "#8b5cf6", text: "Priority in search results" }].map(({ icon: Icon, color, text }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={16} color={color} /></div>
            <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, fontWeight: 600 }}>{text}</span>
          </div>
        ))}
      </div>
      {alreadyFeatured.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Currently Featured</h3>
          {alreadyFeatured.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ width: 44, height: 36, borderRadius: 8, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>{l.cover_image && <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d", marginBottom: 2 }}>{l.title}</div>
                {l.featured_until && <div style={{ fontSize: 11, color: "#94a3b8" }}>Expires {new Date(l.featured_until).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>}
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 50, background: "#f59e0b12", color: "#d97706", fontSize: 11, fontWeight: 800 }}>Featured ✦</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 160ms both" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Feature a Listing</h3>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Select Listing <span style={{ color: "#ef4444" }}>*</span></label>
          {activeListings.length === 0
            ? <div style={{ padding: "20px", borderRadius: 14, background: "#f8fafc", textAlign: "center" }}><p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>No active listings. Add a listing first.</p></div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeListings.map(l => (
                  <button key={l.id} onClick={() => setSelectedListing(l)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: "1.5px solid " + (selectedListing?.id === l.id ? T : "#e2e8f0"), background: selectedListing?.id === l.id ? T + "08" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <div style={{ width: 48, height: 40, borderRadius: 8, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>{l.cover_image && <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.city}, {l.state} · {l.price_label}</div>
                    </div>
                    {l.is_featured && <span style={{ padding: "3px 8px", borderRadius: 50, background: "#f59e0b12", color: "#d97706", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>Featured</span>}
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (selectedListing?.id === l.id ? T : "#e2e8f0"), background: selectedListing?.id === l.id ? T : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                      {selectedListing?.id === l.id && <Check size={11} color="#fff" />}
                    </div>
                  </button>
                ))}
              </div>}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Choose Duration <span style={{ color: "#ef4444" }}>*</span></label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 10 }}>
            {PLANS.map(p => (
              <button key={p.id} onClick={() => setSelectedPlan(p.id)} style={{ padding: "16px 14px", borderRadius: 16, border: "2px solid " + (selectedPlan === p.id ? "#f59e0b" : "#e2e8f0"), background: selectedPlan === p.id ? "#f59e0b08" : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s", position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50, whiteSpace: "nowrap" }}>BEST VALUE</div>}
                <div style={{ fontSize: 16, fontWeight: 900, color: "#0d1f2d", marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#f59e0b", marginBottom: 4 }}>₦{p.amount.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>₦{Math.round(p.amount / p.days).toLocaleString()}/day</div>
              </button>
            ))}
          </div>
        </div>
        {selectedListing && (
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
            {[["Listing", selectedListing.title], ["Duration", plan.label], ["Expires", new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })]].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ color: "#94a3b8" }}>{label}</span><span style={{ color: "#0d1f2d", fontWeight: 700 }}>{value}</span></div>
            ))}
            <div style={{ height: 1, background: "#e2e8f0", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Total</span><span style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b" }}>₦{plan.amount.toLocaleString()}</span></div>
          </div>
        )}
        <button onClick={handlePay} disabled={!selectedListing || paying} style={{ width: "100%", padding: "15px", borderRadius: 14, background: !selectedListing || paying ? "#f59e0b70" : "#f59e0b", border: "none", color: "#fff", fontSize: 15, fontWeight: 900, cursor: !selectedListing || paying ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 54, transition: "all 0.2s", boxShadow: !selectedListing ? "none" : "0 6px 20px rgba(245,158,11,0.35)" }}>
          {paying ? <><Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing…</> : <><Sparkles size={18} /> Pay ₦{plan.amount.toLocaleString()} &amp; Boost Now</>}
        </button>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Shield size={12} /> Secured by Paystack · Auto-expires after {plan.label.toLowerCase()}</p>
      </div>
    </div>
  )
}

// ─── Verification Tab ─────────────────────────────────────────────────────────
function VerificationTab({ agent, user, verifRequest, onSubmit }) {
  const VERIFICATION_FEE = 4500
  const [step, setStep] = useState("info")
  const [paymentRef, setPaymentRef] = useState(null)
  const [form, setForm] = useState({ fullName: user?.full_name || "", idType: "NIN (National ID)", idNumber: "", phone: user?.phone || "", experience: "", bio: "", agreed: false })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handlePay = () => {
    if (typeof window === "undefined" || !window.PaystackPop) { alert("Payment system not loaded. Please refresh the page and try again."); return }
    const handler = window.PaystackPop.setup({ key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, email: user?.email || "agent@findwithhabi.com", amount: VERIFICATION_FEE * 100, currency: "NGN", ref: "verif_" + Date.now() + "_" + Math.random().toString(36).slice(2), onClose: () => {}, callback: (response) => { setPaymentRef(response.reference); setStep("form") } })
    handler.openIframe()
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = "Full legal name is required"
    if (!form.idNumber.trim()) e.idNumber = "ID number is required"
    if (!form.phone.trim()) e.phone = "Phone number is required"
    if (!form.experience) e.experience = "Years of experience is required"
    if (!form.bio.trim()) e.bio = "Please write a short bio"
    if (!form.agreed) e.agreed = "You must agree to the terms"
    return e
  }

  const submitForm = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setSubmitting(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("verification_requests").insert({ agent_id: agent.id, user_id: authUser.id, full_name: form.fullName, id_type: form.idType, id_number: form.idNumber, phone: form.phone, experience: parseInt(form.experience) || 0, bio: form.bio, status: "approved" })
    await supabase.from("agents").update({ is_verified: true }).eq("id", agent.id)
    await supabase.from("notifications").insert({ user_id: authUser.id, type: "feature", title: "🎉 You are now Verified!", body: "Your payment was confirmed and your profile is now verified. Your blue badge is now visible to all buyers." })
    setSubmitting(false); setSubmitted(true); onSubmit()
  }

  if (agent?.is_verified) return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10b98112", border: "3px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><BadgeCheck size={38} color="#10b981" /></div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>You are Verified!</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Your profile has a blue verified badge visible to all buyers.</p>
      </div>
    </div>
  )

  if (verifRequest?.status === "pending" && !submitted) return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f59e0b12", border: "3px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><Clock size={38} color="#f59e0b" /></div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Application Submitted</h2>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Under review — we will verify your details within <strong>24–48 hours</strong>.</p>
        <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", textAlign: "left" }}>
          {[["Full Name", verifRequest.full_name], ["ID Type", verifRequest.id_type], ["ID Number", "••••" + verifRequest.id_number?.slice(-4)], ["Phone", verifRequest.phone], ["Experience", verifRequest.experience + " years"]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}><span style={{ color: "#94a3b8", fontWeight: 600 }}>{label}</span><span style={{ color: "#0d1f2d", fontWeight: 700 }}>{value}</span></div>
          ))}
        </div>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: T + "12", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><CheckCircle size={38} color={T} /></div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Application Sent!</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Payment confirmed and application submitted. We will review within 24–48 hours.</p>
      </div>
    </div>
  )

  if (step === "info") return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ background: "linear-gradient(135deg," + DARK + " 0%," + T_DARK + " 100%)", borderRadius: 20, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 140, height: 140, borderRadius: "50%", background: T + "20", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: T + "30", border: "1.5px solid " + T + "60", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BadgeCheck size={30} color={T} /></div>
          <div><h2 style={{ margin: "0 0 5px", fontSize: 22, fontWeight: 900, color: "#fff" }}>Get Verified</h2><p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>One-time fee · Admin reviews within 24–48 hrs</p></div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Verification Fee</h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8" }}>Pay once to unlock your verified badge application.</p>
        <div style={{ background: "#f8fafc", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
          {[["Verification Processing Fee","₦4,000"],["Platform Service Charge","₦500"]].map(([label,value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, color: "#64748b" }}>{label}</span><span style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{value}</span></div>
          ))}
          <div style={{ height: 1, background: "#e2e8f0", margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Total</span><span style={{ fontSize: 22, fontWeight: 900, color: T }}>₦4,500</span></div>
        </div>
        <button onClick={handlePay} style={{ width: "100%", padding: "15px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 54, boxShadow: "0 6px 20px " + T_GLOW }}>
          <BadgeCheck size={20} /> Pay ₦4,500 &amp; Continue
        </button>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Shield size={12} /> Secured by Paystack · SSL encrypted</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ background: "#10b98110", border: "1.5px solid #10b98130", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <CheckCircle size={20} color="#10b981" />
        <div><div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Payment Confirmed!</div><div style={{ fontSize: 12, color: "#64748b" }}>Ref: {paymentRef} · Now complete your application below</div></div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9" }}>
        <h3 style={{ margin: "0 0 22px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Your Verification Details</h3>
        <form onSubmit={submitForm} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[["Full Legal Name","fullName","text","As it appears on your government ID"],["ID Number","idNumber","text","e.g. 12345678901"],["Direct Phone Number","phone","tel","+234 800 000 0000"],["Years of Experience","experience","number","e.g. 5"]].map(([label,key,type,placeholder]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label} <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form[key]} onChange={e => update(key, e.target.value)} type={type} placeholder={placeholder}
                style={{ ...inputBase, borderColor: errors[key] ? "#ef4444" : "#e2e8f0" }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = errors[key] ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
              {errors[key] && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Government ID Type <span style={{ color: "#ef4444" }}>*</span></label>
            <select value={form.idType} onChange={e => update("idType", e.target.value)} style={{ ...inputBase, appearance: "none", cursor: "pointer" }}
              onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }}>
              {["NIN (National ID)", "Driver's License", "International Passport", "Voter's Card", "CAC (Business Reg.)"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Professional Bio <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea value={form.bio} onChange={e => update("bio", e.target.value)} rows={4} placeholder="Tell us about your experience, areas you cover, and why buyers should trust you…"
              style={{ ...inputBase, resize: "vertical", minHeight: 100, borderColor: errors.bio ? "#ef4444" : "#e2e8f0" }}
              onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = errors.bio ? "#ef4444" : "#e2e8f0" }} />
            {errors.bio && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors.bio}</p>}
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Shield size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>Your ID details are encrypted and only visible to FindWithHabi admins. Never shared publicly.</p>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <div onClick={() => update("agreed", !form.agreed)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, background: form.agreed ? T : "transparent", border: "2px solid " + (form.agreed ? T : "#e2e8f0"), display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", cursor: "pointer" }}>
                {form.agreed && <Check size={12} color="#fff" />}
              </div>
              <span style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>I confirm all information is accurate and belongs to me. False information leads to permanent suspension.</span>
            </label>
            {errors.agreed && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5, paddingLeft: 30 }}><AlertCircle size={12} />{errors.agreed}</p>}
          </div>
          <button type="submit" disabled={submitting} style={{ padding: "14px", borderRadius: 14, background: submitting ? "#10b98170" : "#10b981", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52, boxShadow: submitting ? "none" : "0 6px 20px rgba(16,185,129,0.3)" }}>
            {submitting ? <><Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : <><BadgeCheck size={18} /> Submit Application</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniChart({ data, metric, color }) {
  const max = Math.max(...data.map(d => d[metric]), 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {data.map((d, i) => {
        const pct = (d[metric] / max) * 100
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
              <div style={{ width: "100%", height: pct + "%", minHeight: 4, borderRadius: "4px 4px 0 0", background: i === data.length - 1 ? color : color + "50", transition: "height 0.6s ease " + (i * 60) + "ms" }} />
            </div>
            <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function Overview({ user, agent, listings, enquiries, verifRequest, onNav }) {
  const activeListings  = listings.filter(l => l.status === "active").length
  const pendingListings = listings.filter(l => l.status === "pending").length
  const newEnquiries    = enquiries.filter(e => e.status === "new").length
  const totalViews      = listings.reduce((sum, l) => sum + (l.views || 0), 0)
  const MONTHLY_DATA = [
    { month: "Aug", views: 120, enquiries: 8  }, { month: "Sep", views: 180, enquiries: 12 },
    { month: "Oct", views: 240, enquiries: 16 }, { month: "Nov", views: 310, enquiries: 21 },
    { month: "Dec", views: 280, enquiries: 18 }, { month: "Jan", views: totalViews || 400, enquiries: enquiries.length || 24 },
  ]
  return (
    <div>
      <div style={{ marginBottom: 20, animation: "fadeUp 0.5s ease both" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>Good day, {user?.full_name?.split(" ")[0] || "Agent"} 👋</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>Here is what is happening with your listings today.</p>
      </div>
      <VerificationBanner agent={agent} verifRequest={verifRequest} onApply={() => onNav("verification")} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Active Listings", value: activeListings, icon: Building2, color: T, sub: pendingListings > 0 ? pendingListings + " pending" : "All live", delay: 0 },
          { label: "Total Enquiries", value: enquiries.length, icon: MessageCircle, color: "#8b5cf6", sub: newEnquiries + " new", delay: 80 },
          { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "#f59e0b", sub: "across all listings", delay: 160 },
          { label: "Rating", value: agent?.rating > 0 ? agent.rating : "—", icon: Star, color: "#10b981", sub: agent?.total_reviews ? agent.total_reviews + " reviews" : "No reviews yet", delay: 240 },
        ].map(({ label, value, icon: Icon, color, sub, delay }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animation: "fadeUp 0.5s ease " + delay + "ms both" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: color + "18", border: "1px solid " + color + "30", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><Icon size={20} color={color} /></div>
            <div style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 3 }}>{sub}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 28 }} className="charts-grid">
        {[{ label: "Listing Views", value: totalViews.toLocaleString(), color: T, metric: "views" }, { label: "Enquiries", value: enquiries.length, color: "#8b5cf6", metric: "enquiries" }].map(({ label, value, color, metric }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease " + (320 + i * 80) + "ms both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div><div style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Monthly</div><h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>{label}</h3></div>
              <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
            </div>
            <MiniChart data={MONTHLY_DATA} metric={metric} color={color} />
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", marginBottom: 28, animation: "fadeUp 0.5s ease 480ms both" }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Recent Enquiries</h3>
          <button onClick={() => onNav("enquiries")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: T, background: "none", border: "none", cursor: "pointer" }}>View all <ChevronRight size={14} /></button>
        </div>
        {enquiries.length === 0
          ? <div style={{ padding: "32px 24px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No enquiries yet</div>
          : enquiries.slice(0, 3).map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 24px", borderTop: "1px solid #f8fafc" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: T, flexShrink: 0 }}>{(e.sender_name || e.users?.full_name || "?").charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{e.sender_name || e.users?.full_name || "Anonymous"}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: 12, color: T, fontWeight: 600, marginBottom: 3 }}>{e.listings?.title || "Property"}</div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{e.message}</p>
              </div>
              {e.status === "new" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", animation: "fadeUp 0.5s ease 560ms both" }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>My Listings</h3>
          <button onClick={() => onNav("listings")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: T, background: "none", border: "none", cursor: "pointer" }}>Manage <ChevronRight size={14} /></button>
        </div>
        {listings.length === 0
          ? <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 16px" }}>No listings yet</p>
              <Link href="/dashboard/agent/add-listing" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}><Plus size={14} /> Add Your First Listing</Link>
            </div>
          : listings.slice(0, 3).map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 24px", borderTop: "1px solid #f8fafc" }}>
              <div style={{ width: 52, height: 44, borderRadius: 10, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>{l.cover_image && <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.city}, {l.state}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: T, marginBottom: 4 }}>{l.price_label}</div>
                <StatusBadge status={l.status} />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// ─── Listing Preview Modal ────────────────────────────────────────────────────
function ListingPreviewModal({ listing, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    const fn = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", fn) }
  }, [onClose])
  if (!listing) return null
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8,15,20,0.7)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 600, background: "#fff", borderRadius: "24px 24px 0 0", padding: "24px 20px 32px", maxHeight: "90svh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
        <div style={{ width: 40, height: 4, borderRadius: 50, background: "#e2e8f0", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#0d1f2d" }}>Listing Preview</h3>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} color="#64748b" /></button>
        </div>
        {listing.cover_image && <div style={{ height: 200, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}><img src={listing.cover_image} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ padding: "3px 10px", borderRadius: 50, background: T, color: "#fff", fontSize: 11, fontWeight: 800 }}>{listing.listing_type}</span>
          <span style={{ padding: "3px 10px", borderRadius: 50, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700 }}>{listing.category}</span>
          <span style={{ padding: "3px 10px", borderRadius: 50, background: listing.status === "active" ? "#10b98112" : "#f59e0b12", color: listing.status === "active" ? "#059669" : "#d97706", fontSize: 11, fontWeight: 800, textTransform: "capitalize" }}>{listing.status}</span>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>{listing.title}</h2>
        <div style={{ fontSize: 22, fontWeight: 900, color: T, marginBottom: 8 }}>{listing.price_label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 16 }}><MapPin size={13} color={T} /><span style={{ fontSize: 13, color: "#64748b" }}>{listing.address || listing.city + ", " + listing.state}</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {[{ label: "Views", val: listing.views || 0 }, { label: "Beds", val: listing.beds || "—" }, { label: "Baths", val: listing.baths || "—" }].map(({ label, val }) => (
            <div key={label} style={{ background: "#f8fafc", borderRadius: 12, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        {listing.description && <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px", marginBottom: 16 }}><p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{listing.description.slice(0, 200)}{listing.description.length > 200 ? "…" : ""}</p></div>}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: T + "08", border: "1px solid " + T + "20", marginBottom: 16 }}>
          <Eye size={16} color={T} />
          <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>This is how buyers see your listing</div><div style={{ fontSize: 11, color: "#64748b" }}>Contact forms are hidden for you as the listing owner</div></div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={"/listings/" + listing.id} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px", borderRadius: 12, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0d1f2d", fontSize: 13, fontWeight: 700, textDecoration: "none" }}><Eye size={15} /> Open Live Page</a>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, background: T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Done</button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Listing Modal ───────────────────────────────────────────────────────
function EditListingModal({ listing, onClose, onSave }) {
  const [form, setForm] = useState({ title: listing.title || "", price: listing.price || "", city: listing.city || "", state: listing.state || "", address: listing.address || "", beds: listing.beds || "", baths: listing.baths || "", toilets: listing.toilets || "", sqft: listing.sqft || "", description: listing.description || "", highlights: listing.highlights || "", listing_type: listing.listing_type || "Rent", category: listing.category || "Residential", condition: listing.condition || "New", furnished: listing.furnished || "Unfurnished", negotiable: listing.negotiable || false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "" } }, [])
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const inp = { width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }
  const save = async () => {
    if (!form.title.trim()) { setError("Title is required"); return }
    if (!form.price) { setError("Price is required"); return }
    setError(""); setSaving(true)
    const priceNum = Number(String(form.price).replace(/[^0-9]/g, ""))
    const suffix = form.listing_type === "Rent" ? "/yr" : form.listing_type === "Lease" ? "/lease" : ""
    const priceLabel = "₦" + priceNum.toLocaleString() + suffix
    const { error: err } = await supabase.from("listings").update({ title: form.title.trim(), price: priceNum, price_label: priceLabel, city: form.city.trim(), state: form.state, address: form.address.trim(), beds: Number(form.beds) || 0, baths: Number(form.baths) || 0, toilets: Number(form.toilets) || 0, sqft: form.sqft || null, description: form.description.trim(), highlights: form.highlights.trim(), listing_type: form.listing_type, category: form.category, condition: form.condition, furnished: form.furnished, negotiable: form.negotiable }).eq("id", listing.id)
    setSaving(false)
    if (err) { setError("Failed to save: " + err.message); return }
    setSuccess(true)
    setTimeout(() => onSave(), 1000)
  }
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8,15,20,0.7)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 640, background: "#fff", borderRadius: "24px 24px 0 0", maxHeight: "92svh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
        <div style={{ position: "sticky", top: 0, background: "#fff", padding: "18px 20px 14px", borderBottom: "1px solid #f1f5f9", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#0d1f2d" }}>Edit Listing</h3><p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>{listing.title}</p></div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} color="#64748b" /></button>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,180px),1fr))", gap: 12 }}>
            {[["Type","listing_type",["Buy","Rent","Lease","Commercial","Student"]],["Category","category",["Residential","Commercial","Land","Student Housing","Short Let"]]].map(([label,key,opts]) => (
              <div key={key}><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label><select value={form[key]} onChange={e => update(key, e.target.value)} style={inp}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>
            ))}
          </div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Title *</label><input value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. 3 Bedroom Flat in Lekki" style={inp} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} /></div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Price (₦) *</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input value={form.price} onChange={e => update("price", e.target.value)} placeholder="e.g. 2500000" type="number" style={{ ...inp, flex: 1 }} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}><input type="checkbox" checked={form.negotiable} onChange={e => update("negotiable", e.target.checked)} /> Negotiable</label>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,180px),1fr))", gap: 12 }}>
            <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>City</label><input value={form.city} onChange={e => update("city", e.target.value)} placeholder="e.g. Lagos" style={inp} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} /></div>
            <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>State</label><select value={form.state} onChange={e => update("state", e.target.value)} style={inp}><option value="">Select state</option>{NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Address</label><input value={form.address} onChange={e => update("address", e.target.value)} placeholder="Street address or area" style={inp} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} /></div>
          {form.category !== "Land" && form.category !== "Commercial" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[["Beds","beds"],["Baths","baths"],["Toilets","toilets"]].map(([label,key]) => (
                <div key={key}><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label><input value={form[key]} onChange={e => update(key, e.target.value)} type="number" min="0" style={inp} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} /></div>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,180px),1fr))", gap: 12 }}>
            {[["Condition","condition",["New","Fairly New","Old but good","Needs renovation"]],["Furnished","furnished",["Furnished","Semi-furnished","Unfurnished"]]].map(([label,key,opts]) => (
              <div key={key}><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label><select value={form[key]} onChange={e => update(key, e.target.value)} style={inp}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>
            ))}
          </div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</label><textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4} placeholder="Describe the property…" style={{ ...inp, resize: "vertical", minHeight: 90 }} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} /></div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Key Highlights</label><textarea value={form.highlights} onChange={e => update("highlights", e.target.value)} rows={2} placeholder="e.g. 24/7 power, swimming pool…" style={{ ...inp, resize: "vertical" }} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} /></div>
          {error && <p style={{ margin: 0, fontSize: 13, color: "#ef4444", fontWeight: 600 }}>{error}</p>}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            <button onClick={save} disabled={saving} style={{ flex: 2, padding: "13px", borderRadius: 12, background: success ? "#10b981" : saving ? T + "80" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.3s" }}>
              {saving ? <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : success ? <><CheckCircle size={16} /> Saved!</> : <><Pencil size={15} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Listings Tab ─────────────────────────────────────────────────────────────
function Listings({ listings, loading, onRefresh }) {
  const [filter,         setFilter]         = useState("all")
  const [search,         setSearch]         = useState("")
  const [menuOpen,       setMenuOpen]       = useState(null)
  const [previewListing, setPreviewListing] = useState(null)
  const [editListing,    setEditListing]    = useState(null)
  const filtered = listings.filter(l => {
    const matchStatus = filter === "all" || l.status === filter
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    await supabase.from("listings").delete().eq("id", id)
    onRefresh()
  }
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>My Listings ({listings.length})</h2>
          <button onClick={onRefresh} style={{ width: 34, height: 34, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Refresh"><RefreshCw size={15} color="#64748b" /></button>
        </div>
        <Link href="/dashboard/agent/add-listing" style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 12, background: T, color: "#fff", fontSize: 14, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 16px " + T_GLOW, minHeight: 44 }}><Plus size={16} /> Add New Listing</Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}>
          {["all","active","pending","sold","rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 10px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", textTransform: "capitalize", whiteSpace: "nowrap", flexShrink: 0 }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 44 }}>
          <Search size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        </div>
      </div>
      {loading ? <LoadingCard /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: listings.length === 0 ? T + "12" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Building2 size={36} color={listings.length === 0 ? T : "#cbd5e1"} />
          </div>
          <h3 style={{ margin: "0 0 8px", color: "#0d1f2d", fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em" }}>
            {listings.length === 0 ? "No listings yet" : "No listings found"}
          </h3>
          <p style={{ color: "#94a3b8", margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
            {listings.length === 0
              ? "Start by adding your first property. It takes less than 5 minutes."
              : "Try clearing your search or filters to see all your listings."}
          </p>
          {listings.length === 0
            ? <Link href="/dashboard/agent/add-listing"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800, boxShadow: "0 4px 16px rgba(0,151,178,0.35)" }}>
                <Plus size={16} /> Add Your First Listing
              </Link>
            : <button onClick={() => setSearch("")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 50, background: "#f1f5f9", color: "#64748b", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Clear filters
              </button>
          }
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((l, i) => (
            <div key={l.id} className="listing-mgmt-card" style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", animation: "fadeUp 0.4s ease " + (i * 60) + "ms both", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="listing-mgmt-img" style={{ position: "relative", width: "clamp(90px,25%,160px)", flexShrink: 0 }}>
                {l.cover_image ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 110 }} /> : <div style={{ width: "100%", minHeight: 110, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={28} color="#cbd5e1" /></div>}
                <div style={{ position: "absolute", top: 8, left: 8 }}><StatusBadge status={l.status} /></div>
                {l.is_featured && (
                  <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 50, boxShadow: "0 2px 8px rgba(245,158,11,0.4)" }}>
                    <Sparkles size={9} /> Boosted
                  </div>
                )}
              </div>
              <div style={{ flex: 1, padding: "14px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0, overflow: "hidden" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: "clamp(13px,3vw,15px)", fontWeight: 800, color: "#0d1f2d", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{l.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}><MapPin size={11} color={T} /><span style={{ fontSize: 12, color: "#64748b", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{l.city}, {l.state}</span></div>
                    </div>
                    {/* Desktop action buttons */}
                    <div className="desktop-actions" style={{ display: "none", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => setPreviewListing(l)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0d1f2d", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        <Eye size={12} /> Preview
                      </button>
                      <button onClick={() => setEditListing(l)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid " + T + "30", background: T + "08", color: T, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(l.id)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                    {/* Mobile 3-dot menu */}
                    <div className="mobile-menu" style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (menuOpen === l.id) { setMenuOpen(null); return }
                          setMenuOpen(l.id)
                        }}
                        style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <MoreHorizontal size={16} color="#64748b" />
                      </button>
                      {menuOpen === l.id && (
                        <>
                          <div onClick={() => setMenuOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
                          <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 999, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", overflow: "hidden", minWidth: 170 }}>
                            {[
                              { icon: Eye,    label: "Preview", color: "#0d1f2d", bg: "#f8fafc", action: () => { setMenuOpen(null); setPreviewListing(l) } },
                              { icon: Pencil, label: "Edit",    color: T,         bg: T + "08",  action: () => { setMenuOpen(null); setEditListing(l) } },
                              { icon: Trash2, label: "Delete",  color: "#ef4444", bg: "#fef2f2", action: () => { setMenuOpen(null); handleDelete(l.id) } },
                            ].map(({ icon: Icon, label, color, bg, action }) => (
                              <button key={label} onClick={action}
                                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "13px 16px", border: "none", background: "#fff", color, fontSize: 14, fontWeight: 700, cursor: "pointer", borderBottom: label !== "Delete" ? "1px solid #f8fafc" : "none", transition: "background 0.12s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = bg }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff" }}>
                                <Icon size={15} /> {label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {l.beds > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b", background: "#f8fafc", padding: "2px 8px", borderRadius: 50, border: "1px solid #f1f5f9" }}><Bed size={11} color="#94a3b8" />{l.beds} bd</span>}
                    {l.baths > 0 && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b", background: "#f8fafc", padding: "2px 8px", borderRadius: 50, border: "1px solid #f1f5f9" }}><Bath size={11} color="#94a3b8" />{l.baths} ba</span>}
                    {l.sqft && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b", background: "#f8fafc", padding: "2px 8px", borderRadius: 50, border: "1px solid #f1f5f9" }}><Maximize2 size={11} color="#94a3b8" />{Number(l.sqft).toLocaleString()} sqft</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
                  <span style={{ fontSize: "clamp(14px,3.5vw,17px)", fontWeight: 900, color: "#fff", background: T, padding: "4px 10px", borderRadius: 50, alignSelf: "flex-start", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.price_label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={11} color="#94a3b8" /><span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{(l.views || 0).toLocaleString()} views · {l.saves || 0} saves</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {previewListing && <ListingPreviewModal listing={previewListing} onClose={() => setPreviewListing(null)} />}
      {editListing && <EditListingModal listing={editListing} onClose={() => setEditListing(null)} onSave={() => { setEditListing(null); onRefresh() }} />}
    </div>
  )
}

// ─── Enquiries Tab ────────────────────────────────────────────────────────────
function Enquiries({ enquiries, loading, onRefresh, targetEnquiryId, onClearTarget }) {
  const { showToast } = useToast()
  const [filter,        setFilter]        = useState("all")
  const [selected,      setSelected]      = useState(null)
  const [messages,      setMessages]      = useState([])
  const [reply,         setReply]         = useState("")
  const [sending,       setSending]       = useState(false)
  const [loadingMsgs,   setLoadingMsgs]   = useState(false)
  const [isTyping,      setIsTyping]      = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [unreadCounts,  setUnreadCounts]  = useState({})
  const bottomRef    = useRef(null)
  const textareaRef  = useRef(null)
  const prevCountRef = useRef(0)
  const typingTimer  = useRef(null)

  const TEMPLATES = [
    "Thank you for your interest! The property is still available. When would you like to schedule a viewing?",
    "Please call me directly so we can discuss further details about this property.",
    "Yes, the price is negotiable. What is your budget? Let us see what we can work out.",
    "I will send you more photos and details about this property shortly.",
    "The property has been taken. However, I have similar properties available that may interest you.",
    "Good day! Please share a convenient time for us to visit the property together.",
  ]

  const filtered = enquiries.filter(e => filter === "all" || e.status === filter)
  const active   = selected ? enquiries.find(e => e.id === selected) : null

  const filterCounts = {
    all:     enquiries.length,
    new:     enquiries.filter(e => e.status === "new").length,
    replied: enquiries.filter(e => e.status === "replied").length,
    closed:  enquiries.filter(e => e.status === "closed").length,
  }

  // Auto-navigate to target enquiry from notification
  useEffect(() => {
    if (!targetEnquiryId) return
    const found = enquiries.find(e => e.id === targetEnquiryId)
    if (found) { setSelected(targetEnquiryId); if (onClearTarget) onClearTarget() }
  }, [targetEnquiryId, enquiries])

  // Load unread counts in a single query
  useEffect(() => {
    const load = async () => {
      if (!enquiries.length) return
      const ids = enquiries.map(e => e.id)
      const { data } = await supabase.from("enquiry_messages")
        .select("enquiry_id").in("enquiry_id", ids).eq("sender", "user").eq("is_read", false)
      const counts = {}
      if (data) data.forEach(m => { counts[m.enquiry_id] = (counts[m.enquiry_id] || 0) + 1 })
      setUnreadCounts(counts)
    }
    load()
  }, [enquiries])

  const loadMessages = async (id, showLoader) => {
    if (showLoader) setLoadingMsgs(true)
    const { data } = await supabase.from("enquiry_messages")
      .select("*").eq("enquiry_id", id).order("created_at", { ascending: true })
    const msgs = data || []
    if (showLoader) setLoadingMsgs(false)
    if (msgs.length !== prevCountRef.current) {
      prevCountRef.current = msgs.length
      setMessages(msgs)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80)
    }
    await supabase.from("enquiry_messages").update({ is_read: true })
      .eq("enquiry_id", id).eq("sender", "user")
    setUnreadCounts(prev => ({ ...prev, [id]: 0 }))
  }

  useEffect(() => {
    if (!selected) return
    prevCountRef.current = 0
    loadMessages(selected, true)
    const interval = setInterval(() => loadMessages(selected, false), 4000)
    return () => clearInterval(interval)
  }, [selected])

  const handleReplyChange = (val) => {
    setReply(val)
    setIsTyping(val.length > 0)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setIsTyping(false), 2000)
    // Auto resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px"
    }
  }

  const sendReply = async () => {
    if (!reply.trim() || !active || sending) return
    setSending(true)
    setShowTemplates(false)
    const msg = reply.trim()
    setReply("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setIsTyping(false)
    await supabase.from("enquiry_messages").insert({ enquiry_id: active.id, sender: "agent", message: msg, is_read: false })
    await supabase.from("enquiries").update({ status: "replied", agent_reply: msg, replied_at: new Date().toISOString() }).eq("id", active.id)
    if (active.user_id) {
      await supabase.from("notifications").insert({
        user_id: active.user_id, type: "personal",
        title: "Agent replied to your enquiry",
        body: msg.slice(0, 80) + (msg.length > 80 ? "…" : ""),
      })
    }
    setSending(false)
    showToast("✅ Reply sent!", "sent")
    await loadMessages(active.id)
    onRefresh()
  }

  const groupByDate = (msgs) => {
    const groups = {}
    msgs.forEach(msg => {
      const d = new Date(msg.created_at)
      const today = new Date()
      const yest  = new Date(today); yest.setDate(yest.getDate() - 1)
      const label = d.toDateString() === today.toDateString() ? "Today"
        : d.toDateString() === yest.toDateString() ? "Yesterday"
        : d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })
      if (!groups[label]) groups[label] = []
      groups[label].push(msg)
    })
    return groups
  }

  const formatTime = (ts) => new Date(ts).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })

  const statusConfig = {
    new:     { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444", label: "New"     },
    replied: { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e", label: "Replied" },
    closed:  { bg: "#f8fafc", color: "#64748b", dot: "#94a3b8", label: "Closed"  },
  }

  const msgGroups = groupByDate(messages)
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em" }}>Enquiries</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{enquiries.length} total{totalUnread > 0 ? ` · ${totalUnread} unread` : ""}</p>
        </div>
        <button onClick={onRefresh} style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <RefreshCw size={15} color="#64748b" />
        </button>
      </div>

      <div style={{ display: "grid", gap: 16 }} className="enquiry-layout">

        {/* ── LEFT: Enquiry List ── */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column" }} className={selected ? "hide-on-mobile" : ""}>
          {/* Filter tabs */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", flexShrink: 0 }}>
            <div style={{ display: "flex", background: "#f8fafc", borderRadius: 12, padding: 3, gap: 2 }}>
              {["all","new","replied","closed"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ flex: 1, padding: "7px 4px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#94a3b8", boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s", position: "relative" }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {filterCounts[f] > 0 && f !== "all" && (
                    <span style={{ marginLeft: 3, fontSize: 10, opacity: 0.7 }}>({filterCounts[f]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1, maxHeight: 540 }}>
            {loading ? <LoadingCard /> : filtered.length === 0
              ? (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <MessageCircle size={36} color="#e2e8f0" style={{ marginBottom: 12 }} />
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>No {filter !== "all" ? filter : ""} enquiries</p>
                </div>
              )
              : filtered.map(e => {
                const sc     = statusConfig[e.status] || statusConfig.new
                const isActive = selected === e.id
                const unread   = unreadCounts[e.id] || 0
                const initial  = (e.sender_name || "?").charAt(0).toUpperCase()
                const timeStr  = new Date(e.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })
                return (
                  <button key={e.id} onClick={() => setSelected(e.id)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", border: "none", width: "100%", textAlign: "left", cursor: "pointer", transition: "background 0.12s", borderBottom: "1px solid #f8fafc", borderLeft: `3px solid ${isActive ? T : unread > 0 ? "#ef4444" : "transparent"}`, background: isActive ? T + "06" : unread > 0 ? "#fffbfb" : "#fff" }}>
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${T}30, ${T}15)`, border: `2px solid ${T}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: T }}>
                        {initial}
                      </div>
                      {/* Online dot placeholder */}
                      <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: sc.dot, border: "2px solid #fff" }} />
                      {unread > 0 && (
                        <div style={{ position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", border: "2px solid #fff", padding: "0 3px" }}>
                          {unread > 9 ? "9+" : unread}
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: unread > 0 ? 900 : 700, color: "#0d1f2d", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "70%" }}>
                          {e.sender_name || "Anonymous"}
                        </span>
                        <span style={{ fontSize: 10, color: "#b0bec5", flexShrink: 0 }}>{timeStr}</span>
                      </div>
                      {e.listings?.title && (
                        <div style={{ fontSize: 11, color: T, fontWeight: 700, marginBottom: 3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                          🏠 {e.listings.title}
                        </div>
                      )}
                      <p style={{ margin: "0 0 6px", fontSize: 12, color: unread > 0 ? "#374151" : "#94a3b8", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", fontWeight: unread > 0 ? 600 : 400, lineHeight: 1.4 }}>
                        {e.message}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 800 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                          {sc.label}
                        </span>
                        {e.sender_phone && <span style={{ fontSize: 10, color: "#94a3b8" }}>📞 {e.sender_phone}</span>}
                      </div>
                    </div>
                  </button>
                )
              })
            }
          </div>
        </div>

        {/* ── RIGHT: Chat Window ── */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 540 }}>
          {active ? (
            <>
              {/* Chat header */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Back button mobile */}
                  <button onClick={() => setSelected(null)} className="back-btn-mobile"
                    style={{ width: 34, height: 34, borderRadius: 10, background: "#f8fafc", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    <ArrowLeft size={16} color="#64748b" />
                  </button>
                  {/* Avatar */}
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${T}30, ${T}15)`, border: `2px solid ${T}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: T, flexShrink: 0 }}>
                    {(active.sender_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>{active.sender_name || "Anonymous"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {active.listings?.title ? `🏠 ${active.listings.title}` : "General enquiry"}
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {active.sender_phone && (
                      <a href={`tel:${active.sender_phone}`}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 50, background: "#f0fdf4", color: "#16a34a", textDecoration: "none", fontSize: 12, fontWeight: 800, border: "1px solid #bbf7d0" }}>
                        <Phone size={12} /> Call
                      </a>
                    )}
                    {active.sender_phone && (
                      <a href={`https://wa.me/${active.sender_phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 50, background: "#f0fdf4", color: "#16a34a", textDecoration: "none", fontSize: 12, fontWeight: 800, border: "1px solid #bbf7d0" }}>
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: 0 }}>
                {loadingMsgs ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader size={22} color={T} style={{ animation: "spin 1s linear infinite" }} />
                  </div>
                ) : (
                  <>
                    {/* Initial enquiry message if no chat messages */}
                    {messages.length === 0 && (
                      <>
                        <div style={{ textAlign: "center", margin: "0 0 12px" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8", background: "#e2e8f0", padding: "3px 14px", borderRadius: 50, fontWeight: 600 }}>
                            {new Date(active.created_at).toDateString() === new Date().toDateString() ? "Today" : new Date(active.created_at).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
                          <div style={{ maxWidth: "75%", background: "#fff", borderRadius: "4px 18px 18px 18px", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                            <p style={{ margin: "0 0 6px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{active.message}</p>
                            <span style={{ fontSize: 10, color: "#b0bec5" }}>{formatTime(active.created_at)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Grouped messages */}
                    {Object.entries(msgGroups).map(([label, msgs]) => (
                      <div key={label}>
                        <div style={{ textAlign: "center", margin: "12px 0 10px" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8", background: "#e2e8f0", padding: "3px 14px", borderRadius: 50, fontWeight: 600 }}>{label}</span>
                        </div>
                        {msgs.map((msg, i) => {
                          const isAgent = msg.sender === "agent"
                          const showAvatar = !isAgent && (i === 0 || msgs[i-1]?.sender !== "user")
                          return (
                            <div key={msg.id} style={{ display: "flex", justifyContent: isAgent ? "flex-end" : "flex-start", marginBottom: 4, alignItems: "flex-end", gap: 6 }}>
                              {!isAgent && (
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${T}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: T, flexShrink: 0, opacity: showAvatar ? 1 : 0 }}>
                                  {(active.sender_name || "?").charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div style={{ maxWidth: "72%", background: isAgent ? T : "#fff", borderRadius: isAgent ? "18px 4px 18px 18px" : "4px 18px 18px 18px", padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: isAgent ? "none" : "1px solid #f1f5f9" }}>
                                <p style={{ margin: "0 0 5px", fontSize: 14, color: isAgent ? "#fff" : "#374151", lineHeight: 1.6 }}>{msg.message}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                                  <span style={{ fontSize: 10, color: isAgent ? "rgba(255,255,255,0.6)" : "#b0bec5" }}>{formatTime(msg.created_at)}</span>
                                  {isAgent && (
                                    <span style={{ fontSize: 11, color: msg.is_read ? "#93f0ff" : "rgba(255,255,255,0.45)", fontWeight: 700 }}>✓✓</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                        <div style={{ background: T + "20", borderRadius: "18px 4px 18px 18px", padding: "8px 14px" }}>
                          <span style={{ fontSize: 12, color: T, fontWeight: 700, letterSpacing: 2 }}>···</span>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* Quick replies */}
              {showTemplates && (
                <div style={{ borderTop: "1px solid #f1f5f9", background: "#fff", maxHeight: 200, overflowY: "auto" }}>
                  <div style={{ padding: "10px 16px 6px", fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Replies</div>
                  {TEMPLATES.map((t, i) => (
                    <button key={i} onClick={() => { setReply(t); setShowTemplates(false); textareaRef.current?.focus() }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", border: "none", borderTop: "1px solid #f8fafc", background: "transparent", cursor: "pointer", fontSize: 13, color: "#374151", lineHeight: 1.5, transition: "background 0.12s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T + "08" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div style={{ padding: "10px 14px", borderTop: "1px solid #f1f5f9", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  {/* Quick reply toggle */}
                  <button onClick={() => setShowTemplates(p => !p)} title="Quick replies"
                    style={{ width: 38, height: 38, borderRadius: 12, background: showTemplates ? T + "15" : "#f8fafc", border: `1.5px solid ${showTemplates ? T : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
                    <Zap size={15} color={showTemplates ? T : "#94a3b8"} />
                  </button>

                  {/* Textarea */}
                  <div style={{ flex: 1, position: "relative" }}>
                    <textarea ref={textareaRef} value={reply}
                      onChange={e => handleReplyChange(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                      placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
                      rows={1}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 16, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s, background 0.2s", lineHeight: 1.5, minHeight: 42, maxHeight: 120, overflow: "auto" }}
                      onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
                    />
                    {reply.length > 200 && (
                      <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: reply.length > 450 ? "#ef4444" : "#94a3b8", background: "rgba(255,255,255,0.9)", padding: "1px 4px", borderRadius: 4 }}>
                        {reply.length}/500
                      </span>
                    )}
                  </div>

                  {/* Send button */}
                  <button onClick={sendReply} disabled={sending || !reply.trim()}
                    style={{ width: 42, height: 42, borderRadius: 14, background: sending || !reply.trim() ? "#f1f5f9" : T, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: sending || !reply.trim() ? "not-allowed" : "pointer", flexShrink: 0, transition: "all 0.2s", transform: reply.trim() && !sending ? "scale(1.05)" : "scale(1)" }}>
                    {sending
                      ? <Loader size={16} color={reply.trim() ? "#fff" : "#94a3b8"} style={{ animation: "spin 1s linear infinite" }} />
                      : <Send size={16} color={reply.trim() ? "#fff" : "#94a3b8"} />
                    }
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: T + "10", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <MessageCircle size={36} color={T} style={{ opacity: 0.5 }} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Select a conversation</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6, maxWidth: 240 }}>
                Pick an enquiry from the list to view messages and reply to buyers
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Performance Tab ──────────────────────────────────────────────────────────
function Performance({ agent, user, listings }) {
  const totalViews     = listings.reduce((s, l) => s + (l.views || 0), 0)
  const activeListings = listings.filter(l => l.status === "active").length
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg," + DARK + " 0%," + T_DARK + " 100%)", borderRadius: 24, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {user?.avatar_url
            ? <img key={user.avatar_url} src={user.avatar_url} alt={user.full_name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid " + T, flexShrink: 0 }} />
            : <div style={{ width: 72, height: 72, borderRadius: "50%", background: T + "30", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: T, flexShrink: 0 }}>{user?.full_name?.charAt(0) || "A"}</div>}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(18px,3vw,24px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{user?.full_name}</h2>
              {agent?.is_verified && <BadgeCheck size={20} color="#10b981" />}
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
              Property Agent{user?.city ? " · " + user.city : ""}{user?.state ? ", " + user.state : " · Nigeria"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{agent?.rating > 0 ? agent.rating : "—"}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Rating</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{agent?.total_deals || 0}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Deals</div></div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Active Listings", value: activeListings, color: T, icon: Building2 },
          { label: "Total Views", value: totalViews.toLocaleString(), color: "#f59e0b", icon: Eye },
          { label: "Total Listings", value: listings.length, color: "#8b5cf6", icon: Activity },
          { label: "Verified", value: agent?.is_verified ? "Yes ✓" : "Not Verified", color: agent?.is_verified ? "#10b981" : "#94a3b8", icon: BadgeCheck },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "20px", border: "1px solid #f1f5f9", animation: "fadeUp 0.4s ease " + (i * 70) + "ms both" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Icon size={18} color={color} /></div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Views per listing chart */}
      {listings.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", animation: "fadeUp 0.4s ease 280ms both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Analytics</div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#0d1f2d" }}>Views per Listing</h3>
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{totalViews.toLocaleString()} total</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, overflowX: "auto", paddingBottom: 8 }}>
            {listings
              .filter(l => l.status === "active")
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 10)
              .map((l, i) => {
                const maxViews = Math.max(...listings.map(x => x.views || 0), 1)
                const pct = Math.max(((l.views || 0) / maxViews) * 100, 4)
                const isTop = i === 0
                return (
                  <div key={l.id} style={{ flex: 1, minWidth: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isTop ? T : "#94a3b8" }}>{l.views || 0}</div>
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                      <div style={{ width: "100%", height: pct + "%", minHeight: 4, borderRadius: "6px 6px 0 0", background: isTop ? T : T + "40", transition: "height 0.8s ease " + (i * 80) + "ms" }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: "100%", maxWidth: 52 }}
                      title={l.title}>
                      {l.title?.split(" ").slice(0, 2).join(" ")}
                    </div>
                  </div>
                )
              })}
          </div>
          {listings.filter(l => l.status === "active").length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: 13 }}>No active listings to show</div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function AgentSettings({ user, onUpdate, onAvatarUpdate }) {
  const [name,         setName]         = useState(user?.full_name || "")
  const [phone,        setPhone]        = useState(user?.phone || "")
  const [city,         setCity]         = useState(user?.city || "")
  const [state,        setState]        = useState(user?.state || "")
  const [saved,        setSaved]        = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [avatarUrl,    setAvatarUrl]    = useState(user?.avatar_url || null)
  const [refreshKey,   setRefreshKey]   = useState(Date.now())
  const [uploadingImg, setUploadingImg] = useState(false)
  const [imgError,     setImgError]     = useState("")
  const photoInputRef = useRef(null)

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { setImgError("Please select an image file"); return }
    if (file.size > 5 * 1024 * 1024)    { setImgError("Image must be under 5MB"); return }
    setImgError("")
    setUploadingImg(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const ext      = file.name.split(".").pop()
    const fileName = `${authUser.id}/avatar.${ext}`
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true, cacheControl: "no-cache" })
    if (error) { setImgError("Upload failed: " + error.message); setUploadingImg(false); return }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(data.path)
    // Save timestamped URL to DB so fetchData always returns the busted URL
    const ts = Date.now()
    const newUrl = publicUrl + "?t=" + ts
    await supabase.from("users").update({ avatar_url: newUrl }).eq("id", authUser.id)
    setAvatarUrl(newUrl)
    setRefreshKey(ts)
    setUploadingImg(false)
    // Update parent state so sidebar refreshes immediately without remounting
    if (onAvatarUpdate) onAvatarUpdate(newUrl)
    e.target.value = ""
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("users").update({ full_name: name, phone, city, state }).eq("id", authUser.id)
    setSaving(false); setSaved(true)
    onUpdate()
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease both" }}>
        <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Profile Settings</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #f8fafc" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {avatarUrl
              ? <img key={refreshKey} src={avatarUrl} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid " + T }} />
              : <div style={{ width: 80, height: 80, borderRadius: "50%", background: T + "20", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: T }}>{name?.charAt(0) || "A"}</div>}
            {uploadingImg && (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader size={22} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            )}
          </div>
          <div>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            <button type="button" onClick={() => photoInputRef.current?.click()} disabled={uploadingImg}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, background: T + "10", border: "1.5px solid " + T + "40", color: T, fontSize: 13, fontWeight: 700, cursor: uploadingImg ? "not-allowed" : "pointer", marginBottom: 6 }}>
              <Upload size={14} /> {uploadingImg ? "Uploading…" : "Change Photo"}
            </button>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>JPG, PNG up to 5MB</p>
            {imgError && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{imgError}</p>}
          </div>
        </div>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Full Name",    value: name,  set: setName,  type: "text", placeholder: "Your full name"    },
            { label: "Phone Number", value: phone, set: setPhone, type: "tel",  placeholder: "+234 800 000 0000" },
            { label: "City",         value: city,  set: setCity,  type: "text", placeholder: "e.g. Lagos"        },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
              <input value={value} onChange={e => set(e.target.value)} type={type} placeholder={placeholder}
                style={{ ...inputBase }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>State</label>
            <select value={state} onChange={e => setState(e.target.value)}
              style={{ ...inputBase, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 44, cursor: "pointer" }}
              onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}>
              <option value="">Select state</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving}
            style={{ padding: "13px", borderRadius: 14, background: saved ? "#10b981" : saving ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, transition: "background 0.3s", boxShadow: "0 6px 20px " + T_GLOW }}>
            {saving ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : saved ? <><CheckCircle size={17} /> Saved!</> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Agent Browse Market Tab ──────────────────────────────────────────────────
function AgentBrowseTab() {
  const [listings,  setListings]  = useState([])
  const [agents,    setAgents]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState("")
  const [activeTab, setActiveTab] = useState("listings")

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const { data: listingsData } = await supabase.from("listings").select("*").eq("status", "active").eq("is_flagged", false).order("created_at", { ascending: false }).limit(20)
      if (listingsData?.length > 0) {
        const ids = listingsData.map(l => l.id)
        const { data: imgs } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        setListings(listingsData.map(l => { const li = imgs ? imgs.filter(i => i.listing_id === l.id) : []; return { ...l, cover_image: li.find(i => i.is_cover)?.url || li[0]?.url || null } }))
      }
      const { data: agentsData } = await supabase.from("agents").select("*, users(full_name, avatar_url, phone, city, state)").order("is_verified", { ascending: false }).order("rating", { ascending: false }).limit(20)
      setAgents(agentsData || [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filteredListings = listings.filter(l => !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase()))
  const filteredAgents   = agents.filter(a => !search || (a.users?.full_name || "").toLowerCase().includes(search.toLowerCase()) || (a.users?.city || "").toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Browse Market</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Explore listings and agents on the platform.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 48, marginBottom: 16 }}>
        <Search size={15} color="#94a3b8" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings or agents…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={14} color="#94a3b8" /></button>}
      </div>
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 20, width: "fit-content" }}>
        {[["listings","Listings",Building2],["agents","Agents",Users]].map(([key,label,Icon]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: activeTab === key ? "#fff" : "transparent", color: activeTab === key ? "#0d1f2d" : "#64748b", boxShadow: activeTab === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}><Loader size={28} color={T} style={{ animation: "spin 1s linear infinite" }} /></div>
      ) : activeTab === "listings" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
          {filteredListings.map((l, i) => (
            <a key={l.id} href={"/listings/" + l.id}
              style={{ textDecoration: "none", display: "block", background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ height: 160, background: "#f1f5f9", overflow: "hidden", position: "relative" }}>
                {l.cover_image ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={32} color="#cbd5e1" /></div>}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
                <span style={{ position: "absolute", bottom: 8, left: 10, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>{l.listing_type}</span>
                {l.is_featured && <span style={{ position: "absolute", top: 8, left: 8, background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 50 }}>✦ Featured</span>}
              </div>
              <div style={{ padding: "13px 15px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}><MapPin size={10} color={T} /><span style={{ fontSize: 11, color: "#64748b" }}>{l.city}, {l.state}</span></div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 16, fontWeight: 900, color: T }}>{l.price_label}</span><span style={{ fontSize: 11, color: "#94a3b8" }}>{l.views || 0} views</span></div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 16 }}>
          {filteredAgents.map((a, i) => {
            const name = a.users?.full_name || "Agent"
            const loc  = [a.users?.city, a.users?.state].filter(Boolean).join(", ") || "Nigeria"
            return (
              <div key={a.id} style={{ background: "#fff", borderRadius: 18, padding: "20px", border: "1px solid " + (a.is_verified ? T + "20" : "#f1f5f9"), boxShadow: "0 2px 8px rgba(0,0,0,0.05)", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  {a.users?.avatar_url ? <img src={a.users.avatar_url} alt={name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T }} /> : <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "20", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: T }}>{name.charAt(0)}</div>}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>{a.is_verified && <BadgeCheck size={14} color="#10b981" />}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{loc}</div>
                    {a.rating > 0 && <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}><Star size={11} color="#f59e0b" fill="#f59e0b" /><span style={{ fontSize: 11, fontWeight: 700, color: "#0d1f2d" }}>{a.rating}</span><span style={{ fontSize: 11, color: "#94a3b8" }}>({a.total_reviews || 0})</span></div>}
                  </div>
                </div>
                {a.users?.phone && <a href={"tel:" + a.users.phone} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}><Phone size={13} /> Call Agent</a>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Support Tab ──────────────────────────────────────────────────────────────
function SupportTab({ user, role }) {
  const [subject, setSubject] = useState(""); const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false); const [sent, setSent] = useState(false)
  const [error, setError] = useState(""); const [myTickets, setMyTickets] = useState([])
  useEffect(() => {
    if (!user?.id) return
    supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setMyTickets(data || []))
  }, [user, sent])
  const submit = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) { setError("Please fill in all fields."); return }
    setError(""); setSubmitting(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("support_tickets").insert({ user_id: authUser.id, subject: subject.trim(), message: message.trim(), role, status: "open" })
    setSubmitting(false); setSent(true); setSubject(""); setMessage("")
    setTimeout(() => setSent(false), 3000)
  }
  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }
  const statusConfig = { open: { bg: "#ef444412", color: "#ef4444", label: "Open" }, in_review: { bg: "#f59e0b12", color: "#d97706", label: "In Review" }, resolved: { bg: "#10b98112", color: "#059669", label: "Resolved" } }
  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ background: "linear-gradient(135deg,#0d1f2d 0%,#1e3a4a 100%)", borderRadius: 20, padding: "24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: T + "20", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: T + "30", border: "1.5px solid " + T + "60", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={24} color={T} /></div>
          <div><h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#fff" }}>Help & Support</h2><p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Send a message to the FindWithHabi support team</p></div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>New Support Request</h3>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Subject <span style={{ color: "#ef4444" }}>*</span></label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" style={inputStyle} onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Message <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Describe your issue in detail…" style={{ ...inputStyle, resize: "vertical", minHeight: 120 }} onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
          </div>
          {error && <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>{error}</p>}
          <button type="submit" disabled={submitting} style={{ padding: "13px", borderRadius: 14, background: sent ? "#10b981" : submitting ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, transition: "background 0.3s", boxShadow: "0 6px 20px " + T_GLOW }}>
            {submitting ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : sent ? <><CheckCircle size={17} /> Sent! We will reply soon</> : <><Send size={17} /> Send to Support</>}
          </button>
        </form>
      </div>
      {myTickets.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>My Previous Tickets</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myTickets.map((t, i) => {
              const sc = statusConfig[t.status] || statusConfig.open
              return (
                <div key={t.id} style={{ padding: "14px 16px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d" }}>{t.subject}</span>
                    <span style={{ padding: "2px 9px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{sc.label}</span>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{t.message}</p>
                  {t.admin_reply && <div style={{ padding: "10px 12px", borderRadius: 10, background: T + "08", borderLeft: "3px solid " + T, marginTop: 8 }}><div style={{ fontSize: 11, fontWeight: 700, color: T, marginBottom: 3 }}>Support Reply</div><p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{t.admin_reply}</p></div>}
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{new Date(t.created_at).toLocaleDateString()}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab({ agent, user }) {
  const REPORT_TYPES = [{ value: "listing", label: "Listing Issue", icon: "🏠" }, { value: "agent", label: "Agent Complaint", icon: "👤" }, { value: "bug", label: "Bug / Technical", icon: "🐛" }, { value: "other", label: "Other", icon: "📋" }]
  const [form, setForm] = useState({ type: "bug", subject: "", description: "" })
  const [submitting, setSubmitting] = useState(false); const [submitted, setSubmitted] = useState(false); const [error, setError] = useState("")
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const submit = async (e) => {
    e.preventDefault()
    if (!form.subject.trim()) { setError("Please enter a subject."); return }
    if (!form.description.trim()) { setError("Please describe the issue."); return }
    setError(""); setSubmitting(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("reports").insert({ reporter_id: authUser.id, type: form.type, subject: form.subject, description: form.description, agent_id: agent?.id || null, status: "new" })
    setSubmitting(false); setSubmitted(true)
  }
  if (submitted) return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10b98112", border: "3px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><CheckCircle size={38} color="#10b981" /></div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Report Submitted!</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Thank you for letting us know. Our admin team will review your report and get back to you if needed.</p>
        <button onClick={() => { setSubmitted(false); setForm({ type: "bug", subject: "", description: "" }) }} style={{ padding: "12px 28px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Submit Another Report</button>
      </div>
    </div>
  )
  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ background: "linear-gradient(135deg,#7f1d1d 0%,#dc2626 100%)", borderRadius: 20, padding: "26px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Flag size={26} color="#fff" /></div>
          <div><h2 style={{ margin: "0 0 5px", fontSize: 20, fontWeight: 900, color: "#fff" }}>Report an Issue</h2><p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Report a bug, listing problem, or agent complaint to our admin team.</p></div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Report Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
              {REPORT_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => update("type", t.value)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, border: "1.5px solid " + (form.type === t.value ? "#ef4444" : "#e2e8f0"), background: form.type === t.value ? "#ef444408" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: form.type === t.value ? "#ef4444" : "#64748b" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Subject <span style={{ color: "#ef4444" }}>*</span></label>
            <input value={form.subject} onChange={e => update("subject", e.target.value)} placeholder="Brief summary of the issue" style={{ ...inputBase }} onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={5} placeholder="Describe the issue in detail — what happened, when, and what you expected…" style={{ ...inputBase, resize: "vertical", minHeight: 120 }} onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>Submitted as <strong style={{ color: "#64748b" }}>{user?.full_name || "Agent"}</strong> · {user?.email} · Admin will review privately.</p>
          </div>
          {error && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5" }}><AlertCircle size={14} color="#ef4444" /><span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span></div>}
          <button type="submit" disabled={submitting} style={{ padding: "14px", borderRadius: 14, background: submitting ? "#ef444470" : "#ef4444", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52, boxShadow: submitting ? "none" : "0 6px 20px rgba(239,68,68,0.3)" }}>
            {submitting ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : <><Flag size={17} /> Submit Report</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AgentDashboard() {
  const router = useRouter()
  const [tab,             setTab]             = useState("overview")
  const [sidebarOpen,     setSidebarOpen]     = useState(false)
  const [targetEnquiryId, setTargetEnquiryId] = useState(null)
  const [user,            setUser]            = useState(null)
  const [agent,           setAgent]           = useState(null)
  const [listings,        setListings]        = useState([])
  const [enquiries,       setEnquiries]       = useState([])
  const [verifRequest,    setVerifRequest]    = useState(null)
  const [loading,         setLoading]         = useState(true)

  // Silent enquiry refresh — no loading flash
  const refreshEnquiries = async (agentId) => {
    const { data: enquiriesData } = await supabase
      .from("enquiries")
      .select("*, listings(title), users(full_name, phone)")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
    if (enquiriesData) setEnquiries(enquiriesData)
  }

  const fetchData = async () => {
    setLoading(true)
    // Try getUser first, fall back to getSession for mobile browsers
    let authUser = null
    const { data: { user: u }, error: authError } = await supabase.auth.getUser()
    if (u) {
      authUser = u
    } else {
      const { data: { session } } = await supabase.auth.getSession()
      authUser = session?.user || null
    }
    if (!authUser) { router.push("/auth"); return }
    const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
    setUser(userData)
    const { data: agentData } = await supabase.from("agents").select("*").eq("user_id", authUser.id).single()
    setAgent(agentData)
    if (!agentData) { setLoading(false); return }
    const { data: listingsData } = await supabase.from("listings").select("*").eq("agent_id", agentData.id).order("created_at", { ascending: false })
    if (listingsData && listingsData.length > 0) {
      const ids = listingsData.map(l => l.id)
      const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
      setListings(listingsData.map(l => { const imgs = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []; return { ...l, cover_image: imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null } }))
    } else { setListings([]) }
    const { data: enquiriesData } = await supabase.from("enquiries").select("*, listings(title), users(full_name, phone)").eq("agent_id", agentData.id).order("created_at", { ascending: false })
    setEnquiries(enquiriesData || [])
    const { data: verifData } = await supabase.from("verification_requests").select("*").eq("agent_id", agentData.id).order("submitted_at", { ascending: false }).limit(1).maybeSingle()
    setVerifRequest(verifData)
    setLoading(false)
  }

  // Update just the avatar in user state — without triggering a full fetchData
  const handleAvatarUpdate = (newUrl) => {
    setUser(prev => prev ? { ...prev, avatar_url: newUrl } : prev)
  }

  useEffect(() => {
    // Use onAuthStateChange so mobile browsers get session before redirect check
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        router.push("/auth")
      } else if (session) {
        fetchData()
      }
    })
    fetchData()
    const fn = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener("resize", fn)
    return () => {
      subscription?.unsubscribe()
      window.removeEventListener("resize", fn)
    }
  }, [])

  const titles = {
    overview: "Overview", listings: "My Listings", browse: "Browse Market",
    enquiries: "Enquiries", featured: "Boost Listing", verification: "Get Verified",
    performance: "Performance", settings: "Settings", report: "Report an Issue", support: "Help & Support",
  }

  const renderTab = () => {
    if (loading) return <LoadingCard />
    if (tab === "overview")     return <Overview user={user} agent={agent} listings={listings} enquiries={enquiries} verifRequest={verifRequest} onNav={setTab} />
    if (tab === "listings")     return <Listings listings={listings} loading={loading} onRefresh={fetchData} />
    if (tab === "browse")       return <AgentBrowseTab />
    if (tab === "enquiries")    return <Enquiries enquiries={enquiries} loading={loading} onRefresh={() => refreshEnquiries(agent?.id)} targetEnquiryId={targetEnquiryId} onClearTarget={() => setTargetEnquiryId(null)} />
    if (tab === "featured")     return <FeatureListingTab agent={agent} user={user} listings={listings} onRefresh={fetchData} />
    if (tab === "verification") return <VerificationTab agent={agent} user={user} verifRequest={verifRequest} onSubmit={fetchData} />
    if (tab === "performance")  return <Performance agent={agent} user={user} listings={listings} />
    if (tab === "settings")     return <AgentSettings user={user} onUpdate={fetchData} onAvatarUpdate={handleAvatarUpdate} />
    if (tab === "report")       return <ReportTab agent={agent} user={user} />
    if (tab === "support")      return <SupportTab user={user} role="agent" />
    return null
  }

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex" }}>
      <script src="https://js.paystack.co/v1/inline.js" async />
      <Sidebar active={tab} onNav={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} agent={agent} user={user} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="main-area">
        <Topbar title={titles[tab]} onMenuOpen={() => setSidebarOpen(true)} userId={user?.id} onNavToEnquiries={(enquiryId) => { setTab("enquiries"); if (enquiryId) setTargetEnquiryId(enquiryId) }} onNav={setTab} />
        <main style={{ flex: 1, padding: "24px 16px 48px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="main-container">
          {renderTab()}
        </main>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; max-width: 100vw; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:focus, textarea:focus, select:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        :focus-visible { outline: 2px solid ${T}; outline-offset: 3px; border-radius: 4px; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @media (max-width: 500px) {
          .listing-mgmt-card { flex-direction: column !important; }
          .listing-mgmt-img { width: 100% !important; }
          .listing-mgmt-img img, .listing-mgmt-img > div { height: 160px !important; min-height: 160px !important; }
        }
        @media (min-width: 640px) {
          .desktop-actions { display: flex !important; }
          .mobile-menu { display: none !important; }
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        /* Mobile base — single column, full width */
        .sidebar-close { display: flex !important; }
        .charts-grid   { grid-template-columns: 1fr !important; }
        .enquiry-layout { grid-template-columns: 1fr !important; }
        .two-col       { grid-template-columns: 1fr !important; }
        .hide-on-mobile { display: none !important; }
        .back-btn-mobile { display: flex !important; }
        @media (min-width: 480px) {
          .two-col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 768px) {
          .hide-on-mobile { display: block !important; }
          .back-btn-mobile { display: none !important; }
          .main-container { padding: 24px 24px 48px !important; }
          .enquiry-layout { grid-template-columns: 300px 1fr !important; }
          .charts-grid    { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .sidebar-close { display: none !important; }
          .main-area { margin-left: 260px !important; }
          .menu-btn { display: none !important; }
          .main-container { padding: 28px 32px 64px !important; }
          .enquiry-layout { grid-template-columns: 340px 1fr !important; }
          .two-col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}