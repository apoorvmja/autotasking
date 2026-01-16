export const AUTH_COOKIE = "autotasking_auth";

export function getAuthToken() {
  return process.env.AUTH_TOKEN ?? "autotasking";
}

export function getAuthUser() {
  return process.env.APP_USERNAME ?? "intern";
}

export function getAuthPass() {
  return process.env.APP_PASSWORD ?? "intern";
}

export function verifyCredentials(username: string, password: string) {
  return username === getAuthUser() && password === getAuthPass();
}
