const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data/quotes.db');

function upsertQuote(q) {
  const stmt = `INSERT INTO quotes (source, currency, buy_price, sell_price, raw, fetched_at)
                VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(stmt, [q.source, q.currency, q.buy_price, q.sell_price, q.raw || '', Date.now()], err => {
    if (err) console.error('DB insert error:', err.message);
  });
}

function getLatestQuotes(currency, callback) {
  db.all(`SELECT * FROM quotes WHERE currency=? ORDER BY fetched_at DESC LIMIT 50`, [currency], (err, rows) => {
    callback(err, rows);
  });
}

module.exports = { upsertQuote, getLatestQuotes };
