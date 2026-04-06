import { getProfile, json, requireSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);
  const body = (await request.json()) as { inventoryId?: unknown };
  const inventoryId = Number(body.inventoryId);
  if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
    return json({ error: "Invalid inventory item." }, 400);
  }

  const item = await env.DB.prepare(
    "SELECT id, item_value, sold_at FROM inventory WHERE id = ? AND user_id = ?",
  )
    .bind(inventoryId, session.user.id)
    .first();

  if (!item) return json({ error: "Item not found." }, 404);
  if (item.sold_at !== null) return json({ error: "Item already sold." }, 409);

  const saleValue = Number(item.item_value);
  const now = Date.now();

  await env.DB.batch([
    env.DB.prepare("UPDATE inventory SET sold_at = ? WHERE id = ?").bind(now, inventoryId),
    env.DB.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").bind(
      saleValue,
      session.user.id,
    ),
  ]);

  return json({
    ok: true,
    soldValue: saleValue,
    profile: await getProfile(env, session.user.id),
  });
}
