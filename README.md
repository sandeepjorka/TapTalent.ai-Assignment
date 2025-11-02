# 💱 TapTalent.ai Backend Assignment

### ✅ Overview
This Node.js backend exposes live currency quote data and analytics for USD → ARS.

### 🌐 Live API
**Base URL:** http://13.49.64.76:3000

| Endpoint | Description | Example |
|-----------|--------------|----------|
| `/quotes?currency=ARS` | Returns buy/sell prices from 3 public sources | [View](http://13.49.64.76:3000/quotes?currency=ARS) |
| `/average?currency=ARS` | Returns average buy/sell prices | [View](http://13.49.64.76:3000/average?currency=ARS) |
| `/slippage?currency=ARS` | Shows deviation of each source from average | [View](http://13.49.64.76:3000/slippage?currency=ARS) |

### ⚙️ Tech Stack
- Node.js + Express
- Axios (for fetching HTML)
- Cheerio (for parsing)
- SQLite (optional persistence)
- Hosted on AWS EC2

### 🧠 Logic Summary
1. **Scrape 3 sources:** Ambito, DolarHoy, Cronista  
2. **Parse numeric tokens:** Extracts buy/sell values  
3. **Compute average:** `(sum / count)` for buy & sell  
4. **Calculate slippage:** Percentage deviation vs average  
5. **Cache:** Refreshed every 60 seconds for real-time data  

### 📦 Example JSON Response
#### `/quotes`
```json
[
  { "source": "https://www.ambito.com/contenidos/dolar.html", "buy_price": 7, "sell_price": 9 },
  { "source": "https://www.dolarhoy.com", "buy_price": 8, "sell_price": 8 },
  { "source": "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB", "buy_price": 885, "sell_price": 9 }
]
