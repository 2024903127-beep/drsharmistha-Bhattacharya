"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pen, Eraser, Undo2, Redo2, Trash2, Hand, FileDown, Save, ShieldCheck, Touchpad } from "lucide-react";

// A4 at 96 dpi in logical units; the canvas backing store is 2x for sharp handwriting.
const W = 794, H = 1123, S = 2;
type Pt = { x: number; y: number; p: number };
type Stroke = { tool: "pen" | "eraser"; color: string; size: number; pts: Pt[] };
type Tool = "pen" | "eraser" | "hand";
const colors = [["#111827", "Black"], ["#1d4ed8", "Blue"], ["#b91c1c", "Red"]];

/**
 * Midpoint Quadratic Bézier Curve Renderer
 * Replays completed strokes with organic, fluid handwriting geometry.
 */
function drawStroke(g: CanvasRenderingContext2D, s: Stroke) {
  const pts = s.pts;
  if (!pts || pts.length === 0) return;

  g.save();
  g.setTransform(S, 0, 0, S, 0, 0);
  g.lineCap = "round";
  g.lineJoin = "round";
  if (s.tool === "eraser") {
    g.globalCompositeOperation = "destination-out";
  } else {
    g.globalCompositeOperation = "source-over";
  }
  g.strokeStyle = g.fillStyle = s.color;

  if (pts.length === 1) {
    const r = (s.tool === "eraser" ? s.size * 5 : s.size * (0.7 + pts[0].p * 0.6)) / 2;
    g.beginPath();
    g.arc(pts[0].x, pts[0].y, Math.max(0.5, r), 0, Math.PI * 2);
    g.fill();
    g.restore();
    return;
  }

  if (pts.length === 2) {
    g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.7 + ((pts[0].p + pts[1].p) / 2) * 0.6);
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    g.lineTo(pts[1].x, pts[1].y);
    g.stroke();
    g.restore();
    return;
  }

  // Draw smooth quadratic curves through midpoints
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);

  for (let i = 1; i < pts.length - 1; i++) {
    const xc = pts[i].x;
    const yc = pts[i].y;
    const xm = (pts[i].x + pts[i + 1].x) / 2;
    const ym = (pts[i].y + pts[i + 1].y) / 2;
    g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.7 + pts[i].p * 0.6);
    g.quadraticCurveTo(xc, yc, xm, ym);
  }

  const last = pts[pts.length - 1];
  const lastPrev = pts[pts.length - 2];
  g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.7 + last.p * 0.6);
  g.quadraticCurveTo(lastPrev.x, lastPrev.y, last.x, last.y);
  g.stroke();

  g.restore();
}

