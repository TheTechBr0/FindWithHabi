"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Users, Heart, MessageCircle, Search, Settings, LogOut, Bell, Flag,
  MapPin, Bed, Bath, Maximize2, ArrowRight, ChevronRight,
  X, Menu, Phone, CheckCircle, Clock, Home, Building2,
  Trash2, Shield, Loader, BadgeCheck, RefreshCw, Send, Eye, Star,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const NAV = [
  { key: "overview",  label: "Overview",        icon: Home          },
  { key: "listings",  label: "Browse Listings", icon: Building2     },
  { key: "agents",    label: "Find Agents",     icon: Users         },
  { key: "saved",     label: "Saved Homes",     icon: Heart         },
  { key: "enquiries", label: "My Enquiries",    icon: MessageCircle },
  { key: "report",    label: "Report a Listing", icon: Flag          },
  { key: "support",   label: "Help & Support",  icon: Shield        },
  { key: "settings",  label: "Settings",        icon: Settings      },
]

const inputBase = {
  width: "100%", padding: "12px 14px", borderRadius: 12,
  border: "1.5px solid #e2e8f0", fontSize: 15, color: "#0d1f2d",
  fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
  background: "#f8fafc", boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
}

// ─── Skeleton Components ──────────────────────────────────────────────────────
function CardSkeleton() {
  const sh = { background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
  return (
    <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #f1f5f9" }}>
      <div style={{ ...sh, height: 175, borderRadius: 0 }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...sh, height: 14, width: "70%" }} />
        <div style={{ ...sh, height: 11, width: "45%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ ...sh, height: 18, width: "35%" }} />
          <div style={{ ...sh, height: 32, width: "30%", borderRadius: 10 }} />
        </div>
      </div>
    </div>
  )
}

function StatSkeleton() {
  const sh = { background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 8 }
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #f1f5f9" }}>
      <div style={{ ...sh, width: 44, height: 44, borderRadius: 14, marginBottom: 14 }} />
      <div style={{ ...sh, height: 28, width: "50%", marginBottom: 8 }} />
      <div style={{ ...sh, height: 13, width: "65%" }} />
    </div>
  )
}

function Sidebar({ active, onNav, open, onClose, user, savedCount, enquiryCount, unreadEnquiries, unreadNotifs }) {
  const router = useRouter()
  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/auth") }
  const badges = { saved: savedCount || 0, enquiries: unreadEnquiries || enquiryCount || 0 }

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 149, backdropFilter: "blur(2px)" }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 150, width: 260, background: "#080f14", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: open ? "8px 0 32px rgba(0,0,0,0.4)" : "none" }} className="sidebar">
        <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          </Link>
          <button onClick={onClose} className="sidebar-close" style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "20", border: "2.5px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T, flexShrink: 0 }}>
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.full_name || "User"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{user?.city || "Nigeria"}</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            const badge    = badges[key] || 0
            return (
              <button key={key} onClick={() => { onNav(key); onClose() }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", background: isActive ? T + "18" : "transparent", color: isActive ? T : "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: isActive ? 800 : 600, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.18s" }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {label}
                {badge > 0 && <span style={{ marginLeft: "auto", background: isActive ? T : "rgba(255,255,255,0.12)", color: isActive ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{badge}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444" }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>
    </>
  )
}

function NotificationBell({ userId, onOpen, onNavToEnquiries }) {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
  const unread = notifs.filter(n => !n.is_read).length
  const ICONS = { general:"🔔", warning:"⚠️", feature:"🚀", announcement:"📢", policy:"📋", personal:"💬" }

  const load = () => {
    if (!userId) return
    supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setNotifs(data || []))
  }

  useEffect(() => { load() }, [userId])
  useEffect(() => {
    if (!userId) return
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [userId])

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

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => { setOpen(p => !p); load() }}
        style={{ position: "relative", width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Bell size={17} color="#64748b" />
        {unread > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
          <div style={{ position: "fixed", top: 70, right: 8, left: 8, zIndex: 200, maxWidth: 380, marginLeft: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Notifications {unread > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 50, marginLeft: 4 }}>{unread}</span>}</span>
              {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 11, color: T, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>}
            </div>
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                  <Bell size={24} color="#e2e8f0" style={{ marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: 13 }}>No notifications yet</p>
                </div>
              ) : notifs.map(n => {
                const isEnquiry = n.title?.toLowerCase().includes("replied") || n.title?.toLowerCase().includes("enquir")
                return (
                  <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", background: n.is_read ? "#fff" : T + "06" }}>
                    <div style={{ display: "flex", gap: 10, cursor: "pointer" }} onClick={() => markRead(n.id)}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[n.type] || "🔔"}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d", marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{n.body || n.message || ""}</div>
                      </div>
                      {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T, flexShrink: 0, marginTop: 4 }} />}
                    </div>
                    {isEnquiry && onNavToEnquiries && (
                      <button onClick={() => { markRead(n.id); setOpen(false); onNavToEnquiries() }}
                        style={{ marginTop: 8, marginLeft: 28, display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: T, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        Open Chat →
                      </button>
                    )}
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

function Topbar({ title, onMenuOpen, userId, onRefresh, onNavToEnquiries, onNav }) {
  return (
    <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onMenuOpen} className="menu-btn" style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Menu size={18} color="#64748b" />
        </button>
        <h1 style={{ margin: 0, fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{title}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NotificationBell userId={userId} onOpen={onRefresh} onNavToEnquiries={onNavToEnquiries} />
        <button onClick={() => onNav("listings")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0d1f2d", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 }}>
          <Search size={14} color="#64748b" /> Browse
        </button>
      </div>
    </header>
  )
}

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

function PropertyMiniCard({ listing, onRemove }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 170, overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
        {listing.cover_image
          ? <img src={listing.cover_image} alt={listing.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Home size={32} color="#cbd5e1" /></div>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)" }} />
        {onRemove && (
          <button onClick={() => onRemove(listing.id)} style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={13} color="#ef4444" />
          </button>
        )}
        <span style={{ position: "absolute", bottom: 8, left: 10, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>{listing.listing_type || "Buy"}</span>
      </div>
      <div style={{ padding: "13px 15px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 5px", fontSize: 13, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <MapPin size={10} color={T} />
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{listing.city}, {listing.state}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: T }}>{listing.price_label}</span>
          <Link href={"/listings/" + listing.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 9, background: "#f1f5f9", color: "#0d1f2d", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            View <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function Overview({ user, savedListings, enquiries, notifications, onNav, loading, unreadEnquiries: unreadEnqProp }) {
  const unreadNotifs = notifications.filter(n => !n.is_read).length
  // Use the unreadEnquiries from parent (UserDashboard) which updates after chat is opened
  const unreadEnquiries = unreadEnqProp || 0

  if (loading) return <LoadingCard />

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg," + DARK + " 0%," + T_DARK + " 100%)", borderRadius: 24, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: T + "30", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: T, flexShrink: 0 }}>{user?.full_name?.charAt(0) || "U"}</div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Welcome back</p>
            <h2 style={{ margin: "0 0 4px", fontSize: "clamp(18px,3.5vw,26px)", fontWeight: 900, color: "#fff" }}>{user?.full_name || "User"} 👋</h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{user?.city || "Nigeria"}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Saved Homes",   value: savedListings.length, icon: Heart,         color: "#ef4444", onClick: () => onNav("saved")     },
          { label: "My Enquiries",  value: enquiries.length,     icon: MessageCircle, color: "#8b5cf6", onClick: () => onNav("enquiries") },
          { label: "Unread Replies", value: unreadEnquiries,     icon: CheckCircle,   color: "#10b981", onClick: () => onNav("enquiries") },
          { label: "Notifications", value: unreadNotifs,         icon: Bell,          color: T,         onClick: () => {}                 },
        ].map(({ label, value, icon: Icon, color, onClick }, i) => (
          <button key={i} onClick={onClick} style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)" }} onMouseLeave={e => { e.currentTarget.style.transform = "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#0d1f2d" }}>{value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, fontWeight: 600 }}>{label}</div>
          </button>
        ))}
      </div>

      {unreadEnquiries > 0 && (
        <div style={{ background: T + "10", border: "1.5px solid " + T + "30", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={16} color="#fff" /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{unreadEnquiries} unread {unreadEnquiries === 1 ? "reply" : "replies"}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>You have unread messages from agents</div>
            </div>
          </div>
          <button onClick={() => onNav("enquiries")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
            View <ChevronRight size={14} />
          </button>
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
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
            <button onClick={() => onNav("listings")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, background: T, color: "#fff", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {savedListings.slice(0, 4).map(l => (
              <div key={l.id} style={{ flexShrink: 0, width: "clamp(220px,60vw,260px)" }}>
                <PropertyMiniCard listing={l} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

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
            <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === t ? "#fff" : "transparent", color: filter === t ? "#0d1f2d" : "#64748b", transition: "all 0.2s" }}>{t}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Heart size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: "0 0 8px", color: "#0d1f2d" }}>No saved properties</h3>
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

function MyEnquiries({ enquiries, loading, onRefresh, userData, authUser }) {
  const [selected,    setSelected]    = useState(null)
  const [messages,    setMessages]    = useState([])
  const [reply,       setReply]       = useState("")
  const [sending,     setSending]     = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [activeId,    setActiveId]    = useState(null)
  const bottomRef  = useRef(null)
  const markedRef  = useRef(new Set())
  const prevCountRef = useRef(0)
  const currentEnquiry = selected ? enquiries.find(e => e.id === selected) : enquiries[0] || null

  const loadMessages = async (id, showLoader) => {
    if (showLoader) setLoadingMsgs(true)
    const { data } = await supabase.from("enquiry_messages").select("*").eq("enquiry_id", id).order("created_at", { ascending: true })
    const msgs = data || []
    if (showLoader) setLoadingMsgs(false)
    if (msgs.length !== prevCountRef.current) {
      prevCountRef.current = msgs.length
      setMessages(msgs)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80)
    }
  }

  useEffect(() => {
    const id = selected || enquiries[0]?.id
    if (!id || id === activeId) return
    setActiveId(id); prevCountRef.current = 0; loadMessages(id, true)
    if (!markedRef.current.has(id)) {
      markedRef.current.add(id)
      supabase.from("enquiry_messages").update({ is_read: true }).eq("enquiry_id", id).eq("sender", "agent").eq("is_read", false).then(() => {})
    }
  }, [selected, enquiries])

  useEffect(() => {
    const id = activeId
    if (!id) return
    const interval = setInterval(() => loadMessages(id, false), 4000)
    return () => clearInterval(interval)
  }, [activeId])

  const sendReply = async () => {
    if (!reply.trim() || !currentEnquiry) return
    setSending(true)
    await supabase.from("enquiry_messages").insert({ enquiry_id: currentEnquiry.id, sender: "user", message: reply.trim() })
    if (currentEnquiry.agent_id) {
      const { data: agentData } = await supabase.from("agents").select("user_id").eq("id", currentEnquiry.agent_id).single()
      if (agentData?.user_id) {
        const senderName = userData?.full_name || authUser?.email || "A buyer"
        await supabase.from("notifications").insert({ user_id: agentData.user_id, type: "personal", title: senderName + " sent you a message", body: reply.trim().slice(0, 100) + (reply.trim().length > 100 ? "…" : ""), link: currentEnquiry.id })
      }
    }
    setReply(""); setSending(false)
    await loadMessages(currentEnquiry.id)
  }

  const statusMap = { new: { bg: "#f59e0b12", color: "#d97706", label: "Pending" }, replied: { bg: "#10b98112", color: "#059669", label: "Replied" }, closed: { bg: "#94a3b812", color: "#94a3b8", label: "Closed" } }

  if (loading) return <LoadingCard />
  if (enquiries.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <MessageCircle size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
      <h3 style={{ margin: "0 0 8px", color: "#0d1f2d", fontSize: 18, fontWeight: 800 }}>No enquiries yet</h3>
      <p style={{ color: "#94a3b8", margin: 0 }}>Find a property and contact an agent to get started</p>
    </div>
  )

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>My Enquiries ({enquiries.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="enquiry-layout">
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden" }} className={selected ? "hide-on-mobile" : ""}>
          {enquiries.map(e => {
            const sc = statusMap[e.status] || statusMap.new
            const isActive = (selected || enquiries[0]?.id) === e.id
            return (
              <button key={e.id} onClick={() => setSelected(e.id)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", border: "none", width: "100%", textAlign: "left", cursor: "pointer", background: isActive ? T + "08" : "#fff", borderBottom: "1px solid #f8fafc", borderLeft: isActive ? "3px solid " + T : "3px solid transparent" }}>
                <div style={{ width: 52, height: 44, borderRadius: 10, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                  {e.listings?.cover_image && <img src={e.listings.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.listings?.title || "Property"}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleDateString()}</span>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 800 }}>{sc.label}</span>
                </div>
              </button>
            )
          })}
        </div>
        {currentEnquiry && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 480 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <button onClick={() => setSelected(null)} className="back-btn-mobile"
                  style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{currentEnquiry.listings?.title || "Property"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{currentEnquiry.listings?.city}, {currentEnquiry.listings?.state}</div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
              {loadingMsgs ? <div style={{ display: "flex", justifyContent: "center" }}><Loader size={20} color={T} style={{ animation: "spin 1s linear infinite" }} /></div>
               : messages.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: T, borderRadius: "16px 16px 4px 16px", padding: "12px 16px", maxWidth: "80%" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#fff" }}>{currentEnquiry.message}</p>
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
                  placeholder="Type a message… (Enter to send)" rows={2}
                  style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc" }} />
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

function NotificationsTab({ notifications, loading, onRefresh }) {
  const markAllRead = async () => {
    const ids = notifications.filter(n => !n.is_read).map(n => n.id)
    if (!ids.length) return
    await supabase.from("notifications").update({ is_read: true }).in("id", ids)
    onRefresh()
  }
  const markRead = async (id) => { await supabase.from("notifications").update({ is_read: true }).eq("id", id); onRefresh() }
  const ICONS = { general:"🔔", warning:"⚠️", feature:"🚀", announcement:"📢", policy:"📋", personal:"💬" }
  if (loading) return <LoadingCard />
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Notifications ({notifications.length})</h2>
        {notifications.some(n => !n.is_read) && (
          <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, border: "1.5px solid " + T + "40", background: T + "10", color: T, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <CheckCircle size={13} /> Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Bell size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: 0, color: "#0d1f2d" }}>No notifications yet</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifications.map((n, i) => (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)}
              style={{ background: n.is_read ? "#fff" : T + "06", borderRadius: 14, padding: "16px 18px", border: "1px solid " + (n.is_read ? "#f1f5f9" : T + "20"), display: "flex", alignItems: "flex-start", gap: 14, cursor: n.is_read ? "default" : "pointer", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ICONS[n.type] || "🔔"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{n.body || n.message || ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BrowseAgents() {
  const [agents,  setAgents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState("")

  useEffect(() => {
    supabase.from("agents").select("*, users(full_name, avatar_url, phone, city, state)")
      .order("is_verified", { ascending: false }).order("rating", { ascending: false }).limit(30)
      .then(({ data }) => { setAgents(data || []); setLoading(false) })
  }, [])

  const filtered = agents.filter(a =>
    !search ||
    (a.users?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.users?.city  || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.users?.state || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Find Agents</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Connect with verified property agents across Nigeria.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 48, marginBottom: 20 }}>
        <Search size={15} color="#94a3b8" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city or state…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={14} color="#94a3b8" /></button>}
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}><Loader size={28} color={T} style={{ animation: "spin 1s linear infinite" }} /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <Users size={40} color="#e2e8f0" style={{ marginBottom: 12 }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No agents found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
          {filtered.map((a, i) => {
            const name = a.users?.full_name || "Agent"
            const loc  = [a.users?.city, a.users?.state].filter(Boolean).join(", ") || "Nigeria"
            return (
              <div key={a.id} style={{ background: "#fff", borderRadius: 20, padding: "20px", border: "1px solid " + (a.is_verified ? T + "20" : "#f1f5f9"), animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
                {a.is_verified && <div style={{ height: 3, background: "linear-gradient(90deg," + T + ",#8b5cf6)", borderRadius: "3px 3px 0 0", margin: "-20px -20px 16px" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  {a.users?.avatar_url
                    ? <img src={a.users.avatar_url} alt={name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T }} />
                    : <div style={{ width: 52, height: 52, borderRadius: "50%", background: T + "20", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T, flexShrink: 0 }}>{name.charAt(0)}</div>}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>{name}</span>
                      {a.is_verified && <BadgeCheck size={14} color="#10b981" />}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>{loc}</div>
                    {a.rating > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Star size={10} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#0d1f2d" }}>{a.rating}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>({a.total_reviews || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={"/agents/" + a.id}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
                    View Profile
                  </a>
                  {a.users?.phone && (
                    <a href={"tel:" + a.users.phone} style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                      <Phone size={15} color="#64748b" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Listing Card (used in BrowseListings) ───────────────────────────────────
function ListingCard({ l, isSaved, onSave }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid " + (l.is_featured ? "#f59e0b40" : "#f1f5f9"), boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <div style={{ position: "relative", height: 175, background: "#f1f5f9", overflow: "hidden" }}>
        {l.cover_image
          ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={36} color="#cbd5e1" /></div>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 55%)" }} />
        {l.is_featured && <span style={{ position: "absolute", top: 10, left: 10, background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 50 }}>✦ Featured</span>}
        <button onClick={() => onSave(l.id)} style={{ position: "absolute", top: 8, right: 8, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={14} color={isSaved ? "#ef4444" : "#94a3b8"} fill={isSaved ? "#ef4444" : "none"} />
        </button>
        <span style={{ position: "absolute", bottom: 8, left: 10, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>{l.listing_type || "Buy"}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
          <MapPin size={11} color={T} />
          <span style={{ fontSize: 12, color: "#64748b" }}>{l.city}, {l.state}</span>
        </div>
        {l.beds > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bed size={10} color="#94a3b8" />{l.beds}bd</span>
            {l.baths > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bath size={10} color="#94a3b8" />{l.baths}ba</span>}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: T }}>{l.price_label}</span>
          <Link href={"/listings/" + l.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", borderRadius: 10, background: T, color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            View <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function BrowseListings({ onSave }) {
  const [listings,  setListings]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState("All")
  const [search,    setSearch]    = useState("")
  const [savedIds,  setSavedIds]  = useState([])
  const [authUser,  setAuthUser]  = useState(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user || null
      setAuthUser(user)

      // Serve from cache for instant display
      const CACHE_KEY = "fwh_browse_v1"
      const CACHE_TTL = 2 * 60 * 1000 // 2 minutes
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data: c, ts } = JSON.parse(cached)
          if (Date.now() - ts < CACHE_TTL) {
            setListings(c)
            setLoading(false)
            // Still load saved state for this user
            if (user) {
              const { data: savedData } = await supabase.from("saved_listings").select("listing_id").eq("user_id", user.id)
              if (savedData) setSavedIds(savedData.map(s => s.listing_id))
            }
            return
          }
        }
      } catch(e) {}

      // Fetch listings - get more so we can split into featured/popular/all
      const { data: listingsData } = await supabase.from("listings")
        .select("*, agents(rating)")
        .eq("status", "active").eq("is_flagged", false)
        .order("created_at", { ascending: false }).limit(80)

      if (listingsData?.length > 0) {
        const ids = listingsData.map(l => l.id)
        const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        const formatted = listingsData.map(l => {
          const imgs = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
          return { ...l, cover_image: imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null }
        })
        setListings(formatted)
        // Cache for instant repeat navigation
        try { sessionStorage.setItem("fwh_browse_v1", JSON.stringify({ data: formatted, ts: Date.now() })) } catch(e) {}
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

  const featuredListings = listings.filter(l => l.is_featured)
  const popularListings  = listings
    .map(l => ({ ...l, _score: (l.views || 0) * 0.6 + ((l.agents?.rating || 0) * 20) * 0.4 }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 8)
  const showCurated = !search && filter === "All"

  if (loading) return (
    <div>
      <div style={{ height: 48, background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 12, marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto" }}>
        {[...Array(5)].map((_,i) => <div key={i} style={{ flexShrink: 0, width: 70, height: 34, borderRadius: 9, background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 16 }}>
        {[...Array(6)].map((_,i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )

  return (
    <div>
      {/* Header + search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Browse Listings <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>({filtered.length})</span></h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 48, marginBottom: 14 }}>
        <Search size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, city…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={14} color="#94a3b8" /></button>}
      </div>
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 24, overflowX: "auto" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === t ? "#fff" : "transparent", color: filter === t ? "#0d1f2d" : "#64748b", transition: "all 0.2s", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      {/* Featured section */}
      {showCurated && featuredListings.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#f59e0b20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star size={13} color="#f59e0b" fill="#f59e0b" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Hand-picked</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#0d1f2d", marginLeft: 4 }}>Featured Properties</h3>
          </div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {featuredListings.map((l, i) => {
              const isSaved = savedIds.includes(l.id)
              return (
                <div key={l.id} style={{ flexShrink: 0, width: "clamp(220px,60vw,260px)" }}>
                  <ListingCard l={l} isSaved={isSaved} onSave={toggleSave} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Popular section */}
      {showCurated && popularListings.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#ef444420", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13 }}>🔥</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#ef4444", letterSpacing: "0.08em", textTransform: "uppercase" }}>Trending</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#0d1f2d", marginLeft: 4 }}>Most Popular</h3>
          </div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {popularListings.map((l, i) => {
              const isSaved = savedIds.includes(l.id)
              return (
                <div key={l.id} style={{ flexShrink: 0, width: "clamp(220px,60vw,260px)" }}>
                  <ListingCard l={l} isSaved={isSaved} onSave={toggleSave} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Divider when curated sections shown */}
      {showCurated && (featuredListings.length > 0 || popularListings.length > 0) && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", whiteSpace: "nowrap", letterSpacing: "0.06em", textTransform: "uppercase" }}>All Properties</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>
      )}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Building2 size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", margin: 0 }}>No listings found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
          {filtered.map((l, i) => (
            <div key={l.id} style={{ animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
              <ListingCard l={l} isSaved={savedIds.includes(l.id)} onSave={toggleSave} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab({ user }) {
  const [selectedListing, setSelectedListing] = useState(null)
  const [listingSearch,   setListingSearch]   = useState("")
  const [listings,        setListings]        = useState([])
  const [showDropdown,    setShowDropdown]    = useState(false)
  const [reason,          setReason]          = useState("")
  const [details,    setDetails]    = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent,       setSent]       = useState(false)
  const [error,      setError]      = useState("")
  const [myReports,  setMyReports]  = useState([])

  const REASONS = [
    "Fake or fraudulent listing",
    "Wrong price or misleading info",
    "Property doesn't exist",
    "Scam / suspicious agent",
    "Duplicate listing",
    "Inappropriate content",
    "Other",
  ]

  useEffect(() => {
    if (!user?.id) return
    supabase.from("reports").select("*").eq("reporter_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setMyReports(data || []))
  }, [user, sent])

  // Fetch listings for the dropdown
  useEffect(() => {
    supabase.from("listings").select("id, title, city, state, listing_type")
      .eq("status", "active").eq("is_flagged", false)
      .order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setListings(data || []))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!reason) { setError("Please select a reason."); return }
    setError(""); setSubmitting(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()

    const listingInfo = selectedListing
      ? selectedListing.title + " (" + selectedListing.city + ", " + selectedListing.state + ")"
      : "Not specified"

    const description = [
      "Listing: " + listingInfo,
      details.trim() || "No extra details provided",
    ].join(" | ")

    // Insert report
    const { error: reportError } = await supabase.from("reports").insert({
      reporter_id: authUser.id,
      type:        "listing",
      subject:     reason,
      description,
      listing_id:  selectedListing?.id || null,
      status:      "new",
    })
    if (reportError) {
      setError("Failed to submit report. Please try again.")
      setSubmitting(false)
      return
    }

    // Notify admin
    const { data: adminUser } = await supabase
      .from("users").select("id").eq("role", "admin").single()
    if (adminUser?.id) {
      const reporterName = user?.full_name || authUser.email || "A user"
      await supabase.from("notifications").insert({
        user_id: adminUser.id,
        type:    "warning",
        title:   "🚩 New Listing Report",
        body:    reporterName + " reported [" + reason + "] on: " + listingInfo,
      })
    }

    setSubmitting(false); setSent(true)
    setSelectedListing(null); setListingSearch(""); setReason(""); setDetails("")
    setTimeout(() => setSent(false), 4000)
  }

  const statusConfig = {
    new:       { bg: "#ef444412", color: "#ef4444", label: "Submitted"  },
    in_review: { bg: "#f59e0b12", color: "#d97706", label: "In Review"  },
    resolved:  { bg: "#10b98112", color: "#059669", label: "Resolved"   },
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#7f1d1d 0%,#991b1b 100%)", borderRadius: 20, padding: "22px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Flag size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ margin: "0 0 3px", fontSize: 18, fontWeight: 900, color: "#fff" }}>Report a Listing</h2>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>See something suspicious? Let us know and we will investigate.</p>
        </div>
      </div>

      {/* Tip */}
      <div style={{ background: "#f8fafc", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10, border: "1px solid #f1f5f9" }}>
        <Flag size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
          You can also report directly from a listing page - scroll down and tap <strong>"Report this listing"</strong> below the property details.
        </p>
      </div>

      {/* Form */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Listing selector */}
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Select Listing (optional)
            </label>
            {selectedListing ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #ef4444", background: "#ef444408" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedListing.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{selectedListing.city}, {selectedListing.state} · {selectedListing.listing_type}</div>
                </div>
                <button type="button" onClick={() => { setSelectedListing(null); setListingSearch("") }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                  onFocus={() => setShowDropdown(true)}>
                  <Search size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    value={listingSearch}
                    onChange={e => { setListingSearch(e.target.value); setShowDropdown(true) }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search for a listing by name or city…"
                    style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent", padding: "12px 0" }}
                  />
                  {listingSearch && <button type="button" onClick={() => { setListingSearch(""); setShowDropdown(false) }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={13} color="#94a3b8" /></button>}
                </div>
                {showDropdown && (
                  <>
                    <div onClick={() => setShowDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 9 }} />
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 10, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxHeight: 220, overflowY: "auto" }}>
                      {listings
                        .filter(l => !listingSearch || l.title?.toLowerCase().includes(listingSearch.toLowerCase()) || l.city?.toLowerCase().includes(listingSearch.toLowerCase()))
                        .slice(0, 20)
                        .map(l => (
                          <button key={l.id} type="button"
                            onClick={() => { setSelectedListing(l); setListingSearch(""); setShowDropdown(false) }}
                            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 14px", border: "none", background: "#fff", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #f8fafc" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#fff" }}>
                            <Building2 size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>{l.city}, {l.state} · {l.listing_type}</div>
                            </div>
                          </button>
                        ))}
                      {listings.filter(l => !listingSearch || l.title?.toLowerCase().includes(listingSearch.toLowerCase()) || l.city?.toLowerCase().includes(listingSearch.toLowerCase())).length === 0 && (
                        <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No listings found</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Reason *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {REASONS.map(r => (
                <button key={r} type="button" onClick={() => setReason(r)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 11, border: "1.5px solid " + (reason === r ? "#ef4444" : "#e2e8f0"), background: reason === r ? "#ef444408" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ width: 17, height: 17, borderRadius: "50%", border: "2px solid " + (reason === r ? "#ef4444" : "#cbd5e1"), background: reason === r ? "#ef4444" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {reason === r && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: reason === r ? 700 : 500, color: reason === r ? "#991b1b" : "#374151" }}>{r}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Additional Details (optional)</label>
            <textarea value={details} onChange={e => setDetails(e.target.value)} rows={4}
              placeholder="Describe what you noticed in more detail…"
              style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
              onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
          </div>

          {error && <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>{error}</p>}

          <button type="submit" disabled={submitting || !reason}
            style={{ padding: "13px", borderRadius: 14, background: sent ? "#10b981" : submitting || !reason ? "#94a3b8" : "#ef4444", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting || !reason ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, transition: "background 0.3s" }}>
            {submitting ? <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
             : sent      ? <><CheckCircle size={16} /> Report Submitted!</>
             :              <><Flag size={15} /> Submit Report</>}
          </button>
        </form>
      </div>

      {/* My previous reports */}
      {myReports.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>My Previous Reports</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myReports.map((r, i) => {
              const sc = statusConfig[r.status] || statusConfig.new
              return (
                <div key={r.id} style={{ padding: "14px 16px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{r.subject}</span>
                    <span style={{ padding: "2px 9px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{sc.label}</span>
                  </div>
                  {r.description && <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b" }}>{r.description.slice(0, 120)}</p>}
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  {r.admin_note && (
                    <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: "#10b98108", borderLeft: "3px solid #10b981" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 2 }}>Admin Note</div>
                      <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>{r.admin_note}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function SupportTab({ user, role }) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [myTickets, setMyTickets] = useState([])

  useEffect(() => {
    if (!user?.id) return
    supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setMyTickets(data || []))
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

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", background: "#f8fafc", boxSizing: "border-box" }
  const statusConfig = { open: { bg: "#ef444412", color: "#ef4444", label: "Open" }, in_review: { bg: "#f59e0b12", color: "#d97706", label: "In Review" }, resolved: { bg: "#10b98112", color: "#059669", label: "Resolved" } }

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>New Support Request</h3>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Describe your issue…"
            style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
            onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} />
          {error && <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>{error}</p>}
          <button type="submit" disabled={submitting}
            style={{ padding: "13px", borderRadius: 14, background: sent ? "#10b981" : submitting ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50 }}>
            {submitting ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
             : sent      ? <><CheckCircle size={17} /> Sent!</>
             :              <><Send size={17} /> Send to Support</>}
          </button>
        </form>
      </div>
      {myTickets.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>My Previous Tickets</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myTickets.map(t => {
              const sc = statusConfig[t.status] || statusConfig.open
              return (
                <div key={t.id} style={{ padding: "14px 16px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d" }}>{t.subject}</span>
                    <span style={{ padding: "2px 9px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 800 }}>{sc.label}</span>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#64748b" }}>{t.message}</p>
                  {t.admin_reply && (
                    <div style={{ padding: "10px 12px", borderRadius: 10, background: T + "08", borderLeft: "3px solid " + T, marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T, marginBottom: 3 }}>Support Reply</div>
                      <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{t.admin_reply}</p>
                    </div>
                  )}
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

function UserSettings({ user, onUpdate }) {
  const [name,   setName]   = useState(user?.full_name || "")
  const [phone,  setPhone]  = useState(user?.phone || "")
  const [city,   setCity]   = useState(user?.city || "")
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("users").update({ full_name: name, phone, city }).eq("id", authUser.id)
    setSaving(false); setSaved(true); onUpdate()
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9" }}>
        <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>My Profile</h3>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Full Name",    value: name,  set: setName,  type: "text", placeholder: "Your full name"    },
            { label: "Phone Number", value: phone, set: setPhone, type: "tel",  placeholder: "+234 800 000 0000" },
            { label: "City",         value: city,  set: setCity,  type: "text", placeholder: "Lagos"             },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
              <input value={value} onChange={e => set(e.target.value)} type={type} placeholder={placeholder}
                style={{ ...inputBase }} onFocus={e => { e.target.style.borderColor = T }} onBlur={e => { e.target.style.borderColor = "#e2e8f0" }} />
            </div>
          ))}
          <button type="submit" disabled={saving}
            style={{ padding: "13px", borderRadius: 14, background: saved ? "#10b981" : saving ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50 }}>
            {saving ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : saved ? <><CheckCircle size={17} /> Saved!</> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const router = useRouter()
  const [tab,           setTab]           = useState("overview")
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [user,          setUser]          = useState(null)
  const [authUser,      setAuthUser]      = useState(null)
  const [savedListings, setSavedListings] = useState([])
  const [enquiries,     setEnquiries]     = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)

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
    setAuthUser(authUser)
    const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
    setUser(userData)

    const { data: savedData } = await supabase.from("saved_listings").select("listing_id").eq("user_id", authUser.id)
    if (savedData?.length > 0) {
      const ids = savedData.map(s => s.listing_id)
      const { data: listingsData } = await supabase.from("listings").select("*").in("id", ids).eq("status", "active")
      if (listingsData?.length > 0) {
        const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        setSavedListings(listingsData.map(l => {
          const imgs = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
          return { ...l, cover_image: imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null }
        }))
      } else setSavedListings([])
    } else setSavedListings([])

    const { data: enquiriesData } = await supabase.from("enquiries")
      .select("*, listings(id, title, city, state, price_label), agents(id, users(full_name, phone))")
      .eq("user_id", authUser.id).order("created_at", { ascending: false })
    if (enquiriesData?.length > 0) {
      const listingIds = [...new Set(enquiriesData.map(e => e.listing_id).filter(Boolean))]
      const { data: eImages } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", listingIds)
      setEnquiries(enquiriesData.map(e => {
        const imgs = eImages ? eImages.filter(i => i.listing_id === e.listing_id) : []
        return { ...e, listings: { ...e.listings, cover_image: imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null } }
      }))
    } else setEnquiries([])

    const { data: notifData } = await supabase.from("notifications").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false })
    setNotifications(notifData || [])
    setLoading(false)
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
    // Also call fetchData directly in case session already loaded
    fetchData()
    const fn = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener("resize", fn)
    return () => {
      subscription?.unsubscribe()
      window.removeEventListener("resize", fn)
    }
  }, [])

  const unreadNotifs = notifications.filter(n => !n.is_read).length

  const [unreadEnquiries, setUnreadEnquiries] = useState(0)
  useEffect(() => {
    if (!user?.id) return
    supabase.from("enquiry_messages").select("enquiry_id").eq("sender", "agent").eq("is_read", false)
      .then(async ({ data: unreadMsgs }) => {
        if (!unreadMsgs?.length) { setUnreadEnquiries(0); return }
        const enquiryIds = [...new Set(unreadMsgs.map(m => m.enquiry_id))]
        const { data: userEnquiries } = await supabase.from("enquiries").select("id").eq("user_id", user.id).in("id", enquiryIds)
        setUnreadEnquiries(userEnquiries?.length || 0)
      })
  }, [user, enquiries])

  // Re-check unread count when user returns to overview tab
  useEffect(() => {
    if (tab !== "overview" || !user?.id) return
    supabase.from("enquiry_messages").select("enquiry_id").eq("sender", "agent").eq("is_read", false)
      .then(async ({ data: unreadMsgs }) => {
        if (!unreadMsgs?.length) { setUnreadEnquiries(0); return }
        const enquiryIds = [...new Set(unreadMsgs.map(m => m.enquiry_id))]
        const { data: userEnquiries } = await supabase.from("enquiries").select("id").eq("user_id", user.id).in("id", enquiryIds)
        setUnreadEnquiries(userEnquiries?.length || 0)
      })
  }, [tab])

  const titles = {
    overview:  "Overview",
    listings:  "Browse Listings",
    agents:    "Find Agents",
    saved:     "Saved Homes",
    enquiries: "My Enquiries",
    report:    "Report a Listing",
    support:   "Help & Support",
    settings:  "Settings",
  }

  const renderTab = () => {
    if (tab === "overview")      return <Overview user={user} savedListings={savedListings} enquiries={enquiries} notifications={notifications} onNav={setTab} loading={loading} unreadEnquiries={unreadEnquiries} />
    if (tab === "listings")      return <BrowseListings onSave={fetchData} />
    if (tab === "agents")        return <BrowseAgents />
    if (tab === "saved")         return <SavedHomes savedListings={savedListings} loading={loading} onRefresh={fetchData} />
    if (tab === "enquiries")     return <MyEnquiries enquiries={enquiries} loading={loading} onRefresh={fetchData} userData={user} authUser={authUser} />
    if (tab === "notifications") return <NotificationsTab notifications={notifications} loading={loading} onRefresh={fetchData} />
    if (tab === "settings")      return <UserSettings user={user} onUpdate={fetchData} />
    if (tab === "report")        return <ReportTab user={user} />
    if (tab === "support")       return <SupportTab user={user} role="user" />
    return null
  }

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex" }}>
      <Sidebar active={tab} onNav={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        user={user} savedCount={savedListings.length} enquiryCount={enquiries.length} unreadEnquiries={unreadEnquiries} unreadNotifs={unreadNotifs} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="main-area">
        <Topbar title={titles[tab] || "Dashboard"} onMenuOpen={() => setSidebarOpen(true)} userId={user?.id} onRefresh={fetchData} onNavToEnquiries={() => setTab("enquiries")} onNav={setTab} />
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
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sidebar-close { display: flex !important; }
        /* Mobile base */
        .enquiry-layout { grid-template-columns: 1fr !important; }
        .hide-on-mobile { display: none !important; }
        .back-btn-mobile { display: flex !important; }
        .overview-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        @media (min-width: 768px) {
          .hide-on-mobile { display: block !important; }
          .back-btn-mobile { display: none !important; }
          .main-container { padding: 24px 24px 48px !important; }
          .enquiry-layout { grid-template-columns: 260px 1fr !important; }
          .overview-grid  { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .sidebar-close { display: none !important; }
          .main-area { margin-left: 260px !important; }
          .menu-btn  { display: none !important; }
          .main-container { padding: 28px 32px 64px !important; }
          .enquiry-layout { grid-template-columns: 300px 1fr !important; }
          .overview-grid  { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}