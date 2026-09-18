"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
            <main className="min-h-screen bg-[#050b18] p-8 text-white">
                <div className="mx-auto max-w-5xl">
                    <div className="animate-pulse text-sm text-slate-500">
                        Loading billing information...
                    </div>
                </div>
            </main>
        );
    }

    const payment = paymentData?.payment;
    const subscription = paymentData?.subscription;

    const isActive = subscription?.status === "active";

    return (
        <main className="min-h-screen bg-[#050b18] text-white">
            <div className="relative overflow-hidden">
                {/* Background glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl px-6 py-10 lg:px-10">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            Billing
                        </div>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Billing & Payments
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            View your payment and subscription information.
                        </p>
                    </div>

                    {/* Subscription */}
                    <div
                        className={`rounded-3xl border p-7 ${isActive
                            ? "border-emerald-400/20 bg-emerald-500/[0.04]"
                            : "border-white/10 bg-white/[0.03]"
                            }`}
                    >
                        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Current Subscription
                                </p>

                                <h2 className="mt-3 text-3xl font-bold capitalize">
                                    {subscription?.plan || "No Plan"}
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    {isActive
                                        ? "Your SignalForge AI subscription is active."
                                        : "No active subscription."}
                                </p>
                            </div>

                            <div
                                className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider sm:self-auto ${isActive
                                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
                                    : "border-white/10 bg-white/[0.04] text-slate-400"
                                    }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${isActive
                                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                                        : "bg-slate-500"
                                        }`}
                                />

                                {subscription?.status || "Inactive"}
                            </div>
                        </div>

                        {subscription?.expires_at && (
                            <div className="mt-7 border-t border-white/10 pt-6">
                                <p className="text-xs uppercase tracking-widest text-slate-600">
                                    Subscription Expires
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-300">
                                    {new Date(
                                        subscription.expires_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Latest Payment */}
                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Latest Payment
                        </p>

                        {!payment ? (
                            <div className="mt-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="h-6 w-6 text-indigo-400"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 7h18M5 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                                        />
                                    </svg>
                                </div>

                                <h2 className="mt-5 text-xl font-bold">
                                    No Payment Yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    You have not submitted a payment yet.
                                </p>

                                <Link
                                    href="/#pricing"
                                    className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-purple-500"
                                >
                                    View Plans
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                                <div className="bg-[#080f1d] p-5">
                                    <p className="text-xs uppercase tracking-wider text-slate-600">
                                        Amount
                                    </p>
                                    <p className="mt-2 font-semibold text-white">
                                        {payment.currency || "USD"}{" "}
                                        {payment.amount ?? "—"}
                                    </p>
                                </div>

                                <div className="bg-[#080f1d] p-5">
                                    <p className="text-xs uppercase tracking-wider text-slate-600">
                                        Payment Method
                                    </p>
                                    <p className="mt-2 font-semibold capitalize text-white">
                                        {payment.payment_method || "—"}
                                    </p>
                                </div>

                                <div className="bg-[#080f1d] p-5">
                                    <p className="text-xs uppercase tracking-wider text-slate-600">
                                        Status
                                    </p>
                                    <p className="mt-2 font-semibold capitalize text-emerald-400">
                                        {payment.status || "—"}
                                    </p>
                                </div>

                                <div className="bg-[#080f1d] p-5">
                                    <p className="text-xs uppercase tracking-wider text-slate-600">
                                        Transaction ID
                                    </p>
                                    <p className="mt-2 break-all font-semibold text-white">
                                        {payment.transaction_id || "—"}
                                    </p>
                                </div>

                                <div className="bg-[#080f1d] p-5 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-wider text-slate-600">
                                        Payment Date
                                    </p>
                                    <p className="mt-2 font-semibold text-white">
                                        {payment.created_at
                                            ? new Date(
                                                payment.created_at
                                            ).toLocaleString()
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-slate-500 transition hover:text-white"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}