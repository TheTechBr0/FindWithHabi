"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, ArrowRight, CheckCircle, X, Plus,
  Home, Building2, MapPin, DollarSign, Image, FileText,
  Bed, Bath, Maximize2, Zap, Eye,
  ChevronRight, AlertCircle, Camera, TrendingUp, Upload, Loader,
} from "lucide-react"

const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

const PROPERTY_TYPES  = ["Buy", "Rent", "Lease", "Commercial"]
const PROPERTY_CATS   = ["Residential", "Commercial", "Student Housing", "Industrial", "Land"]
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
]
const AMENITIES_LIST = [
  "Swimming Pool","Generator (Full)","Borehole Water","24hr Security","CCTV",
  "Boys Quarters","Fitted Kitchen","Air Conditioning","Parking Space","Smart Home",
  "Gym / Fitness Room","Rooftop Terrace","Elevator / Lift","Waterfront View",
  "Solar Panels","Fibre Internet","POP Ceilings","Italian Tiles","Home Cinema",
  "Laundry Room","Study / Office","Garden / Compound","Gated Estate","Intercom",
  "DSTV / Cable","Prepaid Meter","Diesel Generator","Inverter Backup","Jetty Access","Staff Quarters",
]
const STEPS = [
  { id: 1, label: "Property Info", icon: Home       },
  { id: 2, label: "Location",      icon: MapPin     },
  { id: 3, label: "Details",       icon: Bed        },
  { id: 4, label: "Pricing",       icon: DollarSign },
  { id: 5, label: "Photos",        icon: Image      },
  { id: 6, label: "Amenities",     icon: Zap        },
  { id: 7, label: "Description",   icon: FileText   },
  { id: 8, label: "Review",        icon: Eye        },
]

const EMPTY_FORM = {
  listingType: "Buy", category: "Residential", title: "",
  state: "", city: "", address: "", landmark: "",
  beds: 3, baths: 2, toilets: 2, sqft: "", floors: 1,
  yearBuilt: "", condition: "New", furnished: "Unfurnished",
  price: "", negotiable: false, serviceFee: "", cautionFee: "",
  photos: [],   // { file, preview, url, uploading, error }
  amenities: [], description: "", highlights: "",
}

// ─── Input components ─────────────────────────────────────────────────────────
const inputBase = {
  width: "100%", padding: "13px 16px", borderRadius: 14,
  border: "1.5px solid #e2e8f0", fontSize: 15, color: "#0d1f2d",
  fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none",
  background: "#f8fafc", boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
}

