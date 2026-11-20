// SAMPLE DATA for Pass 1. Replaced by Supabase queries in Pass 2. All names are fictional.
export type Appt = { id: string; patient: string; phone: string; service: string; when: string; mode: "Online" | "In person"; status: string; fee: number };
export const appointments: Appt[] = [
  { id: "a1", patient: "Ananya Rao", phone: "+91 98100 00011", service: "Rhinoplasty", when: "Today, 10:00 AM", mode: "Online", status: "Confirmed", fee: 1500 },
  { id: "a2", patient: "Vikram Malhotra", phone: "+91 98100 00012", service: "Gynecomastia", when: "Today, 11:00 AM", mode: "Online", status: "In consultation", fee: 1500 },
  { id: "a3", patient: "Meera Singh", phone: "+91 98100 00013", service: "Tummy Tuck", when: "Today, 12:00 PM", mode: "In person", status: "Confirmed", fee: 1500 },
  { id: "a4", patient: "Karan Arora", phone: "+91 98100 00014", service: "Hair Transplant", when: "Today, 3:00 PM", mode: "Online", status: "Pending payment", fee: 1500 },
  { id: "a5", patient: "Priya Nair", phone: "+91 98100 00015", service: "Breast Reduction", when: "Tomorrow, 10:00 AM", mode: "Online", status: "Confirmed", fee: 1500 },
  { id: "a6", patient: "Rahul Verma", phone: "+91 98100 00016", service: "Liposuction", when: "Tomorrow, 4:00 PM", mode: "In person", status: "Confirmed", fee: 1500 },
  { id: "a7", patient: "Sana Khan", phone: "+91 98100 00017", service: "Anti-Wrinkle Injection", when: "Yesterday, 5:00 PM", mode: "Online", status: "Completed", fee: 1500 },
  { id: "a8", patient: "Dev Choudhary", phone: "+91 98100 00018", service: "Facelift", when: "Yesterday, 2:00 PM", mode: "Online", status: "Cancelled", fee: 1500 },
];
export const leads = [
  { name: "Isha Gupta", phone: "+91 98100 00021", interest: "Rhinoplasty", source: "Google organic", status: "New", when: "12 min ago" },
  { name: "Aman Sethi", phone: "+91 98100 00022", interest: "Hair Transplant", source: "Instagram", status: "Contacted", when: "2 hours ago" },
  { name: "Neha Bansal", phone: "+91 98100 00023", interest: "Mommy Makeover", source: "Google ads", status: "Follow-up due", when: "Yesterday" },
  { name: "Rohan Kapoor", phone: "+91 98100 00024", interest: "Gynecomastia", source: "WhatsApp", status: "Booked", when: "Yesterday" },
  { name: "Tanya Dua", phone: "+91 98100 00025", interest: "Laser Hair Reduction", source: "Direct", status: "New", when: "2 days ago" },
];
export const payments = [
  { id: "pay_001", ref: "BK-7F3A21C9", patient: "Ananya Rao", amount: 1500, method: "UPI", status: "Paid", when: "Today, 9:12 AM" },
  { id: "pay_002", ref: "BK-91D2E0AB", patient: "Vikram Malhotra", amount: 1500, method: "Card", status: "Paid", when: "Yesterday" },
  { id: "pay_003", ref: "BK-2B8C77F1", patient: "Karan Arora", amount: 1500, method: "UPI", status: "Pending", when: "Today, 8:40 AM" },
  { id: "pay_004", ref: "BK-55A10D3E", patient: "Dev Choudhary", amount: 1500, method: "Card", status: "Refunded", when: "Yesterday" },
];
export const templates = [
  { name: "booking_confirmation", trigger: "Payment confirmed (with Meet link)", channel: "WhatsApp + Email", status: "Draft" },
  { name: "payment_receipt", trigger: "Payment confirmed (receipt button)", channel: "WhatsApp + Email", status: "Draft" },
  { name: "appointment_reminder", trigger: "24 hours and 1 hour before", channel: "WhatsApp + Email", status: "Draft" },
  { name: "appointment_rescheduled", trigger: "Appointment moved", channel: "WhatsApp + Email", status: "Draft" },
  { name: "appointment_cancelled", trigger: "Appointment cancelled", channel: "WhatsApp + Email", status: "Draft" },
  { name: "prescription_ready", trigger: "Prescription sent by staff", channel: "WhatsApp + Email", status: "Draft" },
  { name: "report_ready", trigger: "Report sent by staff", channel: "WhatsApp + Email", status: "Draft" },
  { name: "followup_checkin", trigger: "2 hours after consultation is completed", channel: "WhatsApp + Email", status: "Draft" },
];
export const audit = [
  { when: "Today, 11:02 AM", who: "Dr. Sharmistha Bhattacharyya", action: "Opened consultation", record: "Vikram Malhotra" },
  { when: "Today, 10:41 AM", who: "Front Desk", action: "Rescheduled appointment", record: "Karan Arora" },
  { when: "Today, 9:15 AM", who: "Patient Coordinator", action: "Updated enquiry status", record: "Aman Sethi" },
  { when: "Yesterday, 6:20 PM", who: "Dr. Sharmistha Bhattacharyya", action: "Saved prescription (A4 pad)", record: "Sana Khan" },
  { when: "Yesterday, 5:02 PM", who: "Front Desk", action: "Issued refund", record: "Dev Choudhary" },
];
export const tone = (s: string) =>
  /confirmed|paid|completed|booked|approved|connected/i.test(s) ? "b-green"
  : /pending|follow|draft|due/i.test(s) ? "b-amber"
  : /cancel|refund|fail|conflict|not configured/i.test(s) ? "b-red"
  : /consult|new|contacted/i.test(s) ? "b-blue" : "b-grey";
