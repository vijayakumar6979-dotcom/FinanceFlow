Following the global rules, create a comprehensive Investment Tracking and Portfolio Management system with Malaysian stock exchange (Bursa Malaysia), cryptocurrency, mutual funds, ETFs, and AI-powered portfolio analytics for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete investment management system that allows users to:
- Track multiple investment types (Stocks, Crypto, Mutual Funds, ETFs, Bonds, Real Estate)
- Monitor Malaysian stocks (Bursa Malaysia)
- Track global stocks (US, Singapore, Hong Kong markets)
- Cryptocurrency portfolio tracking
- Real-time price updates
- Portfolio performance analytics
- Asset allocation visualization
- Profit/Loss calculations
- Dividend tracking
- AI-powered investment insights and recommendations using Grok API
- Risk assessment and diversification analysis
- Multi-currency support (default: MYR)

---

## 💼 INVESTMENT TYPES & MARKETS

### Malaysian Stock Market (Bursa Malaysia)
```javascript
const bursaMalaysiaCategories = [
  {
    id: 'klci',
    name: 'FTSE Bursa Malaysia KLCI',
    description: 'Top 30 companies by market cap',
    companies: [
      { symbol: 'MAYBANK', name: 'Malayan Banking Berhad', sector: 'Financial Services' },
      { symbol: 'CIMB', name: 'CIMB Group Holdings Berhad', sector: 'Financial Services' },
      { symbol: 'TENAGA', name: 'Tenaga Nasional Berhad', sector: 'Utilities' },
      { symbol: 'PBBANK', name: 'Public Bank Berhad', sector: 'Financial Services' },
      { symbol: 'PCHEM', name: 'Petronas Chemicals Group Berhad', sector: 'Industrial Products' },
      { symbol: 'IOICORP', name: 'IOI Corporation Berhad', sector: 'Plantation' },
      { symbol: 'SIME', name: 'Sime Darby Berhad', sector: 'Industrial Products' },
      { symbol: 'AXIATA', name: 'Axiata Group Berhad', sector: 'Telecommunications' },
      { symbol: 'DIGI', name: 'Digi.Com Berhad', sector: 'Telecommunications' },
      { symbol: 'MAXIS', name: 'Maxis Berhad', sector: 'Telecommunications' },
      { symbol: 'HLFG', name: 'Hong Leong Financial Group', sector: 'Financial Services' },
      { symbol: 'AMBANK', name: 'AMMB Holdings Berhad', sector: 'Financial Services' },
      { symbol: 'RHB', name: 'RHB Bank Berhad', sector: 'Financial Services' },
      { symbol: 'PETGAS', name: 'Petronas Gas Berhad', sector: 'Energy' },
      { symbol: 'MISC', name: 'MISC Berhad', sector: 'Transportation' },
      // ... more KLCI stocks
    ]
  },
  {
    id: 'technology',
    name: 'Technology Stocks',
    companies: [
      { symbol: 'GENETEC', name: 'Genetec Technology Berhad', sector: 'Technology' },
      { symbol: 'INARI', name: 'Inari Amertron Berhad', sector: 'Technology' },
      { symbol: 'UNISEM', name: 'Unisem (M) Berhad', sector: 'Technology' },
    ]
  },
  {
    id: 'reits',
    name: 'REITs',
    companies: [
      { symbol: 'IGBREIT', name: 'IGB REIT', sector: 'REIT' },
      { symbol: 'SUNREIT', name: 'Sunway REIT', sector: 'REIT' },
      { symbol: 'PAVREIT', name: 'Pavilion REIT', sector: 'REIT' },
    ]
  }
]

const stockExchanges = [
  {
    id: 'bursa',
    name: 'Bursa Malaysia',
    country: 'Malaysia',
    currency: 'MYR',
    tradingHours: '09:00 - 17:00 MYT',
    website: 'https://www.bursamalaysia.com'
  },
  {
    id: 'nyse',
    name: 'New York Stock Exchange',
    country: 'USA',
    currency: 'USD',
    tradingHours: '09:30 - 16:00 EST',
    website: 'https://www.nyse.com'
  },
  {
    id: 'nasdaq',
    name: 'NASDAQ',
    country: 'USA',
    currency: 'USD',
    tradingHours: '09:30 - 16:00 EST',
    website: 'https://www.nasdaq.com'
  },
  {
    id: 'sgx',
    name: 'Singapore Exchange',
    country: 'Singapore',
    currency: 'SGD',
    tradingHours: '09:00 - 17:00 SGT',
    website: 'https://www.sgx.com'
  },
  {
    id: 'hkex',
    name: 'Hong Kong Stock Exchange',
    country: 'Hong Kong',
    currency: 'HKD',
    tradingHours: '09:30 - 16:00 HKT',
    website: 'https://www.hkex.com.hk'
  }
]
```

