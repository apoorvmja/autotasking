"use client";

import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { useState, type FormEvent } from "react";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Login failed.");
        setLoading(false);
        return;
      }
      window.location.href = "/tasks";
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen ${body.className} bg-[var(--paper)] text-[var(--ink)]`}
      style={{
        "--ink": "#0f172a",
        "--ink-soft": "#475569",
        "--paper": "#f8fafc",
        "--surface": "#ffffff",
        "--accent": "#f97316",
        "--accent-soft": "#ffedd5",
        "--mint": "#14b8a6",
        "--sky": "#38bdf8",
        "--sun": "#facc15",
      }}
    >
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff,_#f8fafc_35%,_#e2e8f0_100%)]">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-[48px] bg-[var(--sun)]/70 blur-[1px]" />
        <div className="pointer-events-none absolute right-10 top-28 h-44 w-44 rounded-[36px] bg-[var(--mint)]/70" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-[46px] bg-[var(--sky)]/70" />

        <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 pb-24 pt-10 sm:px-10 lg:px-16">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div className={`text-base font-semibold text-[var(--ink)] ${display.className}`}>
              autotasking.com
            </div>
            <Link
              className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
              href="/"
            >
              Back to landing
            </Link>
          </header>

          <section className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center gap-6">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--ink-soft)]">
                Intern sign-in
              </div>
              <h1 className={`text-4xl font-semibold uppercase ${display.className}`}>
                Access today's tasks
              </h1>
              <p className="max-w-md text-base leading-7 text-[var(--ink-soft)]">
                Use the shared test credentials to unlock the daily task dashboard and Reddit drafts.
              </p>
            </div>

            <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Login
              </div>
              <h2 className={`mt-4 text-2xl font-semibold uppercase ${display.className}`}>
                Intern access
              </h2>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Username
                  </label>
                  <input
                    className="w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                  type="submit"
                  disabled={loading || !username.trim() || !password.trim()}
                >
                  {loading ? "Signing in" : "Sign in"}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
