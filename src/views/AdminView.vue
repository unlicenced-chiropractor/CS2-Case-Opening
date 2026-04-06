<template>
  <section class="space-y-6">
    <div class="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-white">Admin: User Roles</h1>
          <p class="mt-1 text-xs text-zinc-500">Toggle user admin access for 0 (no admin) and 1 (admin).</p>
        </div>
        <RouterLink
          to="/"
          class="rounded-lg border border-zinc-700/50 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition-all hover:bg-white/10"
        >
          Back
        </RouterLink>
      </div>

      <div v-if="error" class="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-400">
        {{ error }}
      </div>

      <div v-if="notice" class="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-400">
        {{ notice }}
      </div>

      <div v-if="loading" class="mt-4 text-sm text-zinc-500">
        Loading users...
      </div>

      <div v-else>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-xs uppercase tracking-wide text-zinc-500">
                <th class="px-3 py-2">Email</th>
                <th class="px-3 py-2">Created</th>
                <th class="px-3 py-2">Admin</th>
                <th class="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in users"
                :key="row.id"
                class="border-t border-white/5"
              >
                <td class="px-3 py-2">
                  <p class="font-semibold text-zinc-100">{{ row.email }}</p>
                  <p class="text-[11px] text-zinc-500">{{ row.id }}</p>
                </td>
                <td class="px-3 py-2 text-zinc-500">
                  {{ row.createdAt ? new Date(row.createdAt).toLocaleString() : "—" }}
                </td>
                <td class="px-3 py-2">
                  <span
                    class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    :class="row.isAdmin ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-500/20 text-zinc-400'"
                  >
                    {{ row.isAdmin ? '1' : '0' }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <div class="flex gap-2">
                    <button
                      class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-50"
                      :disabled="row.id === state.user?.id || updating[row.id]"
                      @click="setAdmin(row, 1)"
                    >
                      Set 1
                    </button>
                    <button
                      class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-50"
                      :disabled="row.id === state.user?.id || updating[row.id]"
                      @click="setAdmin(row, 0)"
                    >
                      Set 0
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="!users.length" class="mt-4 text-xs text-zinc-600">No users found.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { apiFetch } from '../lib/api';
import { useUserState } from '../lib/userState';

const { state } = useUserState();
const router = useRouter();

const users = ref([]);
const loading = ref(false);
const updating = ref({});
const notice = ref('');
const error = ref('');

const isAdmin = computed(() => Boolean(state.user?.isAdmin));

async function loadUsers() {
  if (!isAdmin.value) {
    error.value = 'Admin access required to use this page.';
    return;
  }

  loading.value = true;
  error.value = '';
  notice.value = '';

  try {
    const data = await apiFetch('/api/admin/users', { method: 'GET' });
    users.value = data.users || [];
  } catch (err) {
    error.value = err.message;
    users.value = [];
  } finally {
    loading.value = false;
  }
}

async function setAdmin(row, nextValue) {
  if (!isAdmin.value) {
    error.value = 'Admin access required to change roles.';
    return;
  }

  if (row.id === state.user?.id) {
    error.value = 'Cannot update your own admin role here.';
    return;
  }

  updating.value[row.id] = true;
  error.value = '';
  notice.value = '';

  try {
    const data = await apiFetch('/api/admin/set-admin', {
      method: 'POST',
      body: JSON.stringify({
        userId: row.id,
        isAdmin: nextValue,
      }),
    });

    const updated = data?.user;
    if (!updated) return;

    users.value = users.value.map((item) => (item.id === updated.id
      ? { ...item, isAdmin: Boolean(updated.isAdmin) }
      : item));

    notice.value = `Updated ${updated.email} to admin=${updated.isAdmin ? '1' : '0'}.`;

    if (state.user?.id === updated.id) {
      state.user.isAdmin = Boolean(updated.isAdmin);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    updating.value[row.id] = false;
  }
}

onMounted(() => {
  if (!state.user?.isAdmin) {
    router.push('/');
    return;
  }

  loadUsers();
});
</script>