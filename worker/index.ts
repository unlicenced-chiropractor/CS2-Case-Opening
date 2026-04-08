import type { Env } from "./lib/types";
import {
  createOptionsResponse,
  resolveRoute,
  routeNotFound,
  withErrorHandling,
} from "./lib/route";
import { json, warmPriceCache } from "./lib/utils";
import { routes } from "./routes";

const ASSETS_MISSING = {
  error: "Assets binding missing. Build app and set [assets] in wrangler.toml.",
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    ctx.waitUntil(warmPriceCache());
    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return createOptionsResponse();
    }

    if (!url.pathname.startsWith("/api/")) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return json(ASSETS_MISSING, 500);
    }

    return withErrorHandling(request, env, async () => {
      const handler = resolveRoute(routes, url.pathname, request.method);
      if (!handler) return routeNotFound();
      return handler({ request, env });
    });
  },
};
