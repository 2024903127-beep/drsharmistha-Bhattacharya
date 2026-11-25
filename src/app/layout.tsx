import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { site } from "@/lib/site";
import { websiteLd, localBusinessLd, physicianLd } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Plastic & Aesthetic Surgeon Across Delhi NCR | ${site.name}`,
    template: "%s | Dr. Sharmistha Bhattacharyya",
  },
  description:
    "AIIMS-trained plastic and aesthetic surgeon serving patients across Delhi NCR — Gurgaon (Golf Course Road), South Delhi & Faridabad. Detailed 1:1 private consultations for rhinoplasty, facelift, breast, body, hair and skin treatments.",
  keywords: [
    "plastic surgeon Delhi NCR",
    "plastic surgeon Gurgaon Golf Course Road",
    "cosmetic surgeon South Delhi",
    "rhinoplasty Delhi NCR",
    "rhinoplasty Gurgaon",
    "facelift South Delhi",
    "breast surgery Gurgaon",
    "liposuction Delhi NCR",
    "gynecomastia Gurgaon",
    "tummy tuck South Delhi",
    "plastic surgeon Faridabad",
    "AIIMS plastic surgeon Delhi NCR",
    "Dr Sharmistha Bhattacharyya",
    "online plastic surgery consultation",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/favicon.png", sizes: "256x256", type: "image/png" },
      { url: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
  },
  authors: [{ name: "Dr. Sharmistha Bhattacharyya", url: site.url }],
  creator: "Dr. Sharmistha Bhattacharyya",
  publisher: "Dr. Sharmistha Bhattacharyya",
  category: "Healthcare / Plastic Surgery",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.brand,
    images: [
      {
        url: `${site.url}/assets/og.jpg`,
        secureUrl: `${site.url}/assets/og.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Dr. Sharmistha Bhattacharyya — Plastic & Aesthetic Surgeon Across Delhi NCR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@drsharmistha",
    site: "@drsharmistha",
    images: [`${site.url}/assets/og.jpg`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = { themeColor: "#173d32", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://graph.facebook.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
      </head>
      <body>
        <JsonLd data={[websiteLd, localBusinessLd, physicianLd]} />
        {children}
      </body>
    </html>
  );
}
