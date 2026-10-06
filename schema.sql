CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  group_code TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  abandoned_at INTEGER,
  status TEXT NOT NULL DEFAULT 'in_progress',
  abandon_location TEXT,
  age_range TEXT,
  gender TEXT,
  travel_insurance_count INTEGER DEFAULT 0,
  travel_claimed INTEGER DEFAULT 0,
  any_claimed INTEGER DEFAULT 0,
  viewport TEXT,
  user_agent TEXT,
  difficulty INTEGER,
  uncertainty_text TEXT,
  recovery_understanding INTEGER,
  progress_confidence INTEGER
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_id TEXT,
  page_name TEXT,
  created_at INTEGER NOT NULL,
  meta_json TEXT DEFAULT '{}',
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_events_session_time ON events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at);
