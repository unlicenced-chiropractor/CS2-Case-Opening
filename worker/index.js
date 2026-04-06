const STIPEND_INTERVAL_MS = 15 * 60 * 1000;
const STIPEND_AMOUNT = 100;
const STIPEND_THRESHOLD = 5;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const CASE_COST = 10;
const BYMYKEL_SKINS_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json";
const CATALOG_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — data is static, refresh once per hour

const WEAR_TABLE = [
  { name: "Factory New", short: "FN", weight: 15 },
  { name: "Minimal Wear", short: "MW", weight: 24 },
  { name: "Field-Tested", short: "FT", weight: 35 },
  { name: "Well-Worn", short: "WW", weight: 16 },
  { name: "Battle-Scarred", short: "BS", weight: 10 },
];

const RARITY_WEIGHTS = [
  { rarity: "Mil-Spec", weight: 55 },
  { rarity: "Restricted", weight: 28 },
  { rarity: "Classified", weight: 12 },
  { rarity: "Covert", weight: 4.5 },
  { rarity: "Rare Special", weight: 0.5 },
];

const SKINS = [
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

let catalogCache = {
  loadedAt: 0,
  skins: [],
};

export default {
  async fetch(request, env) {
    if (
      request.method === "OPTIONS" &&
      new URL(request.url).pathname.startsWith("/api/")
    ) {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return json(
        {
          error:
            "Assets binding missing. Build app and set [assets] in wrangler.toml.",
        },
        500,
      );
    }

    try {
      if (url.pathname === "/api/health" && request.method === "GET") {
        return json({ ok: true }, 200);
      }
      if (url.pathname === "/api/image" && request.method === "GET") {
        return await proxyImage(url);
      }
      if (url.pathname === "/api/catalog" && request.method === "GET") {
        const catalog = await getCatalog(env);
        return json(
          {
            caseCost: CASE_COST,
            skins: catalog.skins,
            rarityWeights: RARITY_WEIGHTS,
            source: catalog.source,
          },
          200,
        );
      }
      if (url.pathname === "/api/register" && request.method === "POST") {
        return await register(request, env);
      }
      if (url.pathname === "/api/login" && request.method === "POST") {
        return await login(request, env);
      }
      if (url.pathname === "/api/me" && request.method === "GET") {
        return await me(request, env);
      }
      if (url.pathname === "/api/admin/me" && request.method === "GET") {
        return await adminMe(request, env);
      }
      if (url.pathname === "/api/logout" && request.method === "POST") {
        return await logout(request, env);
      }
      if (url.pathname === "/api/open-case" && request.method === "POST") {
        return await openCase(request, env);
      }
      if (url.pathname === "/api/claim-stipend" && request.method === "POST") {
        return await claimStipend(request, env);
      }
      if (url.pathname === "/api/sell-item" && request.method === "POST") {
        return await sellItem(request, env);
      }
      if (url.pathname === "/api/admin/users" && request.method === "GET") {
        return await adminUsers(request, env);
      }
      if (url.pathname === "/api/admin/set-admin" && request.method === "POST") {
        return await setAdmin(request, env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      const status = Number.isInteger(err?.status) ? err.status : 500;
      return json({ error: err.message || "Server error" }, status);
    }
  },
};

async function register(request, env) {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  if (!email || password.length < 6) {
    return json({ error: "Invalid email or password (min 6 chars)." }, 400);
  }

  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();
  if (exists) return json({ error: "Email already exists." }, 409);

  const userId = crypto.randomUUID();
  const salt = randomToken(16);
  const passwordHash = await sha256Hex(`${password}:${salt}`);
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, salt, balance, last_stipend_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(userId, email, passwordHash, salt, 25, now, now)
    .run();

  const session = await createSession(env, userId);
  return json({
    token: session.token,
    user: {
      id: userId,
      email,
      isAdmin: false,
    },
    profile: await getProfile(env, userId),
  });
}

async function proxyImage(url) {
  const sourceUrl = url.searchParams.get("url");
  if (!sourceUrl) return imageFallback("Missing image url");

  let parsed;
  try {
    parsed = new URL(sourceUrl);
  } catch (_err) {
    return imageFallback("Invalid image url");
  }

  if (!isAllowedImageHost(parsed.hostname)) {
    return imageFallback("Image host blocked");
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "CaseStrike/1.0",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    if (!upstream.ok) return imageFallback(`Upstream ${upstream.status}`);

    const contentType = upstream.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) {
      return imageFallback("Invalid content type");
    }

    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=86400",
        ...corsHeaders(),
      },
    });
  } catch (_err) {
    return imageFallback("Proxy fetch failed");
  }
}

