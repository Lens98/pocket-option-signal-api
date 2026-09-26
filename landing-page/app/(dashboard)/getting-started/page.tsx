"use client";

import Link from "next/link";

const steps = [
    {
        number: "01",
        title: "Download SignalForge AI",
        description:
            "Start by opening the Download Extension page from your SignalForge AI account. An active subscription is required before the extension download is unlocked.",
                screenshot: "/guide/guide-step-01.png",
details: [
            "Log in to your SignalForge AI account.",
            "Open Download Extension from the dashboard.",
            "Select the download button.",
            "Save the extension ZIP file to your computer.",
        ],
    },
    {
        number: "02",
        title: "Install the Chrome Extension",
        description:
            "SignalForge AI is installed as a Chrome extension using Chrome's developer extension tools.",
                screenshot: "/guide/guide-step-02.png",
details: [
            "Extract the downloaded ZIP file.",
            "Open Chrome and go to Extensions.",
            "Turn on Developer mode.",
            "Select Load unpacked.",
            "Choose the extracted SignalForge AI extension folder.",
        ],
    },
    {
        number: "03",
        title: "Open SignalForge AI",
        description:
            "After installation, open SignalForge AI from Chrome's Extensions menu.",
                screenshot: "/guide/guide-step-03.png",
details: [
            "Click the Extensions icon in Chrome.",
            "Find SignalForge AI.",
            "Open the extension.",
            "The SignalForge AI dashboard will appear.",
        ],
    },
    {
        number: "04",
        title: "Sign In to Your Account",
        description:
            "Sign in using the SignalForge AI account associated with your subscription.",
                screenshot: "/guide/guide-step-04.png",
details: [
            "Enter your SignalForge AI email.",
            "Enter your password.",
            "Select Sign In.",
            "Wait for the dashboard to load.",
        ],
    },
    {
        number: "05",
        title: "Connect to Pocket Option",
        description:
            "Open Pocket Option and make sure the relevant market is available before starting an analysis.",
                screenshot: "/guide/guide-step-05.png",
details: [
            "Open Pocket Option in Chrome.",
            "Make sure the market page is loaded.",
            "Open SignalForge AI.",
            "Check the connection/status indicator.",
            "Confirm that the extension is connected.",
        ],
    },
    {
        number: "06",
        title: "Choose Your Market & Timeframe",
        description:
            "The Live Market area displays the active asset, market information, chart, and available timeframes.",
                screenshot: "/guide/guide-step-06.png",
details: [
            "Select the market or asset you want to inspect.",
            "Review the current market information.",
            "Choose a timeframe.",
            "Available timeframes include 1m, 5m, 15m, and 1H.",
        ],
    },
    {
        number: "07",
        title: "Analyze the Market",
        description:
            "Use ANALYZE MARKET to request the current SignalForge AI market analysis.",
                screenshot: "/guide/guide-step-07.png",
details: [
            "Confirm that the extension is connected.",
            "Confirm the selected asset and timeframe.",
            "Press ANALYZE MARKET.",
            "Wait for the analysis to complete.",
            "Review the resulting AI Signal card.",
        ],
    },
    {
        number: "08",
        title: "Understand the AI Signal",
        description:
            "The AI Signal card presents the current directional signal together with supporting information.",
                screenshot: "/guide/guide-step-08.png",
details: [
            "CALL — bullish/upward directional signal.",
            "PUT — bearish/downward directional signal.",
            "WAIT — no directional entry is being presented.",
            "Review Confidence, Trend, and Risk together.",
        ],
    },
    {
        number: "09",
        title: "Read the AI Analysis",
        description:
            "The AI Analysis section displays the indicator conditions used to describe the current market.",
                screenshot: "/guide/guide-step-09.png",
details: [
            "EMA Trend",
            "RSI",
            "MACD",
            "Volume",
            "Structure",
            "Volatility",
            "Support / Resistance",
            "Liquidity",
        ],
    },
    {
        number: "10",
        title: "Check the Entry Timer",
        description:
            "The Entry Timer displays timing information associated with the next entry window.",
                screenshot: "/guide/guide-step-10.png",
details: [
            "Review the countdown.",
            "Read the entry message.",
            "Check the AI Instruction.",
            "Consider the signal and supporting analysis together rather than relying on one number.",
        ],
    },
    {
        number: "11",
        title: "Manual Trading",
        description:
            "Manual mode allows you to request an AI analysis and then make your own trading decision.",
                screenshot: "/guide/guide-step-11.png",
details: [
            "Analyze the market.",
            "Review CALL, PUT, or WAIT.",
            "Review confidence, trend, and risk.",
            "Review the indicators and timer.",
            "Make your own trading decision.",
        ],
    },
    {
        number: "12",
        title: "Automatic Trading",
        description:
            "Automatic trading can execute trades automatically when the feature is enabled and available on your plan.",
                screenshot: "/guide/guide-step-12.png",
details: [
            "Review your settings before enabling automatic execution.",
            "Confirm the asset and timeframe.",
            "Understand your configured risk limits.",
            "Test the workflow before using real funds.",
            "Disable automatic execution whenever you no longer want it active.",
        ],
    },
    {
        number: "13",
        title: "Review Trade History",
        description:
            "Trade History lets you review recorded trading information from the extension.",
                screenshot: "/guide/guide-step-13.png",
details: [
            "Time",
            "Asset",
            "Signal",
            "Result",
            "Profit",
            "Confidence",
        ],
    },
    {
        number: "14",
        title: "Review Today's Session",
        description:
            "Today's Session summarizes the current session using performance statistics.",
                screenshot: "/guide/guide-step-14.png",
details: [
            "Win Rate",
            "Wins",
            "Losses",
            "Profit",
            "Accuracy",
        ],
    },
];

