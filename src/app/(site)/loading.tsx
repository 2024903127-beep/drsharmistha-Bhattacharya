export default function SiteLoading() {
  return (
    <div
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-ivory pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, #173d32 0%, #0f2b23 70%, #081713 100%)",
      }}
    >
      {/* Luxury doctor monogram */}
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <div className="absolute inset-[-8px] rounded-full border border-gold/40 animate-ping opacity-75" />
        <div className="size-20 rounded-full border-2 border-gold/60 bg-gradient-to-br from-gold/25 to-forest-deep flex items-center justify-center shadow-2xl">
          <span className="font-display text-4xl font-light text-gold leading-none">
            S
          </span>
        </div>
      </div>

      {/* Doctor Name */}
      <div className="font-display text-2xl text-ivory tracking-tight mb-1 text-center px-4">
        Dr. Sharmistha Bhattacharyya
      </div>

      {/* Subtitle */}
      <div className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold/80 mb-6 text-center px-4">
        Plastic &amp; Aesthetic Surgery · AIIMS New Delhi
      </div>

      {/* Golden pulsation pearls */}
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
        <div className="size-2 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
        <div className="size-2 rounded-full bg-gold animate-bounce" />
      </div>
    </div>
  );
}
