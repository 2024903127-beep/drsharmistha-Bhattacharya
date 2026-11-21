import Link from "next/link";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { site } from "@/lib/site";

export function StickyCta() {
  const base = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-forest/15 bg-ivory pb-[env(safe-area-inset-bottom)] md:hidden transform-gpu shadow-[0_-4px_20px_rgba(23,61,50,.08)]">
      <a href={site.phoneHref} className={`${base} text-forest hover:text-gold-deep transition-colors`}><Phone size={18} aria-hidden />Call</a>
      <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={`${base} text-forest hover:text-gold-deep transition-colors`}><MessageCircle size={18} aria-hidden />WhatsApp</a>
      <Link href="/book-consultation" className={`${base} sticky-book bg-forest text-ivory relative`}><CalendarCheck size={18} aria-hidden />Book</Link>
    </div>
  );
}