export default function GettingStartedPage() {
    return (
        <div className="min-h-screen bg-[#050b18]">
            {/* Header */}
            <header className="border-b border-white/10 bg-[#030712]/80 px-6 py-8 backdrop-blur">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-black shadow-lg shadow-indigo-500/20">
                            S
                        </span>

                        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                            SignalForge AI
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                        Getting Started
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                        Your step-by-step visual guide to installing,
                        connecting, analyzing the market, understanding AI
                        signals, and using the SignalForge AI extension.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/download-extension"
                            className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                        >
                            Download Extension →
                        </Link>

                        <Link
                            href="/help"
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                            Help & Support
                        </Link>
                    </div>
                </div>
            </header>

            {/* Quick Start */}
            <section className="border-b border-white/10 bg-gradient-to-b from-indigo-500/[0.06] to-transparent px-6 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                            Quick Start
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-white">
                            From account to first analysis
                        </h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            ["01", "Install", "Install the Chrome extension"],
                            ["02", "Connect", "Connect to Pocket Option"],
                            ["03", "Analyze", "Run an AI market analysis"],
                            ["04", "Review", "Review the signal and data"],
                        ].map(([number, title, text]) => (
                            <div
                                key={number}
                                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                            >
                                <div className="text-xs font-bold text-indigo-400">
                                    {number}
                                </div>

                                <div className="mt-2 font-semibold text-white">
                                    {title}
                                </div>

                                <div className="mt-1 text-sm leading-5 text-slate-500">
                                    {text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guide */}
            <main className="px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                            Complete Guide
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                            Learn every part of SignalForge AI
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                            Follow each section in order. Each step includes a visual that matches the part of SignalForge AI being explained.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <article
                                key={step.number}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-[#081121] shadow-2xl shadow-black/10"
                            >
                                <div className="grid lg:grid-cols-[1fr_1.15fr]">
                                    {/* Screenshot area */}
                                    <div className="relative flex min-h-[260px] items-center justify-center border-b border-white/10 bg-[#030712] p-5 lg:border-b-0 lg:border-r">
                                        <div className="w-full">
                                            <div className="overflow-hidden rounded-2xl border border-indigo-400/20 bg-black shadow-xl shadow-indigo-500/10">
                                                <img
                                                    src={step.screenshot}
                                                    alt={`${step.title} - SignalForge AI`}
                                                    className="block h-auto w-full object-contain"
                                                />
                                            </div>

                                            <p className="mt-3 text-center text-xs font-medium text-slate-600">
                                                SignalForge AI • Step {step.number}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Explanation */}
                                    <div className="p-7 md:p-9">
                                        <div className="flex flex-wrap items-start gap-4">
                                            <span className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
                                                STEP {step.number}
                                            </span>

                                            <h3 className="flex-1 text-xl font-bold text-white md:text-2xl">
                                                {step.title}
                                            </h3>
                                        </div>

                                        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                                            {step.description}
                                        </p>

                                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                                What to do
                                            </p>

                                            <div className="space-y-3">
                                                {step.details.map(
                                                    (detail, detailIndex) => (
                                                        <div
                                                            key={detail}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-300"
                                                            >
                                                                {detailIndex +
                                                                    1}
                                                            </span>

                                                            <p className="text-sm leading-6 text-slate-300">
                                                                {detail}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {index === 7 && (
                                            <div className="mt-5 rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.05] p-5">
                                                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                                                    Signal Reference
                                                </p>

                                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                                        <p className="font-bold text-emerald-400">
                                                            CALL
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            Bullish/upward
                                                            directional signal.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                                        <p className="font-bold text-red-400">
                                                            PUT
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            Bearish/downward
                                                            directional signal.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                                        <p className="font-bold text-amber-400">
                                                            WAIT
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            No directional
                                                            entry presented.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>

            {/* Risk Notice */}
            <section className="border-t border-white/10 px-6 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-3xl border border-amber-400/10 bg-amber-400/[0.03] p-7">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                            Important Risk Notice
                        </p>

                        <h2 className="mt-2 text-lg font-bold text-white">
                            AI signals are not guarantees
                        </h2>

                        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
                            SignalForge AI provides market analysis and
                            trading assistance. Trading involves risk and can
                            result in loss of funds. AI confidence does not
                            guarantee a profitable trade. Users remain
                            responsible for their own trading decisions,
                            account settings, risk management, and use of
                            automatic execution.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="border-t border-white/10 px-6 py-12">
                <div className="mx-auto max-w-6xl rounded-3xl border border-indigo-400/10 bg-gradient-to-r from-indigo-500/[0.08] to-purple-500/[0.06] p-8 text-center md:p-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                        Ready to begin?
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                        Open SignalForge AI and start your setup
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                        Use the download page to access the subscriber
                        extension and follow this guide as you set everything
                        up.
                    </p>

                    <div className="mt-6">
                        <Link
                            href="/download-extension"
                            className="inline-flex rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                        >
                            Go to Download Extension →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}