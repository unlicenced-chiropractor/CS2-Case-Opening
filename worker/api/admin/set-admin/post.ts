import { asBoolean, json, requireAdmin, throwObjectStatus } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireAdmin(request, env);
  const body = (await request.json()) as { userId?: unknown; isAdmin?: unknown };
  const userId = String(body.userId || "").trim();
  const nextAdmin = Number(body.isAdmin);

  if (!userId) throwObjectStatus("Missing userId.", 400);
  if (nextAdmin !== 0 && nextAdmin !== 1) throwObjectStatus("isAdmin must be 0 or 1.", 400);
  if (userId === session.user.id && nextAdmin === 0) {
    throwObjectStatus("Cannot remove your own admin role.", 400);
  }

  const row = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!row) throwObjectStatus("User not found.", 404);

  await env.DB.prepare("UPDATE users SET is_admin = ? WHERE id = ?").bind(nextAdmin, userId).run();

  const refreshed = await env.DB.prepare(
    "SELECT id, email, COALESCE(is_admin, 0) AS is_admin, COALESCE(balance, 0) AS balance, COALESCE(last_login_at, 0) AS last_login_at, created_at FROM users WHERE id = ?",
  )
    .bind(userId)
    .first();

  if (!refreshed) throwObjectStatus("User not found.", 404);

  return json({
    ok: true,
    user: {
      id: refreshed.id,
      email: refreshed.email,
      isAdmin: asBoolean(refreshed.is_admin),
      balance: Number(refreshed.balance ?? 0),
      lastLoginAt: Number(refreshed.last_login_at ?? 0),
      createdAt: Number(refreshed.created_at ?? 0),
    },
    actor: {
      id: session.user.id,
      email: session.user.email,
    },
  });
}
