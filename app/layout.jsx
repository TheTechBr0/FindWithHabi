import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/Toast"
import ProgressBar from "@/components/ProgressBar"
import ScrollToTop from "@/components/ScrollToTop"
import { Suspense } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const BASE_URL = "https://findwithhabi.com"

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:  "FindWithHabi — Nigeria's Trusted Property Platform",
    template: "%s | FindWithHabi",
  },
  description:
    "Find verified houses, apartments, land and commercial properties for sale or rent across all 36 states in Nigeria. Connect with licensed agents today.",
  keywords: [
    "houses for rent in Lagos",
    "property for sale Nigeria",
    "apartments Abuja",
    "real estate Nigeria",
    "houses for sale Lagos",
    "property listing Nigeria",
    "Nigerian real estate",
    "rent apartment Lagos",
    "buy land Nigeria",
    "commercial property Nigeria",
    "verified listings Nigeria",
    "student housing Nigeria",
    "FindWithHabi",
  ],
  authors:   [{ name: "FindWithHabi", url: BASE_URL }],
  creator:   "FindWithHabi",
  publisher: "FindWithHabi",
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         BASE_URL,
    siteName:    "FindWithHabi",
    title:       "FindWithHabi — Nigeria's Trusted Property Platform",
    description: "Find verified houses, apartments, land and commercial properties for sale or rent across all 36 states in Nigeria.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "FindWithHabi — Nigeria's Trusted Property Platform",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "FindWithHabi — Nigeria's Trusted Property Platform",
    description: "Find verified houses, apartments and land for sale or rent across Nigeria.",
    images:      ["/og-image.png"],
    creator:     "@findwithhabi",
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32",   type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple:    "/icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Paystack */}
        <script src="https://js.paystack.co/v1/inline.js" async />

        {/* Favicon fallback for older browsers */}
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />

        {/* ── PWA: makes app installable on Android Chrome ── */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* ── PWA: makes app installable on iPhone/iPad Safari ── */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* App name shown under icon on iPhone home screen */}
        <meta name="apple-mobile-web-app-title" content="FindWithHabi" />

        {/* Status bar on iPhone — blends with your dark teal navbar */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Browser toolbar colour on Android */}
        <meta name="theme-color" content="#0097B2" />

        {/* Viewport — prevents zoom on input focus on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />

        {/* Splash screen icon for iPhone */}
        <link rel="apple-touch-startup-image" href="/icon.png" />

        {/* Windows tiles */}
        <meta name="msapplication-TileColor" content="#0097B2" />
        <meta name="msapplication-TileImage" content="/icon.png" />

        {/* JSON-LD — Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type":    "Organization",
              name:       "FindWithHabi",
              url:        BASE_URL,
              logo:       BASE_URL + "/icon.png",
              description: "Nigeria's trusted property platform connecting buyers, renters and agents.",
              address: {
                "@type":         "PostalAddress",
                addressCountry:  "NG",
                addressLocality: "Lagos",
              },
              contactPoint: {
                "@type":     "ContactPoint",
                email:       "hello@findwithhabi.com",
                contactType: "customer support",
              },
            }),
          }}
        />

        {/* JSON-LD — WebSite + SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type":    "WebSite",
              name:       "FindWithHabi",
              url:        BASE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type":     "EntryPoint",
                  urlTemplate: BASE_URL + "/listings?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          {children}
          <ScrollToTop />
        </ToastProvider>
      </body>
    </html>
  )
}