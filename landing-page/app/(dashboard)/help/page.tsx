"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HelpPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="mb-10">
                    <Link
                        href="/dashboard"
                        className="text-xl font-bold text-gray-950 dark:text-white"
                    >
                        {siteConfig.name}
                    </Link>

                    <p className="mt-10 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        SUPPORT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
                        Help & Support
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Get help with your SignalForge AI account and extension.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                            Getting Started
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Learn how to use your SignalForge AI account,
                            subscription, and Chrome extension.
                        </p>

                        <Link
                            href="/download-extension"
                            className="mt-6 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                            Extension Guide
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                            Frequently Asked Questions
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Find answers about SignalForge AI, subscriptions,
                            signals, and using the extension.
                        </p>

                        <Link
                            href="/#faq"
                            className="mt-6 inline-flex rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                        >
                            View FAQ
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                            Account & Billing
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Check your account information, subscription, and
                            payment details.
                        </p>

                        <Link
                            href="/billing"
                            className="mt-6 inline-flex rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                        >
                            Billing & Payments
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                            Need More Help?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            If you need assistance with your account or
                            SignalForge AI, contact our support team.
                        </p>

                        <a
                            href="mailto:support@signalforge.ai"
                            className="mt-6 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>

                <div className="mt-10">
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