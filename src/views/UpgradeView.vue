<template>
  <div class="space-y-5">

    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-white">Skin Upgrader</h2>
        <p class="mt-0.5 text-xs text-zinc-500">
          Pick a skin from your inventory to sacrifice, then choose a catalog skin to win.
          Odds are based on value — the bigger the jump, the harder the roll.
        </p>
      </div>
      <!-- tier-skip indicator -->
      <div v-if="inputItem && targetSkin" class="flex items-center gap-2">
        <span
          v-for="n in 4" :key="n"
          class="h-2 w-5 rounded-full transition-all duration-300"
          :class="n <= tierSkip ? tierSkipDotColor : 'bg-white/8'"
        ></span>
        <span class="text-xs font-semibold" :class="tierSkipDotColor">{{ tierSkipLabel }}</span>
      </div>
    </div>

    <!-- ── THREE-COLUMN LAYOUT ──────────────────────────────────── -->
    <div class="grid gap-3 lg:grid-cols-11">

      <!-- ══ LEFT: SACRIFICE (inventory) ═══════════════════════ -->
      <div class="lg:col-span-3 flex flex-col gap-3">
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-4 flex flex-col gap-3" style="min-height:520px;">

          <p class="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Sacrifice</p>

          <!-- selected preview -->
          <div
            class="shrink-0 rounded-xl border p-3 flex items-center gap-3 min-h-[72px] transition-all"
            :class="inputItem ? [rarityBorder(inputItem.rarity), rarityBg(inputItem.rarity)] : 'border-white/6 bg-white/3'"
          >
            <template v-if="inputItem">
              <img :src="inputItem.icon" :alt="inputItem.name" class="h-10 w-12 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[11px] font-semibold text-white leading-tight">{{ inputItem.name }}</p>
                <p class="text-[10px]" :class="rarityLabel(inputItem.rarity)">{{ inputItem.rarity }}</p>
                <p class="text-[10px] text-zinc-500">{{ inputItem.wear }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-xs font-bold text-white">${{ fmtVal(inputItem.value) }}</p>
                <button class="mt-1 text-[10px] text-zinc-600 hover:text-rose-400 transition-colors" @click="clearInput">✕</button>
              </div>
            </template>
            <template v-else>
              <div class="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10">
                <svg class="h-5 w-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <p class="text-xs text-zinc-600">Choose a skin to sacrifice</p>
            </template>
          </div>

          <!-- list -->
          <div v-if="!state.user" class="flex flex-1 items-center justify-center">
            <p class="text-sm text-zinc-600">Sign in to use the upgrader</p>
          </div>
          <div v-else-if="!sacrificeable.length" class="flex flex-1 flex-col items-center justify-center gap-1 text-center">
            <p class="text-sm text-zinc-600">No items in inventory</p>
            <p class="text-xs text-zinc-700">Open cases to get skins</p>
          </div>
          <ul v-else class="flex-1 overflow-y-auto space-y-1 pr-0.5" style="max-height:340px;">
            <li
              v-for="item in sacrificeable" :key="item.id"
              class="flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all"
              :class="inputItem?.id === item.id
                ? [rarityBorder(item.rarity), rarityBg(item.rarity)]
                : 'border-white/6 bg-white/3 hover:border-white/10 hover:bg-white/6'"
              @click="selectInput(item)"
            >
              <img :src="item.icon" :alt="item.name" class="h-8 w-10 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[10px] font-semibold text-zinc-100 leading-tight">{{ item.name }}</p>
                <p class="text-[9px]" :class="rarityLabel(item.rarity)">{{ item.rarity }}</p>
              </div>
              <span class="shrink-0 text-[10px] font-bold text-white">${{ fmtVal(item.value) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- ══ CENTER: DIAL + BUTTON ══════════════════════════════ -->
      <div class="lg:col-span-5 flex flex-col gap-3">

        <!-- Arena -->
        <div class="flex-1 rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 flex flex-col items-center gap-5">

          <!-- Big chance number -->
          <div class="flex flex-col items-center gap-1">
            <p
              class="text-5xl font-black tabular-nums transition-all duration-300"
              :class="inputItem && targetSkin ? chanceColor : 'text-zinc-700'"
            >{{ inputItem && targetSkin ? winChance.toFixed(1) : '—' }}%</p>
            <p class="text-xs text-zinc-600">win chance</p>
            <p v-if="inputItem && targetSkin && tierSkip > 1" class="text-[10px] text-rose-400">
              ×{{ penaltyMult.toFixed(2) }} penalty for {{ tierSkip }} tier jump
            </p>
          </div>

          <!-- Dial -->
          <div class="relative flex h-44 w-44 items-center justify-center">
            <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200">
              <!-- track -->
              <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="14"/>
              <!-- loss arc -->
              <circle
                v-if="inputItem && targetSkin"
                cx="100" cy="100" r="84" fill="none"
                stroke="rgba(239,68,68,0.20)" stroke-width="14"
                :stroke-dasharray="`${totalArc} ${totalArc}`"
                stroke-dashoffset="0"
              />
              <!-- win arc -->
              <circle
                v-if="inputItem && targetSkin"
                cx="100" cy="100" r="84" fill="none"
                stroke="rgba(34,197,94,0.40)" stroke-width="14"
                stroke-linecap="butt"
                :stroke-dasharray="`${winArc} ${totalArc}`"
                stroke-dashoffset="0"
              />
            </svg>

            <!-- needle -->
            <div class="absolute inset-0 flex items-center justify-center" style="pointer-events:none;">
              <div
                ref="needleEl"
                class="absolute rounded-full"
                style="width:3px;height:70px;top:30px;left:calc(50% - 1.5px);transform-origin:bottom center;background:linear-gradient(to bottom,#f59e0b 60%,transparent);"
              ></div>
            </div>

            <!-- hub -->
            <div class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0d0d0d]">
              <template v-if="spinning">
                <span class="text-[10px] font-bold text-amber-400 animate-pulse">...</span>
              </template>
              <template v-else-if="result">
                <svg v-if="result.success" class="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
                <svg v-else class="h-6 w-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </template>
              <template v-else>
                <span class="text-[10px] text-zinc-700 text-center leading-tight">{{ inputItem && targetSkin ? 'GO' : 'PICK' }}</span>
              </template>
            </div>

            <!-- result badge -->
            <div
              v-if="result"
              class="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest"
              :class="result.success
                ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                : 'border-rose-500/40 bg-rose-950/60 text-rose-400'"
            >{{ result.success ? 'Success!' : 'Failed' }}</div>
          </div>

          <!-- Result banner -->
          <Transition
            enter-active-class="transition-all duration-500"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div
              v-if="result"
              class="w-full rounded-xl border px-4 py-3 text-sm"
              :class="result.success
                ? 'border-emerald-500/25 bg-emerald-950/30 text-emerald-400'
                : 'border-rose-500/25 bg-rose-950/30 text-rose-400'"
            >
              <p class="font-bold">{{ result.success ? 'Upgrade successful!' : 'Upgrade failed.' }}</p>
              <p class="mt-0.5 text-xs opacity-75">
                Rolled {{ result.roll.toFixed(1) }} — needed below {{ result.winChance.toFixed(1) }}.
                <template v-if="result.success">
                  You received <span class="font-semibold text-white">{{ result.reward.name }}</span> (${{ fmtVal(result.reward.value) }}).
                </template>
                <template v-else>Your skin was consumed. Better luck next time.</template>
              </p>
            </div>
          </Transition>

          <p v-if="state.error" class="w-full text-xs text-rose-400">{{ state.error }}</p>

          <!-- Upgrade button -->
          <button
            class="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40"
            :class="canUpgrade ? 'accent-bg text-black accent-shadow shadow-lg transition-all duration-200 hover:brightness-110 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.45)] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]' : 'bg-white/5 text-zinc-600'"
            :disabled="!canUpgrade || spinning"
            @click="doUpgrade"
          >
            <span v-if="spinning" class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Upgrading...
            </span>
            <span v-else-if="!state.user">Sign in to upgrade</span>
            <span v-else-if="!inputItem">Select a skin to sacrifice</span>
            <span v-else-if="!targetSkin">Select a target skin</span>
            <span v-else>Upgrade — {{ winChance.toFixed(1) }}% chance</span>
          </button>
        </div>

        <!-- How it works -->
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] px-4 py-3">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">How it works</p>
          <div class="grid grid-cols-4 gap-1.5">
            <div v-for="t in tierGuide" :key="t.label" class="rounded-lg border border-white/6 bg-white/3 p-2 text-center">
              <p class="text-[9px] font-bold uppercase tracking-wide" :class="t.color">{{ t.label }}</p>
              <p class="text-[9px] text-zinc-600 mt-0.5">{{ t.penalty }}</p>
            </div>
          </div>
          <p class="mt-2 text-[10px] text-zinc-700 leading-relaxed">
            Chance = (your skin value ÷ target value) × 100%, adjusted by tier-skip penalty, clamped 3–90%.
            On failure your skin is consumed. On success it's replaced with the target.
          </p>
        </div>
      </div>

      <!-- ══ RIGHT: TARGET (catalog browser) ═══════════════════ -->
      <div class="lg:col-span-3 flex flex-col gap-3">
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-4 flex flex-col gap-3" style="min-height:520px;">

          <p class="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Target Skin</p>

          <!-- selected preview -->
          <div
            class="shrink-0 rounded-xl border p-3 flex items-center gap-3 min-h-[72px] transition-all"
            :class="targetSkin ? [rarityBorder(targetSkin.rarity), rarityBg(targetSkin.rarity)] : 'border-white/6 bg-white/3'"
          >
            <template v-if="targetSkin">
              <img :src="targetSkin.icon" :alt="targetSkin.name" class="h-10 w-12 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[11px] font-semibold text-white leading-tight">{{ targetSkin.name }}</p>
                <p class="text-[10px]" :class="rarityLabel(targetSkin.rarity)">{{ targetSkin.rarity }}</p>
                <p class="text-[10px] text-zinc-500">{{ targetSkin.wear }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-xs font-bold text-white">${{ fmtVal(targetSkin.value) }}</p>
                <button class="mt-1 text-[10px] text-zinc-600 hover:text-rose-400 transition-colors" @click="targetSkin = null; result = null">✕</button>
              </div>
            </template>
            <template v-else>
              <div class="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10">
                <svg class="h-5 w-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <p class="text-xs text-zinc-600">{{ inputItem ? 'Choose a target' : 'Pick a sacrifice first' }}</p>
            </template>
          </div>

          <!-- rarity filter -->
          <div v-if="catalogTargets.length" class="shrink-0 flex flex-wrap gap-1">
            <button
              class="rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all"
              :class="rarityFilter === null ? 'border-white/20 bg-white/10 text-white' : 'border-white/8 text-zinc-500 hover:text-zinc-300'"
              @click="rarityFilter = null"
            >All</button>
            <button
              v-for="r in availableRarities" :key="r"
              class="rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all"
              :class="rarityFilter === r
                ? [rarityBorder(r), rarityBg(r), rarityLabel(r)]
                : 'border-white/8 text-zinc-500 hover:text-zinc-300'"
              @click="rarityFilter = rarityFilter === r ? null : r"
            >{{ r }}</button>
          </div>

          <!-- search -->
          <div v-if="catalogTargets.length" class="shrink-0 relative">
            <svg class="pointer-events-none absolute inset-y-0 left-2.5 flex items-center h-full w-3.5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search skins…"
              class="w-full rounded-lg border border-white/8 bg-black/30 py-1.5 pl-8 pr-3 text-[11px] text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-400/40"
            />
          </div>

          <!-- loading -->
          <div v-if="catalogLoading" class="flex flex-1 items-center justify-center">
            <svg class="h-5 w-5 animate-spin text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>

          <!-- no input selected -->
          <div v-else-if="!inputItem" class="flex flex-1 flex-col items-center justify-center gap-1 text-center">
            <p class="text-sm text-zinc-600">Select a sacrifice first</p>
          </div>

          <!-- no catalog targets -->
          <div v-else-if="!catalogTargets.length" class="flex flex-1 flex-col items-center justify-center gap-1 text-center">
            <p class="text-sm text-zinc-600">No catalog skins available</p>
          </div>

          <!-- no filtered results -->
          <div v-else-if="!filteredTargets.length" class="flex flex-1 flex-col items-center justify-center gap-1 text-center">
            <p class="text-sm text-zinc-600">No matches</p>
          </div>

          <!-- target list -->
          <ul v-else class="flex-1 overflow-y-auto space-y-1 pr-0.5" style="max-height:340px;">
            <li
              v-for="skin in filteredTargets" :key="skin.name + skin.wear"
              class="flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all"
              :class="targetSkin?.name === skin.name && targetSkin?.wear === skin.wear
                ? [rarityBorder(skin.rarity), rarityBg(skin.rarity)]
                : 'border-white/6 bg-white/3 hover:border-white/10 hover:bg-white/6'"
              @click="selectTarget(skin)"
            >
              <img :src="skin.icon" :alt="skin.name" class="h-8 w-10 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[10px] font-semibold text-zinc-100 leading-tight">{{ skin.name }}</p>
                <p class="text-[9px]" :class="rarityLabel(skin.rarity)">{{ skin.rarity }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-[10px] font-bold text-white">${{ fmtVal(skin.value) }}</p>
                <p class="text-[9px] mt-0.5" :class="chanceColorFor(skin)">{{ chanceFor(skin).toFixed(1) }}%</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { RARITY_STYLES } from "../data/skins";
import { apiFetch } from "../lib/api";
import { useUserState } from "../lib/userState";

const { state, upgradeItem } = useUserState();

// ── Rarity order (mirrors worker) ────────────────────────────
const RARITY_TIER = {
  "Mil-Spec":     0,
  Restricted:     1,
  Classified:     2,
  Covert:         3,
  "Rare Special": 4,
};
const TIER_PENALTY = 1.8; // per extra tier beyond 1

// ── State ────────────────────────────────────────────────────
const inputItem     = ref(null);   // inventory item being sacrificed
const targetSkin    = ref(null);   // catalog skin to win
const spinning      = ref(false);
const result        = ref(null);
const needleEl      = ref(null);
const catalogSkins  = ref([]);     // full catalog from /api/catalog
const catalogLoading = ref(false);
const rarityFilter  = ref(null);
const searchQuery   = ref("");

// ── Inventory ────────────────────────────────────────────────
const inventory = computed(() => [...(state.profile?.inventory ?? [])].reverse());

// Any inventory item can be sacrificed (we allow same or lower rarity — worker enforces higher)
const sacrificeable = computed(() =>
  inventory.value.filter((i) => RARITY_TIER[i.rarity] !== undefined && RARITY_TIER[i.rarity] < 4)
);

// ── Catalog targets ──────────────────────────────────────────
// From catalog: strictly higher rarity than input, de-duped by name+wear, sorted by value asc
const catalogTargets = computed(() => {
  if (!inputItem.value || !catalogSkins.value.length) return [];
  const inputTier = RARITY_TIER[inputItem.value.rarity] ?? -1;
  const seen = new Set();
  const out = [];
  for (const s of catalogSkins.value) {
    const tier = RARITY_TIER[s.rarity];
    if (tier === undefined || tier <= inputTier) continue;
    const key = `${s.name}||${s.wear}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  // sort by value ascending so cheap upgrades are at top
  out.sort((a, b) => Number(a.value) - Number(b.value));
  return out;
});

const availableRarities = computed(() => {
  const seen = new Set();
  const out = [];
  for (const s of catalogTargets.value) {
    if (!seen.has(s.rarity)) { seen.add(s.rarity); out.push(s.rarity); }
  }
  return out.sort((a, b) => RARITY_TIER[a] - RARITY_TIER[b]);
});

const filteredTargets = computed(() => {
  let list = catalogTargets.value;
  if (rarityFilter.value) list = list.filter((s) => s.rarity === rarityFilter.value);
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q));
  }
  return list;
});

// ── Chance math (mirrors worker) ─────────────────────────────
const tierSkip = computed(() => {
  if (!inputItem.value || !targetSkin.value) return 0;
  return (RARITY_TIER[targetSkin.value.rarity] ?? 0) - (RARITY_TIER[inputItem.value.rarity] ?? 0);
});

const penaltyMult = computed(() => Math.pow(TIER_PENALTY, Math.max(0, tierSkip.value - 1)));

const winChance = computed(() => calcChance(inputItem.value, targetSkin.value));

function calcChance(input, target) {
  if (!input || !target) return 0;
  const inputVal  = Number(input.value);
  const targetVal = Number(target.value);
  if (targetVal <= 0) return 90;
  const skip = (RARITY_TIER[target.rarity] ?? 0) - (RARITY_TIER[input.rarity] ?? 0);
  const penalty = Math.pow(TIER_PENALTY, Math.max(0, skip - 1));
  return Math.min(90, Math.max(3, (inputVal / (targetVal * penalty)) * 100));
}

function chanceFor(skin) { return calcChance(inputItem.value, skin); }

const canUpgrade = computed(() => !!(state.user && inputItem.value && targetSkin.value && !spinning.value));

// ── Colors ────────────────────────────────────────────────────
const chanceColor = computed(() => colorForChance(winChance.value));
function colorForChance(c) {
  if (c >= 60) return "text-emerald-400";
  if (c >= 30) return "text-amber-400";
  return "text-rose-400";
}
function chanceColorFor(skin) { return colorForChance(chanceFor(skin)); }

const tierSkipDotColor = computed(() => {
  const s = tierSkip.value;
  if (s === 1) return "text-emerald-400";
  if (s === 2) return "text-amber-400";
  if (s === 3) return "text-orange-400";
  return "text-rose-400";
});

const tierSkipLabel = computed(() => {
  const s = tierSkip.value;
  if (s === 1) return "+1 tier — normal";
  if (s === 2) return "+2 tiers — risky";
  if (s === 3) return "+3 tiers — very risky";
  if (s >= 4)  return "+4 tiers — extreme";
  return "";
});

// ── Dial geometry ─────────────────────────────────────────────
const R = 84;
const totalArc = computed(() => 2 * Math.PI * R);
const winArc   = computed(() => (winChance.value / 100) * totalArc.value);

// ── Watchers ──────────────────────────────────────────────────
// Reset target filter when input changes
watch(inputItem, () => {
  rarityFilter.value = null;
  searchQuery.value  = "";
  result.value       = null;
  // keep targetSkin if it's still a valid catalog target for the new input
  if (targetSkin.value && inputItem.value) {
    const newInputTier = RARITY_TIER[inputItem.value.rarity] ?? -1;
    const targetTier   = RARITY_TIER[targetSkin.value.rarity] ?? -1;
    if (targetTier <= newInputTier) targetSkin.value = null;
  } else if (!inputItem.value) {
    targetSkin.value = null;
  }
});

// ── Actions ───────────────────────────────────────────────────
function selectInput(item) {
  if (spinning.value) return;
  inputItem.value = item;
  result.value    = null;
  state.error     = "";
}

function clearInput() {
  inputItem.value  = null;
  targetSkin.value = null;
  result.value     = null;
}

function selectTarget(skin) {
  if (spinning.value) return;
  targetSkin.value = skin;
  result.value     = null;
  state.error      = "";
}

// ── Needle animation ──────────────────────────────────────────
function spinNeedle(finalAngleDeg, duration, onDone) {
  const el = needleEl.value;
  if (!el) { onDone(); return; }
  const totalTravel = 5 * 360 + finalAngleDeg;
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  const t0 = performance.now();
  function frame(now) {
    const t = Math.min((now - t0) / duration, 1);
    el.style.transform = `rotate(${totalTravel * easeOut(t)}deg)`;
    if (t < 1) requestAnimationFrame(frame);
    else { el.style.transform = `rotate(${finalAngleDeg}deg)`; onDone(); }
  }
  el.style.transform = "rotate(0deg)";
  requestAnimationFrame(frame);
}

// ── Upgrade ───────────────────────────────────────────────────
async function doUpgrade() {
  if (!canUpgrade.value) return;
  spinning.value = true;
  result.value   = null;
  state.error    = "";

  const snapInput  = inputItem.value;
  const snapTarget = targetSkin.value;

  try {
    const res = await upgradeItem(snapInput.id, snapTarget.name);

    const winZoneDeg = (res.winChance / 100) * 360;
    const finalAngle = res.success
      ? winZoneDeg * 0.05 + Math.random() * winZoneDeg * 0.90
      : winZoneDeg + (360 - winZoneDeg) * 0.05 + Math.random() * (360 - winZoneDeg) * 0.90;

    spinNeedle(finalAngle, 3400, () => {
      result.value   = res;
      spinning.value = false;
      // clear the consumed input from selection
      const stillHas = inventory.value.find((i) => i.id === snapInput.id);
      if (!stillHas) inputItem.value = null;
      // keep targetSkin visible so user sees what they were going for
    });
  } catch (err) {
    state.error    = err.message;
    spinning.value = false;
  }
}

// ── Catalog load ──────────────────────────────────────────────
onMounted(async () => {
  catalogLoading.value = true;
  try {
    const data = await apiFetch("/api/catalog", { method: "GET" });
    if (Array.isArray(data.skins)) catalogSkins.value = data.skins;
  } catch (_) {
    // silently fall back to empty — UI shows "no catalog skins available"
  } finally {
    catalogLoading.value = false;
  }
});

// ── Helpers ───────────────────────────────────────────────────
const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function onImgErr(e) { e.target.src = FALLBACK_ICON; }
function fmtVal(v) { return Number(v).toFixed(2); }

function rarityBorder(r) { return RARITY_STYLES[r]?.border ?? "border-white/8"; }
function rarityLabel(r)  { return RARITY_STYLES[r]?.label  ?? "text-zinc-500"; }
function rarityBg(r) {
  const map = {
    "Mil-Spec":     "bg-sky-950/40",
    Restricted:     "bg-violet-950/40",
    Classified:     "bg-pink-950/40",
    Covert:         "bg-red-950/40",
    "Rare Special": "bg-amber-950/40",
  };
  return map[r] ?? "bg-white/5";
}

const tierGuide = [
  { label: "+1 tier",  penalty: "No penalty",   color: "text-emerald-400" },
  { label: "+2 tiers", penalty: "×1.8 harder",  color: "text-amber-400"   },
  { label: "+3 tiers", penalty: "×3.2 harder",  color: "text-orange-400"  },
  { label: "+4 tiers", penalty: "×5.8 harder",  color: "text-rose-400"    },
];
</script>
