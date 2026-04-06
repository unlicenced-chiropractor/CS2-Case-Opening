<template>
  <div class="space-y-6">

    <!-- ── HEADER ───────────────────────────────────────────── -->
    <div>
      <h2 class="text-xl font-bold tracking-tight text-white">Skin Upgrader</h2>
      <p class="mt-0.5 text-xs text-zinc-500">
        Sacrifice a skin for a chance at a higher rarity. Higher value = better odds.
      </p>
    </div>

    <!-- ── MAIN AREA ─────────────────────────────────────────── -->
    <div class="grid gap-4 lg:grid-cols-5">

      <!-- Left: item picker -->
      <div class="lg:col-span-2 rounded-2xl border border-white/8 bg-[#0d0d0d] p-4 space-y-3">
        <p class="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Select item to upgrade
        </p>

        <!-- Guest / no items -->
        <div
          v-if="!state.user"
          class="flex flex-col items-center justify-center gap-2 py-12 text-center"
        >
          <p class="text-sm text-zinc-600">Sign in to use the upgrader</p>
        </div>

        <div
          v-else-if="!upgradableInventory.length"
          class="flex flex-col items-center justify-center gap-2 py-12 text-center"
        >
          <p class="text-sm text-zinc-600">No upgradable items</p>
          <p class="text-xs text-zinc-700">Rare Special items cannot be upgraded further</p>
        </div>

        <!-- Item list -->
        <ul v-else class="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
          <li
            v-for="item in upgradableInventory"
            :key="item.id"
            class="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all"
            :class="selectedItem?.id === item.id
              ? [rarityBorder(item.rarity), rarityActiveBg(item.rarity)]
              : 'border-white/6 bg-white/3 hover:bg-white/6 hover:border-white/10'"
            @click="selectItem(item)"
          >
            <img
              :src="renderIcon(item.icon)"
              :alt="item.name"
              class="h-10 w-12 shrink-0 object-contain"
              @error="onImgErr"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-[11px] font-semibold text-zinc-100 leading-tight">{{ item.name }}</p>
              <p class="text-[10px] leading-tight" :class="rarityLabel(item.rarity)">{{ item.rarity }}</p>
              <p class="mt-0.5 text-[10px] text-zinc-500">{{ item.wear }}</p>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-xs font-bold text-white">${{ Number(item.value).toFixed(2) }}</p>
              <p class="text-[10px] text-zinc-600 mt-0.5">
                {{ upgradeChanceFor(item).toFixed(1) }}% win
              </p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Center: dial + upgrade button -->
      <div class="lg:col-span-3 flex flex-col gap-4">

        <!-- Upgrade arena -->
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 flex flex-col items-center gap-6">

          <!-- Skins being compared -->
          <div class="flex w-full items-center gap-4">

            <!-- Input skin -->
            <div
              class="flex-1 rounded-xl border bg-[#111] p-3 flex flex-col items-center gap-2 transition-all"
              :class="selectedItem ? rarityBorder(selectedItem.rarity) : 'border-white/6'"
            >
              <div
                class="relative flex h-[2px] w-full rounded-full"
                :class="selectedItem ? rarityBarBg(selectedItem.rarity) : 'bg-white/5'"
              ></div>
              <img
                v-if="selectedItem"
                :src="renderIcon(selectedItem.icon)"
                :alt="selectedItem.name"
                class="h-20 w-full object-contain drop-shadow-lg"
                @error="onImgErr"
              />
              <div v-else class="h-20 w-full flex items-center justify-center">
                <svg class="h-8 w-8 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <div class="text-center w-full">
                <p class="truncate text-[11px] font-semibold text-zinc-200 leading-tight">
                  {{ selectedItem ? selectedItem.name : 'Select a skin' }}
                </p>
                <p class="text-[10px]" :class="selectedItem ? rarityLabel(selectedItem.rarity) : 'text-zinc-600'">
                  {{ selectedItem ? selectedItem.rarity : '—' }}
                </p>
                <p v-if="selectedItem" class="text-[10px] font-bold text-white mt-0.5">
                  ${{ Number(selectedItem.value).toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Arrow + chance -->
            <div class="flex flex-col items-center gap-2 shrink-0">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10"
              >
                <svg class="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div class="text-center">
                <p v-if="selectedItem" class="text-lg font-black" :class="chanceColor">
                  {{ winChance.toFixed(1) }}%
                </p>
                <p v-else class="text-lg font-black text-zinc-700">—%</p>
                <p class="text-[10px] text-zinc-600">win chance</p>
              </div>
            </div>

            <!-- Target skin (blurred until won) -->
            <div
              class="flex-1 rounded-xl border bg-[#111] p-3 flex flex-col items-center gap-2 transition-all"
              :class="targetRarity ? rarityBorder(targetRarity) : 'border-white/6'"
            >
              <div
                class="h-[2px] w-full rounded-full"
                :class="targetRarity ? rarityBarBg(targetRarity) : 'bg-white/5'"
              ></div>
              <div class="relative h-20 w-full flex items-center justify-center">
                <div
                  v-if="targetRarity && !result"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <!-- Question mark placeholder when nothing won yet -->
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed"
                    :class="rarityBorder(targetRarity)"
                  >
                    <span class="text-2xl font-black" :class="rarityLabel(targetRarity)">?</span>
                  </div>
                </div>
                <!-- Winning skin revealed -->
                <img
                  v-if="result?.success && result.reward"
                  :src="renderIcon(result.reward.icon)"
                  :alt="result.reward.name"
                  class="h-20 w-full object-contain drop-shadow-lg"
                  @error="onImgErr"
                />
              </div>
              <div class="text-center w-full">
                <p class="truncate text-[11px] font-semibold leading-tight"
                  :class="result?.success ? 'text-zinc-200' : targetRarity ? rarityLabel(targetRarity) : 'text-zinc-600'">
                  {{ result?.success ? result.reward.name : targetRarity ? targetRarity + ' Skin' : 'Unknown' }}
                </p>
                <p class="text-[10px]" :class="targetRarity ? rarityLabel(targetRarity) : 'text-zinc-600'">
                  {{ targetRarity ?? '—' }}
                </p>
                <p v-if="result?.success" class="text-[10px] font-bold text-white mt-0.5">
                  ${{ Number(result.reward.value).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>

          <!-- ── DIAL ──────────────────────────────────────── -->
          <div class="relative flex h-48 w-48 items-center justify-center">
            <!-- Background ring -->
            <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100" cy="100" r="88"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                stroke-width="12"
              />
              <!-- Win zone arc (green) -->
              <circle
                v-if="selectedItem"
                cx="100" cy="100" r="88"
                fill="none"
                stroke="rgba(34,197,94,0.35)"
                stroke-width="12"
                stroke-linecap="round"
                :stroke-dasharray="`${winArcLength} ${totalArcLength}`"
                stroke-dashoffset="0"
              />
              <!-- Needle -->
              <line
                x1="100" y1="100"
                :x2="needleX" :y2="needleY"
                stroke="#f59e0b"
                stroke-width="3"
                stroke-linecap="round"
                class="origin-center"
                :style="{ transition: spinning ? 'none' : 'x2 0.05s, y2 0.05s' }"
              />
            </svg>

            <!-- Animated needle via CSS transform on an overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center"
              style="pointer-events:none;"
            >
              <div
                ref="needleEl"
                class="absolute"
                style="width:2px; height:72px; top:28px; left:calc(50% - 1px); transform-origin:bottom center; border-radius:2px;"
                :style="{ background: 'linear-gradient(to bottom, #f59e0b, transparent)' }"
              ></div>
            </div>

            <!-- Center dot -->
            <div class="z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-white/10 bg-[#0d0d0d]">
              <span v-if="!spinning && !result" class="text-[10px] text-zinc-600 leading-tight text-center">
                {{ selectedItem ? 'Ready' : 'Pick' }}
              </span>
              <span v-else-if="spinning" class="text-[10px] text-amber-400 leading-tight text-center animate-pulse">
                ...
              </span>
              <template v-else-if="result">
                <svg v-if="result.success" class="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                <svg v-else class="h-5 w-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </template>
            </div>

            <!-- Win/loss label around dial -->
            <div
              v-if="result"
              class="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-widest"
              :class="result.success
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'"
            >
              {{ result.success ? 'Success!' : 'Failed' }}
            </div>
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
                ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400'
                : 'border-rose-500/30 bg-rose-950/30 text-rose-400'"
            >
              <template v-if="result.success">
                <p class="font-bold">Upgrade successful!</p>
                <p class="mt-0.5 text-xs opacity-80">
                  Rolled {{ result.roll.toFixed(1) }} — needed below {{ result.winChance.toFixed(1) }}.
                  You received <span class="font-semibold text-white">{{ result.reward.name }}</span>.
                </p>
              </template>
              <template v-else>
                <p class="font-bold">Upgrade failed.</p>
                <p class="mt-0.5 text-xs opacity-80">
                  Rolled {{ result.roll.toFixed(1) }} — needed below {{ result.winChance.toFixed(1) }}.
                  Better luck next time.
                </p>
              </template>
            </div>
          </Transition>

          <!-- Error -->
          <p v-if="state.error" class="w-full text-xs text-rose-400">{{ state.error }}</p>

          <!-- Upgrade button -->
          <button
            class="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40"
            :class="selectedItem && !spinning
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:bg-amber-300'
              : 'bg-white/5 text-zinc-600'"
            :disabled="!selectedItem || spinning || !state.user"
            @click="doUpgrade"
          >
            <span v-if="spinning" class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Upgrading...
            </span>
            <span v-else-if="!state.user">Sign in to upgrade</span>
            <span v-else-if="!selectedItem">Select a skin first</span>
            <span v-else>Upgrade to {{ targetRarity }}</span>
          </button>
        </div>

        <!-- Info card -->
        <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-4">
          <p class="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">How it works</p>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div
              v-for="tier in upgradeTiers"
              :key="tier.from"
              class="rounded-lg border border-white/6 bg-white/3 p-2.5 text-center"
            >
              <p class="text-[10px]" :class="tier.fromColor">{{ tier.from }}</p>
              <p class="my-0.5 text-xs text-zinc-600">→</p>
              <p class="text-[10px]" :class="tier.toColor">{{ tier.to }}</p>
            </div>
          </div>
          <p class="mt-3 text-[11px] text-zinc-700 leading-relaxed">
            Win chance = your skin's value ÷ target tier's base value × 100%, clamped between 5% and 90%.
            On failure the skin is consumed with no reward.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RARITY_STYLES } from "../data/skins";
import { useUserState } from "../lib/userState";

const { state, upgradeItem } = useUserState();

// ── Constants (must mirror worker) ───────────────────────────
const UPGRADE_LADDER = {
  "Mil-Spec":  "Restricted",
  Restricted:  "Classified",
  Classified:  "Covert",
  Covert:      "Rare Special",
};

const RARITY_BASE_VALUE = {
  "Mil-Spec":    2.5,
  Restricted:    7.0,
  Classified:    15.0,
  Covert:        40.0,
  "Rare Special": 500.0,
};

// ── State ────────────────────────────────────────────────────
const selectedItem = ref(null);
const spinning     = ref(false);
const result       = ref(null);
const needleEl     = ref(null);

// ── Derived ──────────────────────────────────────────────────
const inventory = computed(() => [...(state.profile?.inventory ?? [])].reverse());

// Only items that have an upgrade tier
const upgradableInventory = computed(() =>
  inventory.value.filter((i) => Boolean(UPGRADE_LADDER[i.rarity]))
);

const targetRarity = computed(() =>
  selectedItem.value ? UPGRADE_LADDER[selectedItem.value.rarity] ?? null : null
);

const winChance = computed(() => {
  if (!selectedItem.value || !targetRarity.value) return 0;
  const raw = (Number(selectedItem.value.value) / RARITY_BASE_VALUE[targetRarity.value]) * 100;
  return Math.min(90, Math.max(5, raw));
});

const chanceColor = computed(() => {
  const c = winChance.value;
  if (c >= 60) return "text-emerald-400";
  if (c >= 35) return "text-amber-400";
  return "text-rose-400";
});

// Dial geometry — SVG arc constants
const R = 88;
const totalArcLength = computed(() => 2 * Math.PI * R);
const winArcLength   = computed(() => (winChance.value / 100) * totalArcLength.value);

// Static needle coords (just a tick at top — the animation is handled via CSS)
const needleX = 100;
const needleY = 12;

// ── Methods ──────────────────────────────────────────────────
function selectItem(item) {
  if (spinning.value) return;
  selectedItem.value = item;
  result.value = null;
  state.error = "";
}

function upgradeChanceFor(item) {
  const target = UPGRADE_LADDER[item.rarity];
  if (!target) return 0;
  const raw = (Number(item.value) / RARITY_BASE_VALUE[target]) * 100;
  return Math.min(90, Math.max(5, raw));
}

function spinNeedle(finalAngleDeg, duration, onDone) {
  const el = needleEl.value;
  if (!el) { onDone(); return; }

  const startTime = performance.now();
  const startAngle = 0;
  // Spin ~4 full revolutions then land on the final angle
  const totalTravel = 4 * 360 + finalAngleDeg;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const angle = startAngle + totalTravel * easeOut(t);
    el.style.transform = `rotate(${angle}deg)`;
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      el.style.transform = `rotate(${finalAngleDeg}deg)`;
      onDone();
    }
  }
  requestAnimationFrame(frame);
}

async function doUpgrade() {
  if (!selectedItem.value || spinning.value || !state.user) return;
  spinning.value = true;
  result.value = null;
  state.error = "";

  const itemToUpgrade = selectedItem.value;

  try {
    const res = await upgradeItem(itemToUpgrade.id);

    // The roll is 0–100; map it to a dial angle (0° = top, 360° = full circle).
    // Win zone is the first winChance degrees from 0.
    // We want the needle to land inside the win zone on success, outside on fail.
    const winZoneEnd = (res.winChance / 100) * 360;
    let finalAngle;
    if (res.success) {
      // Land somewhere inside the green arc
      finalAngle = Math.random() * winZoneEnd * 0.9 + winZoneEnd * 0.05;
    } else {
      // Land somewhere in the red zone
      finalAngle = winZoneEnd + Math.random() * (360 - winZoneEnd) * 0.9 + (360 - winZoneEnd) * 0.05;
    }

    spinNeedle(finalAngle, 3200, () => {
      result.value = res;
      spinning.value = false;

      // If selected item was consumed, deselect
      const stillInInventory = inventory.value.find((i) => i.id === itemToUpgrade.id);
      if (!stillInInventory) selectedItem.value = null;
    });
  } catch (err) {
    state.error = err.message;
    spinning.value = false;
  }
}

// ── Rarity helpers ───────────────────────────────────────────
const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function renderIcon(iconUrl) {
  if (!iconUrl) return FALLBACK_ICON;
  if (String(iconUrl).startsWith("/api/image")) return iconUrl;
  if (String(iconUrl).startsWith("http")) return `/api/image?url=${encodeURIComponent(iconUrl)}`;
  return iconUrl;
}
function onImgErr(e) { e.target.src = FALLBACK_ICON; }

function rarityBorder(r)    { return RARITY_STYLES[r]?.border   ?? "border-white/8"; }
function rarityLabel(r)     { return RARITY_STYLES[r]?.label    ?? "text-zinc-500"; }
function rarityActiveBg(r) {
  const map = {
    "Mil-Spec":    "bg-sky-950/40",
    Restricted:    "bg-violet-950/40",
    Classified:    "bg-pink-950/40",
    Covert:        "bg-red-950/40",
    "Rare Special":"bg-amber-950/40",
  };
  return map[r] ?? "bg-white/5";
}
function rarityBarBg(r) {
  const map = {
    "Mil-Spec":    "bg-sky-500",
    Restricted:    "bg-violet-500",
    Classified:    "bg-pink-500",
    Covert:        "bg-red-500",
    "Rare Special":"bg-amber-400",
  };
  return map[r] ?? "bg-zinc-700";
}

// Info grid
const upgradeTiers = [
  { from: "Mil-Spec",   fromColor: "text-sky-400",    to: "Restricted",   toColor: "text-violet-400" },
  { from: "Restricted", fromColor: "text-violet-400", to: "Classified",   toColor: "text-pink-400"   },
  { from: "Classified", fromColor: "text-pink-400",   to: "Covert",       toColor: "text-red-400"    },
  { from: "Covert",     fromColor: "text-red-400",    to: "Rare Special", toColor: "text-amber-300"  },
];
</script>
