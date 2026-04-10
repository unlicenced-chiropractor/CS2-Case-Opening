import { warmPriceCache } from "./utils";

const BYMYKEL_CRATES_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json";
const BYMYKEL_SKINS_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json";

/** Newest-first list — keep in sync with `cases.ts` FALLBACK_CASES crate rows. */
export const CS2_CASE_IDS_ORDER = [
  "crate-7007",
  "crate-7003",
  "crate-4904",
  "crate-4880",
  "crate-4846",
  "crate-4818",
] as const;

export const CS2_CASE_IDS = new Set<string>(CS2_CASE_IDS_ORDER);

/** Demo open costs (virtual credits). Align with `cases.ts` FALLBACK_CASES. */
export const CS2_CRATE_OPEN_COST: Record<string, number> = {
  "crate-7007": 12,
  "crate-7003": 10,
  "crate-4904": 10,
  "crate-4880": 10,
  "crate-4846": 10,
  "crate-4818": 10,
};

const RARITY_MAP: Record<string, string> = {
  "Mil-Spec Grade": "Mil-Spec",
  "Mil-Spec": "Mil-Spec",
  Restricted: "Restricted",
  Classified: "Classified",
  Covert: "Covert",
  Contraband: "Rare Special",
  Extraordinary: "Rare Special",
};

const RARITY_DEFAULTS: Record<string, number> = {
  "Mil-Spec": 1.5,
  Restricted: 4.0,
  Classified: 12.0,
  Covert: 50.0,
  "Rare Special": 200.0,
};

const VALVE_RARITY_WEIGHTS = [
  { rarity: "Mil-Spec", weight: 7992 },
  { rarity: "Restricted", weight: 1598 },
  { rarity: "Classified", weight: 320 },
  { rarity: "Covert", weight: 64 },
  { rarity: "Rare Special", weight: 26 },
] as const;

const STRUCTURE_TTL_MS = 60 * 60 * 1000;

type RawCrate = {
  id: string;
  name: string;
  description: string | null;
  image?: string;
  market_hash_name?: string;
  contains: Array<{
    name: string;
    rarity?: { name?: string };
    image?: string;
  }>;
  contains_rare: Array<{ name: string; image?: string }>;
};

export type Cs2CaseSkin = {
  name: string;
  rarity: string;
  value: number;
  icon: string;
};

export type Cs2CasePayload = {
  id: string;
  name: string;
  description: string;
  image: string;
  cost: number;
  luckPool: Array<{ rarity: string; weight: number; percent: number }>;
  preview: Array<{
    rarity: string;
    percent: number;
    count: number;
    sample: Array<{
      name: string;
      rarity: string;
      icon: string;
      value: number;
    }>;
  }>;
  skins: Cs2CaseSkin[];
};

let structureCache: {
  at: number;
  crateMap: Map<string, RawCrate>;
  skinImageMap: Map<string, string>;
} | null = null;

function mapRarity(raw: string | undefined): string {
  return RARITY_MAP[String(raw ?? "").trim()] ?? "Mil-Spec";
}

function stripWear(name: string): string {
  return name.replace(/\s*\([^)]+\)\s*$/, "").trim();
}

function skinPriceFromFeed(
  prices: Record<string, number>,
  baseName: string,
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
    const p = prices[`${baseName} (${w})`];
    if (p != null && p > 0) return Number(p.toFixed(2));
  }
  return fallback;
}

/** Some feeds list unboxed container prices under the case name. */
function caseContainerPrice(
  prices: Record<string, number>,
  crate: RawCrate,
  fallback: number,
): number {
  const keys = [
    crate.market_hash_name,
    crate.name,
    `${crate.name} Container`,
  ].filter(Boolean) as string[];
  for (const k of keys) {
    const p = prices[k];
    if (p != null && p > 0) return Number(p.toFixed(2));
  }
  return fallback;
}

function valveLuckPool(): Array<{
  rarity: string;
  weight: number;
  percent: number;
}> {
  const total = VALVE_RARITY_WEIGHTS.reduce((s, x) => s + x.weight, 0);
  return VALVE_RARITY_WEIGHTS.map((p) => ({
    rarity: p.rarity,
    weight: p.weight,
    percent: Math.round((p.weight / total) * 1000) / 10,
  }));
}

