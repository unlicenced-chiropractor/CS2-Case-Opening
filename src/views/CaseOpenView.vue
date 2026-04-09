<template>
  <div class="space-y-8">

    <!-- ── Custom Cases ─────────────────────────────────────────────── -->
    <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6">
      <div class="mb-6">
        <h2 class="text-xl font-bold tracking-tight text-white">Case Opening</h2>
        <p class="mt-1 text-sm text-zinc-500">Choose a case to view odds and open it.</p>
      </div>

      <div v-if="catalogLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="n in 4" :key="n" class="h-36 animate-pulse rounded-xl border border-white/5 bg-white/5" />
      </div>

      <div
        v-else-if="casesList.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        role="list"
        aria-label="Cases"
      >
        <RouterLink
          v-for="(c, index) in casesList"
          :key="c.id"
          :to="{ name: 'caseDetail', params: { caseId: c.id } }"
          class="case-grid-card block rounded-xl border border-l-[3px] p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.5)] focus:ring-offset-2 focus:ring-offset-[#0d0d0d] hover:scale-[1.02] hover:border-white/25"
          :class="['border-white/10 bg-white/3', caseCardAccentBorder(c.id)]"
          :style="{ '--stagger': index }"
        >
          <p class="text-base font-semibold text-white">{{ c.name }}</p>
          <p v-if="Number(c.cost) === 0" class="mt-1 text-sm font-semibold text-green-400">FREE</p>
          <p v-else class="mt-1 text-sm text-zinc-500">${{ Number(c.cost).toFixed(2) }}</p>
          <p v-if="c.description" class="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-600">{{ c.description }}</p>
          <p class="mt-3 text-xs font-medium accent-text">View case →</p>
        </RouterLink>
      </div>

      <p v-if="!catalogLoading && !state.user" class="mt-6 text-center text-sm text-zinc-600">
        <RouterLink to="/auth" class="accent-text underline-offset-2 transition-colors duration-200 hover:underline">Sign in</RouterLink>
        to open cases.
      </p>
    </div>

    <!-- ── Real CS2 Cases ────────────────────────────────────────────── -->
    <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6">
      <div class="mb-6 flex items-center gap-3">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-white">CS2 Cases</h2>
          <p class="mt-1 text-sm text-zinc-500">Real CS2 cases with their actual skins and real-money odds.</p>
        </div>
        <span class="ml-auto rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-orange-400">Real</span>
      </div>

      <!-- Loading -->
      <div v-if="cs2Loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-44 animate-pulse rounded-xl border border-white/5 bg-white/5" />
      </div>

      <!-- Cases grid -->
      <div
        v-else-if="cs2CasesList.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        role="list"
        aria-label="CS2 Cases"
      >
        <RouterLink
          v-for="(c, index) in cs2CasesList"
          :key="c.id"
          :to="{ name: 'caseDetail', params: { caseId: c.id } }"
          class="case-grid-card block rounded-xl border border-l-[3px] border-white/10 bg-white/3 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-white/25 border-l-orange-400/70"
          :style="{ '--stagger': index }"
        >
          <div class="flex items-start gap-3">
            <img
              v-if="c.image"
              :src="c.image"
              :alt="c.name"
              class="h-16 w-16 shrink-0 rounded-lg object-contain bg-white/5 p-1"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-base font-semibold text-white">{{ c.name }}</p>
              <p class="mt-0.5 text-sm text-zinc-500">${{ Number(c.cost).toFixed(2) }}</p>
              <p v-if="c.description" class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-600">{{ c.description }}</p>
            </div>
          </div>
          <p class="mt-3 text-xs font-medium text-orange-400">View case →</p>
        </RouterLink>
      </div>

      <!-- Failed to load -->
      <p v-else-if="!cs2Loading" class="text-sm text-zinc-600">
        Could not load CS2 cases. Check your connection.
      </p>

      <p v-if="!cs2Loading && !state.user" class="mt-6 text-center text-sm text-zinc-600">
        <RouterLink to="/auth" class="accent-text underline-offset-2 transition-colors duration-200 hover:underline">Sign in</RouterLink>
        to open cases.
      </p>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  caseCardAccentBorder,
  casesList,
  cs2CasesList,
  ensureCaseCatalog,
  ensureCs2Cases,
} from "../lib/caseCatalog";
import { useUserState } from "../lib/userState";

const { state } = useUserState();

const catalogLoading = ref(true);
const cs2Loading = ref(true);

onMounted(async () => {
  await Promise.all([
    ensureCaseCatalog().finally(() => { catalogLoading.value = false; }),
    ensureCs2Cases().finally(() => { cs2Loading.value = false; }),
  ]);
});
</script>

<style scoped>
.case-grid-card {
  animation: case-card-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--stagger, 0) * 55ms);
}

@keyframes case-card-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
