import { requireModule } from "@/lib/session";
import { PageHeader, Table, Badge } from "@/components/portal/ui";

const items: [string, string[]][] = [
  ["Supabase (database and staff login)", ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]],
  ["Razorpay payments", ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"]], ["Razorpay webhook", ["RAZORPAY_WEBHOOK_SECRET"]],
  ["WhatsApp Cloud API", ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"]], ["Brevo email", ["BREVO_API_KEY", "BREVO_SENDER_EMAIL"]],
  ["Google Calendar and Meet", ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]],
  ["Cloudflare R2 (documents)", ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]],
  ["Reminder scheduler", ["CRON_SECRET"]], ["Clinic alert emails", ["CLINIC_NOTIFY_EMAIL"]],
];

export default async function Settings() {
  await requireModule("settings");
  const rows = items.map(([name, envs]) => ({ name, missing: envs.filter((e) => !process.env[e]) }));
  return (
    <>
      <PageHeader title="Integrations" sub="Shows whether each service has its keys set on the server. Keys are never displayed." />
      <Table rows={rows} cols={[
        { h: "Service", c: (r) => <span className="font-semibold">{r.name}</span> },
        { h: "Status", c: (r) => <Badge>{r.missing.length ? "Not configured" : "Connected"}</Badge> },
        { h: "Missing", c: (r) => (r.missing.length ? <span className="text-xs text-p-muted">{r.missing.join(", ")}</span> : "-") },
      ]} />
    </>
  );
}
