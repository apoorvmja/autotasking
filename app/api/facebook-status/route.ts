import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, decodeAuthCookie } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type StatusPayload = {
  destinationId?: string;
  completed?: boolean;
};

function getIstDateString(date = new Date()) {
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(date.getTime() + offsetMs);
  return istNow.toISOString().slice(0, 10);
}

async function requireAuth() {
  const cookieStore = await cookies();
  const auth = decodeAuthCookie(cookieStore.get(AUTH_COOKIE)?.value);
  if (!auth) {
    return null;
  }
  return auth;
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskDate = getIstDateString();
  const { data, error } = await supabaseServer
    .from("facebook_task_status")
    .select("destination_id,completed")
    .eq("intern_id", auth.id)
    .eq("task_date", taskDate);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: StatusPayload;
  try {
    body = (await request.json()) as StatusPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const destinationId = body.destinationId?.trim() ?? "";
  const completed = Boolean(body.completed);
  if (!destinationId) {
    return NextResponse.json({ error: "destinationId is required." }, { status: 400 });
  }

  const taskDate = getIstDateString();
  const { error } = await supabaseServer
    .from("facebook_task_status")
    .upsert(
      {
        intern_id: auth.id,
        destination_id: destinationId,
        task_date: taskDate,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: "intern_id,destination_id,task_date" },
    );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, completed });
}
