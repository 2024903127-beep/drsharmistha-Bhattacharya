import type { Metadata } from "next";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false, follow: false } };

export default async function StaffLogin({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="portal grid place-items-center px-4 py-10">
      <div className="glass w-full max-w-md p-8">
        <h1 className="text-3xl text-p-primary">Staff sign in</h1>
        <p className="mb-6 mt-1 text-sm text-p-muted">One sign-in for everyone. You will see the tools for your role.</p>
        <LoginForm next={next ?? "/staff/dashboard"} demo={process.env.NODE_ENV !== "production"} />
      </div>
    </div>
  );
}
