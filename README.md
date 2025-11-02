# Dollar Quotes API

Simple Node.js + Express service that scrapes USD exchange quotes from 3 sources and exposes:
- `GET /quotes?currency=ARS|BRL` - latest quotes
- `GET /average?currency=ARS|BRL` - average buy and sell prices
- `GET /slippage?currency=ARS|BRL` - slippage vs average per source

Freshness: responses are cached in-memory for **60 seconds**. Results persisted to SQLite at `./data/quotes.db`.

Run locally:
```bash
npm install
node migrations/init-db.js
node server.js
