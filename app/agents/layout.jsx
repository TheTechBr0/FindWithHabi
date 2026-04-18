export const metadata = {
  title: "Find Property Agents",
  description: "Connect with verified, licensed property agents across Nigeria. Read reviews, check ratings and contact top agents in Lagos, Abuja, Port Harcourt and more.",
  keywords: [
    "property agents Nigeria",
    "real estate agents Lagos",
    "verified property agents",
    "licensed agents Abuja",
    "property agent near me Nigeria",
  ],
  openGraph: {
    title: "Find Verified Property Agents | FindWithHabi",
    description: "Connect with licensed, verified property agents across all 36 Nigerian states.",
    url: "https://findwithhabi.com/agents",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://findwithhabi.com/agents",
  },
}

export default function AgentsLayout({ children }) {
  return children
}