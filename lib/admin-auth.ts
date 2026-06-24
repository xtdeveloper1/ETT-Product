import crypto from "crypto";

export const ADMIN_AUTH_COOKIE_NAME = "admin_auth";
export const ADMIN_AUTH_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day
const COOKIE_SEPARATOR = "|";
const HMAC_ALGO = "sha256";

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in environment variables."
    );
  }

  return { username, password };
}

export function createAdminToken() {
  const { username, password } = getAdminCredentials();
  const hmac = crypto.createHmac(HMAC_ALGO, password).update(username).digest("hex");
  return `${username}${COOKIE_SEPARATOR}${hmac}`;
}

export function validateAdminToken(value: string | undefined): boolean {
  if (!value) return false;

  const [username, signature] = value.split(COOKIE_SEPARATOR);
  if (!username || !signature) return false;

  const { username: expectedUsername, password } = getAdminCredentials();
  if (username !== expectedUsername) return false;

  const expectedSignature = crypto
    .createHmac(HMAC_ALGO, password)
    .update(expectedUsername)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}
