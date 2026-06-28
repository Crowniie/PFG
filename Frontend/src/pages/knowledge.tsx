import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  TrendingUp,
  Activity,
  Workflow,
  PiggyBank,
} from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "../components/navbar";

// Section catalog. To add a new section, append an entry here and create the
// matching content component below.

interface SectionDef {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

const SECTIONS: SectionDef[] = [
  {
    id: "saving-vs-investing",
    title: "Saving vs investing",
    icon: <PiggyBank className="w-4 h-4" />,
    content: <SavingVsInvestingSection />,
  },
  {
    id: "ma200",
    title: "What is MA200?",
    icon: <TrendingUp className="w-4 h-4" />,
    content: <Ma200Section />,
  },
  {
    id: "macd",
    title: "What is MACD?",
    icon: <Activity className="w-4 h-4" />,
    content: <MacdSection />,
  },
  {
    id: "signals",
    title: "How signals are generated",
    icon: <Workflow className="w-4 h-4" />,
    content: <SignalsSection />,
  },
];

export default function Knowledge() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // highlight the section currently in view while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    for (const s of SECTIONS) {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  function handleNavClick(id: string) {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-teal-400 text-sm uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            Knowledge
          </div>
          <h1 className="text-3xl font-semibold">Understanding the basics</h1>
          <p className="text-slate-400 mt-1 max-w-2xl">
            Background on investing, the indicators behind our recommendations,
            and how each signal is derived.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex flex-col gap-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-3">
                Contents
              </p>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNavClick(s.id)}
                  className={
                    activeId === s.id
                      ? "flex items-center gap-2 px-3 py-2 text-sm text-teal-300 bg-teal-500/10 border-l-2 border-teal-400 rounded-r-lg text-left transition-colors"
                      : "flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-900 border-l-2 border-transparent rounded-r-lg text-left transition-colors"
                  }
                >
                  {s.icon}
                  <span>{s.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          <article className="flex flex-col gap-16 max-w-3xl">
            {SECTIONS.map((s) => (
              <section
                key={s.id}
                id={s.id}
                ref={(el) => {
                  sectionRefs.current[s.id] = el;
                }}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-teal-400">{s.icon}</span>
                  {s.title}
                </h2>
                {s.content}
              </section>
            ))}
          </article>
        </div>
      </main>
    </div>
  );
}

// Section content components ---------------------------------------------

function SavingVsInvestingSection() {
  return (
    <div className="prose-content">
      <p>
        Saving and investing are two distinct ways of setting money aside for
        the future, and they answer different questions. Understanding which
        one applies to your situation is the first step before any technical
        decision.
      </p>

      <h3 className="mt-6 text-base font-semibold text-slate-100">Saving</h3>
      <p>
        Saving means keeping money in a low-risk place such as a current
        account or a savings account, where the balance does not move with
        market prices. The amount you deposit stays nominally the same, and
        you can usually access it whenever you need. The trade-off is that
        interest rates on cash deposits often fail to keep pace with
        inflation, so the purchasing power of those savings tends to decline
        gradually over time even though the headline number stays flat.
      </p>
      <p>
        Saving is the appropriate vehicle for three categories of money:
        emergency reserves, short-term planned expenses (a deposit, a holiday,
        a car repair), and any amount you may need to access in the next few
        years.
      </p>

      <h3 className="mt-6 text-base font-semibold text-slate-100">Investing</h3>
      <p>
        Investing means putting money to work in assets whose value fluctuates
        with the market, with the expectation that, over the long term, those
        assets will grow in value faster than inflation. Common examples
        include shares, bonds, and funds that hold a basket of either. Returns
        are not guaranteed and the value of your investment can fall as well
        as rise; in any given year you could end up with less than you put
        in.
      </p>
      <p>
        Investing is suited to money you do not need in the short term &mdash;
        typically five years or more &mdash; and only after the emergency
        fund and short-term needs are covered. The longer the horizon, the
        more time the investment has to recover from inevitable market
        downturns.
      </p>

      <h3 className="mt-6 text-base font-semibold text-slate-100">
        Side by side
      </h3>

      <ComparisonTable />

      <h3 className="mt-6 text-base font-semibold text-slate-100">
        When investing makes sense
      </h3>
      <p>Before investing, it is generally sensible to have:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          An emergency reserve of three to six months of essential expenses in
          cash.
        </li>
        <li>
          No outstanding high-interest debt (credit cards, overdrafts,
          personal loans).
        </li>
        <li>
          A clear time horizon of at least five years for the money you intend
          to invest.
        </li>
        <li>
          A realistic acceptance that the value of investments goes down as
          well as up.
        </li>
      </ul>

      <ExampleBox title="Important">
        <p>
          This platform helps you act with discipline once you have decided to
          invest, but it does not replace professional financial advice. The
          decision of whether to invest at all, and how much, depends on your
          personal circumstances. If you are unsure, consider speaking with a
          regulated financial advisor before committing capital.
        </p>
      </ExampleBox>
    </div>
  );
}

