import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import AdminView from "../views/AdminView.vue";
import SettingsView from "../views/SettingsView.vue";
import { useUserState } from "../lib/userState";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/auth", name: "auth", component: AuthView },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const requiresAuth = Boolean(to.meta.requiresAuth);
  const requiresAdmin = Boolean(to.meta.requiresAdmin);

  if (!requiresAuth && !requiresAdmin) {
    return true;
  }

  const needsUser = requiresAuth || requiresAdmin;

  const { state, initAuth } = useUserState();
  if (!state.authReady) {
    await initAuth();
  }

  if (needsUser && !state.user) {
    return { path: "/auth", query: { redirect: to.fullPath } };
  }

  if (requiresAdmin && !state.user?.isAdmin) {
    return { path: "/" };
  }

  return true;
});

export default router;
