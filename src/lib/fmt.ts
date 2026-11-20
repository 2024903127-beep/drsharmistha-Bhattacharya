const tz = "Asia/Kolkata";
export const istDate = (d = new Date()) => d.toLocaleDateString("en-CA", { timeZone: tz }); // YYYY-MM-DD
export const istTime = (iso: string | Date) => new Date(iso).toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }); // 14:00
export const fmtTime = (iso: string | Date) => new Date(iso).toLocaleTimeString("en-IN", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true });
export const fmtDateLong = (iso: string | Date) => new Date(iso).toLocaleDateString("en-IN", { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric" });

export function fmtWhen(iso: string) {
  const d = new Date(iso), day = istDate(d), now = Date.now();
  const rel = day === istDate() ? "Today" : day === istDate(new Date(now + 864e5)) ? "Tomorrow" : day === istDate(new Date(now - 864e5)) ? "Yesterday"
    : d.toLocaleDateString("en-IN", { timeZone: tz, day: "numeric", month: "short" });
  return `${rel}, ${fmtTime(d)}`;
}
export function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} hours ago` : fmtWhen(iso);
}
