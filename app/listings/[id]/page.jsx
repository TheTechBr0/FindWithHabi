"use client"

import { useToast } from "@/components/Toast"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Heart,
  Phone, MessageCircle, CheckCircle, Star, Shield,
  Eye, Share2, ChevronLeft, ChevronRight, Loader, Flag, Copy,
  Calendar, Home, Building2, BadgeCheck, Send, Check,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

// ─── Smart Back Button ────────────────────────────────────────────────────────
function BackButton({ userRole, authReady }) {
  const router = useRouter()

  const handleBack = () => {
    const prevPath = sessionStorage.getItem("fwh_prev_path") || ""

    // If user came from dashboard browse tab — go directly there
    if (prevPath === "/dashboard/user/listings") {
      sessionStorage.removeItem("fwh_prev_path")
      router.push("/dashboard/user?tab=listings")
      return
    }
    // If user came from listings page — go back (scroll position restored)
    if (prevPath === "/listings") {
      sessionStorage.removeItem("fwh_prev_path")
      router.back()
      return
    }
    // Browser history fallback
    if (window.history.length > 2) {
      router.back()
      return
    }
    // No history — fallback by role
    if (authReady && userRole === "agent") { router.push("/dashboard/agent"); return }
    if (authReady && userRole === "admin") { router.push("/dashboard/admin"); return }
    router.push("/listings")
  }

  return (
    <button onClick={handleBack}
      style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, background: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
      <ArrowLeft size={13} /> Back
    </button>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [authUser,  setAuthUser]  = useState(null)
  const [userRole,  setUserRole]  = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    // getSession is instant (reads from storage) — fixes mobile delay
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null
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
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 12px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 52, width: "auto", objectFit: "contain" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BackButton userRole={userRole} authReady={authReady} />
          {authReady && (
            authUser
              ? <Link href={dashboardLink} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
                  Dashboard
                </Link>
              : <Link href="/auth" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 50, background: T, color: "#fff", fontSize: 12, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
                  Login
                </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Image Gallery with Lightbox ──────────────────────────────────────────────
function Gallery({ images }) {
  const [current,   setCurrent]   = useState(0)
  const [lightbox,  setLightbox]  = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "Escape")     setLightbox(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, current])

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  if (!images || images.length === 0) {
    return (
      <div style={{ height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, marginBottom: 16 }}>
        <Building2 size={48} color="#cbd5e1" />
      </div>
    )
  }

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  // Touch swipe handlers for lightbox
  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const onTouchEnd   = (e) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  return (
    <>
    <div style={{ marginBottom: 16 }}>
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ height: "clamp(260px,60vw,520px)", background: DARK, cursor: "zoom-in" }}
          onClick={() => setLightbox(true)} title="Click to view fullscreen">
          <img src={images[current].url} alt={"Property photo " + (current + 1)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
          {/* View all photos badge */}
          <div style={{ position: "absolute", bottom: 50, right: 12, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 5, pointerEvents: "none" }}>
            <Eye size={12} /> View all {images.length} photos
          </div>
        </div>
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ChevronLeft size={18} color="#fff" />
            </button>
            <button onClick={next} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ChevronRight size={18} color="#fff" />
            </button>
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  style={{ width: i === current ? 18 : 7, height: 7, borderRadius: 50, background: i === current ? "#fff" : "rgba(255,255,255,0.45)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }} />
              ))}
            </div>
            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 50 }}>
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 7, marginTop: 8, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: 68, height: 52, flexShrink: 0, borderRadius: 10, overflow: "hidden", border: "2.5px solid " + (i === current ? T : "transparent"), cursor: "pointer", padding: 0, transition: "border-color 0.2s" }}>
              <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>

    {/* ── Lightbox ── */}
    {lightbox && (
      <div
        style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)", zIndex: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700 }}>
            {current + 1} / {images.length}
          </span>
          <button onClick={() => setLightbox(false)}
            style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            ✕
          </button>
        </div>

        {/* Main image */}
        <img
          src={images[current].url}
          alt={"Photo " + (current + 1)}
          style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", userSelect: "none" }}
        />

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button onClick={prev}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              <ChevronLeft size={22} color="#fff" />
            </button>
            <button onClick={next}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              <ChevronRight size={22} color="#fff" />
            </button>
          </>
        )}

        {/* Bottom thumbnail strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: 54, height: 40, flexShrink: 0, borderRadius: 8, overflow: "hidden", border: i === current ? "2px solid #0097B2" : "2px solid rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, transition: "border-color 0.2s", opacity: i === current ? 1 : 0.6 }}>
              <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>
    )}
    </>
  )
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────
function EnquiryForm({ listing, agent }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [authUser, setAuthUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [message,  setMessage]  = useState("Hello, I am interested in " + (listing?.title || "this property") + ". Please get in touch with me.")
  const [phone,    setPhone]    = useState("")
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState("")
  const [checked,  setChecked]  = useState(false)

  useEffect(() => {
    // getSession is instant — fixes "Login to Contact" flash on mobile
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null
      setAuthUser(user)
      if (user) {
        supabase.from("users").select("full_name, email, phone").eq("id", user.id).single()
          .then(({ data }) => { setUserData(data); if (data?.phone) setPhone(data.phone) })
      }
      setChecked(true)
    })
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!authUser) { router.push("/auth"); return }
    if (!message.trim()) { setError("Please enter a message."); return }
    setError(""); setSending(true)
    const { data: enquiryInserted, error: err } = await supabase.from("enquiries").insert({
      listing_id: listing.id, agent_id: listing.agent_id, user_id: authUser.id,
      sender_name: userData?.full_name || authUser.email,
      sender_email: userData?.email || authUser.email,
      sender_phone: phone || userData?.phone || "",
      message, status: "new",
    }).select().single()
    if (err) { setError("Failed to send. Please try again."); setSending(false); return }
    // Notify agent with sender name + enquiry ID so bell links to that chat
    if (listing.agent_id && enquiryInserted?.id) {
      const { data: agentData } = await supabase.from("agents").select("user_id").eq("id", listing.agent_id).single()
      if (agentData?.user_id) {
        const senderName = userData?.full_name || authUser.email || "A buyer"
        await supabase.from("notifications").insert({
          user_id: agentData.user_id,
          type:    "personal",
          title:   senderName + " sent you an enquiry",
          body:    message.slice(0, 100) + (message.length > 100 ? "…" : ""),
          link:    enquiryInserted.id,
        })
      }
    }
    // Email notifications will be enabled once domain is verified on Resend

    setSending(false); setSent(true)
    showToast("Enquiry sent! Agent will reply soon.", "sent")
  }

  const inp = { width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s" }

  if (!checked) return null

  if (sent) return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: T + "12", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
        <Check size={22} color={T} />
      </div>
      <h3 style={{ margin: "0 0 5px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Message Sent!</h3>
      <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{agent?.users?.full_name?.split(" ")[0] || "The agent"} will get back to you soon.</p>
      <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94a3b8" }}>Check your dashboard to track replies.</p>
    </div>
  )

  if (!authUser) return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "12", border: "2px solid " + T + "40", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <MessageCircle size={20} color={T} />
      </div>
      <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Login to Contact Agent</h3>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Create a free account to message agents and track enquiries.</p>
      <Link href="/auth" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 20px", borderRadius: 11, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800, boxShadow: "0 6px 20px " + T_GLOW }}>
        Login / Sign Up - It's Free
      </Link>
    </div>
  )

  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 11, background: T + "08", border: "1px solid " + T + "20" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
          {(userData?.full_name || authUser.email)?.charAt(0)?.toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0d1f2d" }}>{userData?.full_name || "User"}</div>
          <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userData?.email || authUser.email}</div>
        </div>
      </div>
      {error && <div style={{ padding: "9px 13px", borderRadius: 9, background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444", fontSize: 13 }}>{error}</div>}
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number (optional)" type="tel" style={inp}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
        style={{ ...inp, resize: "vertical", minHeight: 72 }}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
      <button type="submit" disabled={sending}
        style={{ padding: "12px", borderRadius: 11, background: sending ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 46, boxShadow: sending ? "none" : "0 6px 20px " + T_GLOW }}>
        {sending ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Sending…</> : <><Send size={14} /> Send Message</>}
      </button>
    </form>
  )
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ agentId, listingId, authUser }) {
  const [reviews,    setReviews]    = useState([])
  const [myReview,   setMyReview]   = useState(null)
  const [rating,     setRating]     = useState(0)
  const [hover,      setHover]      = useState(0)
  const [comment,    setComment]    = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState("")

  useEffect(() => {
    if (!agentId) return
    supabase.from("reviews").select("*, users(full_name)").eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReviews(data || [])
        if (authUser && data) {
          const mine = data.find(r => r.user_id === authUser.id)
          if (mine) { setMyReview(mine) }  // don't restore rating/comment so form stays clear after submit
        }
      })
  }, [agentId, authUser, submitted])

  const submit = async (e) => {
    e.preventDefault()
    if (!authUser) { window.location.href = "/auth"; return }
    if (rating === 0) { setError("Please select a star rating."); return }
    setError(""); setSubmitting(true)
    await supabase.from("reviews").upsert({ agent_id: agentId, user_id: authUser.id, listing_id: listingId, rating, comment: comment.trim() }, { onConflict: "agent_id,user_id" })
    await supabase.rpc("update_agent_rating", { p_agent_id: agentId })
    setSubmitting(false)
    setComment("")
    setRating(0)
    setHover(0)
    setSubmitted(p => !p)
  }

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Agent Reviews</h3>
        {avg && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} size={13} color="#f59e0b" fill={i <= Math.round(avg) ? "#f59e0b" : "none"} />)}</div>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{avg}</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
          </div>
        )}
      </div>

      {authUser ? (
        <div style={{ background: "#f8fafc", borderRadius: 16, padding: "18px", marginBottom: 18, border: "1px solid #f1f5f9" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{myReview ? "Update Your Review" : "Rate This Agent"}</h4>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button" onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <Star size={26} color="#f59e0b" fill={(hover || rating) >= i ? "#f59e0b" : "none"} />
                </button>
              ))}
              {rating > 0 && <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>{["","Poor","Fair","Good","Very Good","Excellent"][rating]}</span>}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Share your experience (optional)…"
              style={{ width: "100%", padding: "10px 13px", borderRadius: 11, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "vertical", background: "#fff", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = T} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            {error && <p style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>}
            <button type="submit" disabled={submitting}
              style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 11, background: submitting ? T + "70" : T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 14px " + T_GLOW }}>
              {submitting ? "Submitting…" : myReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", border: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>Login to rate and review this agent</span>
          <Link href="/auth" style={{ padding: "7px 16px", borderRadius: 50, background: T, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Login</Link>
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8" }}>
          <Star size={32} color="#e2e8f0" style={{ marginBottom: 8 }} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No reviews yet - be the first!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent," + T + ",transparent)" }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: T + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: T, flexShrink: 0 }}>
                    {(r.users?.full_name || "U").charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d" }}>{r.users?.full_name || "User"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>{[1,2,3,4,5].map(i => <Star key={i} size={12} color="#f59e0b" fill={i <= r.rating ? "#f59e0b" : "none"} />)}</div>
              </div>
              {r.comment && <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// ─── Property Map ─────────────────────────────────────────────────────────────
function PropertyMap({ city, state, address, title }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const CITY_COORDS = {
    "lagos": [6.5244, 3.3792], "victoria island": [6.4281, 3.4219],
    "ikoyi": [6.4550, 3.4324], "lekki": [6.4698, 3.5852],
    "ajah": [6.4667, 3.6167], "surulere": [6.5000, 3.3500],
    "yaba": [6.5150, 3.3800], "ikeja": [6.6018, 3.3515],
    "abuja": [9.0765, 7.3986], "wuse": [9.0667, 7.4833],
    "maitama": [9.0833, 7.5000], "garki": [9.0500, 7.4833],
    "asokoro": [9.0333, 7.5167], "gwarinpa": [9.1167, 7.4000],
    "port harcourt": [4.8156, 7.0498], "enugu": [6.4584, 7.5464],
    "awka": [6.2059, 7.0739], "onitsha": [6.1667, 6.7833],
    "asaba": [6.1983, 6.7333], "warri": [5.5167, 5.7500],
    "kano": [12.0022, 8.5920], "kaduna": [10.5272, 7.4396],
    "ibadan": [7.3776, 3.9470], "benin city": [6.3350, 5.6270],
    "calabar": [4.9517, 8.3220], "uyo": [5.0377, 7.9128],
    "owerri": [5.4836, 7.0333],
  }

  const getCoords = () => {
    if (city) {
      const key = city.toLowerCase().trim()
      if (CITY_COORDS[key]) return CITY_COORDS[key]
    }
    if (state) {
      const key = state.toLowerCase().trim()
      if (CITY_COORDS[key]) return CITY_COORDS[key]
    }
    return [9.0820, 8.6753] // Nigeria center
  }

  const coords = getCoords()

  if (!mounted) return (
    <div style={{ height: 280, background: "#f1f5f9", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader size={24} color={T} style={{ animation: "spin 1s linear infinite" }} />
    </div>
  )

  const L = typeof window !== "undefined" ? require("leaflet") : null
  if (!L) return null

  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })

  const { MapContainer, TileLayer, Marker, Circle } = require("react-leaflet")

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #f1f5f9", height: 280, position: "relative", width: "100%", maxWidth: "100%" }}>
      <MapContainer
        center={coords}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} />
        {/* Blur circle around marker for privacy */}
        <Circle
          center={coords}
          radius={600}
          pathOptions={{ color: T, fillColor: T, fillOpacity: 0.08, weight: 1.5, dashArray: "6 4" }}
        />
      </MapContainer>
      {/* Location label overlay */}
      <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 1000, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: 50, fontSize: 12, fontWeight: 700, color: "#0d1f2d", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 5 }}>
        <MapPin size={12} color={T} /> {city}{state ? ", " + state : ""}
      </div>
      {/* Privacy notice */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 50, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
        Approximate location
      </div>
    </div>
  )
}


