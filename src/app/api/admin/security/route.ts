import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCredentials, hashPassword, saveAdminCredentials, verifySession, createSession } from "@/lib/auth";

/**
 * GET handler returns only the active admin email address (safe fields) for settings panel.
 * Protected by current active session verification.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const creds = await getAdminCredentials();
    return NextResponse.json({ email: creds.email });
  } catch (error: any) {
    console.error("GET security config failure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve security details." },
      { status: 500 }
    );
  }
}

/**
 * POST handler modifies admin credentials.
 * Performs current password verification and session invalidation/updates.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify current admin session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    // 2. Parse request payload
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword) {
      return NextResponse.json(
        { error: "Email and current password are required." },
        { status: 400 }
      );
    }

    // 3. Retrieve current credentials to verify password
    const currentCreds = await getAdminCredentials();
    const currentHash = hashPassword(currentPassword, currentCreds.salt);

    if (currentHash !== currentCreds.passwordHash) {
      return NextResponse.json(
        { error: "Incorrect current password." },
        { status: 400 }
      );
    }

    // 4. Save updated credentials to MongoDB
    const updatedCreds = await saveAdminCredentials(email, newPassword || undefined);

    // 5. Generate a new session token with the updated credentials and set in cookies
    const newSessionToken = await createSession(updatedCreds.email, updatedCreds.passwordHash);
    cookieStore.set("admin_session", newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Security settings updated successfully." });
  } catch (error: any) {
    console.error("Security update API failure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update security settings." },
      { status: 500 }
    );
  }
}
