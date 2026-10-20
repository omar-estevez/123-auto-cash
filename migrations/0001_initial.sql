CREATE TABLE IF NOT EXISTS metrics (
  day TEXT NOT NULL,
  event TEXT NOT NULL,
  lang TEXT NOT NULL,
  device TEXT NOT NULL,
  source TEXT NOT NULL,
  placement TEXT NOT NULL,
  stock TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day,event,lang,device,source,placement,stock)
);
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY CHECK (id=1),
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS photos (
  stock TEXT NOT NULL,
  position INTEGER NOT NULL,
  mime TEXT NOT NULL,
  bytes BLOB NOT NULL,
  PRIMARY KEY(stock,position)
);
