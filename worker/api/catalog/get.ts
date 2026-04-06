import { CASE_COST, RARITY_WEIGHTS } from "../../lib/constants";
import { getCatalog, json } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function get({ env }: RouteContext): Promise<Response> {
  const catalog = await getCatalog(env);
  return json(
    {
      caseCost: CASE_COST,
      skins: catalog.skins,
      rarityWeights: RARITY_WEIGHTS,
      source: catalog.source,
    },
    200,
  );
}
