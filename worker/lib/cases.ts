import { CASE_SKINS, RARITY_WEIGHTS } from "./constants";
import type { Env, Skin } from "./types";

const RARITY_ORDER = RARITY_WEIGHTS.map((r) => r.rarity);

export interface CaseRow {
  id: string;
  name: string;
  description: string | null;
  cost: number;
  pools: { rarity: string; weight: number }[];
}

export interface LuckPoolEntry {
  rarity: string;
  weight: number;
  percent: number;
}

export interface CaseCatalogEntry {
  id: string;
  name: string;
  description: string;
  cost: number;
  luckPool: LuckPoolEntry[];
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
}

// Real CS2 case odds (approximate, sourced from Valve's disclosed probabilities):
//   Mil-Spec    79.92%
//   Restricted  15.98%
//   Classified   3.20%
//   Covert       0.64%
//   Rare Special 0.26%
//
// The four paid cases use these exact odds. The free case is slightly worse
// at the top end so it can't be farmed for knives. The budget case is a
// touch more generous on Mil-Spec/Restricted to reflect its lower cost.
// Premium and Elite nudge Covert/Rare Special up very slightly — still
// nowhere near the real-money feel of the free-to-grind cases.

// IDs of real CS2 cases sourced from the ByMykel crates API
export const CS2_CASE_IDS = new Set([
  "crate-7007",
  "crate-7003",
  "crate-4904",
  "crate-4880",
  "crate-4846",
  "crate-4818",
]);