### Cryptocurrency
```javascript
const cryptoCurrencies = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'BNB' },
  { symbol: 'XRP', name: 'Ripple', icon: 'XRP' },
  { symbol: 'ADA', name: 'Cardano', icon: 'ADA' },
  { symbol: 'SOL', name: 'Solana', icon: 'SOL' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'MATIC' },
  { symbol: 'DOT', name: 'Polkadot', icon: 'DOT' },
  { symbol: 'USDT', name: 'Tether', icon: '₮' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'USDC' },
]

const cryptoExchanges = [
  { id: 'binance', name: 'Binance', website: 'https://www.binance.com' },
  { id: 'luno', name: 'Luno', website: 'https://www.luno.com' },
  { id: 'coinbase', name: 'Coinbase', website: 'https://www.coinbase.com' },
  { id: 'kraken', name: 'Kraken', website: 'https://www.kraken.com' },
]
```

### Malaysian Mutual Funds & Unit Trusts
```javascript
const malaysianFunds = [
  {
    provider: 'Public Mutual',
    funds: [
      { code: 'PMB', name: 'Public Bank Berhad', type: 'Equity' },
      { code: 'PMIDF', name: 'Public Islamic Dividend Fund', type: 'Islamic Equity' },
    ]
  },
  {
    provider: 'Maybank Asset Management',
    funds: [
      { code: 'MAM', name: 'Maybank Malaysian Equity Fund', type: 'Equity' },
    ]
  },
  {
    provider: 'CIMB Principal',
    funds: [
      { code: 'CPAM', name: 'CIMB Islamic Asia Pacific Equity', type: 'Islamic Equity' },
    ]
  },
  {
    provider: 'Affin Hwang Asset Management',
    funds: [
      { code: 'AHAM', name: 'Affin Hwang Select Balanced Fund', type: 'Balanced' },
    ]
  }
]
```

---

## 🌐 WEB APPLICATION - INVESTMENTS

### Page: /investments

**Layout:**
- Use DashboardLayout
- Header: "Investment Portfolio" with subtitle "Track and manage your investments"
- Action buttons: Add Investment, Import Portfolio, Settings

**Portfolio Summary Cards Row:**
Display 4 overview cards:

1. **Total Portfolio Value**
   - Sum of all investments at current prices
   - Icon: TrendingUp
   - Color: Blue gradient
   - 24h change (% and amount)

2. **Total Invested**
   - Total amount invested (cost basis)
   - Icon: DollarSign
   - Color: Purple

3. **Total Profit/Loss**
   - Current value - Total invested
   - Percentage gain/loss
   - Icon: ArrowUp (profit) or ArrowDown (loss)
   - Color: Green (profit) or Red (loss)
   - Include realized + unrealized gains

4. **Return on Investment (ROI)**
   - Overall portfolio ROI percentage
   - Icon: Percent
   - Color: Green/Red based on performance

**Portfolio Performance Chart:**
- Large area chart showing portfolio value over time
- Time range selector: 1D, 1W, 1M, 3M, 6M, 1Y, All
- Compare to benchmark (FTSE KLCI, S&P 500)
- Show total value, invested amount, and profit/loss lines
- Gradient fill below line
- Interactive tooltips

