"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

// ─── Toast Context ─────────────────────────────────────────────────────────────
const ToastContext = createContext({ showToast: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

// ─── Toast Container ───────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: "fixed",
      bottom: 80,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "center",
      pointerEvents: "none",
      width: "100%",
      maxWidth: 400,
      padding: "0 16px",
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// ─── Toast Item ────────────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const configs = {
    success: { bg: "#0d1f2d", border: "#10b981", icon: "✅" },
    error:   { bg: "#0d1f2d", border: "#ef4444", icon: "❌" },
    warning: { bg: "#0d1f2d", border: "#f59e0b", icon: "⚠️" },
    info:    { bg: "#0d1f2d", border: "#0097B2", icon: "ℹ️" },
    saved:   { bg: "#0d1f2d", border: "#ef4444", icon: "❤️" },
    copy:    { bg: "#0d1f2d", border: "#0097B2", icon: "🔗" },
    sent:    { bg: "#0d1f2d", border: "#10b981", icon: "✅" },
  }

  const c = configs[toast.type] || configs.success

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        borderRadius: 50,
        background: c.bg,
        border: `1.5px solid ${c.border}40`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${c.border}20`,
        fontSize: 14,
        fontWeight: 700,
        color: "#fff",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        whiteSpace: "nowrap",
        pointerEvents: "all",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 16 }}>{c.icon}</span>
      <span>{toast.message}</span>
    </div>
  )
}