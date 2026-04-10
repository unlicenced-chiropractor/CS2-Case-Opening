<template>
  <div class="space-y-6">
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-350 ease-out"
      enter-from-class="opacity-0 translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <!-- Unknown / loading -->
      <div
        v-if="!ready || !selectedCase"
        key="loading-or-missing"
        class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-10 text-center"
      >
        <template v-if="!ready">
          <div class="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[rgb(var(--cs-ring))]" />
          <p class="mt-4 text-sm text-zinc-500">Loading case…</p>
        </template>
        <template v-else>
          <p class="text-white">We couldn&apos;t find that case.</p>
          <RouterLink
            to="/"
            class="mt-4 inline-block rounded-lg accent-bg px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 hover:scale-105"
          >
            Back to all cases
          </RouterLink>
        </template>
      </div>

      <!-- Detail -->
      <div v-else :key="caseIdParam" class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6">
        <RouterLink
          to="/"
          class="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.5)]"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All cases
        </RouterLink>

        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <h1 class="text-xl font-bold tracking-tight text-white">{{ selectedCase.name }}</h1>
            <p v-if="caseCost === 0" class="mt-1 text-sm font-semibold text-green-400">FREE</p>
            <p v-else class="mt-1 text-sm text-zinc-500">${{ caseCost.toFixed(2) }} per open</p>
            <p class="mt-2 text-xs leading-relaxed text-zinc-500">{{ oddsLine }}</p>
          </div>
          <div class="flex flex-wrap justify-end gap-1.5">
            <span
              class="rounded-full border border-sky-500/40 bg-sky-950/40 px-2.5 py-0.5 text-[11px] font-medium text-sky-400"
            >Mil-Spec</span>
            <span
              class="rounded-full border border-violet-500/40 bg-violet-950/40 px-2.5 py-0.5 text-[11px] font-medium text-violet-400"
            >Restricted</span>
            <span
              class="rounded-full border border-pink-500/40 bg-pink-950/40 px-2.5 py-0.5 text-[11px] font-medium text-pink-400"
            >Classified</span>
            <span
              class="rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-0.5 text-[11px] font-medium text-red-400"
            >Covert</span>
            <span
              class="rounded-full border border-amber-400/40 bg-amber-950/40 px-2.5 py-0.5 text-[11px] font-medium text-amber-300"
            >Rare Special</span>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center gap-2">
          <button
            class="relative overflow-hidden rounded-xl accent-bg px-10 py-3 text-sm font-bold uppercase tracking-widest text-black accent-shadow shadow-lg transition-all duration-200 hover:brightness-110 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.5)] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]"
            :disabled="!canOpen || spinning || spinPreparing"
            @click="openCase"
          >
            <span v-if="!spinPreparing && !spinning">{{ caseCost === 0 ? 'Open — FREE' : `Open — $${caseCost.toFixed(2)}` }}</span>
            <span v-else class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                />
              </svg>
              {{ spinPreparing ? "Starting…" : "Rolling…" }}
            </span>
          </button>
          <p v-if="!state.user" class="text-xs text-zinc-600">
            <RouterLink
              class="accent-text underline-offset-2 transition-colors duration-200 hover:underline"
              :to="{ path: '/auth', query: { redirect: route.fullPath } }"
            >Sign in</RouterLink>
            to open cases
          </p>
          <p v-else-if="caseCost > 0 && balance < caseCost" class="text-xs text-zinc-500">
            Not enough credits — stipend tops you up when balance is below $5
          </p>
        </div>

        <div class="mt-10 border-t border-white/8 pt-8">
          <h2 class="text-sm font-semibold uppercase tracking-widest text-zinc-500">What's inside</h2>
          <p class="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-600">
            <template v-if="String(selectedCase?.id || '').startsWith('crate-')">
              Skins in this CS2 case (from the live game data API), grouped by rarity. Prices use the same live feed as opens when available. Drop odds match Valve's published case probabilities.
            </template>
            <template v-else>
              Sample of items from the live catalog by rarity. Totals reflect how many skins map to each tier; your roll uses the odds shown above.
            </template>
          </p>
          <div v-for="block in activePreview" :key="block.rarity" class="mt-8 first:mt-6">
            <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-2">
              <span class="text-base font-medium text-white">{{ block.rarity }}</span>
              <span class="text-xs text-zinc-500">{{ block.percent }}% chance · {{ block.count }} skins in pool</span>
            </div>
            <div
              v-if="block.sample?.length"
              class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              <div
                v-for="(s, i) in block.sample"
                :key="`${block.rarity}-${i}-${s.name}`"
                class="rounded-lg border border-white/8 bg-white/3 p-2 transition-colors duration-200"
              >
                <img
                  :src="renderIcon(s.icon)"
                  class="mx-auto h-16 w-full object-contain"
                  :alt="s.name"
                  @error="onImgErr"
                />
                <p
                  class="mt-2 line-clamp-2 text-center text-[10px] leading-tight text-zinc-400"
                  :title="s.name"
                >
                  {{ s.name }}
                </p>
                <p v-if="s.value != null" class="mt-0.5 text-center text-[9px] font-medium text-zinc-500">
                  ${{ Number(s.value).toFixed(2) }}
                </p>
              </div>
            </div>
            <p v-else class="text-xs text-zinc-600">No skins mapped to this rarity in the live catalog.</p>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedCase && lastDrop && !revealVisible && !spinOverlayVisible"
        class="flex items-center gap-4 rounded-2xl border p-4"
        :class="dropCardClasses"
      >
        <img
          :src="renderIcon(lastDrop.icon)"
          class="h-20 w-24 shrink-0 rounded-lg object-contain"
          :alt="lastDrop.name"
          @error="onImgErr"
        />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] uppercase tracking-widest" :class="dropLabelClass">{{ lastDrop.rarity }}</p>
          <p class="mt-0.5 truncate text-lg font-bold text-white">{{ lastDrop.name }}</p>
          <p class="text-sm text-zinc-400">
            {{ lastDrop.wear }} ·
            <span class="font-semibold text-white">${{ lastDrop.value.toFixed(2) }}</span>
          </p>
        </div>
        <button
          class="shrink-0 text-zinc-600 transition-colors hover:text-zinc-400"
          @click="lastDrop = null"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-5">
      <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-500">Account</h2>
      <div class="mt-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-zinc-400">Status</span>
          <span class="text-sm font-medium" :class="state.user ? 'text-emerald-400' : 'text-zinc-500'">
            {{ state.user ? "Signed In" : "Guest" }}
          </span>
        </div>
      </div>
      <p class="mt-4 text-[11px] leading-relaxed text-zinc-600">
        Balance below $5? You receive +$100 virtual credits every 15 minutes automatically.
      </p>
      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <p v-if="state.stipendMessage" class="mt-2 text-xs font-medium text-emerald-400">
          ✓ {{ state.stipendMessage }}
        </p>
      </Transition>
      <p v-if="state.error" class="mt-2 text-xs text-rose-400">{{ state.error }}</p>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="spinOverlayVisible"
          class="fixed inset-0 z-[100] flex flex-col bg-zinc-950/97 backdrop-blur-md"
          role="presentation"
        >
          <div class="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <p class="text-sm font-medium text-white">{{ selectedCase?.name ?? "Case" }}</p>
            <p v-if="spinPreparing" class="text-xs text-zinc-500">Preparing roll…</p>
          </div>
          <div class="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
            <CaseSpinner
              v-if="spinnerFeed.length && !spinPreparing"
              variant="fullscreen"
              :feed="spinnerFeed"
              :target-index="targetIndex"
              :spinning="spinning"
            />
            <div v-else-if="spinPreparing" class="flex flex-col items-center gap-4 py-16 text-zinc-500">
              <svg class="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                />
              </svg>
              <p class="text-sm">Locking in your roll…</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="revealVisible && lastDrop"
          class="fixed inset-0 z-[110] flex items-center justify-center bg-black/88 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reveal-title"
        >
          <div
            class="w-full max-w-md rounded-2xl border p-6 shadow-md transition-all duration-200"
            :class="dropCardClasses"
          >
            <p class="text-center text-[11px] uppercase tracking-widest" :class="dropLabelClass">
              {{ lastDrop.rarity }}
            </p>
            <h2 id="reveal-title" class="mt-2 text-center text-2xl font-bold text-white">
              {{ lastDrop.name }}
            </h2>
            <img
              :src="renderIcon(lastDrop.icon)"
              class="mx-auto mt-6 h-48 w-full max-w-xs object-contain"
              :alt="lastDrop.name"
              @error="onImgErr"
            />
            <p class="mt-4 text-center text-sm text-zinc-400">
              {{ lastDrop.wear }} ·
              <span class="font-semibold text-white">${{ lastDrop.value.toFixed(2) }}</span>
            </p>
            <button
              type="button"
              class="mt-8 w-full rounded-xl accent-bg py-3 text-sm font-bold uppercase tracking-widest text-black accent-shadow shadow-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.5)] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]"
              @click="closeReveal"
            >
              Continue
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import CaseSpinner from "../components/CaseSpinner.vue";
import { CASE_COST as FALLBACK_CASE_COST, RARITY_STYLES, SKINS as FALLBACK_SKINS } from "../data/skins";
import {
  buildLocalPreview,
  casesList,
  catalogSkins,
  cs2CasesList,
  ensureCaseCatalog,
  ensureCs2Cases,
} from "../lib/caseCatalog";
import { makeCaseWeightedSpinnerFeed, makeSpinnerFeed } from "../lib/economy";
import { useUserState } from "../lib/userState";

