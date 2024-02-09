CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile jsonb DEFAULT '{}',
  study_group VARCHAR(255),
  logs jsonb DEFAULT '{}',
  questionnaires jsonb DEFAULT '{}',
  feedback jsonb DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
    matrik_num VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id text REFERENCES users(id),
  source VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS user_completed (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  matrik_num VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL
);