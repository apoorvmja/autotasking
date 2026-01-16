import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function isAdminBasicAuthValid(header: string | null) {
  if (!header || !header.startsWith("Basic ")) return false;
  const encoded = header.replace("Basic ", "").trim();
  try {
    const decoded = typeof atob === "function"
      ? atob(encoded)
      : Buffer.from(encoded, "base64").toString("utf8");
    return decoded === "admin:admin";
  } catch {
    return false;
  }
}

function getIstDateString(date = new Date()) {
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(date.getTime() + offsetMs);
  return istNow.toISOString().slice(0, 10);
}

function getIstBounds(date = new Date()) {
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(date.getTime() + offsetMs);
  const istStart = new Date(
    Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), 0, 0, 0),
  );
  const startUtc = new Date(istStart.getTime() - offsetMs);
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  return { start: startUtc.toISOString(), end: endUtc.toISOString() };
}

export async function GET(request: Request) {
  if (!isAdminBasicAuthValid(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskDate = getIstDateString();
  const { start, end } = getIstBounds();

  const { data: interns, error: internError } = await supabaseServer
    .from("interns")
    .select("id,username")
    .order("created_at", { ascending: false });
  if (internError) {
    return NextResponse.json({ error: internError.message }, { status: 500 });
  }

  const { count: redditTotal, error: redditTotalError } = await supabaseServer
    .from("posting_destinations")
    .select("id", { count: "exact", head: true })
    .eq("platform", "Reddit");
  if (redditTotalError) {
    return NextResponse.json({ error: redditTotalError.message }, { status: 500 });
  }

  const { count: facebookTotal, error: facebookTotalError } = await supabaseServer
    .from("posting_destinations")
    .select("id", { count: "exact", head: true })
    .eq("platform", "Facebook");
  if (facebookTotalError) {
    return NextResponse.json({ error: facebookTotalError.message }, { status: 500 });
  }

  const { count: youtubeTotal, error: youtubeTotalError } = await supabaseServer
    .from("youtube_videos")
    .select("id", { count: "exact", head: true })
    .gte("created_at", start)
    .lt("created_at", end);
  if (youtubeTotalError) {
    return NextResponse.json({ error: youtubeTotalError.message }, { status: 500 });
  }

  const { data: redditStatus, error: redditStatusError } = await supabaseServer
    .from("reddit_task_status")
    .select("intern_id,completed")
    .eq("task_date", taskDate);
  if (redditStatusError) {
    return NextResponse.json({ error: redditStatusError.message }, { status: 500 });
  }

  const { data: facebookStatus, error: facebookStatusError } = await supabaseServer
    .from("facebook_task_status")
    .select("intern_id,completed")
    .eq("task_date", taskDate);
  if (facebookStatusError) {
    return NextResponse.json({ error: facebookStatusError.message }, { status: 500 });
  }

  const { data: youtubeStatus, error: youtubeStatusError } = await supabaseServer
    .from("youtube_task_status")
    .select("intern_id,completed")
    .eq("task_date", taskDate);
  if (youtubeStatusError) {
    return NextResponse.json({ error: youtubeStatusError.message }, { status: 500 });
  }

  const redditDone = (redditStatus ?? []).reduce<Record<string, number>>((acc, row) => {
    if (row.completed) {
      acc[row.intern_id] = (acc[row.intern_id] ?? 0) + 1;
    }
    return acc;
  }, {});

  const facebookDone = (facebookStatus ?? []).reduce<Record<string, number>>((acc, row) => {
    if (row.completed) {
      acc[row.intern_id] = (acc[row.intern_id] ?? 0) + 1;
    }
    return acc;
  }, {});

  const youtubeDone = (youtubeStatus ?? []).reduce<Record<string, number>>((acc, row) => {
    if (row.completed) {
      acc[row.intern_id] = (acc[row.intern_id] ?? 0) + 1;
    }
    return acc;
  }, {});

  const totals = {
    reddit: redditTotal ?? 0,
    facebook: facebookTotal ?? 0,
    youtube: youtubeTotal ?? 0,
  };

  const results = (interns ?? []).map((intern) => {
    const reddit = {
      done: redditDone[intern.id] ?? 0,
      total: totals.reddit,
    };
    const facebook = {
      done: facebookDone[intern.id] ?? 0,
      total: totals.facebook,
    };
    const youtube = {
      done: youtubeDone[intern.id] ?? 0,
      total: totals.youtube,
    };
    const totalDone = reddit.done + facebook.done + youtube.done;
    const totalCount = reddit.total + facebook.total + youtube.total;
    return {
      id: intern.id,
      username: intern.username,
      reddit: { ...reddit, pending: Math.max(reddit.total - reddit.done, 0) },
      facebook: { ...facebook, pending: Math.max(facebook.total - facebook.done, 0) },
      youtube: { ...youtube, pending: Math.max(youtube.total - youtube.done, 0) },
      overall: {
        done: totalDone,
        total: totalCount,
        pending: Math.max(totalCount - totalDone, 0),
      },
    };
  });

  return NextResponse.json({ date: taskDate, totals, interns: results });
}
