import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_AUTH_COOKIE_MAX_AGE,
  ADMIN_AUTH_COOKIE_NAME,
  createAdminToken,
  getAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = body?.username?.toString() ?? "";
  const password = body?.password?.toString() ?? "";

  try {
    const credentials = getAdminCredentials();

    if (username !== credentials.username || password !== credentials.password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: ADMIN_AUTH_COOKIE_NAME,
      value: createAdminToken(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_AUTH_COOKIE_MAX_AGE,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to validate admin credentials" },
      { status: 500 }
    );
  }
}
