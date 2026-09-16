import { siteConfig, type Feature } from "@/config/site";
import { Reveal } from "@/components/Reveal";

function MarketVisual() {
  const candles = [
    35, 48, 42, 58, 45, 65, 55, 72, 62, 82, 70, 91, 78, 88,
  ];

  return (
    <div className="h-full rounded-2xl border border-blue-400/10 bg-[#0a1428] p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold text-blue-200">
            📈 Live Market
          </div>
          <div className="mt-2 text-lg font-bold text-white">
            EURUSD_otc
          </div>
          <div className="text-[9px] text-slate-500">OTC Market</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-emerald-400">
            1.15140
          </div>
          <div className="text-[8px] text-emerald-400">
            ● BULLISH
          </div>
        </div>
      </div>

      <div className="mt-4 flex h-32 items-end gap-1 rounded-xl border border-white/5 bg-[#071020] px-3 pb-3 pt-5">
        {candles.map((height, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-sm ${index % 3 === 0
              ? "bg-emerald-400"
              : "bg-gradient-to-t from-blue-600 to-cyan-400"
              }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[9px] font-bold text-white">
          1m
        </span>
        <span className="rounded-md bg-white/5 px-2.5 py-1 text-[9px] text-slate-400">
          5m
        </span>
        <span className="rounded-md bg-white/5 px-2.5 py-1 text-[9px] text-slate-400">
          15m
        </span>
        <span className="rounded-md bg-white/5 px-2.5 py-1 text-[9px] text-slate-400">
          1H
        </span>
      </div>
    </div>
  );
}

function SignalVisual() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-blue-400/10 bg-[#0a1428] p-4">
      <div className="text-[10px] font-semibold text-blue-200">
        🤖 AI Signal
      </div>

      <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-[10px] font-bold text-white shadow-lg shadow-blue-900/30">
        ANALYZE MARKET
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-5xl font-black tracking-tight text-emerald-400">
          CALL
        </div>

        <div className="mt-2 text-2xl font-black text-white">
          87%
        </div>

        <div className="text-[9px] uppercase tracking-widest text-slate-500">
          Confidence
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 px-3 py-2">
            <div className="text-[8px] text-slate-500">TREND</div>
            <div className="mt-1 text-[10px] font-bold text-emerald-400">
              BULLISH
            </div>
          </div>

          <div className="rounded-lg border border-white/10 px-3 py-2">
            <div className="text-[8px] text-slate-500">RISK</div>
            <div className="mt-1 text-[10px] font-bold text-emerald-400">
              LOW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisVisual() {
  const indicators = [
    ["EMA Trend", "✓ Bullish", "A+"],
    ["RSI", "✓ Momentum", "Strong"],
    ["MACD", "✓ Bearish", "Weak"],
  ];

  return (
    <div className="h-full rounded-2xl border border-blue-400/10 bg-[#0a1428] p-4">
      <div className="mb-4 text-[10px] font-semibold text-pink-300">
        🧠 AI Analysis
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-3 bg-[#15233d] px-3 py-3 text-[8px] font-bold text-blue-200">
          <span>INDICATOR</span>
          <span>STATUS</span>
          <span>STRENGTH</span>
        </div>

        {indicators.map(([name, status, strength]) => (
          <div
            key={name}
            className="grid grid-cols-3 border-t border-white/5 px-3 py-3 text-[9px]"
          >
            <span className="text-slate-300">{name}</span>
            <span
              className={
                status.includes("Bearish")
                  ? "text-red-400"
                  : "text-emerald-400"
              }
            >
              {status}
            </span>
            <span className="text-slate-300">{strength}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryVisual() {
  const trades = [
    ["3:36 PM", "EURUSD", "CALL", "87%"],
    ["3:31 PM", "EURUSD", "PUT", "82%"],
    ["3:26 PM", "EURUSD", "CALL", "91%"],
    ["3:24 PM", "EURUSD", "WAIT", "96%"],
  ];

  return (
    <div className="h-full rounded-2xl border border-blue-400/10 bg-[#0a1428] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-blue-200">
          📜 Trade History
        </span>

        <span className="text-[9px] text-slate-500">
          Recent Signals
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-4 bg-[#15233d] px-3 py-3 text-[8px] font-bold text-blue-200">
          <span>TIME</span>
          <span>ASSET</span>
          <span>SIGNAL</span>
          <span>CONF.</span>
        </div>

        {trades.map(([time, asset, signal, confidence]) => (
          <div
            key={`${time}-${signal}`}
            className="grid grid-cols-4 border-t border-white/5 px-3 py-2.5 text-[8px]"
          >
            <span className="text-slate-400">{time}</span>
            <span className="text-slate-300">{asset}</span>
            <span
              className={
                signal === "CALL"
                  ? "font-semibold text-emerald-400"
                  : signal === "PUT"
                    ? "font-semibold text-red-400"
                    : "font-semibold text-yellow-400"
              }
            >
              {signal}
            </span>
            <span className="text-slate-300">{confidence}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const visuals: Record<
  Feature["visual"],
  () => React.ReactElement
> = {
  chart: MarketVisual,
  kanban: SignalVisual,
  messages: AnalysisVisual,
  toggles: HistoryVisual,
};

export function Features() {
  const { features } = siteConfig;

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#050b18] px-6 py-24 text-white sm:py-32 lg:px-10"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              SignalForge AI
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Everything you need to
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                analyze the market.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Real-time market data, AI-powered signals, technical
              analysis, and trade history in one powerful browser
              extension.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((feature, i) => {
            const Visual = visuals[feature.visual];

            return (
              <Reveal
                key={feature.title}
                delay={i * 80}
                className={feature.wide ? "sm:col-span-2" : ""}
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-blue-400/10 bg-[#0b1428]/90 p-4 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-400/20">
                  <div className="min-h-56 flex-1">
                    <Visual />
                  </div>

                  <div className="px-2 pb-2">
                    <h3 className="mt-6 text-lg font-bold tracking-tight text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom feature strip */}
        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 text-xs font-medium text-slate-500">
            <span>⚡ REAL-TIME ANALYSIS</span>
            <span>🤖 AI SIGNALS</span>
            <span>📊 EMA • RSI • MACD</span>
            <span>📜 TRADE HISTORY</span>
            <span>🎯 CALL / PUT / WAIT</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}