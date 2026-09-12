import { siteConfig } from "@/config/site";

export const metadata = {
    title: `Log In — ${siteConfig.name}`,
    description: `Log in to your ${siteConfig.name} account.`,
};

export default function LoginPage() {
    return (
        <main className="mx-2 mt-2 lg:mx-4">
            <div className="gradient-mesh flex min-h-[calc(100vh-1rem)] items-center justify-center rounded-[2.5rem] px-6 py-20">
                <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                            Welcome back
                        </h1>

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            Log in to your SignalForge AI account.
                        </p>
                    </div>

                    <form className="mt-8 space-y-5">
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
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                            Log In
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Create an account
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