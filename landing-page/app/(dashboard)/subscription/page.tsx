"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

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
            <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-950">
                <div className="mx-auto max-w-6xl">
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading subscription...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="flex min-h-screen">

                {/* Main */}
                <main className="flex-1 p-6 md:p-10">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-10">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Subscription
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
                                Your Subscription
                            </h1>

                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Manage your SignalForge AI subscription.
                            </p>
                        </div>

                        {!subscription ? (
                            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="max-w-2xl">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        CURRENT PLAN
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold text-gray-950 dark:text-white">
                                        No Plan
                                    </h2>

                                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                                        You do not have an active SignalForge AI
                                        subscription yet.
                                    </p>

                                    <Link
                                        href="/#pricing"
                                        className="mt-6 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                                    >
                                        View Plans
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        CURRENT PLAN
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold text-gray-950 dark:text-white">
                                        {subscription.plan || "Unknown"}
                                    </h2>

                                    <p className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        {subscription.status || "Unknown"}
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        SUBSCRIPTION DATES
                                    </p>

                                    <div className="mt-5 space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Started
                                            </p>
                                            <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                                {subscription.started_at || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Expires
                                            </p>
                                            <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                                {subscription.expires_at || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}