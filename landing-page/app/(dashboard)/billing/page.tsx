"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function BillingPage() {
    const [paymentData, setPaymentData] = useState<any>(null);
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
                    throw new Error("Unable to load billing information");
                }

                return response.json();
            })
            .then((data) => {
                setPaymentData(data);
            })
            .catch(() => {
                setPaymentData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-white p-8 dark:bg-gray-950">
                <div className="mx-auto max-w-5xl">
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading billing information...
                    </p>
                </div>
            </main>
        );
    }

    const payment = paymentData?.payment;
    const subscription = paymentData?.subscription;

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
                        BILLING
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
                        Billing & Payments
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        View your payment and subscription information.
                    </p>
                </div>

                {/* Subscription */}
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        SUBSCRIPTION
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">
                        {subscription?.plan || "No Plan"}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Status: {subscription?.status || "No active subscription"}
                    </p>
                </div>

                {/* Payment */}
                <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        LATEST PAYMENT
                    </p>

                    {!payment ? (
                        <div className="mt-5">
                            <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                                No Payment Yet
                            </h2>

                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                You have not submitted a payment yet.
                            </p>

                            <Link
                                href="/#pricing"
                                className="mt-6 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                            >
                                View Plans
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Amount
                                </p>
                                <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                    {payment.currency || "USD"}{" "}
                                    {payment.amount ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Payment Method
                                </p>
                                <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                    {payment.payment_method || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Status
                                </p>
                                <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                    {payment.status || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Transaction ID
                                </p>
                                <p className="mt-1 break-all font-medium text-gray-950 dark:text-white">
                                    {payment.transaction_id || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Payment Date
                                </p>
                                <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                    {payment.created_at || "—"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8">
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