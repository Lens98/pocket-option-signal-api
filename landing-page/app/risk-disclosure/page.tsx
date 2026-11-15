import Link from 'next/link';

export default function RiskDisclosurePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          ← Back to SignalForge AI
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Risk Disclosure</h1>
        <p className="mt-3 text-slate-400">
          Effective Date: September 20, 2026
        </p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-white">
              1. Substantial Risk
            </h2>
            <p className="mt-3">
              Trading financial products can result in substantial losses. You
              should only trade with money you can afford to lose and should
              understand the risks before participating.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              2. No Guaranteed Results
            </h2>
            <p className="mt-3">
              SignalForge AI does not guarantee profits, winning trades,
              accuracy, or any particular investment or trading result.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              3. Past Performance
            </h2>
            <p className="mt-3">
              Historical results, examples, demonstrations, simulated results,
              or previous trading performance are not guarantees of future
              results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. AI and Technical Limitations
            </h2>
            <p className="mt-3">
              AI-generated analysis can contain errors, incomplete information,
              delays, or incorrect interpretations. Market conditions can
              change rapidly, and technical systems can experience outages or
              failures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              5. User Decisions
            </h2>
            <p className="mt-3">
              You are solely responsible for deciding whether to place a trade
              and for determining your own risk limits, position sizes, and
              trading activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              6. Third-Party Platforms
            </h2>
            <p className="mt-3">
              Third-party trading platforms may experience downtime, execution
              delays, price differences, restrictions, account limitations, or
              other technical and operational issues outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              7. No Individualized Financial Advice
            </h2>
            <p className="mt-3">
              SignalForge AI does not provide individualized investment,
              financial, tax, or legal advice. Consider consulting an
              appropriately qualified professional regarding your circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              8. Responsible Use
            </h2>
            <p className="mt-3">
              Users should understand the products they trade, applicable laws
              and platform rules, and the risks associated with speculative
              trading before using SignalForge AI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">9. Contact</h2>
            <p className="mt-3">
              For questions about this disclosure, contact
              SUPPORTSIGNALFORGEAI@GMAIL.COM.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}