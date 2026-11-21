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
        <style dangerouslySetInnerHTML={{ __html: `
          #dr-splash {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: radial-gradient(ellipse at center, #173d32 0%, #0f2b23 65%, #081713 100%);
            transition: opacity 0.55s ease, visibility 0.55s ease;
          }
          #dr-splash.dr-hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
          .dr-crest-wrap {
            position: relative;
            width: 84px;
            height: 84px;
            margin-bottom: 24px;
            display: grid;
            place-items: center;
          }
          .dr-crest {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, rgba(200,171,120,0.25) 0%, rgba(15,43,35,0.9) 100%);
            border: 1.5px solid rgba(185,154,101,0.6);
            box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 24px rgba(185,154,101,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
            animation: dr-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
          }
          .dr-crest span {
            font-family: Georgia, serif;
            font-size: 34px;
            font-weight: 300;
            color: #c8ab78;
            line-height: 1;
          }
          .dr-ring {
            position: absolute;
            inset: -10px;
            border-radius: 50%;
            border: 1.5px solid rgba(185,154,101,0.45);
            animation: dr-ring-pulse 1.8s ease-out infinite;
          }
          .dr-ring:nth-child(2) { animation-delay: 0.6s; }
          .dr-title {
            font-family: Georgia, serif;
            font-size: 22px;
            font-weight: 300;
            color: #f7f4ed;
            letter-spacing: -0.02em;
            margin-bottom: 8px;
            animation: dr-fade-up 0.5s 0.2s both;
            text-align: center;
            padding: 0 20px;
          }
          .dr-sub {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: rgba(200,171,120,0.85);
            margin-bottom: 24px;
            animation: dr-fade-up 0.5s 0.35s both;
            text-align: center;
            padding: 0 20px;
          }
          .dr-dots {
            display: flex;
            gap: 8px;
            animation: dr-fade-up 0.5s 0.5s both;
          }
          .dr-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #c8ab78;
            animation: dr-dot-bounce 1.2s ease-in-out infinite;
          }
          .dr-dot:nth-child(2) { animation-delay: 0.15s; }
          .dr-dot:nth-child(3) { animation-delay: 0.3s; }
          @keyframes dr-pop {
            from { opacity: 0; transform: scale(0.7); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes dr-fade-up {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes dr-ring-pulse {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          @keyframes dr-dot-bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
            40% { transform: translateY(-7px); opacity: 1; }
          }
        ` }} />
      </head>
      <body>
        {/* Luxury Brand Splash Screen */}
        <div id="dr-splash" aria-hidden="true">
          <div className="dr-crest-wrap">
            <div className="dr-ring" />
            <div className="dr-ring" />
            <div className="dr-crest">
              <span>S</span>
            </div>
          </div>
          <div className="dr-title">Dr. Sharmistha Bhattacharyya</div>
          <div className="dr-sub">MCh · AIIMS New Delhi · Plastic &amp; Aesthetic Surgery</div>
          <div className="dr-dots">
            <div className="dr-dot" />
            <div className="dr-dot" />
            <div className="dr-dot" />
          </div>
        </div>

        {/* Dismiss splash smoothly on complete */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            function hideSplash() {
              var s = document.getElementById('dr-splash');
              if (s) {
                s.classList.add('dr-hidden');
                setTimeout(function() { s.remove(); }, 600);
              }
            }
            if (document.readyState === 'complete') {
              setTimeout(hideSplash, 350);
            } else {
              window.addEventListener('load', function() {
                setTimeout(hideSplash, 350);
              });
              setTimeout(hideSplash, 1800);
            }
          })();
        ` }} />

        <JsonLd data={[websiteLd, localBusinessLd, physicianLd]} />
        {children}
      </body>
    </html>
  );
}