async function login(request, env) {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const user = await env.DB.prepare(
    "SELECT id, email, password_hash, salt, COALESCE(is_admin, 0) AS is_admin FROM users WHERE email = ?",
  )
    .bind(email)
    .first();

  if (!user) return json({ error: "Invalid credentials." }, 401);
  const check = await sha256Hex(`${password}:${user.salt}`);
  if (check !== user.password_hash)
    return json({ error: "Invalid credentials." }, 401);

  const session = await createSession(env, user.id);
  return json({
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      isAdmin: asBoolean(user.is_admin),
    },
    profile: await getProfile(env, user.id),
  });
}

async function me(request, env) {
  const session = await requireSession(request, env);
  return json({
    user: {
      id: session.user.id,
      email: session.user.email,
      isAdmin: asBoolean(session.user.isAdmin),
    },
    profile: await getProfile(env, session.user.id),
  });
}

async function logout(request, env) {
  const token = getBearerToken(request);
  if (token) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?")
      .bind(token)
      .run();
  }
  return json({ ok: true });
}

async function openCase(request, env) {
  const session = await requireSession(request, env);
  const body = await request.json();
  const cost = Number(body.cost ?? CASE_COST);
  if (!Number.isFinite(cost) || cost <= 0) {
    return json({ error: "Invalid case payload." }, 400);
  }

  const balanceRow = await env.DB.prepare(
    "SELECT balance FROM users WHERE id = ?",
  )
    .bind(session.user.id)
    .first();
  const currentBalance = Number(balanceRow?.balance ?? 0);
  if (currentBalance < cost)
    return json({ error: "Not enough credits for this case." }, 400);

  const catalog = await getCatalog(env);
  const selectedSkin = rollSkin(catalog.skins);
  const now = Date.now();
  const nextBalance = currentBalance - cost + Number(selectedSkin.value ?? 0);

  await env.DB.batch([
    env.DB.prepare("UPDATE users SET balance = ? WHERE id = ?").bind(
      nextBalance,
      session.user.id,
    ),
    env.DB.prepare(
      "INSERT INTO inventory (user_id, item_name, item_rarity, item_wear, item_icon, item_value, dropped_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(
      session.user.id,
      String(selectedSkin.name),
      String(selectedSkin.rarity || "Mil-Spec"),
      String(selectedSkin.wear || "Field-Tested"),
      String(selectedSkin.icon || ""),
      Number(selectedSkin.value || 0),
      now,
    ),
  ]);

  return json({
    ok: true,
    drop: { ...selectedSkin, droppedAt: now },
    profile: await getProfile(env, session.user.id),
  });
}

async function sellItem(request, env) {
  const session = await requireSession(request, env);
  const body = await request.json();
  const inventoryId = Number(body.inventoryId);
  if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
    return json({ error: "Invalid inventory item." }, 400);
  }

  // Verify the item belongs to this user and has not already been sold.
  const item = await env.DB.prepare(
    "SELECT id, item_value, sold_at FROM inventory WHERE id = ? AND user_id = ?",
  )
    .bind(inventoryId, session.user.id)
    .first();

  if (!item) return json({ error: "Item not found." }, 404);
  if (item.sold_at !== null) return json({ error: "Item already sold." }, 409);

  const saleValue = Number(item.item_value);
  const now = Date.now();

  await env.DB.batch([
    env.DB.prepare("UPDATE inventory SET sold_at = ? WHERE id = ?").bind(
      now,
      inventoryId,
    ),
    env.DB.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").bind(
      saleValue,
      session.user.id,
    ),
  ]);

  return json({
    ok: true,
    soldValue: saleValue,
    profile: await getProfile(env, session.user.id),
  });
}

