-- Initial schema for color corpus

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  kind TEXT,
  organization TEXT,
  edition_or_version TEXT,
  publication_year INTEGER,
  language TEXT,
  license TEXT,
  source_url TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS source_colors (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES sources(id),
  local_code TEXT,
  primary_name_raw TEXT,
  color_space TEXT,
  coord_1 REAL,
  coord_2 REAL,
  coord_3 REAL,
  coord_4 REAL,
  hex_color TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS names (
  id TEXT PRIMARY KEY,
  normalized_form TEXT,
  display_form TEXT,
  language TEXT
);

CREATE TABLE IF NOT EXISTS color_name_assignments (
  id TEXT PRIMARY KEY,
  source_color_id TEXT REFERENCES source_colors(id),
  name_id TEXT REFERENCES names(id),
  role TEXT,
  confidence REAL
);
