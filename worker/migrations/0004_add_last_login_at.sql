-- Migration 0004: add last_login_at tracking to users
-- Run against your existing local DB:
--   npx wrangler d1 execute DB --local --file=./worker/migrations/0004_add_last_login_at.sql
-- Run against production:
--   npx wrangler d1 execute DB --file=./worker/migrations/0004_add_last_login_at.sql

ALTER TABLE users
  ADD COLUMN last_login_at INTEGER NOT NULL DEFAULT 0;
