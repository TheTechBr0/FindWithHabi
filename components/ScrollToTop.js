"use client"

import { useState, useEffect } from "react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position:     "fixed",
        bottom:       80,
        right:        16,
        zIndex:       999,
        width:        44,
        height:       44,
        borderRadius: "50%",
        background:   "#0097B2",
        border:       "none",
        cursor:       "pointer",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        boxShadow:    "0 4px 20px rgba(0,151,178,0.4)",
        animation:    "fadeUp 0.3s ease",
        transition:   "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,151,178,0.5)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,151,178,0.4)"
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}