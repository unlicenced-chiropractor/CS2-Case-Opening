import { json } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function get(_ctx: RouteContext): Promise<Response> {
  return json({ ok: true });
}
