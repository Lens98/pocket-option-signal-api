"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function SignupForm() {
    const searchParams = useSearchParams();
    const selectedPlan = searchParams.get("plan") || "";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const planName =
        selectedPlan === "pro"
            ? "Pro"
            : selectedPlan === "elite"
                ? "Elite"
                : selectedPlan === "free"
                    ? "Free"
                    : "";

    return (
        <main className="min-h-screen bg-[#030712] text-white">
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
                {/* Background glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl"
                />

                <div className="relative w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-black text-white shadow-lg shadow-indigo-500/20">
                                S
                            </span>

                            <span className="text-xl font-bold tracking-tight">
                                SignalForge{" "}
                                <span className="text-indigo-400">AI</span>
                            </span>
                        </a>
                    </div>

                    {/* Signup card */}
                    <div className="rounded-3xl border border-white/10 bg-[#0a1120]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                        <div className="text-center">
                            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-6 w-6 text-purple-400"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19a6 6 0 0 0-12 0"
                                    />
                                    <circle cx="9" cy="7" r="4" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 8v6M16 11h6"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Create your account
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Create your SignalForge AI account and get
                                started.
                            </p>

                            {selectedPlan && (
                                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                    Selected plan: {planName}
                                </div>
                            )}
                        </div>

                        <form
                            className="mt-8 space-y-5"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setError("");
                                setLoading(true);

                                try {
                                    const response = await fetch(
                                        "https://api.signalforgepro.app/auth/register",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                email,
                                                password,
                                            }),
                                        }
                                    );

                                    const data = await response.json();

                                    if (!response.ok) {
                                        throw new Error(
                                            data.detail ||
                                            "Unable to create account."
                                        );
                                    }

                                    localStorage.setItem(
                                        "signalForgeSelectedPlan",
                                        selectedPlan
                                    );

                                    if (selectedPlan) {
                                        window.location.href = `/payment?plan=${selectedPlan}`;
                                    } else {
                                        window.location.href = "/login";
                                    }
                                } catch (err) {
                                    setError(
                                        err instanceof Error
                                            ? err.message
                                            : "Unable to create account."
                                    );
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-200"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/10"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-200"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/10"
                                    placeholder="Create a password"
                                />
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs text-slate-600">
                                SIGNALFORGE AI
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <p className="text-center text-sm text-slate-400">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                            >
                                Log in
                            </a>
                        </p>
                    </div>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-600">
                        Trading involves risk. SignalForge AI does not
                        guarantee profits.
                    </p>

                    <div className="mt-5 text-center">
                        <a
                            href="/"
                            className="text-xs font-medium text-slate-600 transition hover:text-slate-300"
                        >
                            ← Back to SignalForge AI
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <SignupForm />
        </Suspense>
    );
}