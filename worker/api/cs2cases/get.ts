import { getAllCs2CasePayloads } from "../../lib/cs2CrateCatalog";
import { json } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function get({ env: _env }: RouteContext): Promise<Response> {
  try {
    const cases = await getAllCs2CasePayloads();
    return json({ cases });
  } catch {
    return json({ error: "Upstream fetch failed" }, 502);
  }
}
