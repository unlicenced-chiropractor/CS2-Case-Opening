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

const FALLBACK_CASES: CaseRow[] = [
  {
    id: "classic",
    name: "Classic Case",
    description: "Balanced odds — the original CaseStrike experience.",
    cost: 10,
    pools: [...RARITY_WEIGHTS],
  },
  {
    id: "budget",
    name: "Budget Case",
    description: "Cheap opens; mostly Mil-Spec with a small chase.",
    cost: 3,
    pools: [
      { rarity: "Mil-Spec", weight: 72 },
      { rarity: "Restricted", weight: 22 },
      { rarity: "Classified", weight: 5 },
      { rarity: "Covert", weight: 0.9 },
      { rarity: "Rare Special", weight: 0.1 },
    ],
  },
  {
    id: "premium",
    name: "Premium Case",
    description: "Shifted toward higher rarities.",
    cost: 15,
    pools: [
      { rarity: "Mil-Spec", weight: 40 },
      { rarity: "Restricted", weight: 32 },
      { rarity: "Classified", weight: 18 },
      { rarity: "Covert", weight: 9 },
      { rarity: "Rare Special", weight: 1 },
    ],
  },
  {
    id: "elite",
    name: "Elite Case",
    description: "High stakes; much better Covert and Rare Special odds.",
    cost: 25,
    pools: [
      { rarity: "Mil-Spec", weight: 28 },
      { rarity: "Restricted", weight: 28 },
      { rarity: "Classified", weight: 22 },
      { rarity: "Covert", weight: 18 },
      { rarity: "Rare Special", weight: 4 },
    ],
  },
  {
    id: "free",
    name: "Free Case",
    description: "No credits needed — open once and see what you get!",
    cost: 0,
    pools: [
      { rarity: "Mil-Spec", weight: 55 },
      { rarity: "Restricted", weight: 28 },
      { rarity: "Classified", weight: 12 },
      { rarity: "Covert", weight: 4.5 },
      { rarity: "Rare Special", weight: 0.5 },
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
  skins: Skin[],
): CaseCatalogEntry[] {
  const byRarity = groupSkinsByRarity(skins);
  return casesIn.map((c) => {
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
