import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Staff Password Management — Dr. Sharmistha Bhattacharyya",
  robots: { index: false, follow: false },
};

export default function SetPassword() {
  return (
    <div className="portal grid place-items-center px-4 py-16">
      <div className="glass w-full max-w-md p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 text-2xl">
          🔒
        </div>
        <h1 className="text-2xl font-serif text-p-primary">Staff Credential Policy</h1>
        <p className="text-sm text-p-muted leading-relaxed">
          Self-service password resets are disabled for security compliance. All clinic staff credentials and passwords are created and managed directly by the Clinic Administrator (Dr. Sharmistha).
        </p>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-900 text-left space-y-1">
          <p className="font-semibold">Need to reset your password or lost your login?</p>
          <p>Please contact Dr. Sharmistha Bhattacharyya or your clinic manager. They can reset your password immediately from the Team &amp; Roles administration panel.</p>
        </div>
        <div className="pt-2">
          <Link href="/staff-login" className="p-btn inline-block w-full">
            Return to Staff Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