// ─── Report Listing Modal ─────────────────────────────────────────────────────
function ReportListingModal({ listing, authUser, onClose }) {
  const [reason,     setReason]     = useState("")
  const [details,    setDetails]    = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)

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
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const submit = async () => {
    if (!reason) return
    setSubmitting(true)

    const description = [
      details.trim() || reason,
      "Listing: " + (listing?.title || listing?.id),
      "URL: " + window.location.href,
    ].join(" | ")

    // Insert report
    await supabase.from("reports").insert({
      reporter_id: authUser.id,
      type:        "listing",
      subject:     reason,
      description,
      listing_id:  listing.id,
      status:      "new",
    })

    // Notify admin
    const { data: adminUser } = await supabase
      .from("users").select("id").eq("role", "admin").single()
    if (adminUser?.id) {
      await supabase.from("notifications").insert({
        user_id: adminUser.id,
        type:    "warning",
        title:   "🚩 Listing Reported",
        body:    "[" + reason + "] - " + (listing?.title || "A listing") + " | " + window.location.href,
      })
    }

    setSubmitting(false)
    setDone(true)
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8,15,20,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, background: "#fff", borderRadius: "24px 24px 0 0", padding: "24px 20px 40px", maxHeight: "85svh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
        <div style={{ width: 40, height: 4, borderRadius: 50, background: "#e2e8f0", margin: "0 auto 20px" }} />

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#10b98112", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <CheckCircle size={24} color="#10b981" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Report Submitted</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Thank you. Our team will review this listing and take action if needed.</p>
            <button onClick={onClose} style={{ padding: "11px 28px", borderRadius: 50, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 900, color: "#0d1f2d" }}>Report This Listing</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{listing?.title}</p>
              </div>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} color="#64748b" />
              </button>
            </div>

            {/* Reason options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Select a reason *</label>
              {REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: "1.5px solid " + (reason === r ? T : "#e2e8f0"), background: reason === r ? T + "08" : "#f8fafc", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid " + (reason === r ? T : "#cbd5e1"), background: reason === r ? T : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {reason === r && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: reason === r ? 700 : 500, color: reason === r ? T : "#374151" }}>{r}</span>
                </button>
              ))}
            </div>

            {/* Additional details */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Additional details (optional)</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3}
                placeholder="Describe the issue in more detail…"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "none", background: "#f8fafc", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }} />
            </div>

            <button onClick={submit} disabled={!reason || submitting}
              style={{ width: "100%", padding: "13px", borderRadius: 14, background: !reason || submitting ? "#94a3b8" : "#ef4444", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: !reason || submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50 }}>
              {submitting ? <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : <><Flag size={15} /> Submit Report</>}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Agent Sidebar Card ───────────────────────────────────────────────────────
