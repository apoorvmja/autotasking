import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, decodeAuthCookie } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type TaskPayload = {
  title?: string;
};

export async function POST(request: Request) {
  let body: TaskPayload;
  try {
    body = (await request.json()) as TaskPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = body.title?.trim() ?? "";
  if (!title) {
    return NextResponse.json({ error: "Task title is required." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const auth = decodeAuthCookie(cookieStore.get(AUTH_COOKIE)?.value);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseServer.from("tasks").insert({ title, intern_id: auth.id });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
