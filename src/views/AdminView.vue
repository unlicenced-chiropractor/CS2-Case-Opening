<template>
  <section class="space-y-6">
    <div class="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs uppercase tracking-wide text-amber-400">Admin Control</p>
          <h1 class="text-xl font-bold text-white">User Administration</h1>
          <p class="mt-1 text-xs text-zinc-400">
            Search users, adjust balances, toggle admin access, issue/reset password links, and remove accounts.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/10"
            :disabled="loading"
            @click="loadUsers"
          >
            {{ loading ? 'Refreshing…' : 'Refresh' }}
          </button>
          <RouterLink
            to="/"
            class="rounded-lg border border-zinc-700/50 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition-all hover:bg-white/10"
          >
            Back
          </RouterLink>
        </div>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-3">
        <label class="rounded-xl border border-white/8 bg-black/40 p-3 text-sm">
          <span class="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Search</span>
          <input
            v-model="query"
            type="text"
            placeholder="Email or user id"
            class="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-amber-400/60"
            @input="clearFeedback"
          />
        </label>
        <label class="rounded-xl border border-white/8 bg-black/40 p-3 text-sm">
          <span class="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Filter</span>
          <select
            v-model="filterMode"
            class="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="all">All users</option>
            <option value="admins">Admins only</option>
            <option value="non-admins">Non-admins only</option>
          </select>
        </label>
        <label class="rounded-xl border border-white/8 bg-black/40 p-3 text-sm">
          <span class="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Generated reset links</span>
          <div class="text-sm text-zinc-300">{{ activeResetLinks.length }} active</div>
          <p class="mt-1 text-xs text-zinc-500">Use Refresh to load latest rows.</p>
        </label>
      </div>

      <div v-if="error" class="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-400">
        {{ error }}
      </div>
      <div v-if="notice" class="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-400">
        {{ notice }}
      </div>

      <div class="mt-6 overflow-x-auto rounded-xl border border-white/8">
        <table class="w-full text-left text-sm">
          <thead class="bg-white/5 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th class="px-3 py-2">Email</th>
              <th class="px-3 py-2">Balance</th>
              <th class="px-3 py-2">Last login</th>
              <th class="px-3 py-2">Admin</th>
              <th class="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in filteredUsers"
              :key="row.id"
              class="border-t border-white/5"
            >
              <td class="px-3 py-2">
                <p class="truncate font-semibold text-zinc-100">{{ row.email }}</p>
                <p class="text-[11px] text-zinc-500">{{ row.id }}</p>
              </td>
              <td class="px-3 py-2 text-zinc-100">
                <span class="font-semibold">${{ Number(row.balance ?? 0).toFixed(2) }}</span>
              </td>
              <td class="px-3 py-2 text-zinc-500">
                {{ row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'Never' }}
              </td>
              <td class="px-3 py-2">
                <button
                  class="rounded-full px-2.5 py-1 text-xs font-semibold transition-all"
                  :class="row.isAdmin ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-500/20 text-zinc-400'"
                  :disabled="row.id === state.user?.id || updating[row.id]"
                  @click="setAdmin(row, row.isAdmin ? 0 : 1)"
                >
                  {{ row.isAdmin ? 'Admin' : 'No admin' }}
                </button>
              </td>
              <td class="px-3 py-2">
                <div class="flex flex-wrap gap-2">
                  <label class="flex items-center gap-1">
                    <input
                      v-model="balanceInputs[row.id]"
                      type="number"
                      step="0.01"
                      min="-1000000"
                      class="h-8 w-24 rounded-lg border border-white/10 bg-black/40 px-2 text-xs text-white"
                    />
                    <button
                      class="rounded-lg border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300 transition-all"
                      :disabled="updating[row.id]"
                      @click="saveBalance(row)"
                    >
                      Save
                    </button>
                  </label>

                  <button
                    class="rounded-lg border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-xs font-semibold text-blue-200 transition-all"
                    :disabled="updating[row.id]"
                    @click="createResetLink(row)"
                  >
                    Reset link
                  </button>

                  <button
                    class="rounded-lg border border-rose-400/40 bg-rose-400/10 px-2 py-1 text-xs font-semibold text-rose-200 transition-all"
                    :disabled="row.id === state.user?.id || updating[row.id]"
                    @click="removeUser(row)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="!filteredUsers.length" class="px-3 py-3 text-xs text-zinc-600">
          No matching users.
        </p>
      </div>
    </div>

    <div class="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-300">Password reset links</h2>
        <button
          class="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition-all"
          :disabled="loadingLinks"
          @click="loadResetLinks"
        >
          {{ loadingLinks ? 'Loading…' : 'Refresh links' }}
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-white/8">
        <table class="w-full text-left text-sm">
          <thead class="bg-white/5 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th class="px-3 py-2">Email</th>
              <th class="px-3 py-2">Status</th>
              <th class="px-3 py-2">Expires</th>
              <th class="px-3 py-2">Created</th>
              <th class="px-3 py-2">Token</th>
              <th class="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in resetLinks" :key="row.token" class="border-t border-white/5">
              <td class="px-3 py-2">
                <p class="font-semibold text-zinc-100">{{ row.email }}</p>
                <p class="text-[11px] text-zinc-500">{{ row.userId }}</p>
              </td>
              <td class="px-3 py-2">
                <span :class="row.isActive ? 'text-emerald-300' : 'text-zinc-500'" class="text-xs font-medium">
                  {{ row.isActive ? 'Active' : 'Expired/Used/Revoked' }}
                </span>
              </td>
              <td class="px-3 py-2 text-zinc-500">
                {{ new Date(row.expiresAt).toLocaleString() }}
              </td>
              <td class="px-3 py-2 text-zinc-500">
                {{ new Date(row.createdAt).toLocaleString() }}
              </td>
              <td class="max-w-[280px] truncate px-3 py-2 font-mono text-[11px] text-zinc-400">
                {{ row.token }}
              </td>
              <td class="px-3 py-2">
                <div class="flex gap-2">
                  <button
                    class="rounded-lg border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300 transition-all"
                    :disabled="!row.isActive"
                    @click="copyResetLink(row)"
                  >
                    Copy
                  </button>
                  <button
                    class="rounded-lg border border-rose-400/40 bg-rose-400/10 px-2 py-1 text-xs font-semibold text-rose-300 transition-all"
                    @click="revokeResetLink(row)"
                  >
                    Revoke
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!resetLinks.length" class="mt-3 text-xs text-zinc-600">No reset links found.</p>
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
const loadingLinks = ref(false);
const updating = ref({});
const balanceInputs = ref({});
const resetLinks = ref([]);
const query = ref('');
const filterMode = ref('all');
const notice = ref('');
const error = ref('');

