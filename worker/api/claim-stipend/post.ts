import { STIPEND_AMOUNT, STIPEND_INTERVAL_MS, STIPEND_THRESHOLD } from "../../lib/constants";
import { getProfile, json, requireSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);
  const row = await env.DB.prepare("SELECT balance, last_stipend_at FROM users WHERE id = ?")
    .bind(session.user.id)
    .first();
  const now = Date.now();
  const balance = Number(row?.balance ?? 0);
  const last = Number(row?.last_stipend_at ?? 0);
  const eligible = balance < STIPEND_THRESHOLD && now - last >= STIPEND_INTERVAL_MS;

  if (eligible) {
    await env.DB.prepare("UPDATE users SET balance = ?, last_stipend_at = ? WHERE id = ?")
      .bind(balance + STIPEND_AMOUNT, now, session.user.id)
      .run();
  }

  return json({
    paid: eligible,
    profile: await getProfile(env, session.user.id),
  });
}
