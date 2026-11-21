"use client";
import { useRef, useCallback } from "react";

export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);

  const handlePointerEnter = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
      ref.current.style.transition = "none";
    }
  }, []);

  const move = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!rectRef.current) {
      if (!ref.current) return;
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const r = rectRef.current;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const x = (clientX - r.left) / r.width - 0.5;
      const y = (clientY - r.top) / r.height - 0.5;
      ref.current.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rectRef.current = null;
    if (ref.current) {
      ref.current.style.transition = "transform 0.4s ease-out";
      ref.current.style.transform = "";
    }
  }, []);

  return (
    <div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={move}
      onPointerLeave={handlePointerLeave}
      className={`tilt ${className}`}
    >
      {children}
    </div>
  );
}
