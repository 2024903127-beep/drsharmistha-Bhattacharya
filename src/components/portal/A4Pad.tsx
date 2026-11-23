"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pen, Eraser, Undo2, Redo2, Trash2, Hand, FileDown, Save } from "lucide-react";

// A4 at 96 dpi in logical units; the canvas backing store is 2x for sharp handwriting.
const W = 794, H = 1123, S = 2;
type Pt = { x: number; y: number; p: number };
type Stroke = { tool: "pen" | "eraser"; color: string; size: number; pts: Pt[] };
type Tool = "pen" | "eraser" | "hand";
const colors = [["#111827", "Black"], ["#1d4ed8", "Blue"], ["#b91c1c", "Red"]];

function paint(g: CanvasRenderingContext2D, s: Stroke, from = 0) {
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
  const pts = s.pts;

  if (pts.length === 1 && from === 0) {
    g.beginPath();
    g.arc(pts[0].x, pts[0].y, (s.tool === "eraser" ? s.size * 5 : s.size * (0.5 + pts[0].p)) / 2, 0, Math.PI * 2);
    g.fill();
  }

  for (let i = Math.max(1, from); i < pts.length; i++) {
    g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.5 + pts[i].p); // pen pressure changes line width
    g.beginPath();
    g.moveTo(pts[i - 1].x, pts[i - 1].y);
    g.lineTo(pts[i].x, pts[i].y);
    g.stroke();
  }
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

  // Strict Pointer & Palm Rejection tracking
  const activePointerId = useRef<number | null>(null);
  const penSeen = useRef(false);

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(colors[0][0]);
  const [size, setSize] = useState(3);
  const [letterhead, setLetterhead] = useState(true);
  const [ruled, setRuled] = useState(false);
  const [n, setN] = useState({ u: 0, r: 0 });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const key = `pad-draft-${id}`;
  const sync = useCallback(() => setN({ u: strokes.current.length, r: redo.current.length }), []);

  const getInkCtx = useCallback(() => {
    if (!inkCtx.current && ink.current) {
      inkCtx.current = ink.current.getContext("2d", { desynchronized: true });
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
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W * S, H * S);
    strokes.current.forEach((s) => paint(g, s));
  }, [getInkCtx]);

  useEffect(() => {
    drawBase();
  }, [drawBase]);

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

  // Coordinate mapping with optional cached bounding rect
  const at = useCallback((e: { clientX: number; clientY: number; pointerType?: string; pressure?: number }, r?: DOMRect): Pt => {
    const rect = r ?? ink.current!.getBoundingClientRect();
    const p = e.pointerType === "pen" ? (e.pressure && e.pressure > 0 ? e.pressure : 0.5) : 0.5;
    return {
      x: ((e.clientX - rect.left) * W) / rect.width,
      y: ((e.clientY - rect.top) * H) / rect.height,
      p,
    };
  }, []);

  // 1. Strict single-pointer tracking & Palm Rejection
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "hand") return;

    // If another pointer is already drawing, reject this pointer immediately
    if (activePointerId.current !== null) return;

    // Stylus-first palm rejection logic
    if (e.pointerType === "pen") {
      penSeen.current = true;
    } else if (e.pointerType === "touch") {
      // Once a pen has touched this pad, ignore touch inputs for drawing (palm rejection)
      if (penSeen.current) return;
      // Reject large contact areas (e.g. wrist/palm landing before the stylus tip)
      if ((e.width && e.width > 20) || (e.height && e.height > 20)) return;
    }

    activePointerId.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // In case pointer capture fails in rare browser environments
    }

    const pt = at(e);
    cur.current = { tool, color, size, pts: [pt] };
    const g = getInkCtx();
    if (g) paint(g, cur.current, 0);
  };

  // 2. High-frequency coalesced stylus sampling
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Strictly filter out any other pointer (e.g. secondary fingers or palm movement)
    if (activePointerId.current === null || e.pointerId !== activePointerId.current) {
      return;
    }

    const s = cur.current;
    if (!s) return;

    const r = ink.current?.getBoundingClientRect();
    if (!r) return;

    // Use coalesced events to capture all hardware stylus samples between frames
    const evs = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const from = s.pts.length;
    for (let i = 0; i < evs.length; i++) {
      s.pts.push(at(evs[i], r));
    }

    const g = getInkCtx();
    if (g) paint(g, s, from);
  };

  // 3. Clean pointer commit & capture release
  const up = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerId.current === null || e.pointerId !== activePointerId.current) {
      return;
    }

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    activePointerId.current = null;

    if (cur.current && cur.current.pts.length > 0) {
      strokes.current.push(cur.current);
      redo.current = [];
      cur.current = null;
      sync();
      try {
        localStorage.setItem(key, JSON.stringify(strokes.current));
      } catch {
        /* storage full */
      }
    } else {
      cur.current = null;
    }
  };

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
    penSeen.current = false;
    redraw();
    sync();
    try {
      localStorage.removeItem(key);
    } catch {}
  }, [key, redraw, sync]);

  // Window blur cleanup to avoid stuck pointer states
  useEffect(() => {
    const onBlur = () => {
      if (activePointerId.current !== null) {
        activePointerId.current = null;
        if (cur.current && cur.current.pts.length > 0) {
          strokes.current.push(cur.current);
          redo.current = [];
          sync();
        }
        cur.current = null;
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [sync]);

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
    `grid size-11 place-items-center rounded-xl border ${on ? "border-p-primary bg-p-primary text-white" : "border-p-border bg-white text-p-text"} disabled:opacity-40 transition-colors`;

  return (
    <div>
      <div className="glass sticky top-20 z-10 mb-4 flex flex-wrap items-center gap-2 p-3 lg:top-3" role="toolbar" aria-label="Writing tools">
        <button
          className={tb(tool === "pen")}
          aria-pressed={tool === "pen"}
          aria-label="Pen"
          onClick={() => {
            setTool("pen");
            // Clicking pen tool allows toggling pen-lock off if doctor wishes to draw with fingers
            if (tool === "pen") penSeen.current = false;
          }}
        >
          <Pen size={18} />
        </button>
        <button className={tb(tool === "eraser")} aria-pressed={tool === "eraser"} aria-label="Eraser" onClick={() => setTool("eraser")}><Eraser size={18} /></button>
        <button className={tb(tool === "hand")} aria-pressed={tool === "hand"} aria-label="Scroll and zoom (no drawing)" onClick={() => setTool("hand")}><Hand size={18} /></button>
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
            className={`grid size-11 place-items-center rounded-xl border ${color === c ? "border-p-primary" : "border-p-border"} bg-white`}
          >
            <span className="size-5 rounded-full" style={{ background: c }} />
          </button>
        ))}
        <label className="flex items-center gap-2 px-1 text-xs text-p-muted">
          Size
          <input type="range" min={1} max={8} value={size} onChange={(e) => setSize(+e.target.value)} className="w-20" />
        </label>
        <span className="mx-1 h-6 w-px bg-p-border" />
        <button className={tb(false)} aria-label="Undo" disabled={!n.u} onClick={undo}><Undo2 size={18} /></button>
        <button className={tb(false)} aria-label="Redo" disabled={!n.r} onClick={redoFn}><Redo2 size={18} /></button>
        <button className={tb(false)} aria-label="Clear page" disabled={!n.u} onClick={clear}><Trash2 size={18} /></button>
        <label className="flex min-h-11 items-center gap-2 px-2 text-xs">
          <input type="checkbox" checked={letterhead} onChange={(e) => setLetterhead(e.target.checked)} />
          Letterhead
        </label>
        <label className="flex min-h-11 items-center gap-2 px-2 text-xs">
          <input type="checkbox" checked={ruled} onChange={(e) => setRuled(e.target.checked)} />
          Lines
        </label>
        <div className="ml-auto flex gap-2">
          <button className="p-btn p-btn-ghost" onClick={download} disabled={busy}><FileDown size={16} aria-hidden />PDF</button>
          <button className="p-btn" onClick={save} disabled={busy}><Save size={16} aria-hidden />Save to visit</button>
        </div>
      </div>
      {msg && <p role="status" className="mb-3 text-sm text-p-muted">{msg}</p>}
      <div className="pad-scroll mx-auto max-w-[794px] overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(22,75,53,.15)]">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <canvas ref={base} width={W * S} height={H * S} className="absolute inset-0 size-full" />
          <canvas
            ref={ink}
            width={W * S}
            height={H * S}
            className="absolute inset-0 size-full"
            style={{
              touchAction: tool === "hand" ? "pan-x pan-y" : "none",
              cursor: tool === "hand" ? "grab" : "crosshair",
            }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onLostPointerCapture={(e) => {
              if (activePointerId.current === e.pointerId) {
                activePointerId.current = null;
                if (cur.current && cur.current.pts.length > 0) {
                  strokes.current.push(cur.current);
                  redo.current = [];
                  sync();
                }
                cur.current = null;
              }
            }}
            aria-label="A4 writing pad"
          />
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-[794px] text-xs text-p-muted">
        Works with Apple Pencil, other styluses, touch and mouse. When a pen is detected or active, palm contact is rejected automatically. Use the hand tool to scroll or zoom. Your work is kept on this device while you write.
      </p>
    </div>
  );
}
