"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Subscription", href: "/subscription" },
        { name: "Download Extension", href: "/download-extension" },
        { name: "Account Settings", href: "/account-settings" },
        { name: "Billing & Payments", href: "/billing" },
        { name: "Help & Support", href: "/help" },
    ];

    return (
        <main className="min-h-screen bg-[#050b18] text-white">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden w-72 flex-col border-r border-white/10 bg-[#030712] lg:flex">
                    {/* Brand */}
                    <div className="flex h-20 items-center border-b border-white/10 px-6">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-black shadow-lg shadow-indigo-500/20">
                                S
                            </span>

                            <span className="text-lg font-bold tracking-tight">
                                SignalForge{" "}
                                <span className="text-indigo-400">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            Workspace
                        </p>

                        <div className="space-y-1.5">
                            {navItems.map((item) => {
                                const active = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active
                                            ? "border border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
                                            : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full transition ${active
                                                ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                                                : "bg-slate-700 group-hover:bg-slate-500"
                                                }`}
                                        />

                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Product status */}
                    <div className="mx-4 mb-5 rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.05] p-5">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                            <span className="text-xs font-semibold text-emerald-400">
                                System Online
                            </span>
                        </div>

                        <p className="mt-3 text-sm font-semibold text-white">
                            Trade Smarter With AI
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Real-time market analysis and AI-powered trading
                            signals.
                        </p>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/10 p-4">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem(
                                    "signalForgeAuthToken"
                                );
                                localStorage.removeItem("signalForgeUser");
                                window.location.href = "/login";
                            }}
                            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                            Log out
                        </button>
                    </div>
                </aside>

                {/* Page Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {children}
                </div>
            </div>
        </main>
    );
}