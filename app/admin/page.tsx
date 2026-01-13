"use client";

import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Platform, PostingDestination } from "@/lib/types/schema";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const platformOptions: Platform[] = ["Reddit", "Facebook", "YouTube", "Other"];

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function AdminPage() {
  const [destinations, setDestinations] = useState<PostingDestination[]>([]);
  const [platform, setPlatform] = useState<Platform>("Reddit");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const lastAdded = destinations[0]?.created_at
      ? formatDate(destinations[0].created_at)
      : "No destinations yet";
    const counts = destinations.reduce<Record<string, number>>((acc, item) => {
      acc[item.platform] = (acc[item.platform] ?? 0) + 1;
      return acc;
    }, {});
    return { total: destinations.length, lastAdded, counts };
  }, [destinations]);

  const missingTable = error?.toLowerCase().includes("does not exist");
  const rlsBlocked = error?.toLowerCase().includes("row-level security");

  async function loadDestinations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posting_destinations")
      .select("id,platform,name,url,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setDestinations([]);
    } else {
      setError(null);
      setDestinations(data ?? []);
    }
    setLoading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setSaving(true);
    const payload = { platform, name: trimmedName, url: url.trim() || null };
    const { error } = await supabase.from("posting_destinations").insert(payload);
    if (error) {
      setError(error.message);
    } else {
      setPlatform("Reddit");
      setName("");
      setUrl("");
      setError(null);
      await loadDestinations();
    }
    setSaving(false);
  }

  useEffect(() => {
    void loadDestinations();
  }, []);

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
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-[48px] bg-[var(--sky)]/60" />
        <div className="pointer-events-none absolute right-10 top-24 h-44 w-44 rounded-[36px] bg-[var(--sun)]/60" />
        <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-16">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                <Link className="transition hover:text-[var(--ink)]" href="/">
                  Back to landing
                </Link>
                <Link className="transition hover:text-[var(--ink)]" href="/tasks">
                  View tasks
                </Link>
              </div>
              <h1 className={`text-3xl font-semibold uppercase ${display.className}`}>
                Admin: posting destinations
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--ink-soft)]">
                Add and manage the Reddit groups, Facebook groups, and YouTube channels to cover daily.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              <div className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1">
                {stats.total} destinations
              </div>
              <div className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1">
                Last added: {stats.lastAdded}
              </div>
              {["Reddit", "Facebook", "YouTube"].map((item) => (
                <div
                  key={item}
                  className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1"
                >
                  {item}: {stats.counts[item] ?? 0}
                </div>
              ))}
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Add destination
              </div>
              <h2 className={`mt-4 text-2xl font-semibold uppercase ${display.className}`}>
                Store posting destinations
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                Save every community or channel you want covered so interns can quickly reference the list.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Platform
                  </label>
                  <select
                    className="w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
                    value={platform}
                    onChange={(event) => setPlatform(event.target.value as Platform)}
                  >
                    {platformOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Group or channel name
                  </label>
                  <input
                    className="w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
                    placeholder="r/marketing, Growth Community, Autotasking Tips"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                    Link (optional)
                  </label>
                  <input
                    className="w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
                    placeholder="https://reddit.com/r/marketing or https://youtube.com/@channel"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                    type="submit"
                    disabled={saving || !name.trim()}
                  >
                    {saving ? "Saving" : "Add destination"}
                  </button>
                  <button
                    className="rounded-full border-2 border-[var(--ink)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                    type="button"
                    onClick={() => void loadDestinations()}
                  >
                    Refresh
                  </button>
                </div>
              </form>
              {error && (
                <div className="mt-6 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                    Supabase notice
                  </div>
                  <p className="mt-2">{error}</p>
                  {missingTable && (
                    <div className="mt-4 rounded-xl bg-[var(--paper)] p-3 text-xs text-[var(--ink)]">
                      Create table: id uuid primary key default gen_random_uuid(), platform text not null,
                      name text not null, url text, created_at timestamptz default now()
                    </div>
                  )}
                  {rlsBlocked && (
                    <p className="mt-2 text-xs">
                      Enable select/insert policies for the posting_destinations table to allow updates.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Destination list
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                  {destinations.length} total
                </span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
                {loading && (
                  <div className="rounded-2xl bg-[var(--paper)] p-4">Loading destinations...</div>
                )}
                {!loading && destinations.length === 0 && (
                  <div className="rounded-2xl bg-[var(--paper)] p-4">
                    No destinations yet. Add your first group or channel to get started.
                  </div>
                )}
                {!loading &&
                  destinations.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[var(--ink)]">{group.name}</div>
                        <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                          {group.platform}
                        </span>
                      </div>
                      {group.url && (
                        <a
                          className="mt-2 block text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                          href={group.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {group.url}
                        </a>
                      )}
                      <div className="mt-2 text-xs uppercase tracking-[0.25em]">
                        Added {formatDate(group.created_at)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Posting coverage",
                copy: "Track which communities and channels are active each week.",
              },
              {
                title: "Clear priorities",
                copy: "Sort by urgency in your task list and match the right platform.",
              },
              {
                title: "Faster onboarding",
                copy: "New interns see the exact places to post and quiz.",
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
          </section>
        </main>
      </div>
    </div>
  );
}
