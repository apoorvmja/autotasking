"use client";

import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PostingDestination, Task } from "@/lib/types/schema";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const focusTips = [
  "Call out platforms: Reddit, YouTube, Facebook.",
  "Note which accounts still need posts or quizzes.",
  "Flag links or proofs that need review.",
];

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [redditDestinations, setRedditDestinations] = useState<PostingDestination[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [redditLoading, setRedditLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redditError, setRedditError] = useState<string | null>(null);
  const [promptResults, setPromptResults] = useState<
    Record<string, { title: string; description: string }>
  >({});
  const [promptLoading, setPromptLoading] = useState<Record<string, boolean>>({});
  const [promptErrors, setPromptErrors] = useState<Record<string, string | null>>({});

  const stats = useMemo(() => {
    const lastUpdate = tasks[0]?.created_at ? formatDate(tasks[0].created_at) : "No updates yet";
    return {
      total: tasks.length,
      lastUpdate,
    };
  }, [tasks]);

  const missingTable = error?.toLowerCase().includes("does not exist");
  const rlsBlocked = error?.toLowerCase().includes("row-level security");

  async function loadTasks() {
    setLoading(true);
    try {
      const response = await fetch("/api/daily-tasks", { method: "POST" });
      const data = (await response.json()) as { tasks?: Task[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load tasks.");
      }
      setTasks(data.tasks ?? []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load tasks.";
      setError(message);
      setTasks([]);
    }
    setLoading(false);
  }

  async function loadRedditDestinations() {
    setRedditLoading(true);
    const { data, error } = await supabase
      .from("posting_destinations")
      .select("id,platform,name,url,prompt,created_at")
      .eq("platform", "Reddit")
      .order("created_at", { ascending: false });
    if (error) {
      setRedditError(error.message);
      setRedditDestinations([]);
    } else {
      setRedditError(null);
      setRedditDestinations(data ?? []);
    }
    setRedditLoading(false);
  }

  async function generateSuggestion(destination: PostingDestination) {
    if (!destination.prompt) return;
    if (promptLoading[destination.id] || promptResults[destination.id]) return;
    setPromptLoading((prev) => ({ ...prev, [destination.id]: true }));
    setPromptErrors((prev) => ({ ...prev, [destination.id]: null }));
    try {
      const response = await fetch("/api/reddit-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: destination.prompt,
          destination: {
            name: destination.name,
            url: destination.url,
          },
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        setPromptErrors((prev) => ({
          ...prev,
          [destination.id]: message || "Unable to generate a draft.",
        }));
      } else {
        const data = (await response.json()) as { title: string; description: string };
        setPromptResults((prev) => ({
          ...prev,
          [destination.id]: {
            title: data.title,
            description: data.description,
          },
        }));
      }
    } catch {
      setPromptErrors((prev) => ({
        ...prev,
        [destination.id]: "Network error while generating the draft.",
      }));
    } finally {
      setPromptLoading((prev) => ({ ...prev, [destination.id]: false }));
    }
  }


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save task.");
      }
      setDraft("");
      setError(null);
      await loadTasks();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save task.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void loadTasks();
    void loadRedditDestinations();
  }, []);

  useEffect(() => {
    if (redditLoading || redditDestinations.length === 0) return;
    redditDestinations.forEach((destination) => {
      if (destination.prompt?.trim()) {
        void generateSuggestion(destination);
      }
    });
  }, [redditLoading, redditDestinations]);

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
        <div className="pointer-events-none absolute -left-20 top-8 h-60 w-60 rounded-[46px] bg-[var(--sun)]/60" />
        <div className="pointer-events-none absolute right-6 top-24 h-40 w-40 rounded-[34px] bg-[var(--mint)]/60" />
        <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-10 sm:px-10 lg:px-16">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Link
                className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]"
                href="/"
              >
                Back to landing
              </Link>
              <h1 className={`mt-4 text-3xl font-semibold uppercase ${display.className}`}>
                Daily tasks
              </h1>
              <p className="mt-2 max-w-xl text-base leading-7 text-[var(--ink-soft)]">
                Review what needs to go live today, from posts to quizzes across every platform you
                manage.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              <div className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1">
                {stats.total} tasks
              </div>
              <div className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1">
                Last task: {stats.lastUpdate}
              </div>
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Daily checklist
              </div>
              <h2 className={`mt-4 text-2xl font-semibold uppercase ${display.className}`}>
                What needs to go live?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                Add tasks tied to posting, quizzes, or scheduling across Reddit, YouTube, Facebook, and
                other channels.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <textarea
                  className="min-h-[120px] w-full resize-none rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
                  placeholder="Post quiz to r/marketing, schedule YouTube short, share recap on Facebook."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                    type="submit"
                    disabled={saving || !draft.trim()}
                  >
                    {saving ? "Saving" : "Add update"}
                  </button>
                  <button
                    className="rounded-full border-2 border-[var(--ink)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                    type="button"
                    onClick={() => void loadTasks()}
                  >
                    Refresh
                  </button>
                </div>
              </form>
              <div className="mt-6 grid gap-3 rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--accent-soft)] p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Quick tips
                </div>
                {focusTips.map((tip) => (
                  <div key={tip} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
              {error && (
                <div className="mt-6 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                    Supabase notice
                  </div>
                  <p className="mt-2">{error}</p>
                  {missingTable && (
                    <div className="mt-4 rounded-xl bg-[var(--paper)] p-3 text-xs text-[var(--ink)]">
                      Create table: id uuid primary key default gen_random_uuid(), title text not null,
                      created_at timestamptz default now()
                    </div>
                  )}
                  {rlsBlocked && (
                    <p className="mt-2 text-xs">
                      Enable select/insert policies for the tasks table to allow updates.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Assigned tasks
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                  {tasks.length} total
                </span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
                {loading && <div className="rounded-2xl bg-[var(--paper)] p-4">Loading updates...</div>}
                {!loading && tasks.length === 0 && (
                  <div className="rounded-2xl bg-[var(--paper)] p-4">
                    No tasks yet. Add your first task to get started.
                  </div>
                )}
                {!loading &&
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] p-4"
                    >
                      <div className="text-[var(--ink)]">{task.title}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.25em]">
                        {formatDate(task.created_at)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              Reddit post drafts
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                {redditDestinations.length} groups
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
              Drafts generate automatically for each subreddit when you open this page.
            </p>
            <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
              {redditLoading && (
                <div className="rounded-2xl bg-[var(--paper)] p-4">Loading Reddit groups...</div>
              )}
              {!redditLoading && redditDestinations.length === 0 && (
                <div className="rounded-2xl bg-[var(--paper)] p-4">
                  No Reddit groups yet. Ask the admin to add destinations and prompts.
                </div>
              )}
              {!redditLoading &&
                redditDestinations.map((destination) => {
                  const result = promptResults[destination.id];
                  const hasPrompt = Boolean(destination.prompt?.trim());
                  return (
                    <div
                      key={destination.id}
                      className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[var(--ink)]">{destination.name}</div>
                        <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                          Reddit
                        </span>
                      </div>
                      {destination.url && (
                        <a
                          className="mt-2 block text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                          href={destination.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {destination.url}
                        </a>
                      )}
                      {!hasPrompt && (
                        <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                          Prompt missing
                        </div>
                      )}
                      {promptErrors[destination.id] && (
                        <div className="mt-3 text-xs text-red-600">
                          {promptErrors[destination.id]}
                        </div>
                      )}
                      {hasPrompt && promptLoading[destination.id] && (
                        <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                          Generating draft...
                        </div>
                      )}
                      {result ? (
                        <div className="mt-4 grid gap-3 rounded-2xl border border-[var(--ink)]/10 bg-white p-4">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                              Suggested title
                            </div>
                            <div className="mt-2 text-[var(--ink)]">{result.title}</div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                              Suggested description
                            </div>
                            <p className="mt-2 text-[var(--ink)]">{result.description}</p>
                          </div>
                        </div>
                      ) : (
                        hasPrompt &&
                        !promptLoading[destination.id] &&
                        !promptErrors[destination.id] && (
                          <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                            Draft will appear automatically.
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
            </div>
            {redditError && (
              <div className="mt-6 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Supabase notice
                </div>
                <p className="mt-2">{redditError}</p>
              </div>
            )}
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Platform checklist",
                copy: "Keep Reddit, YouTube, Facebook, and more in one view.",
              },
              {
                title: "Quiz cadence",
                copy: "Track which accounts still need quizzes or polls today.",
              },
              {
                title: "Proof links",
                copy: "Attach URLs or screenshots for verification and review.",
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
