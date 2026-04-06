<template>
  <div class="min-h-screen flex flex-col">
    <!-- NAV -->
    <header class="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 shadow-lg shadow-amber-500/30 group-hover:shadow-amber-400/50 transition-shadow">
            <svg class="h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <span class="text-sm font-bold tracking-widest uppercase text-white">Case<span class="text-amber-400">Strike</span></span>
        </RouterLink>

        <!-- Nav right -->
        <nav class="flex items-center gap-1 text-sm">
          <RouterLink
            to="/"
            class="rounded-lg px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            active-class="text-white bg-white/5"
          >
            Open Case
          </RouterLink>

          <!-- Guest: Sign In button -->
          <RouterLink
            v-if="!state.user"
            to="/auth"
            class="ml-1 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold text-amber-400 hover:bg-amber-400/20 hover:border-amber-400/60 transition-all"
          >
            Sign In
          </RouterLink>

          <!-- Logged in: Account dropdown -->
          <div v-else class="relative ml-1" ref="dropdownRoot">
            <button
              class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 pl-3 pr-2.5 py-1.5 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:text-white transition-all"
              @click="toggleDropdown"
            >
              <!-- Avatar circle -->
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black">
                {{ avatarLetter }}
              </span>
              <span class="max-w-[120px] truncate text-xs">{{ state.user.email }}</span>
              <!-- Chevron -->
              <svg
                class="h-3.5 w-3.5 text-zinc-500 transition-transform duration-200"
                :class="dropdownOpen ? 'rotate-180' : ''"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <!-- Dropdown panel -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-white/8 bg-[#111] shadow-2xl shadow-black/60"
              >
                <!-- User info header -->
                <div class="border-b border-white/6 px-4 py-3">
                  <p class="text-[11px] text-zinc-500 uppercase tracking-widest">Signed in as</p>
                  <p class="mt-0.5 truncate text-sm font-semibold text-white">{{ state.user.email }}</p>
                </div>

                <!-- Balance row -->
                <div class="border-b border-white/6 px-4 py-3 flex items-center justify-between">
                  <span class="text-xs text-zinc-500">Balance</span>
                  <span class="text-sm font-bold text-amber-400">${{ balance.toFixed(2) }}</span>
                </div>

                <!-- Actions -->
                <div class="p-1.5">
                  <button
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    @click="handleSignOut"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </nav>
      </div>
    </header>

    <!-- MAIN -->
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="border-t border-white/5 py-4 text-center text-xs text-zinc-600">
      CaseStrike Demo — Virtual credits only. Not affiliated with Valve or CS2.
    </footer>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUserState } from "./lib/userState";

const { state, initAuth, signOutUser } = useUserState();

const dropdownOpen = ref(false);
const dropdownRoot = ref(null);

const avatarLetter = computed(() => {
  const email = state.user?.email ?? "";
  return email.charAt(0).toUpperCase() || "?";
});

const balance = computed(() => Number(state.profile?.balance ?? 0));

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
}

function handleSignOut() {
  closeDropdown();
  signOutUser();
}

function onClickOutside(event) {
  if (dropdownRoot.value && !dropdownRoot.value.contains(event.target)) {
    closeDropdown();
  }
}

onMounted(() => {
  initAuth();
  document.addEventListener("mousedown", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
