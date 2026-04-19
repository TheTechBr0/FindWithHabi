"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  Eye, EyeOff, Home, Building2, ShieldCheck,
  ArrowLeft, ArrowRight, CheckCircle, Mail, Lock, User, Phone, MapPin,
} from "lucide-react"

// ─── Design tokens (matches landing page) ─────────────────────────────────────
const T      = "#0097B2"
const T_DARK = "#005f70"
const T_GLOW = "#0097B244"
const DARK   = "#080f14"

// ─── Nigerian States ─────────────────────────────────────────────────────────
const NG_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
]

// ─── Roles ────────────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: "buyer",
    icon: Home,
    label: "Buyer / Renter",
    desc: "Browse verified listings, save favourites & contact agents.",
    color: T,
    glow: T_GLOW,
  },
  {
    key: "agent",
    icon: Building2,
    label: "Agent",
    desc: "List properties, manage enquiries & track your deals.",
    color: "#f59e0b",
    glow: "#f59e0b44",
  },
]

// ─── Floating background orbs ─────────────────────────────────────────────────
function Orbs() {
  return (
    <>
      <div style={{
        position: "fixed", top: "-10%", right: "-5%",
        width: "clamp(260px, 40vw, 500px)", height: "clamp(260px, 40vw, 500px)",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${T}22 0%, transparent 65%)`,
        pointerEvents: "none", zIndex: 0,
        animation: "floatA 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", bottom: "5%", left: "-8%",
        width: "clamp(200px, 30vw, 400px)", height: "clamp(200px, 30vw, 400px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
        animation: "floatB 16s ease-in-out infinite",
      }} />
    </>
  )
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, type = "text", icon: Icon, value, onChange, placeholder, error, rightEl }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.05)",
        border: `1.5px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 14, transition: "border-color 0.2s",
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = error ? "#ef4444" : T}
        onBlurCapture={e => e.currentTarget.style.borderColor = error ? "#ef4444" : "rgba(255,255,255,0.1)"}
      >
        {Icon && (
          <div style={{ paddingLeft: 14, flexShrink: 0 }}>
            <Icon size={16} color="rgba(255,255,255,0.35)" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={!!error}
          style={{
            flex: 1, padding: "13px 14px",
            background: "transparent", border: "none", outline: "none",
            fontSize: 15, color: "#fff",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            // Prevent iOS zoom — keep at 16px
            fontSize: 16,
          }}
        />
        {rightEl && <div style={{ paddingRight: 14, flexShrink: 0 }}>{rightEl}</div>}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: "#ef4444", marginTop: 2 }}>{error}</span>
      )}
    </div>
  )
}

// ─── Password field (with show/hide) ──────────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      label={label}
      type={show ? "text" : "password"}
      icon={Lock}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      rightEl={
        <button
          type="button"
          onClick={() => setShow(p => !p)}
          aria-label={show ? "Hide password" : "Show password"}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
        >
          {show
            ? <EyeOff size={16} color="rgba(255,255,255,0.4)" />
            : <Eye size={16} color="rgba(255,255,255,0.4)" />}
        </button>
      }
    />
  )
}

