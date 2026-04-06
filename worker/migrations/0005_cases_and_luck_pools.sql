-- Per-case pricing and rarity weight pools (luck). Safe to run on existing DBs.

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
  ('classic', 'Classic Case', 'Balanced odds — the original CaseStrike experience.', 10, 0, 1),
  ('budget', 'Budget Case', 'Cheap opens; mostly Mil-Spec with a small chase.', 3, 1, 1),
  ('premium', 'Premium Case', 'Shifted toward higher rarities.', 35, 2, 1),
  ('elite', 'Elite Case', 'High stakes; much better Covert and Rare Special odds.', 85, 3, 1);

INSERT OR IGNORE INTO case_luck_pools (case_id, rarity, weight) VALUES
  ('classic', 'Mil-Spec', 55), ('classic', 'Restricted', 28), ('classic', 'Classified', 12), ('classic', 'Covert', 4.5), ('classic', 'Rare Special', 0.5),
  ('budget', 'Mil-Spec', 72), ('budget', 'Restricted', 22), ('budget', 'Classified', 5), ('budget', 'Covert', 0.9), ('budget', 'Rare Special', 0.1),
  ('premium', 'Mil-Spec', 40), ('premium', 'Restricted', 32), ('premium', 'Classified', 18), ('premium', 'Covert', 9), ('premium', 'Rare Special', 1),
  ('elite', 'Mil-Spec', 28), ('elite', 'Restricted', 28), ('elite', 'Classified', 22), ('elite', 'Covert', 18), ('elite', 'Rare Special', 4);