const route = useRoute();
const router = useRouter();
const { state, openCaseRoll } = useUserState();

const ready = ref(false);
const spinning = ref(false);
const spinPreparing = ref(false);
const spinOverlayVisible = ref(false);
const revealVisible = ref(false);
const spinnerFeed = ref(makeSpinnerFeed(FALLBACK_SKINS));
const targetIndex = ref(0);
const lastDrop = ref(null);
const previousProfile = ref(null);

const caseIdParam = computed(() => String(route.params.caseId ?? "").trim());

const selectedCase = computed(() => {
  const id = caseIdParam.value;
  if (!id) return null;
  return (
    casesList.value.find((c) => c.id === id) ??
    cs2CasesList.value.find((c) => c.id === id) ??
    null
  );
});

const caseCost = computed(() => Number(selectedCase.value?.cost ?? FALLBACK_CASE_COST));

function getCaseSkins() {
  const c = selectedCase.value;
  if (!c) return catalogSkins.value;
  return (c.skins?.length ? c.skins : null) ?? catalogSkins.value;
}

function rebuildCaseSpinnerFeed() {
  if (spinning.value || !selectedCase.value) return;
  const skins = getCaseSkins();
  if (!skins.length) return;
  const lp = selectedCase.value.luckPool;
  spinnerFeed.value =
    lp?.length
      ? makeCaseWeightedSpinnerFeed(skins, lp, 70)
      : makeSpinnerFeed(skins, 70);
}

