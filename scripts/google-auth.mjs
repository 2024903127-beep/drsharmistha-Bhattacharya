// One-time helper to get a Google refresh token for the clinic calendar (needed for Meet links).
// 1) In Google Cloud: enable "Google Calendar API", create an OAuth client (type: Web) with redirect http://localhost:53682/cb
// 2) node --env-file=.env.local scripts/google-auth.mjs   (sign in with the Google account that owns the clinic calendar)
import http from "node:http";

const id = process.env.GOOGLE_CLIENT_ID, secret = process.env.GOOGLE_CLIENT_SECRET, redirect = "http://localhost:53682/cb";
if (!id || !secret) { console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first."); process.exit(1); }
const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
  client_id: id, redirect_uri: redirect, response_type: "code", access_type: "offline", prompt: "consent",
  login_hint: "dr.sharmistha.bhattacharyya@gmail.com",
  scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy",
});
console.log("Open this URL in your browser:\n\n" + url + "\n");
http.createServer(async (req, res) => {
  const code = new URL(req.url, redirect).searchParams.get("code");
  if (!code) return res.end("Waiting...");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: "authorization_code" }),
  });
  const j = await r.json();
  if (j.refresh_token) {
    import("node:fs").then(({ readFileSync, writeFileSync }) => {
      try {
        const envPath = ".env.local";
        let env = readFileSync(envPath, "utf-8");
        env = env.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, `GOOGLE_REFRESH_TOKEN=${j.refresh_token}`);
        writeFileSync(envPath, env, "utf-8");
        console.log("Successfully saved GOOGLE_REFRESH_TOKEN to .env.local!");
      } catch (e) {
        console.error("Could not write to .env.local:", e.message);
      }
    });
  }
  res.end(j.refresh_token ? "Done. Return to the terminal. You can close this window." : "No refresh token returned. Remove the app's access in your Google account and retry.");
  console.log(j.refresh_token ? `\nGOOGLE_REFRESH_TOKEN=${j.refresh_token}\n` : j);
  setTimeout(() => process.exit(0), 1000);
}).listen(53682);
