"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);

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

                fetch(
                    "https://pocket-option-signal-api-production.up.railway.app/payments/status",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                    .then(async (response) => {
                        if (!response.ok) {
                            return null;
                        }

                        return response.json();
                    })
                    .then((subscriptionData) => {
                        setSubscription(subscriptionData);
                    });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const plan =
        subscription?.subscription?.plan || "No Plan";

    const isActive =
        subscription?.subscription?.status === "active";

    return (
        <div className="min-h-screen bg-[#050b18] text-white">
            {/* Top bar */}
            <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#030712] px-6 lg:px-10">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                        SignalForge AI
                    </p>

                    <h1 className="mt-1 text-lg font-bold text-white">
                        Member Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold text-white">
                            Your Account
                        </p>

                        <p className="text-xs text-gray-500">
                            Member
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-sm font-black shadow-lg shadow-indigo-500/20">
                        SF
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="relative flex-1 overflow-hidden px-6 py-8 lg:px-10">
                {/* Background glow */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

                <div className="relative mx-auto max-w-7xl">
                    {/* Welcome */}
                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                            Welcome Back
                        </p>

                        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                            Your SignalForge AI Account
                        </h2>

                        <p className="mt-2 max-w-2xl text-gray-500">
                            Manage your subscription, access your extension,
                            and keep everything in one place.
                        </p>
                    </div>

                    {/* Account cards */}
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {/* Subscription */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10 transition hover:border-indigo-400/20">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Subscription
                                </p>

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                    $
                                </div>
                            </div>

                            <p className="mt-5 text-2xl font-black capitalize text-white">
                                {loading ? "..." : plan}
                            </p>

                            <Link
                                href="/#pricing"
                                className="mt-4 inline-flex rounded-lg bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white"
                            >
                                Choose a Plan
                            </Link>
                        </div>

                        {/* Account Status */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10 transition hover:border-green-400/20">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Account Status
                                </p>

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                                    ✓
                                </div>
                            </div>

                            <p className="mt-5 text-2xl font-black text-white">
                                Active
                            </p>

                            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-400/10 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                Account Ready
                            </span>
                        </div>

                        {/* Extension */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10 transition hover:border-cyan-400/20">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Extension
                                </p>

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                                    ◈
                                </div>
                            </div>

                            <p className="mt-5 text-2xl font-black text-white">
                                Ready
                            </p>

                            <span className="mt-4 inline-flex rounded-full border border-cyan-400/10 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                                Chrome Extension
                            </span>
                        </div>

                        {/* AI Signals */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10 transition hover:border-purple-400/20">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    AI Signals
                                </p>

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    ✦
                                </div>
                            </div>

                            <p className="mt-5 text-2xl font-black text-white">
                                CALL / PUT
                            </p>

                            <span className="mt-4 inline-flex rounded-full border border-purple-400/10 bg-purple-400/10 px-3 py-1 text-xs font-bold text-purple-400">
                                AI Powered
                            </span>
                        </div>
                    </div>

                    {/* Extension banner */}
                    <div className="relative mt-6 overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-[#0b1426] to-[#070d1a] p-8 shadow-2xl shadow-indigo-950/20 lg:p-10">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

                        <div className="relative grid items-center gap-10 lg:grid-cols-2">
                            <div>
                                <div className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                                    Get Started
                                </div>

                                <h3 className="mt-5 text-3xl font-black tracking-tight">
                                    Use the SignalForge AI Chrome Extension
                                </h3>

                                <p className="mt-4 max-w-xl leading-7 text-gray-400">
                                    Get AI-powered market analysis and clear
                                    trading signals directly in your browser.
                                </p>

                                <Link
                                    href="/download-extension"
                                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                                >
                                    Download Extension
                                    <span>→</span>
                                </Link>
                            </div>

                            {/* AI Signal preview */}
                            <div className="rounded-2xl border border-white/10 bg-[#030712]/80 p-5 shadow-xl">
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        AI SIGNAL
                                    </span>

                                    <span className="flex items-center gap-2 rounded-full border border-green-400/10 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                        ONLINE
                                    </span>
                                </div>

                                <div className="rounded-xl border border-white/5 bg-[#080f1d] p-6">
                                    <p className="text-xs text-gray-500">
                                        Current Signal
                                    </p>

                                    <p className="mt-2 text-5xl font-black text-green-400">
                                        CALL
                                    </p>

                                    <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                                        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                                            <p className="text-gray-500">
                                                Confidence
                                            </p>

                                            <p className="mt-1 font-bold text-white">
                                                AI
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                                            <p className="text-gray-500">
                                                Timeframe
                                            </p>

                                            <p className="mt-1 font-bold text-white">
                                                5M
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                                            <p className="text-gray-500">
                                                Status
                                            </p>

                                            <p className="mt-1 font-bold text-green-400">
                                                Live
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom cards */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        {/* Quick Links */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                    ↗
                                </div>

                                <h3 className="text-lg font-bold">
                                    Quick Links
                                </h3>
                            </div>

                            <div className="mt-5 space-y-3">
                                <Link
                                    href="#"
                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-medium text-gray-400 transition hover:border-indigo-400/20 hover:bg-white/[0.06] hover:text-white"
                                >
                                    Download Extension
                                    <span>→</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-medium text-gray-400 transition hover:border-indigo-400/20 hover:bg-white/[0.06] hover:text-white"
                                >
                                    Manage Subscription
                                    <span>→</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-medium text-gray-400 transition hover:border-indigo-400/20 hover:bg-white/[0.06] hover:text-white"
                                >
                                    Account Settings
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Account */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                                    ◎
                                </div>

                                <h3 className="text-lg font-bold">
                                    Your Account
                                </h3>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Email
                                    </span>

                                    <span className="max-w-[180px] truncate text-sm font-medium text-gray-300">
                                        {user?.email || "Loading..."}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Plan
                                    </span>

                                    <span className="text-sm font-medium capitalize text-gray-300">
                                        {plan}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Status
                                    </span>

                                    <span
                                        className={`text-sm font-bold ${isActive
                                            ? "text-green-400"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-xl shadow-indigo-950/10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    ?
                                </div>

                                <h3 className="text-lg font-bold">
                                    Need Help?
                                </h3>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-gray-500">
                                Have questions about your account,
                                subscription, or SignalForge AI?
                            </p>

                            <Link
                                href="/help"
                                className="mt-6 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-400 transition hover:bg-white/[0.07] hover:text-white"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#030712] px-6 py-6 lg:px-10">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-gray-600 sm:flex-row">
                    <span>
                        © 2026 {siteConfig.name}. All rights reserved.
                    </span>

                    <div className="flex gap-5">
                        <Link
                            href="#"
                            className="transition hover:text-gray-300"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="#"
                            className="transition hover:text-gray-300"
                        >
                            Terms
                        </Link>

                        <Link
                            href="/help"
                            className="transition hover:text-gray-300"
                        >
                            Support
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}