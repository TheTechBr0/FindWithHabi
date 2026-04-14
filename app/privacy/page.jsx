"use client"

import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

const T    = "#0097B2"
const DARK = "#080f14"

const sections = [
  { title: "1. Information We Collect", content: "We collect information you provide directly to us when you create an account, list a property, or contact an agent. This includes your name, email address, phone number, and location. We also collect information about how you use our platform, including properties you view, save, and enquire about." },
  { title: "2. How We Use Your Information", content: "We use the information we collect to provide, maintain, and improve FindWithHabi. Specifically, we use it to: connect buyers with agents, send notifications about your enquiries and property matches, process payments for featured listings and agent verification, and send important service updates. We do not sell your personal information to third parties." },
  { title: "3. Information Sharing", content: "When you contact an agent through FindWithHabi, your name, email, and phone number are shared with that agent so they can respond to your enquiry. Agent information (name, phone, city) is publicly visible on their profile. We may share information with third-party service providers like Paystack (payments) and Supabase (database), who are bound by data protection agreements." },
  { title: "4. Data Security", content: "We take reasonable measures to protect your personal information from unauthorised access, loss, or misuse. Sensitive data like government ID numbers submitted during agent verification are encrypted and only accessible to FindWithHabi administrators. However, no internet transmission is completely secure, and we cannot guarantee the absolute security of your information." },
  { title: "5. Cookies", content: "FindWithHabi uses cookies and similar tracking technologies to maintain your session, remember your preferences, and analyse platform usage. You can control cookies through your browser settings, but disabling them may affect platform functionality." },
  { title: "6. Your Rights", content: "You have the right to access, correct, or delete your personal information at any time through your dashboard settings. You may also request a copy of your data or ask us to restrict how we use it by contacting us at hello@findwithhabi.com." },
  { title: "7. Children's Privacy", content: "FindWithHabi is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us so we can delete it." },
  { title: "8. Changes to This Policy", content: "We may update this Privacy Policy from time to time. We will notify registered users of any significant changes via email or platform notification. Continued use of FindWithHabi after changes constitutes acceptance of the updated policy." },
  { title: "9. Contact Us", content: "If you have questions about this Privacy Policy or how we handle your data, please contact us at: hello@findwithhabi.com or via our support page." },
]

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100svh", background: "#f8fafc", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <header style={{ background: DARK, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 48, width: "auto", objectFit: "contain" }} />
          </Link>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 16px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 50, background: T + "12", border: "1px solid " + T + "30", marginBottom: 16 }}>
            <Shield size={13} color={T} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T, letterSpacing: "0.06em", textTransform: "uppercase" }}>Legal</span>
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em" }}>Privacy Policy</h1>
          <p style={{ margin: 0, fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>Last updated: January 2026 · Effective for all FindWithHabi users in Nigeria.</p>
        </div>

        <div style={{ background: T + "08", border: "1px solid " + T + "20", borderRadius: 16, padding: "20px 24px", marginBottom: 32 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
            FindWithHabi ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform. By using FindWithHabi, you agree to the practices described in this policy.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: "#fff", padding: "24px 28px", borderBottom: i < sections.length - 1 ? "1px solid #f1f5f9" : "none", border: "1px solid #f1f5f9", borderTop: i > 0 ? "none" : "1px solid #f1f5f9", borderRadius: i === 0 ? "16px 16px 0 0" : i === sections.length - 1 ? "0 0 16px 16px" : 0 }}>
              <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>{s.title}</h2>
              <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{s.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #e2e8f0", display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/terms" style={{ fontSize: 14, fontWeight: 700, color: T, textDecoration: "none" }}>Terms &amp; Conditions →</Link>
          <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>Back to Home</Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  )
}