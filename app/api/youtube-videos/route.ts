import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, decodeAuthCookie } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

const BUCKET = "youtube-video-storage-bucket";

type VideoRow = {
  id: string;
  destination_id: string;
  title: string;
  description: string;
  file_path: string;
  created_at: string | null;
};

function hasAdminAuth(header: string | null) {
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

async function requireAuth(request: Request) {
  if (hasAdminAuth(request.headers.get("authorization"))) {
    return { isAdmin: true };
  }
  const cookieStore = await cookies();
  const auth = decodeAuthCookie(cookieStore.get(AUTH_COOKIE)?.value);
  if (!auth) return null;
  return { isAdmin: false, internId: auth.id };
}

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("youtube_videos")
    .select("id,destination_id,title,description,file_path,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as VideoRow[];
  const withUrls = await Promise.all(
    rows.map(async (row) => {
      const { data: urlData, error: urlError } = await supabaseServer.storage
        .from(BUCKET)
        .createSignedUrl(row.file_path, 60 * 60);
      return {
        ...row,
        download_url: urlError ? null : urlData?.signedUrl ?? null,
      };
    }),
  );

  return NextResponse.json({ videos: withUrls });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const destinationId = String(form.get("destinationId") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const file = form.get("file");

  if (!destinationId || !title || !description || !(file instanceof File)) {
    return NextResponse.json({ error: "destinationId, title, description, and file are required." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `youtube/${destinationId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabaseServer.storage
    .from(BUCKET)
    .upload(filePath, file, { contentType: file.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { error: insertError } = await supabaseServer.from("youtube_videos").insert({
    destination_id: destinationId,
    title,
    description,
    file_path: filePath,
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("youtube_videos")
    .select("id,file_path")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }

  const { error: storageError } = await supabaseServer.storage.from(BUCKET).remove([data.file_path]);
  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { error: deleteError } = await supabaseServer.from("youtube_videos").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
