import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/constants";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName: fullName?.trim() || null,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    const token = await signAuthToken({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ error: "Unable to register user" }, { status: 500 });
  }
}
