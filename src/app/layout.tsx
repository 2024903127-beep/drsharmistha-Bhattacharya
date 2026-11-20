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
    default: `Plastic Surgeon in Faridabad | ${site.name}`,
    template: "%s | Dr. Sharmistha Bhattacharyya",
  },
  description:
    "AIIMS-trained plastic and aesthetic surgeon in Faridabad serving Delhi NCR and Gurgaon. Rhinoplasty, facelift, breast surgery, body contouring, hair restoration and skin treatments. Book online consultation.",
  keywords: [
    "plastic surgeon Faridabad",
    "plastic surgery Faridabad",
    "rhinoplasty Faridabad",
    "facelift Faridabad",
    "breast surgery Faridabad",
    "liposuction Faridabad",
    "gynecomastia Faridabad",
    "AIIMS plastic surgeon",
    "aesthetic surgeon Delhi NCR",
    "Dr Sharmistha Bhattacharyya",
    "online plastic surgery consultation",
    "cosmetic surgeon Gurgaon",
    "cosmetic surgery Delhi",
  ],
  icons: { icon: "/assets/favicon.png", apple: "/assets/apple-touch-icon.png" },
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
    siteName: site.brand,
    images: [{ url: "/assets/og.jpg", width: 1200, height: 630, alt: "Dr. Sharmistha Bhattacharyya — Plastic Surgeon in Faridabad" }],
  },
  twitter: { card: "summary_large_image", creator: "@drsharmistha", site: "@drsharmistha" },
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