async function claimStipend(request, env) {
  const session = await requireSession(request, env);
  const row = await env.DB.prepare(
    "SELECT balance, last_stipend_at FROM users WHERE id = ?",
  )
    .bind(session.user.id)
    .first();
  const now = Date.now();
  const balance = Number(row?.balance ?? 0);
  const last = Number(row?.last_stipend_at ?? 0);
  const eligible =
    balance < STIPEND_THRESHOLD && now - last >= STIPEND_INTERVAL_MS;

  if (eligible) {
    await env.DB.prepare(
      "UPDATE users SET balance = ?, last_stipend_at = ? WHERE id = ?",
    )
      .bind(balance + STIPEND_AMOUNT, now, session.user.id)
      .run();
  }

  return json({
    paid: eligible,
    profile: await getProfile(env, session.user.id),
  });
}

async function requireSession(request, env) {
  const token = getBearerToken(request);
  if (!token) {
    throwObjectStatus("Missing auth token.", 401);
  }

  const session = await env.DB.prepare(
    "SELECT s.token, s.user_id, s.expires_at, u.email, COALESCE(u.is_admin, 0) AS is_admin FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?",
  )
    .bind(token)
    .first();
  if (!session) {
    throwObjectStatus("Unauthorized.", 401);
  }
  if (Number(session.expires_at) < Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?")
      .bind(token)
      .run();
    throwObjectStatus("Session expired.", 401);
  }
  return {
    user: {
      id: session.user_id,
      email: session.email,
      isAdmin: Number(session.is_admin) === 1,
    },
    token: session.token,
  };
}

async function requireAdmin(request, env) {
  const session = await requireSession(request, env);
  if (!session.user.isAdmin) {
    throwObjectStatus("Admin access required.", 403);
  }
  return session;
}

