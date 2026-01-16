import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, encodeAuthCookie } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginPayload;
  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password?.trim() ?? "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("interns")
    .select("id,username,password")
    .eq("username", username)
    .limit(1)
    .maybeSingle();
  if (error || !data || data.password !== password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = encodeAuthCookie({ id: data.id, username: data.username });
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}
