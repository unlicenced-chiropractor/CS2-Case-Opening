<template>
  <div class="space-y-4">

    <!-- ── HEADER ───────────────────────────────────────────── -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-white">Inventory</h2>
        <p class="mt-0.5 text-xs text-zinc-500">
          {{ inventory.length }} item{{ inventory.length !== 1 ? 's' : '' }} in your collection
        </p>
      </div>
      <span class="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-400">
        ${{ inventoryTotal.toFixed(2) }} total value
      </span>
    </div>

    <!-- ── MASS SELL BAR ─────────────────────────────────────── -->
    <div v-if="inventory.length" class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-4 space-y-3">
      <p class="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Mass sell by rarity</p>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="tier in massSellTiers"
          :key="tier.rarity"
          class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-35"
          :class="[
            tier.borderClass,
            tier.textClass,
            massSellPending === tier.rarity ? tier.activeBgClass : 'bg-transparent hover:bg-white/5',
            !tierCount(tier.rarity) ? 'pointer-events-none opacity-25' : '',
          ]"
          :disabled="!tierCount(tier.rarity) || bulkSelling"
          @click="toggleMassSell(tier.rarity)"
        >
          <span class="inline-block h-1.5 w-1.5 rounded-full" :class="tier.dotClass"></span>
          {{ tier.label }}
          <span class="rounded-full bg-white/10 px-1.5 py-px text-[10px] font-bold text-white">
            {{ tierCount(tier.rarity) }}
          </span>
        </button>
      </div>

      <!-- Confirm strip -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="massSellPending"
          class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-950/30 px-4 py-3"
        >
          <p class="text-sm text-zinc-300">
            Sell
            <span class="font-bold text-white">{{ tierCount(massSellPending) }}</span>
            {{ massSellPending }} item{{ tierCount(massSellPending) !== 1 ? 's' : '' }} for
            <span class="font-bold text-emerald-400">${{ tierTotal(massSellPending).toFixed(2) }}</span>?
          </p>
          <div class="flex gap-2">
            <button
              class="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-black transition-all hover:bg-emerald-400 disabled:opacity-50"
              :disabled="bulkSelling"
              @click="doMassSell"
            >
              {{ bulkSelling ? 'Selling...' : 'Confirm' }}
            </button>
            <button
              class="rounded-lg border border-white/8 bg-white/5 px-4 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-white/10 transition-all"
              :disabled="bulkSelling"
              @click="massSellPending = null"
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ── SELL FEEDBACK ─────────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sellMessage"
        class="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-400"
      >
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        {{ sellMessage }}
      </div>
    </Transition>

    <p v-if="state.error" class="text-xs text-rose-400">{{ state.error }}</p>

    <!-- ── INVENTORY GRID ────────────────────────────────────── -->
    <ul
      v-if="inventory.length"
      class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
    >
      <li
        v-for="item in inventory"
        :key="`${item.id}-${item.droppedAt}`"
        class="flex flex-col rounded-xl border bg-[#0d0d0d] transition-colors"
        :class="rarityBorder(item.rarity)"
      >
        <!-- Rarity bar -->
        <div class="h-[2px] w-full rounded-t-xl" :class="rarityBarBg(item.rarity)"></div>

        <!-- Image -->
        <div class="flex items-center justify-center px-3 pt-3 pb-1">
          <img
            :src="renderIcon(item.icon)"
            :alt="item.name"
            class="h-20 w-full object-contain drop-shadow-lg"
            loading="lazy"
            @error="onImgErr"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 px-3 pb-2">
          <p class="truncate text-[11px] font-semibold leading-tight text-zinc-100">{{ item.name }}</p>
          <p class="text-[10px] leading-tight" :class="rarityLabel(item.rarity)">{{ item.rarity }}</p>
          <p class="mt-0.5 text-[10px] text-zinc-500">{{ item.wear }}</p>
          <p class="mt-1 text-xs font-bold text-white">${{ Number(item.value).toFixed(2) }}</p>
        </div>

        <!-- Sell controls -->
        <div class="border-t border-white/5 px-3 py-2">
          <!-- idle -->
          <button
            v-if="sellStateFor(item.id) === 'idle'"
            class="w-full rounded-lg border border-white/8 bg-white/5 py-1 text-[10px] font-semibold text-zinc-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-950/40 hover:text-emerald-400"
            @click="confirmSell(item.id)"
          >
            Sell
          </button>

          <!-- confirm -->
          <div v-else-if="sellStateFor(item.id) === 'confirm'" class="flex gap-1">
            <button
              class="flex-1 rounded-lg bg-emerald-500 py-1 text-[10px] font-bold text-black transition-all hover:bg-emerald-400"
              @click="doSell(item)"
            >
              Confirm
            </button>
            <button
              class="flex-1 rounded-lg border border-white/8 bg-white/5 py-1 text-[10px] font-semibold text-zinc-400 hover:bg-white/10 transition-all"
              @click="cancelSell(item.id)"
            >
              Cancel
            </button>
          </div>

          <!-- selling -->
          <div
            v-else
            class="flex items-center justify-center gap-1.5 py-1 text-[10px] text-zinc-500"
          >
            <svg class="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Selling...
          </div>
        </div>
      </li>
    </ul>

    <!-- ── EMPTY STATE ───────────────────────────────────────── -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 bg-[#0d0d0d] py-20 text-center"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
        <svg class="h-7 w-7 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          <path d="M16 3H8l-2 4h12l-2-4z"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-zinc-500">Your inventory is empty</p>
      <p class="text-xs text-zinc-700">Open a case to start collecting skins</p>
    </div>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { RARITY_STYLES } from "../data/skins";
import { useUserState } from "../lib/userState";

const { state, sellItem, sellBulk } = useUserState();

const inventory = computed(() => [...(state.profile?.inventory ?? [])].reverse());

const inventoryTotal = computed(() =>
  inventory.value.reduce((sum, i) => sum + Number(i.value), 0)
);

// ── Per-item sell state ──────────────────────────────────────
const sellState  = reactive({});
const sellMessage = ref("");

let sellMessageTimer = null;
function showSellMessage(msg) {
  sellMessage.value = msg;
  clearTimeout(sellMessageTimer);
  sellMessageTimer = setTimeout(() => { sellMessage.value = ""; }, 4000);
}

function sellStateFor(id) { return sellState[id] ?? "idle"; }

function confirmSell(id) {
  for (const k of Object.keys(sellState)) sellState[k] = "idle";
  sellState[id] = "confirm";
}
function cancelSell(id) { sellState[id] = "idle"; }

async function doSell(item) {
  sellState[item.id] = "selling";
  state.error = "";
  try {
    await sellItem(item.id);
    showSellMessage(`Sold ${item.name} for $${Number(item.value).toFixed(2)}.`);
  } catch (err) {
    state.error = err.message;
    sellState[item.id] = "idle";
  }
}

// ── Mass sell ────────────────────────────────────────────────
const massSellPending = ref(null);
const bulkSelling     = ref(false);

const massSellTiers = [
  { rarity: "Mil-Spec",     label: "Mil-Spec",     dotClass: "bg-sky-400",    borderClass: "border-sky-500/40",    textClass: "text-sky-400",    activeBgClass: "bg-sky-950/50"    },
  { rarity: "Restricted",   label: "Restricted",   dotClass: "bg-violet-400", borderClass: "border-violet-500/40", textClass: "text-violet-400", activeBgClass: "bg-violet-950/50" },
  { rarity: "Classified",   label: "Classified",   dotClass: "bg-pink-400",   borderClass: "border-pink-500/40",   textClass: "text-pink-400",   activeBgClass: "bg-pink-950/50"   },
  { rarity: "Covert",       label: "Covert",       dotClass: "bg-red-400",    borderClass: "border-red-500/40",    textClass: "text-red-400",    activeBgClass: "bg-red-950/50"    },
  { rarity: "Rare Special", label: "Rare Special", dotClass: "bg-amber-400",  borderClass: "border-amber-400/40",  textClass: "text-amber-300",  activeBgClass: "bg-amber-950/50"  },
];

function tierCount(rarity) {
  return inventory.value.filter((i) => i.rarity === rarity).length;
}
function tierTotal(rarity) {
  return inventory.value
    .filter((i) => i.rarity === rarity)
    .reduce((sum, i) => sum + Number(i.value), 0);
}
function toggleMassSell(rarity) {
  massSellPending.value = massSellPending.value === rarity ? null : rarity;
}

async function doMassSell() {
  if (!massSellPending.value || bulkSelling.value) return;
  bulkSelling.value = true;
  state.error = "";
  try {
    const { soldCount, soldValue } = await sellBulk([massSellPending.value]);
    showSellMessage(`Sold ${soldCount} item${soldCount !== 1 ? "s" : ""} for $${soldValue.toFixed(2)}.`);
    massSellPending.value = null;
  } catch (err) {
    state.error = err.message;
  } finally {
    bulkSelling.value = false;
  }
}

// ── Rarity helpers ───────────────────────────────────────────
const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function renderIcon(iconUrl) {
  if (!iconUrl) return FALLBACK_ICON;
  if (String(iconUrl).startsWith("http")) return iconUrl;
  return iconUrl;
}
function onImgErr(e) { e.target.src = FALLBACK_ICON; }

function rarityBorder(r) { return RARITY_STYLES[r]?.border ?? "border-white/8"; }
function rarityLabel(r)  { return RARITY_STYLES[r]?.label  ?? "text-zinc-500"; }
function rarityBarBg(r) {
  const map = {
    "Mil-Spec":     "bg-sky-500",
    "Restricted":   "bg-violet-500",
    "Classified":   "bg-pink-500",
    "Covert":       "bg-red-500",
    "Rare Special": "bg-amber-400",
  };
  return map[r] ?? "bg-zinc-700";
}
</script>
