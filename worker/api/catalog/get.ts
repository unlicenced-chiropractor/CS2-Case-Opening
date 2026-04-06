import { buildCaseCatalogEntries, loadCases } from "../../lib/cases";
import { CASE_COST, RARITY_WEIGHTS } from "../../lib/constants";
import { getCatalog, json } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function get({ env }: RouteContext): Promise<Response> {
  const catalog = await getCatalog(env);
  const caseRows = await loadCases(env);
  const cases = buildCaseCatalogEntries(caseRows, catalog.skins);
  const classic = cases.find((c) => c.id === "classic") ?? cases[0];
  const caseCost = classic?.cost ?? CASE_COST;
  const defaultCaseId = classic?.id ?? "classic";

  return json(
    {
      caseCost,
      defaultCaseId,
      cases,
      skins: catalog.skins,
      rarityWeights: RARITY_WEIGHTS,
      source: catalog.source,
    },
    200,
  );
}