// ─── Role card ────────────────────────────────────────────────────────────────
function RoleCard({ role, selected, onSelect }) {
  const Icon = role.icon
  return (
    <button
      type="button"
      onClick={() => onSelect(role.key)}
      aria-pressed={selected}
      style={{
        flex: 1, padding: "18px 14px", borderRadius: 16, cursor: "pointer",
        background: selected ? `${role.color}14` : "rgba(255,255,255,0.03)",
        border: `2px solid ${selected ? role.color : "rgba(255,255,255,0.08)"}`,
        textAlign: "left", transition: "all 0.25s",
        boxShadow: selected ? `0 0 24px ${role.glow}` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {selected && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <CheckCircle size={16} color={role.color} />
        </div>
      )}
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `${role.color}20`, border: `1px solid ${role.color}44`,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
      }}>
        <Icon size={18} color={role.color} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 5, letterSpacing: "-0.01em" }}>{role.label}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{role.desc}</div>
    </button>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  )
}

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitBtn({ label, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%", padding: "15px", borderRadius: 14,
        background: loading ? "rgba(0,151,178,0.5)" : T,
        border: "none", color: "#fff", fontSize: 15, fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : `0 8px 32px ${T_GLOW}`,
        transition: "all 0.25s", letterSpacing: "0.01em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        minHeight: 52,
      }}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
          Please wait…
        </span>
      ) : (
        <>{label} <ArrowRight size={16} /></>
      )}
    </button>
  )
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSwitch, onForgot }) {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email"
    if (!password) e.password = "Password is required"
    else if (password.length < 6) e.password = "Minimum 6 characters"
    return e
  }

  const [authError, setAuthError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setAuthError("")
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setAuthError(error.message === "Invalid login credentials"
        ? "Incorrect email or password. Please try again."
        : error.message)
      setLoading(false)
      return
    }

    // Get role and redirect
    const { data: userData } = await supabase.from("users").select("role").eq("id", data.user.id).single()
    const role = userData?.role || "buyer"
    window.location.href = role === "admin" ? "/dashboard/admin" : role === "agent" ? "/dashboard/agent" : "/dashboard/user"
  }

  if (done) return <SuccessState label="Logged in!" sub="Redirecting to your dashboard…" />

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {authError && (
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "#ef444420", border: "1px solid #ef444440", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
          {authError}
        </div>
      )}
      <Field
        label="Email address"
        type="email"
        icon={Mail}
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        error={errors.email}
      />
      <PasswordField
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Your password"
        error={errors.password}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={onForgot} style={{ background: "none", border: "none", color: T, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>
          Forgot password?
        </button>
      </div>

      <SubmitBtn label="Log In" loading={loading} />

      <Divider label="or continue with" />

      <GoogleBtn />

      <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }}>
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", color: T, fontWeight: 800, cursor: "pointer", fontSize: 14, padding: 0 }}>
          Sign up
        </button>
      </p>
    </form>
  )
}

