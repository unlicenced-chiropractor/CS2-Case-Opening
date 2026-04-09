import type { RouteEntry } from "./lib/types";
import { get as healthGet } from "./api/health/get";
import { get as catalogGet } from "./api/catalog/get";
import { post as registerPost } from "./api/register/post";
import { post as loginPost } from "./api/login/post";
import { get as meGet } from "./api/me/get";
import { get as adminMeGet } from "./api/admin/me/get";
import { post as logoutPost } from "./api/logout/post";
import { post as openCasePost } from "./api/open-case/post";
import { post as claimStipendPost } from "./api/claim-stipend/post";
import { post as sellItemPost } from "./api/sell-item/post";
import { post as sellBulkPost } from "./api/sell-bulk/post";
import { post as upgradePost } from "./api/upgrade/post";
import { get as adminUsersGet } from "./api/admin/users/get";
import { post as adminCreateResetLinkPost } from "./api/admin/create-reset-link/post";
import { get as adminListResetLinksGet } from "./api/admin/list-reset-links/get";
import { post as adminRevokeResetLinkPost } from "./api/admin/revoke-reset-link/post";
import { post as adminSetAdminPost } from "./api/admin/set-admin/post";
import { post as adminDeleteUserPost } from "./api/admin/delete-user/post";
import { post as adminUpdateBalancePost } from "./api/admin/update-balance/post";
import { post as deleteAccountPost } from "./api/delete-account/post";
import { get as cs2CasesGet } from "./api/cs2cases/get";

export const routes: RouteEntry[] = [
  { method: "GET", path: "/api/health", handler: healthGet },
  { method: "GET", path: "/api/catalog", handler: catalogGet },
  { method: "GET", path: "/api/cs2cases", handler: cs2CasesGet },
  { method: "POST", path: "/api/register", handler: registerPost },
  { method: "POST", path: "/api/login", handler: loginPost },
  { method: "GET", path: "/api/me", handler: meGet },
  { method: "GET", path: "/api/admin/me", handler: adminMeGet },
  { method: "POST", path: "/api/logout", handler: logoutPost },
  { method: "POST", path: "/api/delete-account", handler: deleteAccountPost },
  { method: "POST", path: "/api/open-case", handler: openCasePost },
  { method: "POST", path: "/api/claim-stipend", handler: claimStipendPost },
  { method: "POST", path: "/api/sell-item", handler: sellItemPost },
  { method: "POST", path: "/api/sell-bulk", handler: sellBulkPost },
  { method: "POST", path: "/api/upgrade", handler: upgradePost },
  { method: "GET", path: "/api/admin/users", handler: adminUsersGet },
  {
    method: "POST",
    path: "/api/admin/create-reset-link",
    handler: adminCreateResetLinkPost,
  },
  {
    method: "GET",
    path: "/api/admin/list-reset-links",
    handler: adminListResetLinksGet,
  },
  {
    method: "POST",
    path: "/api/admin/revoke-reset-link",
    handler: adminRevokeResetLinkPost,
  },
  { method: "POST", path: "/api/admin/set-admin", handler: adminSetAdminPost },
  {
    method: "POST",
    path: "/api/admin/delete-user",
    handler: adminDeleteUserPost,
  },
  {
    method: "POST",
    path: "/api/admin/update-balance",
    handler: adminUpdateBalancePost,
  },
];