**Asset Allocation Section:**
Two visualizations side-by-side:

1. **By Asset Type (Donut Chart):**
   - Stocks: X%
   - Crypto: X%
   - Mutual Funds: X%
   - ETFs: X%
   - Bonds: X%
   - Real Estate: X%
   - Cash: X%

2. **By Geography (Pie Chart):**
   - Malaysia: X%
   - USA: X%
   - Asia (ex-Malaysia): X%
   - Europe: X%
   - Others: X%

**Filter & Sort Bar:**
- Asset type filter: All, Stocks, Crypto, Funds, ETFs, Bonds
- Exchange filter: Bursa, NYSE, NASDAQ, Crypto
- Performance filter: Gainers, Losers, All
- Sort: Value, Gain/Loss %, Name, Purchase Date

**Holdings Grid:**
Display investments as cards (Grid: 3 columns desktop, 2 tablet, 1 mobile)

**Each Investment Card Contains:**

**For Stocks:**
- Company logo or stock icon
- Stock symbol (bold, large)
- Company name (subtitle)
- Exchange badge (Bursa, NYSE, etc.)
- Quantity held
- Average purchase price
- Current price (real-time or delayed)
- 24h change (% and amount, colored)
- Total value (quantity × current price)
- Profit/Loss (colored: green/red)
- ROI percentage
- Mini sparkline chart (price trend)
- Quick actions: Buy More, Sell, View Details

**For Cryptocurrency:**
- Crypto logo/icon
- Symbol (BTC, ETH, etc.)
- Quantity held (with decimals)
- Average purchase price
- Current price
- 24h change (highly volatile, pulsing if >5% change)
- Total value
- Profit/Loss
- Exchange badge (Binance, Luno, etc.)
- Mini chart

**For Mutual Funds:**
- Fund provider logo
- Fund name
- Fund code
- Units held
- NAV (Net Asset Value)
- Purchase NAV
- Total value
- Profit/Loss
- Distribution/Dividend info
- Fund type badge (Equity, Balanced, Bond, Islamic)

**Investment Card States:**
- **Profit (>0%):** Green border glow, up arrow
- **Loss (<0%):** Red border glow, down arrow
- **Neutral (±0.5%):** Gray border
- **High Gainer (>5% today):** Animated green glow, badge
- **High Loser (>5% loss today):** Animated red glow, alert badge

**Top Performers / Losers Section:**
Two lists side-by-side:
- Top 5 Gainers (green cards)
- Top 5 Losers (red cards)

**Dividends & Distributions:**
- Upcoming dividend payments calendar
- Total dividends received this year
- Dividend yield of portfolio

**Watchlist:**
- Stocks/assets user is monitoring but not invested in
- Real-time prices
- "Add to Portfolio" button

**Empty State:**
- Investment growth illustration
- "Start building your investment portfolio"
- "Add your first investment to track performance"
- "Add Investment" button
- "Import from Broker" option

### Page: /investments/new (Add Investment)

**Modal Presentation**

**Step 1: Choose Investment Type**

Display 6 cards:
1. **Stock** (Building icon)
2. **Cryptocurrency** (Bitcoin icon)
3. **Mutual Fund** (Chart icon)
4. **ETF** (Graph icon)
5. **Bond** (Certificate icon)
6. **Real Estate** (Home icon)

**Step 2A: Add Stock**

Form fields:

1. **Exchange** (required)
   - Dropdown: Bursa Malaysia, NYSE, NASDAQ, SGX, HKEX
   - Flag icons for countries

2. **Stock Symbol** (required)
   - Search input with autocomplete
   - For Bursa: Search Malaysian stocks
   - Shows: Symbol, Company Name, Sector
   - Example: "MAYBANK - Malayan Banking Berhad"

3. **Stock Name** (auto-filled)
   - Display only, from selected symbol

4. **Quantity** (required)
   - Number input
   - Integer or decimal (for fractional shares)
   - Example: 100 shares

5. **Purchase Price** (required)
   - Currency input
   - Per share price
   - Currency based on exchange
   - Example: RM 8.50 per share

