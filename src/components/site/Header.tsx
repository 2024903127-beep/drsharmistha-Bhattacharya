"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Phone, Calendar, User } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { href: "/",                    label: "Home" },
  { href: "/services",            label: "Procedures" },
  { href: "/about-dr-sharmistha", label: "About the surgeon" },
  { href: "/locations",           label: "Locations" },
  { href: "/blog",                label: "Patient guides" },
  { href: "/contact",             label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Scroll-aware styling with rAF throttling and threshold deduplication */
  useEffect(() => {
    let rafId: number | null = null;
    let lastScrolled = false;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const isPast = window.scrollY > 40;
        if (isPast !== lastScrolled) {
          lastScrolled = isPast;
          setScrolled(isPast);
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 w-full transition-[background-color,border-color,box-shadow] duration-300 transform-gpu ${
          scrolled
            ? "bg-forest-deep/96 backdrop-blur-md border-b border-gold/15 shadow-[0_4px_24px_rgba(0,0,0,.35)]"
            : "bg-ivory border-b border-forest/10"
        }`}
      >
        <div className="wrap flex h-14 items-center justify-between gap-3 md:h-[4.5rem]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 leading-tight min-w-0 flex-shrink" onClick={close}>
            <div
              className={`grid size-8 flex-shrink-0 place-items-center rounded-full border transition-all duration-300 md:size-9 ${
                scrolled ? "border-gold/50 bg-gold/10" : "border-forest/30 bg-forest/5"
              }`}
            >
              <span className={`font-display text-sm leading-none transition-colors duration-300 ${scrolled ? "text-gold" : "text-forest"}`}>
                S
              </span>
            </div>
            <div className="min-w-0">
              <span className={`block font-display text-base leading-tight truncate transition-colors duration-300 md:text-xl lg:text-2xl ${scrolled ? "text-ivory" : "text-forest"}`}>
                Dr. Sharmistha Bhattacharyya
              </span>
              <span className={`block text-[10px] transition-colors duration-300 md:text-xs ${scrolled ? "text-gold/60" : "text-stone"}`}>
                Plastic and Aesthetic Surgery
              </span>
            </div>
          </Link>

          {/* Desktop nav — no book button, just links + phone */}
          <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {nav.filter(n => n.href !== "/").map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`py-2 transition-colors duration-200 hover:text-gold whitespace-nowrap ${scrolled ? "text-ivory/80" : "text-ink"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right: phone (xl+) + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={site.phoneHref}
              className={`hidden min-h-11 items-center gap-2 px-3 text-sm font-medium xl:flex transition-colors ${scrolled ? "text-gold/80 hover:text-gold" : "text-forest hover:text-gold-deep"}`}
            >
              <Phone size={15} aria-hidden />
              <span className="hidden 2xl:inline">{site.phone}</span>
            </a>
            {/* Hamburger — mobile + iPad portrait (< lg) */}
            <button
              className={`grid size-10 place-items-center rounded-sm transition-colors lg:hidden ${scrolled ? "text-ivory hover:bg-white/10" : "text-ink hover:bg-forest/5"}`}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Right-slide drawer (mobile / tablet) ─────────────────── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-50 transition-all duration-400 lg:hidden ${
          open
            ? "bg-forest-deep/60 backdrop-blur-sm pointer-events-auto opacity-100 visible"
            : "bg-transparent pointer-events-none backdrop-blur-none opacity-0 invisible"
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-50 h-full w-[82vw] max-w-[360px] flex flex-col
          bg-forest-deep text-ivory
          transition-all duration-400 ease-[cubic-bezier(.4,0,.2,1)] lg:hidden
          ${open
            ? "translate-x-0 shadow-[-8px_0_48px_rgba(0,0,0,.55)] visible pointer-events-auto"
            : "translate-x-full shadow-none invisible pointer-events-none"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ivory/10">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gold/10">
              <span className="font-display text-sm text-gold leading-none">S</span>
            </div>
            <div>
              <div className="font-display text-base text-ivory leading-tight">Dr. Sharmistha</div>
              <div className="text-[10px] text-gold/60 mt-0.5 tracking-wide">Plastic &amp; Aesthetic Surgery</div>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-full border border-ivory/15 text-ivory/60 hover:text-ivory hover:border-ivory/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gold rule */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Nav links */}
        <nav aria-label="Drawer navigation" className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={close}
                  className="group flex items-center justify-between min-h-14 py-2 border-b border-ivory/8 last:border-0"
                >
                  <span className="font-display text-xl text-ivory/90 group-hover:text-gold transition-colors duration-200">
                    {n.label}
                  </span>
                  <span className="text-ivory/20 group-hover:text-gold/60 transition-colors text-lg">→</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Phone */}
          <a
            href={site.phoneHref}
            className="flex items-center gap-3 mt-6 py-3 text-gold/80 hover:text-gold transition-colors"
          >
            <Phone size={15} />
            <span className="text-sm font-medium">{site.phone}</span>
          </a>
        </nav>

        {/* Bottom CTAs */}
        <div className="px-5 pb-8 pt-4 space-y-3 border-t border-ivory/10">
          <Link
            href="/book-consultation"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-full font-semibold text-base text-forest-deep transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #c8ab78 0%, #b99a65 50%, #9a7a45 100%)", boxShadow: "0 4px 20px rgba(185,154,101,.4)" }}
          >
            <Calendar size={17} />
            Book consultation
          </Link>
          <Link
            href="/staff-login"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full min-h-[48px] rounded-full font-medium text-sm text-ivory/70 border border-ivory/20 hover:border-ivory/40 hover:text-ivory transition-all duration-300"
          >
            <User size={15} />
            Staff Login
          </Link>
        </div>
      </div>
    </>
  );
}
