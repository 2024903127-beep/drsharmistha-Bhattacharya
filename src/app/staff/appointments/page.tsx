import Link from "next/link";
import { requireModule } from "@/lib/session";
import { can } from "@/lib/permissions";
import { listAppointments } from "@/lib/repo";
import { PageHeader, Badge, Table } from "@/components/portal/ui";
import { ApptActions } from "@/components/portal/Actions";

export default async function Appointments() {
  const s = await requireModule("appointments");
  const rows = await listAppointments();
  return (
    <>
      <PageHeader title="Appointments" sub="Online bookings appear here after payment. Rescheduling and cancelling notify the patient and update Google Calendar." />
      <Table min="60rem" rows={rows} cols={[
        { h: "When", c: (r) => r.when },
        { h: "Patient", c: (r) => <><Link className="font-semibold underline-offset-2 hover:underline" href={`/staff/patients/${r.patientId}`}>{r.patient}</Link><br /><span className="text-xs text-p-muted">{r.phone}</span></> },
        { h: "Procedure", c: (r) => r.service }, { h: "Mode", c: (r) => r.mode },
        { h: "Status", c: (r) => <Badge>{r.status}</Badge> },
        { h: "Meet", c: (r) => (r.meetLink ? <a className="underline" href={r.meetLink} target="_blank" rel="noopener noreferrer">Join</a> : "-") },
        { h: "", c: (r) => <div className="space-y-2">{can(s.role, "consultation") && r.status === "Confirmed" && <Link className="p-btn" href={`/staff/consultation/${r.id}`}>Start</Link>}<ApptActions id={r.id} status={r.status} /></div> },
      ]} />
    </>
  );
}
