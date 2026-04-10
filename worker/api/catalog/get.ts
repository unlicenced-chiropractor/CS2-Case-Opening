import {
  buildCaseCatalogEntries,
  demoCaseValueMultiplier,
  loadCases,
} from "../../lib/cases";
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
  valueMultiplier = 1,
) {
  return skins.map((s) => ({
    ...s,
    value: Number((getLivePrice(prices, s.name, s.value) * valueMultiplier).toFixed(2)),
  }));
}

export async function get({ env }: RouteContext): Promise<Response> {
  const caseRows = await loadCases(env);

  // Fetch live prices (uses cache if fresh)
  const prices = await warmPriceCache();

  // Build a per-case enriched skin map so each case only shows its own skins.
  // CASE_SKINS[id] is the authoritative list for that case; fall back to
  // "classic" if a DB-configured case id has no curated skin list yet.
  const skinsByCaseId: Record<
    string,
    { name: string; rarity: string; value: number; icon: string }[]
  > = {};

  for (const row of caseRows) {
    const raw = CASE_SKINS[row.id] ?? CASE_SKINS["classic"] ?? [];
    skinsByCaseId[row.id] = enrichSkinsWithLivePrices(
      raw,
      prices,
      demoCaseValueMultiplier(row.id, row.cost),
    );
  }

  // buildCaseCatalogEntries now receives the per-case map so preview blocks
  // only contain skins that actually belong to each specific case.
  const cases = buildCaseCatalogEntries(caseRows, skinsByCaseId).map(
    (entry) => ({
      ...entry,
      // Also attach the flat skin list on the case so the frontend spinner
      // and the open-case roll both draw from the correct per-case pool.
      skins: skinsByCaseId[entry.id] ?? [],
    }),
  );

  const classic = cases.find((c) => c.id === "classic") ?? cases[0];
  const caseCost = classic?.cost ?? CASE_COST;
  const defaultCaseId = classic?.id ?? "classic";

  // Top-level deduplicated skin list used by the upgrader — union of all
  // per-case skins, one entry per name (no duplicates across cases).
  const seen = new Set<string>();
  const dedupedSkins: {
    name: string;
    rarity: string;
    value: number;
    icon: string;
  }[] = [];
  for (const skins of Object.values(skinsByCaseId)) {
    for (const s of skins) {
      if (!seen.has(s.name)) {
        seen.add(s.name);
        dedupedSkins.push(s);
      }
    }
  }

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
