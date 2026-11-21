"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, CalendarDays, Stethoscope, Users, Inbox, IndianRupee, MessageCircle, Globe, ShieldCheck, Plug, ScrollText, Menu, X, LogOut } from "lucide-react";
import type { Module } from "@/lib/permissions";

const icons: Record<Module, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  dashboard: LayoutDashboard, appointments: CalendarDays, consultation: Stethoscope, patients: Users, leads: Inbox,
  billing: IndianRupee, messages: MessageCircle, content: Globe, team: ShieldCheck, settings: Plug, audit: ScrollText,
};
const roleLabel = { admin: "Owner / Admin", doctor: "Doctor", receptionist: "Receptionist", coordinator: "Coordinator" } as const;

export function Shell({ nav, user, children }: { nav: { mod: Module; label: string; href: string }[]; user: { name: string; role: keyof typeof roleLabel }; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links = (
    <nav aria-label="Staff" className="flex flex-col gap-0.5">
      {nav.map((n) => {
        const I = icons[n.mod], active = path === n.href || path.startsWith(`${n.href}/`);
        return (
          <Link key={n.mod} href={n.href} prefetch={true} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
            className={`flex min-h-10 items-center gap-3 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "bg-p-primary text-white shadow-sm" : "text-p-text hover:bg-white/80"}`}>
            <I size={17} aria-hidden />{n.label}
          </Link>
        );
      })}
    </nav>
  );
  const account = (
    <div className="mt-4 border-t border-p-border pt-3">
      <p className="text-sm font-semibold truncate">{user.name}</p>
      <p className="text-xs text-p-muted">{roleLabel[user.role]}</p>
      <form action="/api/staff/logout" method="post"><button className="p-btn p-btn-ghost mt-2.5 w-full text-xs !min-h-9"><LogOut size={14} aria-hidden />Sign out</button></form>
    </div>
  );
  return (
    <div className="portal">
      <aside className="glass !fixed inset-y-3 left-3 z-20 hidden w-64 flex-col overflow-y-auto p-4 lg:flex">
        <p className="font-portal mb-4 px-2 text-lg font-semibold text-p-primary">Dr. Sharmistha<span className="block text-xs font-normal text-p-muted">Staff portal</span></p>
        <div className="flex-1 overflow-y-auto pr-1">{links}</div>
        <div className="mt-auto pt-2">{account}</div>
      </aside>
      <header className="glass sticky top-3 z-30 mx-3 mt-3 flex min-h-14 items-center justify-between px-3 lg:hidden">
        <button className="grid size-11 place-items-center" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
        <p className="font-portal font-semibold text-p-primary">Staff portal</p><span className="size-11" />
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-p-text/30" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="glass absolute inset-y-3 left-3 flex w-72 max-w-[85vw] flex-col overflow-y-auto p-4">
            <button className="mb-2 grid size-11 place-items-center self-end" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
            {links}<div className="mt-auto">{account}</div>
          </div>
        </div>
      )}
      <main className="px-4 pb-16 pt-6 lg:ml-72 lg:px-8 lg:pt-8">{children}</main>
    </div>
  );
}