function Field({ label, required, hint, error, ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label} {required && <span style={{ color: "#ef4444" }}>*</span>}</label>}
      <input {...rest}
        style={{ ...inputBase, borderColor: error ? "#ef4444" : "#e2e8f0", ...rest.style }}
        onFocus={e => { e.target.style.borderColor = error ? "#ef4444" : T; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px " + T + "18" }}
        onBlur={e => { e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none" }}
      />
      {hint && !error && <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{hint}</p>}
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

function Select({ label, required, error, options, placeholder, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label} {required && <span style={{ color: "#ef4444" }}>*</span>}</label>}
      <select value={value} onChange={onChange}
        style={{ ...inputBase, cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 44, borderColor: error ? "#ef4444" : "#e2e8f0" }}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px " + T + "18" }}
        onBlur={e => { e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none" }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

function Textarea({ label, required, hint, error, value, onChange, rows = 5, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label} {required && <span style={{ color: "#ef4444" }}>*</span>}</label>}
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
        style={{ ...inputBase, resize: "vertical", minHeight: rows * 24, borderColor: error ? "#ef4444" : "#e2e8f0" }}
        onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px " + T + "18" }}
        onBlur={e => { e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none" }}
      />
      {hint && !error && <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{hint}</p>}
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

function PillSelect({ label, required, options, value, onChange, color }) {
  const c = color || T
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label} {required && <span style={{ color: "#ef4444" }}>*</span>}</label>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(o => {
          const active = value === o
          return (
            <button key={o} type="button" onClick={() => onChange(o)}
              style={{ padding: "9px 18px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 700, transition: "all 0.18s", border: "1.5px solid " + (active ? c : "#e2e8f0"), background: active ? c : "#fff", color: active ? "#fff" : "#64748b", boxShadow: active ? "0 4px 14px " + c + "30" : "none" }}>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stepper({ label, value, onChange, min = 0, max = 20, icon: Icon }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={15} color="#94a3b8" />}{label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden", width: "fit-content" }}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          style={{ width: 44, height: 44, border: "none", background: "transparent", cursor: "pointer", fontSize: 20, color: value <= min ? "#cbd5e1" : "#0d1f2d", fontWeight: 300 }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}>−</button>
        <div style={{ minWidth: 52, textAlign: "center", fontSize: 17, fontWeight: 900, color: "#0d1f2d", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{value}</div>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
          style={{ width: 44, height: 44, border: "none", background: "transparent", cursor: "pointer", fontSize: 20, color: value >= max ? "#cbd5e1" : "#0d1f2d", fontWeight: 300 }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}>+</button>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "28px", border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", animation: "fadeUp 0.45s ease both" }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid #f8fafc" }}>
          {title && <h2 style={{ margin: "0 0 5px", fontSize: 18, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>{title}</h2>}
          {subtitle && <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── Photo Upload — with real file upload to Supabase Storage ─────────────────
function PhotoUpload({ photos, onAdd, onRemove, onSetCover, userId }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver]   = useState(false)

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter(f => {
      if (!f.type.startsWith("image/")) return false
      if (f.size > 10 * 1024 * 1024) return false // 10MB limit
      return true
    })

    if (validFiles.length === 0) {
      alert("Please select valid image files (JPG, PNG, WEBP) under 10MB each.")
      return
    }

    if (photos.length + validFiles.length > 10) {
      alert("Maximum 10 photos allowed per listing.")
      return
    }

    setUploading(true)

    for (const file of validFiles) {
      // Create local preview immediately
      const preview = URL.createObjectURL(file)
      const tempId  = "temp-" + Date.now() + "-" + Math.random()

      // Add placeholder with uploading state
      onAdd({ id: tempId, preview, url: null, uploading: true, error: null, file })

      // Upload to Supabase Storage
      const ext      = file.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error } = await supabase.storage
        .from("listing-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false })

      if (error) {
        onAdd({ id: tempId, preview, url: null, uploading: false, error: error.message, file }, true)
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(data.path)

      // Update placeholder with real URL
      onAdd({ id: tempId, preview, url: publicUrl, uploading: false, error: null, file }, true)
    }

    setUploading(false)
  }

  const handleFileInput = (e) => {
    uploadFiles(e.target.files)
    e.target.value = "" // reset so same file can be re-selected
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    uploadFiles(e.dataTransfer.files)
  }

  const allUploaded = photos.length > 0 && photos.every(p => !p.uploading)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileInput}
        style={{ display: "none" }} aria-label="Upload property photos" />

      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: "2px dashed " + (dragOver ? T : "#e2e8f0"),
          borderRadius: 20, padding: "40px 20px", textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer", transition: "all 0.2s",
          background: dragOver ? T + "06" : "#f8fafc",
        }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: T + "12", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          {uploading ? <Loader size={24} color={T} style={{ animation: "spin 1s linear infinite" }} /> : <Camera size={24} color={T} />}
        </div>
        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>
          {uploading ? "Uploading photos…" : "Click to upload photos"}
        </p>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#94a3b8" }}>
          {uploading ? "Please wait" : "or drag and drop here"}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "#cbd5e1" }}>JPG, PNG, WEBP up to 10MB each · Max 10 photos</p>
      </div>

      {/* Photo previews */}
      {photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 10 }}>
          {photos.map((photo, i) => (
            <div key={photo.id || i} style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: "#f1f5f9" }}>
              <img src={photo.preview || photo.url} alt={"Photo " + (i + 1)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: photo.uploading ? 0.5 : 1 }} />

              {/* Uploading spinner overlay */}
              {photo.uploading && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                  <Loader size={24} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
                </div>
              )}

              {/* Error overlay */}
              {photo.error && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.7)", padding: 8 }}>
                  <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, textAlign: "center" }}>Upload failed</span>
                </div>
              )}

              {/* Cover badge */}
              {i === 0 && !photo.uploading && !photo.error && (
                <div style={{ position: "absolute", top: 8, left: 8, background: T, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 50 }}>Cover</div>
              )}

              {/* Remove button */}
              {!photo.uploading && (
                <button type="button" onClick={() => onRemove(i)}
                  style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={13} color="#fff" />
                </button>
              )}

              {/* Success indicator */}
              {!photo.uploading && !photo.error && photo.url && (
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={12} color="#fff" />
                </div>
              )}
            </div>
          ))}

          {/* Add more slot */}
          {photos.length < 10 && !uploading && (
            <button type="button" onClick={() => inputRef.current?.click()}
              style={{ borderRadius: 14, border: "2px dashed #e2e8f0", background: "#f8fafc", cursor: "pointer", aspectRatio: "4/3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.background = T + "06" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc" }}>
              <Plus size={20} color="#94a3b8" />
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Add more</span>
            </button>
          )}
        </div>
      )}

      {/* Upload status */}
      {photos.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {allUploaded
            ? <p style={{ margin: 0, fontSize: 12, color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}><CheckCircle size={13} /> {photos.filter(p => !p.error).length} photo{photos.length !== 1 ? "s" : ""} uploaded successfully</p>
            : <p style={{ margin: 0, fontSize: 12, color: T, display: "flex", alignItems: "center", gap: 5 }}><Loader size={13} style={{ animation: "spin 1s linear infinite" }} /> Uploading {photos.filter(p => p.uploading).length} photo{photos.filter(p => p.uploading).length !== 1 ? "s" : ""}…</p>}
        </div>
      )}

      <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
        ⭐ The first photo will be used as the cover image
      </p>
    </div>
  )
}

