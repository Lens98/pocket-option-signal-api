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
                setUser(data);

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
                        <Link
                            href="/dashboard"
                            className="mb-2 flex items-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/subscription"
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Subscription
                        </Link>

                        <Link
                            href="/download-extension"
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Download Extension
                        </Link>

                        <Link
                            href="/account-settings"
                            className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Account Settings
                        </Link>

                        <Link
                            href="/billing"
                            className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Billing & Payments
                        </Link>

                        <Link
                            href="/help"
                            className="mb-2 flex items-center rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Help & Support
                        </Link>
                    </nav>

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

                {/* Main */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Top bar */}
                    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-gray-900 lg:px-10">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                SignalForge AI
                            </p>
                            <h1 className="text-lg font-bold text-gray-950 dark:text-white">
                                Member Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Your Account
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Member
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                                SF
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <section className="flex-1 px-6 py-8 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            {/* Welcome */}
                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                    Welcome back
                                </p>

                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                                    Your SignalForge AI account
                                </h2>

                                <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                                    Manage your subscription, access your
                                    extension, and keep everything in one
                                    place.
                                </p>
                            </div>

                            {/* Account cards */}
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Subscription
                                    </p>

                                    <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
                                        {subscription?.subscription?.plan || "No Plan"}
                                    </p>

                                    <Link
                                        href="/#pricing"
                                        className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                                    >
                                        Choose a Plan
                                    </Link>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Account Status
                                    </p>

                                    <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
                                        Active
                                    </p>

                                    <span className="mt-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                        Account Ready
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Extension
                                    </p>

                                    <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
                                        Ready
                                    </p>

                                    <span className="mt-4 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        Chrome Extension
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        AI Signals
                                    </p>

                                    <p className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
                                        CALL / PUT
                                    </p>

                                    <span className="mt-4 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                        AI Powered
                                    </span>
                                </div>
                            </div>

                            {/* Extension banner */}
                            <div className="mt-6 overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-xl lg:p-10">
                                <div className="grid items-center gap-10 lg:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                                            Get Started
                                        </p>

                                        <h3 className="mt-3 text-3xl font-bold tracking-tight">
                                            Use the SignalForge AI Chrome
                                            Extension
                                        </h3>

                                        <p className="mt-4 max-w-xl text-gray-300">
                                            Get AI-powered market analysis and
                                            clear trading signals directly in
                                            your browser.
                                        </p>

                                        <button className="mt-7 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold transition hover:bg-indigo-500">
                                            Download Extension
                                        </button>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                        <div className="mb-5 flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                AI SIGNAL
                                            </span>

                                            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                                                ONLINE
                                            </span>
                                        </div>

                                        <div className="rounded-xl bg-black/30 p-6">
                                            <p className="text-xs text-gray-400">
                                                Current Signal
                                            </p>

                                            <p className="mt-2 text-5xl font-bold text-green-400">
                                                CALL
                                            </p>

                                            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                                                <div className="rounded-lg bg-white/5 p-3">
                                                    <p className="text-gray-400">
                                                        Confidence
                                                    </p>
                                                    <p className="mt-1 font-bold">
                                                        AI
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-white/5 p-3">
                                                    <p className="text-gray-400">
                                                        Timeframe
                                                    </p>
                                                    <p className="mt-1 font-bold">
                                                        5M
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-white/5 p-3">
                                                    <p className="text-gray-400">
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
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                                        Quick Links
                                    </h3>

                                    <div className="mt-5 space-y-3">
                                        <Link
                                            href="#"
                                            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium transition hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                                        >
                                            Download Extension
                                            <span>→</span>
                                        </Link>

                                        <Link
                                            href="#"
                                            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium transition hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                                        >
                                            Manage Subscription
                                            <span>→</span>
                                        </Link>

                                        <Link
                                            href="#"
                                            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium transition hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                                        >
                                            Account Settings
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                                        Your Account
                                    </h3>

                                    <div className="mt-5 space-y-4">
                                        <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-white/10">
                                            <span className="text-sm text-gray-500">
                                                Email
                                            </span>
                                            <span className="text-sm font-medium">
                                                {user?.email || "Loading..."}
                                            </span>
                                        </div>

                                        <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-white/10">
                                            <span className="text-sm text-gray-500">
                                                Plan
                                            </span>
                                            <span className="text-sm font-medium">
                                                No Plan
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">
                                                Status
                                            </span>
                                            <span className="text-sm font-semibold text-green-600">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                    <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                                        Need Help?
                                    </h3>

                                    <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        Have questions about your account,
                                        subscription, or SignalForge AI?
                                    </p>

                                    <button className="mt-6 w-full rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="border-t border-gray-200 px-6 py-6 dark:border-white/10 lg:px-10">
                        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-gray-500 sm:flex-row">
                            <span>
                                © 2026 {siteConfig.name}. All rights reserved.
                            </span>

                            <div className="flex gap-5">
                                <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
                                    Privacy
                                </Link>

                                <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
                                    Terms
                                </Link>

                                <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
                                    Support
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}