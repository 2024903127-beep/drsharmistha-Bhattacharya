# Dr. Sharmistha Bhattacharyya: website and staff portal (complete)

Next.js 15, TypeScript, Tailwind 4, Supabase (database and staff login), Razorpay, WhatsApp Cloud API, Brevo, Google Calendar and Meet, Cloudflare R2.

## What it does
**Public website** (luxury, not glass): home, About, 24 procedure pages from the doctor-approved content, flagship "procedure in location" pages, 3 location pages, patient guides, contact, SEO (sitemap, robots, canonicals, schema).
**Booking**: patient picks a slot, pays the consultation fee on Razorpay, and automatically gets a Google Meet link, a receipt PDF, a WhatsApp message and an email. The slot is held for 10 minutes while paying and double booking is impossible.
**Staff portal** (glass design) at `/staff-login`, one sign-in, role-based: admin (Dr. Sharmistha, everything), doctor, receptionist, coordinator. Admin adds staff, changes roles, deactivates people (takes effect immediately).
**Consultation room**: A4 writing pad (Apple Pencil, pressure, palm rejection, PDF), photo upload of a handwritten prescription, typed prescription. "Send to patient" gives a secure link on WhatsApp and email.
**Other staff pages**: dashboard, appointments (reschedule and cancel notify the patient and update Google Calendar), patients with documents, enquiries, billing with refunds, message log, SEO title and description editor, integrations status, audit log.
**Automatic messages**: confirmation, receipt, reminders 24h and 1h before, rescheduled, cancelled, prescription, report, follow-up.
No patient login. Patients only ever receive links that expire after 30 days.

## Run locally (no accounts needed)
```bash
npm install
cp .env.example .env.local        # set AUTH_SECRET
npm run dev                       # http://localhost:3000
```
Without Supabase keys the portal shows sample data with demo sign-in (dr.sharmistha@demo.local, password Demo@12345) and booking runs in demo mode. Demo sign-in turns itself off the moment Supabase is configured.

## Go live: do these in order
1. **Supabase** (supabase.com, a new project). SQL Editor: paste and run `supabase/migrations/0001_init.sql`. Settings > API: copy the URL, anon key and service_role key into the env vars. Authentication > Providers > Email: turn OFF "Allow new users to sign up". Authentication > URL Configuration: add `https://YOURDOMAIN/staff-set-password` to Redirect URLs. Then create the owner: `node --env-file=.env.local scripts/create-owner.mjs dr@email.com "Dr. Sharmistha Bhattacharyya" "a-strong-password"`.
2. **Razorpay**: copy Key ID and Secret (start with Test mode). Webhooks > add `https://YOURDOMAIN/api/webhooks/razorpay`, a secret of your choice (`RAZORPAY_WEBHOOK_SECRET`), events `payment.captured`, `order.paid`, `payment.failed`, `refund.processed`.
3. **Cloudflare R2**: create a PRIVATE bucket and an API token with Object Read and Write. Fill the four `R2_` vars.
4. **Brevo**: verify a sender email (ideally on your domain), create an API key, set `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and `CLINIC_NOTIFY_EMAIL`.
5. **Google Meet**: Google Cloud, enable Google Calendar API, create an OAuth client (Web) with redirect `http://localhost:53682/cb`, set client id and secret, run `node --env-file=.env.local scripts/google-auth.mjs`, sign in with the clinic Google account, and paste `GOOGLE_REFRESH_TOKEN`. If the OAuth app stays in "Testing" the token expires in 7 days, so click Publish app (no review is needed for personal use of the calendar scope).
6. **WhatsApp**: Meta Business verification, add a number to the WhatsApp Cloud API, create a permanent system-user token, and submit the 8 templates exactly as in `docs/whatsapp-templates.md`. Until approved, WhatsApp sends fail and only email goes out (visible in the message log).
7. **Reminders**: set `CRON_SECRET`, then have any scheduler call `GET https://YOURDOMAIN/api/cron/reminders` every 15 minutes with header `Authorization: Bearer <CRON_SECRET>`. On Vercel Pro add a cron in `vercel.json`; on a free plan use cron-job.org.
8. **Deploy on Vercel**, add every variable from `.env.example` (set `NEXT_PUBLIC_SITE_URL`, `CONSULTATION_FEE_INR`, `AUTH_SECRET`). Open Staff portal > Integrations: every row should say Connected.
9. **Test before launch** with Razorpay test mode: book a slot, pay with a test card, and check the Meet link, receipt, WhatsApp, email, the booking in Appointments, a reschedule, a cancel, and a prescription sent from the consultation room. Then switch Razorpay to Live keys.

