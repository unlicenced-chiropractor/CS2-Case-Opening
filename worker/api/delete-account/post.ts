import { json, requireSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

/** Authenticated user deletes their own account (cascades inventory, sessions, etc.). */
export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);

  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(session.user.id).run();

  return json({ ok: true });
}
