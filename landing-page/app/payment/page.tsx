"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type PaymentMethod = "stripe" | "paypal" | "zelle" | "cashapp" | "crypto";

export default function PaymentPage() {
    const [plan, setPlan] = useState("");
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("stripe");
    const [transactionId, setTransactionId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState("");

    useEffect(() => {
        const selectedPlan =
            localStorage.getItem("signalForgeSelectedPlan");

        setPlan(selectedPlan || "");
    }, []);

    const submitManualPayment = async () => {
        setPaymentError("");
        setPaymentSuccess("");

        if (!plan) {
            setPaymentError("No subscription plan selected.");
            return;
        }

        // Free plan does not require payment.
        if (plan === "free") {
            window.location.href = "/dashboard";
            return;
        }

        if (!transactionId.trim()) {
            setPaymentError("Please enter your transaction ID.");
            return;
        }
        const token = localStorage.getItem("signalForgeAuthToken");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                "https://pocket-option-signal-api-production.up.railway.app/payments/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        plan: plan,
                        amount: planPrice,
                        payment_method: paymentMethod,
                        transaction_id: transactionId.trim(),
                        crypto_currency: null,
                        network: null,
                        wallet_address: null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Payment submission failed."
                );
            }

            setPaymentSuccess(
                "Payment submitted successfully. Your payment is now pending verification."
            );

            setTransactionId("");
        } catch (error) {
            setPaymentError(
                error instanceof Error
                    ? error.message
                    : "Payment submission failed."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const planName =
        plan === "free"
            ? "Free"
            : plan === "pro"
                ? "Pro"
                : plan === "elite"
                    ? "Elite"
                    : "No Plan Selected";

    const planPrice =
        plan === "free"
            ? 0
            : plan === "pro"
                ? 39.99
                : plan === "elite"
                    ? 79.99
                    : 0;


    const planFeatures = [
        "AI Trading Signals (CALL / PUT)",
        "Chrome Extension Access",
        "Real-Time Market Analysis",
        "All Currency Pairs",
        "AI Confidence Insights",
        "Trade History & Analytics",
        "Priority Support",
    ];

    const paymentMethods = [
        {
            id: "stripe" as PaymentMethod,
            name: "Stripe",
            icon: "S",
            description: "Pay securely with a credit or debit card.",
            manual: false,
        },
        {
            id: "paypal" as PaymentMethod,
            name: "PayPal",
            icon: "P",
            description: "Pay securely using your PayPal account.",
            manual: false,
        },
        {
            id: "zelle" as PaymentMethod,
            name: "Zelle",
            icon: "Z",
            description: "Send payment through Zelle.",
            manual: true,
        },
        {
            id: "cashapp" as PaymentMethod,
            name: "Cash App",
            icon: "$",
            description: "Send payment through Cash App.",
            manual: true,
        },
        {
            id: "crypto" as PaymentMethod,
            name: "Crypto",
            icon: "₿",
            description: "Pay with supported cryptocurrency.",
            manual: true,
        },
    ];

    return (
        <main className="min-h-screen bg-[#f8f9ff] text-gray-950">
            {/* HEADER */}
            <header className="border-b border-white/10 bg-[#0b1224] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-end justify-center gap-1 rounded-xl bg-indigo-600 p-2">
                            <span className="h-3 w-1.5 rounded-sm bg-white" />
                            <span className="h-5 w-1.5 rounded-sm bg-white" />
                            <span className="h-7 w-1.5 rounded-sm bg-white" />
                        </div>

                        <div>
                            <div className="text-lg font-bold">
                                {siteConfig.name}
                            </div>
                            <div className="text-[9px] font-semibold tracking-[0.18em] text-gray-400">
                                TRADE SMARTER. POWERED BY AI.
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* PAGE */}
            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">

                {/* BACK */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                    ← Back to Dashboard
                </Link>

                {/* TITLE */}
                <div className="mx-auto mt-8 max-w-3xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Payment
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        Complete Your Subscription
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Choose your payment method and complete your
                        {plan ? ` ${planName} plan` : " subscription"}.
                    </p>
                </div>

                {/* STEPS */}
                <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center">
                    <div className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                                1
                            </div>
                            <span className="mt-2 text-xs font-semibold text-indigo-600">
                                Select Plan
                            </span>
                        </div>

                        <div className="mx-3 h-px w-16 bg-indigo-600 sm:w-24" />

                        <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                                2
                            </div>
                            <span className="mt-2 text-xs font-semibold text-indigo-600">
                                Payment
                            </span>
                        </div>

                        <div className="mx-3 h-px w-16 bg-gray-300 sm:w-24" />

                        <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-500">
                                3
                            </div>
                            <span className="mt-2 text-xs font-semibold text-gray-400">
                                Activation
                            </span>
                        </div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="mt-12 grid gap-6 lg:grid-cols-[300px_1fr_360px]">

                    {/* LEFT - SUBSCRIPTION SUMMARY */}
                    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Subscription Summary
                        </h2>

                        <div className="mt-5 overflow-hidden rounded-2xl bg-[#111b35] text-white">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">
                                        {planName} Plan
                                    </h3>

                                    {plan && (
                                        <span className="rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-bold uppercase">
                                            Selected
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-gray-300">
                                    Full access to SignalForge AI features.
                                </p>

                                <div className="mt-6">
                                    <span className="text-3xl font-bold">
                                        ${planPrice}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-300">
                                        / month
                                    </span>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {planFeatures.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-start gap-2 text-sm text-gray-200"
                                        >
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                                                ✓
                                            </span>

                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 p-5">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Billing Cycle</span>
                                    <span>Monthly</span>
                                </div>

                                <div className="mt-3 flex justify-between text-sm text-gray-300">
                                    <span>Plan Price</span>
                                    <span>${planPrice}</span>
                                </div>

                                <div className="mt-5 flex justify-between border-t border-white/10 pt-5">
                                    <span className="font-bold">
                                        Total Today
                                    </span>

                                    <span className="text-xl font-bold">
                                        ${planPrice}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                            <div className="flex gap-3">
                                <div className="text-xl">🔒</div>

                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        Secure & Safe
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-600">
                                        Your payment information is handled
                                        securely.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CENTER - PAYMENT METHODS */}
                    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-bold">
                            Choose Payment Method
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Select how you want to pay for your SignalForge AI
                            subscription.
                        </p>
                        <div className="mt-6 space-y-3">
                            {plan === "free" ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                    <h3 className="font-bold text-emerald-900">
                                        Free Plan
                                    </h3>

                                    <p className="mt-2 text-sm text-emerald-700">
                                        No payment is required.
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-emerald-800">
                                        3 total trades included
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.location.href = "/dashboard";
                                        }}
                                        className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                                    >
                                        Activate Free Plan
                                    </button>
                                </div>
                            ) : (
                                paymentMethods.map((method) => {
                                    const selected =
                                        paymentMethod === method.id;

                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod(method.id)
                                            }
                                            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${selected
                                                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                                                : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${method.id === "cashapp"
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : method.id === "crypto"
                                                        ? "bg-orange-100 text-orange-600"
                                                        : "bg-indigo-100 text-indigo-600"
                                                    }`}
                                            >
                                                {method.icon}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">
                                                        {method.name}
                                                    </h3>

                                                    {method.manual && (
                                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold uppercase text-gray-500">
                                                            Manual
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {method.description}
                                                </p>
                                            </div>

                                            <div
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected
                                                    ? "border-indigo-600"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {selected && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                                )}
                                            </div>
                                        </button>
                                    );

                                })
                            )
                            }
                        </div>
                    </section>

                    {/* RIGHT - PAYMENT DETAILS */}
                    <section className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-5 shadow-sm">
                        {paymentMethod === "stripe" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
                                        S
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Pay with Stripe
                                        </h2>
                                        <span className="text-xs font-semibold text-indigo-600">
                                            Secure Card Payment
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-gray-600">
                                    Stripe will securely process your credit or
                                    debit card payment.
                                </p>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Amount
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-indigo-600">
                                        ${planPrice}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {planName} Plan · Monthly
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled
                                    className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white opacity-50"
                                >
                                    Continue to Stripe
                                </button>

                                <p className="mt-3 text-center text-xs text-gray-500">
                                    Stripe integration will be connected when
                                    your Stripe account is ready.
                                </p>
                            </>
                        )}

                        {paymentMethod === "paypal" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-600">
                                        P
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Pay with PayPal
                                        </h2>
                                        <span className="text-xs font-semibold text-indigo-600">
                                            Secure PayPal Payment
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-gray-600">
                                    Pay securely using your PayPal account.
                                </p>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Amount
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-indigo-600">
                                        ${planPrice}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {planName} Plan · Monthly
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled
                                    className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white opacity-50"
                                >
                                    Continue to PayPal
                                </button>

                                <p className="mt-3 text-center text-xs text-gray-500">
                                    PayPal integration will be connected later.
                                </p>
                            </>
                        )}

                        {paymentMethod === "zelle" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-xl font-bold text-white">
                                        Z
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Pay with Zelle
                                        </h2>

                                        <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-bold uppercase text-purple-600">
                                            Manual Verification
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-gray-600">
                                    Send your payment through Zelle. After
                                    sending the payment, you will submit your
                                    transaction information for verification.
                                </p>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Send Exactly
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-indigo-600">
                                        ${planPrice}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {planName} Plan · Monthly
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
                                    <h3 className="font-bold">
                                        Zelle Information
                                    </h3>

                                    <div className="mt-4 space-y-3 text-sm">
                                        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                                            <span className="text-gray-500">
                                                Zelle Email
                                            </span>

                                            <span className="font-semibold text-right">
                                                lens9798@gmail.com
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-500">
                                                Zelle Phone
                                            </span>

                                            <span className="font-semibold text-right">
                                                +1 (445) 248-00-31
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                                    <p className="text-sm font-bold text-indigo-900">
                                        Important
                                    </p>

                                    <ul className="mt-2 space-y-1 text-xs leading-5 text-gray-600">
                                        <li>• Send the exact amount.</li>
                                        <li>• Include “SignalForge AI” in the note.</li>
                                        <li>• Keep your payment confirmation.</li>
                                        <li>• Payment must be verified before activation.</li>
                                    </ul>
                                </div>

                                <label className="mt-5 block">
                                    <span className="text-sm font-bold">
                                        Zelle Transaction ID
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your Zelle confirmation number"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        disabled={submitting}
                                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={submitManualPayment}
                                    disabled={submitting}
                                    className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Payment for Verification"}
                                </button>
                                {paymentError && (
                                    <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                                        {paymentError}
                                    </p>
                                )}

                                {paymentSuccess && (
                                    <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-600">
                                        {paymentSuccess}
                                    </p>
                                )}
                            </>
                        )}

                        {paymentMethod === "cashapp" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-xl font-bold text-white">
                                        $
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Pay with Cash App
                                        </h2>

                                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-600">
                                            Manual Verification
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-gray-600">
                                    Send your payment through Cash App. After
                                    payment, submit your transaction details
                                    for verification.
                                </p>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Send Exactly
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-indigo-600">
                                        ${planPrice}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {planName} Plan · Monthly
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
                                    <h3 className="font-bold">
                                        Cash App Information
                                    </h3>

                                    <div className="mt-4 flex justify-between gap-4 text-sm">
                                        <span className="text-gray-500">
                                            Cashtag
                                        </span>

                                        <span className="font-semibold">
                                            $signalforgeai
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                                    <p className="text-sm font-bold text-indigo-900">
                                        Important
                                    </p>

                                    <ul className="mt-2 space-y-1 text-xs leading-5 text-gray-600">
                                        <li>• Send the exact amount.</li>
                                        <li>• Include “SignalForge AI” in the note.</li>
                                        <li>• Keep your payment confirmation.</li>
                                        <li>• Payment must be verified before activation.</li>
                                    </ul>
                                </div>

                                <label className="mt-5 block">
                                    <span className="text-sm font-bold">
                                        Cash App Transaction ID
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your Cash App transaction ID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        disabled={submitting}
                                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={submitManualPayment}
                                    disabled={submitting}
                                    className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Payment for Verification"}
                                </button>
                                {paymentError && (
                                    <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                                        {paymentError}
                                    </p>
                                )}

                                {paymentSuccess && (
                                    <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-600">
                                        {paymentSuccess}
                                    </p>
                                )}
                            </>
                        )}

                        {paymentMethod === "crypto" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl font-bold text-white">
                                        ₿
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Pay with Crypto
                                        </h2>

                                        <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase text-orange-600">
                                            Manual Verification
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-gray-600">
                                    Cryptocurrency payment details will be
                                    displayed here when crypto payments are
                                    configured.
                                </p>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Subscription Amount
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-indigo-600">
                                        ${planPrice}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {planName} Plan · Monthly
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                                    <p className="text-sm font-bold text-orange-900">
                                        Crypto Payment
                                    </p>

                                    <div className="mt-4 space-y-3 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-600">
                                                Currency
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                USDT
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-gray-600">
                                                Network
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                TRON (TRC20)
                                            </span>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-xs font-semibold text-gray-600">
                                                USDT TRC20 Receiving Address
                                            </p>

                                            <div className="mt-2 break-all rounded-xl border border-orange-200 bg-white p-3 text-xs font-semibold text-gray-900">
                                                TAfi1DT2NxSSizkAGbmKhSpaxtsWX9T8kt
                                            </div>
                                        </div>

                                        <p className="text-xs leading-5 text-gray-600">
                                            Send USDT using the TRON (TRC20) network only.
                                            Do not send USDT through another network.
                                        </p>
                                    </div>
                                </div>
                                <label className="mt-5 block">
                                    <span className="text-sm font-bold">
                                        Crypto Transaction ID
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your USDT transaction ID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        disabled={submitting}
                                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={submitManualPayment}
                                    disabled={submitting}
                                    className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Payment for Verification"}
                                </button>

                                {paymentError && (
                                    <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                                        {paymentError}
                                    </p>
                                )}

                                {paymentSuccess && (
                                    <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-600">
                                        {paymentSuccess}
                                    </p>
                                )}
                            </>
                        )}
                    </section>
                </div>

                {/* BOTTOM INFO */}
                <div className="mt-10 grid gap-4 text-center sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <div className="text-2xl">⚡</div>
                        <p className="mt-2 font-bold">Fast Activation</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Your subscription is activated after payment
                            verification.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <div className="text-2xl">🔐</div>
                        <p className="mt-2 font-bold">Secure Payments</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Payment information is handled securely.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <div className="text-2xl">💬</div>
                        <p className="mt-2 font-bold">Need Help?</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Contact SignalForge AI support if you need help.
                        </p>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="mt-12 border-t border-gray-200 bg-[#0b1224] px-6 py-8 text-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
                    <div>
                        <div className="font-bold">{siteConfig.name}</div>
                        <div className="mt-1 text-xs text-gray-400">
                            TRADE SMARTER. POWERED BY AI.
                        </div>
                    </div>

                    <div className="text-xs text-gray-400">
                        © 2026 SignalForge AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    );
}