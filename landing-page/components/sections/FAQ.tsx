import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";

export function FAQ() {
  const { faq } = siteConfig;

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#050b18] px-6 py-24 sm:py-32 lg:px-10"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              {faq.eyebrow}
            </div>

            <h2 className="mt-5 text-4xl font-bold tracking-tighter text-white sm:text-5xl">
              {faq.headline}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Find answers about SignalForge AI, signals, the Chrome extension,
              and your subscription.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-14 space-y-3">
            {faq.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 open:border-indigo-400/30 open:bg-indigo-500/[0.04]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 text-left marker:hidden">
                  <span className="text-base font-semibold text-white sm:text-lg">
                    {item.question}
                  </span>

                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition duration-300 group-open:border-indigo-400/30 group-open:bg-indigo-500/10 group-open:text-indigo-300"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-45"
                    >
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-white/5 px-6 pb-6 pt-5 text-sm leading-7 text-slate-400">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 rounded-2xl border border-indigo-400/10 bg-gradient-to-r from-indigo-500/[0.06] via-purple-500/[0.04] to-cyan-500/[0.06] px-6 py-5 text-center">
            <p className="text-sm text-slate-400">
              Still have questions?{" "}
              <a
                href="/signup"
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Get started with SignalForge AI
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}