-- Migration 0002: add is_admin flag to users
-- Run against your existing local DB:
--   npx wrangler d1 execute DB --local --file=./worker/migrations/0002_add_is_admin.sql
-- Run against production:
--   npx wrangler d1 execute DB --file=./worker/migrations/0002_add_is_admin.sql

ALTER TABLE users
  ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