function Ma200Section() {
  return (
    <div className="prose-content">
      <p>
        The 200-day moving average (MA200) is the arithmetic mean of an
        asset's closing prices over the last 200 trading sessions. It is
        recalculated every day, dropping the oldest value and adding the
        latest one. The result is a smoothed line that filters short-term
        noise and reflects the medium-term direction of the market.
      </p>

      <p>
        The MA200 is widely regarded as the threshold between bullish and
        bearish regimes. When the current price trades above the line, the
        prevailing trend is considered upward; when it trades below, the
        trend is considered downward. Crossings of this line in either
        direction are often interpreted as meaningful changes in market
        regime rather than ordinary fluctuations.
      </p>

      <h3 className="mt-6 text-base font-semibold text-slate-100">
        Why we use it
      </h3>
      <p>
        The 200-day moving average ignores intraday spikes and weekly swings.
        For a casual investor without time to monitor markets continuously,
        it offers a stable reference point: "Am I broadly aligned with the
        long-term direction of this asset?"
      </p>

      <ExampleBox title="Interpretation">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="text-slate-200">Price above MA200:</span> the
            asset is in an uptrend regime. Holding a long position is
            consistent with the trend.
          </li>
          <li>
            <span className="text-slate-200">Price below MA200:</span> the
            asset is in a downtrend regime. Holding a long position is
            fighting the trend.
          </li>
          <li>
            <span className="text-slate-200">Price crosses MA200 upward:</span>{" "}
            a potential change from downtrend to uptrend. Treated as a strong
            entry signal.
          </li>
          <li>
            <span className="text-slate-200">Price crosses MA200 downward:</span>{" "}
            a potential change from uptrend to downtrend. Treated as a strong
            exit signal.
          </li>
        </ul>
      </ExampleBox>
    </div>
  );
}

function MacdSection() {
  return (
    <div className="prose-content">
      <p>
        The Moving Average Convergence Divergence (MACD) measures the
        relationship between two exponential moving averages of an asset's
        closing prices: a fast one over 12 days and a slow one over 26 days.
        The difference between them is the MACD line.
      </p>

      <p>
        The MACD line is then compared to its own 9-day exponential moving
        average, known as the signal line. The interaction between these two
        lines reveals momentum changes earlier than the price itself does.
      </p>

      <h3 className="mt-6 text-base font-semibold text-slate-100">
        How to read it
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <span className="text-slate-200">MACD above signal line:</span>{" "}
          short-term momentum is stronger than the medium-term average.
          Pressure leans upward.
        </li>
        <li>
          <span className="text-slate-200">MACD below signal line:</span>{" "}
          short-term momentum is weaker than the medium-term average.
          Pressure leans downward.
        </li>
        <li>
          <span className="text-slate-200">MACD crosses signal upward:</span>{" "}
          early indication that momentum is shifting from negative to
          positive.
        </li>
        <li>
          <span className="text-slate-200">MACD crosses signal downward:</span>{" "}
          early indication that momentum is shifting from positive to
          negative.
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-slate-100">
        The histogram
      </h3>
      <p>
        The histogram displayed under the MACD chart represents the
        difference between the MACD line and its signal line. When the
        histogram is positive, MACD is above signal; when negative, below.
        Its magnitude shows how strong the divergence is.
      </p>

      <ExampleBox title="Why we use both MACD and MA200">
        <p>
          MACD reacts quickly but produces frequent false signals when the
          market is choppy. MA200 reacts slowly but identifies the broader
          direction. By combining both we accept entry and exit signals only
          when momentum (MACD) and trend (MA200) agree, reducing noise.
        </p>
      </ExampleBox>
    </div>
  );
}

