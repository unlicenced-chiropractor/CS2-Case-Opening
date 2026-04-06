import { RESET_LINK_TTL_MS } from "../../../lib/constants";
import { json, randomToken, requireAdmin, throwObjectStatus } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireAdmin(request, env);
  const body = (await request.json()) as { userId?: unknown };
  const userId = String(body.userId || "").trim();

  if (!userId) throwObjectStatus("Missing userId.", 400);

  const user = await env.DB.prepare("SELECT id, email FROM users WHERE id = ?").bind(userId).first();

  if (!user) throwObjectStatus("User not found.", 404);

  let tokenData = await env.DB.prepare(
    "SELECT token, expires_at FROM password_reset_tokens WHERE user_id = ? AND used = 0 AND revoked = 0 AND expires_at > ? ORDER BY created_at DESC LIMIT 1",
  )
    .bind(userId, Date.now())
    .first();

  if (!tokenData) {
    const now = Date.now();
    const expiresAt = now + RESET_LINK_TTL_MS;
    const token = randomToken(48);

    await env.DB.prepare(
      "INSERT INTO password_reset_tokens (token, user_id, email, expires_at, used, revoked, created_at) VALUES (?, ?, ?, ?, 0, 0, ?)",
    )
      .bind(token, userId, user.email, expiresAt, now)
      .run();

    tokenData = { token, expires_at: expiresAt };
  }

  const token = String(tokenData.token);
  const requestUrl = new URL(request.url);
  const base = `${requestUrl.protocol}//${requestUrl.host}`;

  return json({
    ok: true,
    userId,
    email: user.email,
    token,
    expiresAt: Number(tokenData.expires_at ?? 0),
    resetLink: `${base}/reset-password?token=${encodeURIComponent(token)}`,
    actor: {
      id: session.user.id,
      email: session.user.email,
    },
  });
}
