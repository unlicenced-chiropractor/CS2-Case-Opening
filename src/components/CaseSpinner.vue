<template>
  <div class="relative w-full select-none">
    <div
      ref="viewportRef"
      class="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d0d]"
      :style="{ height: layout.height + 'px' }"
    >
      <div
        class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent"
      ></div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent"
      ></div>

      <div
        class="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
      >
        <div
          class="h-0 w-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent cs-spin-needle-b"
        ></div>
        <div class="cs-spin-needle-bar w-[2px] flex-1"></div>
        <div
          class="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent cs-spin-needle-t"
        ></div>
      </div>

      <div class="absolute inset-y-0 flex items-center" style="left: 12px">
        <div ref="trackEl" class="flex gap-2" style="will-change: transform">
          <div
            v-for="(item, idx) in feed"
            :key="idx"
            class="relative shrink-0 overflow-hidden rounded-xl border bg-gradient-to-b from-[#0a0a0a] to-[#111]"
            :class="rarityBorder(item.rarity)"
            :style="{
              width: layout.cardW + 'px',
              height: layout.cardH + 'px',
            }"
          >
            <div class="absolute inset-x-0 top-0 h-[2px]" :class="rarityBarBg(item.rarity)"></div>
            <img
              :src="renderIcon(item.icon)"
              :alt="item.name"
              class="mx-auto mt-3 object-contain drop-shadow-lg"
              :style="{
                height: layout.imgH + 'px',
                width: layout.imgW + 'px',
              }"
              loading="lazy"
              @error="onImageError"
            />
            <div class="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5">
              <p class="truncate text-[11px] font-semibold leading-tight text-white">{{ item.name }}</p>
              <p class="text-[10px] leading-tight" :class="rarityLabel(item.rarity)">{{ item.rarity }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from "vue";
import { RARITY_STYLES } from "../data/skins";

const props = defineProps({
  feed: { type: Array, required: true },
  targetIndex: { type: Number, required: true },
  spinning: { type: Boolean, required: true },
  /** Taller strip + larger cards for fullscreen overlay */
  variant: { type: String, default: "default" },
});

const SPIN_DURATION = 7800;
const TRACK_LEFT = 12;
const GAP = 8;

const layouts = {
  default: { cardW: 152, cardH: 136, imgH: 80, imgW: 130, height: 160 },
  fullscreen: { cardW: 176, cardH: 158, imgH: 92, imgW: 150, height: 220 },
};

const layout = computed(() => layouts[props.variant === "fullscreen" ? "fullscreen" : "default"]);

const itemStride = computed(() => layout.value.cardW + GAP);

const trackEl = ref(null);
const viewportRef = ref(null);
const measuredCenter = ref(400);

function updateMeasure() {
  const el = viewportRef.value;
  if (!el) return;
  measuredCenter.value = Math.max(100, el.clientWidth / 2 - TRACK_LEFT);
}

function applyTransform(x, animated) {
  const el = trackEl.value;
  if (!el) return;
  if (animated) {
    el.style.transition = "transform " + SPIN_DURATION + "ms cubic-bezier(0.05,0.85,0.30,1.00)";
  } else {
    el.style.transition = "none";
  }
  el.style.transform = "translateX(" + x + "px)";
}

watch(
  () => props.spinning,
  async (isSpinning) => {
    if (!isSpinning) return;

    await nextTick();
    updateMeasure();

    applyTransform(200, false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targetX = -(props.targetIndex * itemStride.value) + measuredCenter.value;
        applyTransform(targetX, true);
      });
    });
  },
);

watch(
  () => [props.feed, layout.value.cardW],
  () => nextTick(updateMeasure),
);

onMounted(() => {
  nextTick(updateMeasure);
  window.addEventListener("resize", updateMeasure);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMeasure);
});

const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function rarityBorder(r) {
  return RARITY_STYLES[r]?.border ?? "border-zinc-700/40";
}
function rarityLabel(r) {
  return RARITY_STYLES[r]?.label ?? "text-zinc-500";
}
function rarityBarBg(r) {
  const map = {
    "Mil-Spec": "bg-sky-500",
    Restricted: "bg-violet-500",
    Classified: "bg-pink-500",
    Covert: "bg-red-500",
    "Rare Special": "bg-amber-400",
  };
  return map[r] ?? "bg-zinc-600";
}

function renderIcon(iconUrl) {
  if (!iconUrl) return FALLBACK_ICON;
  if (String(iconUrl).startsWith("http")) return iconUrl;
  return iconUrl;
}

function onImageError(e) {
  e.target.src = FALLBACK_ICON;
}
</script>
