import { Suspense } from "react"

export const metadata = {
  title: "Browse Properties",
  description: "Search thousands of verified houses, apartments, land and commercial properties for sale and rent across Nigeria. Filter by state, price, bedrooms and more.",
  keywords: [
    "property listings Nigeria",
    "houses for rent Nigeria",
    "apartments for sale Lagos",
    "land for sale Nigeria",
    "commercial property rent",
    "student housing Nigeria",
  ],
  openGraph: {
    title: "Browse Properties in Nigeria | FindWithHabi",
    description: "Search verified houses, apartments, land and commercial properties across all 36 Nigerian states.",
    url: "https://findwithhabi.com/listings",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://findwithhabi.com/listings",
  },
}

export default function ListingsLayout({ children }) {
  return children
}