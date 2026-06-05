import { Link } from "react-router-dom";
import {
  TrendingUp,
  ListChecks,
  Activity,
  Mail,
  ShieldCheck,
  FileText,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import type { ReactNode } from "react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopBar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
      </main>
    </div>
  );
}

// Top bar ---------------------------------------------------------------------

function TopBar() {
  return (
    <header className="border-b border-slate-800 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <TrendingUp className="w-5 h-5 text-teal-400" />
          <span className="text-slate-100">Investment Advisor</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

// Hero ------------------------------------------------------------------------

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium tracking-wider uppercase mb-6">
          <Activity className="w-3.5 h-3.5" />
          MACD &amp; MA200 rule-based signals
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
          Invest with discipline,
          <br />
          <span className="text-teal-400">not impulse.</span>
        </h1>
        <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
          Rule-based BUY and SELL signals delivered to your inbox &mdash; only
          when the market actually triggers them. No noise, no FOMO, no charts
          to stare at all day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-colors shadow-[0_4px_12px_rgba(20,184,166,0.15)]"
          >
            Get started for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 rounded-lg transition-colors"
          >
            I already have an account
          </Link>
        </div>
      </div>

      {/* Mock dashboard card to the right */}
      <div className="relative">
        <div className="absolute inset-0 bg-teal-500/5 blur-3xl rounded-full" />
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-2xl font-semibold text-slate-100">AAPL</div>
              <div className="text-xs text-slate-500">Apple Inc.</div>
            </div>
            <span className="px-2 py-1 rounded text-xs font-medium tracking-wider border bg-teal-500/10 text-teal-300 border-teal-500/20">
              FULL LONG
            </span>
          </div>
          <div className="border-b border-slate-800 mb-4" />
          <div className="flex flex-col gap-2 text-sm">
            <Row label="Target" value="10 units" />
            <Row label="Current" value="10 units" />
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-teal-400 h-full rounded-full" style={{ width: "100%" }} />
            </div>
            <Row label="Entry price" value="$209.50" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Latest signal
            </div>
            <div className="text-sm text-teal-300">
              BUY 100% &mdash; price crossed above MA200
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
  );
}

// How it works ---------------------------------------------------------------

function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-slate-800">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3">How it works</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Three steps. No app to check obsessively, no learning the
          micro-movements of every chart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Step
          number="01"
          icon={<ListChecks className="w-6 h-6 text-teal-400" />}
          title="Pick your tickers"
          body="Add the stocks or ETFs you want to track and set how many units you'd like to hold when fully positioned."
        />
        <Step
          number="02"
          icon={<Activity className="w-6 h-6 text-teal-400" />}
          title="We watch the indicators"
          body="Every day after market close, our system evaluates the MACD and 200-day moving average for each of your tickers."
        />
        <Step
          number="03"
          icon={<Mail className="w-6 h-6 text-teal-400" />}
          title="Get the signal"
          body="When the indicators align, you receive an actionable email with the rationale. The rest of the time, silence."
        />
      </div>
    </section>
  );
}

interface StepProps {
  number: string;
  icon: ReactNode;
  title: string;
  body: string;
}

function Step({ number, icon, title, body }: StepProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 tracking-wider">
          {number}
        </span>
        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
    </div>
  );
}

// Features --------------------------------------------------------------------

function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-slate-800">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3">Why this exists</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Built for casual investors who'd rather follow rules than chase
          headlines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Feature
          icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
          title="No FOMO"
          body="The system only contacts you when there's an actual signal. Most days, it stays silent."
        />
        <Feature
          icon={<FileText className="w-6 h-6 text-teal-400" />}
          title="Transparent rules"
          body="Every signal includes its rationale: which indicator crossed, in which direction, and why it matters."
        />
        <Feature
          icon={<Mail className="w-6 h-6 text-teal-400" />}
          title="Email-first"
          body="No app to obsessively refresh. Recommendations reach you when the market closes."
        />
        <Feature
          icon={<BookOpen className="w-6 h-6 text-teal-400" />}
          title="Educational"
          body="Learn the indicators that drive your recommendations in the knowledge section."
        />
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-colors shadow-[0_4px_12px_rgba(20,184,166,0.15)]"
        >
          Create your free account
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

interface FeatureProps {
  icon: ReactNode;
  title: string;
  body: string;
}

function Feature({ icon, title, body }: FeatureProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
    </div>
  );
}