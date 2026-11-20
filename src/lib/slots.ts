// Pass 1: static hourly slots, Monday to Saturday, start times 10:00 to 18:00 (clinic closes 19:00).
// Pass 2: subtract booked slots (Supabase) and busy times (Google Calendar free/busy).
export function slotsFor(dateStr: string): string[] {
  const dow = new Date(`${dateStr}T12:00:00+05:30`).getUTCDay();
  if (Number.isNaN(dow) || dow === 0) return [];
  return Array.from({ length: 9 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);
}
