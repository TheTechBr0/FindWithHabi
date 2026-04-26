import Link from "next/link"

export const metadata = {
  title: "About Us",
  description: "Learn about FindWithHabi — Nigeria's trusted property platform founded by Charles Ezechukwu.",
}

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Navbar */}
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

      {/* Hero */}
      <div style={{ background: "#080f14", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0097B2", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Story</div>
          <h1 style={{ margin: "0 0 20px", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Built for Nigeria.<br />Built with Purpose.
          </h1>
          <p style={{ margin: 0, fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            FindWithHabi is on a mission to make finding a home in Nigeria transparent, safe and accessible for everyone.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>

        {/* Founder section */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>The Founder</h2>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #0097B230, #0097B210)", border: "3px solid #0097B230", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "#0097B2", flexShrink: 0 }}>
              C
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0d1f2d" }}>Charles Ezechukwu</h3>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#0097B2" }}>Founder & CEO · @thetechbro</p>
              <p style={{ margin: "12px 0 0", fontSize: 15, color: "#64748b", lineHeight: 1.8 }}>
                Charles Ezechukwu, known online as <strong>TheTechBro</strong>, is a Nigerian software developer and entrepreneur passionate about solving real-world problems with technology. He built FindWithHabi after experiencing firsthand how difficult and risky it was to find a verified property in Nigeria without being scammed.
              </p>
              <p style={{ margin: "12px 0 0", fontSize: 15, color: "#64748b", lineHeight: 1.8 }}>
                His vision is simple — every Nigerian deserves access to safe, transparent and verified housing. FindWithHabi is his answer to that problem.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>Our Mission</h2>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 16, color: "#64748b", lineHeight: 1.8 }}>
            The Nigerian real estate market is plagued with fraud, fake listings, unverified agents and information asymmetry. Buyers and renters lose money every day to scammers posing as agents.
          </p>
          <p style={{ margin: 0, fontSize: 16, color: "#64748b", lineHeight: 1.8 }}>
            FindWithHabi exists to fix this. We manually verify every agent on our platform, flag suspicious listings and give buyers the tools to make confident decisions. Our goal is to be the most trusted name in Nigerian real estate.
          </p>
        </div>

        {/* Values */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>Our Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { icon: "🛡️", title: "Trust", desc: "Every agent is manually verified. Every listing is checked." },
              { icon: "🔍", title: "Transparency", desc: "No hidden fees. No surprises. Clear information always." },
              { icon: "🤝", title: "Community", desc: "We serve buyers, renters and agents equally." },
              { icon: "🚀", title: "Innovation", desc: "We use technology to solve Nigeria's housing challenges." },
            ].map((v, i) => (
              <div key={i} style={{ padding: "20px", borderRadius: 16, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0d1f2d", marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: "#080f14", borderRadius: 24, padding: "40px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 900, color: "#fff" }}>Get in Touch</h2>
          <p style={{ margin: "0 0 24px", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Have questions about FindWithHabi? We would love to hear from you.
          </p>
          <a href="mailto:findwithhabi@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 50, background: "#0097B2", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 800 }}>
            📧 findwithhabi@gmail.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#080f14", padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © 2025–2026 FindWithHabi · <Link href="/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Privacy</Link> · <Link href="/terms" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Terms</Link>
        </p>
      </div>
    </div>
  )
}