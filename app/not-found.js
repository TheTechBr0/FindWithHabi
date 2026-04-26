import Link from "next/link"

export const metadata = {
  title: "Page Not Found — FindWithHabi",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100svh", background: "#080f14", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{ padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/findwithhabilogo.png" alt="FindWithHabi" style={{ height: 36, width: "auto" }} />
        </Link>
        <Link href="/listings" style={{ padding: "8px 18px", borderRadius: 50, background: "#0097B2", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
          Browse Listings
        </Link>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>

        {/* Big 404 */}
        <div style={{ fontSize: "clamp(80px,20vw,160px)", fontWeight: 900, color: "#0097B2", lineHeight: 1, letterSpacing: "-0.05em", opacity: 0.15, userSelect: "none", marginBottom: 8 }}>
          404
        </div>

        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "#0097B215", border: "1px solid #0097B230", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 24, marginTop: -40 }}>
          🏠
        </div>

        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
          Page Not Found
        </h1>
        <p style={{ margin: "0 0 36px", fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 400 }}>
          The page you are looking for may have been moved, deleted or never existed. Let us help you find what you need.
        </p>

        {/* Quick links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 50, background: "#0097B2", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
            🏠 Go Home
          </Link>
          <Link href="/listings" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 50, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            🔍 Browse Listings
          </Link>
          <Link href="/agents" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 50, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            👤 Find Agents
          </Link>
        </div>

        {/* Helpful tip */}
        <div style={{ padding: "16px 24px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 400 }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
            Looking for a specific property? Use the search bar on the listings page to find exactly what you need across all 36 states in Nigeria.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2025–2026 FindWithHabi · <Link href="/privacy" style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Privacy</Link> · <Link href="/terms" style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Terms</Link>
        </p>
      </div>
    </div>
  )
}