async function loadStructure(): Promise<{
  crateMap: Map<string, RawCrate>;
  skinImageMap: Map<string, string>;
}> {
  const now = Date.now();
  if (
    structureCache &&
    now - structureCache.at < STRUCTURE_TTL_MS
  ) {
    return {
      crateMap: structureCache.crateMap,
      skinImageMap: structureCache.skinImageMap,
    };
  }

  const [cratesResp, skinsResp] = await Promise.all([
    fetch(BYMYKEL_CRATES_URL, {
      headers: { "User-Agent": "CaseStrike/1.0" },
    }),
    fetch(BYMYKEL_SKINS_URL, { headers: { "User-Agent": "CaseStrike/1.0" } }),
  ]);

  if (!cratesResp.ok || !skinsResp.ok) {
    throw new Error("ByMykel crates/skins fetch failed");
  }

  const allCrates = (await cratesResp.json()) as RawCrate[];
  const allSkins = (await skinsResp.json()) as Array<{
    name: string;
    image: string;
    rarity?: { id?: string; name?: string };
    stattrak?: boolean;
    souvenir?: boolean;
  }>;

  const crateMap = new Map(allCrates.map((c) => [c.id, c]));

  const skinImageMap = new Map<string, string>();
  for (const s of allSkins) {
    if (!s.name || !s.image || s.stattrak || s.souvenir) continue;
    const base = stripWear(s.name);
    if (!skinImageMap.has(base)) skinImageMap.set(base, s.image);
  }

  structureCache = {
    at: now,
    crateMap,
    skinImageMap,
  };
  return { crateMap, skinImageMap };
}

function buildSkinsForCrate(
  crate: RawCrate,
  skinImageMap: Map<string, string>,
  prices: Record<string, number>,
): Cs2CaseSkin[] {
  const seenBase = new Set<string>();
  const skins: Cs2CaseSkin[] = [];

  for (const item of crate.contains) {
    const base = stripWear(item.name);
    if (seenBase.has(base)) continue;
    seenBase.add(base);
    const rarity = mapRarity(item.rarity?.name);
    const icon = skinImageMap.get(base) ?? item.image ?? "";
    const fallback = RARITY_DEFAULTS[rarity] ?? 1.5;
    const value = skinPriceFromFeed(prices, base, fallback);
    skins.push({ name: base, rarity, value, icon });
  }

  const seenRare = new Set<string>();
  for (const item of crate.contains_rare) {
    const base = stripWear(item.name);
    if (seenRare.has(base)) continue;
    seenRare.add(base);
    const icon = skinImageMap.get(base) ?? item.image ?? "";
    const value = skinPriceFromFeed(
      prices,
      base,
      RARITY_DEFAULTS["Rare Special"],
    );
    skins.push({ name: base, rarity: "Rare Special", value, icon });
  }

  return skins;
}

function buildPreview(
  skins: Cs2CaseSkin[],
  luckPool: Array<{ rarity: string; weight: number; percent: number }>,
): Cs2CasePayload["preview"] {
  const byRarity: Record<string, Cs2CaseSkin[]> = {};
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

  return rarityOrder.map((rarity) => {
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
}

export async function buildCs2CasePayload(
  caseId: string,
  prices: Record<string, number>,
): Promise<Cs2CasePayload | null> {
  if (!CS2_CASE_IDS.has(caseId)) return null;
  const { crateMap, skinImageMap } = await loadStructure();
  const crate = crateMap.get(caseId);
  if (!crate) return null;

  const luckPool = valveLuckPool();
  const skins = buildSkinsForCrate(crate, skinImageMap, prices);
  if (!skins.length) return null;

  const baseCost = CS2_CRATE_OPEN_COST[caseId] ?? 10;
  const cost = caseContainerPrice(prices, crate, baseCost);

  return {
    id: crate.id,
    name: crate.name,
    description: crate.description ?? "",
    image: crate.image ?? "",
    cost,
    luckPool,
    preview: buildPreview(skins, luckPool),
    skins,
  };
}

export async function getAllCs2CasePayloads(): Promise<Cs2CasePayload[]> {
  const prices = await warmPriceCache();
  const out: Cs2CasePayload[] = [];
  for (const id of CS2_CASE_IDS_ORDER) {
    const payload = await buildCs2CasePayload(id, prices);
    if (payload) out.push(payload);
  }
  return out;
}

/** Authoritative pool, odds line, and open cost for `/api/open-case` (matches case detail). */
export async function getLiveCrateOpenBundle(caseId: string): Promise<{
  cost: number;
  luckPool: { rarity: string; weight: number }[];
  skins: Cs2CaseSkin[];
} | null> {
  if (!CS2_CASE_IDS.has(caseId)) return null;
  const prices = await warmPriceCache();
  const payload = await buildCs2CasePayload(caseId, prices);
  if (!payload?.skins.length) return null;
  return {
    cost: payload.cost,
    luckPool: payload.luckPool.map(({ rarity, weight }) => ({ rarity, weight })),
    skins: payload.skins,
  };
}
