import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, decodeAuthCookie } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type Destination = {
  platform: string;
  name: string;
  url: string | null;
};

type TaskRow = {
  id: string;
  title: string;
  created_at: string | null;
};

function extractContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as {
    choices?: { message?: { content?: string } }[];
    output_text?: string;
  };
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  if (typeof data.output_text === "string") return data.output_text;
  return "";
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

async function fetchTasksForToday(internId: string): Promise<TaskRow[]> {
  const { start, end } = getIstBounds();
  const { data, error } = await supabaseServer
    .from("tasks")
    .select("id,title,created_at")
    .eq("intern_id", internId)
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

async function fetchDestinations(): Promise<Destination[]> {
  const { data, error } = await supabaseServer
    .from("posting_destinations")
    .select("platform,name,url")
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Destination[];
}

async function generateTasks(destinations: Destination[]) {
  const apiKey = process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
  const apiUrl =
    process.env.LLM_API_URL ??
    process.env.OPENAI_BASE_URL ??
    "https://api.openai.com/v1/chat/completions";
  const model = process.env.LLM_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4.1";

  if (!apiKey) {
    throw new Error("Missing LLM_API_KEY or OPENAI_API_KEY.");
  }

  const systemPrompt =
    "You generate daily intern task lists. Create exactly one task per destination. " +
    "Each task must start with an action verb, mention the platform and destination name, " +
    "and be 8-14 words. Use the provided destinations only. Return JSON only.";

  const userPrompt =
    "Destinations:\n" +
    JSON.stringify(
      destinations.map((destination) => ({
        platform: destination.platform,
        name: destination.name,
        url: destination.url ?? "",
      })),
      null,
      2,
    );

  const schema = {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
          },
          required: ["title"],
          additionalProperties: false,
        },
      },
    },
    required: ["tasks"],
    additionalProperties: false,
  } as const;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "daily_tasks",
          schema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText.slice(0, 500));
  }

  const payload = (await response.json()) as unknown;
  const content = extractContent(payload);
  const parsed = JSON.parse(content) as { tasks?: { title?: string }[] };
  const titles = (parsed.tasks ?? [])
    .map((task) => task.title?.trim())
    .filter((title): title is string => Boolean(title));

  if (!titles.length) {
    throw new Error("LLM response did not include any tasks.");
  }

  return titles;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const auth = decodeAuthCookie(cookieStore.get(AUTH_COOKIE)?.value);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingTasks = await fetchTasksForToday(auth.id);
    if (existingTasks.length > 0) {
      return NextResponse.json({ tasks: existingTasks, generated: false });
    }

    const destinations = await fetchDestinations();
    if (destinations.length === 0) {
      return NextResponse.json({ tasks: [], generated: false });
    }

    const titles = await generateTasks(destinations);
    const inserts = titles.map((title) => ({ title, intern_id: auth.id }));
    const { error } = await supabaseServer.from("tasks").insert(inserts);
    if (error) {
      throw new Error(error.message);
    }

    const refreshed = await fetchTasksForToday(auth.id);
    return NextResponse.json({ tasks: refreshed, generated: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate tasks.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
