"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Heart,
  Phone, MessageCircle, CheckCircle, Star, Shield,
  Eye, Share2, ChevronLeft, ChevronRight, Loader,
  Calendar, Home, Building2, Zap, BadgeCheck, Send, Check,
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

  const dashboardLink = userRole === "admin"  ? "/dashboard/admin"
                      : userRole === "agent"  ? "/dashboard/agent"
                      : "/dashboard/user"

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? "rgba(8,15,20,0.97)" : "rgba(8,15,20,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 64, width: "auto", objectFit: "contain" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            <ArrowLeft size={14} /> Browse
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

// ─── Image Gallery ────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [current, setCurrent] = useState(0)
  if (!images || images.length === 0) {
    return (
      <div style={{ height: "clamp(260px,45vw,520px)", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20 }}>
        <Building2 size={48} color="#cbd5e1" />
      </div>
    )
  }
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 24 }}>
      <div style={{ height: "clamp(260px,45vw,520px)", background: DARK }}>
        <img src={images[current].url} alt={"Property photo " + (current + 1)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }} />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={prev}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <button onClick={next}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}>
            <ChevronRight size={20} color="#fff" />
          </button>
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 50, background: i === current ? "#fff" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
          <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 50, backdropFilter: "blur(8px)" }}>
            {current + 1} / {images.length}
          </div>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2 }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: 72, height: 54, flexShrink: 0, borderRadius: 10, overflow: "hidden", border: "2.5px solid " + (i === current ? T : "transparent"), cursor: "pointer", padding: 0, transition: "border-color 0.2s" }}>
              <img src={img.url} alt={"Thumb " + (i + 1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────
function EnquiryForm({ listing, agent }) {
  const router  = useRouter()
  const [authUser, setAuthUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [message,  setMessage]  = useState("Hello, I am interested in " + (listing?.title || "this property") + ". Please get in touch with me.")
  const [phone,    setPhone]    = useState("")
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState("")
  const [checked,  setChecked]  = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user)
      if (user) {
        supabase.from("users").select("full_name, email, phone").eq("id", user.id).single()
          .then(({ data }) => {
            setUserData(data)
            if (data?.phone) setPhone(data.phone)
          })
      }
      setChecked(true)
    })
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!authUser) { router.push("/auth"); return }
    if (!message.trim()) { setError("Please enter a message."); return }
    setError("")
    setSending(true)

    const { error: err } = await supabase.from("enquiries").insert({
      listing_id:   listing.id,
      agent_id:     listing.agent_id,
      user_id:      authUser.id,
      sender_name:  userData?.full_name || authUser.email,
      sender_email: userData?.email     || authUser.email,
      sender_phone: phone || userData?.phone || "",
      message,
      status:       "new",
    })

    if (err) { setError("Failed to send. Please try again."); setSending(false); return }
    setSending(false)
    setSent(true)
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d",
    fontFamily: "inherit", outline: "none", background: "#f8fafc",
    boxSizing: "border-box", transition: "border-color 0.2s, background 0.2s",
  }

  if (!checked) return null

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T + "12", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Check size={24} color={T} />
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#0d1f2d" }}>Message Sent!</h3>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          {agent?.users?.full_name?.split(" ")[0] || "The agent"} will get back to you soon.
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8" }}>Check your dashboard to see the reply.</p>
      </div>
    )
  }

  // Not logged in
  if (!authUser) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: T + "12", border: "2px solid " + T + "40", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <MessageCircle size={22} color={T} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>Login to Contact Agent</h3>
        <p style={{ margin: "0 0 18px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
          Create a free account to message agents, save properties and track your enquiries.
        </p>
        <Link href="/auth" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800, boxShadow: "0 6px 20px " + T_GLOW }}>
          Login / Sign Up — It's Free
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Show logged-in user info */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: T + "08", border: "1px solid " + T + "20" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
          {(userData?.full_name || authUser.email)?.charAt(0)?.toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f2d" }}>{userData?.full_name || "User"}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{userData?.email || authUser.email}</div>
        </div>
      </div>
      {error && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444", fontSize: 13 }}>{error}</div>
      )}
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number (optional)" type="tel"
        style={inputStyle}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
      />
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
        style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
      />
      <button type="submit" disabled={sending}
        style={{ padding: "13px", borderRadius: 12, background: sending ? T + "70" : T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, transition: "all 0.25s", boxShadow: sending ? "none" : "0 6px 20px " + T_GLOW }}>
        {sending
          ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Sending…</>
          : <><Send size={15} /> Send Message</>}
      </button>
    </form>
  )
}


// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ agentId, listingId, authUser, userData }) {
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
    // Fetch all reviews for this agent
    supabase.from("reviews").select("*, users(full_name)").eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReviews(data || [])
        if (authUser && data) {
          const mine = data.find(r => r.user_id === authUser.id)
          if (mine) { setMyReview(mine); setRating(mine.rating); setComment(mine.comment || "") }
        }
      })
  }, [agentId, authUser, submitted])

  const submit = async (e) => {
    e.preventDefault()
    if (!authUser) { window.location.href = "/auth"; return }
    if (rating === 0) { setError("Please select a star rating."); return }
    setError("")
    setSubmitting(true)

    // Upsert review
    await supabase.from("reviews").upsert({
      agent_id:   agentId,
      user_id:    authUser.id,
      listing_id: listingId,
      rating,
      comment:    comment.trim(),
    }, { onConflict: "agent_id,user_id" })

    // Update agent average rating
    await supabase.rpc("update_agent_rating", { p_agent_id: agentId })

    setSubmitting(false)
    setSubmitted(p => !p)
  }

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Agent Reviews</h3>
          {avg && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} color="#f59e0b" fill={i <= Math.round(avg) ? "#f59e0b" : "none"} />)}
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{avg}</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
            </div>
          )}
        </div>
      </div>

      {/* Write review */}
      {authUser && (
        <div style={{ background: "#f8fafc", borderRadius: 16, padding: "20px", marginBottom: 20, border: "1px solid #f1f5f9" }}>
          <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>
            {myReview ? "Update Your Review" : "Rate This Agent"}
          </h4>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Stars */}
            <div style={{ display: "flex", gap: 6 }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <Star size={28} color="#f59e0b" fill={(hover || rating) >= i ? "#f59e0b" : "none"} style={{ transition: "fill 0.1s" }} />
                </button>
              ))}
              {rating > 0 && <span style={{ fontSize: 13, color: "#64748b", alignSelf: "center", marginLeft: 6 }}>
                {["","Poor","Fair","Good","Very Good","Excellent"][rating]}
              </span>}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              placeholder="Share your experience with this agent (optional)…"
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", fontFamily: "inherit", outline: "none", resize: "vertical", background: "#fff", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = T }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0" }}
            />
            {error && <p style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>}
            <button type="submit" disabled={submitting}
              style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 12, background: submitting ? T + "70" : T, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", boxShadow: "0 4px 14px " + T_GLOW }}>
              {submitting ? "Submitting…" : myReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {!authUser && (
        <div style={{ background: "#f8fafc", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", border: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>Login to rate and review this agent</span>
          <Link href="/auth" style={{ padding: "8px 18px", borderRadius: 50, background: T, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Login / Sign Up</Link>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
          <Star size={36} color="#e2e8f0" style={{ marginBottom: 10 }} />
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No reviews yet — be the first!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map((r, i) => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T}, transparent)` }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: T + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: T, flexShrink: 0 }}>
                    {(r.users?.full_name || "U").charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>{r.users?.full_name || "User"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} color="#f59e0b" fill={i <= r.rating ? "#f59e0b" : "none"} />)}
                </div>
              </div>
              {r.comment && <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ListingDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const id       = params?.id

  const [listing,        setListing]        = useState(null)
  const [images,         setImages]         = useState([])
  const [agent,          setAgent]          = useState(null)
  const [amenities,      setAmenities]      = useState([])
  const [saved,          setSaved]          = useState(false)
  const [loading,        setLoading]        = useState(true)
  const [notFound,       setNotFound]       = useState(false)
  const [authUser,       setAuthUser]       = useState(null)
  const [userData,       setUserData]       = useState(null)
  const [similarListings,setSimilarListings]= useState([])

  // Check auth on mount and load saved state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
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
    } else {
      await supabase.from("saved_listings").insert({ user_id: authUser.id, listing_id: id })
      // increment saves count
      supabase.rpc("increment_saves", { listing_id: id }).then(() => {})
      setSaved(true)
    }
  }

  useEffect(() => {
    if (!id) return
    const fetchListing = async () => {
      setLoading(true)

      // 1. Fetch listing
      const { data: listingData, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !listingData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setListing(listingData)

      // 2. Increment view count (fire and forget)
      supabase
        .from("listings")
        .update({ views: (listingData.views || 0) + 1 })
        .eq("id", id)
        .then(() => {})

      // 3. Fetch images
      const { data: imagesData } = await supabase
        .from("listing_images")
        .select("url, is_cover, sort_order")
        .eq("listing_id", id)
        .order("sort_order")
      setImages(imagesData || [])

      // 4. Fetch agent + user info
      const { data: agentData } = await supabase
        .from("agents")
        .select("*, users(full_name, phone, avatar_url, email)")
        .eq("id", listingData.agent_id)
        .single()
      setAgent(agentData)

      // 5. Fetch amenities
      const { data: amenityData } = await supabase
        .from("listing_amenities")
        .select("amenities(name)")
        .eq("listing_id", id)
      setAmenities(amenityData?.map(a => a.amenities?.name).filter(Boolean) || [])

      // 6. Fetch similar listings (same city, different listing, active)
      if (listingData.city) {
        const { data: similarData } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "active")
          .eq("is_flagged", false)
          .eq("city", listingData.city)
          .neq("id", id)
          .order("is_featured", { ascending: false })
          .order("views", { ascending: false })
          .limit(4)

        if (similarData && similarData.length > 0) {
          const sIds = similarData.map(l => l.id)
          const { data: sImgs } = await supabase.from("listing_images").select("listing_id, url, is_cover").in("listing_id", sIds)
          setSimilarListings(similarData.map(l => {
            const li    = sImgs ? sImgs.filter(i => i.listing_id === l.id) : []
            const cover = li.find(i => i.is_cover)?.url || li[0]?.url || null
            return { ...l, cover_image: cover }
          }))
        }
      }

      setLoading(false)
    }

    fetchListing()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Loader size={32} color={T} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14, color: "#94a3b8" }}>Loading property…</span>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (notFound || !listing) {
    return (
      <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <Building2 size={56} color="#cbd5e1" style={{ marginBottom: 20 }} />
        <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>Property Not Found</h2>
        <p style={{ margin: "0 0 24px", color: "#64748b" }}>This listing may have been removed or is no longer available.</p>
        <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
          <ArrowLeft size={15} /> Browse Listings
        </Link>
      </div>
    )
  }

  const agentName   = agent?.users?.full_name  || "Agent"
  const agentPhone  = agent?.users?.phone      || ""
  const agentAvatar = agent?.users?.avatar_url || null

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <NavBar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "84px 16px 64px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <Link href="/" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}>Home</Link>
          <span style={{ color: "#cbd5e1" }}>/</span>
          <Link href="/listings" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}>Listings</Link>
          <span style={{ color: "#cbd5e1" }}>/</span>
          <span style={{ fontSize: 13, color: "#0d1f2d", fontWeight: 700 }}>{listing.title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28 }} className="detail-layout">
          {/* Left column */}
          <div>
            {/* Gallery */}
            <Gallery images={images} />

            {/* Title + price */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 12px", borderRadius: 50, background: T, color: "#fff", fontSize: 12, fontWeight: 800 }}>{listing.listing_type}</span>
                    <span style={{ padding: "4px 12px", borderRadius: 50, background: "#f1f5f9", color: "#64748b", fontSize: 12, fontWeight: 700 }}>{listing.category}</span>
                    {listing.is_verified && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 50, background: "#10b98112", color: "#059669", fontSize: 12, fontWeight: 700 }}>
                        <CheckCircle size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <h1 style={{ margin: "0 0 8px", fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", fontFamily: "'DM Sans',system-ui,sans-serif", lineHeight: 1.2 }}>
                    {listing.title}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={14} color={T} />
                    <span style={{ fontSize: 14, color: "#64748b" }}>{listing.address || listing.city + ", " + listing.state}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: T, letterSpacing: "-0.03em" }}>{listing.price_label}</div>
                  {listing.negotiable && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Negotiable</div>}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { icon: Eye,      val: ((listing.views || 0) + 1).toLocaleString() + " views",  color: "#94a3b8" },
                  { icon: Calendar, val: new Date(listing.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }), color: "#94a3b8" },
                ].map(({ icon: Icon, val, color }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 50, background: "#f8fafc" }}>
                    <Icon size={12} color={color} />
                    <span style={{ fontSize: 12, color, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property details */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 18px", fontSize: 18, fontWeight: 800, color: "#0d1f2d" }}>Property Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
                {[
                  listing.beds    > 0 && { icon: Bed,       label: "Bedrooms",    val: listing.beds    },
                  listing.baths   > 0 && { icon: Bath,      label: "Bathrooms",   val: listing.baths   },
                  listing.toilets > 0 && { icon: Home,      label: "Toilets",     val: listing.toilets },
                  listing.floors  > 1 && { icon: Building2, label: "Floors",      val: listing.floors  },
                  listing.sqft        && { icon: Maximize2,  label: "Size (sqft)", val: Number(listing.sqft).toLocaleString() },
                  listing.year_built  && { icon: Calendar,  label: "Year Built",  val: listing.year_built },
                ].filter(Boolean).map(({ icon: Icon, label, val }, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: "14px", textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: T + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                      <Icon size={16} color={T} />
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#0d1f2d", marginBottom: 3 }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                {[
                  { label: "Condition", val: listing.condition  },
                  { label: "Furnished", val: listing.furnished  },
                  listing.landmark && { label: "Landmark", val: listing.landmark },
                ].filter(Boolean).map(({ label, val }) => (
                  <div key={label} style={{ padding: "6px 14px", borderRadius: 50, background: "#f1f5f9" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}: </span>
                    <span style={{ fontSize: 12, color: "#0d1f2d", fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800, color: "#0d1f2d" }}>About This Property</h2>
                <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>{listing.description}</p>
                {listing.highlights && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                    <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 800, color: "#0d1f2d" }}>Key Highlights</h3>
                    <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.8, whiteSpace: "pre-line" }}>{listing.highlights}</p>
                  </div>
                )}
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0d1f2d" }}>Amenities & Features</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,180px),1fr))", gap: 10 }}>
                  {amenities.map(a => (
                    <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckCircle size={12} color="#fff" />
                      </div>
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing breakdown */}
            {(listing.service_fee || listing.caution_fee) && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f1f5f9", marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#0d1f2d" }}>Pricing Breakdown</h2>
                {[
                  { label: listing.listing_type === "Buy" ? "Sale Price" : "Rent", val: listing.price_label },
                  listing.service_fee && { label: "Service Charge", val: "₦" + Number(listing.service_fee).toLocaleString() + "/yr" },
                  listing.caution_fee && { label: "Caution Fee",    val: "₦" + Number(listing.caution_fee).toLocaleString()          },
                ].filter(Boolean).map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontSize: 14, color: "#64748b" }}>{label}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — sticky sidebar */}
          <div className="detail-sidebar">
            {/* Agent card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "22px", border: "1px solid #f1f5f9", marginBottom: 16, position: "sticky", top: 80 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Listed By</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {agentAvatar
                  ? <img src={agentAvatar} alt={agentName} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid " + T, flexShrink: 0 }} />
                  : <div style={{ width: 52, height: 52, borderRadius: "50%", background: T + "20", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: T, flexShrink: 0 }}>
                      {agentName.charAt(0)}
                    </div>}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>{agentName}</span>
                    {agent?.is_verified && <BadgeCheck size={16} color="#10b981" />}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Property Agent</div>
                  {agent?.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <Star size={12} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0d1f2d" }}>{agent.rating}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>({agent.total_reviews || 0} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick contact */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {agentPhone && (
                  <a href={"tel:" + agentPhone}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 12, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 14px " + T_GLOW }}>
                    <Phone size={14} /> Call
                  </a>
                )}
                <a href={"https://wa.me/" + agentPhone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello, I am interested in " + listing.title + " on FindWithHabi.")}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 12, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>or send a message</span>
                <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
              </div>

              <EnquiryForm listing={listing} agent={agent} />

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={handleSave}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 12, border: "1.5px solid " + (saved ? "#ef4444" : "#e2e8f0"), background: saved ? "#fef2f2" : "#f8fafc", color: saved ? "#ef4444" : "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                  <Heart size={14} fill={saved ? "#ef4444" : "none"} /> {saved ? "Saved" : "Save"}
                </button>
                <button onClick={() => navigator.share?.({ title: listing.title, url: window.location.href }) || navigator.clipboard?.writeText(window.location.href)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "18px 22px", border: "1px solid #f1f5f9" }}>
              {[
                { icon: Shield,      color: T,        text: "Verified by FindWithHabi team"    },
                { icon: CheckCircle, color: "#10b981", text: "Documents available on request"  },
                { icon: Eye,         color: "#f59e0b", text: ((listing.views || 0) + 1).toLocaleString() + " people viewed this listing" },
              ].map(({ icon: Icon, color, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: i < 2 ? 12 : 0, marginBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} color={color} />
                  </div>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px 0" }}>
        <ReviewsSection agentId={listing?.agent_id} listingId={listing?.id} authUser={authUser} userData={userData} />
      </div>

      {/* Similar Listings */}
      {similarListings.length > 0 && (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 16px 80px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>
            Similar Properties in {listing?.city}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 16 }}>
            {similarListings.map((l, i) => (
              <Link key={l.id} href={"/listings/" + l.id}
                style={{ textDecoration: "none", display: "block", background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s", animation: "fadeUp 0.4s ease " + (i * 60) + "ms both" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ position: "relative", height: 170, background: "#f1f5f9", overflow: "hidden" }}>
                  {l.cover_image
                    ? <img src={l.cover_image} alt={l.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={32} color="#cbd5e1" /></div>}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
                  {l.is_featured && <span style={{ position: "absolute", top: 8, left: 8, background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>✦ Featured</span>}
                  <span style={{ position: "absolute", bottom: 8, left: 8, background: T, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>{l.listing_type || "Buy"}</span>
                </div>
                <div style={{ padding: "13px 15px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#0d1f2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                    <MapPin size={10} color={T} />
                    <span style={{ fontSize: 11, color: "#64748b" }}>{l.city}, {l.state}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    {l.beds  > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 2 }}><Bed size={10} color="#94a3b8" />{l.beds}bd</span>}
                    {l.baths > 0 && <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 2 }}><Bath size={10} color="#94a3b8" />{l.baths}ba</span>}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: T }}>{l.price_label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Float Button */}
      {agent?.users?.phone && (
        <a href={"https://wa.me/" + agent.users.phone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hello, I am interested in " + (listing?.title || "this property") + " on FindWithHabi. Please send me more details.")}
          target="_blank" rel="noopener noreferrer"
          style={{ position: "fixed", bottom: 24, right: 20, zIndex: 999, display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderRadius: 50, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800, boxShadow: "0 8px 32px rgba(37,211,102,0.45)", animation: "popIn 0.4s ease 1s both", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,211,102,0.55)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,211,102,0.45)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span className="wa-label">Chat on WhatsApp</span>
        </a>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; max-width: 100vw; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:focus, textarea:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }

        @media (min-width: 1024px) {
          .detail-layout { grid-template-columns: 1fr 380px !important; }
          .detail-sidebar { display: block; }
        }

        @media (max-width: 1023px) {
          .detail-sidebar { order: -1; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
        @keyframes popIn { from{opacity:0;transform:scale(0.5) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .wa-label { display: none; }
        @media (min-width: 480px) { .wa-label { display: inline !important; } }
      `}</style>
    </div>
  )
}