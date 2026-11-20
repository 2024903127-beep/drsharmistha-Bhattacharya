// Creates the first admin (the doctor): a Supabase Auth user plus a row in `staff`.
// Usage: node --env-file=.env.local scripts/create-owner.mjs dr@example.com "Dr. Sharmistha Bhattacharyya" "StrongPassword123"
import { createClient } from "@supabase/supabase-js";

const [email, name, password] = process.argv.slice(2);
if (!email || !name || !password || password.length < 10) {
  console.error('Usage: node --env-file=.env.local scripts/create-owner.mjs <email> "<full name>" "<password, 10+ chars>"');
  process.exit(1);
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
if (error) { console.error("Could not create user:", error.message); process.exit(1); }
const { error: e2 } = await sb.from("staff").insert({ id: data.user.id, full_name: name, email, role: "admin" });
if (e2) { console.error("Could not create staff row:", e2.message); process.exit(1); }
console.log(`Owner created: ${email}. Sign in at /staff-login`);
