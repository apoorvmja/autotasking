import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type InternPayload = {
  username?: string;
  password?: string;
};

export async function GET() {
  const { data, error } = await supabaseServer
    .from("interns")
    .select("id,username,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ interns: data ?? [] });
}

export async function POST(request: Request) {
  let body: InternPayload;
  try {
    body = (await request.json()) as InternPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password?.trim() ?? "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const { error } = await supabaseServer.from("interns").insert({ username, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
