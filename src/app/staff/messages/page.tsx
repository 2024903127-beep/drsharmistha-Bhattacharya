import { requireModule } from "@/lib/session";
import { listMessages } from "@/lib/repo";
import { listMetaTemplates, whatsappConfigSummary } from "@/lib/integrations/whatsapp";
import { PageHeader, Badge, Table } from "@/components/portal/ui";
import { WhatsAppDiagnostics } from "@/components/portal/WhatsAppDiagnostics";

export const dynamic = "force-dynamic";

export default async function Messages() {
  await requireModule("messages");
  const [log, config, meta] = await Promise.all([
    listMessages(),
    Promise.resolve(whatsappConfigSummary()),
    listMetaTemplates(),
  ]);

  return (
    <>
      <PageHeader
        title="WhatsApp and email"
        sub="Automatic patient notifications, Meta template status, Vercel env overrides, and live template diagnostics."
      />

      <WhatsAppDiagnostics initialConfig={config} initialMeta={meta} />

      <h2 className="mb-3 mt-10 text-xl">Recent messages</h2>
      <Table
        rows={log}
        empty={<div className="solid p-8 text-center text-sm text-p-muted">Nothing sent yet. Delivery results and Meta template errors appear here.</div>}
        cols={[
          { h: "When", c: (r) => r.when },
          { h: "Channel", c: (r) => r.channel },
          { h: "Template", c: (r) => <code>{r.template}</code> },
          { h: "To", c: (r) => r.to },
          {
            h: "Result",
            c: (r) => (
              <div>
                <Badge>{r.status}</Badge>
                {r.error && <p className="mt-1 max-w-md text-xs text-p-muted">{r.error}</p>}
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
