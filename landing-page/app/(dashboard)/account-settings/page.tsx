"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function AccountSettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("signalForgeAuthToken");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        fetch(
            "https://pocket-option-signal-api-production.up.railway.app/auth/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Session expired");
                }

                return response.json();
            })
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                localStorage.removeItem("signalForgeAuthToken");
                localStorage.removeItem("signalForgeUser");
                window.location.href = "/login";
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
                        Loading account...
                    </p>
                </div>
            </main>
        );
    }

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
                        ACCOUNT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
                        Account Settings
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        View and manage your SignalForge AI account.
                    </p>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                        Account Information
                    </h2>

                    <div className="mt-6 space-y-5">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Email
                            </p>

                            <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                {user?.email || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Account Status
                            </p>

                            <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                Active
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Account ID
                            </p>

                            <p className="mt-1 font-medium text-gray-950 dark:text-white">
                                {user?.id || "—"}
                            </p>
                        </div>
                    </div>
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