"use client"

import Link from "next/link"

const POSTS = [
  {
    title: "How to Spot a Fake Property Listing in Nigeria",
    excerpt: "Scammers are getting smarter. Here are 7 red flags to watch out for when browsing property listings online in Nigeria.",
    category: "Tips & Advice",
    date: "April 20, 2026",
    readTime: "5 min read",
    emoji: "🛡️",
  },
  {
    title: "FindWithHabi is Now Live — Here's What We Built",
    excerpt: "We officially launched FindWithHabi, a new Nigerian real estate platform built to connect serious buyers with verified agents.",
    category: "Company News",
    date: "April 18, 2026",
    readTime: "3 min read",
    emoji: "🚀",
  },
  {
    title: "Lagos vs Abuja: Which City Should You Buy Property In?",
    excerpt: "A data-driven comparison of property prices, ROI and quality of life in Nigeria's two biggest real estate markets.",
    category: "Market Insights",
    date: "April 15, 2026",
    readTime: "7 min read",
    emoji: "🏙️",
  },
  {
    title: "What to Check Before Signing a Tenancy Agreement in Nigeria",
    excerpt: "Signing a tenancy agreement without reading the fine print can cost you. Here's a complete checklist for Nigerian renters.",
    category: "Tips & Advice",
    date: "April 10, 2026",
    readTime: "6 min read",
    emoji: "📋",
  },
  {
    title: "How Nigerian Real Estate Agents Can Get More Clients Online",
    excerpt: "The internet has changed how buyers find properties. Here's how agents can use platforms like FindWithHabi to grow their business.",
    category: "For Agents",
    date: "April 5, 2026",
    readTime: "4 min read",
    emoji: "📈",
  },
  {
    title: "Understanding BVN Verification for Property Agents in Nigeria",
    excerpt: "Why identity verification matters in Nigerian real estate and how FindWithHabi uses it to protect buyers.",
    category: "Safety",
    date: "April 1, 2026",
    readTime: "4 min read",
    emoji: "🔐",
  },
]

const CATEGORIES = ["All", "Tips & Advice", "Company News", "Market Insights", "For Agents", "Safety"]

export default function BlogPage() {
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
      <div style={{ background: "#080f14", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0097B2", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Blog & News</div>
          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
            Insights for Nigerian<br />Home Seekers
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Tips, market insights and company news from the FindWithHabi team.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 24 }}>
          {POSTS.map((post, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
>
              {/* Card header */}
              <div style={{ background: "linear-gradient(135deg, #0097B215, #0097B205)", padding: "32px 28px 24px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{post.emoji}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#0097B2", background: "#0097B212", padding: "3px 10px", borderRadius: 50 }}>{post.category}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0d1f2d", lineHeight: 1.4 }}>{post.title}</h2>
              </div>
              {/* Card body */}
              <div style={{ padding: "20px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b", lineHeight: 1.7, flex: 1 }}>{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{post.date}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon note */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "32px", background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9" }}>
          <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#0d1f2d" }}>More articles coming soon</p>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Follow us for the latest Nigerian real estate news and tips</p>
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