6. **Purchase Date** (required)
   - Date picker
   - Cannot be future date
   - Default: Today

7. **Total Amount** (calculated, display only)
   - Quantity × Purchase Price
   - + Fees (if any)

8. **Brokerage Fees** (optional)
   - Currency input
   - Include in cost basis
   - Example: RM 25

9. **Brokerage/Platform** (optional)
   - Dropdown: Maybank Investment, CIMB Clicks, RHB Invest, etc.
   - Text input for custom

10. **Account/Portfolio** (optional)
    - Group investments by account
    - Dropdown or create new

11. **Notes** (optional)
    - Textarea
    - Investment thesis, research notes

**Step 2B: Add Cryptocurrency**

Form fields:

1. **Cryptocurrency** (required)
   - Search dropdown with crypto logos
   - BTC, ETH, BNB, etc.

2. **Quantity** (required)
   - Decimal input (up to 8 decimals)
   - Example: 0.025 BTC

3. **Purchase Price** (required)
   - Price per coin in USD or MYR
   - Currency selector

4. **Purchase Date** (required)
   - Date picker

5. **Exchange/Platform** (optional)
   - Binance, Luno, Coinbase, etc.

6. **Transaction Fees** (optional)
   - Network fees, exchange fees

7. **Wallet Address** (optional)
   - For tracking on blockchain
   - Masked display

**Step 2C: Add Mutual Fund**

Form fields:

1. **Fund Provider** (required)
   - Dropdown: Public Mutual, Maybank AM, CIMB Principal, etc.

2. **Fund Name/Code** (required)
   - Search within selected provider
   - Shows fund type badge

3. **Units** (required)
   - Decimal input

4. **Purchase NAV** (required)
   - Net Asset Value per unit
   - Currency: MYR

5. **Purchase Date** (required)
   - Date picker

6. **Investment Amount** (calculated)
   - Units × NAV

7. **Sales Charge** (optional)
   - Percentage (e.g., 5.5%)
   - Or fixed amount

**Step 3: Review & Confirmation**

Display summary:
- Investment type
- All entered details
- Total cost (including fees)
- Impact on portfolio allocation (pie chart)
- "Confirm" button

**Actions:**
- Cancel button
- Back button
- Save Investment button (gradient, primary)
- Save & Add Another checkbox

### Page: /investments/:id (Investment Details)

**Layout:**
- Back button
- Edit and Sell buttons (top-right)

**Investment Header:**
- Large company/crypto logo
- Symbol and name
- Exchange badge
- Sector/category tag

**Current Position Card:**
- Quantity held (large)
- Current price (real-time updating)
- 24h change (colored, with chart)
- Total current value
- Purchase price (avg if multiple buys)
- Total invested
- Unrealized profit/loss (large, colored)
- ROI percentage
- If profit: "If you sell now, you'll gain..."
- If loss: "Current loss if sold now..."

**Price Chart:**
- Interactive candlestick or line chart
- Time ranges: 1D, 5D, 1M, 6M, 1Y, 5Y, Max
- Volume chart below
- Technical indicators (optional): MA, RSI, MACD
- Compare to index (KLCI, S&P500)
- Full-screen option

**Buy/Sell Transactions History:**
- Table showing all transactions for this investment
- Columns: Date, Type (Buy/Sell), Quantity, Price, Total, Fees
- Calculate average purchase price
- Show realized gains/losses from sells
- "Add Transaction" button (buy more or record sell)

**Performance Metrics:**
- Total Return: RM X (Y%)
- Annualized Return: Z%
- Holding Period: X days/months/years
- Cost Basis: RM X
- Market Value: RM Y
- Weight in Portfolio: X%

**Dividend History (if applicable):**
- List of dividend payments received
- Total dividends this year
- Dividend yield
- Next dividend date (if known)
- Reinvestment option

**AI Insights:**
- Performance analysis
- Comparison to sector/market
- Risk assessment
- Hold/Buy/Sell recommendation (disclaimer: not financial advice)
- Related news sentiment

