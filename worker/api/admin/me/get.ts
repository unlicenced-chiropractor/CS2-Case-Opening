import { asBoolean, json, requireSession } from "../../../lib/utils";
import type { RouteContext } from "../../../lib/types";

export async function get({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);

  return json({
    userId: session.user.id,
    isAdmin: asBoolean(session.user.isAdmin),
  });
}
