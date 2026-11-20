// Google Calendar + Meet using the clinic account's OAuth refresh token (get it once with scripts/google-auth.mjs).
export const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
const cal = () => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID ?? "primary")}`;
let cached: { token: string; exp: number } | null = null;

async function token() {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, refresh_token: process.env.GOOGLE_REFRESH_TOKEN!, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Google auth failed: ${j.error_description ?? r.status}`);
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}
const call = async (url: string, init: RequestInit = {}) => {
  const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json", ...init.headers } });
  if (r.status === 204) return null;
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Google Calendar error ${r.status}: ${j?.error?.message ?? ""}`);
  return j;
};
const when = (d: Date) => ({ dateTime: d.toISOString(), timeZone: "Asia/Kolkata" });

export async function createMeetEvent(o: { summary: string; description: string; start: Date; end: Date; attendeeEmail?: string; requestId: string }) {
  const j = await call(`${cal()}/events?conferenceDataVersion=1&sendUpdates=${o.attendeeEmail ? "all" : "none"}`, {
    method: "POST",
    body: JSON.stringify({
      summary: o.summary, description: o.description, start: when(o.start), end: when(o.end),
      attendees: o.attendeeEmail ? [{ email: o.attendeeEmail }] : undefined,
      conferenceData: { createRequest: { requestId: o.requestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    }),
  });
  return { eventId: j.id as string, meetLink: (j.hangoutLink ?? "") as string };
}
export const moveEvent = (id: string, start: Date, end: Date) => call(`${cal()}/events/${id}?sendUpdates=all`, { method: "PATCH", body: JSON.stringify({ start: when(start), end: when(end) }) });
export const deleteEvent = (id: string) => call(`${cal()}/events/${id}?sendUpdates=all`, { method: "DELETE" });
export async function freeBusy(start: Date, end: Date) {
  const j = await call("https://www.googleapis.com/calendar/v3/freeBusy", { method: "POST", body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), items: [{ id: process.env.GOOGLE_CALENDAR_ID ?? "primary" }] }) });
  return (Object.values(j.calendars ?? {})[0] as { busy?: { start: string; end: string }[] })?.busy ?? [];
}
