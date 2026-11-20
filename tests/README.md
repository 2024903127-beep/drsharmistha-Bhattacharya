# Optional: database end-to-end test

`e2e-db.mts` runs the real booking code (holds, double-booking, payment confirmation racing with the webhook, late payment conflict,
reschedule, cancel, reminders, secure links, rate limiter) against a throwaway Postgres. It does not touch Supabase or any paid service.
Run it after changing `src/lib/booking.ts`, `supabase/migrations` or `src/lib/repo.ts`.

1. Postgres 15+ and the PostgREST binary (https://github.com/PostgREST/postgrest/releases) on your machine.
2. Create a database, run these in order: a stub for Supabase's `auth.users` (`create schema auth; create table auth.users (id uuid primary key default gen_random_uuid());`
   plus roles `anon`, `authenticated`), then `supabase/migrations/0001_init.sql`.
3. Create roles: `authenticator` (login, noinherit), `service_role` (bypassrls), grant `service_role` ALL on tables, sequences and functions in `public`.
4. Edit `tests/postgrest.conf` (database URL, jwt-secret), start `postgrest tests/postgrest.conf` and `node tests/supabase-proxy.mjs` (it maps `/rest/v1/*` like Supabase does).
5. Create a JWT with claim `{"role":"service_role"}` signed with the same secret, then:
```bash
NODE_ENV=development NODE_OPTIONS=--conditions=react-server \
NEXT_PUBLIC_SUPABASE_URL=http://localhost:3002 SUPABASE_SERVICE_ROLE_KEY=<that JWT> AUTH_SECRET=test \
npx tsx tests/e2e-db.mts
```
Expected last line: `ALL DB END-TO-END CHECKS PASSED`.
