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
      <style>{`
        @keyframes lux-crest-pulse {
          0% { transform: scale(0.97); opacity: 0.85; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(0.97); opacity: 0.85; }
        }
        @keyframes lux-ring-glow {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes lux-dot-float {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-7px); opacity: 1; }
        }
        .lux-crest {
          position: relative;
          width: 76px;
          height: 76px;
          border-radius: 9999px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(200,171,120,0.22) 0%, rgba(15,43,35,0.85) 100%);
          border: 1.5px solid rgba(185,154,101,0.55);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(185,154,101,0.25), inset 0 1px 0 rgba(255,255,255,0.25);
          animation: lux-crest-pulse 2s ease-in-out infinite;
        }
        .lux-ring {
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          border: 1.5px solid rgba(185,154,101,0.45);
          animation: lux-ring-glow 1.8s cubic-bezier(0.2,0.8,0.2,1) infinite;
        }
        .lux-dot-1 { animation: lux-dot-float 1.2s ease-in-out infinite; }
        .lux-dot-2 { animation: lux-dot-float 1.2s ease-in-out 0.15s infinite; }
        .lux-dot-3 { animation: lux-dot-float 1.2s ease-in-out 0.3s infinite; }
      `}</style>

      {/* Luxury doctor monogram */}
      <div className="relative mb-6">
        <div className="lux-ring" />
        <div className="lux-crest">
          <span className="font-display text-3xl font-light text-gold leading-none">
            S
          </span>
        </div>
      </div>

      {/* Doctor Name */}
      <div className="font-display text-xl md:text-2xl text-ivory tracking-tight mb-2 text-center px-4">
        Dr. Sharmistha Bhattacharyya
      </div>

      {/* Subtitle */}
      <div className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold/80 mb-7 text-center px-4">
        Plastic &amp; Aesthetic Surgery · AIIMS New Delhi
      </div>

      {/* Golden pulsation pearls */}
      <div className="flex items-center gap-2.5">
        <div className="size-2 rounded-full bg-gold lux-dot-1" />
        <div className="size-2 rounded-full bg-gold lux-dot-2" />
        <div className="size-2 rounded-full bg-gold lux-dot-3" />
      </div>
    </div>
  );
}
