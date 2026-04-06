<template>
  <div class="relative min-h-[72vh] overflow-x-hidden pb-12">
    <!-- Full-viewport-width glow layer (main is max-w-6xl; this breaks out to screen edges) -->
    <div
      class="pointer-events-none absolute top-0 bottom-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -left-[10%] top-[-5%] h-[min(28rem,55vh)] w-[min(55vw,28rem)] rounded-full bg-[var(--cs-accent-glow)] blur-[120px] opacity-60 animate-pulse-glow"
      />
      <div
        class="absolute -right-[8%] top-[20%] h-[min(22rem,45vh)] w-[min(50vw,24rem)] rounded-full bg-[var(--cs-accent-soft)] blur-[100px] opacity-45 animate-float-slow"
      />
      <div
        class="absolute left-1/2 top-0 h-48 w-[min(90vw,64rem)] -translate-x-1/2 rounded-full bg-[var(--cs-accent-glow)] blur-[100px] opacity-25"
      />
    </div>

    <div class="relative z-10 mx-auto max-w-2xl space-y-10">
      <!-- Header -->
      <header class="stagger-children text-center">
        <p class="text-[11px] font-semibold uppercase tracking-[0.25em] accent-text-500" style="--stagger: 0">
          Account
        </p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl" style="--stagger: 1">
          Settings
        </h1>
        <p class="mx-auto mt-2 max-w-md text-sm text-zinc-500" style="--stagger: 2">
          Tune your accent theme and manage your account. Changes apply instantly across the app.
        </p>
      </header>

      <!-- Themes -->
      <section
        class="stagger-children rounded-2xl border border-white/8 bg-[#0d0d0d]/90 p-6 shadow-xl shadow-black/40 backdrop-blur-sm md:p-8"
        style="--stagger: 3"
      >
        <div class="mb-5 flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl accent-bg text-black shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Themes</h2>
            <p class="text-xs text-zinc-500">Accent colors for buttons, glows, and highlights</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="(t, i) in THEMES"
            :key="t.id"
            type="button"
            class="theme-card-shimmer group relative flex flex-col rounded-xl border border-white/10 bg-black/30 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-[var(--cs-accent-border)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d0d0d]"
            :class="[
              selectedId === t.id
                ? 'border-[var(--cs-accent-border)] accent-soft-bg shadow-lg ring-1 ring-[var(--cs-accent-border)]'
                : 'hover:bg-white/[0.04]',
            ]"
            :style="{ '--preview': previewVar(t.id), animationDelay: `${80 + i * 45}ms` }"
            @click="pickTheme(t.id)"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <span
                class="h-3 w-3 rounded-full shadow-md ring-2 ring-white/10 transition-transform duration-200 group-hover:scale-125"
                :style="{ background: previewVar(t.id) }"
              />
              <Transition name="pop">
                <span
                  v-if="selectedId === t.id"
                  class="rounded-full accent-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black"
                >
                  Active
                </span>
              </Transition>
            </div>
            <span class="font-semibold text-white">{{ t.label }}</span>
            <span class="mt-1 text-xs text-zinc-500">{{ t.desc }}</span>
          </button>
        </div>
      </section>

      <!-- Delete account -->
      <section
        class="stagger-children rounded-2xl border border-rose-500/25 bg-rose-950/10 p-6 md:p-8"
        style="--stagger: 4"
      >
        <div class="mb-4 flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Delete account</h2>
            <p class="text-xs text-zinc-500">Permanently remove your profile, balance, and inventory</p>
          </div>
        </div>
        <p class="mb-4 text-sm leading-relaxed text-zinc-400">
          This cannot be undone. You will lose all virtual credits and items. If you only want to leave temporarily, use
          <strong class="text-zinc-300">Sign out</strong> from the menu instead.
        </p>
        <button
          type="button"
          class="rounded-lg border border-rose-500/50 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition-all duration-200 hover:scale-[1.02] hover:bg-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          @click="deleteOpen = true"
        >
          Delete my account…
        </button>
      </section>

      <p class="text-center text-xs text-zinc-600">
        <RouterLink to="/" class="accent-text transition-colors duration-200 hover:underline">← Back to CaseStrike</RouterLink>
      </p>
    </div>

    <!-- Delete modal -->
    <Teleport to="body">
      <Transition name="modal-backdrop">
        <div
          v-if="deleteOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          @click.self="closeDeleteModal"
        >
          <Transition name="modal-panel">
            <div
              v-if="deleteOpen"
              class="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#111] p-6 shadow-2xl shadow-rose-950/40"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
            >
              <h3 id="delete-title" class="text-lg font-bold text-white">Delete account?</h3>
              <p class="mt-2 text-sm text-zinc-400">
                Type <kbd class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-rose-300">DELETE</kbd>
                below to confirm. Your session will end immediately.
              </p>
              <input
                v-model="deleteConfirm"
                type="text"
                autocomplete="off"
                placeholder="DELETE"
                class="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/30"
              />
              <p v-if="deleteError" class="mt-2 text-xs text-rose-400">{{ deleteError }}</p>
              <div class="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-all duration-200 hover:bg-white/5"
                  @click="closeDeleteModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="rounded-lg border border-rose-500/50 bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="deleteConfirm !== 'DELETE' || deleteLoading"
                  @click="runDelete"
                >
                  {{ deleteLoading ? "Deleting…" : "Delete forever" }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { THEMES, applyTheme, getStoredThemeId } from "../lib/theme";
import { useUserState } from "../lib/userState";

const router = useRouter();
const { deleteAccount } = useUserState();

const selectedId = ref(getStoredThemeId());
const deleteOpen = ref(false);
const deleteConfirm = ref("");
const deleteError = ref("");
const deleteLoading = ref(false);

const previewColors = {
  amber: "#f59e0b",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  emerald: "#10b981",
  rose: "#f43f5e",
};

function previewVar(id) {
  return previewColors[id] ?? previewColors.amber;
}

function pickTheme(id) {
  selectedId.value = id;
  applyTheme(id);
}

function closeDeleteModal() {
  deleteOpen.value = false;
  deleteConfirm.value = "";
  deleteError.value = "";
}

watch(deleteOpen, (open) => {
  if (!open) deleteConfirm.value = "";
});

async function runDelete() {
  if (deleteConfirm.value !== "DELETE") return;
  deleteError.value = "";
  deleteLoading.value = true;
  try {
    await deleteAccount();
    closeDeleteModal();
    router.replace("/");
  } catch (e) {
    deleteError.value = e?.message || "Could not delete account.";
  } finally {
    deleteLoading.value = false;
  }
}
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.2s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
