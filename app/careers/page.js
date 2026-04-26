import Link from "next/link"

export const metadata = {
  title: "Careers",
  description: "Join the FindWithHabi team and help build Nigeria's most trusted property platform.",
}

export default function CareersPage() {
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

      {/* Hero */}
      <div style={{ background: "#080f14", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0097B2", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Careers</div>
          <h1 style={{ margin: "0 0 20px", fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Help Us Transform<br />Nigerian Real Estate
          </h1>
          <p style={{ margin: 0, fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            We are a small but ambitious team building technology that impacts millions of Nigerians. Join us.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>

        {/* Why join */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>Why FindWithHabi?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { icon: "🌍", title: "Real Impact", desc: "Work on a product that helps real Nigerians find safe homes." },
              { icon: "🚀", title: "Early Stage", desc: "Join early and grow with the company. Your work matters here." },
              { icon: "💻", title: "Remote First", desc: "Work from anywhere in Nigeria. We trust our team." },
              { icon: "📚", title: "Learn & Grow", desc: "We invest in our team's professional development." },
            ].map((v, i) => (
              <div key={i} style={{ padding: "20px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{v.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0d1f2d", marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Open roles */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", marginBottom: 32, border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0097B2" }} />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0d1f2d" }}>Open Roles</h2>
          </div>
          <div style={{ padding: "48px 24px", textAlign: "center", background: "#f8fafc", borderRadius: 16, border: "1px dashed #e2e8f0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#0d1f2d" }}>No open roles right now</p>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
              We are not actively hiring at the moment but we are always open to hearing from talented people. Send us your CV and tell us how you can help.
            </p>
            <a href="mailto:findwithhabi@gmail.com?subject=Job Application — FindWithHabi"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 50, background: "#0097B2", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
              Send Your CV →
            </a>
          </div>
        </div>

        {/* Values */}
        <div style={{ background: "#080f14", borderRadius: 24, padding: "40px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 900, color: "#fff" }}>We are building something special</h2>
          <p style={{ margin: "0 0 24px", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            FindWithHabi is founded by <strong style={{ color: "#0097B2" }}>Charles Ezechukwu (@thetechbro)</strong> with a vision to make Nigerian real estate safe and accessible for everyone. If that mission excites you, we want to hear from you.
          </p>
          <a href="mailto:findwithhabi@gmail.com" style={{ color: "#0097B2", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>findwithhabi@gmail.com</a>
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