const isAdmin = computed(() => Boolean(state.user?.isAdmin));

const filteredUsers = computed(() => {
  const mode = filterMode.value;
  const needle = query.value.trim().toLowerCase();

  return users.value.filter((row) => {
    if (mode === 'admins' && !row.isAdmin) return false;
    if (mode === 'non-admins' && row.isAdmin) return false;

    if (!needle) return true;

    return (
      row.email.toLowerCase().includes(needle)
      || row.id.toLowerCase().includes(needle)
    );
  });
});

const activeResetLinks = computed(() => resetLinks.value.filter((row) => row.isActive));

function clearFeedback() {
  error.value = '';
  notice.value = '';
}

async function loadUsers() {
  if (!isAdmin.value) {
    error.value = 'Admin access required to use this page.';
    return;
  }

  loading.value = true;
  clearFeedback();

  try {
    const data = await apiFetch('/api/admin/users', { method: 'GET' });
    users.value = data.users || [];

    const initial = {};
    for (const row of users.value) {
      initial[row.id] = Number(row.balance ?? 0);
    }
    balanceInputs.value = initial;

    await loadResetLinks();
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
    error.value = 'Cannot update your own admin role.';
    return;
  }

  updating.value[row.id] = true;
  clearFeedback();

  try {
    const data = await apiFetch('/api/admin/set-admin', {
      method: 'POST',
      body: JSON.stringify({
        userId: row.id,
        isAdmin: nextValue,
      }),
    });

    if (!data?.user?.id) return;
    users.value = users.value.map((item) => (item.id === data.user.id
      ? { ...item, isAdmin: Boolean(data.user.isAdmin) }
      : item));

    notice.value = `Updated ${data.user.email}: admin ${data.user.isAdmin ? 'enabled' : 'revoked'}.`;
  } catch (err) {
    error.value = err.message;
  } finally {
    updating.value[row.id] = false;
  }
}

