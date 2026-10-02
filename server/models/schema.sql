-- Brud Gaming — database schema
-- Postgres-flavored. Adjust types if you're on MySQL/SQLite.

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE games (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  genre       VARCHAR(100),
  cover_url   VARCHAR(500),
  released_at DATE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id    INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE scores (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id    INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  score      INTEGER NOT NULL,
  achieved_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_game ON reviews(game_id);
CREATE INDEX idx_scores_game  ON scores(game_id);
CREATE INDEX idx_scores_user  ON scores(user_id);