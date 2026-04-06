import { json, requireAdmin } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function get({ request, env }: RouteContext): Promise<Response> {
  await requireAdmin(request, env);

  const rows = await env.DB.prepare(
    "SELECT token, user_id, email, expires_at, used, revoked, created_at FROM password_reset_tokens ORDER BY created_at DESC",
  ).all();

  const now = Date.now();
  const links = (rows.results ?? []).map((row) => {
    const revoked = Number(row.revoked ?? 0) === 1;
    const used = Number(row.used ?? 0) === 1;
    const expiresAt = Number(row.expires_at ?? 0);

    return {
      token: row.token,
      userId: row.user_id,
      email: row.email,
      used,
      revoked,
      isActive: !revoked && !used && expiresAt > now,
      expiresAt,
      createdAt: Number(row.created_at ?? 0),
    };
  });

  return json({ links });
}
