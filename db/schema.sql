CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile jsonb DEFAULT '{}',
  logs jsonb DEFAULT '{}',
  questionnaires jsonb DEFAULT '{}',
  feedback jsonb DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  source VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details jsonb DEFAULT '{}'
);