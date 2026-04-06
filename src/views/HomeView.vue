<template>
  <section class="space-y-5">
    <div
      class="rounded-xl border border-slate-700 bg-slate-900/75 p-4 text-sm text-slate-300"
    >
      <p class="font-semibold text-cyan-300">Legal Demo Notice</p>
      <p class="mt-1">
        This is a simulation with virtual credits only. It is not affiliated with Valve or CS2 and
        has no real-money gambling.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article class="rounded-xl border border-slate-700 bg-slate-900/80 p-4 md:col-span-2">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-white">Case Opening Simulator</h2>
          <button
            class="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
            :disabled="!canOpen || spinning"
            @click="openCase"
          >
            {{ spinning ? "Rolling..." : `Open Case ($${CASE_COST.toFixed(2)})` }}
          </button>
        </div>

        <p class="mt-2 text-xs text-slate-400">
          Odds: Mil-Spec 55%, Restricted 28%, Classified 12%, Covert 4.5%, Rare Special 0.5%.
        </p>

        <CaseSpinner
          v-if="spinnerFeed.length"
          class="mt-4"
          :feed="spinnerFeed"
          :target-index="targetIndex"
          :spinning="spinning"
        />

        <div v-if="lastDrop" class="mt-4 rounded border border-slate-700 bg-slate-800/70 p-3">
          <p class="text-sm text-slate-400">Last drop</p>
          <p class="font-semibold text-white">
            {{ lastDrop.name }} ({{ lastDrop.wear }}) - ${{ lastDrop.value.toFixed(2) }}
          </p>
        </div>
      </article>

      <aside class="space-y-4">
        <article class="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-400">Account</h3>
          <p class="mt-2 text-sm text-slate-300">
            Status:
            <span class="font-medium text-white">{{ state.user ? "Signed In" : "Guest" }}</span>
          </p>
          <p class="mt-1 text-sm text-slate-300">
            Balance:
            <span class="font-semibold text-cyan-300">${{ balance.toFixed(2) }}</span>
          </p>
          <p class="mt-1 text-xs text-slate-500">
            If balance is below $5, users receive +$100 virtual credits every 15 minutes.
          </p>
          <p v-if="state.stipendMessage" class="mt-2 text-xs text-emerald-300">
            {{ state.stipendMessage }}
          </p>
        </article>

        <article class="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-400">Inventory</h3>
          <ul class="mt-3 max-h-64 space-y-2 overflow-auto text-xs">
            <li
              v-for="item in inventory"
              :key="`${item.name}-${item.droppedAt}`"
              class="rounded border border-slate-700 bg-slate-800/70 p-2"
            >
              <p class="font-medium text-slate-100">{{ item.name }}</p>
              <p class="text-slate-400">{{ item.wear }} - ${{ Number(item.value).toFixed(2) }}</p>
            </li>
            <li v-if="!inventory.length" class="text-slate-500">No items yet.</li>
          </ul>
        </article>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import CaseSpinner from "../components/CaseSpinner.vue";
import { CASE_COST, SKINS } from "../data/skins";
import { makeSpinnerFeed } from "../lib/economy";
import { useUserState } from "../lib/userState";

const { state, openCaseRoll } = useUserState();
const spinning = ref(false);
const spinnerFeed = ref(makeSpinnerFeed(SKINS));
const targetIndex = ref(0);
const lastDrop = ref(null);

const balance = computed(() => Number(state.profile?.balance ?? 0));
const inventory = computed(() => [...(state.profile?.inventory ?? [])].reverse());
const canOpen = computed(() => state.user && balance.value >= CASE_COST);

function putResultNearCenter(feed, result) {
  const index = 48;
  const hydrated = {
    ...feed[index],
    ...result,
  };
  const copy = [...feed];
  copy[index] = hydrated;
  return { copy, index };
}

async function openCase() {
  if (!canOpen.value || spinning.value) return;

  spinning.value = true;
  try {
    const rolled = await openCaseRoll(CASE_COST);
    const newFeed = makeSpinnerFeed(SKINS, 70);
    const { copy, index } = putResultNearCenter(newFeed, rolled);
    spinnerFeed.value = copy;
    targetIndex.value = index;

    setTimeout(() => {
      lastDrop.value = rolled;
      spinning.value = false;
    }, 7900);
  } catch (err) {
    state.error = err.message;
    spinning.value = false;
  }
}
</script>
