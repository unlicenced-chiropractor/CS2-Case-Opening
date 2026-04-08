import { CASE_SKINS, RARITY_TIER } from "../../lib/constants";
import { getProfile, json, requireSession } from "../../lib/utils";
import type { RouteContext } from "../../lib/types";

// Flat deduplicated list of all curated skins across all cases
const ALL_CURATED_SKINS = Object.values(CASE_SKINS)
  .flat()
  .filter(
    (skin, idx, arr) => arr.findIndex((s) => s.name === skin.name) === idx,
  );

export async function post({ request, env }: RouteContext): Promise<Response> {
  const session = await requireSession(request, env);
  const body = (await request.json()) as {
    inputId?: unknown;
    targetName?: unknown;
  };

  const inputId = Number(body.inputId);
  const targetName = String(body.targetName ?? "").trim();

  if (!Number.isInteger(inputId) || inputId <= 0) {
    return json({ error: "Invalid input item." }, 400);
  }
  if (!targetName) {
    return json({ error: "No target skin specified." }, 400);
  }

  const inputRow = await env.DB.prepare(
    "SELECT id, item_name, item_rarity, item_wear, item_icon, item_value, sold_at FROM inventory WHERE id = ? AND user_id = ?",
  )
    .bind(inputId, session.user.id)
    .first();

  if (!inputRow) return json({ error: "Input item not found." }, 404);
  if (inputRow.sold_at !== null)
    return json({ error: "Input item already sold." }, 409);

  const targetSkin = ALL_CURATED_SKINS.find(
    (s) => String(s.name).trim().toLowerCase() === targetName.toLowerCase(),
  );

  if (!targetSkin) {
    return json({ error: "Target skin not found in catalog." }, 404);
  }

  const inputTier = RARITY_TIER[String(inputRow.item_rarity)];
  const targetTier = RARITY_TIER[String(targetSkin.rarity)];

  if (inputTier === undefined)
    return json({ error: "Unknown input rarity." }, 400);
  if (targetTier === undefined)
    return json({ error: "Unknown target rarity." }, 400);
  if (targetTier <= inputTier) {
    return json(
      { error: "Target must be a higher rarity than the input." },
      400,
    );
  }

  const inputValue = Number(inputRow.item_value);
  const targetValue = Number(targetSkin.value);
  const tierSkip = targetTier - inputTier;

  const effectiveTargetValue = targetValue * Math.pow(1.8, tierSkip - 1);
  const rawChance = (inputValue / effectiveTargetValue) * 100;
  const winChance = Math.min(90, Math.max(3, rawChance));

  const roll = Math.random() * 100;
  const success = roll < winChance;
  const now = Date.now();

  const statements = [
    env.DB.prepare("UPDATE inventory SET sold_at = ? WHERE id = ?").bind(
      now,
      inputId,
    ),
  ];

  if (success) {
    statements.push(
      env.DB.prepare(
        "INSERT INTO inventory (user_id, item_name, item_rarity, item_wear, item_icon, item_value, dropped_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).bind(
        session.user.id,
        String(targetSkin.name),
        String(targetSkin.rarity),
        "Field-Tested",
        String(targetSkin.icon ?? ""),
        Number(targetValue),
        now,
      ),
    );
  }

  await env.DB.batch(statements);

  return json({
    ok: true,
    success,
    winChance: Number(winChance.toFixed(1)),
    roll: Number(roll.toFixed(1)),
    tierSkip,
    reward: success
      ? {
          name: String(targetSkin.name),
          rarity: String(targetSkin.rarity),
          wear: "Field-Tested",
          icon: String(targetSkin.icon ?? ""),
          value: Number(targetValue),
        }
      : null,
    profile: await getProfile(env, session.user.id),
  });
}