watch(
  () => [
    caseIdParam.value,
    casesList.value.length,
    cs2CasesList.value.length,
    catalogSkins.value.length,
    selectedCase.value?.id,
  ],
  () => {
    if (selectedCase.value) {
      rebuildCaseSpinnerFeed();
    }
  },
);

const oddsLine = computed(() => {
  const lp = selectedCase.value?.luckPool;
  if (!lp?.length) {
    return "Mil-Spec 79.9% · Restricted 16% · Classified 3.2% · Covert 0.6% · Rare Special 0.3%";
  }
  return lp.map((e) => `${e.rarity} ${e.percent}%`).join(" · ");
});

const activePreview = computed(() => {
  const c = selectedCase.value;
  if (!c) return [];
  const prev = c.preview;
  const cid = c.id ?? "classic";
  if (prev?.length) return prev;
  const skins = (c.skins?.length ? c.skins : null) ?? catalogSkins.value;
  return buildLocalPreview(skins, c.luckPool ?? [], cid);
});

const balance = computed(() => Number(state.profile?.balance ?? 0));
const canOpen = computed(() => state.user && selectedCase.value && (caseCost.value === 0 || balance.value >= caseCost.value));

const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function renderIcon(iconUrl) {
  if (!iconUrl) return FALLBACK_ICON;
  if (String(iconUrl).startsWith("http")) return iconUrl;
  return iconUrl;
}
function onImgErr(e) {
  e.target.src = FALLBACK_ICON;
}

