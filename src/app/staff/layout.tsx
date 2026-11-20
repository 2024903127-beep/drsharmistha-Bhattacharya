import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { modules, can } from "@/lib/permissions";
import { dbConfigured } from "@/lib/db";
import { Shell } from "@/components/portal/Shell";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/staff-login");
  const nav = modules.filter((m) => can(s.role, m.mod));
  return <Shell nav={nav} user={{ name: s.name, role: s.role }}>{!dbConfigured() && <p className="glass mb-5 p-3 text-sm text-p-muted">Database not connected: you are seeing sample data and changes are not saved. See README, step 1.</p>}
    {children}</Shell>;
}