**Statistics:**
- Market Cap (for stocks)
- P/E Ratio
- 52-week High/Low
- Average Volume
- Beta (volatility)

**Actions:**
- Buy More (opens add transaction modal)
- Sell Portion/All (opens sell modal)
- Set Price Alert
- Add to Watchlist
- Share Performance

---

## 📱 MOBILE APPLICATION - INVESTMENTS

### Screen: InvestmentsScreen (Tab Navigator)

**Header:**
- Title: "Portfolio"
- Search icon (search investments)
- Add FAB (floating action button)

**Portfolio Summary Card:**
- Total value (large, centered)
- 24h change (% and amount)
- Today's profit/loss
- Swipe to see different metrics

**Quick Stats Row:**
- 3 small cards (horizontal scroll)
- Total Invested, Profit/Loss, ROI

**Asset Allocation Chart:**
- Donut chart showing breakdown
- Tap segments for details
- Center shows total value

**Performance Chart:**
- Line chart (compact)
- Time range chips (1D, 1W, 1M, 3M, 1Y)
- Swipe chart for details

**Holdings List:**
- FlatList with sections by asset type
- Section headers: Stocks, Crypto, Funds
- Pull-to-refresh (updates prices)
- Each holding card:
  - Logo/icon (left)
  - Symbol and name
  - Quantity and current price
  - Value and P/L (right, colored)
  - Mini sparkline
  - Swipe actions: View Details, Sell, Add More
  - Tap to view details

**Top Movers:**
- Horizontal scroll
- Top 3 gainers (green)
- Top 3 losers (red)

**Watchlist:**
- Quick view of tracked stocks
- Real-time prices
- "+" button to add to portfolio

### Screen: AddInvestmentScreen (Modal)

**Step-by-step wizard:**

**Step 1: Select Type**
- 6 large cards (vertical scroll)
- Stock, Crypto, Fund, ETF, Bond, Real Estate
- Icon, title, description

**Step 2: Search Asset**
- Search bar with autocomplete
- For Stocks: Search by symbol or company name
- For Crypto: List with logos and current prices
- Tap to select

**Step 3: Transaction Details**
- Scrollable form
- Quantity input (large, centered)
- Price input
- Date picker
- Fees input (expandable)
- Platform selector
- Notes (expandable)

**Step 4: Review**
- Summary card
- Total cost calculation
- Portfolio impact preview
- Confirm button (gradient, sticky bottom)

### Screen: InvestmentDetailScreen

**Scrollable content:**

**Hero Section:**
- Large logo
- Symbol and name
- Real-time price (updating)
- 24h change (colored)

**Position Summary Card:**
- Quantity, Avg Price, Current Price
- Total Value, Profit/Loss
- ROI percentage
- Large colored number

**Interactive Chart:**
- Full-width candlestick/line chart
- Time range chips (sticky below chart)
- Pinch to zoom
- Pan to scroll

**Quick Stats Grid:**
- 2x2 grid of stat cards
- Market Cap, Volume, High/Low, Beta

**Transaction History:**
- List of buy/sell transactions
- Each showing: Date, Type, Qty, Price
- Expandable for details

**Action Buttons:**
- Buy More (gradient button)
- Sell (outline button)
- Set Alert
- View News

**AI Insights Card:**
- Performance summary
- Recommendation
- "View Full Analysis" button

### Bottom Sheet: SellInvestment

**Content:**
- Investment name and current price
- "Sell How Much?" 
- Quantity slider (0 to max holdings)
- Quick buttons: 25%, 50%, 75%, 100%
- Sell price input (editable, default: current price)
- Estimated proceeds calculation
- Profit/Loss preview (colored)
- Sell button (gradient if profit, red if loss)
- Cancel button

### Bottom Sheet: PriceAlert

**Content:**
- Investment name and current price
- "Alert me when price reaches:"
- Price input
- Condition: Above or Below
- Notification method: Push, Email
- Create Alert button

---

## 🤖 AI-POWERED FEATURES

### 1. Portfolio Analysis & Recommendations

