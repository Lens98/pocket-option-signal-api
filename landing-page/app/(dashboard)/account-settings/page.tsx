"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountSettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("signalForgeAuthToken");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        fetch(
            "https://pocket-option-signal-api-production.up.railway.app/auth/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Session expired");
                }

                return response.json();
            })
            .then((data) => {
                setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem("signalForgeAuthToken");
                localStorage.removeItem("signalForgeUser");
                window.location.href = "/login";
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050b18] p-8 text-white">
                <div className="mx-auto max-w-5xl">
                    <p className="text-sm text-slate-500">
                        Loading account...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050b18] text-white">
            <div className="relative overflow-hidden">
                {/* Background glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl px-6 py-10 lg:px-10">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            Account
                        </div>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Account Settings
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            View and manage your SignalForge AI account.
                        </p>
                    </div>

                    {/* Account card */}
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                        {/* Card header */}
                        <div className="border-b border-white/10 px-7 py-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold shadow-lg shadow-indigo-500/20">
                                    {user?.email?.charAt(0)?.toUpperCase() ||
                                        "S"}
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white">
                                        Account Information
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your SignalForge AI account details
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Information */}
                        <div className="divide-y divide-white/10">
                            <div className="flex flex-col gap-2 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Email
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-white">
                                        {user?.email || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Account Status
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                                        <p className="text-sm font-medium text-emerald-400">
                                            Active
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-7 py-6">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Account ID
                                </p>

                                <p className="mt-2 break-all font-mono text-sm text-slate-300">
                                    {user?.id || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security notice */}
                    <div className="mt-6 rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.04] p-6">
                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5 text-indigo-400"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9.5 12 1.7 1.7 3.5-3.5"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Account Security
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Keep your account credentials private and
                                    never share your SignalForge AI login
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div className="mt-8">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-slate-500 transition hover:text-white"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}