// ─── Step Progress ────────────────────────────────────────────────────────────
function StepProgress({ current, total, steps }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="step-mobile" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: T }}>Step {current} of {total}</span>
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{steps[current - 1]?.label}</span>
      </div>
      <div style={{ height: 6, borderRadius: 50, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 50, background: T, width: ((current / total) * 100) + "%", transition: "width 0.4s ease", boxShadow: "0 0 8px " + T_GLOW }} />
      </div>
      <div className="step-desktop" style={{ display: "none", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        {steps.map((s, i) => {
          const done   = i + 1 < current
          const active = i + 1 === current
          const Icon   = s.icon
          return (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? T : active ? T + "18" : "#f1f5f9", border: "2px solid " + (done || active ? T : "#e2e8f0"), display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                {done ? <CheckCircle size={16} color="#fff" /> : <Icon size={15} color={active ? T : "#94a3b8"} />}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? T : done ? "#64748b" : "#cbd5e1", textAlign: "center", whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Review Row ───────────────────────────────────────────────────────────────
function ReviewRow({ label, value, onEdit, step }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid #f8fafc" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d" }}>{value}</div>
      </div>
      <button type="button" onClick={() => onEdit(step)}
        style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.color = T }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
        Edit
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AddListingPage() {
  const [step, setStep]               = useState(1)
  const [submitted, setSubmitted]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errors, setErrors]           = useState({})
  const [form, setForm]               = useState(EMPTY_FORM)
  const [userId, setUserId]           = useState(null)

  // Get user ID on mount
  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  })

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }))

  // ── Handle photo add/update ─────────────────────────────────────────────────
  const handlePhotoAdd = useCallback((photo, isUpdate = false) => {
    setForm(p => {
      if (isUpdate) {
        // Update existing placeholder by id
        return { ...p, photos: p.photos.map(ph => ph.id === photo.id ? photo : ph) }
      }
      return { ...p, photos: [...p.photos, photo] }
    })
  }, [])

  const handlePhotoRemove = useCallback((index) => {
    setForm(p => {
      const photo = p.photos[index]
      // Revoke blob URL to free memory
      if (photo?.preview && photo.preview.startsWith("blob:")) {
        URL.revokeObjectURL(photo.preview)
      }
      return { ...p, photos: p.photos.filter((_, i) => i !== index) }
    })
  }, [])

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (s) => {
    const e = {}
    if (s === 1) { if (!form.title.trim()) e.title = "Property title is required" }
    if (s === 2) {
      if (!form.state) e.state = "Please select a state"
      if (!form.city.trim()) e.city = "City / area is required"
      if (!form.address.trim()) e.address = "Address is required"
    }
    if (s === 3) { if (form.category !== "Land" && !form.sqft) e.sqft = "Property size is required" }
    if (s === 4) { if (!form.price.trim()) e.price = "Listing price is required" }
    if (s === 5) {
      const uploaded = form.photos.filter(p => p.url && !p.error)
      if (uploaded.length === 0) e.photos = "Please upload at least one photo"
      const stillUploading = form.photos.some(p => p.uploading)
      if (stillUploading) e.photos = "Please wait for photos to finish uploading"
    }
    if (s === 7) { if (form.description.trim().length < 50) e.description = "Please write at least 50 characters" }
    return e
  }

  const next = () => {
    const e = validate(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => Math.min(STEPS.length, s + 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const back = () => {
    setErrors({})
    setStep(s => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToStep = (s) => {
    setErrors({})
    setStep(s)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleAmenity = (a) => {
    setForm(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }))
  }

  // ── Submit to Supabase ──────────────────────────────────────────────────────
  const submit = async () => {
    setSubmitting(true)
    setSubmitError("")

    try {
      // 1. Get logged in user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setSubmitError("You must be logged in to submit a listing.")
        setSubmitting(false)
        return
      }

      // 2. Get agent ID
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (agentError || !agentData) {
        setSubmitError("Could not find your agent profile. Please contact support.")
        setSubmitting(false)
        return
      }

      // 3. Format price label
      const priceNum = parseFloat(form.price)
      let priceLabel = "₦" + priceNum.toLocaleString()
      if (form.listingType === "Rent")  priceLabel += "/mo"
      if (form.listingType === "Lease") priceLabel += "/mo"
      if (form.category === "Student Housing") priceLabel = "₦" + priceNum.toLocaleString() + "/yr"

      // 4. Save listing
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          agent_id:     agentData.id,
          title:        form.title,
          description:  form.description,
          highlights:   form.highlights,
          listing_type: form.listingType,
          category:     form.category,
          state:        form.state,
          city:         form.city,
          address:      form.address,
          landmark:     form.landmark,
          beds:         form.beds,
          baths:        form.baths,
          toilets:      form.toilets,
          floors:       form.floors,
          sqft:         form.sqft ? parseFloat(form.sqft) : null,
          year_built:   form.yearBuilt ? parseInt(form.yearBuilt) : null,
          condition:    form.condition,
          furnished:    form.furnished,
          price:        priceNum,
          price_label:  priceLabel,
          negotiable:   form.negotiable,
          service_fee:  form.serviceFee ? parseFloat(form.serviceFee) : null,
          caution_fee:  form.cautionFee ? parseFloat(form.cautionFee) : null,
          status:       "pending",
          is_verified:  false,
          is_featured:  false,
          is_popular:   false,
        })
        .select()
        .single()

      if (listingError) {
        setSubmitError("Error saving listing: " + listingError.message)
        setSubmitting(false)
        return
      }

      // 5. Save photo URLs (already uploaded to storage)
      const successPhotos = form.photos.filter(p => p.url && !p.error)
      if (successPhotos.length > 0) {
        const imageRows = successPhotos.map((photo, i) => ({
          listing_id: listing.id,
          url:        photo.url,
          is_cover:   i === 0,
          sort_order: i,
        }))
        const { error: imgError } = await supabase.from("listing_images").insert(imageRows)
        if (imgError) console.error("Image record error:", imgError.message)
      }

      // 6. Save amenities
      if (form.amenities.length > 0) {
        const { data: amenityRows } = await supabase
          .from("amenities")
          .select("id, name")
          .in("name", form.amenities)

        if (amenityRows && amenityRows.length > 0) {
          const junctionRows = amenityRows.map(a => ({ listing_id: listing.id, amenity_id: a.id }))
          const { error: amenityError } = await supabase.from("listing_amenities").insert(junctionRows)
          if (amenityError) console.error("Amenity save error:", amenityError.message)
        }
      }

      setSubmitting(false)
      setSubmitted(true)

    } catch (err) {
      setSubmitError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    const coverPhoto = form.photos.find(p => p.url)
    return (
      <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          {coverPhoto && (
            <div style={{ width: 120, height: 90, borderRadius: 16, overflow: "hidden", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
              <img src={coverPhoto.url} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: T + "12", border: "3px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
            <CheckCircle size={34} color={T} />
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(22px,5vw,34px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Listing Submitted!</h1>
          <p style={{ margin: "0 0 10px", fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
            <strong style={{ color: "#0d1f2d" }}>{form.title}</strong> has been submitted for review.
          </p>
          <p style={{ margin: "0 0 32px", fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
            Admin will review within 24 hours. You will be notified once it goes live.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/dashboard/agent" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 16, background: T, color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 800, boxShadow: "0 8px 24px " + T_GLOW }}>
              Go to Dashboard <ArrowRight size={16} />
            </Link>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm(EMPTY_FORM) }}
              style={{ padding: "14px", borderRadius: 16, background: "#fff", border: "1.5px solid #e2e8f0", color: "#64748b", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Add Another Listing
            </button>
          </div>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,800;9..40,900&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; }
          @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>
      </div>
    )
  }

  const coverPhoto = form.photos.find(p => p.url && !p.error)

  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* Topbar */}
      <header style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/dashboard/agent" style={{ display: "flex", alignItems: "center", gap: 7, color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b" }}>
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <div style={{ width: 1, height: 18, background: "#e2e8f0" }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.02em" }}>Add New Listing</span>
          </div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </Link>
        </div>
      </header>

      <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px 80px" }}>
        <StepProgress current={step} total={STEPS.length} steps={STEPS} />

        {/* ── Step 1: Property Info ── */}
        {step === 1 && (
          <Section title="Property Information" subtitle="Tell us the basics about your listing">
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <PillSelect label="Listing Type" required options={PROPERTY_TYPES} value={form.listingType} onChange={v => update("listingType", v)} />
              <PillSelect label="Property Category" required options={PROPERTY_CATS} value={form.category} onChange={v => update("category", v)} color="#8b5cf6" />
              <Field label="Property Title" required placeholder="e.g. Spacious 4-Bedroom Duplex with Pool"
                value={form.title} onChange={e => update("title", e.target.value)}
                error={errors.title} hint="Make it descriptive — buyers search by keywords" />
            </div>
          </Section>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <Section title="Location Details" subtitle="Help buyers find this property on the map">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }} className="two-col">
                <Select label="State" required options={NIGERIAN_STATES} placeholder="Select state"
                  value={form.state} onChange={e => update("state", e.target.value)} error={errors.state} />
                <Field label="City / Area" required placeholder="e.g. Victoria Island, Lekki Phase 1"
                  value={form.city} onChange={e => update("city", e.target.value)} error={errors.city} />
              </div>
              <Field label="Street Address" required placeholder="e.g. 14 Adeola Odeku Street"
                value={form.address} onChange={e => update("address", e.target.value)}
                error={errors.address} hint="Exact address only shown to verified buyers after enquiry" />
              <Field label="Nearest Landmark" placeholder="e.g. Opposite Eko Hotel"
                value={form.landmark} onChange={e => update("landmark", e.target.value)}
                hint="Helps buyers locate the property easily" />
            </div>
          </Section>
        )}

        {/* ── Step 3: Details ── */}
        {step === 3 && (
          <Section title="Property Details" subtitle="Dimensions, features and condition">
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {form.category !== "Land" && form.category !== "Commercial" && (
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Rooms & Bathrooms</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                    <Stepper label="Bedrooms"  value={form.beds}    onChange={v => update("beds", v)}    min={0} max={20} icon={Bed}        />
                    <Stepper label="Bathrooms" value={form.baths}   onChange={v => update("baths", v)}   min={0} max={20} icon={Bath}       />
                    <Stepper label="Toilets"   value={form.toilets} onChange={v => update("toilets", v)} min={0} max={20} icon={CheckCircle} />
                    <Stepper label="Floors"    value={form.floors}  onChange={v => update("floors", v)}  min={1} max={50} icon={Building2}   />
                  </div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }} className="two-col">
                <Field label={form.category === "Land" ? "Land Size (sqm or plots)" : "Property Size (sqft)"} required
                  placeholder={form.category === "Land" ? "e.g. 600" : "e.g. 2400"} type="number"
                  value={form.sqft} onChange={e => update("sqft", e.target.value)} error={errors.sqft} />
                <Field label="Year Built" placeholder="e.g. 2022" type="number"
                  value={form.yearBuilt} onChange={e => update("yearBuilt", e.target.value)} hint="Leave blank if unknown" />
              </div>
              <PillSelect label="Condition" options={["New","Newly Renovated","Good","Needs Renovation"]} value={form.condition} onChange={v => update("condition", v)} color="#10b981" />
              {form.category !== "Land" && form.category !== "Commercial" && (
                <PillSelect label="Furnishing" options={["Unfurnished","Semi-Furnished","Fully Furnished"]} value={form.furnished} onChange={v => update("furnished", v)} color="#f59e0b" />
              )}
            </div>
          </Section>
        )}

        {/* ── Step 4: Pricing ── */}
        {step === 4 && (
          <Section title="Pricing" subtitle="Set a competitive price for your listing">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: T + "08", border: "1.5px solid " + T + "25", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <TrendingUp size={18} color={T} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: T }}>Market Insight</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                    Similar <strong>{form.category.toLowerCase()}</strong> listings in <strong>{form.city || "your area"}</strong> are priced between <strong>₦45M – ₦120M</strong>.
                  </p>
                </div>
              </div>
              <Field label={form.listingType === "Buy" ? "Sale Price (₦)" : "Monthly Rent / Lease (₦)"} required
                placeholder={form.listingType === "Buy" ? "e.g. 85000000" : "e.g. 500000"} type="number"
                value={form.price} onChange={e => update("price", e.target.value)}
                error={errors.price} hint="Enter the amount in Naira without commas" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 14, background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1f2d", marginBottom: 2 }}>Price is Negotiable</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Allow buyers to make offers below asking price</div>
                </div>
                <div onClick={() => update("negotiable", !form.negotiable)}
                  style={{ width: 48, height: 26, borderRadius: 50, background: form.negotiable ? T : "#e2e8f0", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: form.negotiable ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                </div>
              </div>
              {(form.listingType === "Rent" || form.listingType === "Lease") && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }} className="two-col">
                  <Field label="Service Charge (₦/yr)" placeholder="e.g. 150000" type="number"
                    value={form.serviceFee} onChange={e => update("serviceFee", e.target.value)} hint="Annual estate service fee" />
                  <Field label="Caution Fee (₦)" placeholder="e.g. 100000" type="number"
                    value={form.cautionFee} onChange={e => update("cautionFee", e.target.value)} hint="Refundable security deposit" />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Step 5: Photos ── */}
        {step === 5 && (
          <Section title="Property Photos" subtitle="Upload real photos of the property — high quality gets 3x more enquiries">
            <PhotoUpload
              photos={form.photos}
              onAdd={handlePhotoAdd}
              onRemove={handlePhotoRemove}
              userId={userId}
            />
            {errors.photos && (
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}>
                <AlertCircle size={12} />{errors.photos}
              </p>
            )}
            <div style={{ marginTop: 20, background: "#f8fafc", borderRadius: 16, padding: "16px 18px" }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: "#0d1f2d" }}>📸 Photo Tips</p>
              <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {["Shoot during daytime with natural light for best results","Include exterior, living room, kitchen, bedrooms and bathrooms","Avoid clutter — make beds before shooting","Landscape (horizontal) photos look best on the platform"].map(tip => (
                  <li key={tip} style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{tip}</li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {/* ── Step 6: Amenities ── */}
        {step === 6 && (
          <Section title="Amenities & Features" subtitle="Select everything available in or around the property">
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T }}>{form.amenities.length} selected</span>
              {form.amenities.length > 0 && (
                <button type="button" onClick={() => update("amenities", [])}
                  style={{ marginLeft: 12, fontSize: 12, fontWeight: 700, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Clear all
                </button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 185px), 1fr))", gap: 10 }}>
              {AMENITIES_LIST.map(a => {
                const selected = form.amenities.includes(a)
                return (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 14, cursor: "pointer", border: "1.5px solid " + (selected ? T : "#e2e8f0"), background: selected ? T + "08" : "#f8fafc", color: selected ? T : "#64748b", fontSize: 13, fontWeight: selected ? 700 : 500, textAlign: "left", transition: "all 0.18s" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, border: "2px solid " + (selected ? T : "#e2e8f0"), background: selected ? T : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.18s" }}>
                      {selected && <CheckCircle size={11} color="#fff" />}
                    </div>
                    {a}
                  </button>
                )
              })}
            </div>
          </Section>
        )}

        {/* ── Step 7: Description ── */}
        {step === 7 && (
          <Section title="Property Description" subtitle="Write a compelling description that sells your listing">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Textarea label="Full Description" required rows={7}
                placeholder="Describe this property in detail. Talk about the layout, finishes, neighbourhood, nearby landmarks, and why it is a great investment or home..."
                value={form.description} onChange={e => update("description", e.target.value)}
                error={errors.description}
                hint={"Minimum 50 characters · " + form.description.length + " characters written"} />
              <Textarea label="Key Highlights (optional)" rows={3}
                placeholder={"List standout features:\n• 5 minutes from Lekki Toll Gate\n• Newly renovated in 2024\n• All documents available (C of O)"}
                value={form.highlights} onChange={e => update("highlights", e.target.value)}
                hint="Bullet points for quick scanning by buyers" />
            </div>
          </Section>
        )}

        {/* ── Step 8: Review ── */}
        {step === 8 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {coverPhoto && (
              <div style={{ borderRadius: 24, overflow: "hidden", height: "clamp(180px,35vw,280px)", position: "relative", animation: "fadeUp 0.45s ease both" }}>
                <img src={coverPhoto.url} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 18, left: 22 }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: "clamp(18px,4vw,28px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{form.title}</h2>
                  <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{form.city}{form.state ? ", " + form.state : ""}</p>
                </div>
                <span style={{ position: "absolute", top: 16, right: 18, background: T, color: "#fff", fontSize: 13, fontWeight: 800, padding: "6px 14px", borderRadius: 50 }}>{form.listingType}</span>
              </div>
            )}

            <Section title="Review Your Listing" subtitle="Check everything before submitting for admin review">
              <ReviewRow label="Property Title" value={form.title}          onEdit={goToStep} step={1} />
              <ReviewRow label="Listing Type"   value={form.listingType}    onEdit={goToStep} step={1} />
              <ReviewRow label="Category"       value={form.category}       onEdit={goToStep} step={1} />
              <ReviewRow label="State"          value={form.state}          onEdit={goToStep} step={2} />
              <ReviewRow label="City / Area"    value={form.city}           onEdit={goToStep} step={2} />
              <ReviewRow label="Address"        value={form.address}        onEdit={goToStep} step={2} />
              <ReviewRow label="Size & Rooms"   value={form.category !== "Land" ? form.beds + " beds · " + form.baths + " baths · " + (form.sqft || "—") + " sqft" : form.sqft + " sqft"} onEdit={goToStep} step={3} />
              <ReviewRow label="Condition"      value={form.condition + (form.furnished !== "Unfurnished" ? " · " + form.furnished : "")} onEdit={goToStep} step={3} />
              <ReviewRow label="Price"          value={"₦" + Number(form.price || 0).toLocaleString() + (form.negotiable ? " (Negotiable)" : "")} onEdit={goToStep} step={4} />
              <ReviewRow label="Photos"         value={form.photos.filter(p => p.url && !p.error).length + " photo" + (form.photos.filter(p => p.url).length !== 1 ? "s" : "") + " uploaded"} onEdit={goToStep} step={5} />
              <ReviewRow label="Amenities"      value={form.amenities.length > 0 ? form.amenities.slice(0,4).join(", ") + (form.amenities.length > 4 ? " +" + (form.amenities.length - 4) + " more" : "") : "None selected"} onEdit={goToStep} step={6} />
              <ReviewRow label="Description"    value={form.description.slice(0,80) + (form.description.length > 80 ? "…" : "")} onEdit={goToStep} step={7} />

              {submitError && (
                <div style={{ padding: "12px 16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
                  {submitError}
                </div>
              )}

              <div style={{ background: T + "08", border: "1.5px solid " + T + "25", borderRadius: 16, padding: "16px 18px", marginTop: 8 }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: T }}>What happens next?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { s: "1", text: "Your listing is submitted for review"    },
                    { s: "2", text: "Admin verifies details within 24 hours"  },
                    { s: "3", text: "Listing goes live and buyers can see it"  },
                    { s: "4", text: "Enquiries start coming to your dashboard" },
                  ].map(({ s, text }) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: T, color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s}</div>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
          <button type="button" onClick={back} disabled={step === 1}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 14, border: "1.5px solid #e2e8f0", background: "#fff", color: step === 1 ? "#cbd5e1" : "#64748b", fontSize: 14, fontWeight: 700, cursor: step === 1 ? "not-allowed" : "pointer", transition: "all 0.2s", minHeight: 52 }}>
            <ArrowLeft size={16} /> Back
          </button>

          {step < STEPS.length ? (
            <button type="button" onClick={next}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 14, background: T, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 20px " + T_GLOW, transition: "all 0.2s", minHeight: 52 }}
              onMouseEnter={e => { e.currentTarget.style.background = T_DARK }}
              onMouseLeave={e => { e.currentTarget.style.background = T }}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 14, background: submitting ? T + "70" : "#10b981", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 6px 20px rgba(16,185,129,0.3)", transition: "all 0.2s", minHeight: 52 }}>
              {submitting
                ? <><span style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Submitting…</>
                : <><CheckCircle size={16} /> Submit Listing</>}
            </button>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 16 }}>
          Step {step} of {STEPS.length} · {STEPS[step - 1]?.label}
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; max-width: 100vw; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        input:focus, textarea:focus, select:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        :focus-visible { outline: 2px solid ${T}; outline-offset: 3px; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        .step-mobile  { display: flex; }
        .step-desktop { display: none; }
        @media (min-width: 640px) {
          .container { padding-left: 24px !important; padding-right: 24px !important; }
          .two-col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 768px) {
          .step-mobile  { display: none !important; }
          .step-desktop { display: flex !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  )
}