import type { MetadataRoute } from "next";

/**
 * ZALVY — Web App Manifest.
 *
 * Enables PWA install-ability, splash screens, and themed browser chrome.
 * Generated at build time via Next.js App Router convention → `/manifest.webmanifest`.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZALVY — Building Intelligent Systems",
    short_name: "ZALVY",
    description:
      "AI agents, enterprise automation, developer tooling, and internship programs. Building intelligent systems, empowering future talent.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#07090d",
    theme_color: "#07090d",
    categories: ["business", "technology", "productivity"],
    icons: [
      {
        src: "/icons/zalvy-final.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: "/icons/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  };
}
