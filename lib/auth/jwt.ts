import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import { getAuthSecret } from "@/lib/auth/secret";

export type AuthTokenPayload = JWTPayload & {
  sub: string;
  email: string;
  fullName?: string | null;
  role: "CUSTOMER" | "ADMIN";
};

function getJwtSecret() {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET or AUTH_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(
  payload: Omit<AuthTokenPayload, "iat" | "exp">,
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${AUTH_TOKEN_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, getJwtSecret());
  return payload;
}
