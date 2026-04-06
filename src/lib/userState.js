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

async function refreshProfile() {
  if (!state.user) return;
  const data = await apiFetch("/api/me", { method: "GET" });
  state.user = data.user;
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
    state.user = data.user;
    state.profile = data.profile;
  } catch (err) {
    state.error = err.message;
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
    state.user = data.user;
    state.profile = data.profile;
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading = false;
  }
}

async function signOutUser() {
  await apiFetch("/api/logout", { method: "POST" }).catch(() => {});
  setToken("");
  state.user = null;
  state.profile = null;
  state.stipendMessage = "";
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
  state.profile = data.profile;
  return data.drop;
}

async function initAuth() {
  if (state.authReady) return;
  state.user = null;
  state.profile = null;
  state.stipendMessage = "";

  if (stipendIntervalId) {
    clearInterval(stipendIntervalId);
    stipendIntervalId = undefined;
  }

  try {
    const data = await apiFetch("/api/me", { method: "GET" });
    state.user = data.user;
    state.profile = data.profile;
    await applyStipendIfEligible();
    stipendIntervalId = setInterval(() => {
      applyStipendIfEligible();
    }, 60 * 1000);
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
    refreshProfile,
    applyStipendIfEligible,
  };
}
