import { NextResponse } from "next/server";

type PromptRequest = {
  prompt?: string;
  destination?: {
    name?: string;
    url?: string | null;
  };
};

function interpolatePrompt(prompt: string, name: string, url: string) {
  return prompt.replaceAll("{{group}}", name).replaceAll("{{url}}", url).trim();
}

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

export async function POST(request: Request) {
  let body: PromptRequest;
  try {
    body = (await request.json()) as PromptRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawPrompt = body.prompt?.trim();
  const name = body.destination?.name?.trim();
  if (!rawPrompt || !name) {
    return NextResponse.json({ error: "Prompt and destination name are required." }, { status: 400 });
  }

  const url = body.destination?.url?.trim() ?? "";
  const apiKey = process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
  const apiUrl =
    process.env.LLM_API_URL ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1/chat/completions";
  const model = process.env.LLM_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4.1";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing LLM_API_KEY or OPENAI_API_KEY." }, { status: 500 });
  }

  const userPrompt = interpolatePrompt(rawPrompt, name, url);
  const systemPrompt =
    "You write Reddit post drafts for interns. Return only JSON. " +
    "Title: max 90 characters. Description: 2-4 sentences, no hashtags, no markdown.";

  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
    },
    required: ["title", "description"],
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
        {
          role: "user",
          content: `${userPrompt}\n\nDestination: ${name}${url ? `\nURL: ${url}` : ""}`,
        },
      ],
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reddit_draft",
          schema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "LLM request failed.", details: errorText.slice(0, 500) },
      { status: 500 },
    );
  }

  const payload = (await response.json()) as unknown;
  const content = extractContent(payload);
  let parsed: { title?: string; description?: string } | null = null;

  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = null;
      }
    }
  }

  if (!parsed?.title || !parsed?.description) {
    return NextResponse.json(
      { error: "LLM response did not include title and description." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    title: String(parsed.title).trim(),
    description: String(parsed.description).trim(),
  });
}
