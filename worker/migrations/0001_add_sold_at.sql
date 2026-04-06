-- Migration 0001: add sold_at column to inventory
-- Run against your existing local DB:
--   npx wrangler d1 execute DB --local --file=./worker/migrations/0001_add_sold_at.sql
-- Run against production:
--   npx wrangler d1 execute DB --file=./worker/migrations/0001_add_sold_at.sql

ALTER TABLE inventory ADD COLUMN sold_at INTEGER DEFAULT NULL;