Also: copy brand images into `public/assets/` (see the README there), confirm `CONSULTATION_FEE_INR` (default 1500 is a placeholder), and see the SEO notes below.

## What was tested, and what was not
Tested: the SQL migration on Postgres 16; 25 end-to-end database checks through PostgREST (slot holds, double-booking blocked, payment confirmation racing with the webhook, late payment on a taken slot, reschedule, cancel, reminder queries, receipts, secure links, rate limiter); HTTP-level checks of every API route including webhook signatures, uploads, permissions, immediate role change and deactivation; a production build. Run `tests/e2e-db.mts` again after any change (see `tests/README.md`).
NOT tested, because they need your accounts: calls to Razorpay, Meta WhatsApp, Brevo, Google and Cloudflare R2, and Supabase Auth login and invite emails. Their request formats follow each provider's documented API, but expect to fix small things on first contact (most likely WhatsApp template language or parameter counts, and Google consent settings). Design was not reviewed in a browser. Check the pages on a phone and an iPad.

## Known limits
- Slots are hourly, Monday to Saturday 10:00 to 18:00, one patient per slot for the whole clinic. Per-doctor calendars are not built yet; the database already has `doctor_id` and `locations` for that.
- Uploads are limited to 4 MB per file (Vercel). Phone photos are compressed in the browser. Larger PDFs need a direct-to-R2 upload flow.
- Refunds are full refunds. Receipts carry no GST fields; confirm with the doctor's accountant.
- Staff sessions last 8 hours. Add two-factor sign-in in Supabase if the doctor wants it.
- Website body text is edited by a developer in `data/content.json` on purpose (doctor-approved, reviewed). Staff can edit SEO titles and descriptions.
- Patient data is health data. Keep Supabase and R2 on a paid plan with backups, restrict who has the service-role key, and ask a lawyer about India's DPDP Act consent and retention rules.

## SEO decisions built in
- One real page per procedure with unique title, description, canonical, breadcrumb and MedicalWebPage schema; FAQ schema on home and location pages.
- "Procedure in location" pages only for 8 flagship procedures x 3 real service locations (24 pages), each with unique local text. Do not widen this to every procedure and area: near-duplicate city pages are treated as doorway spam.
- No `aggregateRating` markup (Google ignores a business's own review stars). Earn stars through a complete Google Business Profile.
- Blog articles are `noindex` until full text exists (`FULL_TEXT_READY` in `src/app/(site)/blog/[slug]/page.tsx`). Four procedures have thin text and need expanding.
- Biggest ranking levers outside code: Google Business Profile for the hospital clinic (same name, address, phone as the site), genuine reviews, Search Console sitemap submission, and doctor-written articles.

## Structure
```
data/content.json         approved procedures, FAQ, article outlines
supabase/migrations/      database schema (row level security on, no public policies)
scripts/                  create-owner.mjs, google-auth.mjs
docs/whatsapp-templates.md  exact template text for Meta approval
src/app/(site)/           public website
src/app/staff*/           portal pages (glass design lives only here)
src/app/api/              booking, webhook, cron, lead, staff endpoints
src/app/d/[token]/        secure patient document links
src/lib/                  booking logic, repo (data access), integrations, auth, permissions
tests/                    optional database end-to-end test
```
Permissions are enforced on the server in every page and API (`requireModule`, `apiSession`) and re-checked against the database on each request. The browser never receives the service-role key.
