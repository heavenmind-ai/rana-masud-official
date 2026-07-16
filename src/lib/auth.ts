import crypto from "crypto";
import { connectToDatabase } from "./mongodb";
import { GlobalSettings } from "@/models/GlobalSettings";

// Secret key for signing JWTs
const SESSION_SECRET = process.env.JWT_SECRET || "rana-masud-super-secret-session-key-2026";

/**
 * Base64Url encoder utility helper
 */
function base64UrlEncode(str: string | Buffer): string {
  const buf = typeof str === "string" ? Buffer.from(str) : str;
  return buf.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Base64Url decoder utility helper
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Hash a password with a given salt using SHA-256 HMAC
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

/**
 * Get current admin credentials from database, or fallback to defaults
 */
export async function getAdminCredentials() {
  await connectToDatabase();
  const setting = await GlobalSettings.findOne({ key: "admin_credentials" }).lean();
  
  if (setting && (setting as any).data) {
    return (setting as any).data;
  }
  
  // Default fallback credentials
  const defaultSalt = "rana_masud_default_salt_2026";
  const defaultPasswordHash = hashPassword("admin123", defaultSalt);
  
  return {
    email: "admin@ranamasudbd.com",
    passwordHash: defaultPasswordHash,
    salt: defaultSalt,
  };
}

/**
 * Update and save admin credentials to MongoDB
 */
export async function saveAdminCredentials(email: string, password?: string) {
  await connectToDatabase();
  const currentCreds = await getAdminCredentials();
  
  const updatedData: any = {
    email: email.trim().toLowerCase(),
    passwordHash: currentCreds.passwordHash,
    salt: currentCreds.salt,
  };
  
  if (password) {
    const newSalt = crypto.randomBytes(16).toString("hex");
    updatedData.passwordHash = hashPassword(password, newSalt);
    updatedData.salt = newSalt;
  }
  
  await GlobalSettings.findOneAndUpdate(
    { key: "admin_credentials" },
    { $set: { data: updatedData } },
    { upsert: true, new: true }
  );
  
  return updatedData;
}

/**
 * Create a cryptographically signed JSON Web Token (JWT) with HS256 signature algorithm
 */
export async function createSession(email: string, passwordHash: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  // Expire in 7 days
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = {
    email: email.trim().toLowerCase(),
    exp: expiry,
    pwdHash: passwordHash,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(signatureInput)
    .digest();

  const encodedSignature = base64UrlEncode(signature);
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify a JSON Web Token (JWT) signature, expiration, and payload contents
 */
export async function verifySession(token?: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // Validate Signature
    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", SESSION_SECRET).update(signatureInput).digest()
    );
    
    if (encodedSignature !== expectedSignature) {
      return false;
    }

    // Decode and Validate Expiry Claims
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (Math.floor(Date.now() / 1000) > payload.exp) {
      return false; // Expired JWT
    }

    // Check credentials match
    const creds = await getAdminCredentials();
    if (creds.email !== payload.email || creds.passwordHash !== payload.pwdHash) {
      return false; // Stale session / changed password
    }

    return true;
  } catch (error) {
    console.error("JWT Session verification failed:", error);
    return false;
  }
}
