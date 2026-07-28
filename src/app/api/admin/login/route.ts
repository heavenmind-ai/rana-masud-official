import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCredentials, hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Retrieve hashed credentials and salt from MongoDB
    const creds = await getAdminCredentials();

    // Check email match (case-insensitive)
    const normalizedEmail = email.trim().toLowerCase();
    const storedNormalizedEmail = creds.email.trim().toLowerCase();

    if (normalizedEmail !== storedNormalizedEmail) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password hash
    const inputHash = hashPassword(password, creds.salt);
    if (inputHash !== creds.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create session token and set in cookies
    const sessionToken = await createSession(storedNormalizedEmail, creds.passwordHash);
    const cookieStore = await cookies();

    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Login API failure:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