function SignalsSection() {
  return (
    <div className="prose-content">
      <p>
        Every day after market close, our system evaluates both indicators on
        the tickers in your portfolio. The combination of indicator crossings
        and your current position determines the signal you receive.
      </p>

      <p>
        Signals fall into five categories, organised by intent: full or
        partial entry, full or partial exit, or hold (no action).
      </p>

      <h3 className="mt-6 text-base font-semibold text-slate-100">
        Indicator-to-signal mapping
      </h3>
      <SignalMatrix />

      <h3 className="mt-8 text-base font-semibold text-slate-100">
        How position state affects the action
      </h3>
      <p>
        Even when an indicator triggers, the action depends on the position
        you already hold:
      </p>

      <ul className="list-disc pl-5 space-y-1">
        <li>
          <span className="text-slate-200">NONE:</span> you have no exposure
          yet. BUY signals will open a position; SELL signals are ignored
          (nothing to sell).
        </li>
        <li>
          <span className="text-slate-200">HALF LONG:</span> you are at 50% of
          your target. A BUY 100% completes the position; a SELL signal exits
          everything you hold.
        </li>
        <li>
          <span className="text-slate-200">FULL LONG:</span> you are fully
          positioned. Additional BUY signals are ignored; SELL signals
          partially or fully reduce the position depending on strength.
        </li>
      </ul>

      <ExampleBox title="Worked example">
        <p>
          Suppose you track AAPL with a target of 10 units, and your current
          position is HALF LONG (5 units). At market close, the system
          detects an MACD upward cross while the price is above MA200. This
          combination indicates a strengthening uptrend, so the system emits
          a <span className="text-teal-300">BUY 100%</span> signal: the
          remaining 5 units are purchased to reach your full target.
        </p>
      </ExampleBox>
    </div>
  );
}

// Helpers ----------------------------------------------------------------

interface ExampleBoxProps {
  title: string;
  children: ReactNode;
}

function ExampleBox({ title, children }: ExampleBoxProps) {
  return (
    <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-3">
        {title}
      </div>
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    {
      attribute: "Capital risk",
      saving: "Very low",
      investing: "Variable; can lose money",
    },
    {
      attribute: "Expected return",
      saving: "Low (deposit rate)",
      investing: "Higher over the long term",
    },
    {
      attribute: "Liquidity",
      saving: "Immediate or short notice",
      investing: "Depends on the asset",
    },
    {
      attribute: "Time horizon",
      saving: "Days to a few years",
      investing: "Five years or more",
    },
    {
      attribute: "Inflation protection",
      saving: "Limited",
      investing: "Higher potential",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 mt-3">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800">
            <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
              Attribute
            </th>
            <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
              Saving
            </th>
            <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
              Investing
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={
                i === rows.length - 1
                  ? "border-slate-800"
                  : "border-b border-slate-800"
              }
            >
              <td className="text-sm text-slate-200 px-4 py-3 font-medium">
                {row.attribute}
              </td>
              <td className="text-sm text-slate-300 px-4 py-3">{row.saving}</td>
              <td className="text-sm text-slate-300 px-4 py-3">
                {row.investing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SignalMatrix() {
  const rows = [
    {
      condition: "Price crosses MA200 upward",
      signal: "BUY_100",
      tone: "buy-strong",
    },
    {
      condition: "MACD crosses signal line upward while price below MA200",
      signal: "BUY_50",
      tone: "buy-weak",
    },
    {
      condition: "Price crosses MA200 downward",
      signal: "SELL_100",
      tone: "sell-strong",
    },
    {
      condition: "MACD crosses signal line downward while price above MA200",
      signal: "SELL_50",
      tone: "sell-weak",
    },
    {
      condition: "No crossing detected",
      signal: "HOLD",
      tone: "hold",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 mt-3">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800">
            <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
              Condition
            </th>
            <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3 w-40">
              Signal
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={
                i === rows.length - 1
                  ? "border-slate-800"
                  : "border-b border-slate-800"
              }
            >
              <td className="text-sm text-slate-300 px-4 py-3 leading-relaxed">
                {row.condition}
              </td>
              <td className="px-4 py-3">
                <SignalBadge tone={row.tone} label={row.signal} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SignalBadgeProps {
  tone: string;
  label: string;
}

function SignalBadge({ tone, label }: SignalBadgeProps) {
  // default = hold
  let cls = "bg-slate-800 text-slate-400 border-slate-700";

  if (tone === "buy-strong") {
    cls = "bg-teal-500/20 text-teal-200 border-teal-500/30";
  } else if (tone === "buy-weak") {
    cls = "bg-teal-500/10 text-teal-300 border-teal-500/20";
  } else if (tone === "sell-strong") {
    cls = "bg-red-500/20 text-red-200 border-red-500/30";
  } else if (tone === "sell-weak") {
    cls = "bg-red-500/10 text-red-300 border-red-500/20";
  }

  return (
    <span
      className={
        "inline-block px-2 py-1 rounded text-xs font-mono font-medium tracking-wider border " +
        cls
      }
    >
      {label}
    </span>
  );
}