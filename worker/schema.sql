CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  balance REAL NOT NULL DEFAULT 25,
  last_stipend_at INTEGER NOT NULL DEFAULT 0,
  last_login_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  revoked INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  used_at INTEGER DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_rarity TEXT NOT NULL,
  item_wear TEXT NOT NULL,
  item_icon TEXT NOT NULL,
  item_value REAL NOT NULL,
  dropped_at INTEGER NOT NULL,
  sold_at INTEGER DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost REAL NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS case_luck_pools (
  case_id TEXT NOT NULL,
  rarity TEXT NOT NULL,
  weight REAL NOT NULL,
  PRIMARY KEY (case_id, rarity),
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_case_luck_pools_case_id ON case_luck_pools (case_id);

INSERT OR IGNORE INTO cases (id, name, description, cost, sort_order, active) VALUES
  ('free', 'Free Case', 'No credits needed — open once and see what you get!', 0, -1, 1),
  ('classic', 'Classic Case', 'Balanced odds — the original CaseStrike experience.', 10, 0, 1),
  ('budget', 'Budget Case', 'Cheap opens; mostly Mil-Spec with a small chase.', 3, 1, 1),
  ('premium', 'Premium Case', 'Shifted toward higher rarities.', 15, 2, 1),
  ('elite', 'Elite Case', 'High stakes; much better Covert and Rare Special odds.', 25, 3, 1);

INSERT OR IGNORE INTO case_luck_pools (case_id, rarity, weight) VALUES
  ('free', 'Mil-Spec', 55), ('free', 'Restricted', 28), ('free', 'Classified', 12), ('free', 'Covert', 4.5), ('free', 'Rare Special', 0.5),
  ('classic', 'Mil-Spec', 55), ('classic', 'Restricted', 28), ('classic', 'Classified', 12), ('classic', 'Covert', 4.5), ('classic', 'Rare Special', 0.5),
  ('budget', 'Mil-Spec', 72), ('budget', 'Restricted', 22), ('budget', 'Classified', 5), ('budget', 'Covert', 0.9), ('budget', 'Rare Special', 0.1),
  ('premium', 'Mil-Spec', 40), ('premium', 'Restricted', 32), ('premium', 'Classified', 18), ('premium', 'Covert', 9), ('premium', 'Rare Special', 1),
  ('elite', 'Mil-Spec', 28), ('elite', 'Restricted', 28), ('elite', 'Classified', 22), ('elite', 'Covert', 18), ('elite', 'Rare Special', 4);
