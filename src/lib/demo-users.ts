import type { Role } from "./auth";

// DEMO ONLY (Pass 1). Replaced by Supabase Auth + a `staff` table in Pass 2.
export const demoPassword = () => process.env.STAFF_DEMO_PASSWORD ?? "Demo@12345";
export const demoUsers: { uid: string; email: string; name: string; role: Role }[] = [
  { uid: "u-owner", email: "dr.sharmistha@demo.local", name: "Dr. Sharmistha Bhattacharyya", role: "admin" },
  { uid: "u-doctor", email: "doctor@demo.local", name: "Visiting Doctor", role: "doctor" },
  { uid: "u-reception", email: "reception@demo.local", name: "Front Desk", role: "receptionist" },
  { uid: "u-coord", email: "coordinator@demo.local", name: "Patient Coordinator", role: "coordinator" },
];
