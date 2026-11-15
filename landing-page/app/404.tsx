export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#050b18] px-6 text-white">
            <div className="text-center">
                <div className="text-6xl font-black text-indigo-400">404</div>

                <h1 className="mt-4 text-2xl font-bold">
                    Page Not Found
                </h1>

                <p className="mt-3 text-slate-400">
                    The page you are looking for does not exist.
                </p>

                <a
                    href="/dashboard"
                    className="mt-6 inline-flex rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                    Back to Dashboard
                </a>
            </div>
        </main>
    );
}