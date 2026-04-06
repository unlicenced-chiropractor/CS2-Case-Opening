import { RARITY_WEIGHTS } from "../data/skins.js";

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const threshold = Math.random() * total;
  let current = 0;
  for (const item of items) {
    current += item.weight;
    if (threshold <= current) return item;
  }
  return items[items.length - 1];
}

export function rollSkin(rarityWeights, wearTable, skins) {
  const rarity = weightedPick(rarityWeights).rarity;
  const pool = skins.filter((skin) => skin.rarity === rarity);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  const wear = weightedPick(wearTable);
  const wearMultiplier = {
    "Factory New": 1.2,
    "Minimal Wear": 1.1,
    "Field-Tested": 1,
    "Well-Worn": 0.85,
    "Battle-Scarred": 0.72,
  }[wear.name];

  return {
    ...selected,
    wear: wear.name,
    shortWear: wear.short,
    value: Number((selected.value * wearMultiplier).toFixed(2)),
  };
}

export function makeSpinnerFeed(skins, amount = 60) {
  const feed = [];
  for (let i = 0; i < amount; i += 1) {
    feed.push(skins[Math.floor(Math.random() * skins.length)]);
  }
  return feed;
}

/**
 * Spinner strip biased by this case's luck pool (weights or percents), so each case looks different.
 */
export function makeCaseWeightedSpinnerFeed(skins, luckPool, amount = 60) {
  if (!Array.isArray(skins) || skins.length === 0) return [];
  const byRarity = {};
  for (const s of skins) {
    const r = s.rarity || "Mil-Spec";
    if (!byRarity[r]) byRarity[r] = [];
    byRarity[r].push(s);
  }
  const weightsRaw =
    Array.isArray(luckPool) && luckPool.length > 0
      ? luckPool.map((e) => ({
          rarity: e.rarity,
          weight: Number(e.weight !== undefined && e.weight !== null ? e.weight : e.percent) || 0,
        }))
      : [...RARITY_WEIGHTS];
  const totalW = weightsRaw.reduce((s, x) => s + x.weight, 0);
  const weights = totalW > 0 ? weightsRaw : [...RARITY_WEIGHTS];

  const feed = [];
  for (let i = 0; i < amount; i += 1) {
    const rar = weightedPick(weights).rarity;
    const pool = byRarity[rar];
    const pickFrom = pool?.length ? pool : skins;
    feed.push(pickFrom[Math.floor(Math.random() * pickFrom.length)]);
  }
  return feed;
}
