import Link from "next/link";
import { requireModule } from "@/lib/session";
import { listAppointments } from "@/lib/repo";
import { PageHeader, Badge, Empty } from "@/components/portal/ui";
import { ConsultationSearchBar } from "@/components/portal/ConsultationSearchBar";

export default async function ConsultationList() {
  await requireModule("consultation");
  const list = (await listAppointments())
    .filter((a) => a.isToday && /Confirmed|Completed/.test(a.status))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <>
      <PageHeader
        title="Consultation room"
        sub="Search any registered patient or register a new walk-in patient below to start their consultation immediately."
      />

      {/* Patient Search & Quick Registration Bar */}
      <ConsultationSearchBar />

      {/* Today's Scheduled Queue */}
      <h2 className="text-xl font-semibold mb-4 text-p-primary">Today&apos;s scheduled visits</h2>
      {!list.length ? (
        <Empty
          title="No scheduled online bookings for today"
          hint="Search for an existing patient above or register a new patient to start an instant consultation."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => (
            <li key={a.id} className="glass p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-portal text-lg font-semibold">{a.patient}</p>
                <Badge>{a.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-p-muted">
                {a.service}, {a.mode}, {a.when.replace("Today, ", "")}
              </p>
              <Link href={`/staff/consultation/${a.id}`} className="p-btn mt-4 w-full">
                Open consultation
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
