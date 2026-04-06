import { createSession, getProfile, json, normalizeEmail, randomToken, sha256Hex } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!email || password.length < 6) {
    return json({ error: "Invalid email or password (min 6 chars)." }, 400);
  }

  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();
  if (exists) {
    return json({ error: "Email already exists." }, 409);
  }

  const userId = crypto.randomUUID();
  const salt = randomToken(16);
  const passwordHash = await sha256Hex(`${password}:${salt}`);
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, salt, balance, last_stipend_at, last_login_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(userId, email, passwordHash, salt, 25, now, now, now)
    .run();

  const session = await createSession(env, userId);

  return json({
    token: session.token,
    user: {
      id: userId,
      email,
      isAdmin: false,
    },
    profile: await getProfile(env, userId),
  });
}
