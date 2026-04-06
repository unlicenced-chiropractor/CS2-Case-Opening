export const WEAR_TABLE = [
  { name: "Factory New", short: "FN", weight: 15 },
  { name: "Minimal Wear", short: "MW", weight: 24 },
  { name: "Field-Tested", short: "FT", weight: 35 },
  { name: "Well-Worn", short: "WW", weight: 16 },
  { name: "Battle-Scarred", short: "BS", weight: 10 },
];

export const CASE_COST = 10;

export const RARITY_WEIGHTS = [
  { rarity: "Mil-Spec", weight: 55 },
  { rarity: "Restricted", weight: 28 },
  { rarity: "Classified", weight: 12 },
  { rarity: "Covert", weight: 4.5 },
  { rarity: "Rare Special", weight: 0.5 },
];

// border color + glow class pairs used by CaseSpinner and inventory cards
export const RARITY_STYLES = {
  "Mil-Spec": {
    border: "border-sky-500/60",
    glow: "glow-milspec",
    label: "text-sky-400",
    bg: "from-sky-950/40",
  },
  Restricted: {
    border: "border-violet-500/60",
    glow: "glow-restricted",
    label: "text-violet-400",
    bg: "from-violet-950/40",
  },
  Classified: {
    border: "border-pink-500/60",
    glow: "glow-classified",
    label: "text-pink-400",
    bg: "from-pink-950/40",
  },
  Covert: {
    border: "border-red-500/60",
    glow: "glow-covert",
    label: "text-red-400",
    bg: "from-red-950/40",
  },
  "Rare Special": {
    border: "border-amber-400/70",
    glow: "glow-rare",
    label: "text-amber-300",
    bg: "from-amber-950/40",
  },
};

// Legacy alias kept so nothing else breaks
export const RARITY_COLORS = Object.fromEntries(
  Object.entries(RARITY_STYLES).map(([k, v]) => [k, v.border]),
);

export const SKINS = [
  {
    name: "AK-47 | Redline",
    rarity: "Classified",
    value: 14.8,
    icon: "https://cdn.csgoskins.gg/public/images/skins/ak-47-redline.png",
  },
  {
    name: "M4A1-S | Decimator",
    rarity: "Classified",
    value: 18.7,
    icon: "https://cdn.csgoskins.gg/public/images/skins/m4a1-s-decimator.png",
  },
  {
    name: "AWP | Neo-Noir",
    rarity: "Covert",
    value: 39.25,
    icon: "https://cdn.csgoskins.gg/public/images/skins/awp-neo-noir.png",
  },
  {
    name: "Desert Eagle | Mecha Industries",
    rarity: "Restricted",
    value: 7.15,
    icon: "https://cdn.csgoskins.gg/public/images/skins/desert-eagle-mecha-industries.png",
  },
  {
    name: "USP-S | Cortex",
    rarity: "Restricted",
    value: 5.62,
    icon: "https://cdn.csgoskins.gg/public/images/skins/usp-s-cortex.png",
  },
  {
    name: "Glock-18 | Vogue",
    rarity: "Restricted",
    value: 5.2,
    icon: "https://cdn.csgoskins.gg/public/images/skins/glock-18-vogue.png",
  },
  {
    name: "P250 | See Ya Later",
    rarity: "Classified",
    value: 11.3,
    icon: "https://cdn.csgoskins.gg/public/images/skins/p250-see-ya-later.png",
  },
  {
    name: "MP9 | Starlight Protector",
    rarity: "Covert",
    value: 31.9,
    icon: "https://cdn.csgoskins.gg/public/images/skins/mp9-starlight-protector.png",
  },
  {
    name: "MAC-10 | Neon Rider",
    rarity: "Restricted",
    value: 6.6,
    icon: "https://cdn.csgoskins.gg/public/images/skins/mac-10-neon-rider.png",
  },
  {
    name: "FAMAS | Mecha Industries",
    rarity: "Mil-Spec",
    value: 2.4,
    icon: "https://cdn.csgoskins.gg/public/images/skins/famas-mecha-industries.png",
  },
  {
    name: "SG 553 | Pulse",
    rarity: "Mil-Spec",
    value: 1.9,
    icon: "https://cdn.csgoskins.gg/public/images/skins/sg-553-pulse.png",
  },
  {
    name: "P90 | Elite Build",
    rarity: "Mil-Spec",
    value: 1.65,
    icon: "https://cdn.csgoskins.gg/public/images/skins/p90-elite-build.png",
  },
  {
    name: "Galil AR | Signal",
    rarity: "Mil-Spec",
    value: 1.25,
    icon: "https://cdn.csgoskins.gg/public/images/skins/galil-ar-signal.png",
  },
  {
    name: "XM1014 | Entombed",
    rarity: "Mil-Spec",
    value: 1.75,
    icon: "https://cdn.csgoskins.gg/public/images/skins/xm1014-entombed.png",
  },
  {
    name: "★ Karambit | Doppler",
    rarity: "Rare Special",
    value: 980,
    icon: "https://cdn.csgoskins.gg/public/images/skins/karambit-doppler-factory-new.png",
  },
];
