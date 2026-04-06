import { json, requireAdmin, throwObjectStatus } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireAdmin(request, env);
  const body = (await request.json()) as { userId?: unknown };
  const userId = String(body.userId || "").trim();

  if (!userId) throwObjectStatus("Missing userId.", 400);
  if (userId === session.user.id) throwObjectStatus("Cannot delete your own account.", 400);

  const row = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!row) throwObjectStatus("User not found.", 404);

  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
  return json({ ok: true, userId });
}
