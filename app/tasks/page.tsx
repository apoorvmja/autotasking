"use client";

import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PostingDestination, YoutubeVideo } from "@/lib/types/schema";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function TasksPage() {
  const [redditDestinations, setRedditDestinations] = useState<PostingDestination[]>([]);
  const [facebookDestinations, setFacebookDestinations] = useState<PostingDestination[]>([]);
  const [youtubeDestinations, setYoutubeDestinations] = useState<PostingDestination[]>([]);
  const [redditLoading, setRedditLoading] = useState(true);
  const [facebookLoading, setFacebookLoading] = useState(true);
  const [redditError, setRedditError] = useState<string | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);
  const [promptResults, setPromptResults] = useState<
    Record<string, { title: string; description: string }>
  >({});
  const [promptLoading, setPromptLoading] = useState<Record<string, boolean>>({});
  const [promptErrors, setPromptErrors] = useState<Record<string, string | null>>({});
  const [copied, setCopied] = useState<Record<string, { title?: boolean; description?: boolean }>>(
    {},
  );
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState<Record<string, boolean>>({});
  const [facebookStatusMap, setFacebookStatusMap] = useState<Record<string, boolean>>({});
  const [facebookStatusLoading, setFacebookStatusLoading] = useState(true);
  const [facebookStatusError, setFacebookStatusError] = useState<string | null>(null);
  const [facebookStatusSaving, setFacebookStatusSaving] = useState<Record<string, boolean>>({});
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [youtubeLoading, setYoutubeLoading] = useState(true);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [youtubeStatusMap, setYoutubeStatusMap] = useState<Record<string, boolean>>({});
  const [youtubeStatusLoading, setYoutubeStatusLoading] = useState(true);
  const [youtubeStatusError, setYoutubeStatusError] = useState<string | null>(null);
  const [youtubeStatusSaving, setYoutubeStatusSaving] = useState<Record<string, boolean>>({});

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

  async function loadFacebookDestinations() {
    setFacebookLoading(true);
    const { data, error } = await supabase
      .from("posting_destinations")
      .select("id,platform,name,url,prompt,created_at")
      .eq("platform", "Facebook")
      .order("created_at", { ascending: false });
    if (error) {
      setFacebookError(error.message);
      setFacebookDestinations([]);
    } else {
      setFacebookError(null);
      setFacebookDestinations(data ?? []);
    }
    setFacebookLoading(false);
  }

  async function loadYoutubeDestinations() {
    const { data, error } = await supabase
      .from("posting_destinations")
      .select("id,platform,name,url,prompt,created_at")
      .eq("platform", "YouTube")
      .order("created_at", { ascending: false });
    if (error) {
      setYoutubeDestinations([]);
    } else {
      setYoutubeDestinations(data ?? []);
    }
  }

  async function loadStatus() {
    setStatusLoading(true);
    try {
      const response = await fetch("/api/reddit-status");
      const data = (await response.json()) as {
        items?: { destination_id: string; completed: boolean }[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load status.");
      }
      const nextMap = (data.items ?? []).reduce<Record<string, boolean>>((acc, item) => {
        acc[item.destination_id] = item.completed;
        return acc;
      }, {});
      setStatusMap(nextMap);
      setStatusError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load status.";
      setStatusError(message);
    }
    setStatusLoading(false);
  }

  async function loadFacebookStatus() {
    setFacebookStatusLoading(true);
    try {
      const response = await fetch("/api/facebook-status");
      const data = (await response.json()) as {
        items?: { destination_id: string; completed: boolean }[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load status.");
      }
      const nextMap = (data.items ?? []).reduce<Record<string, boolean>>((acc, item) => {
        acc[item.destination_id] = item.completed;
        return acc;
      }, {});
      setFacebookStatusMap(nextMap);
      setFacebookStatusError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load status.";
      setFacebookStatusError(message);
    }
    setFacebookStatusLoading(false);
  }

  async function loadYoutubeVideos() {
    setYoutubeLoading(true);
    try {
      const response = await fetch("/api/youtube-videos");
      const data = (await response.json()) as { videos?: YoutubeVideo[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load videos.");
      }
      setYoutubeVideos(data.videos ?? []);
      setYoutubeError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load videos.";
      setYoutubeError(message);
      setYoutubeVideos([]);
    }
    setYoutubeLoading(false);
  }

  async function loadYoutubeStatus() {
    setYoutubeStatusLoading(true);
    try {
      const response = await fetch("/api/youtube-status");
      const data = (await response.json()) as {
        items?: { video_id: string; completed: boolean }[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load status.");
      }
      const nextMap = (data.items ?? []).reduce<Record<string, boolean>>((acc, item) => {
        acc[item.video_id] = item.completed;
        return acc;
      }, {});
      setYoutubeStatusMap(nextMap);
      setYoutubeStatusError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load status.";
      setYoutubeStatusError(message);
    }
    setYoutubeStatusLoading(false);
  }

  async function toggleYoutubeStatus(videoId: string) {
    const nextCompleted = !youtubeStatusMap[videoId];
    setYoutubeStatusSaving((prev) => ({ ...prev, [videoId]: true }));
    setYoutubeStatusMap((prev) => ({ ...prev, [videoId]: nextCompleted }));
    try {
      const response = await fetch("/api/youtube-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, completed: nextCompleted }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update status.");
      }
      setYoutubeStatusError(null);
    } catch (err) {
      setYoutubeStatusMap((prev) => ({ ...prev, [videoId]: !nextCompleted }));
      const message = err instanceof Error ? err.message : "Unable to update status.";
      setYoutubeStatusError(message);
    } finally {
      setYoutubeStatusSaving((prev) => ({ ...prev, [videoId]: false }));
    }
  }

  async function toggleStatus(destinationId: string) {
    const nextCompleted = !statusMap[destinationId];
    setStatusSaving((prev) => ({ ...prev, [destinationId]: true }));
    setStatusMap((prev) => ({ ...prev, [destinationId]: nextCompleted }));
    try {
      const response = await fetch("/api/reddit-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId, completed: nextCompleted }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update status.");
      }
      setStatusError(null);
    } catch (err) {
      setStatusMap((prev) => ({ ...prev, [destinationId]: !nextCompleted }));
      const message = err instanceof Error ? err.message : "Unable to update status.";
      setStatusError(message);
    } finally {
      setStatusSaving((prev) => ({ ...prev, [destinationId]: false }));
    }
  }

  async function toggleFacebookStatus(destinationId: string) {
    const nextCompleted = !facebookStatusMap[destinationId];
    setFacebookStatusSaving((prev) => ({ ...prev, [destinationId]: true }));
    setFacebookStatusMap((prev) => ({ ...prev, [destinationId]: nextCompleted }));
    try {
      const response = await fetch("/api/facebook-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId, completed: nextCompleted }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update status.");
      }
      setFacebookStatusError(null);
    } catch (err) {
      setFacebookStatusMap((prev) => ({ ...prev, [destinationId]: !nextCompleted }));
      const message = err instanceof Error ? err.message : "Unable to update status.";
      setFacebookStatusError(message);
    } finally {
      setFacebookStatusSaving((prev) => ({ ...prev, [destinationId]: false }));
    }
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

  async function handleCopy(id: string, value: string, field: "title" | "description") {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), [field]: true },
      }));
      window.setTimeout(() => {
        setCopied((prev) => ({
          ...prev,
          [id]: { ...(prev[id] ?? {}), [field]: false },
        }));
      }, 1600);
    } catch {
      // ignore clipboard errors
    }
  }


  useEffect(() => {
    void loadRedditDestinations();
    void loadStatus();
    void loadFacebookDestinations();
    void loadFacebookStatus();
    void loadYoutubeDestinations();
    void loadYoutubeVideos();
    void loadYoutubeStatus();
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
                Daily workflow
              </h1>
              <p className="mt-2 max-w-xl text-base leading-7 text-[var(--ink-soft)]">
                Reddit drafts, Facebook moderation steps, and YouTube uploads in one place.
              </p>
            </div>
          </header>

          <section className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              Reddit post drafts
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                  {redditDestinations.length} groups
                </span>
                <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-[var(--ink)]">
                  {redditDestinations.filter((item) => statusMap[item.id]).length} done
                </span>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
              Drafts generate automatically for each subreddit when you open this page.
            </p>
            {statusLoading && (
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                Syncing status...
              </div>
            )}
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
                  const isDone = Boolean(statusMap[destination.id]);
                  return (
                    <div
                      key={destination.id}
                      className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[var(--ink)]">{destination.name}</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                            Reddit
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                              isDone
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isDone ? "Done" : "Pending"}
                          </span>
                          <button
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            disabled={statusSaving[destination.id]}
                            onClick={() => void toggleStatus(destination.id)}
                          >
                            {statusSaving[destination.id]
                              ? "Saving"
                              : isDone
                                ? "Mark not done"
                                : "Mark done"}
                          </button>
                        </div>
                      </div>
                      {destination.url && (
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <a
                            className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                            href={destination.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {destination.url}
                          </a>
                          <a
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                            href={destination.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </a>
                        </div>
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
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-[var(--ink)]">
                              <div>{result.title}</div>
                              <button
                                className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                                type="button"
                                onClick={() => void handleCopy(destination.id, result.title, "title")}
                              >
                                {copied[destination.id]?.title ? "Copied" : "Copy title"}
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                              Suggested description
                            </div>
                            <div className="mt-2 flex flex-col gap-3 text-[var(--ink)]">
                              <p>{result.description}</p>
                              <button
                                className="w-fit rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                                type="button"
                                onClick={() =>
                                  void handleCopy(destination.id, result.description, "description")
                                }
                              >
                                {copied[destination.id]?.description ? "Copied" : "Copy description"}
                              </button>
                            </div>
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
            {statusError && (
              <div className="mt-4 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Status notice
                </div>
                <p className="mt-2">{statusError}</p>
              </div>
            )}
          </section>

          <section className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              YouTube uploads
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                  {youtubeVideos.length} videos
                </span>
                <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-[var(--ink)]">
                  {youtubeVideos.filter((video) => youtubeStatusMap[video.id]).length} done
                </span>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
              Download the assigned video and upload it to the correct YouTube channel.
            </p>
            {youtubeStatusLoading && (
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                Syncing status...
              </div>
            )}
            <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
              {youtubeLoading && (
                <div className="rounded-2xl bg-[var(--paper)] p-4">Loading videos...</div>
              )}
              {!youtubeLoading && youtubeVideos.length === 0 && (
                <div className="rounded-2xl bg-[var(--paper)] p-4">
                  No videos available yet. Check back after the admin uploads today’s files.
                </div>
              )}
              {!youtubeLoading &&
                youtubeVideos.map((video) => {
                  const destination = [...youtubeDestinations].find(
                    (item) => item.id === video.destination_id,
                  );
                  const isDone = Boolean(youtubeStatusMap[video.id]);
                  return (
                    <div
                      key={video.id}
                      className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[var(--ink)]">{video.title}</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                            YouTube
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                              isDone
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isDone ? "Done" : "Pending"}
                          </span>
                          <button
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            disabled={youtubeStatusSaving[video.id]}
                            onClick={() => void toggleYoutubeStatus(video.id)}
                          >
                            {youtubeStatusSaving[video.id]
                              ? "Saving"
                              : isDone
                                ? "Mark not done"
                                : "Mark done"}
                          </button>
                          <button
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                            type="button"
                            onClick={() => void handleCopy(video.id, video.title, "title")}
                          >
                            {copied[video.id]?.title ? "Copied" : "Copy title"}
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                        {destination?.name ?? "YouTube channel"}
                      </div>
                      <div className="mt-3 flex flex-col gap-3 text-[var(--ink)]">
                        <p className="text-sm text-[var(--ink-soft)]">{video.description}</p>
                        <button
                          className="w-fit rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                          type="button"
                          onClick={() => void handleCopy(video.id, video.description, "description")}
                        >
                          {copied[video.id]?.description ? "Copied" : "Copy description"}
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {destination?.url && (
                          <a
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                            href={destination.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open channel
                          </a>
                        )}
                        {video.download_url ? (
                          <a
                            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-600"
                            href={video.download_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download video
                          </a>
                        ) : (
                          <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                            Download link unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            {youtubeError && (
              <div className="mt-6 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  YouTube notice
                </div>
                <p className="mt-2">{youtubeError}</p>
              </div>
            )}
            {youtubeStatusError && (
              <div className="mt-4 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Status notice
                </div>
                <p className="mt-2">{youtubeStatusError}</p>
              </div>
            )}
          </section>

          <section className="rounded-[32px] border-2 border-[var(--ink)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              Facebook group moderation
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--ink)]">
                  {facebookDestinations.length} groups
                </span>
                <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-[var(--ink)]">
                  {facebookDestinations.filter((item) => facebookStatusMap[item.id]).length} done
                </span>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
              For each group: sort by newest, open the top 5 posts, and remove spam comments.
            </p>
            {facebookStatusLoading && (
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">
                Syncing status...
              </div>
            )}
            <div className="mt-6 space-y-4 text-sm text-[var(--ink-soft)]">
              {facebookLoading && (
                <div className="rounded-2xl bg-[var(--paper)] p-4">Loading Facebook groups...</div>
              )}
              {!facebookLoading && facebookDestinations.length === 0 && (
                <div className="rounded-2xl bg-[var(--paper)] p-4">
                  No Facebook groups yet. Ask the admin to add destinations.
                </div>
              )}
              {!facebookLoading &&
                facebookDestinations.map((destination) => {
                  const isDone = Boolean(facebookStatusMap[destination.id]);
                  return (
                    <div
                      key={destination.id}
                      className="rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--paper)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[var(--ink)]">{destination.name}</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                            Facebook
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                              isDone
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isDone ? "Done" : "Pending"}
                          </span>
                          <button
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            disabled={facebookStatusSaving[destination.id]}
                            onClick={() => void toggleFacebookStatus(destination.id)}
                          >
                            {facebookStatusSaving[destination.id]
                              ? "Saving"
                              : isDone
                                ? "Mark not done"
                                : "Mark done"}
                          </button>
                        </div>
                      </div>
                      {destination.url && (
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <a
                            className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                            href={destination.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {destination.url}
                          </a>
                          <a
                            className="rounded-full border border-[var(--ink)]/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                            href={destination.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </a>
                        </div>
                      )}
                      <div className="mt-4 grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                        <span>Step 1: Sort posts by newest</span>
                        <span>Step 2: Open the top 5 newest posts</span>
                        <span>Step 3: Remove spam comments</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            {facebookError && (
              <div className="mt-6 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Supabase notice
                </div>
                <p className="mt-2">{facebookError}</p>
              </div>
            )}
            {facebookStatusError && (
              <div className="mt-4 rounded-2xl border-2 border-[var(--ink)]/10 bg-white p-4 text-sm text-[var(--ink-soft)]">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">
                  Status notice
                </div>
                <p className="mt-2">{facebookStatusError}</p>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