const dropCardClasses = computed(() => {
  const styles = {
    "Mil-Spec": "border-sky-500/40 bg-sky-950/20",
    Restricted: "border-violet-500/40 bg-violet-950/20",
    Classified: "border-pink-500/40 bg-pink-950/20",
    Covert: "border-red-500/40 bg-red-950/20",
    "Rare Special": "border-amber-400/50 bg-amber-950/20",
  };
  return styles[lastDrop.value?.rarity] ?? "border-white/8 bg-white/3";
});

const dropLabelClass = computed(() => RARITY_STYLES[lastDrop.value?.rarity]?.label ?? "text-zinc-400");

function putResultNearCenter(feed, result) {
  const index = 48;
  const copy = [...feed];
  copy[index] = { ...copy[index], ...result };
  return { copy, index };
}

function closeReveal() {
  revealVisible.value = false;
  spinOverlayVisible.value = false;
}

async function openCase() {
  if (!canOpen.value || spinning.value || spinPreparing.value) return;
  previousProfile.value = state.profile
    ? { ...state.profile, inventory: [...(state.profile.inventory ?? [])] }
    : null;

  lastDrop.value = null;
  revealVisible.value = false;
  state.error = "";
  spinOverlayVisible.value = true;
  spinPreparing.value = true;
  spinning.value = false;

  try {
    const id = selectedCase.value?.id ?? caseIdParam.value;
    const { drop: rolled, profile: updatedProfile } = await openCaseRoll(id);

    const lp = selectedCase.value?.luckPool;
    const spinSkins = getCaseSkins();
    const newFeed =
      lp?.length
        ? makeCaseWeightedSpinnerFeed(spinSkins, lp, 70)
        : makeSpinnerFeed(spinSkins, 70);
    const { copy, index } = putResultNearCenter(newFeed, rolled);
    spinnerFeed.value = copy;
    targetIndex.value = index;

    state.profile = previousProfile.value;
    spinPreparing.value = false;
    await nextTick();
    spinning.value = true;

    setTimeout(() => {
      state.profile = updatedProfile;
      lastDrop.value = rolled;
      spinning.value = false;
      revealVisible.value = true;
    }, 3600);
  } catch (err) {
    state.error = err.message;
    spinPreparing.value = false;
    spinning.value = false;
    spinOverlayVisible.value = false;
  }
}

async function boot() {
  await Promise.all([ensureCaseCatalog(), ensureCs2Cases()]);
  ready.value = true;
  if (
    (casesList.value.length || cs2CasesList.value.length) &&
    caseIdParam.value &&
    !selectedCase.value
  ) {
    router.replace({ name: "home" });
  }
  if (selectedCase.value) {
    nextTick(() => rebuildCaseSpinnerFeed());
  }
}

onMounted(boot);
watch(caseIdParam, () => {
  if (!ready.value) return;
  state.error = "";
  if (
    (casesList.value.length || cs2CasesList.value.length) &&
    caseIdParam.value &&
    !selectedCase.value
  ) {
    router.replace({ name: "home" });
  }
  if (selectedCase.value) {
    nextTick(() => rebuildCaseSpinnerFeed());
  }
});
</script>
