import Link from "next/link";
import { requireModule } from "@/lib/session";
import { can } from "@/lib/permissions";
import { listAppointments, listLeads, listPayments } from "@/lib/repo";
import { PageHeader, Stat, Badge, Table } from "@/components/portal/ui";

export default async function Dashboard() {
  const s = await requireModule("dashboard");
  const [appts, leads, pays] = await Promise.all([listAppointments(), listLeads(), listPayments()]);
  const today = appts.filter((a) => a.isToday && a.status !== "Cancelled").sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const paid = pays.filter((p) => p.status === "Paid").reduce((n, p) => n + p.amount, 0);
  const conflicts = appts.filter((a) => a.status === "Payment conflict").length;
  return (
    <>
      <PageHeader title={`Welcome, ${s.name.split(" ").slice(0, 2).join(" ")}`} sub="Your day at a glance." />
      {conflicts > 0 && <p role="alert" className="badge b-red mb-4 !block !rounded-2xl !p-4 text-sm">{conflicts} paid booking(s) lost their slot and need rescheduling or a refund. See Appointments.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Today's consultations" value={String(today.length)} note="Online and in person" />
        <Stat label="New enquiries" value={String(leads.filter((l) => l.status === "New").length)} note="Waiting for first contact" />
        <Stat label="Consultation fees collected" value={`Rs. ${paid.toLocaleString("en-IN")}`} note="All time in this list" />
        <Stat label="Awaiting payment" value={String(appts.filter((a) => a.status === "Pending payment").length)} note="Slots on hold" />
      </div>
      <h2 className="mb-3 mt-10 text-xl">Today's schedule</h2>
      <Table rows={today} empty={<div className="solid p-8 text-center text-sm text-p-muted">No consultations today.</div>} cols={[
        { h: "Time", c: (r) => r.when.replace("Today, ", "") }, { h: "Patient", c: (r) => <span className="font-semibold">{r.patient}</span> },
        { h: "Procedure", c: (r) => r.service }, { h: "Mode", c: (r) => r.mode }, { h: "Status", c: (r) => <Badge>{r.status}</Badge> },
        { h: "", c: (r) => (can(s.role, "consultation") ? <Link className="p-btn p-btn-ghost" href={`/staff/consultation/${r.id}`}>Open</Link> : null) },
      ]} />
    </>
  );
}
