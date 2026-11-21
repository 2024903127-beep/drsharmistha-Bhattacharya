"use client";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out after initial page load
    const t1 = setTimeout(() => setMounted(true), 400);
    // Unmount after transition completes
    const t2 = setTimeout(() => setVisible(false), 950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="dr-splash"
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ease-out ${
        mounted ? "opacity-0 invisible" : "opacity-100 visible"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, #173d32 0%, #0f2b23 65%, #081713 100%)",
      }}
    >
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <div className="absolute inset-[-8px] rounded-full border border-gold/40 animate-ping opacity-75" />
        <div className="size-20 rounded-full border-2 border-gold/60 bg-gradient-to-br from-gold/25 to-forest-deep flex items-center justify-center shadow-2xl">
          <span className="font-display text-4xl font-light text-gold leading-none">S</span>
        </div>
      </div>
      <div className="font-display text-2xl text-ivory text-center px-4 tracking-tight">
        Dr. Sharmistha Bhattacharyya
      </div>
      <div className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold/80 mt-1 mb-6 text-center px-4">
        MCh · AIIMS New Delhi · Plastic &amp; Aesthetic Surgery
      </div>
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
        <div className="size-2 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
        <div className="size-2 rounded-full bg-gold animate-bounce" />
      </div>
    </div>
  );
}
