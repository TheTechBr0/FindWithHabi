"use client"

import { useState } from "react"
import Link from "next/link"

export default function ContactPage() {
  const T = "#0097B2"
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    // Open mailto with form data pre-filled
    const mailtoLink = `mailto:findwithhabi@gmail.com?subject=${encodeURIComponent(form.subject || "Contact from " + form.name)}&body=${encodeURIComponent("Name: " + form.name + "\nEmail: " + form.email + "\n\nMessage:\n" + form.message)}`
    window.location.href = mailtoLink
    setTimeout(() => { setSending(false); setSent(true) }, 1000)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8fafc", minHeight: "100svh" }}>
      {/* Navbar */}
      <nav style={{ background: "#080f14", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 36, width: "auto" }} />
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/listings" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Listings</Link>
          <Link href="/agents" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Agents</Link>
          <Link href="/auth?mode=signup" style={{ padding: "8px 18px", borderRadius: 50, background: T, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "#080f14", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Get in Touch</div>
          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
            We'd Love to Hear From You
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Have a question, complaint or suggestion? Send us a message and we will get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,360px),1fr))", gap: 32, alignItems: "start" }}>

        {/* Contact info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: T }} />
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Contact Info</h2>
            </div>
            {[
              { icon: "📧", label: "Email", value: "findwithhabi@gmail.com", href: "mailto:findwithhabi@gmail.com" },
              { icon: "📍", label: "Location", value: "Lagos, Nigeria", href: null },
              { icon: "⏰", label: "Response time", value: "Within 24 hours", href: null },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < 2 ? "1px solid #f8fafc" : "none" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} style={{ fontSize: 14, fontWeight: 700, color: T, textDecoration: "none" }}>{item.value}</a>
                    : <div style={{ fontSize: 14, fontWeight: 600, color: "#0d1f2d" }}>{item.value}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#0d1f2d" }}>Quick Links</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["🏠 Browse Listings", "/listings"],
                ["👤 Find Agents", "/agents"],
                ["ℹ️ About Us", "/about"],
                ["💼 Careers", "/careers"],
                ["📰 Blog & News", "/blog"],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, background: "#f8fafc", color: "#374151", textDecoration: "none", fontSize: 13, fontWeight: 600, border: "1px solid #f1f5f9" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px", border: "1px solid #f1f5f9", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Message Sent!</h3>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Your email client should have opened. We will get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                style={{ padding: "10px 24px", borderRadius: 50, background: T, color: "#fff", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: T }} />
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0d1f2d" }}>Send a Message</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { key: "name", label: "Your Name", placeholder: "e.g. Chidi Okafor", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "e.g. chidi@gmail.com", type: "email" },
                  { key: "subject", label: "Subject (optional)", placeholder: "e.g. Question about a listing", type: "text" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#f8fafc", transition: "border-color 0.2s" }}
                      onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message *</label>
                  <textarea placeholder="Tell us how we can help you..." value={form.message} rows={5}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0d1f2d", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", background: "#f8fafc", transition: "border-color 0.2s", minHeight: 120 }}
                    onFocus={e => { e.target.style.borderColor = T; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc" }}
                  />
                </div>

                <button onClick={handleSubmit} disabled={sending || !form.name || !form.email || !form.message}
                  style={{ padding: "14px", borderRadius: 14, background: sending || !form.name || !form.email || !form.message ? "#e2e8f0" : T, color: sending || !form.name || !form.email || !form.message ? "#94a3b8" : "#fff", border: "none", fontSize: 15, fontWeight: 800, cursor: sending || !form.name || !form.email || !form.message ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                  {sending ? "Opening email..." : "Send Message →"}
                </button>

                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", textAlign: "center", lineHeight: 1.5 }}>
                  This will open your email client. Alternatively email us directly at{" "}
                  <a href="mailto:findwithhabi@gmail.com" style={{ color: T, fontWeight: 700, textDecoration: "none" }}>findwithhabi@gmail.com</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#080f14", padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © 2025–2026 FindWithHabi ·{" "}
          <Link href="/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Privacy</Link> ·{" "}
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Terms</Link>
        </p>
      </div>
    </div>
  )
}