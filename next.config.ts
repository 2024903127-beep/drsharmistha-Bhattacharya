import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["10.203.112.126", "localhost", "127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  webpack: (config, { dev }) => {
    if (dev) config.cache = { type: "memory" };
    return config;
  },
  async headers() {
    const ContentSecurityPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.supabase.co https://*.r2.cloudflarestorage.com https://*.r2.dev https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com",
      "connect-src 'self' https://*.supabase.co https://graph.facebook.com https://oauth2.googleapis.com https://www.googleapis.com https://vitals.vercel-insights.com https://www.google-analytics.com",
      "frame-src 'self' https://checkout.razorpay.com https://www.google.com",
      "media-src 'self' https://*.r2.dev blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      // Staff portal — no-index, no cache
      {
        source: "/staff/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      // API routes — no cache, no index
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      // Public static assets — long cache
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // All pages — security headers + SEO signals
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical redirects for legal page aliases
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
      { source: "/hipaa", destination: "/data-protection-and-hipaa", permanent: true },
      // Common misspellings / variants
      { source: "/about", destination: "/about-dr-sharmistha", permanent: true },
      { source: "/book", destination: "/book-consultation", permanent: true },
      { source: "/consultation", destination: "/book-consultation", permanent: true },
      { source: "/rhinoplasty", destination: "/services/rhinoplasty", permanent: true },
      { source: "/gynecomastia", destination: "/services/gynecomastia", permanent: true },
      { source: "/liposuction", destination: "/services/liposuction", permanent: true },
      { source: "/facelift", destination: "/services/facelift", permanent: true },
    ];
  },
};

export default config;
