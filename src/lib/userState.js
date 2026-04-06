import { reactive } from "vue";
import { apiFetch, setToken } from "./api";

const state = reactive({
  user: null,
  profile: null,
  loading: false,
  authReady: false,
  error: "",
  stipendMessage: "",
});

let stipendIntervalId;

function stopStipendWatcher() {
  if (stipendIntervalId) {
    clearInterval(stipendIntervalId);
    stipendIntervalId = undefined;
  }
}

async function startStipendWatcher() {
  stopStipendWatcher();
  await applyStipendIfEligible();
  stipendIntervalId = setInterval(() => {
    applyStipendIfEligible();
  }, 60 * 1000);
}

async function refreshProfile() {
  if (!state.user) return;
  const data = await apiFetch("/api/me", { method: "GET" });
  state.user = {
    id: data.user.id,
    email: data.user.email,
    isAdmin: Boolean(data.user.isAdmin),
  };
  state.profile = data.profile;
}

async function applyStipendIfEligible() {
  if (!state.user || !state.profile) return;
  const result = await apiFetch("/api/claim-stipend", { method: "POST" });
  state.profile = result.profile;
  state.stipendMessage = result.paid
    ? "Low balance stipend applied: +$100 virtual credits."
    : "";
}

async function register(email, password) {
  state.error = "";
  state.loading = true;
  try {
    const data = await apiFetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    state.user = {
      id: data.user.id,
      email: data.user.email,
      isAdmin: Boolean(data.user.isAdmin),
    };
    state.profile = data.profile;
    await startStipendWatcher();
    return true;
  } catch (err) {
    state.error = err.message;
    return false;
  } finally {
    state.loading = false;
  }
}

async function login(email, password) {
  state.error = "";
  state.loading = true;
  try {
    const data = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    state.user = {
      id: data.user.id,
      email: data.user.email,
      isAdmin: Boolean(data.user.isAdmin),
    };
    state.profile = data.profile;
    await startStipendWatcher();
    return true;
  } catch (err) {
    state.error = err.message;
    return false;
  } finally {
    state.loading = false;
  }
}

async function signOutUser() {
  await apiFetch("/api/logout", { method: "POST" }).catch(() => {});
  stopStipendWatcher();
  setToken("");
  state.user = null;
  state.profile = null;
  state.stipendMessage = "";
}

async function sellItem(inventoryId) {
  if (!state.user || !state.profile) {
    throw new Error("Sign in to sell items.");
  }
  const data = await apiFetch("/api/sell-item", {
    method: "POST",
    body: JSON.stringify({ inventoryId }),
  });
  state.profile = data.profile;
  return { soldValue: data.soldValue };
}

async function openCaseRoll(cost) {
  if (!state.user || !state.profile) {
    throw new Error("Sign in to open cases.");
  }
  const data = await apiFetch("/api/open-case", {
    method: "POST",
    body: JSON.stringify({
      cost,
    }),
  });
  // Do NOT apply data.profile here — callers (HomeView) are responsible for
  // applying it at the right moment so the inventory/balance don't spoil
  // the spinner result before the animation finishes.
  return { drop: data.drop, profile: data.profile };
}

async function initAuth() {
  if (state.authReady) return;
  state.user = null;
  state.profile = null;
  state.stipendMessage = "";

  stopStipendWatcher();

  try {
    const data = await apiFetch("/api/me", { method: "GET" });
    state.user = {
      id: data.user.id,
      email: data.user.email,
      isAdmin: Boolean(data.user.isAdmin),
    };
    state.profile = data.profile;
    await startStipendWatcher();
  } catch (_err) {
    state.user = null;
    state.profile = null;
  } finally {
    state.authReady = true;
  }
}

export function useUserState() {
  return {
    state,
    register,
    login,
    signOutUser,
    initAuth,
    openCaseRoll,
    sellItem,
    refreshProfile,
    applyStipendIfEligible,
  };
}
