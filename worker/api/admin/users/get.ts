import { asBoolean, json, requireAdmin } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function get({ request, env }: RouteContext): Promise<Response> {
  await requireAdmin(request, env);

  const rows = await env.DB.prepare(
    "SELECT id, email, COALESCE(is_admin, 0) AS is_admin, COALESCE(balance, 0) AS balance, COALESCE(last_login_at, 0) AS last_login_at, created_at FROM users ORDER BY created_at DESC",
  ).all();

  const users = (rows.results ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    isAdmin: asBoolean(row.is_admin),
    balance: Number(row.balance ?? 0),
    lastLoginAt: Number(row.last_login_at ?? 0),
    createdAt: Number(row.created_at ?? 0),
  }));

  return json({ users });
}
