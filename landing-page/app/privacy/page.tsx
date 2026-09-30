import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          ← Back to SignalForge AI
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-slate-400">
          Effective Date: September 20, 2026
        </p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-white">1. Who We Are</h2>
            <p className="mt-3">
              SignalForge AI is a service operated by Aiwens Transit LLC.
              Our website is signalforgepro.app.
            </p>
            <p className="mt-3">
              Business Address: 7244 CASTOR AVENUE, PHILADELPHIA, PA 19149
            </p>
            <p className="mt-3">
              Support Email: SUPPORTSIGNALFORGEAI@GMAIL.COM
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              2. Information We Collect
            </h2>
            <p className="mt-3">
              Depending on how you use SignalForge AI, we may collect
              information such as your name, email address, account
              credentials, subscription information, payment-related
              information, and technical information needed to operate and
              secure the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              3. How We Use Information
            </h2>
            <p className="mt-3">
              We may use information to create and manage accounts, provide
              SignalForge AI services, process subscriptions and payments,
              provide customer support, maintain security, prevent abuse,
              communicate about the service, and improve our products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. Payments and Service Providers
            </h2>
            <p className="mt-3">
              Payments may be processed through third-party payment providers.
              We do not intend to store complete payment card information on
              our own systems when payment processing is handled by a
              third-party provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              5. Information Sharing
            </h2>
            <p className="mt-3">
              We may share information with service providers that help us
              operate the website, authentication, payments, hosting, security,
              and customer support. We may also disclose information when
              required by law or when reasonably necessary to protect our
              rights, users, or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">6. Security</h2>
            <p className="mt-3">
              We use reasonable technical and organizational measures designed
              to protect information. However, no internet transmission or
              electronic storage system can be guaranteed to be completely
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              7. Data Retention
            </h2>
            <p className="mt-3">
              We retain information for as long as reasonably necessary to
              provide our services, maintain accounts and transaction records,
              comply with legal obligations, resolve disputes, and enforce
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              8. Your Requests
            </h2>
            <p className="mt-3">
              If you have questions about your personal information or want to
              make a privacy-related request, contact us at
              SUPPORTSIGNALFORGEAI@GMAIL.COM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">9. Children</h2>
            <p className="mt-3">
              SignalForge AI is not intended for children. We do not knowingly
              seek to collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              10. Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. The updated
              version will be posted on this page with a revised effective
              date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">11. Contact</h2>
            <p className="mt-3">
              For privacy questions, contact
              SUPPORTSIGNALFORGEAI@GMAIL.COM.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}