const FALLBACK_CASES: CaseRow[] = [
  {
    id: "classic",
    name: "Classic Case",
    description: "Standard CS2 odds — just like the real thing.",
    cost: 10,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "budget",
    name: "Budget Case",
    description: "Cheap to open; odds close to real CS2.",
    cost: 3,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "premium",
    name: "Premium Case",
    description: "Slightly better odds at the top — still a long shot.",
    cost: 15,
    pools: [
      { rarity: "Mil-Spec", weight: 7500 },
      { rarity: "Restricted", weight: 1800 },
      { rarity: "Classified", weight: 500 },
      { rarity: "Covert", weight: 160 },
      { rarity: "Rare Special", weight: 40 },
    ],
  },
  {
    id: "elite",
    name: "Elite Case",
    description: "The best odds in the shop — knives are still rare.",
    cost: 25,
    pools: [
      { rarity: "Mil-Spec", weight: 6500 },
      { rarity: "Restricted", weight: 2200 },
      { rarity: "Classified", weight: 900 },
      { rarity: "Covert", weight: 300 },
      { rarity: "Rare Special", weight: 100 },
    ],
  },
  {
    id: "free",
    name: "Free Case",
    description: "No credits needed — slim odds, but it's free!",
    cost: 0,
    pools: [
      { rarity: "Mil-Spec", weight: 8500 },
      { rarity: "Restricted", weight: 1200 },
      { rarity: "Classified", weight: 240 },
      { rarity: "Covert", weight: 45 },
      { rarity: "Rare Special", weight: 15 },
    ],
  },
  {
    id: "crate-7007",
    name: "Fever Case",
    description: "The newest CS2 case — Survival & Skeleton knife pool.",
    cost: 12,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "crate-7003",
    name: "Gallery Case",
    description: "Kukri knife pool with vivid gallery-themed skins.",
    cost: 10,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "crate-4904",
    name: "Kilowatt Case",
    description: "Kukri knife pool with electric industrial designs.",
    cost: 10,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "crate-4880",
    name: "Revolution Case",
    description: "Glove pool — sport, driver, specialist and more.",
    cost: 10,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "crate-4846",
    name: "Recoil Case",
    description: "Glove pool — broken fang, driver, specialist and more.",
    cost: 10,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
  {
    id: "crate-4818",
    name: "Dreams & Nightmares Case",
    description: "Bowie & Butterfly knife pool with surreal dreamlike skins.",
    cost: 10,
    pools: [
      { rarity: "Mil-Spec", weight: 7992 },
      { rarity: "Restricted", weight: 1598 },
      { rarity: "Classified", weight: 320 },
      { rarity: "Covert", weight: 64 },
      { rarity: "Rare Special", weight: 26 },
    ],
  },
];

function groupSkinsByRarity(skins: Skin[]): Record<string, Skin[]> {
  const by: Record<string, Skin[]> = {};
  for (const s of skins) {
    const r = String(s.rarity || "Mil-Spec");
    if (!by[r]) by[r] = [];
    by[r].push(s);
  }
  return by;
}

/** FNV-1a-ish hash for stable per-case preview windows */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Each case should show a different slice of the catalog (not always the same first 10 per rarity).
 * Budget emphasizes cheap items; elite/premium emphasize top-end; classic uses a neutral name-ordered window.
 */
export function previewSampleSkins(
  pool: Skin[],
  caseId: string,
  rarity: string,
  max: number,
): Skin[] {
  if (!pool.length) return [];
  const id = caseId || "classic";
  const highTier = rarity === "Covert" || rarity === "Rare Special";
  const sorted = [...pool];

  if (id === "budget") {
    sorted.sort((a, b) => Number(a.value) - Number(b.value));
  } else if (id === "elite") {
    sorted.sort((a, b) => Number(b.value) - Number(a.value));
  } else if (id === "premium") {
    sorted.sort((a, b) => Number(b.value) - Number(a.value));
  } else {
    sorted.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  if (sorted.length <= max) return sorted;

  if (id === "elite" && highTier) {
    return sorted.slice(0, max);
  }

  const h = hashString(`${id}\0${rarity}`);
  const span = sorted.length - max + 1;
  const start = span <= 1 ? 0 : h % span;
  return sorted.slice(start, start + max);
}

function luckPoolWithPercents(
  pools: { rarity: string; weight: number }[],
): LuckPoolEntry[] {
  const total = pools.reduce((s, p) => s + p.weight, 0);
  if (total <= 0) {
    return pools.map((p) => ({ ...p, percent: 0 }));
  }
  return pools.map((p) => ({
    rarity: p.rarity,
    weight: p.weight,
    percent: Math.round((p.weight / total) * 1000) / 10,
  }));
}

export function buildCaseCatalogEntries(
  casesIn: CaseRow[],
  skinsByCaseId: Record<string, Skin[]>,
): CaseCatalogEntry[] {
  return casesIn.map((c) => {
    // Use only this case's own skins for the preview — never the combined pool.
    const caseSkins = skinsByCaseId[c.id] ?? skinsByCaseId["classic"] ?? [];
    const byRarity = groupSkinsByRarity(caseSkins);
    const pools = c.pools.length ? c.pools : [...RARITY_WEIGHTS];
    const luckPool = luckPoolWithPercents(pools);
    const preview = RARITY_ORDER.map((rarity) => {
      const pool = byRarity[rarity] || [];
      const pct = luckPool.find((l) => l.rarity === rarity)?.percent ?? 0;
      const sampleSkins = previewSampleSkins(pool, c.id, rarity, 10);
      return {
        rarity,
        percent: pct,
        count: pool.length,
        sample: sampleSkins.map((s) => ({
          name: s.name,
          rarity: s.rarity,
          icon: s.icon,
          value: Number(s.value ?? 0),
        })),
      };
    });
    return {
      id: c.id,
      name: c.name,
      description: c.description ?? "",
      cost: c.cost,
      luckPool,
      preview,
    };
  });
}

export async function loadCases(env: Env): Promise<CaseRow[]> {
  try {
    const rows = await env.DB.prepare(
      "SELECT id, name, description, cost, sort_order FROM cases WHERE active = 1 ORDER BY sort_order ASC, id ASC",
    ).all<{
      id: string;
      name: string;
      description: string | null;
      cost: number;
      sort_order: number;
    }>();

    const results = rows.results;
    if (!results?.length) {
      return FALLBACK_CASES.map((fc) => ({
        id: fc.id,
        name: fc.name,
        description: fc.description,
        cost: fc.cost,
        pools: fc.pools,
      }));
    }

    const poolRows = await env.DB.prepare(
      "SELECT case_id, rarity, weight FROM case_luck_pools",
    ).all<{ case_id: string; rarity: string; weight: number }>();

    const poolByCase = new Map<string, { rarity: string; weight: number }[]>();
    for (const row of poolRows.results ?? []) {
      const cid = String(row.case_id);
      if (!poolByCase.has(cid)) poolByCase.set(cid, []);
      poolByCase.get(cid)!.push({
        rarity: String(row.rarity),
        weight: Number(row.weight),
      });
    }

    return results.map((row) => {
      const id = String(row.id);
      const pools = poolByCase.get(id);
      return {
        id,
        name: String(row.name),
        description: row.description != null ? String(row.description) : null,
        cost: Number(row.cost),
        pools: pools?.length ? pools : [...RARITY_WEIGHTS],
      };
    });
  } catch {
    return FALLBACK_CASES.map((fc) => ({
      id: fc.id,
      name: fc.name,
      description: fc.description,
      cost: fc.cost,
      pools: fc.pools,
    }));
  }
}

export async function resolveCaseForOpen(
  env: Env,
  caseId: string | undefined | null,
): Promise<{
  id: string;
  cost: number;
  luckPool: { rarity: string; weight: number }[];
  skins: { name: string; rarity: string; value: number; icon: string }[];
} | null> {
  const cases = await loadCases(env);
  if (!cases.length) return null;
  const raw = String(caseId ?? "").trim();
  const id = raw || "classic";
  let c = cases.find((x) => x.id === id);
  if (!c) c = cases.find((x) => x.id === "classic") ?? cases[0];
  const pools = c.pools.length ? c.pools : [...RARITY_WEIGHTS];
  const skins = CASE_SKINS[c.id] ?? CASE_SKINS["classic"] ?? [];
  return { id: c.id, cost: c.cost, luckPool: pools, skins };
}
