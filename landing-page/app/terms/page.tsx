import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          ← Back to SignalForge AI
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Terms of Service</h1>
        <p className="mt-3 text-slate-400">
          Effective Date: September 20, 2026
        </p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-white">1. Agreement</h2>
            <p className="mt-3">
              These Terms of Service govern your use of SignalForge AI, a
              service operated by Aiwens Transit LLC. By creating an account
              or using the service, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">2. The Service</h2>
            <p className="mt-3">
              SignalForge AI provides software tools and AI-generated trading
              signals and market analysis. The service is provided for
              informational and educational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">3. Accounts</h2>
            <p className="mt-3">
              You are responsible for maintaining the confidentiality of your
              account credentials and for activity performed through your
              account. You must provide accurate information when creating an
              account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. Free and Paid Plans
            </h2>
            <p className="mt-3">
              SignalForge AI may offer free and paid subscription plans.
              Features, trade limits, subscription periods, and prices are
              displayed on the website and may change over time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">5. Payments</h2>
            <p className="mt-3">
              Paid subscriptions are subject to the payment terms presented
              during checkout. Payment processing may be handled by
              third-party payment providers. A subscription may not become
              active until payment has been successfully confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              6. Trading Risk
            </h2>
            <p className="mt-3">
              Trading financial instruments, including binary options and other
              speculative products, involves substantial risk of loss.
              SignalForge AI does not guarantee profits, successful trades, or
              any particular financial outcome.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              7. No Financial Advice
            </h2>
            <p className="mt-3">
              SignalForge AI is not a financial advisor, broker, investment
              adviser, or fiduciary. Information and signals provided by the
              service are not individualized financial advice or a
              recommendation to enter any particular transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              8. Third-Party Platforms
            </h2>
            <p className="mt-3">
              SignalForge AI may interact with or provide information relating
              to third-party trading platforms. Those platforms operate
              independently and may have their own terms, fees, policies,
              technical limitations, and risks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              9. Acceptable Use
            </h2>
            <p className="mt-3">
              You agree not to misuse the service, attempt to bypass security
              or subscription restrictions, interfere with service operation,
              reverse engineer protected components where prohibited by law,
              or use the service for unlawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              10. Intellectual Property
            </h2>
            <p className="mt-3">
              SignalForge AI software, branding, website content, designs, and
              related materials are owned by or licensed to Aiwens Transit LLC
              and are protected by applicable intellectual-property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              11. Availability
            </h2>
            <p className="mt-3">
              We may modify, suspend, or discontinue portions of the service
              when necessary for maintenance, security, development, business
              operations, or other legitimate reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              12. Disclaimers and Liability
            </h2>
            <p className="mt-3">
              The service is provided on an as-available basis. To the extent
              permitted by law, Aiwens Transit LLC is not responsible for
              trading losses, missed opportunities, platform outages, market
              movements, technical failures, or decisions made based on
              information provided by SignalForge AI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              13. Suspension or Termination
            </h2>
            <p className="mt-3">
              We may suspend or terminate accounts that violate these Terms,
              create security risks, abuse the service, or engage in unlawful
              activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">14. Changes</h2>
            <p className="mt-3">
              We may update these Terms from time to time. Continued use of the
              service after an updated version becomes effective constitutes
              acceptance of the updated Terms to the extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">15. Contact</h2>
            <p className="mt-3">
              Aiwens Transit LLC
              <br />
              7244 CASTOR AVENUE
              <br />
              PHILADELPHIA, PA 19149
              <br />
              SUPPORTSIGNALFORGEAI@GMAIL.COM
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}