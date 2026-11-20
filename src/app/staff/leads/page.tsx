import { requireModule } from "@/lib/session";
import { listLeads } from "@/lib/repo";
import { PageHeader, Table, Empty } from "@/components/portal/ui";
import { LeadStatus } from "@/components/portal/Actions";

export default async function Leads() {
  await requireModule("leads");
  return (
    <>
      <PageHeader title="Enquiries" sub="Website forms with the marketing source recorded. Update the status as you follow up." />
      <Table rows={await listLeads()} empty={<Empty title="No enquiries yet" hint="Enquiries from the contact form appear here." />} cols={[
        { h: "Name", c: (r) => <><span className="font-semibold">{r.name}</span><br /><a className="text-xs text-p-muted underline" href={`tel:${r.phone}`}>{r.phone}</a></> },
        { h: "Interested in", c: (r) => r.interest }, { h: "Source", c: (r) => r.source }, { h: "Received", c: (r) => r.when },
        { h: "Status", c: (r) => <LeadStatus id={r.id} status={r.status} /> },
      ]} />
    </>
  );
}
