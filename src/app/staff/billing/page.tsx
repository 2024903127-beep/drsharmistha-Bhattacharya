import { requireModule } from "@/lib/session";
import { listPayments } from "@/lib/repo";
import { PageHeader, Badge, Table, Stat } from "@/components/portal/ui";
import { RefundButton } from "@/components/portal/Actions";

export default async function Billing() {
  await requireModule("billing");
  const rows = await listPayments();
  const total = rows.filter((p) => p.status === "Paid").reduce((n, p) => n + p.amount, 0);
  return (
    <>
      <PageHeader title="Billing" sub="Online consultation fees collected through Razorpay. Surgery fees are quoted in writing and are not collected online." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2"><Stat label="Collected" value={`Rs. ${total.toLocaleString("en-IN")}`} /><Stat label="Refunded" value={String(rows.filter((p) => p.status === "Refunded").length)} /></div>
      <Table rows={rows} cols={[
        { h: "Reference", c: (r) => r.ref }, { h: "Patient", c: (r) => <span className="font-semibold">{r.patient}</span> }, { h: "Amount", c: (r) => `Rs. ${r.amount.toLocaleString("en-IN")}` },
        { h: "Method", c: (r) => r.method }, { h: "Status", c: (r) => <Badge>{r.status}</Badge> }, { h: "When", c: (r) => r.when },
        { h: "", c: (r) => (r.canRefund ? <RefundButton id={r.id} /> : null) },
      ]} />
    </>
  );
}
