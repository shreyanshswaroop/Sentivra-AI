import { createHmac, timingSafeEqual } from "crypto";
import { requireServerEnv } from "./env";

type JwtPayload = {
  userId: string;
  exp?: number;
  iat?: number;
};

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function signValue(value: string) {
  return base64UrlEncode(
    createHmac("sha256", requireServerEnv("JWT_SECRET")).update(value).digest()
  );
}

export function createAuthToken(userId: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({ userId, iat: now, exp: now + 24 * 60 * 60 })
  );
  const unsignedToken = `${header}.${payload}`;

  return `${unsignedToken}.${signValue(unsignedToken)}`;
}

export function verifyAuthToken(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const unsignedToken = `${parts[0]}.${parts[1]}`;
  const expectedSignature = signValue(unsignedToken);
  const actual = Buffer.from(parts[2]);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(parts[1]).toString()) as JwtPayload;

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}
