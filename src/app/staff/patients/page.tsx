import Link from "next/link";
import { requireModule } from "@/lib/session";
import { listPatients } from "@/lib/repo";
import { PageHeader, Table, Empty } from "@/components/portal/ui";
import { PatientRegistrationModal } from "@/components/portal/PatientRegistrationModal";

export default async function Patients() {
  await requireModule("patients");
  const patients = await listPatients();

  return (
    <>
      <PageHeader
        title="Patients"
        sub="Each patient has a permanent Unique Patient ID (UHID). Receipts, prescriptions and reports are automatically attached to their record."
        action={<PatientRegistrationModal buttonLabel="+ Register new patient" />}
      />
      <Table
        rows={patients}
        empty={
          <Empty
            title="No patients yet"
            hint="Click '+ Register new patient' above to add your first patient, or patients will appear here after online booking."
          />
        }
        cols={[
          {
            h: "UHID",
            c: (r) => (
              <span className="badge b-green font-mono font-semibold">
                {r.patientNo}
              </span>
            ),
          },
          {
            h: "Name",
            c: (r) => (
              <Link
                className="font-semibold text-p-primary underline-offset-2 hover:underline"
                href={`/staff/patients/${r.id}`}
              >
                {r.name}
              </Link>
            ),
          },
          { h: "Phone", c: (r) => <span className="font-mono text-xs">{r.phone}</span> },
          { h: "Last visit", c: (r) => r.last },
          { h: "Procedure", c: (r) => r.proc },
          {
            h: "",
            c: (r) => (
              <Link
                href={`/staff/patients/${r.id}`}
                className="p-btn p-btn-ghost text-xs !min-h-8 !px-3"
              >
                View record →
              </Link>
            ),
          },
        ]}
      />
    </>
  );
}
