"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Building2, MessageCircle, TrendingUp, Settings, LogOut,
  Bell, Plus, Eye, Phone, MapPin, Star, CheckCircle,
  ChevronRight, MoreHorizontal, Trash2, X, Menu,
  Bed, Bath, Maximize2, Clock, Activity,
  Search, Send, Check, Loader, Shield, AlertCircle,
  Upload, BadgeCheck, RefreshCw, Sparkles, Zap,
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
]

const inputBase = {
  width: "100%", padding: "12px 14px", borderRadius: 12,
  border: "1.5px solid #e2e8f0", fontSize: 15, color: "#0d1f2d",
  fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
  background: "#f8fafc", boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose, agent, user }) {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 149, backdropFilter: "blur(2px)" }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 150, width: 260, background: DARK, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: open ? "8px 0 32px rgba(0,0,0,0.4)" : "none" }} className="sidebar">
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {user?.avatar_url
                ? <img src={user.avatar_url} alt={user?.full_name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2.5px solid " + T }} />
                : <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "30", border: "2.5px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T }}>
                    {user?.full_name?.charAt(0) || "A"}
                  </div>}
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid " + DARK }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.full_name || "Agent"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Property Agent</div>
            </div>
          </div>
          {agent?.is_verified
            ? <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 50, background: "#10b98120", border: "1px solid #10b98140" }}>
                <BadgeCheck size={11} color="#10b981" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Verified Agent</span>
              </div>
            : <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 50, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <Shield size={11} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Unverified</span>
              </div>}
        </div>

        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            const isVerif  = key === "verification"
            const isFeat   = key === "featured"
            return (
              <button key={key} onClick={() => { onNav(key); onClose() }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", background: isActive ? T + "18" : "transparent", color: isActive ? T : isVerif && !agent?.is_verified ? "#f59e0b" : isFeat ? "#f59e0b" : "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: isActive ? 800 : 600, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.18s", borderLeft: isActive ? "3px solid " + T : "3px solid transparent" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {label}
                {isVerif && !agent?.is_verified && (
                  <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>NEW</span>
                )}
                {isFeat && (
                  <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>✦</span>
                )}
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


// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell({ userId }) {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
  const unread = notifs.filter(n => !n.is_read).length

  const ICONS = {
    general: "🔔", warning: "⚠️", feature: "🚀",
    announcement: "📢", policy: "📋", personal: "💬",
  }

  useEffect(() => {
    if (!userId) return
    supabase.from("notifications").select("*")
      .or(`recipient_id.eq.${userId},user_id.eq.${userId}`)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data, error }) => {
        if (error) {
          supabase.from("notifications").select("*").eq("recipient_id", userId)
            .order("created_at", { ascending: false }).limit(20)
            .then(({ data: d }) => setNotifs(d || []))
        } else {
          setNotifs(data || [])
        }
      })
  }, [userId, open])

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
      <button onClick={() => setOpen(p => !p)}
        style={{ position: "relative", width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Bell size={17} color="#64748b" />
        {unread > 0 && (
          <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 200, width: 320, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.15)", overflow: "hidden", animation: "fadeUp 0.2s ease" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Notifications {unread > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 50, marginLeft: 4 }}>{unread}</span>}</span>
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
function Topbar({ title, onMenuOpen, userId }) {
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
        <NotificationBell userId={userId} />
        <Link href="/dashboard/agent/add-listing"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: T, color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", minHeight: 40, boxShadow: "0 4px 16px " + T_GLOW }}>
          <Plus size={15} /> Add Listing
        </Link>
      </div>
    </header>
  )
}

// ─── Loading card ─────────────────────────────────────────────────────────────
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

// ─── Status Badge ─────────────────────────────────────────────────────────────
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
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f59e0b18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Clock size={20} color="#f59e0b" />
        </div>
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
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#ef444418", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <X size={20} color="#ef4444" />
        </div>
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
      <div style={{ width: 48, height: 48, borderRadius: 14, background: T + "30", border: "1.5px solid " + T + "60", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <BadgeCheck size={24} color={T} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Get Verified — Build Trust with Buyers</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Verified agents get a blue badge, appear higher in search and close 3x more deals.</div>
      </div>
      <button onClick={onApply}
        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 50, background: "#fff", border: "none", color: T, fontSize: 13, fontWeight: 900, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
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
    if (typeof window === "undefined" || !window.PaystackPop) {
      alert("Payment system not loaded. Please refresh and try again.")
      return
    }
    const handler = window.PaystackPop.setup({
      key:      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email:    user?.email || "agent@findwithhabi.com",
      amount:   plan.amount * 100,
      currency: "NGN",
      ref:      "feat_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      metadata: {
        custom_fields: [
          { display_name: "Listing",  variable_name: "listing",  value: selectedListing.title },
          { display_name: "Duration", variable_name: "duration", value: plan.label            },
        ],
      },
      onClose: function() {},
      callback: function(response) {
        const expiresAt    = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString()
        const listingId    = selectedListing.id
        const listingTitle = selectedListing.title
        const planLabel    = plan.label
        const planAmount   = plan.amount
        const planDays     = plan.days
        const agentId      = agent.id
        setPaying(true)
        supabase.from("listings")
          .update({ is_featured: true, featured_until: expiresAt })
          .eq("id", listingId)
          .then(function() {
            return supabase.from("featured_payments").insert({
              listing_id:    listingId,
              agent_id:      agentId,
              amount:        planAmount,
              duration_days: planDays,
              paystack_ref:  response.reference,
              status:        "active",
              expires_at:    expiresAt,
            })
          })
          .then(function() {
            setPaying(false)
            setSuccess({ listing: listingTitle, plan: planLabel, expiresAt })
            onRefresh()
          })
      },
    })
    handler.openIframe()
  }

  if (success) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f59e0b12", border: "3px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.4s ease" }}>
            <Sparkles size={38} color="#f59e0b" />
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Listing Boosted! 🎉</h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
            <strong>{success.listing}</strong> is now featured for <strong>{success.plan}</strong>.
          </p>
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>Expires</span>
              <span style={{ color: "#0d1f2d", fontWeight: 700 }}>{new Date(success.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
          <button onClick={() => setSuccess(null)}
            style={{ width: "100%", padding: "13px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Feature Another Listing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#78350f 0%,#b45309 100%)", borderRadius: 20, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={30} color="#fef3c7" />
          </div>
          <div>
            <h2 style={{ margin: "0 0 5px", fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Boost Your Listing</h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Get featured on the homepage and listings page · More eyes, more enquiries</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 10, marginBottom: 24, animation: "fadeUp 0.5s ease 80ms both" }}>
        {[
          { icon: Sparkles, color: "#f59e0b", text: "Featured badge on listing"    },
          { icon: Eye,      color: T,         text: "Top of listings page"          },
          { icon: Star,     color: "#10b981",  text: "Homepage featured strip"      },
          { icon: Zap,      color: "#8b5cf6",  text: "Priority in search results"   },
        ].map(({ icon: Icon, color, text }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} color={color} />
            </div>
            <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, fontWeight: 600 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Currently featured */}
      {alreadyFeatured.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", border: "1px solid #f1f5f9", marginBottom: 20, animation: "fadeUp 0.5s ease 100ms both" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Currently Featured</h3>
          {alreadyFeatured.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ width: 44, height: 36, borderRadius: 8, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                {l.cover_image && <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d", marginBottom: 2 }}>{l.title}</div>
                {l.featured_until && (
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Expires {new Date(l.featured_until).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                )}
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 50, background: "#f59e0b12", color: "#d97706", fontSize: 11, fontWeight: 800 }}>Featured ✦</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 160ms both" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Feature a Listing</h3>

        {/* Select listing */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Select Listing <span style={{ color: "#ef4444" }}>*</span>
          </label>
          {activeListings.length === 0 ? (
            <div style={{ padding: "20px", borderRadius: 14, background: "#f8fafc", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>No active listings. Add a listing first.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeListings.map(l => (
                <button key={l.id} onClick={() => setSelectedListing(l)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: "1.5px solid " + (selectedListing?.id === l.id ? T : "#e2e8f0"), background: selectedListing?.id === l.id ? T + "08" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <div style={{ width: 48, height: 40, borderRadius: 8, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                    {l.cover_image && <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
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
            </div>
          )}
        </div>

        {/* Select plan */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Choose Duration <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 10 }}>
            {PLANS.map(p => (
              <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                style={{ padding: "16px 14px", borderRadius: 16, border: "2px solid " + (selectedPlan === p.id ? "#f59e0b" : "#e2e8f0"), background: selectedPlan === p.id ? "#f59e0b08" : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s", position: "relative" }}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50, whiteSpace: "nowrap" }}>BEST VALUE</div>
                )}
                <div style={{ fontSize: 16, fontWeight: 900, color: "#0d1f2d", marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#f59e0b", marginBottom: 4 }}>₦{p.amount.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>₦{Math.round(p.amount / p.days).toLocaleString()}/day</div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedListing && (
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
            {[
              ["Listing",  selectedListing.title],
              ["Duration", plan.label],
              ["Expires",  new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "#94a3b8" }}>{label}</span>
                <span style={{ color: "#0d1f2d", fontWeight: 700 }}>{value}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "#e2e8f0", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b" }}>₦{plan.amount.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button onClick={handlePay} disabled={!selectedListing || paying}
          style={{ width: "100%", padding: "15px", borderRadius: 14, background: !selectedListing || paying ? "#f59e0b70" : "#f59e0b", border: "none", color: "#fff", fontSize: 15, fontWeight: 900, cursor: !selectedListing || paying ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 54, transition: "all 0.2s", boxShadow: !selectedListing ? "none" : "0 6px 20px rgba(245,158,11,0.35)" }}>
          {paying
            ? <><Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing…</>
            : <><Sparkles size={18} /> Pay ₦{plan.amount.toLocaleString()} &amp; Boost Now</>}
        </button>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Shield size={12} /> Secured by Paystack · Auto-expires after {plan.label.toLowerCase()}
        </p>
      </div>
    </div>
  )
}

// ─── Verification Tab ─────────────────────────────────────────────────────────
function VerificationTab({ agent, user, verifRequest, onSubmit }) {
  const VERIFICATION_FEE = 4500

  const [step,       setStep]       = useState("info")
  const [paymentRef, setPaymentRef] = useState(null)
  const [form, setForm] = useState({
    fullName:   user?.full_name || "",
    idType:     "NIN (National ID)",
    idNumber:   "",
    phone:      user?.phone || "",
    experience: "",
    bio:        "",
    agreed:     false,
  })
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handlePay = () => {
    if (typeof window === "undefined" || !window.PaystackPop) {
      alert("Payment system not loaded. Please refresh the page and try again.")
      return
    }
    const handler = window.PaystackPop.setup({
      key:      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email:    user?.email || "agent@findwithhabi.com",
      amount:   VERIFICATION_FEE * 100,
      currency: "NGN",
      ref:      "verif_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      onClose:  () => {},
      callback: (response) => { setPaymentRef(response.reference); setStep("form") },
    })
    handler.openIframe()
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())  e.fullName   = "Full legal name is required"
    if (!form.idNumber.trim())  e.idNumber   = "ID number is required"
    if (!form.phone.trim())     e.phone      = "Phone number is required"
    if (!form.experience)       e.experience = "Years of experience is required"
    if (!form.bio.trim())       e.bio        = "Please write a short bio"
    if (!form.agreed)           e.agreed     = "You must agree to the terms"
    return e
  }

  const submitForm = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("verification_requests").insert({
      agent_id:   agent.id,
      user_id:    authUser.id,
      full_name:  form.fullName,
      id_type:    form.idType,
      id_number:  form.idNumber,
      phone:      form.phone,
      experience: parseInt(form.experience) || 0,
      bio:        form.bio,
      status:     "approved",
    })
    // Auto-verify the agent immediately after payment + form submission
    await supabase.from("agents").update({ is_verified: true }).eq("id", agent.id)
    // Send a notification to the agent
    await supabase.from("notifications").insert({
      recipient_id: authUser.id,
      type:         "feature",
      title:        "🎉 You are now Verified!",
      message:      "Your payment was confirmed and your profile is now verified. Your blue badge is now visible to all buyers.",
    })
    setSubmitting(false)
    setSubmitted(true)
    onSubmit()
  }

  if (agent?.is_verified) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10b98112", border: "3px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <BadgeCheck size={38} color="#10b981" />
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>You are Verified!</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Your profile has a blue verified badge visible to all buyers.</p>
        </div>
      </div>
    )
  }

  if (verifRequest?.status === "pending" && !submitted) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f59e0b12", border: "3px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock size={38} color="#f59e0b" />
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Application Submitted</h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Under review — we will verify your details within <strong>24–48 hours</strong>.</p>
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", textAlign: "left" }}>
            {[
              ["Full Name",  verifRequest.full_name],
              ["ID Type",    verifRequest.id_type],
              ["ID Number",  "••••" + verifRequest.id_number?.slice(-4)],
              ["Phone",      verifRequest.phone],
              ["Experience", verifRequest.experience + " years"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                <span style={{ color: "#0d1f2d", fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: T + "12", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.4s ease" }}>
            <CheckCircle size={38} color={T} />
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Application Sent!</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Payment confirmed and application submitted. We will review within 24–48 hours.</p>
        </div>
      </div>
    )
  }

  if (step === "info") {
    return (
      <div style={{ maxWidth: 620 }}>
        <div style={{ background: "linear-gradient(135deg," + DARK + " 0%," + T_DARK + " 100%)", borderRadius: 20, padding: "28px", marginBottom: 24, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 140, height: 140, borderRadius: "50%", background: T + "20", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: T + "30", border: "1.5px solid " + T + "60", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <BadgeCheck size={30} color={T} />
            </div>
            <div>
              <h2 style={{ margin: "0 0 5px", fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Get Verified</h2>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>One-time fee · Admin reviews within 24–48 hrs</p>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 160ms both" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Verification Fee</h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8" }}>Pay once to unlock your verified badge application.</p>
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            {[["Verification Processing Fee","₦4,000"],["Platform Service Charge","₦500"]].map(([label,value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{value}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "#e2e8f0", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: T }}>₦4,500</span>
            </div>
          </div>
          <button onClick={handlePay}
            style={{ width: "100%", padding: "15px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 54, boxShadow: "0 6px 20px " + T_GLOW }}>
            <BadgeCheck size={20} /> Pay ₦4,500 &amp; Continue
          </button>
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Shield size={12} /> Secured by Paystack · SSL encrypted
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ background: "#10b98110", border: "1.5px solid #10b98130", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, animation: "fadeUp 0.4s ease both" }}>
        <CheckCircle size={20} color="#10b981" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Payment Confirmed!</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Ref: {paymentRef} · Now complete your application below</div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.4s ease 80ms both" }}>
        <h3 style={{ margin: "0 0 22px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Your Verification Details</h3>
        <form onSubmit={submitForm} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Full Legal Name <span style={{ color: "#ef4444" }}>*</span></label>
            <input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="As it appears on your government ID"
              style={{ ...inputBase, borderColor: errors.fullName ? "#ef4444" : "#e2e8f0" }}
              onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = errors.fullName ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc" }}
            />
            {errors.fullName && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors.fullName}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="two-col">
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Government ID Type <span style={{ color: "#ef4444" }}>*</span></label>
              <select value={form.idType} onChange={e => update("idType", e.target.value)}
                style={{ ...inputBase, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 44, cursor: "pointer" }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}>
                {["NIN (National ID)", "Driver's License", "International Passport", "Voter's Card", "CAC (Business Reg.)"].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>ID Number <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.idNumber} onChange={e => update("idNumber", e.target.value)} placeholder="e.g. 12345678901"
                style={{ ...inputBase, borderColor: errors.idNumber ? "#ef4444" : "#e2e8f0" }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = errors.idNumber ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc" }}
              />
              {errors.idNumber && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors.idNumber}</p>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="two-col">
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Direct Phone Number <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+234 800 000 0000" type="tel"
                style={{ ...inputBase, borderColor: errors.phone ? "#ef4444" : "#e2e8f0" }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = errors.phone ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc" }}
              />
              {errors.phone && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors.phone}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Years of Experience <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.experience} onChange={e => update("experience", e.target.value)} placeholder="e.g. 5" type="number" min="0" max="50"
                style={{ ...inputBase, borderColor: errors.experience ? "#ef4444" : "#e2e8f0" }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = errors.experience ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc" }}
              />
              {errors.experience && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors.experience}</p>}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Professional Bio <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea value={form.bio} onChange={e => update("bio", e.target.value)} rows={4}
              placeholder="Tell us about your experience, areas you cover, and why buyers should trust you…"
              style={{ ...inputBase, resize: "vertical", minHeight: 100, borderColor: errors.bio ? "#ef4444" : "#e2e8f0" }}
              onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = errors.bio ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc" }}
            />
            {errors.bio && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{errors.bio}</p>}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Shield size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>Your ID details are encrypted and only visible to FindWithHabi admins. Never shared publicly.</p>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <div onClick={() => update("agreed", !form.agreed)}
                style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, background: form.agreed ? T : "transparent", border: "2px solid " + (form.agreed ? T : "#e2e8f0"), display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", cursor: "pointer" }}>
                {form.agreed && <Check size={12} color="#fff" />}
              </div>
              <span style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>I confirm all information is accurate and belongs to me. False information leads to permanent suspension.</span>
            </label>
            {errors.agreed && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5, paddingLeft: 30 }}><AlertCircle size={12} />{errors.agreed}</p>}
          </div>

          <button type="submit" disabled={submitting}
            style={{ padding: "14px", borderRadius: 14, background: submitting ? "#10b98170" : "#10b981", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52, transition: "all 0.25s", boxShadow: submitting ? "none" : "0 6px 20px rgba(16,185,129,0.3)" }}>
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
    { month: "Aug", views: 120, enquiries: 8  },
    { month: "Sep", views: 180, enquiries: 12 },
    { month: "Oct", views: 240, enquiries: 16 },
    { month: "Nov", views: 310, enquiries: 21 },
    { month: "Dec", views: 280, enquiries: 18 },
    { month: "Jan", views: totalViews || 400, enquiries: enquiries.length || 24 },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20, animation: "fadeUp 0.5s ease both" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
          Good day, {user?.full_name?.split(" ")[0] || "Agent"} 👋
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>Here is what is happening with your listings today.</p>
      </div>

      <VerificationBanner agent={agent} verifRequest={verifRequest} onApply={() => onNav("verification")} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Active Listings", value: activeListings,              icon: Building2,    color: T,        sub: pendingListings > 0 ? pendingListings + " pending" : "All live", delay: 0   },
          { label: "Total Enquiries", value: enquiries.length,            icon: MessageCircle,color: "#8b5cf6", sub: newEnquiries + " new",                                           delay: 80  },
          { label: "Total Views",     value: totalViews.toLocaleString(), icon: Eye,          color: "#f59e0b", sub: "across all listings",                                            delay: 160 },
          { label: "Rating",          value: agent?.rating > 0 ? agent.rating : "—", icon: Star, color: "#10b981", sub: agent?.total_reviews ? agent.total_reviews + " reviews" : "No reviews yet", delay: 240 },
        ].map(({ label, value, icon: Icon, color, sub, delay }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animation: "fadeUp 0.5s ease " + delay + "ms both" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: color + "18", border: "1px solid " + color + "30", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 3 }}>{sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 28 }} className="charts-grid">
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 320ms both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Monthly</div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Listing Views</h3>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: T }}>{totalViews.toLocaleString()}</div>
          </div>
          <MiniChart data={MONTHLY_DATA} metric="views" color={T} />
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 400ms both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#8b5cf6", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Monthly</div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Enquiries</h3>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#8b5cf6" }}>{enquiries.length}</div>
          </div>
          <MiniChart data={MONTHLY_DATA} metric="enquiries" color="#8b5cf6" />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", marginBottom: 28, animation: "fadeUp 0.5s ease 480ms both" }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Recent Enquiries</h3>
          <button onClick={() => onNav("enquiries")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: T, background: "none", border: "none", cursor: "pointer" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        {enquiries.length === 0
          ? <div style={{ padding: "32px 24px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No enquiries yet</div>
          : enquiries.slice(0, 3).map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 24px", borderTop: "1px solid #f8fafc" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: T, flexShrink: 0 }}>
                {(e.sender_name || e.users?.full_name || "?").charAt(0)}
              </div>
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
          <button onClick={() => onNav("listings")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: T, background: "none", border: "none", cursor: "pointer" }}>
            Manage <ChevronRight size={14} />
          </button>
        </div>
        {listings.length === 0
          ? <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 16px" }}>No listings yet</p>
              <Link href="/dashboard/agent/add-listing" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
                <Plus size={14} /> Add Your First Listing
              </Link>
            </div>
          : listings.slice(0, 3).map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 24px", borderTop: "1px solid #f8fafc" }}>
              <div style={{ width: 52, height: 44, borderRadius: 10, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                {l.cover_image && <img src={l.cover_image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
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

// ─── Listings Tab ─────────────────────────────────────────────────────────────
function Listings({ listings, loading, onRefresh }) {
  const [filter,   setFilter]   = useState("all")
  const [search,   setSearch]   = useState("")
  const [menuOpen, setMenuOpen] = useState(null)

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
          <button onClick={onRefresh} style={{ width: 34, height: 34, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Refresh">
            <RefreshCw size={15} color="#64748b" />
          </button>
        </div>
        <Link href="/dashboard/agent/add-listing"
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 12, background: T, color: "#fff", fontSize: 14, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 16px " + T_GLOW, minHeight: 44 }}>
          <Plus size={16} /> Add New Listing
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, gap: 2 }}>
          {["all","active","pending","sold","rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#64748b", boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", textTransform: "capitalize" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
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
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Building2 size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: "0 0 8px", color: "#0d1f2d", fontSize: 18, fontWeight: 800 }}>{listings.length === 0 ? "No listings yet" : "No listings found"}</h3>
          <p style={{ color: "#94a3b8", margin: "0 0 20px" }}>{listings.length === 0 ? "Add your first property to get started" : "Try a different filter"}</p>
          {listings.length === 0 && (
            <Link href="/dashboard/agent/add-listing" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
              <Plus size={15} /> Add Listing
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((l, i) => (
            <div key={l.id} style={{ background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", animation: "fadeUp 0.4s ease " + (i * 60) + "ms both", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ position: "relative", width: "clamp(100px,25%,180px)", flexShrink: 0 }}>
                {l.cover_image
                  ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 120 }} />
                  : <div style={{ width: "100%", minHeight: 120, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={28} color="#cbd5e1" /></div>}
                <div style={{ position: "absolute", top: 8, left: 8 }}><StatusBadge status={l.status} /></div>
                {l.is_featured && (
                  <div style={{ position: "absolute", top: 8, right: 8, background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>✦ Boost</div>
                )}
              </div>
              <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0d1f2d", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                        <MapPin size={11} color={T} />
                        <span style={{ fontSize: 12, color: "#64748b" }}>{l.city}, {l.state}</span>
                      </div>
                    </div>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button onClick={() => setMenuOpen(menuOpen === l.id ? null : l.id)}
                        style={{ width: 34, height: 34, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <MoreHorizontal size={15} color="#64748b" />
                      </button>
                      {menuOpen === l.id && (
                        <>
                          <div onClick={() => setMenuOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                          <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 20, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 160 }}>
                            {[
                              { icon: Eye,    label: "View",   color: "#0d1f2d", action: () => { setMenuOpen(null); window.open("/listings/" + l.id, "_blank") } },
                              { icon: Trash2, label: "Delete", color: "#ef4444", action: () => { setMenuOpen(null); handleDelete(l.id) } },
                            ].map(({ icon: Icon, label, color, action }) => (
                              <button key={label} onClick={action}
                                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", border: "none", background: "#fff", color, fontSize: 14, fontWeight: 600, cursor: "pointer", borderBottom: label !== "Delete" ? "1px solid #f8fafc" : "none" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc" }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff" }}>
                                <Icon size={15} /> {label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {l.beds > 0 && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}><Bed size={12} color="#cbd5e1" />{l.beds} Beds</span>}
                    {l.baths > 0 && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}><Bath size={12} color="#cbd5e1" />{l.baths} Baths</span>}
                    {l.sqft && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}><Maximize2 size={12} color="#cbd5e1" />{Number(l.sqft).toLocaleString()} sqft</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: T, letterSpacing: "-0.02em" }}>{l.price_label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Eye size={13} color="#94a3b8" />
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{(l.views || 0).toLocaleString()} views · {(l.saves || 0)} saves</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Enquiries Tab ────────────────────────────────────────────────────────────
function Enquiries({ enquiries, loading, onRefresh }) {
  const [filter,   setFilter]   = useState("all")
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [reply,    setReply]    = useState("")
  const [sending,  setSending]  = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const bottomRef = useRef(null)

  const filtered = enquiries.filter(e => filter === "all" || e.status === filter)
  const active   = selected ? enquiries.find(e => e.id === selected) : null

  // Load thread messages when enquiry selected
  useEffect(() => {
    if (!selected) return
    setLoadingMsgs(true)
    supabase.from("enquiry_messages").select("*")
      .eq("enquiry_id", selected)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(data || [])
        setLoadingMsgs(false)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
      })
  }, [selected, sending])

  const sendReply = async () => {
    if (!reply.trim() || !active) return
    setSending(true)
    // Insert new message
    await supabase.from("enquiry_messages").insert({
      enquiry_id: active.id,
      sender:     "agent",
      message:    reply.trim(),
    })
    // Update enquiry status
    await supabase.from("enquiries").update({ status: "replied", agent_reply: reply.trim(), replied_at: new Date().toISOString() }).eq("id", active.id)
    setReply("")
    setSending(false)
    onRefresh()
  }

  const statusConfig = {
    new:     { bg: "#ef444412", color: "#ef4444", label: "New"     },
    replied: { bg: "#10b98112", color: "#059669", label: "Replied" },
    closed:  { bg: "#94a3b812", color: "#94a3b8", label: "Closed"  },
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>Enquiries ({enquiries.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="enquiry-layout">
        {/* List panel */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #f8fafc" }}>
            <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 3, gap: 2 }}>
              {["all","new","replied","closed"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#fff" : "transparent", color: filter === f ? "#0d1f2d" : "#94a3b8", boxShadow: filter === f ? "0 1px 6px rgba(0,0,0,0.07)" : "none", transition: "all 0.2s", textTransform: "capitalize" }}>
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {loading ? <LoadingCard /> : filtered.length === 0
            ? <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No enquiries yet</div>
            : <div style={{ overflowY: "auto", maxHeight: 520 }}>
                {filtered.map(e => {
                  const sc = statusConfig[e.status] || statusConfig.new
                  const isActive = selected === e.id
                  return (
                    <button key={e.id} onClick={() => setSelected(e.id)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", border: "none", background: isActive ? T + "08" : "#fff", cursor: "pointer", width: "100%", textAlign: "left", borderBottom: "1px solid #f8fafc", transition: "background 0.15s", borderLeft: isActive ? "3px solid " + T : "3px solid transparent" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: T, flexShrink: 0 }}>
                        {(e.sender_name || e.users?.full_name || "?").charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d" }}>{e.sender_name || e.users?.full_name || "Anonymous"}</span>
                          <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 3 }}>{e.listings?.title || "Property"}</div>
                        <p style={{ margin: 0, fontSize: 12, color: "#64748b", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", lineHeight: 1.4 }}>{e.message}</p>
                        <div style={{ marginTop: 6 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 50, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 800 }}>{sc.label}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>}
        </div>

        {/* Chat panel */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 480 }}>
          {active ? (
            <>
              {/* Header */}
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f8fafc", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: T + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: T, flexShrink: 0 }}>
                    {(active.sender_name || active.users?.full_name || "?").charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>{active.sender_name || active.users?.full_name || "Anonymous"}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{active.listings?.title || "General enquiry"}</div>
                  </div>
                </div>
                {(active.sender_phone || active.users?.phone) && (
                  <a href={"tel:" + (active.sender_phone || active.users?.phone)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 10, background: T, color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>
                    <Phone size={13} /> {active.sender_phone || active.users?.phone}
                  </a>
                )}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
                {loadingMsgs ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                    <Loader size={20} color={T} style={{ animation: "spin 1s linear infinite" }} />
                  </div>
                ) : messages.length === 0 ? (
                  // Fallback: show original message if no thread messages yet
                  <div style={{ background: "#f8fafc", borderRadius: "16px 16px 16px 4px", padding: "14px 18px", maxWidth: "85%", alignSelf: "flex-start" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{active.message}</p>
                    <span style={{ fontSize: 11, color: "#94a3b8", display: "block", marginTop: 6 }}>{new Date(active.created_at).toLocaleDateString()}</span>
                  </div>
                ) : messages.map((msg, i) => {
                  const isAgent = msg.sender === "agent"
                  return (
                    <div key={msg.id} style={{ display: "flex", justifyContent: isAgent ? "flex-end" : "flex-start" }}>
                      <div style={{ background: isAgent ? T : "#f8fafc", borderRadius: isAgent ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "12px 16px", maxWidth: "80%" }}>
                        <p style={{ margin: 0, fontSize: 14, color: isAgent ? "#fff" : "#374151", lineHeight: 1.6 }}>{msg.message}</p>
                        <span style={{ fontSize: 10, color: isAgent ? "rgba(255,255,255,0.6)" : "#94a3b8", display: "block", marginTop: 5 }}>
                          {new Date(msg.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply input - always visible for ongoing conversation */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid #f8fafc", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                    placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
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
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", color: "#94a3b8" }}>
              <MessageCircle size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Select an enquiry to view and reply</p>
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
            ? <img src={user.avatar_url} alt={user.full_name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid " + T, flexShrink: 0 }} />
            : <div style={{ width: 72, height: 72, borderRadius: "50%", background: T + "30", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: T, flexShrink: 0 }}>{user?.full_name?.charAt(0) || "A"}</div>}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(18px,3vw,24px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{user?.full_name}</h2>
              {agent?.is_verified && <BadgeCheck size={20} color="#10b981" />}
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Property Agent · {user?.state || "Nigeria"}</p>
          </div>
          <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{agent?.rating > 0 ? agent.rating : "—"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Rating</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{agent?.total_deals || 0}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Deals</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 14 }}>
        {[
          { label: "Active Listings", value: activeListings,             color: T,        icon: Building2  },
          { label: "Total Views",     value: totalViews.toLocaleString(), color: "#f59e0b",icon: Eye        },
          { label: "Total Listings",  value: listings.length,            color: "#8b5cf6", icon: Activity   },
          { label: "Verified",        value: agent?.is_verified ? "Yes" : "Pending", color: "#10b981", icon: BadgeCheck },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "20px", border: "1px solid #f1f5f9", animation: "fadeUp 0.4s ease " + (i * 70) + "ms both" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function AgentSettings({ user, onUpdate }) {
  const [name,         setName]         = useState(user?.full_name || "")
  const [phone,        setPhone]        = useState(user?.phone || "")
  const [city,         setCity]         = useState(user?.city || "")
  const [saved,        setSaved]        = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [avatarUrl,    setAvatarUrl]    = useState(user?.avatar_url || null)
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
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true, cacheControl: "3600" })
    if (error) { setImgError("Upload failed: " + error.message); setUploadingImg(false); return }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(data.path)
    await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", authUser.id)
    setAvatarUrl(publicUrl + "?t=" + Date.now())
    setUploadingImg(false)
    onUpdate()
    e.target.value = ""
  }

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
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease both" }}>
        <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Profile Settings</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #f8fafc" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid " + T }} />
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
    </div>
  )
}


// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab({ agent, user }) {
  const REPORT_TYPES = [
    { value: "listing", label: "Listing Issue",    icon: "🏠" },
    { value: "agent",   label: "Agent Complaint",  icon: "👤" },
    { value: "bug",     label: "Bug / Technical",  icon: "🐛" },
    { value: "other",   label: "Other",            icon: "📋" },
  ]

  const [form, setForm] = useState({
    type:        "bug",
    subject:     "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState("")

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.subject.trim())     { setError("Please enter a subject."); return }
    if (!form.description.trim()) { setError("Please describe the issue."); return }
    setError("")
    setSubmitting(true)

    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from("reports").insert({
      reporter_id:  authUser.id,
      type:         form.type,
      subject:      form.subject,
      description:  form.description,
      agent_id:     agent?.id || null,
      status:       "new",
    })

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", border: "1px solid #f1f5f9", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10b98112", border: "3px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.4s ease" }}>
            <CheckCircle size={38} color="#10b981" />
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Report Submitted!</h2>
          <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
            Thank you for letting us know. Our admin team will review your report and get back to you if needed.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ type: "bug", subject: "", description: "" }) }}
            style={{ padding: "12px 28px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Submit Another Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 620 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#7f1d1d 0%,#dc2626 100%)", borderRadius: 20, padding: "26px", marginBottom: 24, position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Flag size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: "0 0 5px", fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Report an Issue</h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Report a bug, listing problem, or agent complaint to our admin team.</p>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", animation: "fadeUp 0.5s ease 80ms both" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Type */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Report Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
              {REPORT_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => update("type", t.value)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, border: "1.5px solid " + (form.type === t.value ? "#ef4444" : "#e2e8f0"), background: form.type === t.value ? "#ef444408" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: form.type === t.value ? "#ef4444" : "#64748b" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Subject <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={form.subject} onChange={e => update("subject", e.target.value)}
              placeholder="Brief summary of the issue"
              style={{ ...inputBase }}
              onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)}
              rows={5} placeholder="Describe the issue in detail — what happened, when, and what you expected…"
              style={{ ...inputBase, resize: "vertical", minHeight: 120 }}
              onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
            />
          </div>

          {/* Reporter info */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
              Submitted as <strong style={{ color: "#64748b" }}>{user?.full_name || "Agent"}</strong> · {user?.email} · Admin will review privately.
            </p>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5" }}>
              <AlertCircle size={14} color="#ef4444" />
              <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting}
            style={{ padding: "14px", borderRadius: 14, background: submitting ? "#ef444470" : "#ef4444", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52, transition: "all 0.25s", boxShadow: submitting ? "none" : "0 6px 20px rgba(239,68,68,0.3)" }}>
            {submitting
              ? <><Loader size={17} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
              : <><Flag size={17} /> Submit Report</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AgentDashboard() {
  const router = useRouter()
  const [tab,          setTab]          = useState("overview")
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [user,         setUser]         = useState(null)
  const [agent,        setAgent]        = useState(null)
  const [listings,     setListings]     = useState([])
  const [enquiries,    setEnquiries]    = useState([])
  const [verifRequest, setVerifRequest] = useState(null)
  const [loading,      setLoading]      = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) { router.push("/auth"); return }

    const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
    setUser(userData)

    const { data: agentData } = await supabase.from("agents").select("*").eq("user_id", authUser.id).single()
    setAgent(agentData)

    if (!agentData) { setLoading(false); return }

    const { data: listingsData } = await supabase.from("listings").select("*").eq("agent_id", agentData.id).order("created_at", { ascending: false })
    if (listingsData && listingsData.length > 0) {
      const ids = listingsData.map(l => l.id)
      const { data: imagesData } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
      const formatted = listingsData.map(l => {
        const imgs  = imagesData ? imagesData.filter(i => i.listing_id === l.id) : []
        const cover = imgs.find(i => i.is_cover)?.url || imgs[0]?.url || null
        return { ...l, cover_image: cover }
      })
      setListings(formatted)
    } else {
      setListings([])
    }

    const { data: enquiriesData } = await supabase
      .from("enquiries")
      .select("*, listings(title), users(full_name, phone)")
      .eq("agent_id", agentData.id)
      .order("created_at", { ascending: false })
    setEnquiries(enquiriesData || [])

    const { data: verifData } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("agent_id", agentData.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    setVerifRequest(verifData)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const fn = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const titles = {
    overview:     "Overview",
    listings:     "My Listings",
    enquiries:    "Enquiries",
    featured:     "Boost Listing",
    verification: "Get Verified",
    performance:  "Performance",
    settings:     "Settings",
    report:       "Report an Issue",
  }

  const renderTab = () => {
    if (loading) return <LoadingCard />
    if (tab === "overview")     return <Overview user={user} agent={agent} listings={listings} enquiries={enquiries} verifRequest={verifRequest} onNav={setTab} />
    if (tab === "listings")     return <Listings listings={listings} loading={loading} onRefresh={fetchData} />
    if (tab === "enquiries")    return <Enquiries enquiries={enquiries} loading={loading} onRefresh={fetchData} />
    if (tab === "featured")     return <FeatureListingTab agent={agent} user={user} listings={listings} onRefresh={fetchData} />
    if (tab === "verification") return <VerificationTab agent={agent} user={user} verifRequest={verifRequest} onSubmit={fetchData} />
    if (tab === "performance")  return <Performance agent={agent} user={user} listings={listings} />
    if (tab === "settings")     return <AgentSettings user={user} onUpdate={fetchData} />
    if (tab === "report")       return <ReportTab agent={agent} user={user} />
    return null
  }

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex" }}>
      <script src="https://js.paystack.co/v1/inline.js" async />
      <Sidebar active={tab} onNav={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} agent={agent} user={user} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="main-area">
        <Topbar title={titles[tab]} onMenuOpen={() => setSidebarOpen(true)} userId={user?.id} />
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
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        .sidebar-close { display: flex !important; }
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .sidebar-close { display: none !important; }
          .main-area { margin-left: 260px !important; }
          .menu-btn { display: none !important; }
          .main-container { padding: 28px 32px 64px !important; }
          .charts-grid { grid-template-columns: 1fr 1fr !important; }
          .enquiry-layout { grid-template-columns: 340px 1fr !important; }
          .two-col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 768px) {
          .main-container { padding: 24px 24px 48px !important; }
          .enquiry-layout { grid-template-columns: 300px 1fr !important; }
          .two-col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}