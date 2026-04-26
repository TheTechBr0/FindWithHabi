import { createClient } from "@supabase/supabase-js"

const BASE = "https://findwithhabi.com"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function sitemap() {
  const now = new Date().toISOString()

  // Fetch active listings
  let listingUrls = []
  try {
    const { data: listings } = await supabase
      .from("listings")
      .select("id, updated_at, created_at")
      .eq("status", "active")
      .eq("is_flagged", false)
      .order("created_at", { ascending: false })
      .limit(500)

    if (listings) {
      listingUrls = listings.map(l => ({
        url:             BASE + "/listings/" + l.id,
        lastModified:    l.updated_at || l.created_at || now,
        changeFrequency: "weekly",
        priority:        0.8,
      }))
    }
  } catch(e) {}

  // Fetch verified agents
  let agentUrls = []
  try {
    const { data: agents } = await supabase
      .from("agents")
      .select("id, updated_at")
      .eq("is_verified", true)
      .limit(200)

    if (agents) {
      agentUrls = agents.map(a => ({
        url:             BASE + "/agents/" + a.id,
        lastModified:    a.updated_at || now,
        changeFrequency: "monthly",
        priority:        0.6,
      }))
    }
  } catch(e) {}

  // Static pages
  const staticPages = [
    { url: BASE,                        lastModified: now, changeFrequency: "daily",   priority: 1   },
    { url: BASE + "/listings",          lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: BASE + "/agents",            lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: BASE + "/blog",              lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: BASE + "/about",             lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: BASE + "/contact",           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: BASE + "/careers",           lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: BASE + "/press",             lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: BASE + "/auth",              lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: BASE + "/privacy",           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: BASE + "/terms",             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    // State-filtered listing pages for SEO
    { url: BASE + "/listings?state=Lagos",    lastModified: now, changeFrequency: "daily",  priority: 0.7 },
    { url: BASE + "/listings?state=Abuja",    lastModified: now, changeFrequency: "daily",  priority: 0.7 },
    { url: BASE + "/listings?state=Rivers",   lastModified: now, changeFrequency: "daily",  priority: 0.7 },
    { url: BASE + "/listings?state=Enugu",    lastModified: now, changeFrequency: "daily",  priority: 0.6 },
    { url: BASE + "/listings?state=Anambra",  lastModified: now, changeFrequency: "daily",  priority: 0.6 },
    { url: BASE + "/listings?state=Ogun",     lastModified: now, changeFrequency: "daily",  priority: 0.6 },
    { url: BASE + "/listings?state=Oyo",      lastModified: now, changeFrequency: "daily",  priority: 0.6 },
    { url: BASE + "/listings?state=Kano",     lastModified: now, changeFrequency: "daily",  priority: 0.6 },
  ]

  return [...staticPages, ...listingUrls, ...agentUrls]
}