import { asBoolean, getProfile, json, requireSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function get({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);

  await env.DB.prepare("UPDATE users SET last_login_at = ? WHERE id = ?")
    .bind(Date.now(), session.user.id)
    .run();

  return json({
    user: {
      id: session.user.id,
      email: session.user.email,
      isAdmin: asBoolean(session.user.isAdmin),
    },
    profile: await getProfile(env, session.user.id),
  });
}
