// Normalise Indian and international numbers to E.164 (+91XXXXXXXXXX).
export function normalizePhone(raw: string) {
  const s = raw.replace(/[\s()-]/g, "");
  if (s.startsWith("+")) return s;
  const d = s.replace(/\D/g, "");
  if (d.length === 10) return `+91${d}`;
  if (d.length === 11 && d.startsWith("0")) return `+91${d.slice(1)}`;
  if (d.length === 12 && d.startsWith("91")) return `+${d}`;
  return `+${d}`;
}
export const waDigits = (e164: string) => e164.replace(/\D/g, "");
