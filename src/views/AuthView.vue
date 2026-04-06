<template>
  <section class="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-900/80 p-6">
    <h1 class="text-xl font-semibold text-white">Account</h1>
    <p class="mt-2 text-sm text-slate-400">Sign in or create an account to open cases.</p>

    <div class="mt-5 grid grid-cols-2 rounded-lg border border-slate-700 bg-slate-800/60 p-1">
      <button
        class="rounded px-3 py-2 text-sm font-medium"
        :class="mode === 'login' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300 hover:text-white'"
        @click="mode = 'login'"
      >
        Sign In
      </button>
      <button
        class="rounded px-3 py-2 text-sm font-medium"
        :class="mode === 'register' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300 hover:text-white'"
        @click="mode = 'register'"
      >
        Create Account
      </button>
    </div>

    <form class="mt-6 space-y-3" @submit.prevent="submitAuth">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
        class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
      <p class="text-xs text-slate-500">
        {{ mode === "register" ? "Password must be at least 6 characters." : "Use your account credentials." }}
      </p>
      <button
        type="submit"
        class="w-full rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="state.loading"
      >
        {{ state.loading ? "Please wait..." : mode === "register" ? "Create Account" : "Sign In" }}
      </button>
    </form>
    <p v-if="successMessage" class="mt-3 text-sm text-emerald-400">{{ successMessage }}</p>
    <p v-if="state.error" class="mt-3 text-sm text-rose-400">{{ state.error }}</p>
  </section>
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

async function submitAuth() {
  state.error = "";
  successMessage.value = "";

  if (!email.value.trim() || !password.value.trim()) {
    state.error = "Email and password are required.";
    return;
  }

  const ok =
    mode.value === "register"
      ? await register(email.value, password.value)
      : await login(email.value, password.value);

  if (!ok) return;

  successMessage.value = mode.value === "register" ? "Account created. Redirecting..." : "Signed in. Redirecting...";
  setTimeout(() => {
    router.push("/");
  }, 350);
}
</script>
