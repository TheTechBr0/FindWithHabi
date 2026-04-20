"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Users, Building2, MessageCircle, BadgeCheck, LogOut,
  Bell, X, Menu, Activity, CheckCircle, Trash2, Headphones,
  Eye, Search, ChevronRight, Loader, Shield,
  Clock, RefreshCw, MapPin, Phone, Send,
  ArrowLeft, AlertCircle, Flag, Sparkles,
  AlertTriangle, Megaphone, Zap, FileText,
  Star, Ban, UserCheck, UserX, MoreHorizontal,
  ClipboardList,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const NAV = [
  { key: "overview",      label: "Overview",      icon: Activity     },
  { key: "listings",      label: "Listings",       icon: Building2    },
  { key: "verifications", label: "Verifications",  icon: BadgeCheck   },
  { key: "agents",        label: "Agents",          icon: Shield       },
  { key: "users",         label: "Users",           icon: Users        },
  { key: "enquiries",     label: "Enquiries",       icon: MessageCircle},
  { key: "reports",       label: "Reports",         icon: ClipboardList},
  { key: "notifications", label: "Notifications",   icon: Bell         },
  { key: "support",       label: "Support Tickets", icon: Headphones   },
]

const NOTIF_TYPES = [
  { value: "general",      label: "General",       icon: "🔔", color: T        },
  { value: "warning",      label: "Warning",       icon: "⚠️", color: "#ef4444"},
  { value: "feature",      label: "New Feature",   icon: "🚀", color: "#8b5cf6"},
  { value: "announcement", label: "Announcement",  icon: "📢", color: "#f59e0b"},
  { value: "policy",       label: "Policy Update", icon: "📋", color: "#64748b"},
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose, adminUser, badges }) {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 149, backdropFilter: "blur(2px)" }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 150, width: 260, background: DARK, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" }} className="sidebar">
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          </Link>
          <button onClick={onClose} className="sidebar-close"
            style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ef444420", border: "2px solid #ef444440", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#ef4444", flexShrink: 0 }}>
              {adminUser?.full_name?.charAt(0) || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminUser?.full_name || "Admin"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Super Admin</div>
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 50, background: "#ef444420", border: "1px solid #ef444440" }}>
            <Shield size={11} color="#ef4444" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444" }}>Admin Access</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            const badge    = badges[key] || 0
            return (
              <button key={key} onClick={() => { onNav(key); onClose() }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", background: isActive ? T + "18" : "transparent", color: isActive ? T : "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: isActive ? 800 : 600, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.18s", borderLeft: isActive ? "3px solid " + T : "3px solid transparent" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {label}
                {badge > 0 && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 50 }}>{badge}</span>}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444" }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>
    </>
  )
}


