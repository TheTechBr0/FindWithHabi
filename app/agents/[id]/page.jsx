"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, MapPin, Phone, Star, BadgeCheck, Shield,
  Building2, Eye, Heart, MessageCircle, Share2,
  Bed, Bath, Maximize2, CheckCircle, Send, Loader,
  Calendar, TrendingUp, X, Check,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled,  setScrolled]  = useState(false)
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
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? "rgba(8,15,20,0.97)" : "rgba(8,15,20,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 64, width: "auto", objectFit: "contain" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/agents" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            <ArrowLeft size={14} /> All Agents
          </Link>
          {authReady && (
            authUser
              ? <Link href={dashboardLink} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                  My Dashboard
                </Link>
              : <Link href="/auth" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 50, background: T, color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                  Login / Sign Up
                </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRow({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} color="#f59e0b" fill={i <= Math.round(rating) ? "#f59e0b" : "none"} />
      ))}
    </div>
  )
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ listing, i }) {
  return (
    <Link href={"/listings/" + listing.id} style={{ textDecoration: "none", display: "block", background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s", animation: "fadeUp 0.4s ease " + (i * 60) + "ms both" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ position: "relative", height: 180, background: "#f1f5f9", overflow: "hidden" }}>
        {listing.cover_image
          ? <img src={listing.cover_image} alt={listing.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={36} color="#cbd5e1" /></div>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
        {listing.is_featured && <span style={{ position: "absolute", top: 10, left: 10, background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 50 }}>✦ Featured</span>}
        <span style={{ position: "absolute", bottom: 10, left: 10, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>{listing.listing_type || "Buy"}</span>
        <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.5)", borderRadius: 50, padding: "3px 8px" }}>
          <Eye size={10} color="#fff" />
          <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>{listing.views || 0}</span>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <MapPin size={11} color={T} />
          <span style={{ fontSize: 12, color: "#64748b" }}>{listing.city}, {listing.state}</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          {listing.beds  > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bed  size={10} color="#94a3b8" />{listing.beds}bd</span>}
          {listing.baths > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Bath size={10} color="#94a3b8" />{listing.baths}ba</span>}
          {listing.sqft  &&     <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}><Maximize2 size={10} color="#94a3b8" />{Number(listing.sqft).toLocaleString()}</span>}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: T }}>{listing.price_label}</div>
      </div>
    </Link>
  )
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm({ agent, authUser, userData }) {
  const router = useRouter()
  const [message,  setMessage]  = useState("Hello " + (agent?.users?.full_name?.split(" ")[0] || "Agent") + ", I found your profile on FindWithHabi and I am interested in your services.")
  const [phone,    setPhone]    = useState(userData?.phone || "")
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState("")

  const submit = async (e) => {
    e.preventDefault()
    if (!authUser) { router.push("/auth"); return }
    if (!message.trim()) { setError("Please enter a message."); return }
    setError("")
    setSending(true)

    // Insert enquiry without listing_id (general agent contact)
    await supabase.from("enquiries").insert({
      agent_id:     agent.id,
      user_id:      authUser.id,
      sender_name:  userData?.full_name || authUser.email,
      sender_email: userData?.email     || authUser.email,
      sender_phone: phone || userData?.phone || "",
      message,
      status:       "new",
    })

    setSending(false)
    setSent(true)
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "28px 0" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T + "12", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Check size={24} color={T} />
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Message Sent!</h3>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{agent?.users?.full_name?.split(" ")[0]} will reply soon. Check your dashboard.</p>
      </div>
    )
  }

  if (!authUser) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <MessageCircle size={36} color={T} style={{ marginBottom: 12 }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Login to Contact Agent</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>Create a free account to message this agent.</p>
        <Link href="/auth" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px 24px", borderRadius: 12, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800, boxShadow: "0 6px 20px " + T_GLOW }}>
          Login / Sign Up — Free
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Logged in user chip */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: T + "08", border: "1px solid " + T + "20" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
          {(userData?.full_name || authUser.email)?.charAt(0)?.toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{userData?.full_name || "User"}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{userData?.email || authUser.email}</div>
        </div>
      </div>
      {error && <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444", fontSize: 13 }}>{error}</div>}
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number (optional)" type="tel"
        style={inputStyle}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
      />
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
        style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
      />
      <button type="submit" disabled={sending}
        style={{ padding: "13px", borderRadius: 12, background: sending ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, boxShadow: "0 6px 20px " + T_GLOW, transition: "background 0.2s" }}>
        {sending ? <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={15} /> Send Message</>}
      </button>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AgentProfilePage() {
  const params  = useParams()
  const router  = useRouter()
  const agentId = params?.id

  const [agent,    setAgent]    = useState(null)
  const [listings, setListings] = useState([])
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [myRating,    setMyRating]    = useState(0)
  const [myHover,     setMyHover]     = useState(0)
  const [myComment,   setMyComment]   = useState("")
  const [submitting,  setSubmitting]  = useState(false)
  const [reviewSent,  setReviewSent]  = useState(false)
  const [myReview,    setMyReview]    = useState(null)

  useEffect(() => {
    if (!agentId) return

    const init = async () => {
      // Auth
      const { data: { user } } = await supabase.auth.getUser()
      setAuthUser(user)
      if (user) {
        const { data: ud } = await supabase.from("users").select("full_name, email, phone").eq("id", user.id).single()
        setUserData(ud)
      }

      // Agent
      const { data: agentData, error } = await supabase
        .from("agents")
        .select("*, users(full_name, email, phone, avatar_url, city, state, created_at)")
        .eq("id", agentId)
        .single()

      if (error || !agentData) { setNotFound(true); setLoading(false); return }
      setAgent(agentData)

      // Listings
      const { data: listingsData } = await supabase
        .from("listings")
        .select("*")
        .eq("agent_id", agentId)
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })

      if (listingsData && listingsData.length > 0) {
        const ids = listingsData.map(l => l.id)
        const { data: imgs } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", ids)
        setListings(listingsData.map(l => {
          const li    = imgs ? imgs.filter(i => i.listing_id === l.id) : []
          const cover = li.find(i => i.is_cover)?.url || li[0]?.url || null
          return { ...l, cover_image: cover }
        }))
      }

      // Reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*, users(full_name)")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false })
      setReviews(reviewsData || [])

      if (user && reviewsData) {
        const mine = reviewsData.find(r => r.user_id === user.id)
        if (mine) { setMyReview(mine); setMyRating(mine.rating); setMyComment(mine.comment || "") }
      }

      setLoading(false)
    }

    init()
  }, [agentId, reviewSent])

  const submitReview = async (e) => {
    e.preventDefault()
    if (!authUser) { router.push("/auth"); return }
    if (myRating === 0) return
    setSubmitting(true)
    await supabase.from("reviews").upsert({
      agent_id: agentId, user_id: authUser.id,
      rating: myRating, comment: myComment.trim(),
    }, { onConflict: "agent_id,user_id" })
    await supabase.rpc("update_agent_rating", { p_agent_id: agentId })
    setSubmitting(false)
    setReviewSent(p => !p)
  }

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0)

  if (loading) {
    return (
      <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Loader size={32} color={T} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14, color: "#94a3b8" }}>Loading agent profile…</span>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <Building2 size={48} color="#cbd5e1" />
        <h2 style={{ margin: 0, color: "#0d1f2d", fontSize: 22, fontWeight: 900 }}>Agent not found</h2>
        <Link href="/agents" style={{ padding: "10px 24px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>Browse Agents</Link>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const agentName  = agent?.users?.full_name || "Agent"
  const agentPhone = agent?.users?.phone     || ""
  const agentCity     = agent?.users?.city  || ""
  const agentState    = agent?.users?.state || ""
  const agentLocation = agentCity && agentState ? agentCity + ", " + agentState
                      : agentCity || agentState || "Nigeria"

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <NavBar />

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${T_DARK} 100%)`, paddingTop: 80, paddingBottom: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: T + "15", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "30%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px 0", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap", paddingBottom: 32 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {agent?.users?.avatar_url
                ? <img src={agent.users.avatar_url} alt={agentName} style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "4px solid " + T, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }} />
                : <div style={{ width: 100, height: 100, borderRadius: "50%", background: T + "30", border: "4px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: T, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                    {agentName.charAt(0)}
                  </div>}
              {agent?.is_verified && (
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 28, height: 28, borderRadius: "50%", background: "#10b981", border: "3px solid " + DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BadgeCheck size={14} color="#fff" />
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{agentName}</h1>
                {agent?.is_verified && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 50, background: "#10b98120", border: "1px solid #10b98140" }}>
                    <BadgeCheck size={12} color="#10b981" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Verified Agent</span>
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                {agentCity && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={13} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{agentLocation}</span>
                  </div>
                )}
                {agent?.users?.created_at && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Calendar size={13} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                      Member since {new Date(agent.users.created_at).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
              {avg && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <StarRow rating={parseFloat(avg)} size={16} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{avg}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingBottom: 4 }}>
              {agentPhone && (
                <a href={"tel:" + agentPhone}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 16px " + T_GLOW }}>
                  <Phone size={14} /> Call
                </a>
              )}
              {agentPhone && (
                <a href={"https://wa.me/" + agentPhone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello " + agentName + ", I found your profile on FindWithHabi and I would like to speak with you.")}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 50, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
                  WhatsApp
                </a>
              )}
              <button onClick={() => { navigator.share?.({ title: agentName + " — FindWithHabi", url: window.location.href }) || navigator.clipboard?.writeText(window.location.href) }}
                style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Share2 size={16} color="#fff" />
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: "14px 14px 0 0", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}>
            {[
              { label: "Active Listings", value: listings.length },
              { label: "Total Views",     value: totalViews.toLocaleString() },
              { label: "Rating",          value: avg || "New" },
              { label: "Total Reviews",   value: reviews.length },
            ].map(({ label, value }, i) => (
              <div key={i} style={{ flex: 1, padding: "14px 16px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontSize: "clamp(16px,3vw,22px)", fontWeight: 900, color: "#fff" }}>{value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="profile-layout">

          {/* Left — Listings + Reviews */}
          <div>
            {/* Listings */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Active Listings ({listings.length})</h2>
              </div>
              {listings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9" }}>
                  <Building2 size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
                  <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>No active listings at this time</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 16 }}>
                  {listings.map((l, i) => <ListingCard key={l.id} listing={l} i={i} />)}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Reviews</h2>
                {avg && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StarRow rating={parseFloat(avg)} size={14} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{avg}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>({reviews.length})</span>
                  </div>
                )}
              </div>

              {/* Write review */}
              <div style={{ background: "#fff", borderRadius: 18, padding: "22px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>
                  {myReview ? "Update Your Review" : "Rate This Agent"}
                </h3>
                {authUser ? (
                  <form onSubmit={submitReview} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {[1,2,3,4,5].map(i => (
                        <button key={i} type="button"
                          onClick={() => setMyRating(i)}
                          onMouseEnter={() => setMyHover(i)}
                          onMouseLeave={() => setMyHover(0)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                          <Star size={30} color="#f59e0b" fill={(myHover || myRating) >= i ? "#f59e0b" : "none"} style={{ transition: "fill 0.1s" }} />
                        </button>
                      ))}
                      {myRating > 0 && <span style={{ fontSize: 13, color: "#64748b", marginLeft: 6 }}>
                        {["","Poor","Fair","Good","Very Good","Excellent"][myRating]}
                      </span>}
                    </div>
                    <textarea value={myComment} onChange={e => setMyComment(e.target.value)} rows={3}
                      placeholder="Share your experience (optional)…"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "vertical", background: "#f8fafc", boxSizing: "border-box" }}
                      onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
                    />
                    <button type="submit" disabled={submitting || myRating === 0}
                      style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 12, background: myRating === 0 ? T + "60" : T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: myRating === 0 ? "not-allowed" : "pointer", boxShadow: myRating > 0 ? "0 4px 14px " + T_GLOW : "none" }}>
                      {submitting ? "Submitting…" : myReview ? "Update Review" : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Login to rate and review this agent</span>
                    <Link href="/auth" style={{ padding: "8px 18px", borderRadius: 50, background: T, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Login</Link>
                  </div>
                )}
              </div>

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 18, border: "1px solid #f1f5f9" }}>
                  <Star size={36} color="#e2e8f0" style={{ marginBottom: 10 }} />
                  <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>No reviews yet — be the first!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {reviews.map((r, i) => (
                    <div key={r.id} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden", animation: "fadeUp 0.4s ease " + (i * 50) + "ms both" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, " + T + ", transparent)" }} />
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", background: T + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: T, flexShrink: 0 }}>
                            {(r.users?.full_name || "U").charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{r.users?.full_name || "User"}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
                          </div>
                        </div>
                        <StarRow rating={r.rating} size={13} />
                      </div>
                      {r.comment && <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Contact + Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Contact card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Send a Message</h3>
              <ContactForm agent={agent} authUser={authUser} userData={userData} />
            </div>

            {/* Agent info card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Agent Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Verification", value: agent?.is_verified ? "✓ Verified Agent" : "Unverified", color: agent?.is_verified ? "#10b981" : "#94a3b8" },
                  { label: "Location",     value: agentLocation },
                  { label: "Listings",     value: listings.length + " active" },
                  { label: "Rating",       value: avg ? avg + " / 5.0" : "No reviews yet" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 10, background: "#f8fafc" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: color || "#0d1f2d", fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div style={{ background: DARK, borderRadius: 18, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Shield size={18} color={T} />
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>FindWithHabi Guarantee</span>
              </div>
              {[
                "All agents verified by our team",
                "Listings checked for authenticity",
                "Safe and secure enquiries",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                  <CheckCircle size={13} color="#10b981" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
        @media (min-width: 900px) {
          .profile-layout { grid-template-columns: 1fr 360px !important; align-items: start; }
        }
      `}</style>
    </div>
  )
}