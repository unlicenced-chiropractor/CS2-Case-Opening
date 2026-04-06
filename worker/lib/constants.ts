export const CASE_COST = 10;
export const STIPEND_INTERVAL_MS = 15 * 60 * 1000;
export const STIPEND_THRESHOLD = 5;
export const STIPEND_AMOUNT = 100;
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const RESET_LINK_TTL_MS = 24 * 60 * 60 * 1000;
export const CATALOG_CACHE_TTL_MS = 10 * 60 * 1000;

export const BYMYKEL_SKINS_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json";

export const WEAR_TABLE = [
  { name: "Factory New", short: "FN", weight: 15 },
  { name: "Minimal Wear", short: "MW", weight: 24 },
  { name: "Field-Tested", short: "FT", weight: 35 },
  { name: "Well-Worn", short: "WW", weight: 16 },
  { name: "Battle-Scarred", short: "BS", weight: 10 },
] as const;

export const WEAR_MULTIPLIER = {
  "Factory New": 1.2,
  "Minimal Wear": 1.1,
  "Field-Tested": 1,
  "Well-Worn": 0.85,
  "Battle-Scarred": 0.72,
} as const;

export const RARITY_WEIGHTS = [
  { rarity: "Mil-Spec", weight: 55 },
  { rarity: "Restricted", weight: 28 },
  { rarity: "Classified", weight: 12 },
  { rarity: "Covert", weight: 4.5 },
  { rarity: "Rare Special", weight: 0.5 },
] as const;

export const RARITY_TIER: Record<string, number> = {
  "Mil-Spec": 0,
  Restricted: 1,
  Classified: 2,
  Covert: 3,
  "Rare Special": 4,
};

export const SKINS = [
  {
    name: "AK-47 | Redline",
    rarity: "Classified",
    value: 14.8,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_ak47_gs_ak47_redline_light_png.png",
  },
  {
    name: "M4A1-S | Decimator",
    rarity: "Classified",
    value: 18.7,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_m4a1_silencer_gs_m4a1_s_decimator_light_png.png",
  },
  {
    name: "AWP | Neo-Noir",
    rarity: "Covert",
    value: 39.25,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_awp_aq_awp_neo_noir_light_png.png",
  },
  {
    name: "USP-S | Cortex",
    rarity: "Restricted",
    value: 5.62,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_usp_silencer_gs_usp_s_cortex_light_png.png",
  },
  {
    name: "Desert Eagle | Mecha Industries",
    rarity: "Restricted",
    value: 7.15,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_deagle_gs_deagle_mecha_light_png.png",
  },
  {
    name: "Glock-18 | Vogue",
    rarity: "Restricted",
    value: 5.2,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_glock_gs_glock_vogue_light_png.png",
  },
  {
    name: "P250 | See Ya Later",
    rarity: "Classified",
    value: 11.3,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_p250_gs_p250_see_ya_later_light_png.png",
  },
  {
    name: "MP9 | Starlight Protector",
    rarity: "Covert",
    value: 31.9,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_mp9_gs_mp9_starlight_protector_light_png.png",
  },
  {
    name: "MAC-10 | Neon Rider",
    rarity: "Restricted",
    value: 6.6,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_mac10_gs_mac10_neon_rider_light_png.png",
  },
  {
    name: "FAMAS | Mecha Industries",
    rarity: "Mil-Spec",
    value: 2.4,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_famas_gs_famas_mecha_light_png.png",
  },
  {
    name: "SG 553 | Pulse",
    rarity: "Mil-Spec",
    value: 1.9,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_sg556_gs_sg553_pulse_light_png.png",
  },
  {
    name: "P90 | Elite Build",
    rarity: "Mil-Spec",
    value: 1.65,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_p90_gs_p90_elite_build_light_png.png",
  },
  {
    name: "Galil AR | Signal",
    rarity: "Mil-Spec",
    value: 1.25,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_galilar_gs_galilar_signal_light_png.png",
  },
  {
    name: "XM1014 | Entombed",
    rarity: "Mil-Spec",
    value: 1.75,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_xm1014_cu_xm1014_mayan_light_png.png",
  },
  {
    name: "★ Karambit | Doppler",
    rarity: "Rare Special",
    value: 980,
    icon: "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_knife_karambit_am_doppler_phase1_light_png.png",
  },
] as const;
