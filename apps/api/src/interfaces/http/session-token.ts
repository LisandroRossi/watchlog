import type { Request } from "express";

const SessionCookieName = "watchlog_session";

export function sessionTokenFromRequest(request: Request): string | undefined {
  const authorization = request.header("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (authorization && /^[a-f0-9]{64}$/i.test(authorization)) return authorization;

  const cookie = request.header("cookie") ?? "";
  const sessionCookie = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SessionCookieName}=`));
  const token = sessionCookie?.slice(SessionCookieName.length + 1);
  return token && /^[a-f0-9]{64}$/i.test(token) ? token : undefined;
}

export function setSessionCookie(response: { setHeader: (name: string, value: string) => void }, token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${SessionCookieName}=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax${secure}`,
  );
}

export function clearSessionCookie(response: { setHeader: (name: string, value: string) => void }) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${SessionCookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`,
  );
}
