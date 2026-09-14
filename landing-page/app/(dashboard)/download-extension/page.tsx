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
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-5xl px-6 py-16">
                {/* Header */}
                <div className="text-center">
                    <Link
                        href="/dashboard"
                        className="text-xl font-bold text-gray-950 dark:text-white"
                    >
                        {siteConfig.name}
                    </Link>

                    <p className="mt-10 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        CHROME EXTENSION
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
                        Install SignalForge AI
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                        Use the SignalForge AI Chrome extension to access
                        AI-powered market analysis and trading signals directly
                        in your browser.
                    </p>
                </div>

                {/* Main Card */}
                <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-950 text-3xl font-bold text-white dark:bg-white dark:text-gray-950">
                            SF
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-gray-950 dark:text-white">
                            SignalForge AI Chrome Extension
                        </h2>

                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                            Your AI-powered trading analysis dashboard, right
                            inside Chrome.
                        </p>

                        {loading ? (
                            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                                Checking subscription...
                            </p>
                        ) : subscription?.status === "active" ? (
                            <a
                                href="/extension.zip"
                                download
                                className="mt-8 inline-flex rounded-full bg-gray-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                            >
                                Download Extension
                            </a>
                        ) : (
                            <div className="mt-8">
                                <div className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    🔒 Extension Locked
                                </div>

                                <Link
                                    href="/#pricing"
                                    className="inline-flex rounded-full bg-gray-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                                >
                                    Choose a Plan
                                </Link>
                            </div>
                        )}

                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                            Chrome extension installation will be connected
                            here when the final extension package is ready.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-950 dark:text-white">
                            AI Signals
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Receive CALL, PUT, or WAIT market signals.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-950 dark:text-white">
                            Real-Time Analysis
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Analyze current market conditions directly in your
                            browser.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-950 dark:text-white">
                            Simple Dashboard
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            View signals, analysis, and trading information in
                            one place.
                        </p>
                    </div>
                </div>

                {/* Back */}
                <div className="mt-12 text-center">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}