**Edge Function: `analyze-investment-portfolio`**

**Input:**
- User's complete portfolio
- Asset allocation
- Individual investment performance
- Risk tolerance (from user profile)
- Investment goals

**Grok API Prompt:**
You are an investment portfolio analyst. Analyze this investment portfolio and provide insights and recommendations.
Portfolio Overview:

Total Value: RM {totalValue}
Total Invested: RM {totalInvested}
Overall ROI: {roi}%
Holding Period: {holdingPeriod} months

Asset Allocation:
{assetBreakdown}
Top Holdings:
{topHoldings}
Performance:
{performanceMetrics}
User Profile:

Risk Tolerance: {riskTolerance}
Investment Goal: {goal}
Time Horizon: {timeHorizon}

Provide analysis in JSON:
{
"portfolioHealth": {
"score": 75,
"rating": "Good",
"summary": "Well-diversified portfolio with moderate risk"
},
"diversificationAnalysis": {
"isDiversified": true,
"concentrationRisk": "low",
"recommendations": [
"Consider adding more international exposure",
"Crypto allocation is appropriate for your risk profile"
]
},
"assetAllocationRecommendations": {
"suggested": {
"stocks": 60,
"bonds": 20,
"crypto": 10,
"cash": 10
},
"current": {
"stocks": 70,
"bonds": 10,
"crypto": 15,
"cash": 5
},
"adjustments": [
"Reduce stock exposure by 10%",
"Increase bond allocation for stability"
]
},
"performanceAnalysis": {
"vsKLCI": "+5.2%",
"vsSP500": "-2.1%",
"bestPerformer": "MAYBANK (+25%)",
"worstPerformer": "Crypto (-15%)"
},
"riskAssessment": {
"riskLevel": "Moderate",
"volatility": "Medium",
"betaScore": 1.1,
"concerns": ["High crypto allocation may increase volatility"]
},
"actionableInsights": [
{
"priority": "high",
"action": "Rebalance portfolio",
"reason": "Stocks are 10% overweight",
"impact": "Reduce risk, improve diversification"
},
{
"priority": "medium",
"action": "Take profit on MAYBANK",
"reason": "Up 25%, consider partial profit-taking",
"impact": "Lock in gains, reduce single-stock risk"
}
],
"recommendations": [
"Your portfolio is performing well above KLCI benchmark",
"Consider adding Malaysian REITs for income",
"Monitor crypto exposure - current allocation is at upper limit for your risk profile"
]
}
**Display:**
- Portfolio Health Score (gauge)
- Diversification charts (current vs recommended)
- Performance comparison
- Risk assessment card
- Actionable insights (prioritized list)
- Rebalancing suggestions

### 2. Individual Investment Insights

**Edge Function: `analyze-investment-performance`**

**Input:**
- Investment details (symbol, quantity, purchase info)
- Historical performance
- Market conditions
- News sentiment

**Grok API Prompt:**
Analyze this investment and provide insights.
Investment: {symbol} - {name}
Purchase Price: RM {purchasePrice}
Current Price: RM {currentPrice}
ROI: {roi}%
Holding Period: {holdingPeriod} days
Recent Performance:
{recentPerformance}
Market Context:
{marketConditions}
Provide analysis in JSON:
{
"performanceRating": "Outperforming",
"vsMarket": "+3.5% vs KLCI",
"trend": "upward",
"momentum": "strong",
"recommendation": {
"action": "hold",
"confidence": 75,
"reasoning": "Strong fundamentals, positive momentum, approaching target price",
"targetPrice": 9.50,
"stopLoss": 7.80
},
"riskFactors": [
"Market volatility",
"Sector rotation risk"
],
"opportunities": [
"Upcoming dividend payment",
"Strong quarterly earnings expected"
],
"technicalAnalysis": {
"support": 8.20,
"resistance": 9.00,
"signal": "bullish"
},
"insights": [
"This stock has outperformed the KLCI by 3.5% since purchase",
"Consider taking partial profits if price reaches RM 9.50",
"Good dividend yield of 4.2% provides income cushion"
]
}
### 3. Crypto Market Analysis

