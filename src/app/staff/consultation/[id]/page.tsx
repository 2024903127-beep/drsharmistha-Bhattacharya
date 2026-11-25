import { notFound } from "next/navigation";
import { requireModule } from "@/lib/session";
import { getAppointment } from "@/lib/repo";
import { getTemplatesCatalog, getLastRxSnapshot } from "@/lib/templates-repo";
import { audit } from "@/lib/audit";
import { Workspace } from "@/components/portal/Workspace";

export default async function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireModule("consultation");
  const a = await getAppointment((await params).id);
  if (!a) notFound();
  const [catalog, previousRx] = await Promise.all([
    getTemplatesCatalog(),
    getLastRxSnapshot(a.patientId),
  ]);
  await audit({ uid: s.uid, name: s.name }, "opened_consultation", "appointment", a.id);
  return (
    <Workspace
      appt={{
        id: a.id,
        patient: a.patient,
        patientId: a.patientId,
        service: a.service,
        mode: a.mode,
        when: a.when,
        status: a.status,
        meetLink: a.meetLink,
      }}
      doctor={s.role === "doctor" || s.role === "admin" ? s.name : "Dr. Sharmistha Bhattacharyya"}
      catalog={catalog}
      previousRx={previousRx}
    />
  );
}
