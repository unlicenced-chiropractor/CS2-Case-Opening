<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Card -->
      <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-8 shadow-2xl shadow-black/60">

        <!-- Logo / heading -->
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl accent-bg accent-shadow shadow-lg animate-float-slow">
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
              ? 'accent-bg text-black accent-shadow shadow'
              : 'text-zinc-500 hover:text-zinc-300'"
            @click="mode = 'login'; clearMessages(); emailDirty = false"
          >
            Sign In
          </button>
          <button
            class="rounded-lg py-2 text-sm font-semibold transition-all"
            :class="mode === 'register'
              ? 'accent-bg text-black accent-shadow shadow'
              : 'text-zinc-500 hover:text-zinc-300'"
            @click="mode = 'register'; clearMessages(); emailDirty = false"
          >
            Register
          </button>
        </div>

        <!-- Form -->
        <form class="space-y-3" @submit.prevent="submitAuth">
          <!-- Email -->
          <div class="group relative">
            <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg
                class="h-4 w-4 transition-colors"
                :class="emailDirty && !emailValid ? 'text-rose-500' : 'text-zinc-600 group-focus-within:text-[var(--cs-accent)]'"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <input
              v-model="email"
              type="text"
              placeholder="Email address"
              autocomplete="email"
              class="w-full rounded-xl border bg-black/40 py-3 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:bg-black/60 focus:ring-1"
              :class="emailDirty && !emailValid
                ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/20'
                : 'border-white/8 focus:border-[var(--cs-accent-border)] focus:ring-[rgb(var(--cs-ring)/0.2)]'"
              @blur="emailDirty = true"
            />
            <!-- Valid tick -->
            <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg v-if="emailDirty && emailValid" class="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              <svg v-else-if="emailDirty && !emailValid" class="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
          </div>
          <!-- Inline email error -->
          <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
            <p v-if="emailDirty && !emailValid" class="text-[11px] text-rose-400 pl-1">
              Please enter a valid email address.
            </p>
          </Transition>

          <!-- Password -->
          <div class="group relative">
            <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg class="h-4 w-4 text-zinc-600 transition-colors group-focus-within:text-[var(--cs-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              class="w-full rounded-xl border border-white/8 bg-black/40 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-[var(--cs-accent-border)] focus:bg-black/60 focus:ring-1 focus:ring-[rgb(var(--cs-ring)/0.2)]"
            />
          </div>

          <p v-if="mode === 'register'" class="text-[11px] text-zinc-600">
            Password must be at least 6 characters.
          </p>

          <!-- Submit -->
          <button
            type="submit"
            class="mt-2 w-full rounded-xl accent-bg py-3 text-sm font-bold uppercase tracking-widest text-black accent-shadow shadow-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--cs-ring)/0.45)] focus:ring-offset-2 focus:ring-offset-[#0d0d0d]"
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
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserState } from "../lib/userState";

const { register, login, state } = useUserState();
const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const mode = ref("login");
const successMessage = ref("");
const emailDirty = ref(false);

// RFC-5321-inspired regex: local@domain.tld — covers all realistic addresses
// without being overly strict.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const emailValid = computed(() => EMAIL_RE.test(email.value.trim()));

function clearMessages() {
  successMessage.value = "";
  state.error = "";
}

async function submitAuth() {
  clearMessages();
  emailDirty.value = true;

  if (!email.value.trim() || !password.value.trim()) {
    state.error = "Email and password are required.";
    return;
  }

  if (!emailValid.value) {
    state.error = "Please enter a valid email address.";
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

  const raw = route.query.redirect;
  const redirect =
    typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  setTimeout(() => router.push(redirect), 350);
}
</script>