function AgentCard({ agent, listing, saved, onSave, isOwner }) {
  const agentName   = agent?.users?.full_name  || "Agent"
  const agentPhone  = agent?.users?.phone      || ""
  const agentAvatar = agent?.users?.avatar_url || null

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "20px", border: "1px solid #f1f5f9", marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Listed By</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
        {agentAvatar
          ? <img src={agentAvatar} alt={agentName} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T, flexShrink: 0 }} />
          : <div style={{ width: 48, height: 48, borderRadius: "50%", background: T + "20", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: T, flexShrink: 0 }}>{agentName.charAt(0)}</div>}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{agentName}</span>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Property Agent</div>
          {/* Verified banner */}
          {agent?.is_verified ? (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
              <Shield size={14} color="#16a34a" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#15803d", fontWeight: 800, lineHeight: 1.4 }}>
                ✓ Verified by FindWithHabi
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "#f59e0b10", border: "1px solid #f59e0b30" }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 11, color: "#92400e", lineHeight: 1.5, fontWeight: 600 }}>
                This agent is <strong>not verified</strong> by FindWithHabi. Proceed at your own risk.
              </p>
            </div>
          )}
          {agent?.rating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
              <Star size={11} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0d1f2d" }}>{agent.rating}</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>({agent.total_reviews || 0})</span>
            </div>
          )}
        </div>
      </div>

      {/* Call + WhatsApp - only for non-owners */}
      {!isOwner && <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {agentPhone && (
          <a href={"tel:" + agentPhone}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 11, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 14px " + T_GLOW }}>
            <Phone size={14} /> Call
          </a>
        )}
        {agentPhone && (
          <button
            onClick={() => {
              navigator.clipboard?.writeText(agentPhone)
                .then(() => showToast("📞 Phone number copied!", "copy"))
                .catch(() => {})
            }}
            title="Copy phone number"
            style={{ width: 42, height: 42, borderRadius: 11, background: "#f8fafc", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Copy size={15} color="#64748b" />
          </button>
        )}
        <a href={"https://wa.me/" + agentPhone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello, I am interested in " + (listing?.title || "this property") + " on FindWithHabi.")}
          target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 11, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
          <MessageCircle size={14} /> WhatsApp
        </a>
      </div>}

      {!isOwner && <>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>or send a message</span>
          <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
        </div>
        <EnquiryForm listing={listing} agent={agent} />
      </>}
      {isOwner && (
        <div style={{ padding: "12px 14px", borderRadius: 12, background: T + "08", border: "1px solid " + T + "20", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🏠</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>Your listing</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Manage it from your dashboard</div>
          </div>
        </div>
      )}

      {/* Save + Share */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onSave}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 11, border: "1.5px solid " + (saved ? "#ef4444" : "#e2e8f0"), background: saved ? "#fef2f2" : "#f8fafc", color: saved ? "#ef4444" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          <Heart size={14} fill={saved ? "#ef4444" : "none"} /> {saved ? "Saved" : "Save"}
        </button>
        <button onClick={() => {
          if (navigator.share) {
            navigator.share({ title: listing?.title, url: window.location.href })
          } else {
            navigator.clipboard?.writeText(window.location.href)
              .then(() => showToast("🔗 Link copied to clipboard", "copy"))
              .catch(() => showToast("Could not copy link", "error"))
          }
        }}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  )
}

// ─── Mobile Contact Bar (fixed bottom) ───────────────────────────────────────
function MobileContactBar({ agent, listing, saved, onSave, authUser }) {
  const [showForm, setShowForm] = useState(false)
  const agentPhone = agent?.users?.phone || ""

  return (
    <>
      {/* Fixed bottom bar */}
      <div className="mobile-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300, background: "#fff", borderTop: "2px solid " + T + "20", padding: "10px 14px", paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 -8px 32px rgba(0,151,178,0.12)" }}>
        <button onClick={onSave}
          style={{ width: 44, height: 44, borderRadius: 11, border: "1.5px solid " + (saved ? "#ef4444" : "#e2e8f0"), background: saved ? "#fef2f2" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Heart size={18} color={saved ? "#ef4444" : "#64748b"} fill={saved ? "#ef4444" : "none"} />
        </button>
        {agentPhone && (
          <a href={"tel:" + agentPhone}
            style={{ width: 44, height: 44, borderRadius: 11, background: "#f8fafc", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
            <Phone size={18} color="#64748b" />
          </a>
        )}
        <a href={"https://wa.me/" + agentPhone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello, I am interested in " + (listing?.title || "this property") + " on FindWithHabi.")}
          target="_blank" rel="noopener noreferrer"
          style={{ width: 44, height: 44, borderRadius: 11, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
          <MessageCircle size={18} color="#fff" />
        </a>
        <button onClick={() => setShowForm(true)}
          style={{ flex: 1, height: 44, borderRadius: 11, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 14px " + T_GLOW }}>
          <Send size={15} /> {authUser ? "Contact Agent" : "Login to Contact"}
        </button>
      </div>

      {/* Slide-up enquiry sheet */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(8,15,20,0.65)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "20px 20px 0 0", padding: "20px 16px 32px", maxHeight: "88svh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
            <div style={{ width: 36, height: 4, borderRadius: 50, background: "#e2e8f0", margin: "0 auto 16px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#0d1f2d" }}>Contact Agent</h3>
              <button onClick={() => setShowForm(false)} style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                ×
              </button>
            </div>
            {/* Agent mini info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: "#f8fafc", borderRadius: 12 }}>
              {agent?.users?.avatar_url
                ? <img src={agent.users.avatar_url} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T }} />
                : <div style={{ width: 38, height: 38, borderRadius: "50%", background: T + "20", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: T }}>{(agent?.users?.full_name || "A").charAt(0)}</div>}
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0d1f2d" }}>{agent?.users?.full_name || "Agent"}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{listing?.title}</div>
              </div>
            </div>
            <EnquiryForm listing={listing} agent={agent} />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const id     = params?.id

  const [listing,         setListing]         = useState(null)
  const [images,          setImages]          = useState([])
  const [agent,           setAgent]           = useState(null)
  const [amenities,       setAmenities]       = useState([])
  const [saved,           setSaved]           = useState(false)
  const [showReport,      setShowReport]      = useState(false)
  const [loading,         setLoading]         = useState(true)
  const [notFound,        setNotFound]        = useState(false)
  const [authUser,        setAuthUser]        = useState(null)
  const [userData,        setUserData]        = useState(null)
  const [similarListings, setSimilarListings] = useState([])

  // Is the logged-in user the agent who owns this listing?
  const isOwner = !!(authUser && agent && agent.user_id === authUser.id)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null
      setAuthUser(user)
      if (user) {
        supabase.from("users").select("full_name, email, phone").eq("id", user.id).single()
          .then(({ data }) => setUserData(data))
        if (id) {
          supabase.from("saved_listings").select("id").eq("user_id", user.id).eq("listing_id", id).maybeSingle()
            .then(({ data }) => { if (data) setSaved(true) })
        }
      }
    })
  }, [id])

  const handleSave = async () => {
    if (!authUser) { router.push("/auth"); return }
    if (saved) {
      await supabase.from("saved_listings").delete().eq("user_id", authUser.id).eq("listing_id", id)
      setSaved(false)
      showToast("Removed from saved listings", "info")
    } else {
      await supabase.from("saved_listings").insert({ user_id: authUser.id, listing_id: id })
      supabase.rpc("increment_saves", { listing_id: id }).then(() => {})
      setSaved(true)
      showToast("❤️ Listing saved!", "saved")
    }
  }

  useEffect(() => {
    if (!id) return
    const fetchListing = async () => {
      setLoading(true)
      const { data: listingData, error } = await supabase.from("listings").select("*").eq("id", id).single()
      if (error || !listingData) { setNotFound(true); setLoading(false); return }
      setListing(listingData)

      // Increment views — direct update (works without RPC function)
      supabase.from("listings")
        .update({ views: (listingData.views || 0) + 1 })
        .eq("id", id)
        .then(() => {})

      const [{ data: imagesData }, { data: agentData }, { data: amenityData }] = await Promise.all([
        supabase.from("listing_images").select("url, is_cover, sort_order").eq("listing_id", id).order("sort_order"),
        supabase.from("agents").select("*, users(full_name, phone, avatar_url, email)").eq("id", listingData.agent_id).single(),
        supabase.from("listing_amenities").select("amenities(name)").eq("listing_id", id),
      ])

      setImages(imagesData || [])
      setAgent(agentData)
      setAmenities(amenityData?.map(a => a.amenities?.name).filter(Boolean) || [])

      // Try city first, fall back to state, then listing_type
      let similarData = null

      if (listingData.city) {
        const { data: cityData } = await supabase.from("listings").select("*")
          .eq("status", "active").eq("is_flagged", false)
          .eq("city", listingData.city).neq("id", id)
          .order("is_featured", { ascending: false })
          .order("views", { ascending: false })
          .limit(4)
        if (cityData?.length > 0) similarData = cityData
      }

      // Fall back to same state if city didn't return enough
      if ((!similarData || similarData.length < 2) && listingData.state) {
        const { data: stateData } = await supabase.from("listings").select("*")
          .eq("status", "active").eq("is_flagged", false)
          .eq("state", listingData.state).neq("id", id)
          .order("is_featured", { ascending: false })
          .order("views", { ascending: false })
          .limit(4)
        if (stateData?.length > 0) similarData = stateData
      }

      // Fall back to same listing type anywhere in Nigeria
      if (!similarData || similarData.length === 0) {
        const { data: typeData } = await supabase.from("listings").select("*")
          .eq("status", "active").eq("is_flagged", false)
          .eq("listing_type", listingData.listing_type || "Buy").neq("id", id)
          .order("views", { ascending: false })
          .limit(4)
        if (typeData?.length > 0) similarData = typeData
      }

      if (similarData?.length > 0) {
        const sIds = similarData.map(l => l.id)
        const { data: sImgs } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", sIds)
        setSimilarListings(similarData.map(l => {
          const li = sImgs ? sImgs.filter(i => i.listing_id === l.id) : []
          return { ...l, cover_image: li.find(i => i.is_cover)?.url || li[0]?.url || null }
        }))
      }
      setLoading(false)
    }
    fetchListing()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Loader size={32} color={T} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 14, color: "#94a3b8" }}>Loading property…</span>
      </div>
      {/* Report modal */}
      {showReport && authUser && (
        <ReportListingModal listing={listing} authUser={authUser} onClose={() => setShowReport(false)} />
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (notFound || !listing) return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <Building2 size={52} color="#cbd5e1" style={{ marginBottom: 18 }} />
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#0d1f2d" }}>Property Not Found</h2>
      <p style={{ margin: "0 0 20px", color: "#64748b", textAlign: "center" }}>This listing may have been removed or is no longer available.</p>
      <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
        <ArrowLeft size={14} /> Browse Listings
      </Link>
    </div>
  )

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <NavBar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 12px calc(100px + env(safe-area-inset-bottom, 0px))" }}>
        {/* Breadcrumb - hide on very small screens */}
        <div className="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <Link href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}>Home</Link>
          <span style={{ color: "#cbd5e1", fontSize: 12 }}>/</span>
          <Link href="/listings" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}>Listings</Link>
          <span style={{ color: "#cbd5e1", fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: "#0d1f2d", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "40vw" }}>{listing.title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="detail-layout">
          {/* ── Left column ── */}
          <div style={{ minWidth: 0 }}>
            <Gallery images={images} />

            {/* Title + price */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f1f5f9", marginBottom: 14, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 50, background: T, color: "#fff", fontSize: 11, fontWeight: 800 }}>{listing.listing_type}</span>
                    <span style={{ padding: "3px 10px", borderRadius: 50, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700 }}>{listing.category}</span>
                    {listing.is_verified && (
                      <span style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 10px", borderRadius: 50, background: "#10b98112", color: "#059669", fontSize: 11, fontWeight: 700 }}>
                        <CheckCircle size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <h1 style={{ margin: "0 0 7px", fontSize: "clamp(18px,5vw,30px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{listing.title}</h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={13} color={T} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#64748b" }}>{listing.address || listing.city + ", " + listing.state}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "clamp(22px,6vw,36px)", fontWeight: 900, color: T, letterSpacing: "-0.03em" }}>{listing.price_label}</div>
                  {listing.negotiable && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Negotiable</div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 50, background: "#f8fafc" }}>
                  <Eye size={11} color="#94a3b8" />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{((listing.views || 0) + 1).toLocaleString()} views</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 50, background: "#f8fafc" }}>
                  <Calendar size={11} color="#94a3b8" />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{new Date(listing.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* Property details grid */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f1f5f9", marginBottom: 14, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
              <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Property Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 10 }}>
                {[
                  listing.beds    > 0 && { icon: Bed,       label: "Bedrooms",  val: listing.beds    },
                  listing.baths   > 0 && { icon: Bath,      label: "Bathrooms", val: listing.baths   },
                  listing.toilets > 0 && { icon: Home,      label: "Toilets",   val: listing.toilets },
                  listing.floors  > 1 && { icon: Building2, label: "Floors",    val: listing.floors  },
                  listing.sqft        && { icon: Maximize2,  label: "sqft",      val: Number(listing.sqft).toLocaleString() },
                  listing.year_built  && { icon: Calendar,  label: "Built",     val: listing.year_built },
                ].filter(Boolean).map(({ icon: Icon, label, val }, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: T + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 7px" }}>
                      <Icon size={15} color={T} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#0d1f2d", marginBottom: 2 }}>{val}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                {[
                  { label: "Condition", val: listing.condition },
                  { label: "Furnished", val: listing.furnished },
                  listing.landmark && { label: "Landmark", val: listing.landmark },
                ].filter(Boolean).map(({ label, val }) => (
                  <div key={label} style={{ padding: "5px 12px", borderRadius: 50, background: "#f1f5f9" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}: </span>
                    <span style={{ fontSize: 11, color: "#0d1f2d", fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f1f5f9", marginBottom: 14, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
                <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>About This Property</h2>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>{listing.description}</p>
                {listing.highlights && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 800, color: "#0d1f2d" }}>Key Highlights</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.8, whiteSpace: "pre-line" }}>{listing.highlights}</p>
                  </div>
                )}
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f1f5f9", marginBottom: 14, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
                <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Amenities & Features</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,160px),1fr))", gap: 8 }}>
                  {amenities.map(a => (
                    <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckCircle size={11} color="#fff" />
                      </div>
                      <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing breakdown */}
            {(listing.service_fee || listing.caution_fee) && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f1f5f9", marginBottom: 14, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
                <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Pricing Breakdown</h2>
                {[
                  { label: listing.listing_type === "Buy" ? "Sale Price" : "Rent", val: listing.price_label },
                  listing.service_fee && { label: "Service Charge", val: "₦" + Number(listing.service_fee).toLocaleString() + "/yr" },
                  listing.caution_fee && { label: "Caution Fee",    val: "₦" + Number(listing.caution_fee).toLocaleString() },
                ].filter(Boolean).map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", border: "1px solid #f1f5f9", marginBottom: 14 }}>
              {[
                { icon: Shield,      color: T,         text: "Verified by FindWithHabi team"   },
                { icon: CheckCircle, color: "#10b981",  text: "Documents available on request" },
                { icon: Eye,         color: "#f59e0b",  text: ((listing.views || 0) + 1).toLocaleString() + " people viewed this listing" },
              ].map(({ icon: Icon, color, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: i < 2 ? 10 : 0, marginBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={color} />
                  </div>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Location Map */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f1f5f9", marginBottom: 14, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Location</h2>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent((listing?.address || listing?.city) + ", " + listing?.state + ", Nigeria")}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 50, background: T + "12", color: T, fontSize: 12, fontWeight: 700, textDecoration: "none", border: "1px solid " + T + "30" }}>
                  <MapPin size={12} /> Open in Maps
                </a>
              </div>
              <PropertyMap city={listing?.city} state={listing?.state} address={listing?.address} title={listing?.title} />
              <p style={{ margin: "10px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
                📍 {listing?.address || listing?.city}, {listing?.state} · Approximate area shown
              </p>
            </div>

            {/* Report listing */}
            {authUser && !isOwner && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                <button onClick={() => setShowReport(true)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 50, background: "transparent", border: "1px solid #e2e8f0", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <Flag size={12} /> Report this listing
                </button>
              </div>
            )}

            {/* Reviews */}
            <ReviewsSection agentId={listing?.agent_id} listingId={listing?.id} authUser={authUser} />
          </div>

          {/* ── Right column (desktop sidebar) ── */}
          <div className="detail-sidebar" style={{ display: "none" }}>
            <div style={{ position: "sticky", top: 80 }}>
              <AgentCard agent={agent} listing={listing} saved={saved} onSave={handleSave} isOwner={isOwner} />
              <div style={{ background: "#fff", borderRadius: 20, padding: "16px 20px", border: "1px solid #f1f5f9" }}>
                {[
                  { icon: Shield,      color: T,         text: "Verified by FindWithHabi team"   },
                  { icon: CheckCircle, color: "#10b981",  text: "Documents available on request" },
                  { icon: Eye,         color: "#f59e0b",  text: ((listing.views || 0) + 1).toLocaleString() + " people viewed this" },
                ].map(({ icon: Icon, color, text }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: i < 2 ? 11 : 0, marginBottom: i < 2 ? 11 : 0, borderBottom: i < 2 ? "1px solid #f8fafc" : "none" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color={color} />
                    </div>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>
                You May Also Like in {listing?.city || listing?.state || "Nigeria"}
              </h2>
              <Link href={"/listings?city=" + (listing?.city || "")} style={{ fontSize: 13, fontWeight: 700, color: T, textDecoration: "none" }}>
                See more →
              </Link>
            </div>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {similarListings.map((l, i) => (
                <Link key={l.id} href={"/listings/" + l.id}
                  style={{ textDecoration: "none", display: "block", background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s", flexShrink: 0, width: "clamp(200px,65vw,240px)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ position: "relative", height: 150, background: "#f1f5f9", overflow: "hidden" }}>
                    {l.cover_image
                      ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={28} color="#cbd5e1" /></div>}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
                    <span style={{ position: "absolute", bottom: 7, left: 7, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 50 }}>{l.listing_type || "Buy"}</span>
                  </div>
                  <div style={{ padding: "11px 13px" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
                      <MapPin size={10} color={T} />
                      <span style={{ fontSize: 11, color: "#64748b" }}>{l.city}, {l.state}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      {l.beds  > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 2 }}><Bed size={10} color="#94a3b8" />{l.beds}bd</span>}
                      {l.baths > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 2 }}><Bath size={10} color="#94a3b8" />{l.baths}ba</span>}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: T }}>{l.price_label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile contact bar */}
      {!isOwner && <MobileContactBar agent={agent} listing={listing} saved={saved} onSave={handleSave} authUser={authUser} />}

      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        /* Prevent Leaflet from overlapping fixed navbar or overflowing */
        .leaflet-pane { z-index: 10 !important; }
        .leaflet-top, .leaflet-bottom { z-index: 20 !important; }
        .leaflet-control { z-index: 20 !important; }
        .leaflet-container { max-width: 100% !important; }
        .leaflet-control-zoom { margin: 8px !important; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; max-width: 100vw; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:focus, textarea:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:none} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.5) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }

        /* Mobile: single column, bottom bar visible */
        .detail-sidebar { display: none !important; }
        .mobile-bar     { display: flex !important; }

        @media (min-width: 1024px) {
          .detail-layout  { grid-template-columns: 1fr 360px !important; }
          .detail-sidebar { display: block !important; }
          .mobile-bar     { display: none !important; }
          /* Hide the inline trust badges on desktop - sidebar has them */
          .inline-trust   { display: none !important; }
        }

        @media (min-width: 768px) {
          .breadcrumb { font-size: 13px !important; }
        }

        /* Leaflet popup styling */
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
          padding: 0 !important;
          overflow: hidden !important;
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }
        .leaflet-popup-content {
          margin: 8px !important;
          width: 240px !important;
        }
        .leaflet-popup-tip-container { display: none !important; }

        /* Mobile bar safe area */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-bar { padding-bottom: calc(10px + env(safe-area-inset-bottom)) !important; }
        }

        /* Smooth image loading */
        img { -webkit-user-drag: none; }

        /* Better tap targets on mobile */
        @media (max-width: 767px) {
          .breadcrumb { display: none !important; }
          .detail-sidebar { display: none !important; }
          .mobile-bar { display: flex !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}