import {
  BYMYKEL_SKINS_URL,
  CATALOG_CACHE_TTL_MS,
  RARITY_WEIGHTS,
  SESSION_TTL_MS,
  SKINS,
  WEAR_MULTIPLIER,
  WEAR_TABLE,
} from "./constants";
import { type CatalogCache, type Env, type RollCatalogResult, type Skin, type Session } from "./types";

const CATALOG_FALLBACK_SKINS = SKINS as unknown as Skin[];

let catalogCache: CatalogCache = {
  loadedAt: 0,
  skins: CATALOG_FALLBACK_SKINS,
};

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  } as const;
}

export type JsonPayload =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

export function json(payload: JsonPayload, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}

export function getBearerToken(request: Request): string {
  const raw = request.headers.get("Authorization") || "";
  if (!raw.startsWith("Bearer ")) return "";
  return raw.replace("Bearer ", "").trim();
}

export function normalizeEmail(value: unknown): string {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function randomToken(bytes: number): string {
  const bytesArr = new Uint8Array(bytes);
  crypto.getRandomValues(bytesArr);
  return [...bytesArr].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export interface WeightedItem {
  weight: number;
}

export function weightedPick<T extends WeightedItem>(items: ReadonlyArray<T>): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const threshold = Math.random() * total;
  let current = 0;
  for (const item of items) {
    current += item.weight;
    if (threshold <= current) return item;
  }
  return items[items.length - 1] as T;
}

export interface WearEntry {
  name: string;
  short: string;
  weight: number;
}

export function rollSkin(
  sourceSkins: Skin[],
  luckPool?: ReadonlyArray<{ rarity: string; weight: number }> | null,
): Skin {
  const skins =
    Array.isArray(sourceSkins) && sourceSkins.length > 0
      ? sourceSkins
      : CATALOG_FALLBACK_SKINS;

  const weights: ReadonlyArray<{ rarity: string; weight: number }> =
    luckPool && luckPool.length > 0
      ? luckPool
      : (RARITY_WEIGHTS as ReadonlyArray<{ rarity: string; weight: number }>);

  const rarity = weightedPick(weights);
  let pool = skins.filter((skin) => skin.rarity === (rarity as { rarity: string }).rarity);
  if (!pool.length) {
    pool = skins;
  }
  const selected = pool[Math.floor(Math.random() * pool.length)] as Skin;
  const wear = weightedPick(WEAR_TABLE as readonly WearEntry[]);
  const wearMultiplier = WEAR_MULTIPLIER[wear.name as keyof typeof WEAR_MULTIPLIER];

  return {
    ...selected,
    wear: wear.name,
    shortWear: wear.short,
    value: Number((selected.value * wearMultiplier).toFixed(2)),
  };
}

function rarityFromBymykel(rarityId: string): string {
  const map: Record<string, string> = {
    rarity_common_weapon: "Mil-Spec",
    rarity_uncommon_weapon: "Mil-Spec",
    rarity_rare_weapon: "Mil-Spec",
    rarity_mythical_weapon: "Restricted",
    rarity_legendary_weapon: "Classified",
    rarity_ancient_weapon: "Covert",
    rarity_ancient: "Covert",
    rarity_contraband: "Rare Special",
  };
  return map[String(rarityId)] || "Mil-Spec";
}

function mapBymykelSkinsToSkins(items: unknown[]): Skin[] {
  const out: Skin[] = [];
  const defaults: Record<string, number> = {
    "Mil-Spec": 2.5,
    Restricted: 7.0,
    Classified: 15.0,
    Covert: 40.0,
    "Rare Special": 500.0,
  };

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const value = item as Record<string, unknown>;
    if (!value.name || !value.image) continue;
    if (value.souvenir || value.stattrak) continue;

    const rarityId = (value.rarity as { id?: string } | undefined)?.id ?? "";
    const rarity = rarityFromBymykel(rarityId);
    const wear = String((value.wear as { name?: string } | undefined)?.name || "Field-Tested");
    const fallbackValue = defaults[rarity] ?? 2.5;

    out.push({
      name: String(value.name).trim(),
      rarity,
      wear,
      value: fallbackValue,
      icon: String(value.image),
    });
  }

  return out;
}

