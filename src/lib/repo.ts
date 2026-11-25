import "server-only";
import { db, dbConfigured } from "./db";
import * as mock from "./mock";
import { demoUsers } from "./demo-users";
import { fmtWhen, ago, istDate } from "./fmt";

export type Appt = { id: string; ref: string; patientId: string; patient: string; phone: string; service: string; when: string; startsAt: string; mode: "Online" | "In person"; status: string; fee: number; meetLink: string | null; isToday: boolean };
export type Lead = { id: string; name: string; phone: string; interest: string; source: string; status: string; when: string };
export type Pay = { id: string; ref: string; patient: string; amount: number; method: string; status: string; when: string; canRefund: boolean };
export type DocRow = { id: string; kind: string; filename: string; size: number; when: string };
export type StaffRow = { id: string; name: string; email: string; role: string; active: boolean; phone?: string | null };

const statusLabel: Record<string, string> = { held: "Pending payment", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled", expired: "Cancelled", conflict: "Payment conflict" };
const payLabel: Record<string, string> = { created: "Pending", captured: "Paid", failed: "Failed", refunded: "Refunded" };
const host = (u?: string) => { try { return u ? new URL(u).hostname.replace(/^www\./, "") : ""; } catch { return ""; } };
const SEL = "id,ref,service,mode,status,starts_at,fee_paise,meet_link,patient_id,patients(full_name,phone)";

const mapAppt = (r: any): Appt => ({
  id: r.id, ref: r.ref, patientId: r.patient_id, patient: r.patients?.full_name ?? "", phone: r.patients?.phone ?? "", service: r.service,
  when: fmtWhen(r.starts_at), startsAt: r.starts_at, mode: r.mode === "online" ? "Online" : "In person", status: statusLabel[r.status] ?? r.status,
  fee: Math.round(r.fee_paise / 100), meetLink: r.meet_link, isToday: istDate(new Date(r.starts_at)) === istDate(),
});
const mockAppts = (): Appt[] => mock.appointments.map((a, i) => ({ ...a, ref: `BK-DEMO${i + 1}`, patientId: `P-${1001 + i}`, startsAt: new Date().toISOString(), meetLink: null, isToday: a.when.startsWith("Today") }));

export async function listAppointments(): Promise<Appt[]> {
  if (!dbConfigured()) return mockAppts();
  const { data, error } = await db().from("appointments").select(SEL).neq("status", "expired").order("starts_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map(mapAppt);
}
export async function getAppointment(id: string): Promise<Appt | null> {
  if (!dbConfigured()) return mockAppts().find((a) => a.id === id) ?? null;
  const { data } = await db().from("appointments").select(SEL).eq("id", id).maybeSingle();
  return data ? mapAppt(data) : null;
}

export async function listPatients() {
  if (!dbConfigured()) return mock.appointments.map((a, i) => ({ id: `P-${1001 + i}`, patientNo: `PT-${1001 + i}`, name: a.patient, phone: a.phone, last: a.when, proc: a.service }));
  const { data, error } = await db().from("patients").select("id,patient_no,full_name,phone,appointments(starts_at,service,status)").order("created_at", { ascending: false }).limit(300);
  if (error) throw error;
  return (data ?? []).map((p: any) => {
    const last = [...(p.appointments ?? [])].filter((x: any) => x.status !== "expired").sort((a: any, b: any) => b.starts_at.localeCompare(a.starts_at))[0];
    return {
      id: p.id,
      patientNo: p.patient_no || `PT-${p.id.slice(0, 4).toUpperCase()}`,
      name: p.full_name,
      phone: p.phone,
      last: last ? fmtWhen(last.starts_at) : "No visits yet",
      proc: last?.service ?? "-",
    };
  });
}

export async function getPatient(id: string) {
  if (!dbConfigured()) {
    const i = mockAppts().findIndex((a) => a.patientId === id);
    if (i < 0) return null;
    const a = mockAppts()[i];
    return { id, patientNo: "PT-1001", name: a.patient, phone: a.phone, email: "", appts: [a], docs: [] as DocRow[] };
  }
  const { data: p } = await db().from("patients").select("id,patient_no,full_name,phone,email").eq("id", id).maybeSingle();
  if (!p) return null;
  const [{ data: ap }, { data: dc }] = await Promise.all([
    db().from("appointments").select(SEL).eq("patient_id", id).neq("status", "expired").order("starts_at", { ascending: false }),
    db().from("documents").select("id,kind,filename,size_bytes,created_at").eq("patient_id", id).order("created_at", { ascending: false }),
  ]);
  return {
    id: p.id,
    patientNo: p.patient_no || `PT-${p.id.slice(0, 4).toUpperCase()}`,
    name: p.full_name,
    phone: p.phone,
    email: p.email ?? "",
    appts: (ap ?? []).map(mapAppt),
    docs: (dc ?? []).map((d: any): DocRow => ({ id: d.id, kind: d.kind, filename: d.filename, size: d.size_bytes, when: ago(d.created_at) })),
  };
}

export async function listLeads(): Promise<Lead[]> {
  if (!dbConfigured()) return mock.leads.map((l, i) => ({ ...l, id: `l${i}` }));
  const { data, error } = await db().from("leads").select("id,name,phone,service,attribution,status,created_at").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map((l: any) => ({ id: l.id, name: l.name, phone: l.phone, interest: l.service ?? "General", source: l.attribution?.utm_source || host(l.attribution?.referrer) || "Direct", status: l.status, when: ago(l.created_at) }));
}

export async function listPayments(): Promise<Pay[]> {
  if (!dbConfigured()) return mock.payments.map((p) => ({ ...p, canRefund: false }));
  const { data, error } = await db().from("payments").select("id,rzp_order_id,amount_paise,status,method,created_at,appointments(ref,patients(full_name))").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map((p: any) => ({ id: p.id, ref: p.appointments?.ref ?? p.rzp_order_id, patient: p.appointments?.patients?.full_name ?? "", amount: Math.round(p.amount_paise / 100), method: p.method ?? "-", status: payLabel[p.status] ?? p.status, when: fmtWhen(p.created_at), canRefund: p.status === "captured" }));
}

export async function listMessages() {
  if (!dbConfigured()) return [];
  const { data } = await db().from("message_log").select("channel,template,recipient,status,error,created_at").order("created_at", { ascending: false }).limit(30);
  return (data ?? []).map((m: any) => ({
    when: ago(m.created_at),
    channel: m.channel,
    template: m.template,
    to: m.recipient,
    status:
      m.status === "sent"
        ? /fallback/i.test(m.error || "")
          ? "24h fallback"
          : "Sent"
        : m.status === "skipped"
          ? "Skipped"
          : "Failed",
    error: m.error as string | null,
  }));
}
export async function listAudit() {
  if (!dbConfigured()) return mock.audit;
  const { data } = await db().from("audit_log").select("staff_name,action,entity,entity_id,created_at").order("created_at", { ascending: false }).limit(100);
  return (data ?? []).map((a: any) => ({ when: fmtWhen(a.created_at), who: a.staff_name, action: a.action.replace(/_/g, " "), record: `${a.entity}${a.entity_id ? " " + String(a.entity_id).slice(0, 8) : ""}` }));
}
export async function listStaff(): Promise<StaffRow[]> {
  if (!dbConfigured()) return demoUsers.map((u) => ({ id: u.uid, name: u.name, email: u.email, role: u.role, active: true, phone: null }));
  const { data } = await db().from("staff").select("id,full_name,email,role,active,phone").order("created_at");
  return (data ?? []).map((s: any) => ({ id: s.id, name: s.full_name, email: s.email, role: s.role, active: s.active, phone: s.phone }));
}

export async function getOverride(slug: string): Promise<{ title?: string | null; description?: string | null } | null> {
  if (!dbConfigured()) return null;
  try { return (await db().from("page_overrides").select("title,description").eq("slug", slug).maybeSingle()).data; } catch { return null; }
}
export async function listOverrides(): Promise<Record<string, { title?: string | null; description?: string | null }>> {
  if (!dbConfigured()) return {};
  const { data } = await db().from("page_overrides").select("slug,title,description");
  return Object.fromEntries((data ?? []).map((o: any) => [o.slug, o]));
}
