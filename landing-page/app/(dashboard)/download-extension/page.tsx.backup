"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function DownloadExtensionPage() {
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
                    throw new Error("Unable to check subscription");
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

    const isActive = subscription?.status === "active";

    return (
        <main className="min-h-screen bg-[#050b18] text-white">
            <div className="relative overflow-hidden">
                {/* Background glow */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="pointer-events-none absolute right-0 top-96 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px]" />

                <div className="relative mx-auto max-w-6xl px-6 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-indigo-500/20">
                                S
                            </div>

                            <div>
                                <div className="text-lg font-bold tracking-tight">
                                    SignalForge
                                </div>
                                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                                    AI Trading Intelligence
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                        >
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Hero */}
                    <div className="mx-auto mt-20 max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                            Chrome Extension
                        </div>

                        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                            Install{" "}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                SignalForge AI
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                            Bring AI-powered market analysis, trading signals,
                            indicators, timers, and trade history directly into
                            your browser.
                        </p>
                    </div>

                    {/* Extension Card */}
                    <div className="mx-auto mt-14 max-w-4xl">
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a1120]/90 shadow-2xl shadow-indigo-950/30">
                            {/* Top bar */}
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-black">
                                        SF
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold">
                                            SignalForge AI
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Chrome Extension
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-green-400">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    System Ready
                                </div>
                            </div>

                            <div className="p-8 sm:p-10">
                                {/* Fake extension preview */}
                                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                                    {/* Market panel */}
                                    <div className="rounded-2xl border border-white/10 bg-[#050b18] p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-gray-500">
                                                    LIVE MARKET
                                                </div>
                                                <div className="mt-1 text-lg font-bold">
                                                    EURUSD_otc
                                                </div>
                                            </div>

                                            <div className="rounded-lg border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                                                LIVE
                                            </div>
                                        </div>

                                        {/* Chart */}
                                        <div className="relative mt-6 h-40 overflow-hidden rounded-xl border border-white/5 bg-[#080f1d]">
                                            <div className="absolute inset-0 opacity-20">
                                                <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
                                            </div>

                                            <div className="absolute inset-x-5 bottom-5 flex h-28 items-end gap-2">
                                                {[35, 48, 42, 60, 52, 70, 65, 80, 68, 90, 76, 100, 88, 108, 95].map(
                                                    (height, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex-1 rounded-t bg-gradient-to-t from-indigo-600/30 to-cyan-400/80"
                                                            style={{
                                                                height: `${height}px`,
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            {["1m", "5m", "15m", "1h"].map(
                                                (timeframe, index) => (
                                                    <div
                                                        key={timeframe}
                                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${index === 1
                                                            ? "bg-indigo-500 text-white"
                                                            : "bg-white/5 text-gray-500"
                                                            }`}
                                                    >
                                                        {timeframe}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Signal panel */}
                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    AI Signal
                                                </span>

                                                <span className="rounded-md bg-green-400/10 px-2 py-1 text-[10px] font-bold text-green-400">
                                                    CONFIRMED
                                                </span>
                                            </div>

                                            <div className="mt-5 flex items-end justify-between">
                                                <div>
                                                    <div className="text-4xl font-black text-green-400">
                                                        CALL
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Bullish market setup
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">
                                                        87%
                                                    </div>
                                                    <div className="text-[10px] text-gray-500">
                                                        Confidence
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-[#050b18] p-5">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Market Indicators
                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                <div className="rounded-xl bg-white/5 p-3 text-center">
                                                    <div className="text-[10px] text-gray-500">
                                                        EMA
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold text-green-400">
                                                        Bullish
                                                    </div>
                                                </div>

                                                <div className="rounded-xl bg-white/5 p-3 text-center">
                                                    <div className="text-[10px] text-gray-500">
                                                        RSI
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold">
                                                        64
                                                    </div>
                                                </div>

                                                <div className="rounded-xl bg-white/5 p-3 text-center">
                                                    <div className="text-[10px] text-gray-500">
                                                        MACD
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold text-cyan-400">
                                                        +
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Download area */}
                                <div className="mt-8 rounded-2xl border border-indigo-400/20 bg-indigo-500/5 p-6 text-center">
                                    {loading ? (
                                        <>
                                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400" />

                                            <p className="mt-4 text-sm text-gray-400">
                                                Checking your subscription...
                                            </p>
                                        </>
                                    ) : isActive ? (
                                        <>
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400/10 text-2xl">
                                                ✓
                                            </div>

                                            <h2 className="mt-4 text-xl font-bold">
                                                Your subscription is active
                                            </h2>

                                            <p className="mt-2 text-sm text-gray-400">
                                                You can download the SignalForge
                                                AI Chrome extension now.
                                            </p>

                                            <a
                                                href="/extension.zip"
                                                download
                                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-indigo-500/30"
                                            >
                                                Download Extension
                                                <span>↓</span>
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
                                                🔒
                                            </div>

                                            <h2 className="mt-4 text-xl font-bold">
                                                Extension Locked
                                            </h2>

                                            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
                                                Choose an active SignalForge AI
                                                plan to unlock the extension.
                                            </p>

                                            <Link
                                                href="/#pricing"
                                                className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                                            >
                                                Choose a Plan
                                            </Link>
                                        </>
                                    )}
                                </div>

                                <p className="mt-5 text-center text-xs text-gray-600">
                                    Chrome extension package • SignalForge AI
                                    • Trade responsibly
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-400/20 hover:bg-white/[0.05]">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                ✦
                            </div>

                            <h3 className="mt-5 font-bold">
                                AI Signals
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Receive CALL, PUT, or WAIT signals based on
                                market analysis.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-purple-400/20 hover:bg-white/[0.05]">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                ◈
                            </div>

                            <h3 className="mt-5 font-bold">
                                Real-Time Analysis
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Analyze current market conditions directly
                                inside your browser.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                                ◎
                            </div>

                            <h3 className="mt-5 font-bold">
                                Complete Trading Dashboard
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Signals, indicators, entry timers, and trade
                                history in one place.
                            </p>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-16 border-t border-white/10 pt-8 text-center">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-gray-500 transition hover:text-white"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}