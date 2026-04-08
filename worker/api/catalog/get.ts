import { buildCaseCatalogEntries, loadCases } from "../../lib/cases";
import { CASE_COST, CASE_SKINS, RARITY_WEIGHTS } from "../../lib/constants";
import { json, warmPriceCache } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

/**
 * For a given skin, find the best representative live price from the YouPin
 * price cache. We try each wear tier and return the median-ish Field-Tested
 * price first, falling back to any available wear, then the hardcoded value.
 */
function getLivePrice(
  prices: Record<string, number>,
  skinName: string,
  fallback: number,
): number {
  // Preferred wear order: Field-Tested first, then others
  const wearOrder = [
    "Field-Tested",
    "Minimal Wear",
    "Factory New",
    "Well-Worn",
    "Battle-Scarred",
  ];
  for (const wear of wearOrder) {
    const key = `${skinName} (${wear})`;
    const p = prices[key];
    if (p != null && p > 0) return Number(p.toFixed(2));
  }
  return fallback;
}

function enrichSkinsWithLivePrices(
  skins: { name: string; rarity: string; value: number; icon: string }[],
  prices: Record<string, number>,
) {
  return skins.map((s) => ({
    ...s,
    value: getLivePrice(prices, s.name, s.value),
  }));
}

export async function get({ env }: RouteContext): Promise<Response> {
  const caseRows = await loadCases(env);

  // Fetch live prices (uses cache if fresh)
  const prices = await warmPriceCache();

  const allCuratedSkins = Object.values(CASE_SKINS).flat();
  const enrichedAllSkins = enrichSkinsWithLivePrices(allCuratedSkins, prices);

  const cases = buildCaseCatalogEntries(caseRows, enrichedAllSkins).map(
    (entry) => ({
      ...entry,
      skins: enrichSkinsWithLivePrices(
        CASE_SKINS[entry.id] ?? CASE_SKINS["classic"] ?? [],
        prices,
      ),
    }),
  );

  const classic = cases.find((c) => c.id === "classic") ?? cases[0];
  const caseCost = classic?.cost ?? CASE_COST;
  const defaultCaseId = classic?.id ?? "classic";

  // Deduplicate by name for the top-level skins array used by the upgrader
  const seen = new Set<string>();
  const dedupedSkins = enrichedAllSkins.filter((s) => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });

  return json(
    {
      caseCost,
      defaultCaseId,
      cases,
      skins: dedupedSkins,
      rarityWeights: RARITY_WEIGHTS,
      source: "curated",
    },
    200,
  );
}
