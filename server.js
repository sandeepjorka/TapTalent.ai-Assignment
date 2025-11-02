const express = require('express');
const { fetchQuotes } = require('./scraper');
const { upsertQuote } = require('./db');

const app = express();
const PORT = 3000;
const cache = {};
const MAX_AGE_MS = 60 * 1000;

async function getFreshQuotes(currency) {
  const now = Date.now();
  if (cache[currency] && now - cache[currency].fetchedAt < MAX_AGE_MS) {
    return cache[currency].quotes;
  }
  const quotes = await fetchQuotes(currency);
  cache[currency] = { fetchedAt: now, quotes };
  quotes.forEach(q => upsertQuote({ ...q, currency }));
  return quotes;
}

function computeAverage(quotes) {
  const buys = quotes.map(q => q.buy_price).filter(n => typeof n === 'number');
  const sells = quotes.map(q => q.sell_price).filter(n => typeof n === 'number');
  const avgBuy = buys.length ? buys.reduce((a, b) => a + b, 0) / buys.length : null;
  const avgSell = sells.length ? sells.reduce((a, b) => a + b, 0) / sells.length : null;
  return { average_buy_price: avgBuy, average_sell_price: avgSell };
}

app.get('/quotes', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  if (!['ARS'].includes(currency)) return res.status(400).json({ error: 'currency must be ARS' });
  const quotes = await getFreshQuotes(currency);
  res.json(quotes);
});

app.get('/average', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  const quotes = await getFreshQuotes(currency);
  const avg = computeAverage(quotes);
  res.json(avg);
});

app.get('/slippage', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  const quotes = await getFreshQuotes(currency);
  const avg = computeAverage(quotes);
  const slippage = quotes.map(q => ({
    source: q.source,
    buy_price_slippage: (q.buy_price - avg.average_buy_price) / avg.average_buy_price,
    sell_price_slippage: (q.sell_price - avg.average_sell_price) / avg.average_sell_price
  }));
  res.json(slippage);
});

app.get('/', (_, res) => res.send('Dollar Quotes API is running! Use /quotes, /average, /slippage'));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
