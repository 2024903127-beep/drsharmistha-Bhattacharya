import { requireModule } from "@/lib/session";
import { templates } from "@/lib/mock";
import { listMessages } from "@/lib/repo";
import { PageHeader, Badge, Table } from "@/components/portal/ui";

export default async function Messages() {
  await requireModule("messages");
  const log = await listMessages();
  return (
    <>
      <PageHeader title="WhatsApp and email" sub="Automatic messages to patients: confirmation, receipt, reminders, prescription, report and follow-up." />
      <p className="solid mb-6 p-4 text-sm text-p-muted">WhatsApp business-initiated messages need templates approved by Meta. Exact template text is in <code>docs/whatsapp-templates.md</code>. Documents are sent as secure links that expire after 30 days.</p>
      <Table rows={templates} cols={[{ h: "Template", c: (r) => <span className="font-semibold">{r.name}</span> }, { h: "Sent when", c: (r) => r.trigger }, { h: "Channel", c: (r) => r.channel }]} />
      <h2 className="mb-3 mt-10 text-xl">Recent messages</h2>
      <Table rows={log} empty={<div className="solid p-8 text-center text-sm text-p-muted">Nothing sent yet. Delivery results appear here.</div>} cols={[
        { h: "When", c: (r) => r.when }, { h: "Channel", c: (r) => r.channel }, { h: "Template", c: (r) => r.template }, { h: "To", c: (r) => r.to },
        { h: "Result", c: (r) => <><Badge>{r.status}</Badge>{r.error && <span className="ml-2 text-xs text-p-muted">{r.error}</span>}</> },
      ]} />
    </>
  );
}
