import { requireModule } from "@/lib/session";
import { getTemplatesCatalog } from "@/lib/templates-repo";
import { PageHeader } from "@/components/portal/ui";
import { TemplatesManager } from "@/components/portal/TemplatesManager";

export default async function Settings() {
  await requireModule("settings");
  const catalog = await getTemplatesCatalog();
  return (
    <>
      <PageHeader
        title="Clinical Templates & Presets"
        sub="Manage reusable discharge medicine kits, investigation panels (PAC, Metabolic, Hormonal, Imaging), and before/after surgery care sheets — ready for 1-click selection during consultation."
      />
      <TemplatesManager initialCatalog={catalog} />
    </>
  );
}
