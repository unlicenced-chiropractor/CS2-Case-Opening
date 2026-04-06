import { asBoolean, json, requireAdmin, throwObjectStatus } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireAdmin(request, env);
  const body = (await request.json()) as { userId?: unknown; balance?: unknown };
  const userId = String(body.userId || "").trim();
  const nextBalance = Number(body.balance);

  if (!userId) throwObjectStatus("Missing userId.", 400);
  if (!Number.isFinite(nextBalance)) throwObjectStatus("Invalid balance.", 400);

  const row = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!row) throwObjectStatus("User not found.", 404);

  if (userId === session.user.id && nextBalance < 0) {
    throwObjectStatus("Cannot set your own balance below 0.", 400);
  }

  await env.DB.prepare("UPDATE users SET balance = ? WHERE id = ?").bind(nextBalance, userId).run();

  const refreshed = await env.DB.prepare(
    "SELECT id, email, COALESCE(is_admin, 0) AS is_admin, balance, COALESCE(last_login_at, 0) AS last_login_at, created_at FROM users WHERE id = ?",
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
  });
}
