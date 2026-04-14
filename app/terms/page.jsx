"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

const T    = "#0097B2"
const DARK = "#080f14"

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using FindWithHabi, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use our platform. We reserve the right to update these terms at any time, and continued use of the platform after changes constitutes acceptance." },
  { title: "2. Eligibility", content: "You must be at least 18 years old to use FindWithHabi. By creating an account, you represent that you meet this requirement and that all information you provide is accurate and truthful. Accounts created with false information may be suspended or deleted." },
  { title: "3. User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You are fully responsible for all activities that occur under your account. Please notify us immediately at hello@findwithhabi.com if you suspect any unauthorised use of your account." },
  { title: "4. Agent Listings", content: "Agents are responsible for the accuracy of their property listings. Listings must represent real properties that the agent has authority to list. Fraudulent, misleading, or duplicate listings are strictly prohibited and may result in immediate account suspension. FindWithHabi reserves the right to remove any listing at its discretion." },
  { title: "5. Buyer / Renter Conduct", content: "Buyers and renters agree to use FindWithHabi solely to find legitimate housing. Enquiries must be genuine. Harassing agents, spamming listings, or using the platform for any illegal purpose is strictly prohibited and will result in account termination." },
  { title: "6. Payments and Fees", content: "FindWithHabi charges fees for optional services including featured listings and agent verification. All payments are processed securely through Paystack. Fees paid for featured listings and verification are non-refundable once the service is activated. FindWithHabi does not facilitate property purchase transactions directly." },
  { title: "7. Agent Verification", content: "Agent verification is based on the information provided during the verification process. FindWithHabi makes reasonable efforts to verify agent credentials but does not guarantee the accuracy of all agent information. Verified status does not constitute an endorsement by FindWithHabi." },
  { title: "8. Prohibited Activities", content: "Users may not: scrape or copy data from our platform, create fake accounts, post fraudulent listings, impersonate other users or agents, use the platform for money laundering or scams, or attempt to circumvent our security measures. Violations will result in immediate account termination and may be reported to authorities." },
  { title: "9. Intellectual Property", content: "All content on FindWithHabi including logos, design, text, and code is the property of FindWithHabi and is protected by Nigerian and international copyright law. You may not copy, reproduce, or redistribute any content without our explicit written permission." },
  { title: "10. Limitation of Liability", content: "FindWithHabi is a marketplace that connects buyers with agents. We are not a party to any property transaction. FindWithHabi is not liable for any losses arising from transactions between users and agents, inaccurate listing information, or any disputes between parties. Use the platform at your own risk." },
  { title: "11. Dispute Resolution", content: "Any disputes arising from your use of FindWithHabi shall first be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to mediation in Lagos, Nigeria, before any legal action. These terms are governed by the laws of the Federal Republic of Nigeria." },
  { title: "12. Termination", content: "FindWithHabi reserves the right to suspend or terminate any account at any time for violations of these terms, fraudulent activity, or any reason we deem necessary to protect our platform and users. Upon termination, your right to use the platform ceases immediately." },
  { title: "13. Contact", content: "For questions about these Terms and Conditions, please contact us at hello@findwithhabi.com." },
]

export default function TermsPage() {
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
            <FileText size={13} color={T} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T, letterSpacing: "0.06em", textTransform: "uppercase" }}>Legal</span>
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#0d1f2d", letterSpacing: "-0.03em" }}>Terms &amp; Conditions</h1>
          <p style={{ margin: 0, fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>Last updated: January 2026 · Please read these terms carefully before using FindWithHabi.</p>
        </div>

        <div style={{ background: "#fff3cd", border: "1px solid #ffc10740", borderRadius: 16, padding: "18px 22px", marginBottom: 32 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#664d03", lineHeight: 1.8 }}>
            <strong>Important:</strong> These terms constitute a legally binding agreement between you and FindWithHabi. By creating an account or using our platform, you confirm that you have read, understood, and agreed to these terms.
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
          <Link href="/privacy" style={{ fontSize: 14, fontWeight: 700, color: T, textDecoration: "none" }}>Privacy Policy →</Link>
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