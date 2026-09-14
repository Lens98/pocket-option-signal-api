"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SubscriptionPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("signalForgeAuthToken");

        if (!token) {
            window.location.href = "/login";
            return;
        }

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
                    throw new Error("Unable to load subscription");
                }

                return response.json();
            })
            .then((data) => {
                setSubscription(data?.subscription || null);
            })
            .catch(() => {
                setSubscription(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050b18] p-6 text-white md:p-10">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-3xl border border-white/10 bg-[#0a1120] p-10">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400" />
                            <p className="text-sm text-gray-400">
                                Loading subscription...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const isActive = subscription?.status === "active";

    return (
        <main className="min-h-screen bg-[#050b18] text-white">
            <div className="relative overflow-hidden">
                {/* Background glow */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

                <div className="relative p-6 md:p-10">
                    <div className="mx-auto max-w-6xl">
                        {/* Header */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 font-black shadow-lg shadow-indigo-500/20">
                                    S
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                                        SignalForge AI
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Subscription Center
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                                    Subscription
                                </div>

                                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                                    Your Subscription
                                </h1>

                                <p className="mt-3 max-w-2xl text-gray-400">
                                    Manage your SignalForge AI plan and view your
                                    subscription status.
                                </p>
                            </div>
                        </div>

                        {/* No Subscription */}
                        {!subscription ? (
                            <div className="rounded-3xl border border-white/10 bg-[#0a1120]/90 p-8 shadow-2xl shadow-indigo-950/20 md:p-10">
                                <div className="max-w-2xl">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
                                        🔒
                                    </div>

                                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                        Current Plan
                                    </p>

                                    <h2 className="mt-3 text-3xl font-black">
                                        No Active Plan
                                    </h2>

                                    <p className="mt-3 max-w-xl leading-7 text-gray-400">
                                        You do not currently have an active
                                        SignalForge AI subscription. Choose a
                                        plan to unlock the trading extension.
                                    </p>

                                    <Link
                                        href="/#pricing"
                                        className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                                    >
                                        View Plans
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Main Subscription Cards */}
                                <div className="grid gap-6 lg:grid-cols-2">
                                    {/* Current Plan */}
                                    <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-[#0a1120]/90 p-8 shadow-2xl shadow-indigo-950/20">
                                        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

                                        <div className="relative">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                                    Current Plan
                                                </p>

                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${isActive
                                                        ? "border border-green-400/20 bg-green-400/10 text-green-400"
                                                        : "border border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${isActive
                                                            ? "bg-green-400"
                                                            : "bg-yellow-400"
                                                            }`}
                                                    />

                                                    {subscription.status ||
                                                        "Unknown"}
                                                </span>
                                            </div>

                                            <h2 className="mt-6 text-4xl font-black capitalize">
                                                {subscription.plan || "Unknown"}
                                            </h2>

                                            <p className="mt-3 text-sm leading-6 text-gray-400">
                                                Your current SignalForge AI
                                                subscription plan.
                                            </p>

                                            {isActive && (
                                                <div className="mt-8 rounded-2xl border border-green-400/10 bg-green-400/5 p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                                                            ✓
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-bold text-green-400">
                                                                Subscription
                                                                Active
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Your extension
                                                                access is
                                                                enabled.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="rounded-3xl border border-white/10 bg-[#0a1120]/90 p-8 shadow-2xl shadow-indigo-950/20">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                            Subscription Dates
                                        </p>

                                        <div className="mt-7 space-y-5">
                                            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                                                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Started
                                                </p>

                                                <p className="mt-2 text-lg font-bold">
                                                    {subscription.started_at ||
                                                        "—"}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                                                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Expires
                                                </p>

                                                <p className="mt-2 text-lg font-bold">
                                                    {subscription.expires_at ||
                                                        "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Access Status */}
                                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                                                ✦
                                            </div>

                                            <div>
                                                <h3 className="font-bold">
                                                    SignalForge AI Access
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Your subscription controls
                                                    access to the Chrome
                                                    extension.
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href="/download-extension"
                                            className="inline-flex justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                                        >
                                            Extension Access →
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Back */}
                        <div className="mt-10">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-500 transition hover:text-white"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}