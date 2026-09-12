/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LaunchPad — site configuration
 *
 * This file is the single source of truth for every word on the page.
 * Change the copy here and every section updates. No component edits needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type NavLink = { label: string; href: string };

export type Feature = {
  title: string;
  description: string;
  /** Which CSS-drawn visual the bento card renders. */
  visual: "chart" | "kanban" | "messages" | "toggles";
  /** Bento layout: the first "wide" card spans 2 columns on lg screens. */
  wide?: boolean;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  /** Two-letter initials shown in the gradient avatar circle. */
  initials: string;
  /** One accent card per grid adds visual spice. */
  accent?: boolean;
};

export type PricingTier = {
  name: string;
  id: string;
  monthly: number;
  annual: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  /** The featured tier renders as the elevated dark card. */
  featured?: boolean;
};

export type FaqItem = { question: string; answer: string };

export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  name: "SignalForge AI",
  url: "https://pixelandoak-launchpad.pages.dev",
  title: "LaunchPad — SaaS Landing Page Template",
  description:
    "A free, production-ready SaaS landing page template built with Next.js and Tailwind CSS. Hero, features, pricing, FAQ — everything your startup needs to launch this weekend.",

  nav: {
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ] satisfies NavLink[],
    login: { label: "Log in", href: "/login" },
    cta: { label: "Sign up", href: "/signup" },
  },

  hero: {
    announcement: {
      label: "AI-Powered Trading Signals",
      href: "#features",
    },
    headline: "Trade Smarter with AI.",
    subline:
      "SignalForge AI analyzes market conditions in real time and delivers clear trading signals to help you make more informed decisions.",
    primaryCta: { label: "Get Started", href: "#pricing" },
    secondaryCta: { label: "View Pricing", href: "#pricing" },
  },

  logoCloud: {
    tagline: "Backed by absolutely no one famous — yet.",
    companies: ["Acme", "Polaris", "Vertex", "Nimbus", "Quartz"],
  },

  features: {
    eyebrow: "Built for smarter trading",
    headline: "Everything you need to analyze the market.",
    subline:
      "SignalForge AI combines real-time market data with AI-powered analysis to give you clear signal information directly in your browser.",
    items: [
      {
        title: "Real-Time Market Analysis",
        description:
          "Monitor live market conditions and price action while SignalForge AI analyzes the market for potential trading opportunities.",
        visual: "chart",
        wide: true,
      },
      {
        title: "Clear CALL / PUT Signals",
        description:
          "Get easy-to-understand CALL, PUT, or WAIT signals with confidence information, entry timing, and expiration details.",
        visual: "kanban",
      },
      {
        title: "AI Analysis & Reasons",
        description:
          "See the market conditions and indicator confirmations behind each signal so you can better understand the analysis.",
        visual: "messages",
      },
      {
        title: "Risk & Session Insights",
        description:
          "Track risk levels, trade history, results, and session performance from one simple trading dashboard.",
        visual: "toggles",
      },
    ],
  },

  screenshot: {
    eyebrow: "The SignalForge AI Dashboard",
    headline: "Powerful AI trading analysis in one simple dashboard.",
    subline:
      "Monitor the market, receive clear CALL, PUT, or WAIT signals, and review AI-powered analysis without leaving your browser.",
    url: "signalforge.ai/dashboard",
  },

  testimonials: {
    eyebrow: "Why Traders Choose SignalForge AI",
    headline: "Built to make market analysis simpler.",
    subline:
      "SignalForge AI gives traders a clear view of market conditions, signals, and AI analysis in one place.",
    items: [
      {
        quote:
          "SignalForge AI makes it easier to understand the market without switching between multiple tools.",
        name: "Early Access Trader",
        title: "SignalForge AI User",
        initials: "EA",
      },
      {
        quote:
          "The clear CALL, PUT, and WAIT signals make the dashboard simple to understand and use.",
        name: "Beta Trader",
        title: "SignalForge AI User",
        initials: "BT",
        accent: true,
      },
      {
        quote:
          "I like being able to see the signal and the analysis behind it in the same dashboard.",
        name: "Active Trader",
        title: "SignalForge AI User",
        initials: "AT",
      },
    ] satisfies Testimonial[],
  },
  pricing: {
    eyebrow: "Pricing",
    headline: "Choose your SignalForge AI plan.",
    subline:
      "Start with the plan that fits your trading needs. Upgrade whenever you're ready for more.",
    annualBadge: "Save with annual billing",
    tiers: [
      {
        name: "Starter",
        id: "starter",
        monthly: 19,
        annual: 190,
        description: "For traders who want clear AI-powered market signals.",
        features: [
          "AI-powered trading signals",
          "CALL / PUT / WAIT signals",
          "Real-time market analysis",
          "Signal confidence information",
          "Trade history",
        ],
        cta: "Get Started",
        href: "#",
      },
      {
        name: "Pro",
        id: "pro",
        monthly: 39,
        annual: 390,
        description: "For active traders who want deeper market analysis.",
        features: [
          "Everything in Starter",
          "Advanced AI analysis",
          "Detailed signal reasoning",
          "Risk and session insights",
          "Priority support",
        ],
        cta: "Get Started",
        href: "#",
        featured: true,
      },
      {
        name: "Elite",
        id: "elite",
        monthly: 69,
        annual: 690,
        description: "For serious traders who want the complete experience.",
        features: [
          "Everything in Pro",
          "Advanced trading insights",
          "Full trade history",
          "Performance tracking",
          "Premium support",
        ],
        cta: "Get Started",
        href: "#",
      },
    ] satisfies PricingTier[],
  },
  faq: {
    eyebrow: "FAQ",
    headline: "Questions? Answers.",
    items: [
      {
        question: "What is SignalForge AI?",
        answer:
          "SignalForge AI is a Chrome extension that analyzes market conditions and provides clear CALL, PUT, or WAIT trading signals with AI-powered market analysis.",
      },
      {
        question: "How does SignalForge AI generate signals?",
        answer:
          "SignalForge AI analyzes current market data and technical indicators to evaluate market conditions and generate a trading signal.",
      },
      {
        question: "What signals can I receive?",
        answer:
          "The system can provide three signal types: CALL, PUT, or WAIT. Each signal is presented with supporting market analysis and signal information.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "Yes. SignalForge AI is designed as a Chrome extension. After subscribing, you can install the extension and use the SignalForge AI dashboard in your browser.",
      },
      {
        question: "Does SignalForge AI guarantee profits?",
        answer:
          "No. SignalForge AI provides market analysis and trading signals, but no trading system can guarantee profits. Trading involves risk, and you should make your own decisions.",
      },
      {
        question: "Can I cancel my subscription?",
        answer:
          "Yes. You can cancel your subscription according to the subscription terms for your plan. Your access will remain available according to the applicable billing period.",
      },
    ] satisfies FaqItem[],
  },

  finalCta: {
    headline: "Ready for liftoff?",
    subline:
      "Clone the repo, edit one file, deploy for free. Your landing page could be live in under an hour.",
    cta: { label: "Get started free", href: "#pricing" },
  },

  footer: {
    tagline: "AI-powered market analysis and trading signals, built for smarter decisions.",
    columns: [
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
          { label: "Dashboard", href: "#" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "How It Works", href: "#features" },
          { label: "Getting Started", href: "#pricing" },
          { label: "Support", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      {
        heading: "Legal",
        links: [
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
          { label: "Risk Disclosure", href: "#" },
        ],
      },
    ] satisfies FooterColumn[],
    attribution: {
      label: "SignalForge AI",
      href: "#",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
