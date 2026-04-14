"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  Search, MapPin, Heart, ArrowRight, X, ChevronDown,
  Grid3x3, List, Bed, Bath, Maximize2, CheckCircle, Star,
  ChevronLeft, ChevronRight, Sparkles, Flame, GraduationCap,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const STATES       = ["All States","Lagos","Abuja","Rivers","Akwa Ibom","Delta","Enugu","Anambra","Imo","Ogun","Oyo"]
const TYPES        = ["All","Buy","Rent","Lease","Commercial","Student"]
const SORTS        = ["Newest","Price: Low to High","Price: High to Low","Most Popular"]
const BEDS_OPTIONS = ["Any","1+","2+","3+","4+","5+"]
const PRICE_RANGES = [
  { label:"Any Price",     min:0,         max:Infinity  },
  { label:"Under ₦500k",  min:0,         max:500000    },
  { label:"₦500k – ₦2M", min:500000,    max:2000000   },
  { label:"₦2M – ₦50M",  min:2000000,   max:50000000  },
  { label:"₦50M – ₦150M",min:50000000,  max:150000000 },
  { label:"₦150M+",       min:150000000, max:Infinity  },
]

const TAG_COLORS = {
  "Luxury":     { color:"#b45309", bg:"#f59e0b22" },
  "New":        { color:"#065f46", bg:"#10b98122" },
  "Hot":        { color:"#991b1b", bg:"#ef444422" },
  "Featured":   { color:"#5b21b6", bg:"#8b5cf622" },
  "Verified":   { color:"#005f70", bg:"#0097B222" },
  "Investment": { color:"#9a3412", bg:"#f9731622" },
  "Student":    { color:"#065f46", bg:"#10b98122" },
  "Budget":     { color:"#1e40af", bg:"#3b82f622" },
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80"

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
    <header style={{ position:"fixed",top:0,left:0,right:0,zIndex:200,background:scrolled?"rgba(8,15,20,0.97)":"rgba(8,15,20,0.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"background 0.3s" }}>
      <div className="nav-inner" style={{ maxWidth:1400,margin:"0 auto",padding:"0 16px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <Link href="/" style={{ textDecoration:"none",flexShrink:0 }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height:64,width:"auto",objectFit:"contain" }} />
        </Link>
        <nav className="desktop-nav" style={{ display:"none",alignItems:"center",gap:28 }}>
          {[["Listings","/listings"],["Agents","/agents"],["Cities","/#cities"],["Blog","#"]].map(([l,h]) => (
            <Link key={l} href={h} style={{ color:"rgba(255,255,255,0.7)",fontSize:14,fontWeight:600,textDecoration:"none",transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.7)")}
            >{l}</Link>
          ))}
        </nav>
        {authReady && (
          authUser
            ? <Link href={dashboardLink} className="auth-btn" style={{ display:"none",alignItems:"center",gap:7,padding:"9px 20px",borderRadius:50,background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:13,fontWeight:800,textDecoration:"none",whiteSpace:"nowrap" }}>
                My Dashboard
              </Link>
            : <Link href="/auth" className="auth-btn" style={{ display:"none",alignItems:"center",gap:7,padding:"9px 20px",borderRadius:50,background:T,color:"#fff",fontSize:13,fontWeight:800,textDecoration:"none",whiteSpace:"nowrap" }}>
                Login / Sign Up
              </Link>
        )}
      </div>
    </header>
  )
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen]     = useState(false)
  const [coords, setCoords] = useState({ top:0, left:0, width:0 })
  const btnRef  = useRef(null)
  const menuRef = useRef(null)
  const active  = !!(value)

  const openMenu = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setCoords({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 200) })
    }
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const reposition = () => {
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect()
        setCoords({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 200) })
      }
    }
    window.addEventListener("scroll", reposition, true)
    window.addEventListener("resize", reposition)
    return () => { window.removeEventListener("scroll", reposition, true); window.removeEventListener("resize", reposition) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const fn = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return
      if (menuRef.current && menuRef.current.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", fn)
    document.addEventListener("touchstart", fn)
    return () => { document.removeEventListener("mousedown", fn); document.removeEventListener("touchstart", fn) }
  }, [open])

  return (
    <>
      <button ref={btnRef} onClick={() => open ? setOpen(false) : openMenu()}
        style={{ display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:50,cursor:"pointer",whiteSpace:"nowrap",minHeight:40,flexShrink:0,border:"1.5px solid "+(open||active?T:"#e2e8f0"),background:active?T+"12":"#fff",color:active?T:"#0d1f2d",fontSize:13,fontWeight:700,transition:"all 0.18s" }}>
        {active ? value : label}
        <ChevronDown size={13} style={{ transition:"transform 0.2s",transform:open?"rotate(180deg)":"none",flexShrink:0 }} />
      </button>
      {open && (
        <div ref={menuRef} style={{ position:"fixed",top:coords.top,left:coords.left,minWidth:coords.width,zIndex:9999,background:"#fff",border:"1.5px solid #e8edf2",borderRadius:16,boxShadow:"0 24px 64px rgba(0,0,0,0.16)",overflow:"hidden",animation:"dropIn 0.15s ease",maxHeight:"60vh",overflowY:"auto" }}>
          {options.map(opt => {
            const sel = value === opt
            return (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                style={{ display:"block",width:"100%",textAlign:"left",padding:"12px 18px",border:"none",cursor:"pointer",background:sel?T+"12":"#fff",color:sel?T:"#1a2332",fontSize:14,fontWeight:sel?700:500,borderBottom:"1px solid #f4f7fa",transition:"background 0.12s" }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.background="#f4f8fb" }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background="#fff" }}>
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

// ─── Pill ─────────────────────────────────────────────────────────────────────
function Pill({ label, active, onClick, color }) {
  const c = color || T
  return (
    <button onClick={onClick} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:50,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap",fontSize:13,fontWeight:700,minHeight:40,transition:"all 0.18s",border:"1.5px solid "+(active?c:"#e2e8f0"),background:active?c:"#fff",color:active?"#fff":"#64748b" }}>
      {label}
    </button>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ icon:Icon, color, label, title, onCta }) {
  return (
    <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:12,marginBottom:16,flexWrap:"wrap" }}>
      <div>
        <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:5 }}>
          <div style={{ width:26,height:26,borderRadius:8,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon size={13} color={color} />
          </div>
          <span style={{ fontSize:11,fontWeight:800,color:color,letterSpacing:"0.08em",textTransform:"uppercase" }}>{label}</span>
        </div>
        <h2 style={{ margin:0,fontSize:"clamp(18px,3.5vw,26px)",fontWeight:900,color:"#0d1f2d",letterSpacing:"-0.03em",fontFamily:"'DM Sans',system-ui,sans-serif" }}>{title}</h2>
      </div>
      {onCta && (
        <button onClick={onCta} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:50,border:"2px solid "+color,color:color,background:"transparent",fontSize:13,fontWeight:800,cursor:"pointer",minHeight:40,whiteSpace:"nowrap" }}>
          See all <ArrowRight size={13} />
        </button>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #f1f5f9" }}>
      <div style={{ height:200,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite" }} />
      <div style={{ padding:"15px 17px",display:"flex",flexDirection:"column",gap:10 }}>
        <div style={{ height:16,borderRadius:8,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"200% 100%",width:"70%",animation:"shimmer 1.5s infinite" }} />
        <div style={{ height:12,borderRadius:8,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"200% 100%",width:"50%",animation:"shimmer 1.5s infinite" }} />
      </div>
    </div>
  )
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ listing, saved, onSave, index }) {
  const isStudent = listing.category === "Student Housing"
  const tc        = TAG_COLORS[listing.tag] || { color:"#64748b", bg:"#f1f5f930" }
  const coverImg  = listing.cover_image || FALLBACK_IMG

  return (
    <article style={{ background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #f1f5f9",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column",animation:"fadeUp 0.45s ease "+(index*55)+"ms both" }}>
      <div style={{ position:"relative",height:200,overflow:"hidden",flexShrink:0 }}>
        <img src={coverImg} alt={listing.title} loading="lazy" decoding="async"
          style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s" }}
          onMouseEnter={e => (e.currentTarget.style.transform="scale(1.05)")}
          onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")}
        />
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)" }} />
        {listing.tag && (
          <span style={{ position:"absolute",top:12,left:12,background:tc.bg,color:tc.color,fontSize:11,fontWeight:800,padding:"4px 10px",borderRadius:50 }}>
            {listing.tag}
          </span>
        )}
        <button onClick={() => onSave(listing.id)} aria-pressed={saved}
          style={{ position:"absolute",top:8,right:8,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.92)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"transform 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)" }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)" }}>
          <Heart size={15} color={saved?"#ef4444":"#94a3b8"} fill={saved?"#ef4444":"none"} />
        </button>
        <div style={{ position:"absolute",bottom:10,left:12,display:"flex",gap:6 }}>
          <span style={{ background:isStudent?"#059669":T,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:50 }}>
            {isStudent?"Student":listing.listing_type}
          </span>
          {listing.is_verified && (
            <span style={{ background:"rgba(16,185,129,0.88)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:50,display:"flex",alignItems:"center",gap:3 }}>
              <CheckCircle size={9} /> Verified
            </span>
          )}
        </div>
      </div>
      <div style={{ padding:"15px 17px",flex:1,display:"flex",flexDirection:"column" }}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6,marginBottom:5 }}>
          <h3 style={{ margin:0,fontSize:14,fontWeight:800,color:"#0d1f2d",letterSpacing:"-0.02em",lineHeight:1.3 }}>{listing.title}</h3>
          <div style={{ display:"flex",alignItems:"center",gap:3,flexShrink:0 }}>
            <Star size={11} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize:12,fontWeight:700,color:"#64748b" }}>4.8</span>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:10 }}>
          <MapPin size={11} color={T} />
          <span style={{ fontSize:12,color:"#64748b" }}>{listing.city}, {listing.state}</span>
        </div>
        {listing.beds > 0 && (
          <div style={{ display:"flex",gap:12,marginBottom:12,paddingBottom:12,borderBottom:"1px solid #f1f5f9" }}>
            <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#64748b",fontWeight:600 }}><Bed size={12} color="#cbd5e1" />{listing.beds} Bed{listing.beds>1?"s":""}</span>
            <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#64748b",fontWeight:600 }}><Bath size={12} color="#cbd5e1" />{listing.baths} Bath{listing.baths>1?"s":""}</span>
            {listing.sqft && <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#64748b",fontWeight:600 }}><Maximize2 size={12} color="#cbd5e1" />{Number(listing.sqft).toLocaleString()} sqft</span>}
          </div>
        )}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto" }}>
          <span style={{ fontSize:19,fontWeight:900,color:T,letterSpacing:"-0.02em" }}>{listing.price_label}</span>
          <Link href={"/listings/"+listing.id}
            style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,background:"#f1f5f9",color:"#0d1f2d",fontSize:12,fontWeight:700,textDecoration:"none",transition:"all 0.2s",minHeight:36 }}
            onMouseEnter={e => { e.currentTarget.style.background=T; e.currentTarget.style.color="#fff" }}
            onMouseLeave={e => { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#0d1f2d" }}>
            View <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── Property Row (list view) ─────────────────────────────────────────────────
function PropertyRow({ listing, saved, onSave, index }) {
  const isStudent = listing.category === "Student Housing"
  const coverImg  = listing.cover_image || FALLBACK_IMG

  return (
    <article style={{ background:"#fff",borderRadius:18,overflow:"hidden",border:"1px solid #f1f5f9",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",display:"flex",animation:"fadeUp 0.4s ease "+(index*45)+"ms both" }}>
      <div style={{ position:"relative",width:"clamp(110px,26%,200px)",flexShrink:0 }}>
        <img src={coverImg} alt={listing.title} loading="lazy" decoding="async"
          style={{ width:"100%",height:"100%",objectFit:"cover",minHeight:130 }} />
        <span style={{ position:"absolute",top:8,left:8,background:isStudent?"#059669":T,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:50 }}>
          {isStudent?"Student":listing.listing_type}
        </span>
      </div>
      <div style={{ flex:1,padding:"14px 16px",display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0 }}>
        <div>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4 }}>
            <h3 style={{ margin:0,fontSize:15,fontWeight:800,color:"#0d1f2d",letterSpacing:"-0.02em",lineHeight:1.3 }}>{listing.title}</h3>
            <button onClick={() => onSave(listing.id)} aria-pressed={saved}
              style={{ width:32,height:32,borderRadius:"50%",background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
              <Heart size={13} color={saved?"#ef4444":"#94a3b8"} fill={saved?"#ef4444":"none"} />
            </button>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:6 }}>
            <MapPin size={11} color={T} />
            <span style={{ fontSize:12,color:"#64748b" }}>{listing.city}, {listing.state}</span>
            {listing.is_verified && <span style={{ fontSize:10,fontWeight:700,color:"#10b981",background:"#10b98118",padding:"2px 7px",borderRadius:50 }}>✓ Verified</span>}
          </div>
          {listing.beds > 0 && (
            <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
              <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#64748b" }}><Bed size={12} color="#cbd5e1" />{listing.beds} Beds</span>
              <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#64748b" }}><Bath size={12} color="#cbd5e1" />{listing.baths} Baths</span>
              {listing.sqft && <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#64748b" }}><Maximize2 size={12} color="#cbd5e1" />{Number(listing.sqft).toLocaleString()} sqft</span>}
            </div>
          )}
        </div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10 }}>
          <span style={{ fontSize:18,fontWeight:900,color:T,letterSpacing:"-0.02em" }}>{listing.price_label}</span>
          <Link href={"/listings/"+listing.id}
            style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,background:T,color:"#fff",fontSize:12,fontWeight:700,textDecoration:"none" }}>
            View <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ListingsPage() {
  const [listings,    setListings]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState("")
  const [activeType,  setActiveType]  = useState("All")
  const [activeState, setActiveState] = useState("All States")
  const [priceRange,  setPriceRange]  = useState(PRICE_RANGES[0])
  const [beds,        setBeds]        = useState("Any")
  const [sort,        setSort]        = useState("Newest")
  const [view,        setView]        = useState("grid")
  const [saved,       setSaved]       = useState([])
  const [page,        setPage]        = useState(1)
  const PER_PAGE = 9

  // ── Toggle save — writes to Supabase ────────────────────────────────────────
  const toggleSave = useCallback(async (id) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = "/auth"
      return
    }

    const isSaved = saved.includes(id)

    if (isSaved) {
      await supabase.from("saved_listings")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", id)
      setSaved(prev => prev.filter(x => x !== id))
    } else {
      await supabase.from("saved_listings")
        .insert({ user_id: user.id, listing_id: id })
      setSaved(prev => [...prev, id])
      // Increment saves count
      await supabase.rpc("increment_saves", { listing_id: id })
    }
  }, [saved])

  // ── Fetch listings + saved state ─────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)

      // 1. Fetch listings
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (listingsError) {
        setError(listingsError.message)
        setLoading(false)
        return
      }

      if (!listingsData || listingsData.length === 0) {
        setListings([])
        setLoading(false)
        return
      }

      // 2. Fetch cover images
      const listingIds = listingsData.map(l => l.id)
      const { data: imagesData } = await supabase
        .from("listing_images")
        .select("listing_id, url, is_cover")
        .in("listing_id", listingIds)

      // 3. Attach cover image
      const formatted = listingsData.map(listing => {
        const images     = imagesData ? imagesData.filter(img => img.listing_id === listing.id) : []
        const coverImage = images.find(img => img.is_cover)?.url || images[0]?.url || null
        return { ...listing, cover_image: coverImage }
      })

      setListings(formatted)

      // 4. Load saved listings for logged-in user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: savedData } = await supabase
          .from("saved_listings")
          .select("listing_id")
          .eq("user_id", user.id)
        if (savedData) setSaved(savedData.map(s => s.listing_id))
      }

      setLoading(false)
    }

    fetchAll()
  }, [])

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = listings.filter(l => {
    const matchType   = activeType === "All"
      ? true
      : activeType === "Student"
        ? l.category === "Student Housing"
        : l.listing_type === activeType && l.category !== "Student Housing"
    const matchState  = activeState === "All States" || l.state === activeState
    const matchPrice  = l.price >= priceRange.min && l.price <= priceRange.max
    const matchBeds   = beds === "Any" || l.beds >= parseInt(beds)
    const matchSearch = !search.trim() ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.state.toLowerCase().includes(search.toLowerCase())
    return matchType && matchState && matchPrice && matchBeds && matchSearch
  })

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price
    if (sort === "Price: High to Low") return b.price - a.price
    if (sort === "Most Popular")       return b.views - a.views
    return new Date(b.created_at) - new Date(a.created_at)
  })

  const totalPages  = Math.ceil(sorted.length / PER_PAGE)
  const paginated   = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const hasFilters  = activeType !== "All" || activeState !== "All States" || priceRange.label !== "Any Price" || beds !== "Any" || !!search.trim()
  const showCurated = !hasFilters && sort === "Newest"

  const featuredItems = listings.filter(l => l.is_featured)
  const popularItems  = listings.filter(l => l.is_popular)
  const studentItems  = listings.filter(l => l.category === "Student Housing")

  useEffect(() => { setPage(1) }, [search, activeType, activeState, priceRange, beds, sort])

  const clearAll = () => {
    setSearch(""); setActiveType("All"); setActiveState("All States")
    setPriceRange(PRICE_RANGES[0]); setBeds("Any"); setSort("Newest")
  }

  return (
    <div style={{ minHeight:"100svh",background:"#f8fafc",fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <NavBar />

      {/* Header */}
      <div style={{ background:DARK,paddingTop:64,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:0,right:"10%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,"+T+"18 0%,transparent 65%)",pointerEvents:"none" }} />
        <div className="container" style={{ maxWidth:1400,margin:"0 auto",padding:"36px 16px 28px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <Link href="/" style={{ fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",fontWeight:600 }}>Home</Link>
            <ChevronRight size={13} color="rgba(255,255,255,0.25)" />
            <span style={{ fontSize:13,color:T,fontWeight:700 }}>Listings</span>
          </div>
          <h1 style={{ margin:"0 0 6px",fontSize:"clamp(24px,5vw,44px)",fontWeight:900,color:"#fff",letterSpacing:"-0.03em",fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            Browse Properties
          </h1>
          <p style={{ margin:"0 0 24px",fontSize:15,color:"rgba(255,255,255,0.45)" }}>
            {loading ? "Loading properties…" : sorted.length + " verified properties across Nigeria"}
          </p>
          <div style={{ display:"flex",gap:10,maxWidth:680 }}>
            <div style={{ flex:1,display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:14,padding:"0 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.2)",minHeight:52 }}>
              <Search size={17} color="#94a3b8" style={{ flexShrink:0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by city, state or property name…"
                style={{ flex:1,border:"none",outline:"none",background:"transparent",fontSize:16,color:"#0d1f2d",fontFamily:"inherit",padding:"14px 0",minWidth:0 }} />
              {search && <button onClick={() => setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",padding:0,display:"flex" }}><X size={15} color="#94a3b8" /></button>}
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background:"#fff",borderBottom:"1px solid #f1f5f9",position:"sticky",top:64,zIndex:150,boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="container" style={{ maxWidth:1400,margin:"0 auto",padding:"0 16px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,paddingTop:10,paddingBottom:6,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>
            {TYPES.map(t => (
              <Pill key={t} label={t} active={activeType===t} onClick={() => setActiveType(t)} color={t==="Student"?"#059669":T} />
            ))}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,paddingBottom:10,flexWrap:"wrap" }}>
            <Dropdown label="State"    value={activeState!=="All States"?activeState:""}         options={STATES}                      onChange={v => setActiveState(v)} />
            <Dropdown label="Price"    value={priceRange.label!=="Any Price"?priceRange.label:""} options={PRICE_RANGES.map(p => p.label)} onChange={v => setPriceRange(PRICE_RANGES.find(p => p.label===v))} />
            <Dropdown label="Bedrooms" value={beds!=="Any"?beds:""}                               options={BEDS_OPTIONS}                onChange={v => setBeds(v)} />
            {hasFilters && (
              <button onClick={clearAll} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:50,border:"1.5px solid #fca5a5",background:"#fef2f2",color:"#dc2626",fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0,minHeight:40,whiteSpace:"nowrap" }}>
                <X size={13} /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ maxWidth:1400,margin:"0 auto",padding:"32px 16px 64px" }}>

        {error && (
          <div style={{ textAlign:"center",padding:"60px 20px" }}>
            <p style={{ color:"#ef4444",fontSize:14,fontWeight:600 }}>Failed to load listings: {error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop:16,padding:"10px 24px",borderRadius:50,background:T,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer" }}>Try Again</button>
          </div>
        )}

        {loading && !error && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,295px),1fr))",gap:18 }}>
            {[...Array(6)].map((_,i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && !error && showCurated && (
          <>
            {featuredItems.length > 0 && (
              <section style={{ marginBottom:44 }}>
                <SectionLabel icon={Sparkles} color="#f59e0b" label="Hand-picked" title="Featured Properties" onCta={() => {}} />
                <div style={{ display:"flex",gap:14,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>
                  {featuredItems.map((l,i) => (
                    <div key={l.id} style={{ flexShrink:0,width:"clamp(220px,58vw,265px)" }}>
                      <PropertyCard listing={l} saved={saved.includes(l.id)} onSave={toggleSave} index={i} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {popularItems.length > 0 && (
              <section style={{ marginBottom:44 }}>
                <SectionLabel icon={Flame} color="#ef4444" label="Trending now" title="Most Popular" onCta={() => setSort("Most Popular")} />
                <div style={{ display:"flex",gap:14,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>
                  {popularItems.map((l,i) => (
                    <div key={l.id} style={{ flexShrink:0,width:"clamp(220px,58vw,265px)" }}>
                      <PropertyCard listing={l} saved={saved.includes(l.id)} onSave={toggleSave} index={i} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {studentItems.length > 0 && (
              <section style={{ marginBottom:44 }}>
                <div style={{ background:"linear-gradient(135deg,#064e3b 0%,#065f46 100%)",borderRadius:20,padding:"22px 20px 0",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:-24,right:-24,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none" }} />
                  <SectionLabel icon={GraduationCap} color="#6ee7b7" label="Near universities" title="Student Housing" onCta={() => setActiveType("Student")} />
                  <div style={{ display:"flex",gap:14,overflowX:"auto",paddingBottom:22,scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>
                    {studentItems.map((l,i) => (
                      <div key={l.id} style={{ flexShrink:0,width:"clamp(220px,58vw,265px)" }}>
                        <PropertyCard listing={l} saved={saved.includes(l.id)} onSave={toggleSave} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:28 }}>
              <div style={{ flex:1,height:1,background:"#e2e8f0" }} />
              <span style={{ fontSize:12,fontWeight:700,color:"#94a3b8",whiteSpace:"nowrap",letterSpacing:"0.06em",textTransform:"uppercase" }}>All Properties</span>
              <div style={{ flex:1,height:1,background:"#e2e8f0" }} />
            </div>
          </>
        )}

        {!loading && !error && (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:20,flexWrap:"wrap",position:"relative",zIndex:160 }}>
            <div>
              <span style={{ fontSize:15,fontWeight:800,color:"#0d1f2d" }}>{sorted.length} Properties</span>
              {hasFilters && <span style={{ fontSize:13,color:"#94a3b8",marginLeft:8 }}>matching filters</span>}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <Dropdown label="Sort" value={sort} options={SORTS} onChange={setSort} />
              <div style={{ display:"flex",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:12,overflow:"hidden" }}>
                {[["grid",Grid3x3],["list",List]].map(([v,Icon]) => (
                  <button key={v} onClick={() => setView(v)}
                    style={{ width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer",background:view===v?T:"#fff",transition:"all 0.2s" }}>
                    <Icon size={16} color={view===v?"#fff":"#94a3b8"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && paginated.length === 0 && (
          <div style={{ textAlign:"center",padding:"80px 20px" }}>
            <div style={{ fontSize:48,marginBottom:16 }}>🏠</div>
            <h3 style={{ margin:"0 0 8px",fontSize:20,fontWeight:800,color:"#0d1f2d" }}>No properties found</h3>
            <p style={{ color:"#64748b",marginBottom:24 }}>Try adjusting your filters or search term</p>
            <button onClick={clearAll} style={{ padding:"11px 28px",borderRadius:50,background:T,border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}>Clear Filters</button>
          </div>
        )}

        {!loading && !error && paginated.length > 0 && (
          <div style={view==="grid" ? { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,295px),1fr))",gap:18 } : { display:"flex",flexDirection:"column",gap:14 }}>
            {paginated.map((l,i) =>
              view === "grid"
                ? <PropertyCard key={l.id} listing={l} saved={saved.includes(l.id)} onSave={toggleSave} index={i} />
                : <PropertyRow  key={l.id} listing={l} saved={saved.includes(l.id)} onSave={toggleSave} index={i} />
            )}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:48,flexWrap:"wrap" }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ width:40,height:40,borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:page===1?"not-allowed":"pointer",opacity:page===1?0.4:1 }}>
              <ChevronLeft size={16} color="#64748b" />
            </button>
            {[...Array(totalPages)].map((_,i) => {
              const pg   = i+1
              const near = pg===1||pg===totalPages||Math.abs(pg-page)<=1
              if (!near) {
                if (pg===2||pg===totalPages-1) return <span key={pg} style={{ color:"#94a3b8",fontSize:14,padding:"0 2px" }}>…</span>
                return null
              }
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  style={{ width:40,height:40,borderRadius:10,border:"1.5px solid "+(page===pg?T:"#e2e8f0"),background:page===pg?T:"#fff",color:page===pg?"#fff":"#64748b",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.2s" }}>
                  {pg}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ width:40,height:40,borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:page===totalPages?"not-allowed":"pointer",opacity:page===totalPages?0.4:1 }}>
              <ChevronRight size={16} color="#64748b" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin:0; max-width:100vw; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { display:none; }
        input::placeholder { color:#94a3b8; }
        input:focus { outline:none; }
        a, button { -webkit-tap-highlight-color:transparent; }
        :focus-visible { outline:2px solid ${T}; outline-offset:3px; border-radius:4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes dropIn { from{opacity:0;transform:translateY(-6px) scale(0.98)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media (min-width:768px) {
          .nav-inner { padding:0 24px !important; }
          .container { padding-left:24px !important; padding-right:24px !important; }
          .desktop-nav { display:flex !important; }
          .auth-btn { display:flex !important; }
        }
        @media (min-width:1024px) {
          .nav-inner { padding:0 32px !important; }
          .container { padding-left:32px !important; padding-right:32px !important; }
        }
        @media (prefers-reduced-motion:reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}