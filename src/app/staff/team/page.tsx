import { requireModule } from "@/lib/session";
import { listStaff } from "@/lib/repo";
import { access, modules } from "@/lib/permissions";
import { PageHeader, Table, Badge } from "@/components/portal/ui";
import { TeamForm } from "@/components/portal/TeamForm";
import { StaffActions } from "@/components/portal/Actions";

export default async function Team() {
  const me = await requireModule("team");
  const staff = await listStaff(), roles = Object.keys(access) as (keyof typeof access)[];
  return (
    <>
      <PageHeader title="Team and roles" sub="Dr. Sharmistha has full access. Add a receptionist, doctor or coordinator when you are ready. Deactivating someone blocks them immediately." />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Table rows={staff} min="36rem" cols={[
          {
            h: "Staff member",
            c: (r) => (
              <div>
                <span className="font-semibold">{r.name}</span>
                <div className="text-xs text-p-muted">{r.email}</div>
                {r.phone && <div className="text-xs text-emerald-800 font-mono mt-0.5">{r.phone}</div>}
              </div>
            ),
          },
          { h: "Status", c: (r) => <Badge>{r.active ? "Active" : "Deactivated"}</Badge> },
          {
            h: "Access & Management",
            c: (r) =>
              me.role === "admin" ? (
                <StaffActions
                  id={r.id}
                  name={r.name}
                  email={r.email}
                  active={r.active}
                  role={r.role}
                  self={r.id === me.uid}
                />
              ) : (
                <span className="capitalize font-medium">{r.role}</span>
              ),
          },
        ]} />
        <TeamForm />
      </div>
      <h2 className="mb-3 mt-10 text-xl">What each role can open</h2>
      <Table min="44rem" rows={modules} cols={[{ h: "Area", c: (r) => r.label }, ...roles.map((role) => ({ h: role, c: (r: (typeof modules)[number]) => (access[role].includes(r.mod) ? "Yes" : "-") }))]} />
    </>
  );
}
