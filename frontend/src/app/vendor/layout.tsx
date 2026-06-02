'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/vendor/onboarding", label: "Onboarding", icon: "📋" },
    { href: "/vendor/assignments", label: "Assignments", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar Nav */}
      <aside className="w-64 bg-white border-r border-gray-200/50 p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5 mb-8">
            <span className="text-xl">🛋️</span>
            <span className="font-black text-md text-gray-800 tracking-tight">Vendor Portal</span>
          </div>

          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-brand-50 text-brand-700 font-bold shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
            V
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gray-700">Elena Rostova</span>
            <span className="text-[10px] text-gray-400 font-medium">Approved Partner</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
