<template>
  <div class="space-y-6">

    <!-- ── TAB BAR ──────────────────────────────────────────── -->
    <div class="flex items-end gap-1 border-b border-white/8">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200"
        :class="[
          activeTab === tab.id
            ? 'text-white'
            : tab.soon
              ? 'cursor-not-allowed text-zinc-700'
              : 'text-zinc-500 hover:text-zinc-300 hover:scale-[1.02]',
        ]"
        :disabled="tab.soon"
        @click="!tab.soon && (activeTab = tab.id)"
      >
        <!-- Icon -->
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="tab.icon"/>
        </svg>

        {{ tab.label }}

        <!-- Coming Soon badge -->
        <span
          v-if="tab.soon"
          class="rounded-full bg-white/5 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-zinc-600"
        >
          Soon
        </span>

        <!-- Active underline -->
        <span
          v-if="activeTab === tab.id"
          class="absolute inset-x-0 bottom-0 h-[2px] rounded-full accent-underline"
        ></span>
      </button>
    </div>

    <!-- ── TAB CONTENT ───────────────────────────────────────── -->
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <CaseOpenView  v-if="activeTab === 'open'"          key="open" />
      <InventoryView v-else-if="activeTab === 'inventory'" key="inventory" />
      <UpgradeView   v-else-if="activeTab === 'upgrade'"  key="upgrade" />
    </Transition>

  </div>
</template>

<script setup>
import { ref } from "vue";
import CaseOpenView  from "./CaseOpenView.vue";
import InventoryView from "./InventoryView.vue";
import UpgradeView   from "./UpgradeView.vue";

const activeTab = ref("open");

const tabs = [
  {
    id:    "open",
    label: "Case Opening",
    soon:  false,
    // box / package icon
    icon:  "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 3H8l-2 4h12l-2-4z",
  },
  {
    id:    "inventory",
    label: "Inventory",
    soon:  false,
    // grid / collection icon
    icon:  "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  },
  {
    id:    "upgrade",
    label: "Skin Upgrade",
    soon:  false,
    // arrow-up-circle icon
    icon:  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6V8m-4 4 4-4 4 4",
  },
  {
    id:    "battle",
    label: "Case Battle",
    soon:  true,
    // swords / zap icon
    icon:  "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    id:    "trade",
    label: "Trading",
    soon:  true,
    // arrows-left-right icon
    icon:  "M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4",
  },
];
</script>
