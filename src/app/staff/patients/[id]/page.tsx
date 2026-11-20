import { notFound } from "next/navigation";
import { requireModule } from "@/lib/session";
import { dbConfigured } from "@/lib/db";
import { getPatient } from "@/lib/repo";
import { PageHeader, Badge, Table } from "@/components/portal/ui";
import { DocActions, ReportUpload, StartPatientConsultationButton } from "@/components/portal/Actions";

const kindLabel: Record<string, string> = {
  prescription_pad: "Prescription (A4 pad)",
  prescription_photo: "Prescription (photo)",
  prescription_typed: "Prescription (typed)",
  report: "Report",
  invoice: "Receipt",
};

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("patients");
  const p = await getPatient((await params).id);
  if (!p) notFound();

  return (
    <>
      <PageHeader
        title={
          <div className="flex flex-wrap items-center gap-3">
            <span>{p.name}</span>
            <span className="badge b-green font-mono text-sm">{p.patientNo}</span>
          </div>
        }
        sub={`${p.phone}${p.email ? `, ${p.email}` : ""}`}
        action={<StartPatientConsultationButton patientId={p.id} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-p-primary">Consultation History &amp; Visits</h2>
            <Table
              min="34rem"
              rows={p.appts}
              cols={[
                { h: "When", c: (r) => r.when },
                { h: "Procedure", c: (r) => r.service },
                { h: "Mode", c: (r) => r.mode },
                { h: "Status", c: (r) => <Badge>{r.status}</Badge> },
                {
                  h: "",
                  c: (r) => (
                    <a
                      href={`/staff/consultation/${r.id}`}
                      className="p-btn p-btn-ghost text-xs !min-h-8 !px-3"
                    >
                      Open workspace →
                    </a>
                  ),
                },
              ]}
            />
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-p-primary">Patient Documents &amp; Prescriptions</h2>
            <Table
              min="34rem"
              rows={p.docs}
              empty={
                <div className="solid p-8 text-center text-sm text-p-muted">
                  No documents yet. Prescriptions saved in the consultation room and uploaded reports appear here.
                </div>
              }
              cols={[
                { h: "Type", c: (r) => kindLabel[r.kind] ?? r.kind },
                { h: "File", c: (r) => <span className="break-all">{r.filename}</span> },
                { h: "Added", c: (r) => r.when },
                { h: "", c: (r) => <DocActions id={r.id} kind={r.kind} /> },
              ]}
            />
          </section>
        </div>

        {dbConfigured() && <ReportUpload patientId={p.id} />}
      </div>
    </>
  );
}
