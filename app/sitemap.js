export default function sitemap() {
  const BASE = "https://findwithhabi.com"
  const now  = new Date().toISOString()

  return [
    {
      url:              BASE,
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         1,
    },
    {
      url:              BASE + "/listings",
      lastModified:     now,
      changeFrequency:  "hourly",
      priority:         0.9,
    },
    {
      url:              BASE + "/agents",
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         0.8,
    },
    {
      url:              BASE + "/listings?state=Lagos",
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         0.7,
    },
    {
      url:              BASE + "/listings?state=Abuja",
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         0.7,
    },
    {
      url:              BASE + "/listings?state=Rivers",
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         0.7,
    },
    {
      url:              BASE + "/listings?state=Enugu",
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         0.6,
    },
    {
      url:              BASE + "/listings?state=Anambra",
      lastModified:     now,
      changeFrequency:  "daily",
      priority:         0.6,
    },
    {
      url:              BASE + "/auth",
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:         0.5,
    },
    {
      url:              BASE + "/privacy",
      lastModified:     now,
      changeFrequency:  "yearly",
      priority:         0.3,
    },
    {
      url:              BASE + "/terms",
      lastModified:     now,
      changeFrequency:  "yearly",
      priority:         0.3,
    },
  ]
}