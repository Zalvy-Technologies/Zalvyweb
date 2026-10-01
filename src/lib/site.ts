/**
 * ZALVY site-wide metadata & brand facts.
 * Single source of truth for SEO, Open Graph, Schema.org, and footer references.
 */
export const site = {
  name: "ZALVY",
  legalName: "Zalvy Technologies",
  tagline: "Building Intelligent Systems. Empowering Future Talent.",
  description:
    "ZALVY engineers AI agents, enterprise automation, and developer tooling — and trains the engineers who build what's next. Trusted by startups, enterprises, and the people who power them.",
  url: "https://zalvy.com",
  locale: "en_US",
  themeColor: "#07090d",
  themeColorLight: "#fcfbf8",
  contact: {
    email: "zalvyofficial@gmail.com",
    enterprise: "enterprise@zalvy.com",
    internships: "careers@zalvy.com",
    phone: "+91 7893356284",
  },
  social: {
    x: "https://x.com/zalvyhq",
    linkedin: "https://www.linkedin.com/company/zalvy",
    github: "https://github.com/zalvy",
    youtube: "https://www.youtube.com/@zalvyhq",
    instagram: "https://www.instagram.com/zalvyhq/",
  },
  founded: 2024,
  ogImage: "/og/zalvy-og.png",
  twitterHandle: "@zalvyhq",
} as const;

export type Site = typeof site;
