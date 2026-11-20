import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Testing Supabase auth with Dr. Sharmistha's credentials...");
const sbAnon = createClient(url, anon, { auth: { persistSession: false } });
const { data, error } = await sbAnon.auth.signInWithPassword({
  email: "dr.sharmistha.bhattacharyya@gmail.com",
  password: "ADMIN@1234",
});

if (error) {
  console.error("Sign in failed:", error.message);
  process.exit(1);
}

console.log("Auth sign in successful! User ID:", data.user.id);

// Check staff table using service role client
const sbService = createClient(url, service, { auth: { persistSession: false } });
const { data: staff, error: staffError } = await sbService
  .from("staff")
  .select("id, full_name, email, role, active")
  .eq("id", data.user.id)
  .single();

if (staffError) {
  console.error("Staff lookup failed:", staffError.message);
  process.exit(1);
}

console.log("Staff record verified:", staff);
console.log("All Supabase checks PASSED!");
