import { buildCaseCatalogEntries, loadCases } from "../../lib/cases";
import { CASE_COST, CASE_SKINS, RARITY_WEIGHTS } from "../../lib/constants";
import { json } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

export async function get({ env }: RouteContext): Promise<Response> {
  const caseRows = await loadCases(env);

  const cases = buildCaseCatalogEntries(
    caseRows,
    // Pass all curated skins merged together so preview builder has a full pool per rarity
    Object.values(CASE_SKINS).flat(),
  ).map((entry) => ({
    ...entry,
    // Attach the per-case skin list so the frontend spinner only shows this case's skins
    skins: CASE_SKINS[entry.id] ?? CASE_SKINS["classic"] ?? [],
  }));

  const classic = cases.find((c) => c.id === "classic") ?? cases[0];
  const caseCost = classic?.cost ?? CASE_COST;
  const defaultCaseId = classic?.id ?? "classic";

  // Send all curated skins as the top-level skins array (used as spinner fallback)
  const allSkins = Object.values(CASE_SKINS).flat();

  return json(
    {
      caseCost,
      defaultCaseId,
      cases,
      skins: allSkins,
      rarityWeights: RARITY_WEIGHTS,
      source: "curated",
    },
    200,
  );
}