export async function getCatalog(_env: Env): Promise<RollCatalogResult> {
  const now = Date.now();

  if (catalogCache.skins.length && now - catalogCache.loadedAt < CATALOG_CACHE_TTL_MS) {
    return { skins: catalogCache.skins, source: "bymykel-cache" };
  }

  try {
    const response = await fetch(BYMYKEL_SKINS_URL, {
      headers: { "User-Agent": "CaseStrike/1.0" },
    });
    if (!response.ok) {
      throw new Error(`ByMykel API error ${response.status}`);
    }

    const payload = await response.json();
    const mapped = mapBymykelSkinsToSkins(Array.isArray(payload) ? payload : []);
    if (!mapped.length) {
      throw new Error("No usable skins from ByMykel API.");
    }

    catalogCache = {
      loadedAt: now,
      skins: mapped,
    };

    return { skins: mapped, source: "bymykel" };
  } catch (_error) {
    return { skins: CATALOG_FALLBACK_SKINS, source: "local-fallback" };
  }
}

export function asBoolean(value: unknown): boolean {
  return Number(value) === 1;
}

export function isAllowedImageHost(hostname: string): boolean {
  const host = String(hostname || "").toLowerCase();
  const exactAllowed = new Set([
    "community.cloudflare.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "raw.githubusercontent.com",
    "cdn.steamstatic.com",
    "community.akamai.steamstatic.com",
    "cdn.csgoskins.gg",
    "bymykel.github.io",
    "i.imgur.com",
  ]);

  const suffixAllowed = ["akamaihd.net", "steamstatic.com"];

  if (exactAllowed.has(host)) return true;

  return suffixAllowed.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  );
}

export function imageFallback(reason = "Image unavailable"): Response {
  const safeReason = String(reason).replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80"><rect width="320" height="80" fill="#111827"/><text x="50%" y="44%" dominant-baseline="middle" text-anchor="middle" fill="#e5e7eb" font-family="Arial" font-size="14">Skin image unavailable</text><text x="50%" y="64%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="11">${safeReason}</text></svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=300",
      ...corsHeaders(),
    },
  });
}

export function throwObjectStatus(message: string, status: number): never {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  throw error;
}

export async function requireSession(request: Request, env: Env): Promise<Session> {
  const token = getBearerToken(request);
  if (!token) throwObjectStatus("Missing auth token.", 401);

  const row = await env.DB.prepare(
    "SELECT s.token, s.user_id, s.expires_at, u.email, COALESCE(u.is_admin, 0) AS is_admin FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?",
  )
    .bind(token)
    .first();

  if (!row) {
    throwObjectStatus("Unauthorized.", 401);
  }

  if (Number(row.expires_at) < Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    throwObjectStatus("Session expired.", 401);
  }

  return {
    user: {
      id: String(row.user_id),
      email: String(row.email),
      isAdmin: asBoolean(row.is_admin),
    },
    token: String(row.token),
  };
}

export async function requireAdmin(request: Request, env: Env): Promise<Session> {
  const session = await requireSession(request, env);
  if (!session.user.isAdmin) {
    throwObjectStatus("Admin access required.", 403);
  }
  return session;
}

export async function getProfile(env: Env, userId: string) {
  const user = await env.DB.prepare("SELECT balance, last_stipend_at FROM users WHERE id = ?")
    .bind(userId)
    .first();

  const inventoryRows = await env.DB.prepare(
    "SELECT id, item_name, item_rarity, item_wear, item_icon, item_value, dropped_at FROM inventory WHERE user_id = ? AND sold_at IS NULL ORDER BY dropped_at DESC",
  )
    .bind(userId)
    .all();

  return {
    balance: Number(user?.balance ?? 0),
    lastStipendAt: Number(user?.last_stipend_at ?? 0),
    inventory: (inventoryRows.results || []).map((item) => ({
      id: item.id,
      name: item.item_name,
      rarity: item.item_rarity,
      wear: item.item_wear,
      icon: item.item_icon,
      value: Number(item.item_value),
      droppedAt: Number(item.dropped_at),
    })),
  };
}

export async function createSession(env: Env, userId: string): Promise<{ token: string; expiresAt: number }> {
  const token = randomToken(48);
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  await env.DB.prepare(
    "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(token, userId, expiresAt, now)
    .run();

  return { token, expiresAt };
}
