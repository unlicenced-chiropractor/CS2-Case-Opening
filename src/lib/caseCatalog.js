import { ref } from "vue";
import { apiFetch } from "./api";
import {
  CASE_COST as FALLBACK_CASE_COST,
  RARITY_WEIGHTS,
  SKINS as FALLBACK_SKINS,
} from "../data/skins";

export const casesList = ref([]);
export const catalogSkins = ref([...FALLBACK_SKINS]);

let loadPromise = null;

export function weightsToLuckPool(weights) {
  const w = Array.isArray(weights) && weights.length ? weights : RARITY_WEIGHTS;
  const total = w.reduce((s, p) => s + Number(p.weight), 0);
  if (total <= 0) return w.map((p) => ({ rarity: p.rarity, weight: p.weight, percent: 0 }));
  return w.map((p) => ({
    rarity: p.rarity,
    weight: p.weight,
    percent: Math.round((Number(p.weight) / total) * 1000) / 10,
  }));
}

function hashPreviewKey(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function previewSampleSkins(pool, caseId, rarity, max) {
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
  const h = hashPreviewKey(`${id}\0${rarity}`);
  const span = sorted.length - max + 1;
  const start = span <= 1 ? 0 : h % span;
  return sorted.slice(start, start + max);
}

export function buildLocalPreview(skins, luckPool, caseId = "classic") {
  const by = {};
  for (const s of skins) {
    const r = s.rarity || "Mil-Spec";
    if (!by[r]) by[r] = [];
    by[r].push(s);
  }
  const order = RARITY_WEIGHTS.map((x) => x.rarity);
  const pool = luckPool?.length ? luckPool : weightsToLuckPool(RARITY_WEIGHTS);
  return order.map((rarity) => {
    const poolSkins = by[rarity] || [];
    const pct = pool.find((l) => l.rarity === rarity)?.percent ?? 0;
    const sample = previewSampleSkins(poolSkins, caseId, rarity, 10);
    return {
      rarity,
      percent: pct,
      count: poolSkins.length,
      sample: sample.map((s) => ({
        name: s.name,
        rarity: s.rarity,
        icon: s.icon,
        value: s.value,
      })),
    };
  });
}

function applyCatalogFromResponse(catalog, skins) {
  const cost =
    Number.isFinite(catalog.caseCost) && catalog.caseCost > 0 ? catalog.caseCost : FALLBACK_CASE_COST;
  if (Array.isArray(catalog.cases) && catalog.cases.length) {
    casesList.value = catalog.cases;
    return;
  }
  const rw = catalog.rarityWeights || RARITY_WEIGHTS;
  const lp = weightsToLuckPool(rw);
  casesList.value = [
    {
      id: "classic",
      name: "Classic Case",
      description: "Balanced odds.",
      cost,
      luckPool: lp,
      preview: buildLocalPreview(skins, lp, "classic"),
    },
  ];
}

export function ensureCaseCatalog() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const catalog = await apiFetch("/api/catalog", { method: "GET" });
      if (Array.isArray(catalog.skins) && catalog.skins.length) {
        catalogSkins.value = catalog.skins;
      }
      applyCatalogFromResponse(catalog, catalogSkins.value);
    } catch {
      applyCatalogFromResponse(
        { caseCost: FALLBACK_CASE_COST, rarityWeights: RARITY_WEIGHTS },
        catalogSkins.value,
      );
    }
  })();
  return loadPromise;
}

export function caseCardAccentBorder(caseId) {
  const borders = {
    budget: "border-l-emerald-500/70",
    classic: "border-l-sky-500/70",
    premium: "border-l-violet-500/70",
    elite: "border-l-amber-400/80",
  };
  return borders[caseId] ?? "border-l-zinc-600/50";
}
