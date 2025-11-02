const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data/quotes.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    currency TEXT NOT NULL,
    buy_price REAL,
    sell_price REAL,
    raw TEXT,
    fetched_at INTEGER
  )`);
});

db.close();
console.log('✅ Database initialized at ./data/quotes.db');
