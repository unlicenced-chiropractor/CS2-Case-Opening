<template>
  <div class="space-y-3">
    <div class="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80 p-3">
      <div class="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-1 -translate-x-1/2 bg-cyan-300/80"></div>
      <div
        class="flex gap-2 transition-transform duration-[7800ms] ease-out"
        :style="{ transform: `translateX(${trackOffset}px)` }"
      >
        <div
          v-for="(item, idx) in feed"
          :key="`${item.name}-${idx}`"
          class="w-40 shrink-0 rounded-lg border bg-slate-800/70 p-2"
          :class="rarityClass(item.rarity)"
        >
          <img :src="item.icon" :alt="item.name" class="h-16 w-full rounded object-cover" />
          <p class="mt-2 truncate text-xs text-slate-100">{{ item.name }}</p>
          <p class="text-[11px] text-slate-400">{{ item.rarity }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { RARITY_COLORS } from "../data/skins";

const props = defineProps({
  feed: { type: Array, required: true },
  targetIndex: { type: Number, required: true },
  spinning: { type: Boolean, required: true },
});

const itemWidth = 168;
const trackOffset = ref(0);

const targetOffset = computed(() => {
  const centerAdjust = 420;
  return -props.targetIndex * itemWidth + centerAdjust;
});

watch(
  () => props.spinning,
  (isSpinning) => {
    if (isSpinning) {
      trackOffset.value = -50;
      requestAnimationFrame(() => {
        trackOffset.value = targetOffset.value;
      });
    }
  }
);

function rarityClass(rarity) {
  return RARITY_COLORS[rarity] ?? "border-slate-500";
}
</script>
