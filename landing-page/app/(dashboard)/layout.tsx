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
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="flex min-h-screen">

                {/* Sidebar */}
                <aside className="hidden w-64 flex-col border-r border-gray-200 bg-gray-950 text-white lg:flex">

                    <div className="flex h-20 items-center px-6">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold">
                            S
                        </div>

                        <span className="text-lg font-bold">
                            {siteConfig.name}
                        </span>
                    </div>

                    <nav className="flex-1 px-4 py-6">
                        {navItems.map((item) => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`mb-2 flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="px-4 pb-4">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("signalForgeAuthToken");
                                localStorage.removeItem("signalForgeUser");
                                window.location.href = "/login";
                            }}
                            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-300 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="m-4 rounded-2xl bg-white/5 p-5">

                        <p className="text-sm font-semibold">

                            Trade Smarter With AI

                        </p>

                        <p className="mt-2 text-xs leading-5 text-gray-400">

                            Real-time market analysis and AI-powered trading

                            signals.

                        </p>

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