export function A4Pad({ id, patient, onSave }: { id: string; patient: string; onSave: (f: File, kind: string) => Promise<void> }) {
  const base = useRef<HTMLCanvasElement>(null);
  const ink = useRef<HTMLCanvasElement>(null);
  const inkCtx = useRef<CanvasRenderingContext2D | null>(null);

  // Drawing state refs (decoupled from React render cycle for zero latency)
  const strokes = useRef<Stroke[]>([]);
  const redo = useRef<Stroke[]>([]);
  const cur = useRef<Stroke | null>(null);
  const lastDrawnIdx = useRef(0);

  // Active pointer tracking
  const activePointerId = useRef<number | null>(null);
  const activePointerType = useRef<string | null>(null);

  // Stylus-first palm rejection state
  const [stylusOnly, setStylusOnly] = useState(false);
  const stylusOnlyRef = useRef(false);
  stylusOnlyRef.current = stylusOnly;

  const [tool, setTool] = useState<Tool>("pen");
  const toolRef = useRef<Tool>("pen");
  toolRef.current = tool;

  const [color, setColor] = useState(colors[0][0]);
  const colorRef = useRef(colors[0][0]);
  colorRef.current = color;

  const [size, setSize] = useState(3);
  const sizeRef = useRef(3);
  sizeRef.current = size;

  const [letterhead, setLetterhead] = useState(true);
  const [ruled, setRuled] = useState(false);
  const [n, setN] = useState({ u: 0, r: 0 });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const key = `pad-draft-${id}`;
  const sync = useCallback(() => setN({ u: strokes.current.length, r: redo.current.length }), []);

  const getInkCtx = useCallback(() => {
    if (!inkCtx.current && ink.current) {
      // Avoid { desynchronized: true } on transparent overlay canvases: Chromium/Windows
      // DirectComposition drops backbuffer alpha on scroll and turns the canvas solid black.
      inkCtx.current = ink.current.getContext("2d");
    }
    return inkCtx.current;
  }, []);

  const drawBase = useCallback(() => {
    if (!base.current) return;
    const g = base.current.getContext("2d");
    if (!g) return;
    g.setTransform(S, 0, 0, S, 0, 0);
    g.fillStyle = "#fff";
    g.fillRect(0, 0, W, H);
    let top = 40;
    if (letterhead) {
      g.fillStyle = "#164B35";
      g.font = "600 26px Georgia, serif";
      g.fillText("Dr. Sharmistha Bhattacharyya", 48, 66);
      g.fillStyle = "#5F6B62";
      g.font = "13px Arial, sans-serif";
      g.fillText("MCh Plastic Surgery (AIIMS)  |  Plastic and Aesthetic Surgery", 48, 88);
      g.fillText("Accord Super Speciality Hospital, Sector 86, Faridabad 121002  |  +91 96672 07009", 48, 107);
      g.strokeStyle = "#B99A65";
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(48, 122);
      g.lineTo(W - 48, 122);
      g.stroke();
      g.fillStyle = "#17231B";
      g.font = "14px Arial, sans-serif";
      g.fillText(`Patient: ${patient}`, 48, 148);
      g.textAlign = "right";
      g.fillText(`Date: ${new Date().toLocaleDateString("en-IN")}`, W - 48, 148);
      g.textAlign = "left";
      g.font = "italic 600 34px Georgia, serif";
      g.fillStyle = "#164B35";
      g.fillText("Rx", 48, 200);
      top = 215;
    }
    if (ruled) {
      g.strokeStyle = "#E5ECE5";
      g.lineWidth = 1;
      for (let y = top + 30; y < H - 60; y += 34) {
        g.beginPath();
        g.moveTo(48, y);
        g.lineTo(W - 48, y);
        g.stroke();
      }
    }
  }, [letterhead, ruled, patient]);

  const redraw = useCallback(() => {
    const g = getInkCtx();
    if (!g) return;
    g.save();
    g.globalCompositeOperation = "source-over";
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W * S, H * S);
    g.restore();
    strokes.current.forEach((s) => drawStroke(g, s));
  }, [getInkCtx]);

  useEffect(() => {
    drawBase();
  }, [drawBase]);

  // Re-sync ink & base buffers safely after tab wake or browser navigation restore
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        drawBase();
        redraw();
      }
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [drawBase, redraw]);

  useEffect(() => {
    try {
      const d = localStorage.getItem(key);
      if (d) {
        strokes.current = JSON.parse(d);
        redraw();
        sync();
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, [key, redraw, sync]);

  // Coordinate mapping from screen pixels to logical 794x1123 A4 units
  const at = useCallback((e: { clientX: number; clientY: number; pointerType?: string; pressure?: number }, r: DOMRect): Pt => {
    const p = e.pointerType === "pen" ? (e.pressure && e.pressure > 0 ? e.pressure : 0.5) : 0.5;
    return {
      x: ((e.clientX - r.left) * W) / r.width,
      y: ((e.clientY - r.top) * H) / r.height,
      p,
    };
  }, []);

  /**
   * High-Performance Real-Time Incremental Renderer
   * Directly draws midpoint Bézier curve segments without re-rendering past points.
   */
  const drawLiveSegments = useCallback((g: CanvasRenderingContext2D, s: Stroke) => {
    const pts = s.pts;
    if (pts.length < 2) return;

    g.save();
    g.setTransform(S, 0, 0, S, 0, 0);
    g.lineCap = "round";
    g.lineJoin = "round";
    if (s.tool === "eraser") {
      g.globalCompositeOperation = "destination-out";
    } else {
      g.globalCompositeOperation = "source-over";
    }
    g.strokeStyle = g.fillStyle = s.color;

    const start = Math.max(1, lastDrawnIdx.current);
    for (let i = start; i < pts.length; i++) {
      g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.7 + pts[i].p * 0.6);
      const p0 = pts[i - 1];
      const p1 = pts[i];

      if (i === 1) {
        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;
        g.beginPath();
        g.moveTo(p0.x, p0.y);
        g.lineTo(mx, my);
        g.stroke();
      } else {
        const prev = pts[i - 2];
        const prevMidX = (prev.x + p0.x) / 2;
        const prevMidY = (prev.y + p0.y) / 2;
        const currMidX = (p0.x + p1.x) / 2;
        const currMidY = (p0.y + p1.y) / 2;
        g.beginPath();
        g.moveTo(prevMidX, prevMidY);
        g.quadraticCurveTo(p0.x, p0.y, currMidX, currMidY);
        g.stroke();
      }
    }

    lastDrawnIdx.current = pts.length - 1;
    g.restore();
  }, []);

  /**
   * NATIVE POINTER EVENT LISTENERS
   * Configured with { passive: false } and touch-action: none for sub-frame response.
   */
  useEffect(() => {
    const canvas = ink.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      // 1. Hand tool allows touch panning and zooming without drawing
      if (toolRef.current === "hand") return;

      // 2. Stylus detection & Smart Preemption
      if (e.pointerType === "pen") {
        // If palm or finger touched slightly before stylus tip hit the screen,
        // pen preempts the accidental touch stroke immediately!
        if (activePointerId.current !== null && activePointerType.current === "touch") {
          try {
            canvas.releasePointerCapture(activePointerId.current);
          } catch {}
          activePointerId.current = null;
          activePointerType.current = null;
          cur.current = null;
          redraw();
        }
      } else if (stylusOnlyRef.current && e.pointerType === "touch") {
        // Strict palm protection mode: doctor locked out touch drawing so hand can rest freely
        return;
      }

      // 3. Single active pointer isolation:
      // While one pointer is active (pen or finger), reject any secondary fingers or palm touch
      if (activePointerId.current !== null) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      activePointerId.current = e.pointerId;
      activePointerType.current = e.pointerType;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}

      const r = canvas.getBoundingClientRect();
      const pt = at(e, r);

      cur.current = {
        tool: toolRef.current,
        color: colorRef.current,
        size: sizeRef.current,
        pts: [pt],
      };
      lastDrawnIdx.current = 0;

      const g = getInkCtx();
      if (g) {
        // Immediate visual feedback dot at touch point
        g.save();
        g.setTransform(S, 0, 0, S, 0, 0);
        g.lineCap = "round";
        g.lineJoin = "round";
        if (toolRef.current === "eraser") {
          g.globalCompositeOperation = "destination-out";
        } else {
          g.globalCompositeOperation = "source-over";
        }
        g.fillStyle = colorRef.current;
        const dotR = (toolRef.current === "eraser" ? sizeRef.current * 5 : sizeRef.current * (0.7 + pt.p * 0.6)) / 2;
        g.beginPath();
        g.arc(pt.x, pt.y, Math.max(0.5, dotR), 0, Math.PI * 2);
        g.fill();
        g.restore();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId.current === null || e.pointerId !== activePointerId.current) {
        return;
      }

      const s = cur.current;
      if (!s) return;

      e.preventDefault();
      e.stopPropagation();

      const r = canvas.getBoundingClientRect();
      if (!r) return;

      // Hardware coalesced events extract 120Hz/240Hz sampling between frames
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (let i = 0; i < evs.length; i++) {
        s.pts.push(at(evs[i], r));
      }

      const g = getInkCtx();
      if (g) {
        drawLiveSegments(g, s);
      }
    };

    const finishStroke = (e: PointerEvent, isCancel: boolean) => {
      if (activePointerId.current === null || e.pointerId !== activePointerId.current) {
        return;
      }

      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {}

      activePointerId.current = null;
      activePointerType.current = null;

      const s = cur.current;
      cur.current = null;
      lastDrawnIdx.current = 0;

      if (!s || s.pts.length === 0) return;

      // On Android pointercancel, commit the stroke if user drew legitimate marks
      if (isCancel && s.pts.length < 2) {
        redraw();
        return;
      }

      const g = getInkCtx();
      if (g && s.pts.length >= 2) {
        // Draw the final closing segment to the last coordinate
        const pts = s.pts;
        const last = pts[pts.length - 1];
        const lastPrev = pts[pts.length - 2];
        const prevMidX = (lastPrev.x + pts[Math.max(0, pts.length - 3)].x) / 2;
        const prevMidY = (lastPrev.y + pts[Math.max(0, pts.length - 3)].y) / 2;

        g.save();
        g.setTransform(S, 0, 0, S, 0, 0);
        g.lineCap = "round";
        g.lineJoin = "round";
        if (s.tool === "eraser") {
          g.globalCompositeOperation = "destination-out";
        } else {
          g.globalCompositeOperation = "source-over";
        }
        g.strokeStyle = s.color;
        g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.7 + last.p * 0.6);
        g.beginPath();
        g.moveTo(prevMidX, prevMidY);
        g.quadraticCurveTo(lastPrev.x, lastPrev.y, last.x, last.y);
        g.stroke();
        g.restore();
      }

      strokes.current.push(s);
      redo.current = [];
      sync();
      try {
        localStorage.setItem(key, JSON.stringify(strokes.current));
      } catch {}
    };

    const onPointerUp = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      finishStroke(e, false);
    };

    const onPointerCancel = (e: PointerEvent) => {
      finishStroke(e, true);
    };

    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("pointerup", onPointerUp, { passive: false });
    canvas.addEventListener("pointercancel", onPointerCancel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [at, drawLiveSegments, getInkCtx, key, redraw, sync]);

  const undo = useCallback(() => {
    const s = strokes.current.pop();
    if (s) {
      redo.current.push(s);
      redraw();
      sync();
      try {
        localStorage.setItem(key, JSON.stringify(strokes.current));
      } catch {}
    }
  }, [key, redraw, sync]);

  const redoFn = useCallback(() => {
    const s = redo.current.pop();
    if (s) {
      strokes.current.push(s);
      redraw();
      sync();
      try {
        localStorage.setItem(key, JSON.stringify(strokes.current));
      } catch {}
    }
  }, [key, redraw, sync]);

  const clear = useCallback(() => {
    if (!strokes.current.length || !confirm("Clear everything you wrote on this page?")) return;
    strokes.current = [];
    redo.current = [];
    redraw();
    sync();
    try {
      localStorage.removeItem(key);
    } catch {}
  }, [key, redraw, sync]);

  // Keyboard shortcut listener (Ctrl+Z / Cmd+Z)
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redoFn() : undo();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [undo, redoFn]);

  async function makePdf() {
    const c = document.createElement("canvas");
    c.width = W * S;
    c.height = H * S;
    const g = c.getContext("2d")!;
    g.drawImage(base.current!, 0, 0);
    g.drawImage(ink.current!, 0, 0);
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.addImage(c.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    return pdf;
  }

  const fname = `prescription-${patient.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;

  async function download() {
    setBusy(true);
    try {
      (await makePdf()).save(fname);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      const blob = (await makePdf()).output("blob");
      await onSave(new File([blob], fname, { type: "application/pdf" }), "A4 pad PDF");
      setMsg("Saved to this visit.");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const tb = (on: boolean) =>
    `grid size-11 place-items-center rounded-xl border ${on ? "border-p-primary bg-p-primary text-white shadow-sm" : "border-p-border bg-white text-p-text hover:bg-p-surface"} disabled:opacity-40 transition-colors`;

  return (
    <div>
      <div className="glass sticky top-20 z-10 mb-4 flex flex-wrap items-center gap-2 p-3 lg:top-3" role="toolbar" aria-label="Writing tools">
        <button
          className={tb(tool === "pen")}
          aria-pressed={tool === "pen"}
          aria-label="Pen"
          onClick={() => setTool("pen")}
        >
          <Pen size={18} />
        </button>
        <button className={tb(tool === "eraser")} aria-pressed={tool === "eraser"} aria-label="Eraser" onClick={() => setTool("eraser")}><Eraser size={18} /></button>
        <button className={tb(tool === "hand")} aria-pressed={tool === "hand"} aria-label="Scroll and zoom (no drawing)" onClick={() => setTool("hand")}><Hand size={18} /></button>
        
        {/* Stylus / Touch Palm Rejection Toggle */}
        <button
          type="button"
          onClick={() => setStylusOnly(!stylusOnly)}
          className={`flex min-h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all ${
            stylusOnly
              ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
              : "border-p-border bg-white text-p-muted hover:text-p-text"
          }`}
          title={stylusOnly ? "Stylus-only active: Resting palm will not draw" : "All inputs active: Touch and stylus both draw"}
        >
          {stylusOnly ? <ShieldCheck size={16} className="text-emerald-700" /> : <Touchpad size={16} />}
          <span>{stylusOnly ? "✍️ Stylus Locked (Palm Protected)" : "👆 Stylus & Touch Active"}</span>
        </button>

        <span className="mx-1 h-6 w-px bg-p-border" />
        {colors.map(([c, name]) => (
          <button
            key={c}
            aria-label={name}
            aria-pressed={color === c}
            onClick={() => {
              setColor(c);
              setTool("pen");
            }}
            className={`grid size-11 place-items-center rounded-xl border ${color === c ? "border-p-primary ring-2 ring-p-primary/20" : "border-p-border"} bg-white`}
          >
            <span className="size-5 rounded-full" style={{ background: c }} />
          </button>
        ))}
        <label className="flex items-center gap-2 px-1 text-xs text-p-muted">
          Size
          <input type="range" min={1} max={8} value={size} onChange={(e) => setSize(+e.target.value)} className="w-20 accent-p-primary" />
        </label>
        <span className="mx-1 h-6 w-px bg-p-border" />
        <button className={tb(false)} aria-label="Undo" disabled={!n.u} onClick={undo}><Undo2 size={18} /></button>
        <button className={tb(false)} aria-label="Redo" disabled={!n.r} onClick={redoFn}><Redo2 size={18} /></button>
        <button className={tb(false)} aria-label="Clear page" disabled={!n.u} onClick={clear}><Trash2 size={18} /></button>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 px-2 text-xs">
          <input type="checkbox" checked={letterhead} onChange={(e) => setLetterhead(e.target.checked)} className="rounded accent-p-primary" />
          Letterhead
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 px-2 text-xs">
          <input type="checkbox" checked={ruled} onChange={(e) => setRuled(e.target.checked)} className="rounded accent-p-primary" />
          Lines
        </label>
        <div className="ml-auto flex gap-2">
          <button className="p-btn p-btn-ghost" onClick={download} disabled={busy}><FileDown size={16} aria-hidden />PDF</button>
          <button className="p-btn" onClick={save} disabled={busy}><Save size={16} aria-hidden />Save to visit</button>
        </div>
      </div>
      {msg && <p role="status" className="mb-3 text-sm text-p-muted">{msg}</p>}
      <div className="pad-scroll mx-auto max-w-[794px] overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(22,75,53,.15)]" style={{ isolation: "isolate" }}>
        <div className="relative w-full select-none bg-white" style={{ aspectRatio: `${W} / ${H}` }}>
          <canvas ref={base} width={W * S} height={H * S} className="absolute inset-0 size-full pointer-events-none" />
          <canvas
            ref={ink}
            width={W * S}
            height={H * S}
            className="absolute inset-0 size-full select-none"
            style={{
              touchAction: tool === "hand" ? "pan-x pan-y" : "none",
              cursor: tool === "hand" ? "grab" : "crosshair",
            }}
          />
        </div>
      </div>
    </div>
  );
}
