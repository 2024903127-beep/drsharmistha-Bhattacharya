import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const disallowed = ["/staff", "/staff-login", "/staff-set-password", "/api", "/d/"];
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowed,
      },
      // Explicitly allow Search & AI Answer Engines (ChatGPT, Perplexity, Claude, Gemini, Apple)
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Anthropic-ai",
          "Google-Extended",
          "Bingbot",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: disallowed,
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