// ─── Admin Notification Bell ──────────────────────────────────────────────────
function AdminNotificationBell({ adminUserId }) {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
  const unread = notifs.filter(n => !n.is_read).length
  const ICONS = { general:"🔔", warning:"⚠️", feature:"🚀", announcement:"📢", policy:"📋", personal:"💬" }

  const load = () => {
    if (!adminUserId) return
    supabase.from("notifications").select("*").eq("user_id", adminUserId)
      .order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => setNotifs(data || []))
  }
  useEffect(() => { load() }, [adminUserId])
  useEffect(() => {
    if (!adminUserId) return
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [adminUserId])

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
          <div style={{ position: "fixed", top: 70, right: 8, left: 8, zIndex: 9999, maxWidth: 400, marginLeft: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>
                Notifications
                {unread > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 50, marginLeft: 6 }}>{unread}</span>}
              </span>
              {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 11, color: T, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>}
            </div>
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                  <Bell size={28} color="#e2e8f0" style={{ marginBottom: 8 }} />
                  <p style={{ margin: 0, fontSize: 13 }}>No notifications yet</p>
                </div>
              ) : notifs.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", background: n.is_read ? "#fff" : T + "06", cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[n.type] || "🔔"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d", marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.body || n.message || ""}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString()}</div>
                    </div>
                    {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T, flexShrink: 0, marginTop: 4 }} />}
                  </div>
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
function Topbar({ title, onMenuOpen, onRefresh, adminUserId }) {
  return (
    <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onMenuOpen} className="menu-btn" style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Menu size={18} color="#64748b" />
        </button>
        <h1 style={{ margin: 0, fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{title}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AdminNotificationBell adminUserId={adminUserId} />
        <button onClick={onRefresh} style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Refresh">
          <RefreshCw size={16} color="#64748b" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, background: "#ef444410", border: "1px solid #ef444430" }}>
          <Shield size={14} color="#ef4444" />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#ef4444" }}>Admin Panel</span>
        </div>
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

function StatCard({ label, value, icon: Icon, color, sub, delay, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", animation: "fadeUp 0.5s ease " + (delay || 0) + "ms both", cursor: onClick ? "pointer" : "default", transition: "all 0.2s" }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)" } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none" } }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", border: "1px solid " + color + "25", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} color={color} />
        </div>
        {sub && <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "right", maxWidth: 70, lineHeight: 1.3 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ stats, onNav }) {
  return (
    <div>
      <div style={{ marginBottom: 24, animation: "fadeUp 0.5s ease both" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Platform Overview</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>Real-time snapshot of FindWithHabi.</p>
      </div>

      {/* Urgent alerts banner */}
      {(stats.newReports > 0 || stats.openTickets > 0 || stats.pendingVerifs > 0) && (
        <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.4s ease both" }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#9a3412", marginBottom: 3 }}>Attention Required</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {stats.newReports > 0 && (
                <button onClick={() => onNav("reports")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 50, background: "#ef444415", border: "1px solid #ef444440", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  🚩 {stats.newReports} new {stats.newReports === 1 ? "report" : "reports"}
                </button>
              )}
              {stats.openTickets > 0 && (
                <button onClick={() => onNav("support")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 50, background: "#8b5cf615", border: "1px solid #8b5cf640", color: "#8b5cf6", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  🎧 {stats.openTickets} open {stats.openTickets === 1 ? "ticket" : "tickets"}
                </button>
              )}
              {stats.pendingVerifs > 0 && (
                <button onClick={() => onNav("verifications")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 50, background: "#f59e0b15", border: "1px solid #f59e0b40", color: "#d97706", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  ✅ {stats.pendingVerifs} pending {stats.pendingVerifs === 1 ? "verification" : "verifications"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Users"     value={stats.totalUsers}      icon={Users}         color={T}        sub="registered"                          delay={0}   onClick={() => onNav("users")} />
        <StatCard label="Total Agents"    value={stats.totalAgents}     icon={Shield}        color="#8b5cf6"  sub={stats.verifiedAgents + " verified"}   delay={60}  onClick={() => onNav("agents")} />
        <StatCard label="Active Listings" value={stats.activeListings}  icon={Building2}     color="#f59e0b"  sub={stats.flaggedListings + " flagged"}   delay={120} onClick={() => onNav("listings")} />
        <StatCard label="Total Enquiries" value={stats.totalEnquiries}  icon={MessageCircle} color="#10b981"  sub="all time"                             delay={180} onClick={() => onNav("enquiries")} />
        <StatCard label="Verif. Pending"  value={stats.pendingVerifs}   icon={BadgeCheck}    color="#f59e0b"  sub="awaiting review"                      delay={240} onClick={() => onNav("verifications")} />
        <StatCard label="New Reports"     value={stats.newReports}      icon={ClipboardList}
          color={stats.newReports > 0 ? "#ef4444" : "#94a3b8"}
          sub={stats.newReports > 0 ? "⚠️ needs attention" : "no new reports"}
          delay={300} onClick={() => onNav("reports")} />
        <StatCard label="Open Tickets"    value={stats.openTickets || 0} icon={Headphones}   color="#8b5cf6"  sub="support requests"                     delay={360} onClick={() => onNav("support")} />
      </div>

      {/* Clarify difference between Reports and Support Tickets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 12, marginBottom: 20, animation: "fadeUp 0.5s ease 320ms both" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1.5px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#ef444412", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardList size={16} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Reports</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Abuse & violation reports</div>
            </div>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            When a <strong>user reports a listing or agent</strong> for fraud, scam, fake listing, or bad behaviour. You review and take action (flag, remove, warn).
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => onNav("reports")} style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
              View Reports <ChevronRight size={12} />
            </button>
            {stats.newReports > 0 && (
              <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 9px", borderRadius: 50 }}>
                {stats.newReports} NEW
              </span>
            )}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1.5px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#8b5cf612", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Headphones size={16} color="#8b5cf6" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Support Tickets</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Help requests from users & agents</div>
            </div>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            When a <strong>user or agent needs help</strong> — account issues, payment problems, technical errors. You reply directly and mark as resolved.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => onNav("support")} style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
              View Tickets <ChevronRight size={12} />
            </button>
            {(stats.openTickets || 0) > 0 && (
              <span style={{ background: "#8b5cf6", color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 9px", borderRadius: 50 }}>
                {stats.openTickets} OPEN
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="action-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 12, animation: "fadeUp 0.5s ease 400ms both" }}>
        {[
          { icon: BadgeCheck,   color: "#10b981", bg: "#10b98108", title: "Verify Agents",    desc: stats.pendingVerifs + " pending",          action: () => onNav("verifications"), cta: "Review" },
          { icon: Flag,         color: "#ef4444", bg: "#ef444408", title: "Flagged Listings",  desc: stats.flaggedListings + " flagged",         action: () => onNav("listings"),      cta: "Review" },
          { icon: ClipboardList,color: stats.newReports > 0 ? "#ef4444" : "#64748b", bg: stats.newReports > 0 ? "#ef444408" : "#f8fafc", title: "User Reports", desc: stats.newReports > 0 ? stats.newReports + " new — needs review" : "No new reports", action: () => onNav("reports"), cta: "View" },
          { icon: Bell,         color: T,         bg: T + "08",    title: "Send Notification", desc: "Broadcast to all users",                   action: () => onNav("notifications"), cta: "Compose"},
        ].map(({ icon: Icon, color, bg, title, desc, action, cta }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, border: "1px solid " + color + "30", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{title}</div>
            </div>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "#64748b" }}>{desc}</p>
            <button onClick={action} style={{ fontSize: 12, fontWeight: 700, color, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
              {cta} <ChevronRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Listings Tab ─────────────────────────────────────────────────────────────
function ListingsTab({ listings, loading, onRefresh }) {
  const [filter,   setFilter]   = useState("all")
  const [search,   setSearch]   = useState("")
  const [selected, setSelected] = useState(null)
  const [working,  setWorking]  = useState(false)

  const filtered = listings.filter(l => {
    const matchSearch = !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase())
    if (filter === "flagged")  return l.is_flagged && matchSearch
    if (filter === "featured") return l.is_featured && matchSearch
    if (filter === "active")   return l.status === "active" && !l.is_flagged && matchSearch
    return matchSearch
  })

  const flag = async (l) => {
    const reason = prompt("Reason for flagging this listing:")
    if (!reason) return
    setWorking(true)
    await supabase.from("listings").update({ is_flagged: true, flag_reason: reason, status: "rejected" }).eq("id", l.id)
    setWorking(false)
    setSelected(null)
    onRefresh()
  }

  const unflag = async (l) => {
    setWorking(true)
    await supabase.from("listings").update({ is_flagged: false, flag_reason: null, status: "active" }).eq("id", l.id)
    setWorking(false)
    setSelected(null)
    onRefresh()
  }

  const featureListing = async (l) => {
    const days = prompt("Feature for how many days? (e.g. 30)")
    if (!days || isNaN(days)) return
    setWorking(true)
    const expiresAt = new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000).toISOString()
    await supabase.from("listings").update({ is_featured: true, featured_until: expiresAt }).eq("id", l.id)
    setWorking(false)
    setSelected(null)
    onRefresh()
  }

  const unfeature = async (l) => {
    setWorking(true)
    await supabase.from("listings").update({ is_featured: false, featured_until: null }).eq("id", l.id)
    setWorking(false)
    setSelected(null)
    onRefresh()
  }

  const remove = async (l) => {
    if (!confirm("Permanently delete this listing? This cannot be undone.")) return
    setWorking(true)
    await supabase.from("listings").delete().eq("id", l.id)
    setWorking(false)
    setSelected(null)
    onRefresh()
  }

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)}
          style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20, padding: "8px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <ArrowLeft size={15} /> Back to Listings
        </button>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", animation: "fadeUp 0.4s ease both" }}>
          {selected.cover_image && (
            <div style={{ height: 220, background: "#f1f5f9" }}>
              <img src={selected.cover_image} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  {selected.is_flagged && <span style={{ padding: "3px 10px", borderRadius: 50, background: "#ef444412", color: "#ef4444", fontSize: 11, fontWeight: 800 }}>🚩 Flagged</span>}
                  {selected.is_featured && <span style={{ padding: "3px 10px", borderRadius: 50, background: "#f59e0b12", color: "#d97706", fontSize: 11, fontWeight: 800 }}>✦ Featured</span>}
                  <span style={{ padding: "3px 10px", borderRadius: 50, background: T + "12", color: T, fontSize: 11, fontWeight: 800 }}>{selected.status}</span>
                </div>
                <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>{selected.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={13} color={T} />
                  <span style={{ fontSize: 14, color: "#64748b" }}>{selected.city}, {selected.state}</span>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: T }}>{selected.price_label}</div>
            </div>

            {selected.flag_reason && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>Flag Reason</div>
                <div style={{ fontSize: 13, color: "#374151" }}>{selected.flag_reason}</div>
              </div>
            )}

            {selected.description && (
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{selected.description.slice(0, 300)}{selected.description.length > 300 ? "…" : ""}</p>
            )}

            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
              Agent: <strong style={{ color: "#0d1f2d" }}>{selected.agents?.users?.full_name || "Unknown"}</strong>
              {" · "}{selected.listing_type} · {new Date(selected.created_at).toLocaleDateString()}
              {" · "}{(selected.views || 0)} views
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={"/listings/" + selected.id}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                <Eye size={14} /> View Live
              </a>
              {!selected.is_featured
                ? <button onClick={() => featureListing(selected)} disabled={working}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, background: "#f59e0b12", border: "1px solid #f59e0b30", color: "#d97706", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <Sparkles size={14} /> Feature Listing
                  </button>
                : <button onClick={() => unfeature(selected)} disabled={working}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <Sparkles size={14} /> Remove Feature
                  </button>}
              {!selected.is_flagged
                ? <button onClick={() => flag(selected)} disabled={working}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, background: "#ef444412", border: "1px solid #ef444430", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <Flag size={14} /> Flag Listing
                  </button>
                : <button onClick={() => unflag(selected)} disabled={working}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, background: "#10b98112", border: "1px solid #10b98130", color: "#059669", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <CheckCircle size={14} /> Unflag
                  </button>}
              <button onClick={() => remove(selected)} disabled={working}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, background: "#ef444408", border: "1px solid #ef444420", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>All Listings ({listings.length})</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2 }}>
          {["all","active","flagged","featured"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", textTransform: "capitalize" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "flagged" && listings.filter(l => l.is_flagged).length > 0 && (
                <span style={{ marginLeft: 4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 50 }}>{listings.filter(l => l.is_flagged).length}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 44 }}>
          <Search size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        </div>
      </div>
      {loading ? <LoadingCard /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <Building2 size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>No listings found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((l, i) => (
            <div key={l.id} onClick={() => setSelected(l)}
              style={{ background: "#fff", borderRadius: 16, border: "1px solid " + (l.is_flagged ? "#fca5a5" : "#f1f5f9"), overflow: "hidden", display: "flex", animation: "fadeUp 0.4s ease " + (i * 35) + "ms both", cursor: "pointer" }}>
              <div style={{ width: "clamp(80px,18%,130px)", flexShrink: 0, background: "#f1f5f9" }}>
                {l.cover_image
                  ? <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 90 }} />
                  : <div style={{ minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={22} color="#cbd5e1" /></div>}
              </div>
              <div style={{ flex: 1, padding: "12px 14px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {l.is_flagged   && <span style={{ padding: "2px 7px", borderRadius: 50, background: "#ef444412", color: "#ef4444", fontSize: 10, fontWeight: 800 }}>🚩 Flagged</span>}
                    {l.is_featured  && <span style={{ padding: "2px 7px", borderRadius: 50, background: "#f59e0b12", color: "#d97706", fontSize: 10, fontWeight: 800 }}>✦</span>}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{l.city}, {l.state} · {l.listing_type} · {l.price_label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>By {l.agents?.users?.full_name || "Unknown"} · {new Date(l.created_at).toLocaleDateString()} · {l.views || 0} views</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Verifications Tab ────────────────────────────────────────────────────────
function VerificationsTab({ verifications, agents, loading, onRefresh }) {
  const [filter,  setFilter]  = useState("pending")
  const [note,    setNote]    = useState("")
  const [active,  setActive]  = useState(null)
  const [working, setWorking] = useState(false)

  const filtered = verifications.filter(v => filter === "all" || v.status === filter)

  const approve = async (v) => {
    setWorking(true)
    await supabase.from("verification_requests").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", v.id)
    await supabase.from("agents").update({ is_verified: true }).eq("id", v.agent_id)
    setWorking(false); setActive(null); onRefresh()
  }

  const reject = async (v) => {
    setWorking(true)
    const reason = note.trim() || "Application did not meet our requirements."
    await supabase.from("verification_requests").update({ status: "rejected", admin_note: reason, reviewed_at: new Date().toISOString() }).eq("id", v.id)
    await supabase.from("agents").update({ is_verified: false }).eq("id", v.agent_id)
    setWorking(false); setActive(null); setNote(""); onRefresh()
  }

  const manualVerify = async (agentId) => {
    setWorking(true)
    await supabase.from("agents").update({ is_verified: true }).eq("id", agentId)
    setWorking(false); onRefresh()
  }

  const unverify = async (agentId) => {
    if (!confirm("Remove verification badge from this agent?")) return
    setWorking(true)
    await supabase.from("agents").update({ is_verified: false }).eq("id", agentId)
    setWorking(false); onRefresh()
  }

  const statusConfig = {
    pending:  { bg: "#f59e0b12", color: "#d97706", label: "Pending"  },
    approved: { bg: "#10b98112", color: "#059669", label: "Approved" },
    rejected: { bg: "#ef444412", color: "#ef4444", label: "Rejected" },
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Verifications</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Approve agent applications or manually verify/unverify agents.</p>
      </div>

      {/* Manual verify section */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 12 }}>Quick Verify / Unverify Agents</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
          {agents.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: T, flexShrink: 0 }}>
                {a.users?.full_name?.charAt(0) || "A"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{a.users?.full_name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.users?.email}</div>
              </div>
              {a.is_verified
                ? <button onClick={() => unverify(a.id)} disabled={working}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: "#ef444412", border: "1px solid #ef444430", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                    <UserX size={12} /> Unverify
                  </button>
                : <button onClick={() => manualVerify(a.id)} disabled={working}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: "#10b98112", border: "1px solid #10b98130", color: "#059669", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                    <UserCheck size={12} /> Verify
                  </button>}
            </div>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 16, width: "fit-content" }}>
        {["pending","approved","rejected","all"].map(f => (
          <button key={f} onClick={() => { setFilter(f); setActive(null) }}
            style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", textTransform: "capitalize" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && verifications.filter(v => v.status === "pending").length > 0 && (
              <span style={{ marginLeft: 4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 50 }}>{verifications.filter(v => v.status === "pending").length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? <LoadingCard /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
          <BadgeCheck size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No {filter === "all" ? "" : filter} applications</p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#cbd5e1" }}>Applications submitted by agents appear here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="verif-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((v, i) => {
              const sc = statusConfig[v.status] || statusConfig.pending
              return (
                <button key={v.id} onClick={() => setActive(active?.id === v.id ? null : v)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1.5px solid " + (active?.id === v.id ? T : "#f1f5f9"), background: active?.id === v.id ? T + "06" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s", animation: "fadeUp 0.4s ease " + (i * 40) + "ms both" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: T + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: T, flexShrink: 0 }}>
                    {v.full_name?.charAt(0) || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 1 }}>{v.full_name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{v.id_type} · {v.experience} yrs · {new Date(v.submitted_at).toLocaleDateString()}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{sc.label}</span>
                </button>
              )
            })}
          </div>

          {active && (
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "22px", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: T + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T, flexShrink: 0 }}>{active.full_name?.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>{active.full_name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Submitted {new Date(active.submitted_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {[["ID Type", active.id_type],["ID Number", active.id_number],["Phone", active.phone],["Experience", active.experience + " years"]].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderRadius: 9, background: "#f8fafc" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "#0d1f2d", fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
              {active.bio && <p style={{ margin: "0 0 14px", fontSize: 13, color: "#374151", lineHeight: 1.6, background: "#f8fafc", borderRadius: 10, padding: "12px" }}>{active.bio}</p>}
              {active.status === "pending" && (
                <>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Rejection note (optional)…"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc", boxSizing: "border-box", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => approve(active)} disabled={working}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 12, background: "#10b981", border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                      {working ? <Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={14} />} Approve
                    </button>
                    <button onClick={() => reject(active)} disabled={working}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 12, background: "#ef4444", border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                      {working ? <Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> : <X size={14} />} Reject
                    </button>
                  </div>
                </>
              )}
              {active.status !== "pending" && (
                <div style={{ padding: "12px 14px", borderRadius: 10, background: active.status === "approved" ? "#10b98112" : "#ef444412" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active.status === "approved" ? "#059669" : "#ef4444" }}>
                    {active.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                  </div>
                  {active.admin_note && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{active.admin_note}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Agents Tab ───────────────────────────────────────────────────────────────
function AgentsTab({ agents, listings, loading, onRefresh }) {
  const [search,  setSearch]  = useState("")
  const [working, setWorking] = useState(null)

  const filtered = agents.filter(a =>
    !search || a.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.users?.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleVerify = async (a) => {
    setWorking(a.id)
    await supabase.from("agents").update({ is_verified: !a.is_verified }).eq("id", a.id)
    setWorking(null)
    onRefresh()
  }

  const featureAgent = async (a) => {
    const agentListings = listings.filter(l => l.agent_id === a.id && l.status === "active")
    if (agentListings.length === 0) { alert("This agent has no active listings to feature."); return }
    const names    = agentListings.map((l, i) => (i + 1) + ". " + l.title).join("\n")
    const choice   = prompt("Which listing to feature? Enter number:\n" + names)
    if (!choice || isNaN(choice)) return
    const listing  = agentListings[parseInt(choice) - 1]
    if (!listing) return
    const days     = prompt("Feature for how many days?")
    if (!days || isNaN(days)) return
    const expiresAt = new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000).toISOString()
    setWorking(a.id)
    await supabase.from("listings").update({ is_featured: true, featured_until: expiresAt }).eq("id", listing.id)
    setWorking(null)
    alert(listing.title + " is now featured for " + days + " days!")
    onRefresh()
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>All Agents ({agents.length})</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 44, minWidth: 240 }}>
          <Search size={15} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        </div>
      </div>
      {loading ? <LoadingCard /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((a, i) => (
            <div key={a.id} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", animation: "fadeUp 0.4s ease " + (i * 35) + "ms both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200 }}>
                {a.users?.avatar_url
                  ? <img src={a.users.avatar_url} alt={a.users.full_name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T, flexShrink: 0 }} />
                  : <div style={{ width: 44, height: 44, borderRadius: "50%", background: T + "20", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: T, flexShrink: 0 }}>{a.users?.full_name?.charAt(0) || "A"}</div>}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{a.users?.full_name || "Unknown"}</span>
                    {a.is_verified && <BadgeCheck size={14} color="#10b981" />}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.users?.email} · {a.listing_count || 0} listings</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggleVerify(a)} disabled={working === a.id}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: a.is_verified ? "#ef444412" : "#10b98112", border: "1px solid " + (a.is_verified ? "#ef444430" : "#10b98130"), color: a.is_verified ? "#ef4444" : "#059669", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {working === a.id ? <Loader size={12} style={{ animation: "spin 1s linear infinite" }} /> : a.is_verified ? <UserX size={12} /> : <UserCheck size={12} />}
                  {a.is_verified ? "Unverify" : "Verify"}
                </button>
                <button onClick={() => featureAgent(a)} disabled={working === a.id}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: "#f59e0b12", border: "1px solid #f59e0b30", color: "#d97706", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  <Sparkles size={12} /> Feature
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ users, loading, onRefresh }) {
  const [search,  setSearch]  = useState("")
  const [filter,  setFilter]  = useState("all")
  const [working, setWorking] = useState(null)

  const filtered = users.filter(u => {
    const matchRole   = filter === "all" || u.role === filter || (filter === "banned" && u.is_banned)
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const banUser = async (u) => {
    const reason = prompt("Reason for banning " + u.full_name + ":")
    if (!reason) return
    setWorking(u.id)
    await supabase.from("users").update({ is_banned: true, ban_reason: reason }).eq("id", u.id)
    setWorking(null)
    onRefresh()
  }

  const unbanUser = async (u) => {
    setWorking(u.id)
    await supabase.from("users").update({ is_banned: false, ban_reason: null }).eq("id", u.id)
    setWorking(null)
    onRefresh()
  }

  const deleteUser = async (u) => {
    if (!confirm("Permanently delete " + u.full_name + "? This cannot be undone.")) return
    setWorking(u.id)
    await supabase.from("users").delete().eq("id", u.id)
    setWorking(null)
    onRefresh()
  }

  const roleColors = {
    admin:  { bg: "#ef444412", color: "#ef4444" },
    agent:  { bg: T + "12",   color: T          },
    buyer:  { bg: "#10b98112", color: "#059669" },
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>All Users ({users.length})</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 44, minWidth: 220 }}>
          <Search size={15} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        </div>
      </div>
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 20, width: "fit-content" }}>
        {["all","buyer","agent","banned"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", textTransform: "capitalize" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading ? <LoadingCard /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((u, i) => {
            const rc = roleColors[u.role] || roleColors.buyer
            return (
              <div key={u.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid " + (u.is_banned ? "#fca5a5" : "#f1f5f9"), display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.3s ease " + (i * 25) + "ms both" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d" }}>{u.full_name || "—"}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 50, background: rc.bg, color: rc.color, fontSize: 10, fontWeight: 800, textTransform: "capitalize" }}>{u.role || "buyer"}</span>
                    {u.is_banned && <span style={{ padding: "2px 8px", borderRadius: 50, background: "#ef444412", color: "#ef4444", fontSize: 10, fontWeight: 800 }}>🚫 Banned</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{u.email} · Joined {new Date(u.created_at).toLocaleDateString()}</div>
                  {u.ban_reason && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>Ban reason: {u.ban_reason}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {!u.is_banned
                    ? <button onClick={() => banUser(u)} disabled={working === u.id}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 9, background: "#f59e0b12", border: "1px solid #f59e0b30", color: "#d97706", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {working === u.id ? <Loader size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Ban size={11} />} Ban
                      </button>
                    : <button onClick={() => unbanUser(u)} disabled={working === u.id}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 9, background: "#10b98112", border: "1px solid #10b98130", color: "#059669", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {working === u.id ? <Loader size={11} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={11} />} Unban
                      </button>}
                  {u.role !== "admin" && (
                    <button onClick={() => deleteUser(u)} disabled={working === u.id}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 9, background: "#ef444408", border: "1px solid #ef444420", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {working === u.id ? <Loader size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={11} />} Delete
                    </button>
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

// ─── Enquiries Tab ────────────────────────────────────────────────────────────
function EnquiriesTab({ enquiries, loading }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const filtered = enquiries.filter(e => {
    const matchStatus = filter === "all" || e.status === filter
    const matchSearch = !search || e.sender_name?.toLowerCase().includes(search.toLowerCase()) || e.listings?.title?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })
  const statusConfig = {
    new:     { bg: "#ef444412", color: "#ef4444", label: "New"     },
    replied: { bg: "#10b98112", color: "#059669", label: "Replied" },
    closed:  { bg: "#94a3b812", color: "#94a3b8", label: "Closed"  },
  }
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>All Enquiries ({enquiries.length})</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "0 14px", minHeight: 44, minWidth: 220 }}>
          <Search size={15} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", background: "transparent" }} />
        </div>
      </div>
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 16, width: "fit-content" }}>
        {["all","new","replied","closed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", textTransform: "capitalize" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading ? <LoadingCard /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <MessageCircle size={44} color="#cbd5e1" style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No enquiries yet</p>
          <p style={{ fontSize: 12, color: "#cbd5e1", margin: "6px 0 0" }}>Buyer enquiries will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((e, i) => {
            const sc = statusConfig[e.status] || statusConfig.new
            return (
              <div key={e.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #f1f5f9", animation: "fadeUp 0.3s ease " + (i * 25) + "ms both" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{e.sender_name || e.users?.full_name || "Anonymous"}</span>
                    {e.sender_email && <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>{e.sender_email}</span>}
                    <div style={{ fontSize: 12, color: T, fontWeight: 600, marginTop: 2 }}>Re: {e.listings?.title || "Unknown"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 800 }}>{sc.label}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(e.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{e.message}</p>
                {e.agent_reply && (
                  <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: T + "08", borderLeft: "2px solid " + T }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T }}>Agent: </span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{e.agent_reply}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────
function ReportsTab({ reports: parentReports, loading: parentLoading, onRefresh }) {
  const [filter,      setFilter]      = useState("new")
  const [active,      setActive]      = useState(null)
  const [note,        setNote]        = useState("")
  const [working,     setWorking]     = useState(false)
  const [localReports,setLocalReports]= useState([])
  const [localLoading,setLocalLoading]= useState(true)

  // Fetch reports directly — don't rely on parent which may have join issues
  const loadReports = async () => {
    setLocalLoading(true)
    const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false })
    if (error) { setLocalLoading(false); return }

    // Enrich with reporter info
    if (data?.length > 0) {
      const reporterIds = [...new Set(data.map(r => r.reporter_id).filter(Boolean))]
      const { data: reporters } = await supabase.from("users").select("id, full_name, email").in("id", reporterIds)
      const enriched = data.map(r => {
        const reporter = reporters?.find(u => u.id === r.reporter_id)
        return { ...r, reporter_name: reporter?.full_name || reporter?.email || "Anonymous" }
      })
      setLocalReports(enriched)
    } else {
      setLocalReports(data || [])
    }
    setLocalLoading(false)
  }

  useEffect(() => { loadReports() }, [])

  const reports  = localReports.length > 0 ? localReports : parentReports
  const loading  = localLoading && parentLoading
  const filtered = reports.filter(r => filter === "all" || r.status === filter)

  const resolve = async (r) => {
    setWorking(true)
    await supabase.from("reports").update({ status: "resolved", admin_note: note, resolved_at: new Date().toISOString() }).eq("id", r.id)
    setWorking(false); setActive(null); setNote("")
    loadReports(); onRefresh()
  }

  const markReview = async (r) => {
    setWorking(true)
    await supabase.from("reports").update({ status: "in_review" }).eq("id", r.id)
    setWorking(false); loadReports(); onRefresh()
  }

  const typeConfig = {
    listing: { icon: Building2, color: "#f59e0b", label: "Listing"  },
    agent:   { icon: Shield,    color: "#8b5cf6", label: "Agent"    },
    bug:     { icon: AlertCircle, color: "#ef4444", label: "Bug"    },
    other:   { icon: FileText,  color: "#64748b", label: "Other"    },
  }
  const statusConfig = {
    new:       { bg: "#ef444412", color: "#ef4444", label: "New"       },
    in_review: { bg: "#f59e0b12", color: "#d97706", label: "In Review" },
    resolved:  { bg: "#10b98112", color: "#059669", label: "Resolved"  },
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Reports ({reports.length})</h2>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#94a3b8" }}>Abuse & violation reports — users reporting listings/agents for fraud, scams or bad behaviour.</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 50, background: "#ef444412", border: "1px solid #ef444430" }}>
          <ClipboardList size={12} color="#ef4444" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444" }}>These are NOT help requests — see Support Tickets for that</span>
        </div>
      </div>
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 16, width: "fit-content" }}>
        {["new","in_review","resolved","all"].map(f => (
          <button key={f} onClick={() => { setFilter(f); setActive(null) }}
            style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
            {f === "all" ? "All" : f === "in_review" ? "In Review" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "new" && reports.filter(r => r.status === "new").length > 0 && (
              <span style={{ marginLeft: 4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 50 }}>{reports.filter(r => r.status === "new").length}</span>
            )}
          </button>
        ))}
      </div>
      {loading ? <LoadingCard /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <ClipboardList size={44} color="#cbd5e1" style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No {filter === "all" ? "" : filter} reports</p>
          <p style={{ fontSize: 12, color: "#cbd5e1", margin: "6px 0 0" }}>Reports from users and agents appear here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="verif-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((r, i) => {
              const tc = typeConfig[r.type] || typeConfig.other
              const sc = statusConfig[r.status] || statusConfig.new
              const TypeIcon = tc.icon
              return (
                <button key={r.id} onClick={() => setActive(active?.id === r.id ? null : r)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1.5px solid " + (active?.id === r.id ? T : "#f1f5f9"), background: active?.id === r.id ? T + "06" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s", animation: "fadeUp 0.4s ease " + (i * 35) + "ms both" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tc.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TypeIcon size={16} color={tc.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 2 }}>{r.subject}</div>
                    <div style={{ fontSize: 12, color: "#64748b", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{r.description}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{tc.label} report · {r.reporter_name || "Anonymous"} · {new Date(r.created_at || r.created_at).toLocaleDateString()}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{sc.label}</span>
                </button>
              )
            })}
          </div>

          {active && (
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "22px", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1f2d", marginBottom: 4 }}>{active.subject}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {typeConfig[active.type]?.label || "General"} report · {new Date(active.created_at || active.created_at).toLocaleDateString()}
                </div>
              </div>
              <p style={{ margin: "0 0 16px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{active.description}</p>
              {active.status === "new" && (
                <button onClick={() => markReview(active)} disabled={working}
                  style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#f59e0b12", border: "1px solid #f59e0b30", color: "#d97706", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                  Mark as In Review
                </button>
              )}
              {active.status !== "resolved" && (
                <>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Admin note / resolution…"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc", boxSizing: "border-box", marginBottom: 10 }} />
                  <button onClick={() => resolve(active)} disabled={working}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", borderRadius: 12, background: "#10b981", border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                    {working ? <Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={14} />} Mark Resolved
                  </button>
                </>
              )}
              {active.status === "resolved" && (
                <div style={{ padding: "12px", borderRadius: 10, background: "#10b98112" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", marginBottom: 4 }}>✓ Resolved</div>
                  {active.admin_note && <div style={{ fontSize: 12, color: "#374151" }}>{active.admin_note}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab({ users }) {
  const [notifType, setNotifType] = useState("general")
  const [target,    setTarget]    = useState("all")
  const [recipient, setRecipient] = useState("")
  const [title,     setTitle]     = useState("")
  const [message,   setMessage]   = useState("")
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [error,     setError]     = useState("")
  const [history,   setHistory]   = useState([])
  const [isPersonal, setIsPersonal] = useState(false)

  useEffect(() => {
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(15)
      .then(({ data }) => setHistory(data || []))
  }, [sent])

  const send = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) { setError("Title and message are required."); return }
    setError("")
    setSending(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (isPersonal) {
      const targetUser = users.find(u => u.email === recipient || u.full_name?.toLowerCase() === recipient.toLowerCase())
      if (!targetUser) { setError("User not found."); setSending(false); return }
      await supabase.from("notifications").insert({ user_id: targetUser.id, type: notifType, title, body: message })
    } else {
      let targetUsers = users
      if (target === "agents") targetUsers = users.filter(u => u.role === "agent")
      if (target === "buyers") targetUsers = users.filter(u => u.role === "buyer" || !u.role)
      const rows = targetUsers.map(u => ({ user_id: u.id, type: notifType, title, body: message }))
      for (let i = 0; i < rows.length; i += 50) {
        await supabase.from("notifications").insert(rows.slice(i, i + 50))
      }
    }

    setSending(false); setSent(true)
    setTitle(""); setMessage(""); setRecipient("")
    setTimeout(() => setSent(false), 3000)
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Send Notifications</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Broadcast messages or send personal notifications.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="notif-layout">
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease both" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Compose</h3>
          <form onSubmit={send} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Notification type */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Type</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {NOTIF_TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => setNotifType(t.value)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 50, border: "1.5px solid " + (notifType === t.value ? t.color : "#e2e8f0"), background: notifType === t.value ? t.color + "15" : "#fff", color: notifType === t.value ? t.color : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d" }}>Personal Message</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Send to one specific person</div>
              </div>
              <div onClick={() => setIsPersonal(p => !p)}
                style={{ width: 44, height: 24, borderRadius: 50, background: isPersonal ? T : "#e2e8f0", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 3, left: isPersonal ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
              </div>
            </div>

            {/* Target */}
            {!isPersonal && (
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Send To</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["all","Everyone 👥"],["agents","All Agents 🏘️"],["buyers","All Buyers 🏠"]].map(([v, l]) => (
                    <button key={v} type="button" onClick={() => setTarget(v)}
                      style={{ padding: "8px 16px", borderRadius: 50, border: "1.5px solid " + (target === v ? T : "#e2e8f0"), background: target === v ? T : "#fff", color: target === v ? "#fff" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient */}
            {isPersonal && (
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Recipient Email or Name</label>
                <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. user@email.com"
                  list="users-list" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = T }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0" }}
                />
                <datalist id="users-list">
                  {users.map(u => <option key={u.id} value={u.email}>{u.full_name}</option>)}
                </datalist>
              </div>
            )}

            {/* Title */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New Feature Available!"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = T }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0" }}
              />
            </div>

            {/* Message */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Type your message…"
                style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                onFocus={e => { e.target.style.borderColor = T }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0" }}
              />
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5" }}>
                <AlertCircle size={14} color="#ef4444" />
                <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={sending}
              style={{ padding: "13px", borderRadius: 14, background: sent ? "#10b981" : sending ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, transition: "background 0.3s", boxShadow: sending || sent ? "none" : "0 6px 20px " + T_GLOW }}>
              {sending ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
               : sent   ? <><CheckCircle size={17} /> Sent!</>
               :           <><Send size={17} /> Send Notification</>}
            </button>
          </form>
        </div>

        {/* History */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 80ms both" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Recent Sent</h3>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
              <Bell size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: 13 }}>No notifications sent yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map(n => {
                const nt = NOTIF_TYPES.find(t => t.value === n.type) || NOTIF_TYPES[0]
                return (
                  <div key={n.id} style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{nt.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d", flex: 1 }}>{n.title}</span>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.body}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ─── Support Tickets Tab ──────────────────────────────────────────────────────
function SupportTicketsTab() {
  const [tickets,  setTickets]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply,    setReply]    = useState("")
  const [filter,   setFilter]   = useState("open")
  const [sending,  setSending]  = useState(false)

  useEffect(() => {
    supabase.from("support_tickets")
      .select("*, users(full_name, email, role)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setTickets(data || []); setLoading(false) })
  }, [sending])

  const filtered = tickets.filter(t => filter === "all" || t.status === filter)

  const sendReply = async () => {
    if (!reply.trim() || !selected) return
    setSending(true)
    await supabase.from("support_tickets").update({ admin_reply: reply, status: "resolved" }).eq("id", selected.id)
    // Send notification to user
    await supabase.from("notifications").insert({
      user_id: selected.user_id,
      type:    "personal",
      title:   "Support Reply",
      body:    "Your support ticket has been resolved: " + reply.trim(),
    })
    setReply("")
    setSending(false)
    setSelected(null)
  }

  const statusConfig = {
    open:      { bg: "#ef444412", color: "#ef4444", label: "Open"      },
    in_review: { bg: "#f59e0b12", color: "#d97706", label: "In Review" },
    resolved:  { bg: "#10b98112", color: "#059669", label: "Resolved"  },
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Support Tickets ({tickets.length})</h2>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#94a3b8" }}>Help requests from users & agents — account issues, payment problems, technical errors. Reply and resolve here.</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 50, background: "#8b5cf612", border: "1px solid #8b5cf630" }}>
          <Headphones size={12} color="#8b5cf6" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6" }}>These are help requests — NOT abuse reports (see Reports for that)</span>
        </div>
      </div>
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2, marginBottom: 16, width: "fit-content" }}>
        {["open","in_review","resolved","all"].map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelected(null) }}
            style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
            {f === "all" ? "All" : f === "in_review" ? "In Review" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "open" && tickets.filter(t => t.status === "open").length > 0 && (
              <span style={{ marginLeft: 4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 50 }}>{tickets.filter(t => t.status === "open").length}</span>
            )}
          </button>
        ))}
      </div>
      {loading ? <LoadingCard /> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="verif-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                <MessageCircle size={44} color="#cbd5e1" style={{ marginBottom: 14 }} />
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No {filter} tickets</p>
              </div>
            ) : filtered.map((t, i) => {
              const sc = statusConfig[t.status] || statusConfig.open
              return (
                <button key={t.id} onClick={() => setSelected(selected?.id === t.id ? null : t)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1.5px solid " + (selected?.id === t.id ? T : "#f1f5f9"), background: selected?.id === t.id ? T + "06" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s", animation: "fadeUp 0.4s ease " + (i * 35) + "ms both" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: T + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: T, flexShrink: 0 }}>
                    {(t.users?.full_name || "U").charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 2 }}>{t.subject}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{t.users?.full_name} · {t.users?.role} · {new Date(t.created_at).toLocaleDateString()}</div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{t.message}</p>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{sc.label}</span>
                </button>
              )
            })}
          </div>
          {selected && (
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", padding: "22px", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1f2d", marginBottom: 4 }}>{selected.subject}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{selected.users?.full_name} ({selected.users?.role}) · {selected.users?.email}</div>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{selected.message}</p>
              </div>
              {selected.admin_reply && (
                <div style={{ background: T + "08", borderRadius: 12, padding: "12px 16px", marginBottom: 16, borderLeft: "3px solid " + T }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T, marginBottom: 4 }}>Admin Reply</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{selected.admin_reply}</p>
                </div>
              )}
              {selected.status !== "resolved" && (
                <>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Type your reply…"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc", boxSizing: "border-box", marginBottom: 10 }} />
                  <button onClick={sendReply} disabled={sending || !reply.trim()}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px", borderRadius: 12, background: sending ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: sending ? "not-allowed" : "pointer" }}>
                    {sending ? <><Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={15} /> Send Reply & Resolve</>}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [tab,           setTab]           = useState("overview")
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [adminUser,     setAdminUser]     = useState(null)
  const [stats,         setStats]         = useState({ totalUsers: 0, totalAgents: 0, verifiedAgents: 0, activeListings: 0, flaggedListings: 0, totalEnquiries: 0, pendingVerifs: 0, newReports: 0, openTickets: 0 })
  const [listings,      setListings]      = useState([])
  const [agents,        setAgents]        = useState([])
  const [users,         setUsers]         = useState([])
  const [enquiries,     setEnquiries]     = useState([])
  const [verifications, setVerifications] = useState([])
  const [reports,       setReports]       = useState([])
  const [loading,       setLoading]       = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) { router.push("/auth"); return }
    const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
    if (!userData || userData.role !== "admin") { router.push("/"); return }
    setAdminUser(userData)

    const [
      { data: allUsers },
      { data: allAgents },
      { data: allListings },
      { data: allEnquiries },
      { data: allVerifs },
      { data: allReports, error: reportsError },
      { data: openTickets },
    ] = await Promise.all([
      supabase.from("users").select("*").order("created_at", { ascending: false }),
      supabase.from("agents").select("*, users(full_name, email, phone, avatar_url)").order("created_at", { ascending: false }),
      supabase.from("listings").select("*, agents(users(full_name))").order("created_at", { ascending: false }),
      supabase.from("enquiries").select("*, listings(title), users(full_name)").order("created_at", { ascending: false }),
      supabase.from("verification_requests").select("*").order("submitted_at", { ascending: false }),
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
      supabase.from("support_tickets").select("id, status").eq("status", "open"),
    ])

    
    let formattedListings = allListings || []
    if (formattedListings.length > 0) {
      const ids = formattedListings.map(l => l.id)
      const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
      formattedListings = formattedListings.map(l => {
        const imgs  = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
        const cover = imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null
        return { ...l, cover_image: cover }
      })
    }

    const agentsWithCounts = (allAgents || []).map(a => ({
      ...a,
      listing_count: formattedListings.filter(l => l.agent_id === a.id).length,
    }))

    // Enrich reports with reporter name from users array
    const enrichedReports = (allReports || []).map(r => {
      const reporter = (allUsers || []).find(u => u.id === r.reporter_id)
      return { ...r, reporter_name: reporter?.full_name || reporter?.email || "Unknown" }
    })

    setUsers(allUsers || [])
    setAgents(agentsWithCounts)
    setListings(formattedListings)
    setEnquiries(allEnquiries || [])
    setVerifications(allVerifs || [])
    setReports(enrichedReports)

    setStats({
      totalUsers:      (allUsers || []).length,
      totalAgents:     (allAgents || []).length,
      verifiedAgents:  (allAgents || []).filter(a => a.is_verified).length,
      activeListings:  formattedListings.filter(l => l.status === "active").length,
      flaggedListings: formattedListings.filter(l => l.is_flagged).length,
      totalEnquiries:  (allEnquiries || []).length,
      pendingVerifs:   (allVerifs || []).filter(v => v.status === "pending").length,
      newReports:      (allReports || []).filter(r => r.status === "new").length,
      openTickets:     (openTickets || []).length,
    })

    setLoading(false)
  }

  useEffect(() => {
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

  // Poll every 30 seconds for new reports, support tickets, verifications
  // so sidebar badges + overview update without full page refresh
  useEffect(() => {
    const pollCounts = async () => {
      const [
        { data: newReportsData },
        { data: openTicketsData },
        { data: pendingVerifsData },
      ] = await Promise.all([
        supabase.from("reports").select("id", { count: "exact" }).eq("status", "new"),
        supabase.from("support_tickets").select("id").eq("status", "open"),
        supabase.from("verification_requests").select("id").eq("status", "pending"),
      ])
      setStats(prev => ({
        ...prev,
        newReports:    (newReportsData   || []).length,
        openTickets:   (openTicketsData  || []).length,
        pendingVerifs: (pendingVerifsData || []).length,
      }))
    }
    const interval = setInterval(pollCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const badges = {
    verifications: stats.pendingVerifs,
    reports:       stats.newReports,
    listings:      stats.flaggedListings,
    support:       stats.openTickets || 0,
  }

  const titles = {
    overview: "Overview", listings: "Listings", verifications: "Verifications",
    agents: "Agents", users: "Users", enquiries: "Enquiries",
    reports: "Reports", notifications: "Notifications", support: "Support Tickets",
  }

  const renderTab = () => {
    if (loading) return <LoadingCard />
    if (tab === "overview")      return <Overview stats={stats} onNav={setTab} />
    if (tab === "listings")      return <ListingsTab listings={listings} loading={loading} onRefresh={fetchData} />
    if (tab === "verifications") return <VerificationsTab verifications={verifications} agents={agents} loading={loading} onRefresh={fetchData} />
    if (tab === "agents")        return <AgentsTab agents={agents} listings={listings} loading={loading} onRefresh={fetchData} />
    if (tab === "users")         return <UsersTab users={users} loading={loading} onRefresh={fetchData} />
    if (tab === "enquiries")     return <EnquiriesTab enquiries={enquiries} loading={loading} />
    if (tab === "reports")       return <ReportsTab reports={reports} loading={loading} onRefresh={fetchData} />
    if (tab === "notifications") return <NotificationsTab users={users} />
    if (tab === "support")       return <SupportTicketsTab />
    return null
  }

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex" }}>
      <Sidebar active={tab} onNav={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} adminUser={adminUser} badges={badges} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="main-area">
        <Topbar title={titles[tab]} onMenuOpen={() => setSidebarOpen(true)} onRefresh={fetchData} adminUserId={adminUser?.id} />
        <main style={{ flex: 1, padding: "16px 12px 48px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="main-container">
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
        /* Mobile base styles */
        .verif-layout  { grid-template-columns: 1fr !important; }
        .notif-layout  { grid-template-columns: 1fr !important; }
        .stats-grid    { grid-template-columns: repeat(2, 1fr) !important; }
        .action-grid   { grid-template-columns: 1fr !important; }
        /* Hide admin panel badge text on small screens */
        @media (max-width: 480px) {
          .admin-badge-text { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .action-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .main-container { padding: 24px 24px 48px !important; }
          .action-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .sidebar-close { display: none !important; }
          .main-area { margin-left: 260px !important; }
          .menu-btn { display: none !important; }
          .main-container { padding: 28px 32px 64px !important; }
          .verif-layout { grid-template-columns: 1fr 380px !important; align-items: start; }
          .notif-layout { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .action-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}