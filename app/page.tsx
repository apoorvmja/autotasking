import { Manrope, Space_Grotesk } from "next/font/google";
import type { CSSProperties } from "react";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  const themeVars = {
    "--ink": "#0f172a",
    "--ink-soft": "#475569",
    "--paper": "#f8fafc",
    "--surface": "#ffffff",
    "--accent": "#f97316",
    "--accent-soft": "#ffedd5",
    "--mint": "#14b8a6",
    "--sky": "#38bdf8",
    "--sun": "#facc15",
  } as CSSProperties;

  return (
    <div
      className={`min-h-screen ${body.className} bg-[var(--paper)] text-[var(--ink)]`}
      style={themeVars}
    >
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff,_#f8fafc_35%,_#e2e8f0_100%)]">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-[48px] bg-[var(--sun)]/70 blur-[1px]" />
        <div className="pointer-events-none absolute right-10 top-28 h-44 w-44 rounded-[36px] bg-[var(--mint)]/70" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-[46px] bg-[var(--sky)]/70" />
        <div className="pointer-events-none absolute right-24 bottom-40 h-32 w-32 rounded-[28px] bg-[var(--accent)]/70" />

        <main className="relative mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-8 sm:px-10 lg:px-16">
          <nav className="flex flex-wrap items-center justify-between gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            <div className={`text-base font-semibold text-[var(--ink)] ${display.className}`}>
              autotasking.com
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a className="transition hover:text-[var(--ink)]" href="#how">
                How it works
              </a>
              <a className="transition hover:text-[var(--ink)]" href="#features">
                Features
              </a>
              <a className="transition hover:text-[var(--ink)]" href="#pricing">
                Pricing
              </a>
              <a className="transition hover:text-[var(--ink)]" href="#faq">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                className="rounded-full border-2 border-[var(--ink)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                href="#demo"
              >
                Watch demo
              </a>
              <a
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-slate-800"
                href="/tasks"
              >
                Open app
              </a>
            </div>
          </nav>

          <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--ink-soft)]">
                <span className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1">
                  Daily work tracking
                </span>
                <span className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1">
                  One clean log
                </span>
              </div>
              <h1 className={`text-4xl font-semibold uppercase leading-tight sm:text-5xl ${display.className}`}>
                Capture daily progress without the admin
              </h1>
              <p className="max-w-xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
                Autotasking keeps a clear record of what you shipped, solved, and learned each day. Post a
                fast update, tag it to projects, and watch a living timeline form across your week, team,
                and goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-orange-600"
                  href="/tasks"
                >
                  Start your daily log
                </a>
                <a
                  className="rounded-full border-2 border-[var(--ink)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                  href="#demo"
                >
                  See a live example
                </a>
              </div>
              <div className="grid gap-4 rounded-3xl border-2 border-[var(--ink)] bg-white p-5 text-sm text-[var(--ink-soft)] sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-semibold text-[var(--ink)]">4 min</div>
                  <div>Average daily update time</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-semibold text-[var(--ink)]">52%</div>
                  <div>Less end-of-week scramble</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-semibold text-[var(--ink)]">1 hub</div>
                  <div>Projects, tasks, and proof</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 shadow-[6px_6px_0_0_rgba(15,23,42,0.1)]">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                  Today
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                    3 updates
                  </span>
                </div>
                <div className="mt-5 space-y-4 text-sm text-[var(--ink-soft)]">
                  <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--accent-soft)] p-4">
                    <div className="text-[var(--ink)]">Drafted launch email sequence</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em]">Marketing · 45m</div>
                  </div>
                  <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4">
                    <div className="text-[var(--ink)]">Resolved onboarding flow bug</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em]">Product · 1h 15m</div>
                  </div>
                  <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4">
                    <div className="text-[var(--ink)]">Shared recap with stakeholders</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em]">Ops · 30m</div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border-2 border-[var(--ink)] bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Weekly pulse
                  </div>
                  <div className="mt-4 flex items-end gap-3">
                    <div className="h-12 w-6 rounded-full bg-[var(--sun)]" />
                    <div className="h-20 w-6 rounded-full bg-[var(--mint)]" />
                    <div className="h-16 w-6 rounded-full bg-[var(--sky)]" />
                    <div className="h-24 w-6 rounded-full bg-[var(--accent)]" />
                    <div className="h-14 w-6 rounded-full bg-[var(--sun)]" />
                  </div>
                  <p className="mt-4 text-sm text-[var(--ink-soft)]">
                    See momentum at a glance with automatically grouped daily wins.
                  </p>
                </div>
                <div className="rounded-[28px] border-2 border-[var(--ink)] bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Team view
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-[var(--ink-soft)]">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <span className="text-[var(--ink)]">Design</span>
                      <span>4 updates</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <span className="text-[var(--ink)]">Engineering</span>
                      <span>6 updates</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <span className="text-[var(--ink)]">Growth</span>
                      <span>3 updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-6 rounded-[32px] border-2 border-[var(--ink)] bg-white px-6 py-8 text-sm text-[var(--ink-soft)]">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
              Built for busy teams
            </div>
            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em]">
              <span>Product</span>
              <span>Agency</span>
              <span>Design</span>
              <span>Engineering</span>
              <span>Operations</span>
            </div>
          </section>

          <section id="how" className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[36px] border-2 border-[var(--ink)] bg-white p-8">
              <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>Your daily rhythm</h2>
              <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
                Post once, track forever. Autotasking keeps your work cleanly organized without extra
                meetings or status pings.
              </p>
              <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
                <div className="flex items-start gap-4">
                  <span className="text-lg font-semibold text-[var(--ink)]">01</span>
                  <div>
                    <div className="text-[var(--ink)]">Log your update</div>
                    <p className="mt-1">
                      Add tasks, learnings, blockers, and screenshots in one quick post.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-lg font-semibold text-[var(--ink)]">02</span>
                  <div>
                    <div className="text-[var(--ink)]">Auto-sort by project</div>
                    <p className="mt-1">
                      Tags and smart grouping keep every update aligned with your goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-lg font-semibold text-[var(--ink)]">03</span>
                  <div>
                    <div className="text-[var(--ink)]">Share the highlight reel</div>
                    <p className="mt-1">
                      Send daily or weekly summaries to your team with a single click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Auto summaries",
                  copy: "Daily and weekly rollups arrive formatted and ready to share.",
                },
                {
                  title: "Focus heatmap",
                  copy: "See where your time goes across clients, goals, and workstreams.",
                },
                {
                  title: "Smart reminders",
                  copy: "Gentle nudges that respect your flow and timezone.",
                },
                {
                  title: "Proof vault",
                  copy: "Keep assets, notes, and links attached to each log entry.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border-2 border-[var(--ink)] bg-white p-5 text-sm text-[var(--ink-soft)]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                    {item.title}
                  </div>
                  <p className="mt-3">{item.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="grid gap-10">
            <div className="flex flex-col gap-4 text-center">
              <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>
                Everything your daily log needs
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
                Designed for clarity and speed, with just enough structure to keep your progress visible.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                "Project tagging",
                "Blocker tracking",
                "Progress streaks",
                "Client-ready exports",
                "Team visibility",
                "Personal insights",
              ].map((title, index) => (
                <div
                  key={title}
                  className="rounded-[30px] border-2 border-[var(--ink)] bg-white p-6 text-sm text-[var(--ink-soft)]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                    0{index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{title}</h3>
                  <p className="mt-2">
                    Keep momentum visible with structured updates that stay consistent week after week.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-10 rounded-[36px] border-2 border-[var(--ink)] bg-white p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>
                Proof without busywork
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
                Your daily updates become a living portfolio of outcomes. Every entry adds depth and
                context to your work without extra reporting.
              </p>
              <div className="mt-6 grid gap-4 text-sm text-[var(--ink-soft)] sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--accent-soft)] p-4">
                  <div className="text-lg font-semibold text-[var(--ink)]">92%</div>
                  <div>Weekly summaries delivered on time</div>
                </div>
                <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-slate-50 p-4">
                  <div className="text-lg font-semibold text-[var(--ink)]">3x</div>
                  <div>More visibility across teams</div>
                </div>
                <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-slate-50 p-4">
                  <div className="text-lg font-semibold text-[var(--ink)]">14</div>
                  <div>Days to a full work archive</div>
                </div>
                <div className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--accent-soft)] p-4">
                  <div className="text-lg font-semibold text-[var(--ink)]">5 min</div>
                  <div>Average daily ritual</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[28px] border-2 border-[var(--ink)] bg-[var(--accent-soft)] p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Daily recap
                </div>
                <div className="mt-4 space-y-3 text-sm text-[var(--ink-soft)]">
                  <div className="rounded-xl bg-white px-4 py-3">
                    <div className="text-[var(--ink)]">Shipped onboarding fix</div>
                    <div className="text-xs uppercase tracking-[0.2em]">Product</div>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3">
                    <div className="text-[var(--ink)]">Updated client proposal</div>
                    <div className="text-xs uppercase tracking-[0.2em]">Agency</div>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3">
                    <div className="text-[var(--ink)]">Documented API roadmap</div>
                    <div className="text-xs uppercase tracking-[0.2em]">Engineering</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border-2 border-[var(--ink)] bg-white p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                  Tomorrow
                </div>
                <div className="mt-4 grid gap-3 text-sm text-[var(--ink-soft)]">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-[var(--ink)]">Focus hours</span>
                    <span>3</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-[var(--ink)]">Priority tasks</span>
                    <span>5</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-[var(--ink)]">Team syncs</span>
                    <span>2</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="demo" className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[36px] border-2 border-[var(--ink)] bg-white p-8">
              <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>
                A timeline you can trust
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
                Every day is captured once and shared everywhere. Your work history becomes a reliable
                source of truth for performance, reviews, and project retros.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--ink-soft)]">
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Drag-and-drop updates for a clean chronological flow.
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--mint)]" />
                  Tags sync your daily work to active projects.
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--sky)]" />
                  Highlight moments for stakeholders and clients.
                </li>
              </ul>
            </div>
            <div className="rounded-[36px] border-2 border-[var(--ink)] bg-[var(--paper)] p-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Live snapshot
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                  7-day view
                </span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
                {[
                  "Mon — Research + discovery",
                  "Tue — Prototype + feedback",
                  "Wed — Build + ship",
                  "Thu — Measure + adjust",
                  "Fri — Share + archive",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4">
                    <div className="text-[var(--ink)]">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Design lead",
                quote:
                  "Our daily updates are finally consistent. Stakeholders can see progress without extra meetings.",
              },
              {
                title: "Engineering manager",
                quote:
                  "Weekly retros are easier because every detail is already logged with context and links.",
              },
              {
                title: "Founder",
                quote:
                  "Autotasking keeps the team aligned and shows momentum even when we're distributed.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border-2 border-[var(--ink)] bg-white p-6 text-sm text-[var(--ink-soft)]"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  {item.title}
                </div>
                <p className="mt-4">{item.quote}</p>
              </div>
            ))}
          </section>

          <section id="pricing" className="grid gap-8 rounded-[36px] border-2 border-[var(--ink)] bg-white p-8">
            <div className="flex flex-col gap-4 text-center">
              <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>
                Simple pricing for daily work
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
                Start solo, grow into a shared workspace, and keep your history intact.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Solo",
                  price: "$0",
                  details: ["Personal daily log", "Weekly recap email", "Basic tags"],
                },
                {
                  name: "Team",
                  price: "$12",
                  details: ["Shared workspace", "Team summaries", "Client-ready exports"],
                },
                {
                  name: "Studio",
                  price: "$28",
                  details: ["Multiple workspaces", "Advanced analytics", "Priority support"],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-[28px] border-2 border-[var(--ink)] bg-[var(--paper)] p-6 text-sm text-[var(--ink-soft)]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                    {plan.name}
                  </div>
                  <div className={`mt-4 text-3xl font-semibold text-[var(--ink)] ${display.className}`}>
                    {plan.price}
                    <span className="text-sm font-medium text-[var(--ink-soft)]"> / user</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-slate-800"
                    href="#get-started"
                  >
                    Choose plan
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6">
              <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>FAQ</h2>
              <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
                Clear answers for busy teams that want to stay aligned without extra meetings.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  q: "Is it only for teams?",
                  a: "No. Solo users can build a personal work archive and share it when needed.",
                },
                {
                  q: "How long does a daily update take?",
                  a: "Most people finish in under five minutes with prompts and quick tags.",
                },
                {
                  q: "Can I export my history?",
                  a: "Yes. Export weekly or monthly summaries in shareable formats.",
                },
                {
                  q: "Does it replace project tools?",
                  a: "It complements them by capturing progress and context in one daily feed.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-[28px] border-2 border-[var(--ink)] bg-white p-5 text-sm text-[var(--ink-soft)]"
                >
                  <div className="text-[var(--ink)]">{item.q}</div>
                  <p className="mt-2">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="get-started"
            className="flex flex-col items-center gap-6 rounded-[36px] border-2 border-[var(--ink)] bg-[var(--accent)] px-8 py-12 text-center text-white"
          >
            <h2 className={`text-3xl font-semibold uppercase ${display.className}`}>
              Make progress visible every day
            </h2>
            <p className="max-w-2xl text-base leading-7 text-white/90">
              Start a daily log for yourself or your entire team. Autotasking keeps every update in one
              beautiful, shareable place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--ink)] transition hover:bg-slate-100"
                href="/tasks"
              >
                Create a workspace
              </a>
              <a
                className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-[var(--ink)]"
                href="#"
              >
                Talk to sales
              </a>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-[var(--ink-soft)]">
            <span>Autotasking.com</span>
            <span>Daily work tracking made simple</span>
            <span>Privacy · Terms · Contact</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
