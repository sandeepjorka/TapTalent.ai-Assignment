const axios = require('axios');
const cheerio = require('cheerio');

async function fetchHtml(url) {
  const resp = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
  return resp.data;
}

function extractNumbers(text) {
  const matches = text.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?/g) || [];
  return matches.map(s => parseFloat(s.replace(/\./g, '').replace(/,/g, '.'))).filter(n => !isNaN(n));
}

async function parseAmbitoARS() {
  const url = 'https://www.ambito.com/contenidos/dolar.html';
  try {
    const html = await fetchHtml(url);
    const nums = extractNumbers(html);
    return { source: url, buy_price: nums[0] || null, sell_price: nums[1] || null };
  } catch {
    return { source: url, buy_price: null, sell_price: null };
  }
}

async function parseDolarHoyARS() {
  const url = 'https://www.dolarhoy.com';
  try {
    const html = await fetchHtml(url);
    const nums = extractNumbers(html);
    return { source: url, buy_price: nums[0] || null, sell_price: nums[1] || null };
  } catch {
    return { source: url, buy_price: null, sell_price: null };
  }
}

async function parseCronistaARS() {
  const url = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
  try {
    const html = await fetchHtml(url);
    const nums = extractNumbers(html);
    return { source: url, buy_price: nums[0] || null, sell_price: nums[1] || null };
  } catch {
    return { source: url, buy_price: null, sell_price: null };
  }
}

async function fetchQuotes(currency) {
  if (currency === 'ARS') {
    return Promise.all([parseAmbitoARS(), parseDolarHoyARS(), parseCronistaARS()]);
  } else {
    throw new Error('Only ARS supported for now. You can add BRL sources later.');
  }
}

module.exports = { fetchQuotes };
