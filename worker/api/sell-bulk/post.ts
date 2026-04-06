import { getProfile, json, requireSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);
  const body = (await request.json()) as { rarities?: unknown };

  const rarities = Array.isArray(body.rarities) ? body.rarities : [];
  if (!rarities.length) {
    return json({ error: "No rarities specified." }, 400);
  }

  const placeholders = rarities.map(() => "?").join(", ");
  const items = await env.DB.prepare(
    `SELECT id, item_value FROM inventory WHERE user_id = ? AND sold_at IS NULL AND item_rarity IN (${placeholders})`,
  )
    .bind(session.user.id, ...rarities)
    .all();

  const rows = items.results ?? [];
  if (!rows.length) {
    return json({
      ok: true,
      soldCount: 0,
      soldValue: 0,
      profile: await getProfile(env, session.user.id),
    });
  }

  const now = Date.now();
  const totalValue = rows.reduce((sum, r) => sum + Number(r.item_value), 0);

  const statements = rows.map((r) =>
    env.DB.prepare("UPDATE inventory SET sold_at = ? WHERE id = ?").bind(now, r.id),
  );
  statements.push(
    env.DB.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").bind(
      totalValue,
      session.user.id,
    ),
  );
  await env.DB.batch(statements);

  return json({
    ok: true,
    soldCount: rows.length,
    soldValue: Number(totalValue.toFixed(2)),
    profile: await getProfile(env, session.user.id),
  });
}
