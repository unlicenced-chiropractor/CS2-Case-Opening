import { getProfile, json, normalizeEmail, sha256Hex, asBoolean, createSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  const user = await env.DB.prepare(
    "SELECT id, email, password_hash, salt, COALESCE(is_admin, 0) AS is_admin, COALESCE(last_login_at, 0) AS last_login_at FROM users WHERE email = ?",
  )
    .bind(email)
    .first();

  if (!user) {
    return json({ error: "Invalid credentials." }, 401);
  }

  const check = await sha256Hex(`${password}:${user.salt}`);
  if (check !== user.password_hash) {
    return json({ error: "Invalid credentials." }, 401);
  }

  const now = Date.now();
  await env.DB.prepare("UPDATE users SET last_login_at = ? WHERE id = ?")
    .bind(now, user.id)
    .run();

  const session = await createSession(env, user.id);

  return json({
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      isAdmin: asBoolean(user.is_admin),
    },
    profile: await getProfile(env, user.id),
  });
}
