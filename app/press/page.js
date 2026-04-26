import Link from "next/link"

export const metadata = {
  title: "Press",
  description: "Press kit, media resources and news about FindWithHabi — Nigeria's trusted property platform.",
}

export default function PressPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <nav style={{ background: "#080f14", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 36, width: "auto" }} />
        </Link>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/listings" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Listings</Link>
          <Link href="/agents" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Agents</Link>
          <Link href="/auth" style={{ padding: "8px 18px", borderRadius: 50, background: "#0097B2", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>Get Started</Link>
        </div>
      </nav>

      <div style={{ background: "#080f14", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0097B2", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Press</div>
          <h1 style={{ margin: "0 0 20px", fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
            Media Resources
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            For press enquiries, interviews and media resources about FindWithHabi.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>

        {/* About section */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>About FindWithHabi</h2>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 15, color: "#64748b", lineHeight: 1.8 }}>
            FindWithHabi is a Nigerian real estate platform that connects property buyers and renters with verified agents across all 36 states. Founded in 2026 by Charles Ezechukwu (@thetechbro), the platform is built to solve the trust and transparency problem in Nigerian real estate.
          </p>
          <p style={{ margin: 0, fontSize: 15, color: "#64748b", lineHeight: 1.8 }}>
            FindWithHabi manually verifies every agent on its platform, provides a secure chat system between buyers and agents, and uses technology to make property search safer and more efficient for millions of Nigerians.
          </p>
        </div>

        {/* Key facts */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>Key Facts</h2>
          </div>
          {[
            ["Founded", "2026"],
            ["Founder", "Charles Ezechukwu (@thetechbro)"],
            ["Headquarters", "Lagos, Nigeria"],
            ["Website", "findwithhabi.com"],
            ["Coverage", "All 36 states in Nigeria"],
            ["Email", "findwithhabi@gmail.com"],
          ].map(([label, value], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: i < 5 ? "1px solid #f8fafc" : "none" }}>
              <span style={{ width: 160, fontSize: 13, fontWeight: 700, color: "#94a3b8", flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0d1f2d" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Press contact */}
        <div style={{ background: "#080f14", borderRadius: 24, padding: "40px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 900, color: "#fff" }}>Press Contact</h2>
          <p style={{ margin: "0 0 24px", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            For interviews, press enquiries or media resources, please contact us directly.
          </p>
          <a href="mailto:findwithhabi@gmail.com?subject=Press Enquiry — FindWithHabi"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: "#0097B2", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 800 }}>
            📧 findwithhabi@gmail.com
          </a>
          <p style={{ margin: "16px 0 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>We respond to press enquiries within 24 hours</p>
        </div>
      </div>

      <div style={{ background: "#080f14", padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © 2025–2026 FindWithHabi · <Link href="/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Privacy</Link> · <Link href="/terms" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Terms</Link>
        </p>
      </div>
    </div>
  )
}