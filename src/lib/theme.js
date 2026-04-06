const STORAGE_KEY = "casestrike_theme";

/** @type {readonly { id: string; label: string; desc: string }[]} */
export const THEMES = [
  { id: "amber", label: "Amber Strike", desc: "Classic gold — default CaseStrike look" },
  { id: "cyan", label: "Glacier", desc: "Ice-cold highlights, clean energy" },
  { id: "violet", label: "Doppler", desc: "High-tier purple flex" },
  { id: "emerald", label: "Dragon Lore", desc: "Rich green, legendary vibes" },
  { id: "rose", label: "Ruby Rush", desc: "Bold magenta-red accent" },
];

export function getStoredThemeId() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && THEMES.some((t) => t.id === raw)) return raw;
  } catch {
    /* ignore */
  }
  return "amber";
}

/** @param {string} id */
export function applyTheme(id) {
  if (!THEMES.some((t) => t.id === id)) id = "amber";
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.theme = id;
}

export function initTheme() {
  applyTheme(getStoredThemeId());
}
