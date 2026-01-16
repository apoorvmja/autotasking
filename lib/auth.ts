export const AUTH_COOKIE = "autotasking_auth";

export type AuthPayload = {
  id: string;
  username: string;
};

export function encodeAuthCookie(payload: AuthPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

export function decodeAuthCookie(value: string | undefined) {
  if (!value) return null;
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as AuthPayload;
    if (!parsed?.id || !parsed?.username) return null;
    return parsed;
  } catch {
    return null;
  }
}
