export default function SiteLoading() {
  return (
    <div aria-live="polite" aria-label="Loading page" className="min-h-screen w-full overflow-hidden">

      {/* ── Hero skeleton ── */}
      <div
        className="relative flex min-h-[85vh] w-full flex-col items-center justify-center gap-10 px-5 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24"
        style={{ background: "linear-gradient(135deg, #0f2b23 0%, #173d32 55%, #1a4a3c 100%)" }}
      >
        {/* Left text block */}
        <div className="flex w-full max-w-xl flex-col gap-4 md:gap-5">
          <div className="h-2.5 w-28 rounded-full" style={{ background: "rgba(185,154,101,.18)", animation: "shimmer-gold 1.6s infinite" }} />
          <div className="h-14 w-full rounded" style={{ background: "rgba(247,244,237,.07)", animation: "shimmer-gold 1.6s infinite .05s" }} />
          <div className="h-14 w-4/5 rounded" style={{ background: "rgba(247,244,237,.05)", animation: "shimmer-gold 1.6s infinite .1s" }} />
          <div className="mt-2 h-4 w-full rounded" style={{ background: "rgba(247,244,237,.04)", animation: "shimmer-gold 1.6s infinite .15s" }} />
          <div className="h-4 w-3/4 rounded" style={{ background: "rgba(247,244,237,.04)", animation: "shimmer-gold 1.6s infinite .2s" }} />
          <div className="mt-4 flex gap-3">
            <div className="h-12 w-48 rounded-full" style={{ background: "rgba(185,154,101,.22)", animation: "shimmer-gold 1.6s infinite .25s" }} />
            <div className="h-12 w-40 rounded-full" style={{ background: "rgba(247,244,237,.06)", animation: "shimmer-gold 1.6s infinite .3s" }} />
          </div>
        </div>

        {/* Right portrait */}
        <div
          className="hidden md:block w-64 lg:w-80 aspect-[4/5] rounded-sm flex-shrink-0"
          style={{ background: "rgba(247,244,237,.05)", animation: "shimmer-gold 1.6s infinite .15s" }}
        />

        {/* Stats bar at bottom */}
        <div className="absolute bottom-0 inset-x-0 grid grid-cols-2 gap-2 p-4 md:grid-cols-4 md:p-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-sm" style={{ background: "rgba(255,255,255,.04)", animation: `shimmer-gold 1.6s infinite ${i * 0.08}s` }} />
          ))}
        </div>
      </div>

      {/* ── Monogram crest centered ── */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative mb-5 flex size-16 items-center justify-center">
          <div className="absolute inset-[-6px] rounded-full border border-[rgba(185,154,101,.4)] animate-ping opacity-60" />
          <div
            className="size-16 rounded-full border-2 border-[rgba(185,154,101,.6)] flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, rgba(185,154,101,.25), #0f2b23)" }}
          >
            <span className="font-display text-3xl font-light text-[#b99a65] leading-none">S</span>
          </div>
        </div>
        <div className="font-display text-lg text-[rgba(247,244,237,.9)] tracking-tight mb-1 text-center">
          Dr. Sharmistha Bhattacharyya
        </div>
        <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[rgba(185,154,101,.7)] mb-5 text-center">
          Plastic &amp; Aesthetic Surgery · AIIMS
        </div>
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-[#b99a65] animate-bounce [animation-delay:-0.3s]" />
          <div className="size-1.5 rounded-full bg-[#b99a65] animate-bounce [animation-delay:-0.15s]" />
          <div className="size-1.5 rounded-full bg-[#b99a65] animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer-gold {
          0%   { opacity: 0.6; }
          50%  { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
