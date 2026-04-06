<template>
  <div class="min-h-screen">
    <header class="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="text-lg font-bold tracking-wide text-cyan-300">
          CaseStrike Demo
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink to="/" class="text-slate-200 hover:text-white">Open Case</RouterLink>
          <RouterLink v-if="!userState.user" to="/auth" class="text-slate-200 hover:text-white">
            Sign In
          </RouterLink>
          <button
            v-else
            class="rounded bg-slate-700 px-3 py-1 text-slate-100 hover:bg-slate-600"
            @click="userState.signOutUser"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUserState } from "./lib/userState";

const userState = useUserState();

onMounted(() => {
  userState.initAuth();
});
</script>
