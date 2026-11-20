import "server-only";
import { renderReceiptPdf, type ReceiptData } from "./pdf";

/**
 * Build the payment receipt PDF.
 * Returns a Buffer of the PDF bytes.
 *
 * Uses @react-pdf/renderer for a rich, styled, branded A4 receipt —
 * the same approach as the speech-therapy-system reference project.
 */
export async function buildInvoicePdf(o: {
  invoiceNo: string;
  date: string;
  patient: string;
  phone: string;
  email?: string | null;
  service: string;
  slot: string;
  amountInr: number;
  paymentId: string;
  method?: string;
}): Promise<Buffer> {
  const data: ReceiptData = {
    invoiceNo: o.invoiceNo,
    date: o.date,
    patient: o.patient,
    phone: o.phone,
    email: o.email,
    service: o.service,
    slot: o.slot,
    amountInr: o.amountInr,
    paymentId: o.paymentId,
    method: o.method,
  };
  return renderReceiptPdf(data);
}
