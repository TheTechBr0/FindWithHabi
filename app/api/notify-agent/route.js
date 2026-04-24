import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const body = await req.json()

    // ─── Email notifications are paused until domain is verified on Resend ───
    // Once findwithhabi.com is verified:
    // 1. Go to Resend → Domains → verify findwithhabi.com
    // 2. Change `from` to "FindWithHabi <hello@findwithhabi.com>"
    // 3. Change `to` back to [body.agentEmail]
    // 4. Uncomment the fetch call below and remove the early return

    // Silently succeed — in-app bell notification handles agent alerts for now
    return NextResponse.json({ success: true, paused: true })

    // ─── Uncomment below when domain is ready ───────────────────────────────
    /*
    const {
      agentEmail, agentName, buyerName,
      buyerPhone, listingTitle, message,
    } = body

    if (!agentEmail) {
      return NextResponse.json({ error: "No agent email" }, { status: 400 })
    }

    const dashboardUrl = "https://findwithhabi.com/dashboard/agent"

    const emailHtml = `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
        <div style="background:#080f14;padding:28px 32px;text-align:center">
          <img src="https://findwithhabi.com/icon.png" alt="FindWithHabi" style="height:48px;width:auto" />
        </div>
        <div style="padding:32px">
          <h2 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#0d1f2d">New Enquiry, ${agentName || "Agent"}! 🎉</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.7">Someone is interested in your listing on FindWithHabi.</p>
          <div style="background:#f8fafc;border-radius:14px;padding:20px;margin-bottom:24px;border:1px solid #e2e8f0">
            ${listingTitle ? `
            <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #e2e8f0">
              <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Property</span>
              <p style="margin:4px 0 0;font-size:15px;font-weight:800;color:#0d1f2d">${listingTitle}</p>
            </div>` : ""}
            <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #e2e8f0">
              <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;">From</span>
              <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#0d1f2d">${buyerName || "A potential buyer"}</p>
              ${buyerPhone ? `<p style="margin:2px 0 0;font-size:13px;color:#64748b">📞 ${buyerPhone}</p>` : ""}
            </div>
            <div>
              <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Message</span>
              <p style="margin:8px 0 0;font-size:14px;color:#374151;line-height:1.7;background:#fff;padding:14px;border-radius:10px;border:1px solid #e2e8f0">"${message}"</p>
            </div>
          </div>
          <a href="${dashboardUrl}" style="display:inline-block;padding:14px 32px;background:#0097B2;color:#fff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:800;">View Enquiry on Dashboard →</a>
          <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;line-height:1.6">Reply quickly — buyers who get fast responses are more likely to close a deal. 🏠</p>
        </div>
        <div style="padding:20px 32px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">© 2025 FindWithHabi · Nigeria's Trusted Property Platform</p>
        </div>
      </div>
    `

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    "FindWithHabi <hello@findwithhabi.com>",
        to:      [agentEmail],
        subject: listingTitle
          ? `New Enquiry — ${listingTitle}`
          : `New Enquiry from ${buyerName || "a buyer"} on FindWithHabi`,
        html: emailHtml,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error("Resend error:", data)
      return NextResponse.json({ error: data.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
    */

  } catch (err) {
    console.error("notify-agent error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}