import { json, warmPriceCache, type JsonPayload } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

const BYMYKEL_CRATES_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json";
const BYMYKEL_SKINS_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json";

// The 6 real CS2 cases we surface, newest first
const CS2_CASE_IDS = [
  "crate-7007", // Fever Case
  "crate-7003", // Gallery Case
  "crate-4904", // Kilowatt Case
  "crate-4880", // Revolution Case
  "crate-4846", // Recoil Case
  "crate-4818", // Dreams & Nightmares Case
];

const RARITY_MAP: Record<string, string> = {
  "Mil-Spec Grade": "Mil-Spec",
  Restricted: "Restricted",
  Classified: "Classified",
  Covert: "Covert",
  Contraband: "Rare Special",
  Extraordinary: "Rare Special",
};

// Module-level cache — valid for 1 hour
let cache: { data: JsonPayload; at: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000;

declare var fetch: (
  url: string,
  init?: { headers?: Record<string, string> },
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

function mapRarity(raw: string | undefined): string {
  return RARITY_MAP[String(raw ?? "").trim()] ?? "Mil-Spec";
}

function stripWear(name: string): string {
  return name.replace(/\s*\([^)]+\)\s*$/, "").trim();
}

function getLivePrice(
  prices: Record<string, number>,
  name: string,
  fallback: number,
): number {
  const wears = [
    "Field-Tested",
    "Minimal Wear",
    "Factory New",
    "Well-Worn",
    "Battle-Scarred",
  ];
  for (const w of wears) {
    const p = prices[`${name} (${w})`];
    if (p != null && p > 0) return Number(p.toFixed(2));
  }
  return fallback;
}

export async function get({ env: _env }: RouteContext): Promise<Response> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL) {
    return json(cache.data);
  }

  try {
    // Fetch crates + skins + prices in parallel
    const [cratesResp, skinsResp, prices] = await Promise.all([
      fetch(BYMYKEL_CRATES_URL, {
        headers: { "User-Agent": "CaseStrike/1.0" },
      }),
      fetch(BYMYKEL_SKINS_URL, { headers: { "User-Agent": "CaseStrike/1.0" } }),
      warmPriceCache(),
    ]);

    if (!cratesResp.ok || !skinsResp.ok) {
      return json({ error: "Upstream fetch failed" }, 502);
    }

    const allCrates = (await cratesResp.json()) as Array<{
      id: string;
      name: string;
      description: string | null;
      type: string;
      image?: string;
      first_sale_date?: string | null;
      contains: Array<{
        name: string;
        rarity?: { name?: string };
        image?: string;
      }>;
      contains_rare: Array<{ name: string; image?: string }>;
    }>;

    const allSkins = (await skinsResp.json()) as Array<{
      name: string;
      image: string;
      rarity?: { id?: string; name?: string };
      wear?: { name?: string };
      stattrak?: boolean;
      souvenir?: boolean;
    }>;

    // Build a lookup: base skin name → best image URL
    const skinImageMap = new Map<string, string>();
    for (const s of allSkins) {
      if (!s.name || !s.image || s.stattrak || s.souvenir) continue;
      const base = stripWear(s.name);
      if (!skinImageMap.has(base)) skinImageMap.set(base, s.image);
    }

    const crateMap = new Map(allCrates.map((c) => [c.id, c]));

    const rarity_weights = [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ];
    const total_weight = rarity_weights.reduce((s, x) => s + x.weight, 0);
    const luckPool = rarity_weights.map((p) => ({
      rarity: p.rarity,
      weight: p.weight,
      percent: Math.round((p.weight / total_weight) * 1000) / 10,
    }));

    const RARITY_DEFAULTS: Record<string, number> = {
      "Mil-Spec": 1.5,
      Restricted: 4.0,
      Classified: 12.0,
      Covert: 50.0,
      "Rare Special": 200.0,
    };

    const cases = CS2_CASE_IDS.map((caseId) => {
      const crate = crateMap.get(caseId);
      if (!crate) return null;

      // Build skins array from contains (non-rare)
      const seenBase = new Set<string>();
      const skins: Array<{
        name: string;
        rarity: string;
        value: number;
        icon: string;
      }> = [];

      for (const item of crate.contains) {
        const base = stripWear(item.name);
        if (seenBase.has(base)) continue;
        seenBase.add(base);
        const rarity = mapRarity(item.rarity?.name);
        const icon = skinImageMap.get(base) ?? item.image ?? "";
        const fallback = RARITY_DEFAULTS[rarity] ?? 1.5;
        const value = getLivePrice(prices, base, fallback);
        skins.push({ name: base, rarity, value, icon });
      }

      // Add rare (knife/glove) items as Rare Special
      const seenRare = new Set<string>();
      for (const item of crate.contains_rare) {
        const base = stripWear(item.name);
        if (seenRare.has(base)) continue;
        seenRare.add(base);
        const icon = skinImageMap.get(base) ?? item.image ?? "";
        const value = getLivePrice(
          prices,
          base,
          RARITY_DEFAULTS["Rare Special"],
        );
        skins.push({ name: base, rarity: "Rare Special", value, icon });
      }

      // Build preview grouped by rarity
      const byRarity: Record<string, typeof skins> = {};
      for (const s of skins) {
        if (!byRarity[s.rarity]) byRarity[s.rarity] = [];
        byRarity[s.rarity].push(s);
      }

      const rarityOrder = [
        "Mil-Spec",
        "Restricted",
        "Classified",
        "Covert",
        "Rare Special",
      ];
      const preview = rarityOrder.map((rarity) => {
        const pool = byRarity[rarity] ?? [];
        const pct = luckPool.find((l) => l.rarity === rarity)?.percent ?? 0;
        return {
          rarity,
          percent: pct,
          count: pool.length,
          sample: pool.slice(0, 10).map((s) => ({
            name: s.name,
            rarity: s.rarity,
            icon: s.icon,
            value: s.value,
          })),
        };
      });

      return {
        id: crate.id,
        name: crate.name,
        description: crate.description ?? "",
        image: crate.image ?? "",
        cost: 10,
        luckPool,
        preview,
        skins,
      };
    }).filter(Boolean);

    const result = { cases };
    cache = { data: result, at: now };
    return json(result);
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
}
