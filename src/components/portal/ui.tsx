import { tone } from "@/lib/mock";

export function PageHeader({ title, sub, action }: { title: React.ReactNode; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl">{title}</h1>{sub && <p className="mt-1 text-sm text-p-muted">{sub}</p>}</div>
      {action}
    </div>
  );
}
export const Badge = ({ children }: { children: string }) => <span className={`badge ${tone(children)}`}>{children}</span>;

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="glass p-5"><p className="text-sm text-p-muted">{label}</p><p className="font-portal mt-1 text-3xl font-semibold text-p-primary">{value}</p>{note && <p className="mt-1 text-xs text-p-muted">{note}</p>}</div>;
}

export function Empty({ title, hint }: { title: string; hint: string }) {
  return <div className="solid grid place-items-center p-12 text-center"><p className="font-portal text-xl font-semibold">{title}</p><p className="mt-1 max-w-sm text-sm text-p-muted">{hint}</p></div>;
}

export function Table<T>({ cols, rows, min = "40rem", empty }: { cols: { h: string; c: (r: T) => React.ReactNode }[]; rows: T[]; min?: string; empty?: React.ReactNode }) {
  if (!rows.length) return <>{empty}</>;
  return (
    <div className="solid overflow-x-auto pad-scroll">
      <table className="w-full text-left text-sm" style={{ minWidth: min }}>
        <thead><tr className="border-b border-p-border text-xs text-p-muted">{cols.map((c) => <th key={c.h} className="px-4 py-3 font-semibold">{c.h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-p-border/70 last:border-0">{cols.map((c) => <td key={c.h} className="px-4 py-3.5 align-middle">{c.c(r)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
