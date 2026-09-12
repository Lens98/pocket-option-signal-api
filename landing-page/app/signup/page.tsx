"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <main className="mx-2 mt-2 lg:mx-4">
            <div className="gradient-mesh flex min-h-[calc(100vh-1rem)] items-center justify-center rounded-[2.5rem] px-6 py-20">
                <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                            Create your account
                        </h1>

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            Create your SignalForge AI subscriber account to get started.
                        </p>
                    </div>

                    <form
                        className="mt-8 space-y-5"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError("");
                            setLoading(true);

                            try {
                                const response = await fetch(
                                    "https://pocket-option-signal-api-production.up.railway.app/auth/register",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            email,
                                            password,
                                        }),
                                    }
                                );

                                const data = await response.json();

                                if (!response.ok) {
                                    throw new Error(data.detail || "Unable to create account.");
                                }

                                window.location.href = "/login";
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
                                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                placeholder="Create a password"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Log in
                        </a>
                    </p>

                    <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-500">
                        Trading involves risk. SignalForge AI does not guarantee profits.
                    </p>
                </div>
            </div>
        </main>
    );
}