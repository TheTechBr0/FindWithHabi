"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function ProgressBar() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible,  setVisible]  = useState(false)
  const timerRef  = useRef(null)
  const fakeTimer = useRef(null)

  const start = () => {
    // Clear any existing timers
    clearTimeout(timerRef.current)
    clearInterval(fakeTimer.current)

    setVisible(true)
    setProgress(0)

    // Quickly jump to 20% then slowly crawl to 85%
    setTimeout(() => setProgress(20), 50)
    setTimeout(() => setProgress(50), 200)
    setTimeout(() => setProgress(70), 500)

    // Slowly crawl toward 85% — never reaches 100% until done
    fakeTimer.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) { clearInterval(fakeTimer.current); return prev }
        return prev + 1
      })
    }, 300)
  }

  const finish = () => {
    clearInterval(fakeTimer.current)
    setProgress(100)
    // Hide after transition completes
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 400)
  }

  // Trigger on route change
  useEffect(() => {
    start()
    const timeout = setTimeout(finish, 600)
    return () => {
      clearTimeout(timeout)
      clearInterval(fakeTimer.current)
    }
  }, [pathname, searchParams])

  if (!visible && progress === 0) return null

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      zIndex: 99999,
      background: "rgba(0,151,178,0.15)",
      pointerEvents: "none",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #0097B2, #00c4e8, #0097B2)",
        backgroundSize: "200% 100%",
        animation: progress < 100 ? "progressShimmer 1.5s linear infinite" : "none",
        borderRadius: "0 3px 3px 0",
        boxShadow: "0 0 12px rgba(0,151,178,0.6), 0 0 4px rgba(0,151,178,0.8)",
        transition: progress === 100
          ? "width 0.3s ease"
          : progress < 25
          ? "width 0.2s ease"
          : "width 1s ease",
      }} />

      {/* Glow dot at the tip */}
      {progress > 5 && progress < 100 && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: `${progress}%`,
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#00c4e8",
          boxShadow: "0 0 8px rgba(0,196,232,0.9), 0 0 16px rgba(0,151,178,0.6)",
        }} />
      )}

      <style>{`
        @keyframes progressShimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  )
}