"use client";
import Image from "next/image";
import { useState } from "react";

// Shows the image if the file exists in /public/assets, otherwise a quiet placeholder (or nothing).
export function SafeImage({ src, alt, sizes = "100vw", priority, className = "", fallback = "block" }: {
  src: string; alt: string; sizes?: string; priority?: boolean; className?: string; fallback?: "block" | "none";
}) {
  const [bad, setBad] = useState(false);
  if (bad) return fallback === "none" ? null : <div role="img" aria-label={alt} className={`absolute inset-0 grid place-items-center bg-sage text-forest/50 font-display text-6xl ${className}`}>S</div>;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      decoding={priority ? "sync" : "async"}
      onError={() => setBad(true)}
      className={`object-cover ${className}`}
    />
  );
}
