import type { ErrorWithStatus, Env, RouteEntry, RouteHandler } from "./types";
import { corsHeaders, json } from "./utils";

export function createOptionsResponse(): Response {
  return new Response(null, {
    headers: corsHeaders(),
  });
}

export function routeNotFound(): Response {
  return json({ error: "Not found" }, 404);
}

export function resolveRoute(
  entries: RouteEntry[],
  pathname: string,
  method: string,
): RouteHandler | null {
  const normalizedMethod = method.toUpperCase();
  return (
    entries.find((entry) => entry.path === pathname && entry.method === normalizedMethod)
      ?.handler ?? null
  );
}

export async function withErrorHandling(
  request: Request,
  env: Env,
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    const typed = error as ErrorWithStatus;
    const status =
      typeof typed.status === "number" && Number.isInteger(typed.status)
        ? typed.status
        : 500;
    return json({ error: typed.message || "Server error" }, status);
  }
}