// ─── Signup Form ──────────────────────────────────────────────────────────────
function SignupForm({ onSwitch }) {
  const [role, setRole]           = useState("buyer")
  const [name, setName]           = useState("")
  const [phone, setPhone]         = useState("")
  const [city,  setCity]          = useState("")
  const [state, setState]         = useState("")
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [confirm, setConfirm]     = useState("")
  const [agreed, setAgreed]       = useState(false)
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = "Full name is required"
    if (!email.trim()) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email"
    if (!password) e.password = "Password is required"
    else if (password.length < 8) e.password = "Minimum 8 characters"
    if (confirm !== password) e.confirm = "Passwords do not match"
    if (!agreed) e.agreed = "Please accept the terms to continue"
    return e
  }

  const [authError,   setAuthError]   = useState("")
  const [emailSent,   setEmailSent]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setAuthError("")
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone, role },
        emailRedirectTo: "https://find-with-habi.vercel.app/auth",
      }
    })

    if (error) {
      setAuthError(error.message)
      setLoading(false)
      return
    }

    // Insert into users table
    if (data.user) {
      await supabase.from("users").upsert({
        id:        data.user.id,
        email,
        full_name: name,
        phone,
        city:      city  || null,
        state:     state || null,
        role,
      })
      // If agent, create agent row
      if (role === "agent") {
        await supabase.from("agents").upsert({ user_id: data.user.id })
      }
    }

    setLoading(false)
    // Check if email confirmation required
    if (data.session === null) {
      setEmailSent(true)
    } else {
      window.location.href = role === "agent" ? "/dashboard/agent" : "/dashboard/user"
    }
  }

  if (emailSent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 0", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f59e0b18", border: "2px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", animation: "popIn 0.4s ease" }}>
          <Mail size={32} color="#f59e0b" />
        </div>
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#fff" }}>Check your email!</h3>
          <p style={{ margin: "0 0 8px", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            We sent a confirmation link to<br />
            <strong style={{ color: "#fff" }}>{email}</strong>
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Click the link in the email to activate your account, then come back and log in.
          </p>
        </div>
        <button onClick={onSwitch} style={{ padding: "11px 28px", borderRadius: 50, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px " + T_GLOW }}>
          Go to Login
        </button>
      </div>
    )
  }

  if (done) return <SuccessState label="Account created!" sub="Welcome to FindWithHabi. Redirecting…" />

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {authError && (
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "#ef444420", border: "1px solid #ef444440", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
          {authError}
        </div>
      )}

      {/* Role picker */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textTransform: "uppercase" }}>I am a</span>
        <div style={{ display: "flex", gap: 10 }}>
          {ROLES.map(r => (
            <RoleCard key={r.key} role={r} selected={role === r.key} onSelect={setRole} />
          ))}
        </div>
      </div>

      <Field label="Full name" icon={User} value={name} onChange={e => setName(e.target.value)} placeholder="Chidi Okonkwo" error={errors.name} />

      <Field label="Email address" type="email" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />

      {/* Phone — optional but shown for agents */}
      <Field
        label={`Phone number${role === "agent" ? "" : " (optional)"}`}
        type="tel"
        icon={Phone}
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="+234 800 000 0000"
      />

      {/* City + State — shown for all, required for agents */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field
          label={role === "agent" ? "City *" : "City (optional)"}
          icon={MapPin}
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="e.g. Lagos"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {role === "agent" ? "State *" : "State (optional)"}
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, transition: "border-color 0.2s" }}
            onFocusCapture={e => e.currentTarget.style.borderColor = T}
            onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
            <select value={state} onChange={e => setState(e.target.value)}
              style={{ flex: 1, padding: "13px 14px", background: "transparent", border: "none", outline: "none", fontSize: 16, color: state ? "#fff" : "rgba(255,255,255,0.25)", fontFamily: "inherit", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
              <option value="" style={{ background: "#0d1f2d", color: "#fff" }}>Select state</option>
              {NG_STATES.map(s => <option key={s} value={s} style={{ background: "#0d1f2d", color: "#fff" }}>{s}</option>)}
            </select>
            <div style={{ paddingRight: 12, pointerEvents: "none", color: "rgba(255,255,255,0.4)", fontSize: 10 }}>▼</div>
          </div>
        </div>
      </div>

      <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" error={errors.password} />
      <PasswordField label="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" error={errors.confirm} />

      {/* Terms */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <div
            onClick={() => setAgreed(p => !p)}
            style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: agreed ? T : "transparent",
              border: `2px solid ${agreed ? T : "rgba(255,255,255,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", cursor: "pointer",
            }}
          >
            {agreed && <CheckCircle size={13} color="#fff" />}
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            I agree to FindWithHabi&apos;s{" "}
            <a href="/terms" style={{ color: T, fontWeight: 700, textDecoration: "none" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" style={{ color: T, fontWeight: 700, textDecoration: "none" }}>Privacy Policy</a>
          </span>
        </label>
        {errors.agreed && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors.agreed}</span>}
      </div>

      <SubmitBtn label="Create Account" loading={loading} />

      <Divider label="or sign up with" />

      <GoogleBtn />

      <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", color: T, fontWeight: 800, cursor: "pointer", fontSize: 14, padding: 0 }}>
          Log in
        </button>
      </p>
    </form>
  )
}

// ─── Google button ────────────────────────────────────────────────────────────
function GoogleBtn() {
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://find-with-habi.vercel.app/auth/callback",
      },
    })
    if (error) { alert("Google sign-in failed: " + error.message); setLoading(false) }
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      style={{
        width: "100%", padding: "13px", borderRadius: 14,
        background: "rgba(255,255,255,0.05)",
        border: "1.5px solid rgba(255,255,255,0.1)",
        color: "#fff", fontSize: 14, fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: 10, transition: "all 0.2s",
        minHeight: 48, opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.09)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
    >
      {loading
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
        : <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.1 0-9.5-3.3-11.2-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C36.9 36.2 44 31 44 24c0-1.2-.1-2.4-.4-3.5z" />
          </svg>}
      {loading ? "Connecting…" : "Continue with Google"}
    </button>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState({ label, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 0", textAlign: "center" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: `${T}18`, border: `2px solid ${T}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}>
        <CheckCircle size={34} color={T} />
      </div>
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{label}</h3>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{sub}</p>
      </div>
    </div>
  )
}


