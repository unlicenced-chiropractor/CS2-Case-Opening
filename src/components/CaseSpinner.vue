<template>
  <div class="relative select-none">
    <div
      class="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d0d]"
      style="height: 160px;"
    >
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent"></div>

      <div class="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
        <div class="cs-spin-needle-b h-0 w-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent"></div>
        <div class="cs-spin-needle-bar w-[2px] flex-1"></div>
        <div class="cs-spin-needle-t h-0 w-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent"></div>
      </div>

      <div class="absolute inset-y-0 flex items-center" style="left: 12px;">
        <div ref="trackEl" class="flex gap-2" style="will-change: transform;">
          <div
            v-for="(item, idx) in feed"
            :key="idx"
            class="relative shrink-0 overflow-hidden rounded-xl border bg-gradient-to-b from-[#0a0a0a] to-[#111]"
            :class="rarityBorder(item.rarity)"
            style="width:152px; height:136px;"
          >
            <div class="absolute inset-x-0 top-0 h-[2px]" :class="rarityBarBg(item.rarity)"></div>
            <img
              :src="renderIcon(item.icon)"
              :alt="item.name"
              class="mx-auto mt-3 h-[80px] w-[130px] object-contain drop-shadow-lg"
              loading="lazy"
              @error="onImageError"
            />
            <div class="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5">
              <p class="truncate text-[11px] font-semibold text-white leading-tight">{{ item.name }}</p>
              <p class="text-[10px] leading-tight" :class="rarityLabel(item.rarity)">{{ item.rarity }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { RARITY_STYLES } from '../data/skins';

const props = defineProps({
  feed:        { type: Array,   required: true },
  targetIndex: { type: Number,  required: true },
  spinning:    { type: Boolean, required: true },
});

const ITEM_W = 160;
const VIEWPORT_CENTER = 400;
const SPIN_DURATION = 7800;

const trackEl = ref(null);

const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%230d0d0d'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%2352525b' font-family='Arial' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function applyTransform(x, animated) {
  const el = trackEl.value;
  if (!el) return;
  if (animated) {
    el.style.transition = 'transform ' + SPIN_DURATION + 'ms cubic-bezier(0.05,0.85,0.30,1.00)';
  } else {
    el.style.transition = 'none';
  }
  el.style.transform = 'translateX(' + x + 'px)';
}

watch(
  () => props.spinning,
  async (isSpinning) => {
    if (!isSpinning) return;

    // 1) Wait for Vue to finish rendering the new feed into the DOM
    await nextTick();

    // 2) Snap the track to just off the right edge — no transition
    applyTransform(200, false);

    // 3) Force the browser to paint that position, then start the animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targetX = -(props.targetIndex * ITEM_W) + VIEWPORT_CENTER;
        applyTransform(targetX, true);
      });
    });
  }
);

function rarityBorder(r) { return RARITY_STYLES[r]?.border ?? 'border-zinc-700/40'; }
function rarityLabel(r)  { return RARITY_STYLES[r]?.label  ?? 'text-zinc-500'; }
function rarityBarBg(r) {
  const map = {
    'Mil-Spec':    'bg-sky-500',
    'Restricted':  'bg-violet-500',
    'Classified':  'bg-pink-500',
    'Covert':      'bg-red-500',
    'Rare Special':'bg-amber-400',
  };
  return map[r] ?? 'bg-zinc-600';
}

function renderIcon(iconUrl) {
  if (!iconUrl) return FALLBACK_ICON;
  if (String(iconUrl).startsWith('http')) return iconUrl;
  return iconUrl;
}

function onImageError(e) { e.target.src = FALLBACK_ICON; }
</script>
