import { resolveCaseForOpen } from "../../lib/cases";
import { getProfile, json, requireSession, rollSkin } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);
  const body = (await request.json()) as { caseId?: unknown };
  const resolved = await resolveCaseForOpen(
    env,
    body.caseId != null ? String(body.caseId) : null,
  );
  if (!resolved) {
    return json({ error: "No cases available." }, 500);
  }
  const cost = resolved.cost;
  if (!Number.isFinite(cost) || cost < 0) {
    return json({ error: "Invalid case configuration." }, 500);
  }

  const balanceRow = await env.DB.prepare(
    "SELECT balance FROM users WHERE id = ?",
  )
    .bind(session.user.id)
    .first();
  const currentBalance = Number(balanceRow?.balance ?? 0);
  if (cost > 0 && currentBalance < cost) {
    return json({ error: "Not enough credits for this case." }, 400);
  }

  const selectedSkin = await rollSkin(resolved.skins, resolved.luckPool, {
    valueMultiplier: resolved.valueMultiplier,
    useLivePrices: true,
  });
  const now = Date.now();
  const nextBalance = currentBalance - cost;

  await env.DB.batch([
    env.DB.prepare("UPDATE users SET balance = ? WHERE id = ?").bind(
      nextBalance,
      session.user.id,
    ),
    env.DB.prepare(
      "INSERT INTO inventory (user_id, item_name, item_rarity, item_wear, item_icon, item_value, dropped_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(
      session.user.id,
      String(selectedSkin.name),
      String(selectedSkin.rarity || "Mil-Spec"),
      String(selectedSkin.wear || "Field-Tested"),
      String(selectedSkin.icon || ""),
      Number(selectedSkin.value || 0),
      now,
    ),
  ]);

  return json({
    ok: true,
    caseId: resolved.id,
    drop: { ...selectedSkin, droppedAt: now },
    profile: await getProfile(env, session.user.id),
  });
}
