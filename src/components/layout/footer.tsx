import { type ReactNode } from "react";

import { footerNav } from "@/config/navigation";
import { site } from "@/lib/site";
import { Link } from "@/components/ui/link";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
  type BrandIconProps,
} from "@/components/ui/brand-icons";

interface SocialLink {
  label: string;
  href: string;
  Icon: (props: BrandIconProps) => ReactNode;
}

const socialLinks: SocialLink[] = [
  { label: "X", href: site.social.x, Icon: XIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", href: site.social.github, Icon: GitHubIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YouTubeIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
];

/**
 * ZALVY `Footer` — premium end-of-page with measured breathing room.
 *
 * Layout columns are intentionally compact for legibility. The colophon row is
 * kept spare (a single line of legal + status) so users who reach the bottom of
 * a long page always find a single, obvious next step.
 */
export function Footer() {
  return (
    <footer className="border-border bg-surface/30 relative mt-[var(--section-gap)] border-t">
      {/* Aurora wash behind the footer; noninteractive, decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 -translate-y-1/2 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgb(var(--token-accent)/0.18),transparent_70%)] opacity-40"
      />

      <Container className="relative">
        <div className="grid gap-12 py-16 md:py-20">
          <div className="col-span-12 flex flex-col gap-4 md:col-span-5 lg:col-span-4">
            <Link href="/" aria-label="ZALVY — home" silentFocus>
              <Logo />
            </Link>
            <p className="t-body-sm t-muted max-w-xs">
              ZALVY builds intelligent systems — and grows the engineers who build what&rsquo;s
              next.
            </p>
            <div className="mt-2 flex items-center gap-1">
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  external
                  aria-label={`ZALVY on ${social.label}`}
                  className="text-foreground-muted hover:text-foreground hover:bg-surface-overlay inline-flex size-9 items-center justify-center rounded-md transition-colors"
                >
                  <social.Icon aria-hidden />
                </Link>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="col-span-12 grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-4 lg:col-span-8"
          >
            {footerNav.map((column) => (
              <div key={column.label} className="flex flex-col gap-3">
                <p className="text-overline t-subtle tracking-widest uppercase">{column.label}</p>
                <ul className="flex flex-col gap-2.5">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="t-body-sm t-muted hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <FooterColophon />
      </Container>
    </footer>
  );
}

function FooterColophon(): ReactNode {
  return (
    <div className="border-border flex flex-col gap-4 border-t py-8 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
        <p className="t-caption t-subtle">
          © {new Date().getFullYear()} {site.legalName}, Inc. All rights reserved.
        </p>
        <dl className="t-caption t-subtle flex flex-wrap gap-x-4 gap-y-1">
          <dt className="sr-only">Status</dt>
          <dd className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="bg-success inline-flex size-1.5 rounded-full shadow-[0_0_8px_0_rgb(var(--token-success))]"
            />
            All systems operational
          </dd>
          <dd className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="bg-accent inline-flex size-1.5 rounded-full shadow-[0_0_8px_0_rgb(var(--token-accent))]"
            />
            Built in India
          </dd>
        </dl>
      </div>

      <div className="t-caption t-subtle flex flex-wrap gap-x-5 gap-y-1">
        <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
        <Link href="/legal/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
        <Link href="/legal/dpa" className="hover:text-foreground transition-colors">
          DPA
        </Link>
        <Link href="/security" className="hover:text-foreground transition-colors">
          Security
        </Link>
      </div>
    </div>
  );
}
