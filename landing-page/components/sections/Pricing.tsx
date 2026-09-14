"use client";

import { useState } from "react";
import { siteConfig, type PricingTier } from "@/config/site";
import { Reveal } from "@/components/Reveal";

function CheckIcon({ featured }: { featured?: boolean }) {
  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${featured
        ? "bg-indigo-500/20 text-indigo-300"
        : "bg-indigo-500/10 text-indigo-400"
        }`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function TierCard({
  tier,
  annual,
}: {
  tier: PricingTier;
  annual: boolean;
}) {
  const featured = tier.featured;
  const price = annual ? Math.round(tier.annual / 12) : tier.monthly;

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition duration-300 ${featured
        ? "border border-indigo-400/40 bg-gradient-to-b from-indigo-950/90 via-[#0b1224] to-[#070d1a] shadow-[0_0_50px_rgba(99,102,241,0.18)] lg:-my-4 lg:py-12"
        : "border border-white/10 bg-[#0a1120]/80 shadow-xl hover:border-indigo-400/30 hover:bg-[#0d1628]"
        }`}
    >
      {featured && (
        <>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

          <span className="absolute right-6 top-6 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Most Popular
          </span>
        </>
      )}

      <div className="pr-24">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {tier.name}
        </h3>

        <p className="mt-2 min-h-[42px] text-sm leading-6 text-slate-400">
          {tier.description}
        </p>
      </div>

      <div className="mt-7 flex items-end gap-2">
        <span className="text-5xl font-bold tracking-tighter text-white">
          ${price}
        </span>

        <span className="mb-1.5 text-sm font-medium text-slate-500">
          /month
        </span>
      </div>

      <div className="mt-2 h-5 text-xs text-slate-500">
        {annual && tier.annual > 0
          ? `Billed as $${tier.annual}/year`
          : "\u00A0"}
      </div>

      <a
        href={tier.href}
        className={`mt-7 rounded-xl px-5 py-3.5 text-center text-sm font-bold transition ${featured
          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
          : "border border-white/10 bg-white/[0.06] text-white hover:border-indigo-400/40 hover:bg-white/10"
          }`}
      >
        {tier.cta}
      </a>

      <div className="mt-8 border-t border-white/10 pt-7">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          What's included
        </p>

        <ul className="space-y-4">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckIcon featured={featured} />

              <span className="text-sm leading-5 text-slate-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { pricing } = siteConfig;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#050b18] px-6 py-24 sm:py-32 lg:px-10"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              {pricing.eyebrow}
            </div>

            <h2 className="mt-5 text-4xl font-bold tracking-tighter text-white sm:text-5xl lg:text-6xl">
              Choose your{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                SignalForge AI
              </span>{" "}
              plan.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              {pricing.subline}
            </p>
          </div>

          {/* Billing toggle */}
          <div className="mt-10 flex items-center justify-center">
            <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.04] p-1.5">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!annual
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${annual
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                Annual
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  SAVE
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className={tier.featured ? "lg:z-10" : ""}
              >
                <TierCard tier={tier} annual={annual} />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Trust / product strip */}
        <Reveal delay={220}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-widest text-slate-600">
            <span>AI Market Analysis</span>
            <span className="hidden sm:inline">•</span>
            <span>CALL / PUT / WAIT</span>
            <span className="hidden sm:inline">•</span>
            <span>Trade History</span>
            <span className="hidden sm:inline">•</span>
            <span>Chrome Extension</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}