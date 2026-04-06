<template>
  <section class="space-y-8">

    <!-- ── SPINNER SECTION ──────────────────────────────────── -->
    <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6">
      <!-- header row -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-white">Case Opening</h1>
          <p class="mt-0.5 text-xs text-zinc-500">
            Mil-Spec 55% · Restricted 28% · Classified 12% · Covert 4.5% · Rare Special 0.5%
          </p>
        </div>

        <!-- rarity legend pills -->
        <div class="flex flex-wrap gap-1.5">
          <span class="rounded-full border border-sky-500/40 bg-sky-950/40 px-2.5 py-0.5 text-[11px] font-medium text-sky-400">Mil-Spec</span>
          <span class="rounded-full border border-violet-500/40 bg-violet-950/40 px-2.5 py-0.5 text-[11px] font-medium text-violet-400">Restricted</span>
          <span class="rounded-full border border-pink-500/40 bg-pink-950/40 px-2.5 py-0.5 text-[11px] font-medium text-pink-400">Classified</span>
          <span class="rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-0.5 text-[11px] font-medium text-red-400">Covert</span>
          <span class="rounded-full border border-amber-400/40 bg-amber-950/40 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">Rare Special</span>
        </div>
      </div>

      <!-- spinner -->
      <CaseSpinner
        v-if="spinnerFeed.length"
        :feed="spinnerFeed"
        :target-index="targetIndex"
        :spinning="spinning"
      />

      <!-- open button -->
      <div class="mt-6 flex flex-col items-center gap-2">
        <button
          class="relative overflow-hidden rounded-xl bg-amber-400 px-10 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-300 hover:shadow-amber-400/30 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!canOpen || spinning"
          @click="openCase"
        >
          <span v-if="!spinning">Open Case — ${{ caseCost.toFixed(2) }}</span>
          <span v-else class="flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Rolling...
          </span>
        </button>

        <p v-if="!state.user" class="text-xs text-zinc-600">
          <RouterLink to="/auth" class="text-amber-400 hover:underline">Sign in</RouterLink> to open cases
        </p>
        <p v-else-if="balance < caseCost" class="text-xs text-zinc-500">
          Not enough credits — stipend tops you up when balance is below $5
        </p>
      </div>
    </div>

    <!-- ── LAST DROP RESULT ─────────────────────────────────── -->
    <Transition
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lastDrop"
        class="flex items-center gap-4 rounded-2xl border p-4"
        :class="dropCardClasses"
      >
        <img
          :src="renderIcon(lastDrop.icon)"
          class="h-20 w-24 shrink-0 rounded-lg object-contain"
          :alt="lastDrop.name"
          @error="onImgErr"
        />
        <div class="flex-1 min-w-0">
          <p class="text-[11px] uppercase tracking-widest" :class="dropLabelClass">{{ lastDrop.rarity }}</p>
          <p class="mt-0.5 truncate text-lg font-bold text-white">{{ lastDrop.name }}</p>
          <p class="text-sm text-zinc-400">{{ lastDrop.wear }} · <span class="font-semibold text-white">${{ lastDrop.value.toFixed(2) }}</span></p>
        </div>
        <button class="shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors" @click="lastDrop = null">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- ── ACCOUNT + INVENTORY ──────────────────────────────── -->
    <div class="grid gap-4 md:grid-cols-3">

      <!-- Account panel -->
      <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-5">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-500">Account</h2>

        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-zinc-400">Status</span>
            <span class="text-sm font-medium" :class="state.user ? 'text-emerald-400' : 'text-zinc-500'">
              {{ state.user ? "Signed In" : "Guest" }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-zinc-400">Balance</span>
            <span class="text-base font-bold text-amber-400">${{ balance.toFixed(2) }}</span>
          </div>

          <!-- Balance bar -->
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              class="h-full rounded-full bg-amber-400 transition-all duration-700"
              :style="{ width: `${Math.min(balance / 200 * 100, 100)}%` }"
            ></div>
          </div>
        </div>

        <p class="mt-4 text-[11px] leading-relaxed text-zinc-600">
          Balance below $5? You receive +$100 virtual credits every 15 minutes automatically.
        </p>

        <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <p v-if="state.stipendMessage" class="mt-2 text-xs font-medium text-emerald-400">
            ✓ {{ state.stipendMessage }}
          </p>
        </Transition>

        <p v-if="state.error" class="mt-2 text-xs text-rose-400">{{ state.error }}</p>
      </div>

      <!-- Inventory panel -->
      <div class="md:col-span-2 rounded-2xl border border-white/8 bg-[#0d0d0d] p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-500">Inventory</h2>
          <span class="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">{{ inventory.length }} items</span>
        </div>

        <ul v-if="inventory.length" class="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
          <li
            v-for="item in inventory"
            :key="`${item.id}-${item.droppedAt}`"
            class="relative flex flex-col rounded-xl border p-2.5 transition-colors"
            :class="inventoryBorder(item.rarity)"
          >
            <!-- normal view -->
            <div v-if="sellStateFor(item.id) !== 'confirm'" class="flex items-center gap-3">
              <img
                :src="renderIcon(item.icon)"
                class="h-10 w-12 shrink-0 rounded object-contain"
                :alt="item.name"
                @error="onImgErr"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[11px] font-semibold text-zinc-100 leading-tight">{{ item.name }}</p>
                <p class="text-[10px] text-zinc-500 leading-tight">{{ item.wear }}</p>
                <p class="text-[11px] font-bold text-white">${{ Number(item.value).toFixed(2) }}</p>
              </div>
              <button
                class="ml-auto shrink-0 rounded-lg border border-white/8 bg-white/5 px-2 py-1 text-[10px] font-semibold text-zinc-400 hover:border-emerald-500/40 hover:bg-emerald-950/40 hover:text-emerald-400 transition-all"
                :disabled="spinning"
                @click="confirmSell(item.id)"
              >
                Sell
              </button>
            </div>

            <!-- confirm view -->
            <div v-else class="flex flex-col gap-2">
              <p class="text-[11px] text-zinc-300 leading-tight">
                Sell <span class="font-semibold text-white">{{ item.name }}</span> for
                <span class="font-bold text-emerald-400">${{ Number(item.value).toFixed(2) }}</span>?
              </p>
              <div class="flex gap-1.5">
                <button
                  class="flex-1 rounded-lg bg-emerald-500 py-1 text-[10px] font-bold text-black transition-all hover:bg-emerald-400 disabled:opacity-50"
                  :disabled="sellStateFor(item.id) === 'selling'"
                  @click="doSell(item)"
                >
                  {{ sellStateFor(item.id) === 'selling' ? '...' : 'Confirm' }}
                </button>
                <button
                  class="flex-1 rounded-lg border border-white/8 bg-white/5 py-1 text-[10px] font-semibold text-zinc-400 hover:bg-white/10 transition-all"
                  :disabled="sellStateFor(item.id) === 'selling'"
                  @click="cancelSell(item.id)"
                >
                  Cancel
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="mt-8 flex flex-col items-center justify-center gap-2 text-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <svg class="h-6 w-6 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              <path d="M16 3H8l-2 4h12l-2-4z"/>
            </svg>
          </div>
          <p class="text-sm text-zinc-600">No items yet</p>
          <p class="text-xs text-zinc-700">Open a case to get started</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { RouterLink } from "vue-router";
import CaseSpinner from "../components/CaseSpinner.vue";
import { CASE_COST as FALLBACK_CASE_COST, RARITY_STYLES, SKINS as FALLBACK_SKINS } from "../data/skins";
import { apiFetch } from "../lib/api";
import { makeSpinnerFeed } from "../lib/economy";
import { useUserState } from "../lib/userState";

const { state, openCaseRoll, sellItem } = useUserState();
const spinning   = ref(false);
const catalogSkins = ref(FALLBACK_SKINS);
const caseCost   = ref(FALLBACK_CASE_COST);
const spinnerFeed  = ref(makeSpinnerFeed(catalogSkins.value));
const targetIndex  = ref(0);
const lastDrop   = ref(null);

const balance   = computed(() => Number(state.profile?.balance ?? 0));
const inventory  = computed(() => [...(state.profile?.inventory ?? [])].reverse());
const canOpen   = computed(() => state.user && balance.value >= caseCost.value);

// Holds a snapshot of the profile from just before each spin so we can
// revert state.profile during the animation and avoid spoiling the result.
const previousProfile = ref(null);

// Per-item sell confirm state: { [inventoryId]: 'idle' | 'confirm' | 'selling' }
const sellState = reactive({});

function sellStateFor(id) {
  return sellState[id] ?? "idle";
}

function confirmSell(id) {
  // Reset any other pending confirms first
  for (const k of Object.keys(sellState)) sellState[k] = "idle";
  sellState[id] = "confirm";
}

function cancelSell(id) {
  sellState[id] = "idle";
}

async function doSell(item) {
  sellState[item.id] = "selling";
  try {
    await sellItem(item.id);
    // profile is updated by sellItem, item disappears from inventory computed
  } catch (err) {
    state.error = err.message;
    sellState[item.id] = "idle";
  }
}

const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function renderIcon(iconUrl) {
  if (!iconUrl) return FALLBACK_ICON;
  if (String(iconUrl).startsWith("/api/image")) return iconUrl;
  if (String(iconUrl).startsWith("http")) return `/api/image?url=${encodeURIComponent(iconUrl)}`;
  return iconUrl;
}
function onImgErr(e) { e.target.src = FALLBACK_ICON; }

function inventoryBorder(r) {
  return RARITY_STYLES[r]?.border ?? "border-white/8";
}

const dropCardClasses = computed(() => {
  const r = lastDrop.value?.rarity;
  const styles = {
    "Mil-Spec":    "border-sky-500/40 bg-sky-950/20",
    "Restricted":  "border-violet-500/40 bg-violet-950/20",
    "Classified":  "border-pink-500/40 bg-pink-950/20",
    "Covert":      "border-red-500/40 bg-red-950/20",
    "Rare Special":"border-amber-400/50 bg-amber-950/20",
  };
  return styles[r] ?? "border-white/8 bg-white/3";
});

const dropLabelClass = computed(() => RARITY_STYLES[lastDrop.value?.rarity]?.label ?? "text-zinc-400");

function putResultNearCenter(feed, result) {
  const index = 48;
  const copy = [...feed];
  copy[index] = { ...copy[index], ...result };
  return { copy, index };
}

async function openCase() {
  // Snapshot profile BEFORE the API call so we can restore it mid-spin.
  previousProfile.value = state.profile ? { ...state.profile, inventory: [...(state.profile.inventory ?? [])] } : null;

  if (!canOpen.value || spinning.value) return;
  lastDrop.value = null;
  state.error = "";

  try {
    // 1) Call the API first — openCaseRoll now returns { drop, profile }
    //    without touching state.profile, so we control when it's applied.
    const { drop: rolled, profile: updatedProfile } = await openCaseRoll(caseCost.value);

    // 2) Build the new feed and plant the result — all BEFORE spinning starts,
    //    so the DOM renders the full track before the animation kicks off.
    const newFeed = makeSpinnerFeed(catalogSkins.value, 70);
    const { copy, index } = putResultNearCenter(newFeed, rolled);
    spinnerFeed.value = copy;
    targetIndex.value = index;

    // 3) Keep state.profile at the pre-spin snapshot so the inventory and
    //    balance don't change while the animation is playing.
    state.profile = previousProfile.value;

    // 4) NOW start the animation.
    spinning.value = true;

    // 5) After the animation finishes, reveal the result and apply the profile.
    setTimeout(() => {
      state.profile = updatedProfile;
      lastDrop.value = rolled;
      spinning.value = false;
    }, 7900);
  } catch (err) {
    state.error = err.message;
    spinning.value = false;
  }
}

onMounted(async () => {
  try {
    const catalog = await apiFetch("/api/catalog", { method: "GET" });
    if (Array.isArray(catalog.skins) && catalog.skins.length) {
      catalogSkins.value = catalog.skins;
      spinnerFeed.value = makeSpinnerFeed(catalogSkins.value);
    }
    if (Number.isFinite(catalog.caseCost) && catalog.caseCost > 0) {
      caseCost.value = catalog.caseCost;
    }
  } catch (_) {
    // use fallback
  }
});
</script>
