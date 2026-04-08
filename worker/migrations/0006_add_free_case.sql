INSERT OR IGNORE INTO cases (id, name, description, cost, sort_order, active) VALUES
  ('free', 'Free Case', 'No credits needed — open once and see what you get!', 0, -1, 1);

INSERT OR IGNORE INTO case_luck_pools (case_id, rarity, weight) VALUES
  ('free', 'Mil-Spec', 55),
  ('free', 'Restricted', 28),
  ('free', 'Classified', 12),
  ('free', 'Covert', 4.5),
  ('free', 'Rare Special', 0.5);
