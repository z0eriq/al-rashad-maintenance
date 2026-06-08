import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { getAuthFromCookie, type JWTPayload } from "./jwt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  return getAuthFromCookie();
}

export async function requireAuth(
  allowedRoles?: Role[]
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "غير مصرح. يرجى تسجيل الدخول." },
      { status: 401 }
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { success: false, error: "ليس لديك صلاحية للوصول." },
      { status: 403 }
    );
  }

  return { user };
}

export function generateResetToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}
