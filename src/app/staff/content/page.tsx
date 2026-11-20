import { requireModule } from "@/lib/session";
import { services, serviceTitle, serviceDescription } from "@/lib/content";
import { listOverrides } from "@/lib/repo";
import { dbConfigured } from "@/lib/db";
import { PageHeader, Table, Badge } from "@/components/portal/ui";
import { SeoEditor } from "@/components/portal/Actions";

export default async function Content() {
  await requireModule("content");
  const ov = await listOverrides(), editable = dbConfigured();
  const rows = services.map((s) => {
    const o = ov[`services/${s.slug}`];
    return { slug: `services/${s.slug}`, title: o?.title || serviceTitle(s), desc: o?.description || serviceDescription(s), words: s.sections.reduce((n, x) => n + x.body.split(/\s+/).length, 0), custom: Boolean(o) };
  });
  return (
    <>
      <PageHeader title="Website and SEO" sub="Search titles and descriptions for every procedure page. Body text is doctor-approved and changes through a developer so every edit is reviewed." />
      <Table min="56rem" rows={rows} cols={[
        { h: "Page", c: (r) => <span className="font-semibold">/{r.slug}</span> },
        { h: "Title", c: (r) => <>{r.title.length} chars <Badge>{r.title.length <= 60 ? "Approved" : "Pending"}</Badge></> },
        { h: "Description", c: (r) => <>{r.desc.length} chars <Badge>{r.desc.length <= 160 ? "Approved" : "Pending"}</Badge></> },
        { h: "Words", c: (r) => <>{r.words} <Badge>{r.words >= 300 ? "Approved" : "Pending"}</Badge></> },
        { h: "", c: (r) => (editable ? <SeoEditor slug={r.slug} title={r.title} description={r.desc} /> : <span className="text-xs text-p-muted">Connect database</span>) },
      ]} />
    </>
  );
}