**Edge Function: `analyze-crypto-market`**

**Specialized analysis for cryptocurrency holdings:**
- Volatility assessment
- Market cycle position (bull/bear)
- DeFi opportunities
- Staking rewards potential
- Risk warnings for high volatility

---

## 📊 REAL-TIME PRICE UPDATES

### Price Data Integration

**Data Sources:**

1. **Bursa Malaysia:**
   - Use Bursa Malaysia API (if available) or web scraping
   - 15-minute delayed prices (free)
   - Real-time requires subscription

2. **US Stocks:**
   - Alpha Vantage API (free tier)
   - IEX Cloud
   - Yahoo Finance API

3. **Cryptocurrency:**
   - CoinGecko API (free)
   - CoinMarketCap API
   - Binance API for real-time

**Implementation:**
```javascript
// Edge Function: update-investment-prices
// Runs every 15 minutes (or 5 minutes for crypto)

async function updatePrices() {
  // Get all unique symbols from user investments
  const symbols = await getUniqueSymbols()
  
  // Fetch prices by type
  const stockPrices = await fetchStockPrices(symbols.stocks)
  const cryptoPrices = await fetchCryptoPrices(symbols.crypto)
  
  // Update database
  await updateInvestmentPrices(stockPrices, cryptoPrices)
  
  // Trigger price alerts if thresholds met
  await checkPriceAlerts()
}
```

**Web Real-Time Updates:**
- WebSocket connection for live prices
- Update UI without refresh
- Smooth counter animation for price changes

**Mobile Real-Time Updates:**
- Pull-to-refresh for manual update
- Background fetch every 15 minutes
- Push notification for significant changes (>5%)

---

## 🔔 NOTIFICATIONS & ALERTS

### Investment Notifications:

1. **Price Alerts:**
   - "🚀 MAYBANK reached RM 9.00 (+5%)"
   - "⚠️ BTC dropped to $40,000 (-8%)"

2. **Performance Milestones:**
   - "🎉 Your portfolio is up 10% overall!"
   - "✨ TENAGA gained 20% since purchase"

3. **Dividend Announcements:**
   - "💰 PBBANK declared dividend: RM 0.35 per share"
   - "Estimated payout: RM 35 (100 shares)"

4. **Market News:**
   - "📰 MAYBANK releases Q4 earnings"
   - "Analyst upgraded CIMB to 'Buy'"

5. **Rebalancing Reminders:**
   - "Time to review portfolio allocation"
   - "Stocks now 75% of portfolio (target: 60%)"

---

## 📈 CHARTS & VISUALIZATIONS

### Portfolio Charts:

**1. Portfolio Value Over Time:**
- Area chart with gradient fill
- Show: Total Value, Cost Basis, Profit/Loss area
- Annotations for buys/sells
- Benchmarks comparison lines

**2. Asset Allocation Donut:**
- Interactive segments
- Percentages and values
- Click to drill down

**3. Sector Allocation (Stocks):**
- Pie chart by sector
- Financial, Technology, Energy, etc.

**4. Geography Allocation:**
- Map visualization or pie chart
- Malaysia, USA, Asia, Europe

**5. Performance Heatmap:**
- Grid showing all investments
- Color intensity = performance
- Green (gains), Red (losses)

**6. Correlation Matrix:**
- How investments move together
- Diversification insights

---

