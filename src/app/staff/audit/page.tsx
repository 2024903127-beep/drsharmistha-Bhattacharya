import { requireModule } from "@/lib/session";
import { listAudit } from "@/lib/repo";
import { PageHeader, Table, Empty } from "@/components/portal/ui";

export default async function Audit() {
  await requireModule("audit");
  return (
    <>
      <PageHeader title="Audit log" sub="Who opened, sent, changed or refunded something. Recorded automatically." />
      <Table rows={await listAudit()} empty={<Empty title="Nothing recorded yet" hint="Sign-ins and changes to patient records appear here." />} cols={[{ h: "When", c: (r) => r.when }, { h: "Who", c: (r) => r.who }, { h: "Action", c: (r) => <span className="capitalize">{r.action}</span> }, { h: "Record", c: (r) => r.record }]} />
    </>
  );
}