async function saveBalance(row) {
  if (!isAdmin.value) {
    error.value = 'Admin access required to update balance.';
    return;
  }

  if (row.id === state.user?.id && Number(balanceInputs.value[row.id]) < 0) {
    error.value = 'Cannot set your own balance below 0.';
    return;
  }

  const nextBalance = Number(balanceInputs.value[row.id]);
  if (!Number.isFinite(nextBalance)) {
    error.value = 'Balance must be a valid number.';
    return;
  }

  updating.value[row.id] = true;
  clearFeedback();

  try {
    const data = await apiFetch('/api/admin/update-balance', {
      method: 'POST',
      body: JSON.stringify({
        userId: row.id,
        balance: nextBalance,
      }),
    });

    if (!data?.user?.id) return;
    users.value = users.value.map((item) => (item.id === data.user.id
      ? { ...item, ...data.user }
      : item));

    balanceInputs.value = {
      ...balanceInputs.value,
      [row.id]: data.user.balance,
    };
    notice.value = `Updated balance for ${data.user.email}.`;
  } catch (err) {
    error.value = err.message;
  } finally {
    updating.value[row.id] = false;
  }
}

async function removeUser(row) {
  if (!isAdmin.value) {
    error.value = 'Admin access required to delete users.';
    return;
  }

  if (!window.confirm(`Delete ${row.email}?`)) return;
  if (row.id === state.user?.id) {
    error.value = 'Cannot delete your own account.';
    return;
  }

  updating.value[row.id] = true;
  clearFeedback();

  try {
    await apiFetch('/api/admin/delete-user', {
      method: 'POST',
      body: JSON.stringify({ userId: row.id }),
    });

    users.value = users.value.filter((item) => item.id !== row.id);
    notice.value = `Deleted ${row.email}.`;
  } catch (err) {
    error.value = err.message;
  } finally {
    updating.value[row.id] = false;
  }
}

async function createResetLink(row) {
  if (!isAdmin.value) {
    error.value = 'Admin access required to generate reset link.';
    return;
  }

  updating.value[row.id] = true;
  clearFeedback();

  try {
    const data = await apiFetch('/api/admin/create-reset-link', {
      method: 'POST',
      body: JSON.stringify({ userId: row.id }),
    });

    notice.value = `Created reset link for ${row.email}.`;
    if (data?.resetLink) {
      await navigator.clipboard.writeText(data.resetLink).catch(() => {});
    }

    await loadResetLinks();
  } catch (err) {
    error.value = err.message;
  } finally {
    updating.value[row.id] = false;
  }
}

async function loadResetLinks() {
  if (!isAdmin.value) return;

  loadingLinks.value = true;
  clearFeedback();

  try {
    const data = await apiFetch('/api/admin/list-reset-links', { method: 'GET' });
    resetLinks.value = (data?.links || []).map((item) => ({
      ...item,
      isActive: Boolean(item.isActive),
      createdAt: Number(item.createdAt ?? 0),
      expiresAt: Number(item.expiresAt ?? 0),
    }));
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingLinks.value = false;
  }
}

async function revokeResetLink(row) {
  if (!isAdmin.value) return;

  try {
    await apiFetch('/api/admin/revoke-reset-link', {
      method: 'POST',
      body: JSON.stringify({ token: row.token }),
    });
    notice.value = `Revoked reset link ${row.token.slice(0, 8)}…`;
    await loadResetLinks();
  } catch (err) {
    error.value = err.message;
  }
}

async function copyResetLink(row) {
  const link = window.location.origin + '/reset-password?token=' + encodeURIComponent(row.token);
  try {
    await navigator.clipboard.writeText(link);
    notice.value = 'Reset link copied to clipboard.';
  } catch (_err) {
    notice.value = `Copy manually: ${link}`;
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