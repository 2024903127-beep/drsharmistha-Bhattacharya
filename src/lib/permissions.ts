import type { Role } from "./auth";

export type Module = "dashboard" | "appointments" | "patients" | "consultation" | "leads" | "billing" | "messages" | "content" | "team" | "settings" | "audit";

export const modules: { mod: Module; label: string; href: string }[] = [
  { mod: "dashboard", label: "Dashboard", href: "/staff/dashboard" },
  { mod: "appointments", label: "Appointments", href: "/staff/appointments" },
  { mod: "consultation", label: "Consultation room", href: "/staff/consultation" },
  { mod: "patients", label: "Patients", href: "/staff/patients" },
  { mod: "leads", label: "Enquiries", href: "/staff/leads" },
  { mod: "billing", label: "Billing", href: "/staff/billing" },
  { mod: "messages", label: "WhatsApp and email", href: "/staff/messages" },
  { mod: "team", label: "Team and roles", href: "/staff/team" },
  { mod: "settings", label: "Integrations", href: "/staff/settings" },
  { mod: "audit", label: "Audit log", href: "/staff/audit" },
];

const all = modules.map((m) => m.mod);
// Dr. Sharmistha signs in as "admin": every module, including the doctor tools.
export const access: Record<Role, Module[]> = {
  admin: all,
  doctor: ["dashboard", "appointments", "consultation", "patients", "messages"],
  receptionist: ["dashboard", "appointments", "patients", "leads", "billing", "messages"],
  coordinator: ["dashboard", "appointments", "patients", "leads", "messages"],
};
export const can = (role: Role, mod: Module) => access[role].includes(mod);