// ─── Forgot Password ──────────────────────────────────────────────────────────
function ForgotPasswordForm({ onBack }) {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset",
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 0", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: T + "18", border: "2px solid " + T, display: "flex", alignItems: "center", justifyContent: "center", animation: "popIn 0.4s ease" }}>
          <Mail size={32} color={T} />
        </div>
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 900, color: "#fff" }}>Reset link sent!</h3>
          <p style={{ margin: "0 0 8px", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            Check your email at<br /><strong style={{ color: "#fff" }}>{email}</strong>
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Click the link in the email to reset your password.
          </p>
        </div>
        <button onClick={onBack} style={{ padding: "11px 28px", borderRadius: 50, background: T, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 900, color: "#fff" }}>Forgot Password?</h3>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Enter your email and we will send you a reset link.</p>
      </div>
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "#ef444420", border: "1px solid #ef444440", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}
      <Field label="Email address" type="email" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <button type="submit" disabled={loading}
        style={{ width: "100%", padding: "14px", borderRadius: 14, background: loading ? T + "70" : T, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", minHeight: 52, boxShadow: "0 6px 24px " + T_GLOW }}>
        {loading ? "Sending…" : "Send Reset Link"}
      </button>
      <button type="button" onClick={onBack}
        style={{ width: "100%", padding: "12px", borderRadius: 14, background: "transparent", border: "1.5px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
        Back to Login
      </button>
    </form>
  )
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login") // "login" | "signup" | "forgot"
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 60))
    return () => cancelAnimationFrame(raf)
  }, [])

  const isLogin = mode === "login"

  return (
    <div style={{
      minHeight: "100svh", background: DARK, position: "relative",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      overflowX: "hidden",
    }}>
      <Orbs />

      {/* Grid texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Back to home */}
      <div style={{ position: "relative", zIndex: 10, padding: "20px 20px 0" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700,
            textDecoration: "none", transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <ArrowLeft size={15} />
          Back to FindWithHabi
        </Link>
      </div>

      {/* Main layout */}
      <div className="auth-layout" style={{
        flex: 1, display: "flex", alignItems: "stretch",
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto", width: "100%",
        padding: "32px 16px 48px",
        gap: 0,
      }}>

        {/* ── Left panel — branding (hidden on mobile) ── */}
        <div className="auth-left" style={{
          display: "none", flexDirection: "column", justifyContent: "center",
          flex: 1, paddingRight: 60, paddingLeft: 20,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateX(-24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "inline-block", marginBottom: 48, textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 56, width: "auto", objectFit: "contain" }} />
          </Link>

          <h1 style={{
            margin: "0 0 16px",
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1.08,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            Nigeria&apos;s most<br />
            <span style={{ color: T, textShadow: `0 0 40px ${T_GLOW}` }}>trusted</span><br />
            property platform.
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: 380, marginBottom: 48 }}>
            50,000+ verified listings. Expert agents across all 36 states. Your next home is one login away.
          </p>

          {/* Trust badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: ShieldCheck, text: "100% verified listings — no scams", color: T },
              { icon: Building2,   text: "Licensed agents across all 36 states", color: "#f59e0b" },
              { icon: CheckCircle, text: "Secure, escrow-backed transactions", color: "#10b981" },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color={color} />
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical divider — desktop only */}
        <div className="auth-divider" style={{ display: "none", width: 1, background: "rgba(255,255,255,0.06)", margin: "0 0" }} />

        {/* ── Right panel — form ── */}
        <div className="auth-right" style={{
          flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: 0, paddingRight: 0, maxWidth: 480, width: "100%", margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}>

          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ marginBottom: 32, textAlign: "center" }}>
            <Link href="/" style={{ display: "inline-block", textDecoration: "none" }}>
              <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 52, width: "auto", objectFit: "contain" }} />
            </Link>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "clamp(24px, 4vw, 40px)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          }}>

            {/* Tab switcher */}
            <div style={{
              display: "flex", background: "rgba(255,255,255,0.05)",
              borderRadius: 12, padding: 4, marginBottom: 28,
            }}>
              {["login", "signup"].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 9, border: "none",
                    background: mode === m ? "#fff" : "transparent",
                    color: mode === m ? DARK : "rgba(255,255,255,0.45)",
                    fontSize: 14, fontWeight: 800, cursor: "pointer",
                    transition: "all 0.25s",
                    boxShadow: mode === m ? "0 2px 12px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {m === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                {isLogin
                  ? "Log in to access your dashboard and saved properties."
                  : "Join thousands of Nigerians finding their perfect property."}
              </p>
            </div>

            {/* Form */}
            {mode === "forgot"
              ? <ForgotPasswordForm onBack={() => setMode("login")} />
              : isLogin
                ? <LoginForm onSwitch={() => setMode("signup")} onForgot={() => setMode("forgot")} />
                : <SignupForm onSwitch={() => setMode("login")} />}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 20 }}>
            Protected by 256-bit SSL encryption. Your data is safe with us.
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; }
        html, body { max-width: 100vw; overflow-x: hidden; }

        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { outline: none; }
        a, button { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }

        @keyframes floatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, -20px) scale(1.08); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }

        :focus-visible {
          outline: 2px solid ${T};
          outline-offset: 3px;
          border-radius: 6px;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ── ≥ 768px ── */
        @media (min-width: 768px) {
          .auth-layout    { padding: 48px 32px !important; gap: 0 !important; }
          .auth-left      { display: flex !important; }
          .auth-divider   { display: block !important; }
          .auth-right     { padding-left: 60px !important; margin: 0 !important; }
          .auth-mobile-logo { display: none !important; }
        }

        /* ── ≥ 1024px ── */
        @media (min-width: 1024px) {
          .auth-layout { padding: 48px 48px !important; }
        }
      `}</style>
    </div>
  )
}