<template>
  <div class="min-h-screen flex flex-col">
    <!-- NAV -->
    <header
      class="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl transition-shadow duration-300"
      :class="{ 'shadow-lg shadow-black/20': headerScrolled }"
    >
      <div class="nav-glow-line absolute inset-x-0 bottom-0 h-px opacity-70" aria-hidden="true" />
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg accent-bg accent-shadow shadow-lg transition-all duration-200 group-hover:scale-105"
          >
            <svg
              class="h-4 w-4 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span class="text-sm font-bold tracking-widest uppercase text-white">
            Case<span class="accent-text">Strike</span>
          </span>
        </RouterLink>

        <!-- Balance -->
        <div
          class="hidden min-w-0 flex-1 items-center justify-center px-2 sm:flex"
          aria-live="polite"
        >
          <div
            class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors duration-200"
          >
            <span class="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Balance</span>
            <span class="text-sm font-bold tabular-nums text-white">{{ balanceDisplay }}</span>
          </div>
        </div>

        <!-- Nav right -->
        <nav class="flex shrink-0 items-center gap-1 text-sm">
          <span
            class="mr-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold tabular-nums text-white sm:hidden"
            aria-label="Balance"
          >{{ balanceDisplay }}</span>
          <RouterLink
            to="/"
            class="rounded-lg px-3 py-1.5 text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white hover:scale-[1.02]"
            active-class="!text-white bg-white/5"
          >
            Open Case
          </RouterLink>

          <a
            href="https://github.com/unlicenced-chiropractor/CS2-Case-Opening"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg p-1.5 text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white hover:scale-[1.02]"
            aria-label="View on GitHub"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.620.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.270 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
          </a>

          <!-- Guest: Sign In button -->
          <RouterLink
            v-if="!state.user"
            to="/auth"
            class="ml-1 rounded-lg border accent-border accent-soft-bg px-4 py-1.5 text-sm font-semibold accent-text transition-all duration-200 hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.45)] focus:ring-offset-2 focus:ring-offset-black"
          >
            Sign In
          </RouterLink>

          <!-- Logged in: Account dropdown -->
          <div v-else class="relative ml-1" ref="dropdownRoot">
            <button
              class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 pl-3 pr-2.5 py-1.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:bg-white/10 hover:text-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.4)] focus:ring-offset-2 focus:ring-offset-black"
              @click="toggleDropdown"
            >
              <span
                class="flex h-5 w-5 items-center justify-center rounded-full accent-bg text-[10px] font-bold text-black"
              >
                {{ avatarLetter }}
              </span>
              <span class="max-w-[120px] truncate text-xs">{{ state.user.email }}</span>
              <svg
                class="h-3.5 w-3.5 text-zinc-500 transition-transform duration-200"
                :class="dropdownOpen ? 'rotate-180' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-white/8 bg-[#111] shadow-2xl shadow-black/60"
              >
                <div class="border-b border-white/6 px-4 py-3">
                  <p class="text-[11px] uppercase tracking-widest text-zinc-500">Signed in as</p>
                  <p class="mt-0.5 truncate text-sm font-semibold text-white">{{ state.user.email }}</p>
                </div>

                <div class="flex items-center justify-between border-b border-white/6 px-4 py-3">
                  <span class="text-xs text-zinc-500">Balance</span>
                  <span class="text-sm font-bold accent-text">${{ balance.toFixed(2) }}</span>
                </div>

                <div v-if="state.user?.isAdmin" class="border-b border-white/6 px-4 py-3">
                  <RouterLink
                    to="/admin"
                    class="block rounded-lg border border-emerald-400/40 bg-emerald-950/30 px-3 py-2 text-sm font-semibold text-emerald-300 transition-all duration-200 hover:bg-emerald-900/40 hover:scale-[1.02]"
                    @click="closeDropdown"
                  >
                    Open Admin Panel
                  </RouterLink>
                </div>

                <div class="p-1.5">
                  <RouterLink
                    to="/settings"
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                    @click="closeDropdown"
                  >
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                      />
                    </svg>
                    Account settings
                  </RouterLink>
                  <button
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                    @click="handleSignOut"
                  >
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
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
      <RouterView v-slot="{ Component, route: viewRoute }">
        <Transition :name="String(viewRoute.meta.transition || 'page')" mode="out-in">
          <component :is="Component" :key="viewRoute.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <!-- FOOTER -->
    <footer class="border-t border-white/5 py-4 text-center text-xs text-zinc-600">
      CaseStrike — Virtual credits only. Not affiliated with Valve or CS2.
      <span class="ml-2 opacity-50">v{{ appVersion }}</span>
    </footer>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUserState } from "./lib/userState";

const appVersion = __APP_VERSION__;

const { state, initAuth, signOutUser } = useUserState();

const dropdownOpen = ref(false);
const dropdownRoot = ref(null);
const headerScrolled = ref(false);

const avatarLetter = computed(() => {
  const email = state.user?.email ?? "";
  return email.charAt(0).toUpperCase() || "?";
});

const balance = computed(() => Number(state.profile?.balance ?? 0));

const balanceDisplay = computed(() => {
  if (!state.user) return "—";
  return `$${balance.value.toFixed(2)}`;
});

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

function onScroll() {
  headerScrolled.value = window.scrollY > 8;
}

onMounted(() => {
  initAuth();
  document.addEventListener("mousedown", onClickOutside);
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
  window.removeEventListener("scroll", onScroll);
});
</script>
