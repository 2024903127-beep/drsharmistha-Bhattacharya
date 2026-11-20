export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-forest/15 border-y border-forest/15">
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-xl text-forest">
            {f.q}
            <span aria-hidden className="text-2xl text-gold-deep transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-[68ch] leading-relaxed text-stone">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