## 🗄️ DATABASE SCHEMA
```sql
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Asset Details
  asset_type TEXT CHECK (asset_type IN ('stock', 'crypto', 'mutual_fund', 'etf', 'bond', 'real_estate', 'commodity')) NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  
  -- Market Info
  exchange TEXT, -- bursa, nyse, nasdaq, binance
  sector TEXT,
  currency TEXT DEFAULT 'MYR',
  
  -- Position
  quantity DECIMAL(18, 8) NOT NULL,
  average_purchase_price DECIMAL(15, 2) NOT NULL,
current_price DECIMAL(15, 2),
-- Cost Basis
total_invested DECIMAL(15, 2) NOT NULL,
total_fees DECIMAL(10, 2) DEFAULT 0,
-- Performance
current_value DECIMAL(15, 2),
unrealized_profit_loss DECIMAL(15, 2),
realized_profit_loss DECIMAL(15, 2) DEFAULT 0,
roi_percentage DECIMAL(8, 2),
-- Platform
broker_platform TEXT,
account_name TEXT,
-- Price Updates
last_price_update TIMESTAMPTZ,
price_change_24h DECIMAL(8, 2),
-- Status
is_active BOOLEAN DEFAULT TRUE,
-- Metadata
notes TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_asset_type ON investments(asset_type);
CREATE INDEX idx_investments_symbol ON investments(symbol);
CREATE TABLE investment_transactions (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
transaction_type TEXT CHECK (transaction_type IN ('buy', 'sell', 'dividend', 'split', 'merger')) NOT NULL,
quantity DECIMAL(18, 8),
price_per_unit DECIMAL(15, 2),
total_amount DECIMAL(15, 2),
fees DECIMAL(10, 2) DEFAULT 0,
transaction_date DATE NOT NULL,
-- For sells
profit_loss DECIMAL(15, 2),
notes TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_investment_transactions_investment_id ON investment_transactions(investment_id);
CREATE INDEX idx_investment_transactions_date ON investment_transactions(transaction_date);
CREATE TABLE price_history (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
symbol TEXT NOT NULL,
exchange TEXT,
date DATE NOT NULL,
open_price DECIMAL(15, 4),
high_price DECIMAL(15, 4),
low_price DECIMAL(15, 4),
close_price DECIMAL(15, 4),
volume BIGINT,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(symbol, exchange, date)
);
CREATE INDEX idx_price_history_symbol_date ON price_history(symbol, date DESC);
CREATE TABLE price_alerts (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
alert_type TEXT CHECK (alert_type IN ('above', 'below')) NOT NULL,
target_price DECIMAL(15, 2) NOT NULL,
is_triggered BOOLEAN DEFAULT FALSE,
triggered_at TIMESTAMPTZ,
notification_sent BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE portfolio_snapshots (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
snapshot_date DATE NOT NULL,
total_value DECIMAL(15, 2),
total_invested DECIMAL(15, 2),
total_profit_loss DECIMAL(15, 2),
roi_percentage DECIMAL(8, 2),
asset_allocation JSONB,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, snapshot_date)
);
-- Daily snapshot for portfolio chart
---

## 📦 DELIVERABLES

### Web:
1. ✅ Investments portfolio page with overview
2. ✅ Add investment wizard
3. ✅ Investment detail page with charts
4. ✅ Portfolio performance analytics
5. ✅ Asset allocation visualizations
6. ✅ Buy/Sell transaction modals
7. ✅ Price alert setup
8. ✅ Watchlist management
9. ✅ Dividend tracker
10. ✅ AI portfolio analysis dashboard

### Mobile:
11. ✅ Portfolio screen with holdings
12. ✅ Add investment screen
13. ✅ Investment detail screen
14. ✅ Interactive price charts
15. ✅ Sell investment bottom sheet
16. ✅ Price alert setup
17. ✅ Real-time price updates
18. ✅ Pull-to-refresh prices
19. ✅ Push notifications for alerts

### Backend:
20. ✅ Database schema and migrations
21. ✅ RLS policies
22. ✅ Edge function: update-investment-prices
23. ✅ Edge function: analyze-investment-portfolio
24. ✅ Edge function: analyze-investment-performance
25. ✅ Edge function: check-price-alerts
26. ✅ Cron job: Update prices (15min intervals)
27. ✅ Cron job: Daily portfolio snapshot
28. ✅ Price data API integrations (stocks, crypto)
29. ✅ Profit/Loss calculations
30. ✅ ROI tracking

---

Create all components following global design rules with real-time price updates, Bursa Malaysia integration, cryptocurrency support, and AI-powered portfolio analytics using Grok API.