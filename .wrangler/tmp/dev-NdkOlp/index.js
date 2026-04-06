var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.js
var STIPEND_INTERVAL_MS = 15 * 60 * 1e3;
var STIPEND_AMOUNT = 100;
var STIPEND_THRESHOLD = 5;
var SESSION_TTL_MS = 1e3 * 60 * 60 * 24 * 7;
var CASE_COST = 10;
var WEAR_TABLE = [
  { name: "Factory New", short: "FN", weight: 15 },
  { name: "Minimal Wear", short: "MW", weight: 24 },
  { name: "Field-Tested", short: "FT", weight: 35 },
  { name: "Well-Worn", short: "WW", weight: 16 },
  { name: "Battle-Scarred", short: "BS", weight: 10 }
];
var RARITY_WEIGHTS = [
  { rarity: "Mil-Spec", weight: 55 },
  { rarity: "Restricted", weight: 28 },
  { rarity: "Classified", weight: 12 },
  { rarity: "Covert", weight: 4.5 },
  { rarity: "Rare Special", weight: 0.5 }
];
var SKINS = [
  { name: "AK-47 | Redline", rarity: "Classified", value: 14.8, icon: "https://cdn.csgoskins.gg/public/images/skins/ak-47-redline.png" },
  { name: "M4A1-S | Decimator", rarity: "Classified", value: 18.7, icon: "https://cdn.csgoskins.gg/public/images/skins/m4a1-s-decimator.png" },
  { name: "AWP | Neo-Noir", rarity: "Covert", value: 39.25, icon: "https://cdn.csgoskins.gg/public/images/skins/awp-neo-noir.png" },
  { name: "Desert Eagle | Mecha Industries", rarity: "Restricted", value: 7.15, icon: "https://cdn.csgoskins.gg/public/images/skins/desert-eagle-mecha-industries.png" },
  { name: "USP-S | Cortex", rarity: "Restricted", value: 5.62, icon: "https://cdn.csgoskins.gg/public/images/skins/usp-s-cortex.png" },
  { name: "Glock-18 | Vogue", rarity: "Restricted", value: 5.2, icon: "https://cdn.csgoskins.gg/public/images/skins/glock-18-vogue.png" },
  { name: "P250 | See Ya Later", rarity: "Classified", value: 11.3, icon: "https://cdn.csgoskins.gg/public/images/skins/p250-see-ya-later.png" },
  { name: "MP9 | Starlight Protector", rarity: "Covert", value: 31.9, icon: "https://cdn.csgoskins.gg/public/images/skins/mp9-starlight-protector.png" },
  { name: "MAC-10 | Neon Rider", rarity: "Restricted", value: 6.6, icon: "https://cdn.csgoskins.gg/public/images/skins/mac-10-neon-rider.png" },
  { name: "FAMAS | Mecha Industries", rarity: "Mil-Spec", value: 2.4, icon: "https://cdn.csgoskins.gg/public/images/skins/famas-mecha-industries.png" },
  { name: "SG 553 | Pulse", rarity: "Mil-Spec", value: 1.9, icon: "https://cdn.csgoskins.gg/public/images/skins/sg-553-pulse.png" },
  { name: "P90 | Elite Build", rarity: "Mil-Spec", value: 1.65, icon: "https://cdn.csgoskins.gg/public/images/skins/p90-elite-build.png" },
  { name: "Galil AR | Signal", rarity: "Mil-Spec", value: 1.25, icon: "https://cdn.csgoskins.gg/public/images/skins/galil-ar-signal.png" },
  { name: "XM1014 | Entombed", rarity: "Mil-Spec", value: 1.75, icon: "https://cdn.csgoskins.gg/public/images/skins/xm1014-entombed.png" },
  { name: "\u2605 Karambit | Doppler", rarity: "Rare Special", value: 980, icon: "https://cdn.csgoskins.gg/public/images/skins/karambit-doppler-factory-new.png" }
];
var worker_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS" && new URL(request.url).pathname.startsWith("/api/")) {
      return new Response(null, { headers: corsHeaders() });
    }
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return json({ error: "Assets binding missing. Build app and set [assets] in wrangler.toml." }, 500);
    }
    try {
      if (url.pathname === "/api/health" && request.method === "GET") {
        return json({ ok: true }, 200);
      }
      if (url.pathname === "/api/catalog" && request.method === "GET") {
        return json({ caseCost: CASE_COST, skins: SKINS, rarityWeights: RARITY_WEIGHTS }, 200);
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
      if (url.pathname === "/api/logout" && request.method === "POST") {
        return await logout(request, env);
      }
      if (url.pathname === "/api/open-case" && request.method === "POST") {
        return await openCase(request, env);
      }
      if (url.pathname === "/api/claim-stipend" && request.method === "POST") {
        return await claimStipend(request, env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Server error" }, 500);
    }
  }
};
async function register(request, env) {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  if (!email || password.length < 6) {
    return json({ error: "Invalid email or password (min 6 chars)." }, 400);
  }
  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists) return json({ error: "Email already exists." }, 409);
  const userId = crypto.randomUUID();
  const salt = randomToken(16);
  const passwordHash = await sha256Hex(`${password}:${salt}`);
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, salt, balance, last_stipend_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(userId, email, passwordHash, salt, 25, now, now).run();
  const session = await createSession(env, userId);
  return json({ token: session.token, user: { id: userId, email }, profile: await getProfile(env, userId) });
}
__name(register, "register");
async function login(request, env) {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const user = await env.DB.prepare("SELECT id, email, password_hash, salt FROM users WHERE email = ?").bind(email).first();
  if (!user) return json({ error: "Invalid credentials." }, 401);
  const check = await sha256Hex(`${password}:${user.salt}`);
  if (check !== user.password_hash) return json({ error: "Invalid credentials." }, 401);
  const session = await createSession(env, user.id);
  return json({
    token: session.token,
    user: { id: user.id, email: user.email },
    profile: await getProfile(env, user.id)
  });
}
__name(login, "login");
async function me(request, env) {
  const session = await requireSession(request, env);
  return json({
    user: { id: session.user.id, email: session.user.email },
    profile: await getProfile(env, session.user.id)
  });
}
__name(me, "me");
async function logout(request, env) {
  const token = getBearerToken(request);
  if (token) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  }
  return json({ ok: true });
}
__name(logout, "logout");
async function openCase(request, env) {
  const session = await requireSession(request, env);
  const body = await request.json();
  const cost = Number(body.cost ?? CASE_COST);
  if (!Number.isFinite(cost) || cost <= 0) {
    return json({ error: "Invalid case payload." }, 400);
  }
  const balanceRow = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(session.user.id).first();
  const currentBalance = Number(balanceRow?.balance ?? 0);
  if (currentBalance < cost) return json({ error: "Not enough credits for this case." }, 400);
  const selectedSkin = rollSkin();
  const now = Date.now();
  const nextBalance = currentBalance - cost + Number(selectedSkin.value ?? 0);
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET balance = ? WHERE id = ?").bind(nextBalance, session.user.id),
    env.DB.prepare(
      "INSERT INTO inventory (user_id, item_name, item_rarity, item_wear, item_icon, item_value, dropped_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      session.user.id,
      String(selectedSkin.name),
      String(selectedSkin.rarity || "Mil-Spec"),
      String(selectedSkin.wear || "Field-Tested"),
      String(selectedSkin.icon || ""),
      Number(selectedSkin.value || 0),
      now
    )
  ]);
  return json({ ok: true, drop: { ...selectedSkin, droppedAt: now }, profile: await getProfile(env, session.user.id) });
}
__name(openCase, "openCase");
async function claimStipend(request, env) {
  const session = await requireSession(request, env);
  const row = await env.DB.prepare("SELECT balance, last_stipend_at FROM users WHERE id = ?").bind(session.user.id).first();
  const now = Date.now();
  const balance = Number(row?.balance ?? 0);
  const last = Number(row?.last_stipend_at ?? 0);
  const eligible = balance < STIPEND_THRESHOLD && now - last >= STIPEND_INTERVAL_MS;
  if (eligible) {
    await env.DB.prepare("UPDATE users SET balance = ?, last_stipend_at = ? WHERE id = ?").bind(balance + STIPEND_AMOUNT, now, session.user.id).run();
  }
  return json({ paid: eligible, profile: await getProfile(env, session.user.id) });
}
__name(claimStipend, "claimStipend");
async function requireSession(request, env) {
  const token = getBearerToken(request);
  if (!token) throw new Error("Missing auth token.");
  const session = await env.DB.prepare(
    "SELECT s.token, s.user_id, s.expires_at, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?"
  ).bind(token).first();
  if (!session) throw new Error("Unauthorized.");
  if (Number(session.expires_at) < Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    throw new Error("Session expired.");
  }
  return { user: { id: session.user_id, email: session.email }, token: session.token };
}
__name(requireSession, "requireSession");
async function createSession(env, userId) {
  const token = randomToken(48);
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  await env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(token, userId, expiresAt, now).run();
  return { token, expiresAt };
}
__name(createSession, "createSession");
async function getProfile(env, userId) {
  const user = await env.DB.prepare("SELECT balance, last_stipend_at FROM users WHERE id = ?").bind(userId).first();
  const inventoryRows = await env.DB.prepare(
    "SELECT item_name, item_rarity, item_wear, item_icon, item_value, dropped_at FROM inventory WHERE user_id = ? ORDER BY dropped_at DESC"
  ).bind(userId).all();
  return {
    balance: Number(user?.balance ?? 0),
    lastStipendAt: Number(user?.last_stipend_at ?? 0),
    inventory: (inventoryRows.results || []).map((item) => ({
      name: item.item_name,
      rarity: item.item_rarity,
      wear: item.item_wear,
      icon: item.item_icon,
      value: Number(item.item_value),
      droppedAt: Number(item.dropped_at)
    }))
  };
}
__name(getProfile, "getProfile");
function getBearerToken(request) {
  const raw = request.headers.get("Authorization") || "";
  if (!raw.startsWith("Bearer ")) return "";
  return raw.replace("Bearer ", "").trim();
}
__name(getBearerToken, "getBearerToken");
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}
__name(normalizeEmail, "normalizeEmail");
async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256Hex, "sha256Hex");
function randomToken(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomToken, "randomToken");
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
__name(weightedPick, "weightedPick");
function rollSkin() {
  const rarity = weightedPick(RARITY_WEIGHTS).rarity;
  const pool = SKINS.filter((skin) => skin.rarity === rarity);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  const wear = weightedPick(WEAR_TABLE);
  const wearMultiplier = {
    "Factory New": 1.2,
    "Minimal Wear": 1.1,
    "Field-Tested": 1,
    "Well-Worn": 0.85,
    "Battle-Scarred": 0.72
  }[wear.name];
  return {
    ...selected,
    wear: wear.name,
    shortWear: wear.short,
    value: Number((selected.value * wearMultiplier).toFixed(2))
  };
}
__name(rollSkin, "rollSkin");
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}
__name(corsHeaders, "corsHeaders");
function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}
__name(json, "json");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-LeG4UV/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-LeG4UV/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
