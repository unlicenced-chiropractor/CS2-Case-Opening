export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  [key: string]: unknown;
}

export interface RouteContext {
  request: Request;
  env: Env;
}

export type HttpMethod = "GET" | "POST";
export type RouteHandler = (ctx: RouteContext) => Promise<Response> | Response;

export interface RouteEntry {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}

export interface SessionUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Session {
  user: SessionUser;
  token: string;
}

export interface ErrorWithStatus extends Error {
  status?: number;
}

export interface RollCatalogResult {
  skins: Skin[];
  source: string;
}

export interface Skin {
  name: string;
  rarity: string;
  value: number;
  icon: string;
  wear?: string;
  shortWear?: string;
}

export interface CatalogCache {
  loadedAt: number;
  skins: Skin[];
}
