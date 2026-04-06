import { json, requireAdmin, throwObjectStatus } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireAdmin(request, env);
  const body = (await request.json()) as { token?: unknown };
  const token = String(body.token || "").trim();

  if (!token) throwObjectStatus("Missing token.", 400);

  const row = await env.DB.prepare("SELECT token FROM password_reset_tokens WHERE token = ?")
    .bind(token)
    .first();

  if (!row) throwObjectStatus("Reset token not found.", 404);

  await env.DB.prepare("UPDATE password_reset_tokens SET revoked = 1 WHERE token = ?")
    .bind(token)
    .run();

  return json({
    ok: true,
    token,
    actor: {
      id: session.user.id,
      email: session.user.email,
    },
  });
}
