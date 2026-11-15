"use client";

import Link from "next/link";

export default function HelpPage() {
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
                                        Support Center
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                                    Support
                                </div>

                                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                                    Help & Support
                                </h1>

                                <p className="mt-3 max-w-2xl text-gray-400">
                                    Get help with your SignalForge AI account,
                                    subscription, and Chrome extension.
                                </p>
                            </div>
                        </div>

                        {/* Support Cards */}
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Getting Started */}
                            <div className="group rounded-3xl border border-white/10 bg-[#0a1120]/90 p-7 shadow-2xl shadow-indigo-950/10 transition hover:border-indigo-400/20 hover:bg-[#0c1425]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-400">
                                    ✦
                                </div>

                                <h2 className="mt-6 text-xl font-bold">
                                    Getting Started
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Learn how to use your SignalForge AI
                                    account, subscription, and Chrome
                                    extension.
                                </p>

                                <Link
                                    href="/download-extension"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 px-5 py-3 text-sm font-bold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white"
                                >
                                    Extension Guide
                                    <span>→</span>
                                </Link>
                            </div>

                            {/* FAQ */}
                            <div className="group rounded-3xl border border-white/10 bg-[#0a1120]/90 p-7 shadow-2xl shadow-indigo-950/10 transition hover:border-purple-400/20 hover:bg-[#0c1425]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-xl text-purple-400">
                                    ?
                                </div>

                                <h2 className="mt-6 text-xl font-bold">
                                    Frequently Asked Questions
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Find answers about SignalForge AI,
                                    subscriptions, signals, and using the
                                    extension.
                                </p>

                                <Link
                                    href="/#faq"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    View FAQ
                                    <span>→</span>
                                </Link>
                            </div>

                            {/* Billing */}
                            <div className="group rounded-3xl border border-white/10 bg-[#0a1120]/90 p-7 shadow-2xl shadow-indigo-950/10 transition hover:border-cyan-400/20 hover:bg-[#0c1425]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-xl text-cyan-400">
                                    $
                                </div>

                                <h2 className="mt-6 text-xl font-bold">
                                    Account & Billing
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Check your account information,
                                    subscription, and payment details.
                                </p>

                                <Link
                                    href="/billing"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    Billing & Payments
                                    <span>→</span>
                                </Link>
                            </div>

                            {/* Contact */}
                            <div className="group rounded-3xl border border-white/10 bg-[#0a1120]/90 p-7 shadow-2xl shadow-indigo-950/10 transition hover:border-green-400/20 hover:bg-[#0c1425]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400/10 text-xl text-green-400">
                                    @
                                </div>

                                <h2 className="mt-6 text-xl font-bold">
                                    Need More Help?
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    If you need assistance with your account or
                                    SignalForge AI, contact our support team.
                                </p>

                                <a
                                    href="mailto:support@signalforge.ai"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
                                >
                                    Contact Support
                                    <span>→</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Help */}
                        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />

                                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                                            Support Available
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-lg font-bold">
                                        Need assistance with your account?
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Our support team can help with account,
                                        billing, and extension questions.
                                    </p>
                                </div>

                                <a
                                    href="mailto:support@signalforge.ai"
                                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    Email Support
                                </a>
                            </div>
                        </div>

                        {/* Back */}
                        <div className="mt-10 border-t border-white/10 pt-8">
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