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
