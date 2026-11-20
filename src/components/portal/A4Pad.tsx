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
  g.save(); g.setTransform(S, 0, 0, S, 0, 0); g.lineCap = "round"; g.lineJoin = "round";
  if (s.tool === "eraser") g.globalCompositeOperation = "destination-out";
  g.strokeStyle = g.fillStyle = s.color;
  const pts = s.pts;
  if (pts.length === 1) { g.beginPath(); g.arc(pts[0].x, pts[0].y, (s.tool === "eraser" ? s.size * 5 : s.size * (0.5 + pts[0].p)) / 2, 0, Math.PI * 2); g.fill(); }
  for (let i = Math.max(1, from); i < pts.length; i++) {
    g.lineWidth = s.tool === "eraser" ? s.size * 5 : s.size * (0.5 + pts[i].p); // pen pressure changes line width
    g.beginPath(); g.moveTo(pts[i - 1].x, pts[i - 1].y); g.lineTo(pts[i].x, pts[i].y); g.stroke();
  }
  g.restore();
}

export function A4Pad({ id, patient, onSave }: { id: string; patient: string; onSave: (f: File, kind: string) => Promise<void> }) {
  const base = useRef<HTMLCanvasElement>(null), ink = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]), redo = useRef<Stroke[]>([]), cur = useRef<Stroke | null>(null), penSeen = useRef(false);
  const [tool, setTool] = useState<Tool>("pen"), [color, setColor] = useState(colors[0][0]), [size, setSize] = useState(3);
  const [letterhead, setLetterhead] = useState(true), [ruled, setRuled] = useState(false);
  const [n, setN] = useState({ u: 0, r: 0 }), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  const key = `pad-draft-${id}`;
  const sync = () => setN({ u: strokes.current.length, r: redo.current.length });

  const drawBase = useCallback(() => {
    const g = base.current!.getContext("2d")!;
    g.setTransform(S, 0, 0, S, 0, 0); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
    let top = 40;
    if (letterhead) {
      g.fillStyle = "#164B35"; g.font = "600 26px Georgia, serif"; g.fillText("Dr. Sharmistha Bhattacharyya", 48, 66);
      g.fillStyle = "#5F6B62"; g.font = "13px Arial, sans-serif";
      g.fillText("MCh Plastic Surgery (AIIMS)  |  Plastic and Aesthetic Surgery", 48, 88);
      g.fillText("Accord Super Speciality Hospital, Sector 86, Faridabad 121002  |  +91 96672 07009", 48, 107);
      g.strokeStyle = "#B99A65"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(48, 122); g.lineTo(W - 48, 122); g.stroke();
      g.fillStyle = "#17231B"; g.font = "14px Arial, sans-serif"; g.fillText(`Patient: ${patient}`, 48, 148);
      g.textAlign = "right"; g.fillText(`Date: ${new Date().toLocaleDateString("en-IN")}`, W - 48, 148); g.textAlign = "left";
      g.font = "italic 600 34px Georgia, serif"; g.fillStyle = "#164B35"; g.fillText("Rx", 48, 200); top = 215;
    }
    if (ruled) { g.strokeStyle = "#E5ECE5"; g.lineWidth = 1; for (let y = top + 30; y < H - 60; y += 34) { g.beginPath(); g.moveTo(48, y); g.lineTo(W - 48, y); g.stroke(); } }
  }, [letterhead, ruled, patient]);

  const redraw = useCallback(() => {
    const g = ink.current!.getContext("2d")!; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W * S, H * S);
    strokes.current.forEach((s) => paint(g, s));
  }, []);

  useEffect(() => { drawBase(); }, [drawBase]);
  useEffect(() => {
    try { const d = localStorage.getItem(key); if (d) { strokes.current = JSON.parse(d); redraw(); sync(); } } catch { /* ignore corrupt draft */ }
  }, [key, redraw]);

  const at = (e: { clientX: number; clientY: number; pointerType: string; pressure: number }): Pt => {
    const r = ink.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height, p: e.pointerType === "pen" ? e.pressure || 0.5 : 0.5 };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "hand") return;
    if (e.pointerType === "pen") penSeen.current = true; else if (e.pointerType === "touch" && penSeen.current) return; // palm rejection
    e.currentTarget.setPointerCapture(e.pointerId);
    cur.current = { tool, color, size, pts: [at(e)] };
    paint(ink.current!.getContext("2d")!, cur.current);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = cur.current; if (!s) return;
    const evs = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent], from = s.pts.length;
    evs.forEach((x) => s.pts.push(at(x)));
    paint(ink.current!.getContext("2d")!, s, from);
  };
  const up = () => {
    if (!cur.current) return;
    strokes.current.push(cur.current); redo.current = []; cur.current = null; sync();
    try { localStorage.setItem(key, JSON.stringify(strokes.current)); } catch { /* storage full */ }
  };
  const undo = () => { const s = strokes.current.pop(); if (s) { redo.current.push(s); redraw(); sync(); localStorage.setItem(key, JSON.stringify(strokes.current)); } };
  const redoFn = () => { const s = redo.current.pop(); if (s) { strokes.current.push(s); redraw(); sync(); localStorage.setItem(key, JSON.stringify(strokes.current)); } };
  const clear = () => { if (!strokes.current.length || !confirm("Clear everything you wrote on this page?")) return; strokes.current = []; redo.current = []; redraw(); sync(); localStorage.removeItem(key); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redoFn() : undo(); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  });

  async function makePdf() {
    const c = document.createElement("canvas"); c.width = W * S; c.height = H * S;
    const g = c.getContext("2d")!; g.drawImage(base.current!, 0, 0); g.drawImage(ink.current!, 0, 0);
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.addImage(c.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    return pdf;
  }
  const fname = `prescription-${patient.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  async function download() { setBusy(true); (await makePdf()).save(fname); setBusy(false); }
  async function save() {
    setBusy(true); setMsg("");
    try { const blob = (await makePdf()).output("blob"); await onSave(new File([blob], fname, { type: "application/pdf" }), "A4 pad PDF"); setMsg("Saved to this visit."); }
    catch (e) { setMsg((e as Error).message); }
    setBusy(false);
  }

  const tb = (on: boolean) => `grid size-11 place-items-center rounded-xl border ${on ? "border-p-primary bg-p-primary text-white" : "border-p-border bg-white text-p-text"} disabled:opacity-40`;
  return (
    <div>
      <div className="glass sticky top-20 z-10 mb-4 flex flex-wrap items-center gap-2 p-3 lg:top-3" role="toolbar" aria-label="Writing tools">
        <button className={tb(tool === "pen")} aria-pressed={tool === "pen"} aria-label="Pen" onClick={() => setTool("pen")}><Pen size={18} /></button>
        <button className={tb(tool === "eraser")} aria-pressed={tool === "eraser"} aria-label="Eraser" onClick={() => setTool("eraser")}><Eraser size={18} /></button>
        <button className={tb(tool === "hand")} aria-pressed={tool === "hand"} aria-label="Scroll and zoom (no drawing)" onClick={() => setTool("hand")}><Hand size={18} /></button>
        <span className="mx-1 h-6 w-px bg-p-border" />
        {colors.map(([c, name]) => <button key={c} aria-label={name} aria-pressed={color === c} onClick={() => { setColor(c); setTool("pen"); }} className={`grid size-11 place-items-center rounded-xl border ${color === c ? "border-p-primary" : "border-p-border"} bg-white`}><span className="size-5 rounded-full" style={{ background: c }} /></button>)}
        <label className="flex items-center gap-2 px-1 text-xs text-p-muted">Size<input type="range" min={1} max={8} value={size} onChange={(e) => setSize(+e.target.value)} className="w-20" /></label>
        <span className="mx-1 h-6 w-px bg-p-border" />
        <button className={tb(false)} aria-label="Undo" disabled={!n.u} onClick={undo}><Undo2 size={18} /></button>
        <button className={tb(false)} aria-label="Redo" disabled={!n.r} onClick={redoFn}><Redo2 size={18} /></button>
        <button className={tb(false)} aria-label="Clear page" disabled={!n.u} onClick={clear}><Trash2 size={18} /></button>
        <label className="flex min-h-11 items-center gap-2 px-2 text-xs"><input type="checkbox" checked={letterhead} onChange={(e) => setLetterhead(e.target.checked)} />Letterhead</label>
        <label className="flex min-h-11 items-center gap-2 px-2 text-xs"><input type="checkbox" checked={ruled} onChange={(e) => setRuled(e.target.checked)} />Lines</label>
        <div className="ml-auto flex gap-2">
          <button className="p-btn p-btn-ghost" onClick={download} disabled={busy}><FileDown size={16} aria-hidden />PDF</button>
          <button className="p-btn" onClick={save} disabled={busy}><Save size={16} aria-hidden />Save to visit</button>
        </div>
      </div>
      {msg && <p role="status" className="mb-3 text-sm text-p-muted">{msg}</p>}
      <div className="pad-scroll mx-auto max-w-[794px] overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(22,75,53,.15)]">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <canvas ref={base} width={W * S} height={H * S} className="absolute inset-0 size-full" />
          <canvas ref={ink} width={W * S} height={H * S} className="absolute inset-0 size-full"
            style={{ touchAction: tool === "hand" ? "auto" : "none", cursor: tool === "hand" ? "grab" : "crosshair" }}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="A4 writing pad" />
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-[794px] text-xs text-p-muted">Works with Apple Pencil, other styluses, touch and mouse. Once a pen is detected, finger touches are ignored so your palm does not leave marks. Use the hand tool to scroll or zoom. Your work is kept on this device while you write.</p>
    </div>
  );
}
