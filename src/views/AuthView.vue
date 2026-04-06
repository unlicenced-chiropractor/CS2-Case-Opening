<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Card -->
      <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-8 shadow-2xl shadow-black/60">

        <!-- Logo / heading -->
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 shadow-lg shadow-amber-500/30">
            <svg class="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold text-white">{{ mode === "login" ? "Welcome back" : "Create account" }}</h1>
          <p class="mt-1 text-sm text-zinc-500">
            {{ mode === "login" ? "Sign in to open cases" : "Join to start opening cases" }}
          </p>
        </div>

        <!-- Tab toggle -->
        <div class="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-white/8 bg-black/40 p-1">
          <button
            class="rounded-lg py-2 text-sm font-semibold transition-all"
            :class="mode === 'login'
              ? 'bg-amber-400 text-black shadow shadow-amber-500/20'
              : 'text-zinc-500 hover:text-zinc-300'"
            @click="mode = 'login'; clearMessages()"
          >
            Sign In
          </button>
          <button
            class="rounded-lg py-2 text-sm font-semibold transition-all"
            :class="mode === 'register'
              ? 'bg-amber-400 text-black shadow shadow-amber-500/20'
              : 'text-zinc-500 hover:text-zinc-300'"
            @click="mode = 'register'; clearMessages()"
          >
            Register
          </button>
        </div>

        <!-- Form -->
        <form class="space-y-3" @submit.prevent="submitAuth">
          <!-- Email -->
          <div class="group relative">
            <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg class="h-4 w-4 text-zinc-600 group-focus-within:text-amber-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="Email address"
              autocomplete="email"
              class="w-full rounded-xl border border-white/8 bg-black/40 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-amber-400/60 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          <!-- Password -->
          <div class="group relative">
            <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg class="h-4 w-4 text-zinc-600 group-focus-within:text-amber-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              class="w-full rounded-xl border border-white/8 bg-black/40 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-amber-400/60 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          <p v-if="mode === 'register'" class="text-[11px] text-zinc-600">
            Password must be at least 6 characters.
          </p>

          <!-- Submit -->
          <button
            type="submit"
            class="mt-2 w-full rounded-xl bg-amber-400 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-300 hover:shadow-amber-400/30 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="state.loading"
          >
            <span v-if="!state.loading">{{ mode === "register" ? "Create Account" : "Sign In" }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Please wait...
            </span>
          </button>
        </form>

        <!-- Feedback messages -->
        <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
          <div v-if="successMessage" class="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-400">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            {{ successMessage }}
          </div>
        </Transition>

        <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
          <div v-if="state.error" class="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-400">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            {{ state.error }}
          </div>
        </Transition>
      </div>

      <!-- Bottom disclaimer -->
      <p class="mt-4 text-center text-[11px] text-zinc-700">
        Virtual credits only · No real-money gambling · Not affiliated with Valve
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserState } from "../lib/userState";

const { register, login, state } = useUserState();
const router = useRouter();
const email = ref("");
const password = ref("");
const mode = ref("login");
const successMessage = ref("");

function clearMessages() {
  successMessage.value = "";
  state.error = "";
}

async function submitAuth() {
  clearMessages();

  if (!email.value.trim() || !password.value.trim()) {
    state.error = "Email and password are required.";
    return;
  }

  const ok =
    mode.value === "register"
      ? await register(email.value, password.value)
      : await login(email.value, password.value);

  if (!ok) return;

  successMessage.value =
    mode.value === "register"
      ? "Account created! Redirecting..."
      : "Signed in! Redirecting...";

  setTimeout(() => router.push("/"), 350);
}
</script>
