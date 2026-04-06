<template>
  <section class="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-900/80 p-6">
    <h1 class="text-xl font-semibold text-white">Sign In / Register</h1>
    <p class="mt-2 text-sm text-slate-400">Demo-only account system with Cloudflare D1 auth.</p>

    <form class="mt-6 space-y-3" @submit.prevent>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
      <div class="flex gap-3">
        <button
          class="rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400"
          @click="registerUser"
        >
          Register
        </button>
        <button
          class="rounded bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600"
          @click="loginUser"
        >
          Sign In
        </button>
      </div>
    </form>
    <p v-if="state.error" class="mt-3 text-sm text-rose-400">{{ state.error }}</p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useUserState } from "../lib/userState";

const { register, login, state } = useUserState();
const email = ref("");
const password = ref("");

function registerUser() {
  register(email.value, password.value);
}

function loginUser() {
  login(email.value, password.value);
}
</script>
