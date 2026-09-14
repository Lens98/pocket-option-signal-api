import { siteConfig } from "@/config/site";

function ExtensionPreview() {
  const chartBars = [32, 44, 38, 52, 45, 62, 55, 72, 66, 82, 74, 92];

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Glow */}
      <div className="absolute -inset-8 rounded-[3rem] bg-blue-600/20 blur-3xl" />

      {/* Extension window */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-[#0b1428] shadow-2xl shadow-blue-950/50">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-black text-white">
              S
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                SignalForge AI
              </div>
              <div className="text-[9px] text-slate-500">
                Version 4.0 Professional
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>

            <div className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-400">
              ⚙
            </div>
          </div>
        </div>

        {/* Main panels */}
        <div className="grid gap-3 p-3 sm:grid-cols-12">
          {/* Market */}
          <div className="rounded-xl border border-blue-300/10 bg-[#111d35] p-3 sm:col-span-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-blue-200">
                📈 Live Market
              </span>
              <span className="text-[9px] font-semibold text-emerald-400">
                ● LIVE
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-base font-bold text-white">
                  EURUSD_otc
                </div>
                <div className="mt-1 text-[9px] text-slate-500">
                  OTC Market
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-emerald-400">
                  1.15140
                </div>
                <div className="text-[8px] text-emerald-400">
                  BULLISH
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-4 flex h-32 items-end gap-1 rounded-lg border border-white/5 bg-[#091224] p-3">
              {chartBars.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-400/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="mt-3 flex gap-1.5">
              {["1m", "5m", "15m", "1H"].map((time, index) => (
                <span
                  key={time}
                  className={`rounded-md px-2 py-1 text-[9px] font-semibold ${index === 0
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-slate-400"
                    }`}
                >
                  {time}
                </span>
              ))}
            </div>
          </div>

          {/* AI Signal */}
          <div className="rounded-xl border border-blue-300/10 bg-[#111d35] p-3 sm:col-span-4">
            <div className="text-[10px] font-semibold text-blue-200">
              🤖 AI Signal
            </div>

            <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-[10px] font-bold text-white shadow-lg shadow-blue-900/30">
              ANALYZE MARKET
            </button>

            <div className="mt-4 text-center">
              <div className="text-4xl font-black tracking-tight text-emerald-400">
                CALL
              </div>

              <div className="mt-1 text-xl font-bold text-white">
                87%
              </div>

              <div className="text-[8px] uppercase tracking-widest text-slate-500">
                Example Confidence
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between rounded-lg border border-white/10 px-3 py-2 text-[10px]">
                <span className="text-slate-400">Trend</span>
                <span className="font-semibold text-emerald-400">
                  BULLISH
                </span>
              </div>

              <div className="flex justify-between rounded-lg border border-white/10 px-3 py-2 text-[10px]">
                <span className="text-slate-400">Risk</span>
                <span className="font-semibold text-emerald-400">LOW</span>
              </div>
            </div>
          </div>

          {/* Timer / Analysis */}
          <div className="space-y-3 sm:col-span-4">
            <div className="rounded-xl border border-blue-300/10 bg-[#111d35] p-3">
              <div className="text-[10px] font-semibold text-blue-200">
                ⏱ Entry Timer
              </div>

              <div className="mt-5 text-center text-3xl font-black text-white">
                00:39
              </div>

              <div className="mt-2 text-center text-[8px] uppercase tracking-widest text-slate-500">
                Next Candle Entry
              </div>
            </div>

            <div className="rounded-xl border border-blue-300/10 bg-[#111d35] p-3">
              <div className="text-[10px] font-semibold text-pink-300">
                🧠 AI Analysis
              </div>

              <div className="mt-3 space-y-2">
                {[
                  "EMA20 Above EMA50",
                  "EMA200 Bullish Alignment",
                  "Bullish RSI Momentum",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[9px] text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade history */}
          <div className="rounded-xl border border-blue-300/10 bg-[#111d35] p-3 sm:col-span-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-blue-200">
                📜 Trade History
              </span>
              <span className="text-[9px] text-slate-500">
                Recent Trades
              </span>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-white/5">
              <div className="grid grid-cols-5 bg-white/[0.03] px-2 py-2 text-[8px] font-semibold text-slate-500">
                <span>TIME</span>
                <span>ASSET</span>
                <span>SIGNAL</span>
                <span>RESULT</span>
                <span>CONF.</span>
              </div>

              {[
                ["3:36 PM", "EURUSD", "CALL", "WAIT", "87%"],
                ["3:31 PM", "EURUSD", "PUT", "WAIT", "82%"],
                ["3:26 PM", "EURUSD", "CALL", "WAIT", "91%"],
              ].map((row) => (
                <div
                  key={row[0]}
                  className="grid grid-cols-5 border-t border-white/5 px-2 py-2 text-[8px] text-slate-300"
                >
                  <span>{row[0]}</span>
                  <span>{row[1]}</span>
                  <span
                    className={
                      row[2] === "CALL"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {row[2]}
                  </span>
                  <span className="text-slate-500">{row[3]}</span>
                  <span>{row[4]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session */}
          <div className="rounded-xl border border-blue-300/10 bg-[#111d35] p-3 sm:col-span-4">
            <div className="text-[10px] font-semibold text-blue-200">
              📊 Today's Session
            </div>

            <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] text-slate-400">
                Win Rate
              </span>
              <span className="text-2xl font-black text-emerald-400">
                —
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/10 p-2 text-center">
                <div className="text-[8px] text-slate-500">WINS</div>
                <div className="mt-1 text-sm font-bold text-white">—</div>
              </div>

              <div className="rounded-lg border border-white/10 p-2 text-center">
                <div className="text-[8px] text-slate-500">LOSSES</div>
                <div className="mt-1 text-sm font-bold text-white">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="relative overflow-hidden bg-[#050b18] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-[32rem] w-[32rem] rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-black shadow-lg shadow-blue-900/30">
            S
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight">
              SignalForge AI
            </div>
            <div className="text-[9px] uppercase tracking-widest text-slate-500">
              Trade smarter. Powered by AI.
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
          <a href="#faq" className="transition hover:text-white">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5 sm:inline-flex"
          >
            Log In
          </a>

          <a
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:scale-[1.02]"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left */}
          <div className="lg:col-span-5">
            <a
              href={hero.announcement.href}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {hero.announcement.label}
              <span>→</span>
            </a>

            <h1 className="mt-7 max-w-xl text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Trade Smarter
              <br />
              with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Real-time market analysis and AI-powered trading signals
              directly in your browser.
            </p>

            <div className="mt-7 space-y-3 text-sm text-slate-300">
              {[
                "AI market analysis — CALL / PUT / WAIT",
                "Works directly with your trading platform",
                "Manual or automatic trading modes",
                "Track signals and trade performance",
                "Simple setup with Chrome",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={hero.primaryCta.href}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/30 transition hover:scale-[1.02]"
              >
                🚀 {hero.primaryCta.label}
              </a>

              <a
                href={hero.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                {hero.secondaryCta.label}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-5 text-xs text-slate-500">
              <span>🔒 Secure</span>
              <span>⚡ Easy Setup</span>
              <span>🌐 Chrome Extension</span>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-7">
            <ExtensionPreview />
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="relative z-10 border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-xs text-slate-500 lg:px-10">
          <span>REAL-TIME ANALYSIS</span>
          <span>AI SIGNALS</span>
          <span>CALL / PUT / WAIT</span>
          <span>TRADE HISTORY</span>
          <span>MANUAL + AUTO MODE</span>
        </div>
      </div>
    </section>
  );
}