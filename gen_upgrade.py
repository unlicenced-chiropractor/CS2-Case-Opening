import os

content = """\
<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-white">Skin Upgrader</h2>
        <p class="mt-0.5 text-xs text-zinc-500">
          Pick a skin from your inventory to sacrifice, then choose any skin from the catalog as your target. Win chance is based on value ratio.
        </p>
      </div>
      <div v-if="inputItem && targetItem" class="flex items-center gap-2">
        <span v-for="n in 4" :key="n" class="h-2 w-5 rounded-full transition-all duration-300" :class="n <= tierSkip ? tierSkipColor : 'bg-white/8'"></span>
        <span class="text-xs font-semibold" :class="tierSkipColor">{{ tierSkipLabel }}</span>
      </div>
    </div>

    <!-- THREE-COLUMN LAYOUT -->
    <div class="grid gap-3 lg:grid-cols-11">

      <!-- LEFT: SACRIFICE -->
      <div class="lg:col-span-3 flex flex-col gap-3">
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-4 flex flex-col gap-3" style="min-height:520px">
          <p class="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 shrink-0">Sacrifice &mdash; your inventory</p>

          <!-- Selected preview -->
          <div
            class="shrink-0 rounded-xl border p-3 flex items-center gap-3 min-h-[72px] transition-all"
            :class="inputItem ? [rarityBorder(inputItem.rarity), rarityActiveBg(inputItem.rarity)] : 'border-white/6 bg-white/3'"
          >
            <template v-if="inputItem">
              <img :src="renderIcon(inputItem.icon)" :alt="inputItem.name" class="h-10 w-12 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[11px] font-semibold text-white leading-tight">{{ inputItem.name }}</p>
                <p class="text-[10px]" :class="rarityLabel(inputItem.rarity)">{{ inputItem.rarity }}</p>
                <p class="text-[10px] text-zinc-500">{{ inputItem.wear }} &middot; ${{ Number(inputItem.value).toFixed(2) }}</p>
              </div>
              <button class="shrink-0 text-zinc-600 hover:text-rose-400 transition-colors" @click="inputItem = null; result = null">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </template>
            <template v-else>
              <div class="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10">
                <svg class="h-5 w-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <p class="text-xs text-zinc-600">Choose a skin to sacrifice</p>
            </template>
          </div>

          <!-- Inventory list -->
          <div v-if="!state.user" class="flex flex-col items-center justify-center py-8 text-center">
            <p class="text-sm text-zinc-600">Sign in to use the upgrader</p>
          </div>
          <div v-else-if="!sacrificeable.length" class="flex flex-col items-center justify-center py-8 text-center">
            <p class="text-sm text-zinc-600">No items in inventory</p>
            <p class="text-xs text-zinc-700 mt-1">Open cases to get skins</p>
          </div>
          <ul v-else class="overflow-y-auto space-y-1 pr-0.5 flex-1">
            <li
              v-for="item in sacrificeable"
              :key="item.id"
              class="flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all"
              :class="inputItem && inputItem.id === item.id
                ? [rarityBorder(item.rarity), rarityActiveBg(item.rarity)]
                : 'border-white/6 bg-white/3 hover:bg-white/6 hover:border-white/10'"
              @click="selectInput(item)"
            >
              <img :src="renderIcon(item.icon)" :alt="item.name" class="h-8 w-10 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[10px] font-semibold text-zinc-100 leading-tight">{{ item.name }}</p>
                <p class="text-[9px]" :class="rarityLabel(item.rarity)">{{ item.rarity }}</p>
              </div>
              <span class="shrink-0 text-[10px] font-bold text-white">${{ Number(item.value).toFixed(2) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CENTER: DIAL + BUTTON -->
      <div class="lg:col-span-5 flex flex-col gap-3">
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 flex flex-col items-center gap-5 flex-1">

          <!-- Big chance number -->
          <div class="flex flex-col items-center gap-1">
            <p
              class="text-5xl font-black tabular-nums transition-all duration-300"
              :class="inputItem && targetItem ? chanceColor : 'text-zinc-700'"
            >
              {{ inputItem && targetItem ? winChance.toFixed(1) : '--' }}%
            </p>
            <p class="text-xs text-zinc-600">win chance</p>
            <p v-if="inputItem && targetItem && tierSkip > 1" class="text-[10px] text-rose-400">
              &times;{{ penaltyMultiplier.toFixed(2) }} penalty for skipping {{ tierSkip }} tiers
            </p>
          </div>

          <!-- Dial -->
          <div class="relative flex h-44 w-44 items-center justify-center">
            <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="14"/>
              <circle
                v-if="inputItem && targetItem"
                cx="100" cy="100" r="84"
                fill="none" stroke="rgba(239,68,68,0.20)" stroke-width="14"
                :stroke-dasharray="totalArc + ' 0'"
              />
              <circle
                v-if="inputItem && targetItem"
                cx="100" cy="100" r="84"
                fill="none" stroke="rgba(34,197,94,0.45)" stroke-width="14"
                stroke-linecap="butt"
                :stroke-dasharray="winArc + ' ' + totalArc"
                stroke-dashoffset="0"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center" style="pointer-events:none">
              <div ref="needleEl" class="absolute rounded-full"
                style="width:3px;height:70px;top:30px;left:calc(50% - 1.5px);transform-origin:bottom center;background:linear-gradient(to bottom,#f59e0b 60%,transparent)">
              </div>
            </div>
            <div class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0d0d0d]">
              <template v-if="spinning"><span class="text-[10px] text-amber-400 animate-pulse font-bold">...</span></template>
              <template v-else-if="result">
                <svg v-if="result.success" class="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
                <svg v-else class="h-6 w-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </template>
              <template v-else><span class="text-[10px] text-zinc-700 text-center leading-tight">{{ inputItem && targetItem ? 'GO' : 'PICK' }}</span></template>
            </div>
            <div
              v-if="result"
              class="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest"
              :class="result.success ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400' : 'border-rose-500/40 bg-rose-950/60 text-rose-400'"
            >
              {{ result.success ? 'Success!' : 'Failed' }}
            </div>
          </div>

          <!-- Result banner -->
          <Transition enter-active-class="transition-all duration-500" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0">
            <div
              v-if="result"
              class="w-full rounded-xl border px-4 py-3 text-sm"
              :class="result.success ? 'border-emerald-500/25 bg-emerald-950/30 text-emerald-400' : 'border-rose-500/25 bg-rose-950/30 text-rose-400'"
            >
              <p class="font-bold">{{ result.success ? 'Upgrade successful!' : 'Upgrade failed.' }}</p>
              <p class="mt-0.5 text-xs opacity-75">
                Rolled {{ result.roll.toFixed(1) }} &mdash; needed below {{ result.winChance.toFixed(1) }}.
                <template v-if="result.success">You received <span class="font-semibold text-white">{{ result.reward.name }}</span> (${{ Number(result.reward.value).toFixed(2) }}).</template>
                <template v-else>Your skin was consumed.</template>
              </p>
            </div>
          </Transition>

          <p v-if="state.error" class="w-full text-xs text-rose-400">{{ state.error }}</p>

          <!-- Upgrade button -->
          <button
            class="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40"
            :class="canUpgrade ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:bg-amber-300' : 'bg-white/5 text-zinc-600'"
            :disabled="!canUpgrade || spinning"
            @click="doUpgrade"
          >
            <span v-if="spinning" class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Upgrading...
            </span>
            <span v-else-if="!state.user">Sign in to upgrade</span>
            <span v-else-if="!inputItem">Select a skin to sacrifice</span>
            <span v-else-if="!targetItem">Select a target skin</span>
            <span v-else>Upgrade &mdash; {{ winChance.toFixed(1) }}% chance</span>
          </button>
        </div>

        <!-- How it works -->
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] px-4 py-3">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">How it works</p>
          <div class="grid grid-cols-4 gap-1.5">
            <div v-for="tier in tierGuide" :key="tier.label" class="rounded-lg border border-white/6 bg-white/3 p-2 text-center">
              <p class="text-[9px] font-bold uppercase tracking-wide" :class="tier.color">{{ tier.label }}</p>
              <p class="text-[9px] text-zinc-600 mt-0.5">{{ tier.penalty }}</p>
            </div>
          </div>
          <p class="mt-2 text-[10px] text-zinc-700 leading-relaxed">
            Chance = (your value &divide; target value) &times; 100%, &times;1.8 penalty per extra tier skipped. Clamped 3&ndash;90%.
            The target skin does not need to be in your inventory &mdash; pick anything from the catalog.
          </p>
        </div>
      </div>

      <!-- RIGHT: TARGET (catalog) -->
      <div class="lg:col-span-3 flex flex-col gap-3">
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-4 flex flex-col gap-3" style="min-height:520px">
          <p class="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 shrink-0">Target &mdash; catalog</p>

          <!-- Selected preview -->
          <div
            class="shrink-0 rounded-xl border p-3 flex items-center gap-3 min-h-[72px] transition-all"
            :class="targetItem ? [rarityBorder(targetItem.rarity), rarityActiveBg(targetItem.rarity)] : 'border-white/6 bg-white/3'"
          >
            <template v-if="targetItem">
              <img :src="renderIcon(targetItem.icon)" :alt="targetItem.name" class="h-10 w-12 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[11px] font-semibold text-white leading-tight">{{ targetItem.name }}</p>
                <p class="text-[10px]" :class="rarityLabel(targetItem.rarity)">{{ targetItem.rarity }}</p>
                <p class="text-[10px] text-zinc-500">${{ Number(targetItem.value).toFixed(2) }}</p>
              </div>
              <button class="shrink-0 text-zinc-600 hover:text-rose-400 transition-colors" @click="targetItem = null; result = null">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </template>
            <template v-else>
              <div class="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/10">
                <svg class="h-5 w-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <p class="text-xs text-zinc-600">Choose a target skin</p>
            </template>
          </div>

          <!-- Search -->
          <div class="relative shrink-0">
            <svg class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="catalogSearch"
              type="text"
              placeholder="Search skins..."
              class="w-full rounded-xl border border-white/8 bg-black/40 py-2 pl-8 pr-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-400/40 transition-colors"
            />
          </div>

          <!-- Rarity filter pills -->
          <div class="flex flex-wrap gap-1 shrink-0">
            <button
              class="rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all"
              :class="catalogRarityFilter === null ? 'border-white/20 bg-white/10 text-white' : 'border-white/8 text-zinc-500 hover:text-zinc-300'"
              @click="catalogRarityFilter = null"
            >All</button>
            <button
              v-for="r in CATALOG_RARITIES"
              :key="r"
              class="rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all"
              :class="catalogRarityFilter === r
                ? [rarityBorder(r), rarityActiveBg(r), rarityLabel(r)]
                : 'border-white/8 text-zinc-500 hover:text-zinc-300'"
              @click="catalogRarityFilter = catalogRarityFilter === r ? null : r"
            >{{ r }}</button>
          </div>

          <!-- Loading spinner -->
          <div v-if="catalogLoading" class="flex flex-col items-center justify-center py-8">
            <svg class="h-6 w-6 animate-spin text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <p class="text-xs text-zinc-600 mt-2">Loading catalog...</p>
          </div>

          <!-- Catalog list -->
          <ul v-else class="overflow-y-auto space-y-1 pr-0.5 flex-1">
            <li
              v-for="skin in filteredCatalog"
              :key="skin.name"
              class="flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all"
              :class="targetItem && targetItem.name === skin.name
                ? [rarityBorder(skin.rarity), rarityActiveBg(skin.rarity)]
                : 'border-white/6 bg-white/3 hover:bg-white/6 hover:border-white/10'"
              @click="selectTarget(skin)"
            >
              <img :src="renderIcon(skin.icon)" :alt="skin.name" class="h-8 w-10 shrink-0 object-contain" @error="onImgErr" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[10px] font-semibold text-zinc-100 leading-tight">{{ skin.name }}</p>
                <p class="text-[9px]" :class="rarityLabel(skin.rarity)">{{ skin.rarity }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-[10px] font-bold text-white">${{ Number(skin.value).toFixed(2) }}</p>
                <p v-if="inputItem" class="text-[9px] mt-0.5" :class="chanceColorFor(skin)">{{ chanceFor(skin).toFixed(1) }}%</p>
              </div>
            </li>
            <li v-if="!filteredCatalog.length" class="py-8 text-center">
              <p class="text-sm text-zinc-600">No skins found</p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RARITY_STYLES, SKINS } from '../data/skins';
import { apiFetch } from '../lib/api';
import { useUserState } from '../lib/userState';

const { state, upgradeItem } = useUserState();

// ── Constants (mirror worker) ─────────────────────────────────
const RARITY_TIER = { 'Mil-Spec': 0, Restricted: 1, Classified: 2, Covert: 3, 'Rare Special': 4 };
const TIER_PENALTY = 1.8;
const CATALOG_RARITIES = ['Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Rare Special'];

// ── State ────────────────────────────────────────────────────
const inputItem  = ref(null);
const targetItem = ref(null);
const spinning   = ref(false);
const result     = ref(null);
const needleEl   = ref(null);

const catalogSkins        = ref([]);
const catalogLoading      = ref(false);
const catalogSearch       = ref('');
const catalogRarityFilter = ref(null);

// ── Load catalog on mount ─────────────────────────────────────
onMounted(async () => {
  catalogLoading.value = true;
  try {
    const data = await apiFetch('/api/catalog', { method: 'GET' });
    catalogSkins.value = Array.isArray(data.skins) && data.skins.length ? data.skins : SKINS;
  } catch (_) {
    catalogSkins.value = SKINS;
  } finally {
    catalogLoading.value = false;
  }
});

// ── Inventory ─────────────────────────────────────────────────
const inventory   = computed(() => [...(state.profile?.inventory ?? [])].reverse());
const sacrificeable = computed(() => inventory.value.filter(i => RARITY_TIER[i.rarity] !== undefined));

// ── Catalog filtering ─────────────────────────────────────────
const validCatalog = computed(() => {
  const inputTier = inputItem.value !== null ? (RARITY_TIER[inputItem.value.rarity] ?? -1) : -1;
  return catalogSkins.value.filter(s => (RARITY_TIER[s.rarity] ?? -1) > inputTier);
});

const filteredCatalog = computed(() => {
  let list = validCatalog.value;
  if (catalogRarityFilter.value) list = list.filter(s => s.rarity === catalogRarityFilter.value);
  const q = catalogSearch.value.trim().toLowerCase();
  if (q) list = list.filter(s => s.name.toLowerCase().includes(q));
  // Deduplicate by name
  const seen = new Set();
  return list.filter(s => { if (seen.has(s.name)) return false; seen.add(s.name); return true; });
});

// ── Chance math ───────────────────────────────────────────────
const tierSkip = computed(() => {
  if (!inputItem.value || !targetItem.value) return 0;
  return Math.max(0, (RARITY_TIER[targetItem.value.rarity] ?? 0) - (RARITY_TIER[inputItem.value.rarity] ?? 0));
});

const penaltyMultiplier = computed(() => Math.pow(TIER_PENALTY, Math.max(0, tierSkip.value - 1)));

function computeChance(inputVal, targetVal, skip) {
  const penalty   = Math.pow(TIER_PENALTY, Math.max(0, skip - 1));
  const effective = Number(targetVal) * penalty;
  if (effective <= 0) return 90;
  return Math.min(90, Math.max(3, (Number(inputVal) / effective) * 100));
}

const winChance = computed(() => {
  if (!inputItem.value || !targetItem.value) return 0;
  return computeChance(inputItem.value.value, targetItem.value.value, tierSkip.value);
});

function chanceFor(skin) {
  if (!inputItem.value) return 0;
  const skip = Math.max(0, (RARITY_TIER[skin.rarity] ?? 0) - (RARITY_TIER[inputItem.value.rarity] ?? 0));
  return computeChance(inputItem.value.value, skin.value, skip);
}

const canUpgrade = computed(() => !!(state.user && inputItem.value && targetItem.value && !spinning.value));

// ── Color helpers ─────────────────────────────────────────────
const chanceColor = computed(() => {
  const c = winChance.value;
  return c >= 60 ? 'text-emerald-400' : c >= 30 ? 'text-amber-400' : 'text-rose-400';
});
function chanceColorFor(skin) {
  const c = chanceFor(skin);
  return c >= 60 ? 'text-emerald-400' : c >= 30 ? 'text-amber-400' : 'text-rose-400';
}

const tierSkipLabel = computed(() => {
  const s = tierSkip.value;
  if (s === 1) return '+1 tier - normal';
  if (s === 2) return '+2 tiers - risky';
  if (s === 3) return '+3 tiers - very risky';
  return s >= 4 ? '+4 tiers - extreme' : '';
});
const tierSkipColor = computed(() => {
  const s = tierSkip.value;
  return s <= 1 ? 'text-emerald-400' : s === 2 ? 'text-amber-400' : s === 3 ? 'text-orange-400' : 'text-rose-400';
});

// ── Dial geometry ─────────────────────────────────────────────
const R        = 84;
const totalArc = computed(() => +(2 * Math.PI * R).toFixed(3));
const winArc   = computed(() => +((winChance.value / 100) * totalArc.value).toFixed(3));

// ── Watchers ──────────────────────────────────────────────────
watch(inputItem, (newInput) => {
  result.value = null;
  catalogRarityFilter.value = null;
  if (!newInput) { targetItem.value = null; return; }
  if (targetItem.value) {
    const it = RARITY_TIER[newInput.rarity] ?? -1;
    const tt = RARITY_TIER[targetItem.value.rarity] ?? -1;
    if (tt <= it) targetItem.value = null;
  }
});

// ── Select helpers ────────────────────────────────────────────
function selectInput(item) {
  if (spinning.value) return;
  inputItem.value = item; result.value = null; state.error = '';
}
function selectTarget(skin) {
  if (spinning.value) return;
  targetItem.value = skin; result.value = null; state.error = '';
}

// ── Needle animation ──────────────────────────────────────────
function spinNeedle(finalAngleDeg, duration, onDone) {
  const el = needleEl.value;
  if (!el) { onDone(); return; }
  const totalTravel = 5 * 360 + finalAngleDeg;
  const startTime   = performance.now();
  el.style.transform = 'rotate(0deg)';
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    el.style.transform = 'rotate(' + (totalTravel * easeOut(t)).toFixed(2) + 'deg)';
    if (t < 1) requestAnimationFrame(frame);
    else { el.style.transform = 'rotate(' + finalAngleDeg.toFixed(2) + 'deg)'; onDone(); }
  }
  requestAnimationFrame(frame);
}

// ── Upgrade ───────────────────────────────────────────────────
async function doUpgrade() {
  if (!canUpgrade.value) return;
  spinning.value = true; result.value = null; state.error = '';
  const inputSnapshot  = inputItem.value;
  const targetSnapshot = targetItem.value;
  try {
    const res = await upgradeItem(inputSnapshot.id, targetSnapshot.name);
    const winZoneDeg = (res.winChance / 100) * 360;
    const finalAngle = res.success
      ? winZoneDeg * 0.05 + Math.random() * winZoneDeg * 0.90
      : winZoneDeg + Math.random() * (360 - winZoneDeg) * 0.90 + (360 - winZoneDeg) * 0.05;
    spinNeedle(finalAngle, 3400, () => {
      result.value = res; spinning.value = false;
      if (!inventory.value.find(i => i.id === inputSnapshot.id)) inputItem.value = null;
    });
  } catch (err) {
    state.error = err.message; spinning.value = false;
  }
}

// ── Rarity helpers ────────────────────────────────────────────
const FALLBACK_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";
function renderIcon(url) { if (!url) return FALLBACK_ICON; if (String(url).startsWith('http')) return url; return url; }
function onImgErr(e) { e.target.src = FALLBACK_ICON; }
function rarityBorder(r) { return RARITY_STYLES[r]?.border ?? 'border-white/8'; }
function rarityLabel(r)  { return RARITY_STYLES[r]?.label  ?? 'text-zinc-500'; }
function rarityActiveBg(r) {
  return {'Mil-Spec':'bg-sky-950/40',Restricted:'bg-violet-950/40',Classified:'bg-pink-950/40',Covert:'bg-red-950/40','Rare Special':'bg-amber-950/40'}[r] ?? 'bg-white/5';
}
const tierGuide = [
  { label: '+1 tier',  penalty: 'No penalty',  color: 'text-emerald-400' },
  { label: '+2 tiers', penalty: 'x1.8 harder', color: 'text-amber-400'  },
  { label: '+3 tiers', penalty: 'x3.2 harder', color: 'text-orange-400' },
  { label: '+4 tiers', penalty: 'x5.8 harder', color: 'text-rose-400'   },
];
</script>
"""

os.makedirs('src/views', exist_ok=True)
with open('src/views/UpgradeView.vue', 'w', encoding='utf-8') as f:
    f.write(content)
print('Written', len(content), 'bytes')
```

## Step 2: Run the Python script