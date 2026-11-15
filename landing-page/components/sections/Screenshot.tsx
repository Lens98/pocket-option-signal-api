import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";

export function Screenshot() {
  const { screenshot } = siteConfig;

  const candles = [
    35, 48, 42, 55, 47, 64, 58, 72, 65, 82, 70, 88, 78, 94,
  ];

  const indicators = [
    ["EMA Trend", "✓ Bullish", "A+"],
    ["RSI", "✓ Momentum", "Strong"],
    ["MACD", "✓ Bearish", "Weak"],
  ];

  const trades = [
    ["3:36:11 PM", "EURUSD_otc", "CALL", "87%"],
    ["3:31:10 PM", "EURUSD_otc", "PUT", "82%"],
    ["3:26:10 PM", "EURUSD_otc", "CALL", "91%"],
    ["3:24:11 PM", "EURUSD_otc", "WAIT", "96%"],
  ];

  return (
    <section className="relative overflow-hidden bg-[#050b18] px-6 py-24 text-white sm:py-32 lg:px-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              SignalForge AI Extension
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              See your AI trading
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                signals in real time.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
              Market data, AI signals, technical indicators, entry timing,
              trade history, and session performance — all inside one
              powerful extension.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* Extension window */}
          <div className="relative mx-auto mt-14 max-w-6xl">
            <div className="absolute -inset-6 rounded-[3rem] bg-blue-600/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-[#091225] shadow-2xl shadow-blue-950/40">
              {/* Browser / extension header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0c172d] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-black">
                    S
                  </div>

                  <div>
                    <div className="text-sm font-bold">
                      Pocket Option AI PRO
                    </div>
                    <div className="text-[9px] text-slate-500">
                      SignalForge AI • Version 4.0 Professional
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Online
                </div>
              </div>

              {/* Main dashboard */}
              <div className="grid gap-4 p-4 lg:grid-cols-12">
                {/* Live Market */}
                <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4 lg:col-span-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-200">
                      📈 Live Market
                    </span>

                    <span className="text-[9px] font-bold text-emerald-400">
                      ● LIVE
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <div className="text-xl font-bold">
                        EURUSD_otc
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        OTC Market
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">
                        1.15140
                      </div>
                      <div className="text-[8px] text-emerald-400">
                        BULLISH
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="mt-5 flex h-44 items-end gap-1 rounded-xl border border-white/5 bg-[#081122] px-3 pb-3 pt-5">
                    {candles.map((height, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t-sm ${index % 4 === 0
                          ? "bg-emerald-400"
                          : "bg-gradient-to-t from-blue-600 to-cyan-400"
                          }`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {["1m", "5m", "15m", "1H"].map((time, index) => (
                      <span
                        key={time}
                        className={`rounded-md px-3 py-1.5 text-[9px] font-bold ${index === 0
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
                <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4 lg:col-span-3">
                  <div className="text-xs font-semibold text-blue-200">
                    🤖 AI Signal
                  </div>

                  <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-center text-[10px] font-bold">
                    ANALYZE MARKET
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-5xl font-black text-emerald-400">
                      CALL
                    </div>

                    <div className="mt-2 text-3xl font-black">
                      100%
                    </div>

                    <div className="text-[9px] uppercase tracking-widest text-slate-500">
                      Confidence
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between rounded-xl border border-white/10 px-3 py-3 text-[10px]">
                      <span className="text-slate-400">Trend</span>
                      <span className="font-bold text-emerald-400">
                        BULLISH
                      </span>
                    </div>

                    <div className="flex justify-between rounded-xl border border-white/10 px-3 py-3 text-[10px]">
                      <span className="text-slate-400">Risk</span>
                      <span className="font-bold text-emerald-400">
                        LOW
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timer + AI instruction */}
                <div className="space-y-4 lg:col-span-5">
                  <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4">
                    <div className="text-xs font-semibold text-blue-200">
                      ⏱ Entry Timer
                    </div>

                    <div className="mt-6 text-center text-4xl font-black">
                      00:39
                    </div>

                    <div className="mt-2 text-center text-[9px] uppercase tracking-widest text-slate-500">
                      Next Candle Entry
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4">
                    <div className="text-xs font-semibold text-pink-300">
                      🧠 AI Instruction
                    </div>

                    <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3 text-center text-xs font-bold text-emerald-300">
                      🟢 BUY CALL AT
                      <br />
                      NEXT CANDLE
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                      {[
                        "EMA20 Above EMA50",
                        "EMA200 Bullish Alignment",
                        "Bullish RSI Momentum",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-lg border border-white/10 px-3 py-2 text-[9px] text-slate-300"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4 lg:col-span-8">
                  <div className="mb-4 text-xs font-semibold text-pink-300">
                    🧠 AI Analysis
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <div className="grid grid-cols-3 bg-[#182640] px-4 py-3 text-[9px] font-bold text-blue-200">
                      <span>INDICATOR</span>
                      <span>STATUS</span>
                      <span>STRENGTH</span>
                    </div>

                    {indicators.map(([name, status, strength]) => (
                      <div
                        key={name}
                        className="grid grid-cols-3 border-t border-white/5 px-4 py-3 text-[10px]"
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

                        <span className="text-slate-300">
                          {strength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session */}
                <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4 lg:col-span-4">
                  <div className="text-xs font-semibold text-blue-200">
                    📊 Today's Session
                  </div>

                  <div className="mt-5 border-b border-white/10 pb-4">
                    <div className="text-[10px] text-slate-400">
                      Win Rate
                    </div>

                    <div className="mt-1 text-4xl font-black text-emerald-400">
                      0%
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 p-4 text-center">
                      <div className="text-[9px] text-slate-500">
                        WINS
                      </div>
                      <div className="mt-2 text-xl font-bold">0</div>
                    </div>

                    <div className="rounded-xl border border-white/10 p-4 text-center">
                      <div className="text-[9px] text-slate-500">
                        LOSSES
                      </div>
                      <div className="mt-2 text-xl font-bold">0</div>
                    </div>

                    <div className="rounded-xl border border-white/10 p-4 text-center">
                      <div className="text-[9px] text-slate-500">
                        PROFIT
                      </div>
                      <div className="mt-2 text-xl font-bold">$0</div>
                    </div>

                    <div className="rounded-xl border border-white/10 p-4 text-center">
                      <div className="text-[9px] text-slate-500">
                        ACCURACY
                      </div>
                      <div className="mt-2 text-xl font-bold">—</div>
                    </div>
                  </div>
                </div>

                {/* Trade History */}
                <div className="rounded-2xl border border-blue-400/10 bg-[#111d35] p-4 lg:col-span-12">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-200">
                      📜 Trade History
                    </span>

                    <span className="text-[9px] text-slate-500">
                      Recent Trades
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <div className="grid grid-cols-4 bg-[#182640] px-4 py-3 text-[9px] font-bold text-blue-200 sm:grid-cols-4">
                      <span>TIME</span>
                      <span>ASSET</span>
                      <span>SIGNAL</span>
                      <span>CONF.</span>
                    </div>

                    {trades.map(([time, asset, signal, confidence]) => (
                      <div
                        key={`${time}-${signal}`}
                        className="grid grid-cols-4 border-t border-white/5 px-4 py-3 text-[9px]"
                      >
                        <span className="text-slate-400">{time}</span>
                        <span className="truncate text-slate-300">
                          {asset}
                        </span>
                        <span
                          className={
                            signal === "CALL"
                              ? "font-bold text-emerald-400"
                              : signal === "PUT"
                                ? "font-bold text-red-400"
                                : "font-bold text-yellow-400"
                          }
                        >
                          {signal}
                        </span>
                        <span className="text-slate-300">
                          {confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom status bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#071020] px-5 py-4 text-[9px]">
                <span className="text-slate-500">
                  STATUS{" "}
                  <span className="font-bold text-emerald-400">
                    ● Connected
                  </span>
                </span>

                <span className="text-slate-500">
                  ENGINE{" "}
                  <span className="font-bold text-cyan-400">
                    Running
                  </span>
                </span>

                <span className="text-slate-500">
                  ACCOUNT{" "}
                  <span className="font-bold text-emerald-400">
                    ● ACTIVE
                  </span>
                </span>

                <span className="text-slate-500">
                  VERSION{" "}
                  <span className="font-bold text-white">4.0</span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Feature labels */}
        <Reveal delay={220}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Real-Time Market",
                text: "Monitor live market conditions and price action.",
              },
              {
                title: "AI Signals",
                text: "Receive clear CALL, PUT, or WAIT signals.",
              },
              {
                title: "AI Analysis",
                text: "Review EMA, RSI, MACD and market conditions.",
              },
              {
                title: "Trade History",
                text: "Track signals, confidence and session results.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="text-sm font-bold text-white">
                  {item.title}
                </div>

                <div className="mt-2 text-xs leading-5 text-slate-500">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}