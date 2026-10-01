"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";

import { megaNav, navCtas, navRoutes } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/ui/container";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleMegaEnter = useCallback((id: string) => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setActiveMega(id);
  }, []);

  const handleMegaLeave = useCallback(() => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      setActiveMega(null);
    }, 120);
  }, []);

  const onTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      handleMegaEnter(id);
    }
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-header)]",
        "transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ease-standard",
        scrolled
          ? "border-white/[0.06] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgb(var(--token-canvas)/0.68)] bg-[rgb(var(--token-canvas)/0.88)] border-b shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset,0_8px_32px_rgb(0_0_0/0.35)]"
          : "border-b border-transparent bg-transparent",
      )}
      data-scrolled={scrolled}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300",
          scrolled
            ? "opacity-0"
            : "from-transparent via-[rgb(var(--token-accent)/0.5)] to-transparent bg-gradient-to-r opacity-100",
        )}
      />

      <Container width="default" flush={false} className="h-[var(--header-h)] md:h-[var(--header-h)]">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="ZALVY — home" silentFocus>
              <Logo />
            </Link>
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
              {megaNav.map((entry) => {
                const id = `mega-${entry.label}`;
                const isOpen = activeMega === id;
                return (
                  <div
                    key={id}
                    className="relative"
                    onMouseEnter={() => {
                      handleMegaEnter(id);
                    }}
                    onMouseLeave={handleMegaLeave}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={`${id}-panel`}
                      onKeyDown={(e) => {
                        onTriggerKey(e, id);
                      }}
                      onClick={() => {
                        if (isOpen) setActiveMega(null);
                        else handleMegaEnter(id);
                      }}
                      className={cn(
                        "group inline-flex h-9 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
                        "text-foreground-muted hover:text-foreground hover:bg-surface-overlay",
                        "transition-colors duration-quick",
                        isOpen && "text-foreground bg-surface-overlay",
                      )}
                    >
                      {entry.label}
                      <Icon
                        icon={ChevronDown}
                        aria-hidden
                        size="sm"
                        className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen ? (
                        <motion.div
                          id={`${id}-panel`}
                          role="menu"
                          aria-label={`${entry.label} menu`}
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
                          className={cn(
                            "absolute left-0 top-full mt-2",
                            "w-[560px] max-w-[calc(100vw-2rem)]",
                            "rounded-2xl",
                            "bg-surface-raised/95 backdrop-blur-xl",
                            "border border-white/10",
                            "shadow-2xl",
                            "overflow-hidden z-50",
                          )}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 p-3">
                            {entry.groups.map((group) => (
                              <div key={group.label} className="p-1">
                                <p className="text-overline t-subtle px-2 pb-2 pt-1 uppercase tracking-widest text-[10px]">
                                  {group.label}
                                </p>
                                <ul role="none" className="flex flex-col gap-0.5">
                                  {group.items.map((item) => (
                                    <li key={item.href} role="none">
                                      <Link
                                        role="menuitem"
                                        href={item.href}
                                        onClick={() => {
                                          setActiveMega(null);
                                        }}
                                        className={cn(
                                          "group flex items-start gap-3 rounded-lg px-2.5 py-2.5",
                                          "hover:bg-surface-overlay transition-colors duration-quick",
                                        )}
                                      >
                                        <span className="bg-accent-subtle text-accent ring-accent/15 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md ring-1 ring-inset">
                                          <item.icon size={16} strokeWidth={1.75} aria-hidden />
                                        </span>
                                        <span className="flex flex-col min-w-0 flex-1">
                                          <span className="text-foreground text-[0.875rem] font-medium leading-snug">
                                            {item.label}
                                          </span>
                                          <span className="t-muted text-[0.75rem] leading-snug mt-0.5">
                                            {item.description}
                                          </span>
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}

              {navRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 py-2 text-sm font-medium",
                    "text-foreground-muted hover:text-foreground hover:bg-surface-overlay",
                    "transition-colors duration-quick",
                  )}
                  external={route.external}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            {navCtas.map((cta) => {
              const btn = (
                <Button key={cta.href} asChild variant={cta.variant} size="sm" className="hidden md:inline-flex">
                  <Link href={cta.href} external={!cta.href.startsWith("/")}>
                    {cta.label}
                  </Link>
                </Button>
              );
              return cta.variant === "primary" ? (
                <MagneticButton key={cta.href}>{btn}</MagneticButton>
              ) : (
                btn
              );
            })}

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="sm:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="zalvy-mobile-menu"
              onClick={() => {
                setMobileOpen((open) => !open);
              }}
            >
              <Icon icon={mobileOpen ? X : Menu} size="sm" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="zalvy-mobile-menu"
              onClick={() => {
                setMobileOpen((open) => !open);
              }}
            >
              <Icon icon={mobileOpen ? X : Menu} aria-hidden />
            </Button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen ? <MobileDrawer onClose={() => { setMobileOpen(false); }} /> : null}
      </AnimatePresence>
    </header>
  );
}

interface MobileDrawerProps {
  onClose: () => void;
}

function MobileDrawer({ onClose }: MobileDrawerProps) {
  return (
    <motion.div
      id="zalvy-mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="z-[var(--z-modal)] fixed inset-0 lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-[rgb(var(--token-canvas)/0.6)] backdrop-blur-sm"
        tabIndex={-1}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 38, mass: 0.9 }}
        className="bg-surface border-border absolute right-0 top-0 h-[100dvh] w-[min(22rem,100vw)] border-l shadow-2xl"
      >
        <header className="flex h-[var(--header-h)] items-center justify-between px-4 relative z-10">
          <Logo markOnly />
          <Button variant="ghost" size="icon-sm" aria-label="Close menu" onClick={onClose}>
            <Icon icon={X} size="sm" aria-hidden />
          </Button>
        </header>
        <div className="h-[calc(100dvh-var(--header-h))] overflow-y-auto px-3 py-4">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {megaNav.map((entry, ei) => (
              <motion.div
                key={entry.href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + ei * 0.06, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="flex flex-col gap-1"
              >
                <p className="text-overline t-subtle px-3 pt-1 pb-1 uppercase tracking-widest">
                  {entry.label}
                </p>
                {entry.groups
                  .flatMap((group) => group.items)
                  .map((item, ii) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.14 + ei * 0.06 + ii * 0.03, duration: 0.35 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="hover:bg-surface-overlay flex items-start gap-3 rounded-lg px-3 py-2.5"
                      >
                        <span className="bg-accent-subtle text-accent mt-0.5 inline-flex size-8 items-center justify-center rounded-md">
                          <item.icon size={16} strokeWidth={1.75} aria-hidden />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-foreground text-sm font-medium">{item.label}</span>
                          <span className="t-muted text-[0.8125rem] leading-snug">{item.description}</span>
                        </span>
                      </Link>
                    </motion.div>
                  ))}
              </motion.div>
            ))}
            {navRoutes.map((route, i) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.04, duration: 0.35 }}
              >
                <Link
                  href={route.href}
                  onClick={onClose}
                  external={route.external}
                  className="text-foreground hover:bg-surface-overlay block rounded-lg px-3 py-2.5 text-sm font-medium"
                >
                  {route.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            className="mt-6 flex flex-col gap-2 px-3"
          >
            {navCtas.map((cta) => (
              <Button key={cta.href} asChild variant={cta.variant} size="lg" fullWidth>
                <Link href={cta.href} external={!cta.href.startsWith("/")} onClick={onClose}>
                  {cta.label}
                </Link>
              </Button>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