async function createSession(env, userId) {
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

async function getProfile(env, userId) {
  const user = await env.DB.prepare(
    "SELECT balance, last_stipend_at FROM users WHERE id = ?",
  )
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

async function adminMe(request, env) {
  const session = await requireSession(request, env);

  return json({
    userId: session.user.id,
    isAdmin: asBoolean(session.user.isAdmin),
  });
}

async function adminUsers(request, env) {
  const session = await requireAdmin(request, env);

  const rows = await env.DB.prepare(
    "SELECT id, email, COALESCE(is_admin, 0) AS is_admin, created_at FROM users ORDER BY created_at DESC",
  )
    .all();

  const users = (rows.results || []).map((row) => ({
    id: row.id,
    email: row.email,
    isAdmin: asBoolean(row.is_admin),
    createdAt: Number(row.created_at ?? 0),
  }));

  return json({ users });
}

async function setAdmin(request, env) {
  const session = await requireAdmin(request, env);
  const body = await request.json();
  const userId = String(body.userId || "").trim();
  const nextAdmin = Number(body.isAdmin);

  if (!userId) {
    throwObjectStatus("Missing userId.", 400);
  }

  if (nextAdmin !== 0 && nextAdmin !== 1) {
    throwObjectStatus("isAdmin must be 0 or 1.", 400);
  }

  if (userId === session.user.id && nextAdmin === 0) {
    throwObjectStatus("Cannot remove your own admin role.", 400);
  }

  const row = await env.DB.prepare("SELECT id FROM users WHERE id = ?")
    .bind(userId)
    .first();
  if (!row) {
    throwObjectStatus("User not found.", 404);
  }

  await env.DB.prepare("UPDATE users SET is_admin = ? WHERE id = ?")
    .bind(nextAdmin, userId)
    .run();

  const refreshed = await env.DB.prepare(
    "SELECT id, email, COALESCE(is_admin, 0) AS is_admin, created_at FROM users WHERE id = ?",
  )
    .bind(userId)
    .first();

  return json({
    ok: true,
    user: {
      id: refreshed.id,
      email: refreshed.email,
      isAdmin: asBoolean(refreshed.is_admin),
      createdAt: Number(refreshed.created_at ?? 0),
    },
    actor: {
      id: session.user.id,
      email: session.user.email,
    },
  });
}

function getBearerToken(request) {
  const raw = request.headers.get("Authorization") || "";
  if (!raw.startsWith("Bearer ")) return "";
  return raw.replace("Bearer ", "").trim();
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

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

function rollSkin(sourceSkins) {
  const skins =
    Array.isArray(sourceSkins) && sourceSkins.length ? sourceSkins : SKINS;
  const rarity = weightedPick(RARITY_WEIGHTS).rarity;
  const pool = skins.filter((skin) => skin.rarity === rarity);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  const wear = weightedPick(WEAR_TABLE);
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

async function getCatalog(_env) {
  const now = Date.now();
  if (
    catalogCache.skins.length &&
    now - catalogCache.loadedAt < CATALOG_CACHE_TTL_MS
  ) {
    return { skins: catalogCache.skins, source: "bymykel-cache" };
  }

  try {
    const response = await fetch(BYMYKEL_SKINS_URL, {
      headers: { "User-Agent": "CaseStrike/1.0" },
    });
    if (!response.ok) throw new Error(`ByMykel API error ${response.status}`);

    const items = await response.json();
    const mapped = mapBymykelSkinsToSkins(Array.isArray(items) ? items : []);
    if (!mapped.length) throw new Error("No usable skins from ByMykel API.");

    catalogCache = { loadedAt: now, skins: mapped };
    return { skins: mapped, source: "bymykel" };
  } catch (_err) {
    return { skins: SKINS, source: "local-fallback" };
  }
}

// Maps the rarity id strings from ByMykel API to the internal rarity labels
// used by RARITY_WEIGHTS so the weighted roll logic keeps working unchanged.
function rarityFromBymykel(rarityId) {
  const map = {
    rarity_common_weapon: "Mil-Spec", // Consumer Grade  → treat as Mil-Spec pool
    rarity_uncommon_weapon: "Mil-Spec", // Industrial Grade → treat as Mil-Spec pool
    rarity_rare_weapon: "Mil-Spec",
    rarity_mythical_weapon: "Restricted",
    rarity_legendary_weapon: "Classified",
    rarity_ancient_weapon: "Covert",
    rarity_ancient: "Covert",
    rarity_contraband: "Rare Special",
  };
  return map[String(rarityId)] || "Mil-Spec";
}

function mapBymykelSkinsToSkins(items) {
  const out = [];
  // Only keep normal (non-souvenir, non-stattrak) skins that have an image.
  for (const item of items) {
    if (!item?.name || !item?.image) continue;
    if (item.souvenir || item.stattrak) continue;

    const rarityId = item?.rarity?.id ?? "";
    const rarity = rarityFromBymykel(rarityId);

    // wear comes from the wear object on the not-grouped endpoint
    const wear = item?.wear?.name || "Field-Tested";

    // Use a sensible placeholder value bucketed by rarity since the
    // ByMykel API is purely cosmetic data with no live pricing.
    const defaultValues = {
      "Mil-Spec": 2.5,
      Restricted: 7.0,
      Classified: 15.0,
      Covert: 40.0,
      "Rare Special": 500.0,
    };
    const value = defaultValues[rarity] ?? 2.5;

    out.push({
      name: String(item.name).trim(),
      rarity,
      wear,
      value,
      icon: String(item.image),
    });
  }
  return out;
}

function isAllowedImageHost(hostname) {
  const allowed = [
    "community.cloudflare.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "raw.githubusercontent.com",
    "cdn.steamstatic.com",
    "community.akamai.steamstatic.com",
  ];
  return allowed.includes(hostname);
}

function imageFallback(reason = "Image unavailable") {
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

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function throwObjectStatus(message, status) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function asBoolean(value) {
  return Number(value) === 1;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}
