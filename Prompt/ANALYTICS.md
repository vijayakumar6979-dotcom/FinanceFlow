Following the global rules, create a comprehensive Analytics & Reports Dashboard with AI-powered financial insights, predictive analytics, custom report generation, data visualization, and export capabilities for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete analytics and reporting system that:
- Provides comprehensive financial overview and insights
- AI-powered financial health analysis using Grok API
- Predictive analytics (spending forecasts, savings projections)
- Custom report generation with filters
- Visual data storytelling with interactive charts
- Compare periods (Month-over-Month, Year-over-Year)
- Net worth tracking over time
- Cash flow analysis
- Category deep-dives
- Export reports (PDF, Excel, CSV)
- Scheduled reports (email weekly/monthly summaries)
- Financial goal progress tracking
- Debt payoff projections
- Investment portfolio performance
- Budget variance analysis
- Multi-currency support (default: MYR)

---

## 📈 ANALYTICS MODULES

### Core Analytics Areas
```javascript
const analyticsModules = [
  {
    id: 'overview',
    name: 'Financial Overview',
    description: 'Complete snapshot of your financial health',
    icon: 'layout-dashboard',
    color: '#0066FF'
  },
  {
    id: 'income-expense',
    name: 'Income & Expense Analysis',
    description: 'Track income sources and spending patterns',
    icon: 'trending-up',
    color: '#10B981'
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Analysis',
    description: 'Monitor money in and money out',
    icon: 'activity',
    color: '#06B6D4'
  },
  {
    id: 'net-worth',
    name: 'Net Worth Tracker',
    description: 'Assets minus liabilities over time',
    icon: 'bar-chart-2',
    color: '#8B5CF6'
  },
  {
    id: 'budget-performance',
    name: 'Budget Performance',
    description: 'How well you stick to your budgets',
    icon: 'target',
    color: '#F59E0B'
  },
  {
    id: 'debt-analysis',
    name: 'Debt Analysis',
    description: 'Loan balances, payments, and payoff timeline',
    icon: 'trending-down',
    color: '#EF4444'
  },
  {
    id: 'investment-performance',
    name: 'Investment Performance',
    description: 'Portfolio returns and asset allocation',
    icon: 'pie-chart',
    color: '#EC4899'
  },
  {
    id: 'category-breakdown',
    name: 'Category Deep Dive',
    description: 'Detailed analysis by spending category',
    icon: 'layers',
    color: '#3B82F6'
  },
  {
    id: 'predictions',
    name: 'Predictions & Forecasts',
    description: 'AI-powered financial predictions',
    icon: 'zap',
    color: '#A855F7'
  },
  {
    id: 'custom-reports',
    name: 'Custom Reports',
    description: 'Build your own reports',
    icon: 'file-text',
    color: '#6B7280'
  }
]
```

---

## 🌐 WEB APPLICATION - ANALYTICS

### Page: /analytics

**Layout:**
- Use DashboardLayout
- Header: "Analytics & Reports" with subtitle "Understand your financial health"
- Action buttons: Export Report, Schedule Report, Customize Dashboard

**Time Period Selector (Global):**
- Prominent selector affecting all charts
- Presets: This Month, Last Month, Last 3 Months, Last 6 Months, This Year, Last Year, All Time, Custom
- Date range picker for custom
- Comparison toggle: "Compare to previous period"

**Financial Health Score Card:**
- Large card at top, full width
- **Score: 0-100** (gauge visualization)
- Color-coded:
  - 90-100: Excellent (Green)
  - 70-89: Good (Blue)
  - 50-69: Fair (Yellow)
  - <50: Needs Improvement (Red)
- AI-generated summary: "Your financial health is Good. You're on track with budgets and making progress on goals."
- Breakdown:
  - Budgeting: 85/100
  - Saving: 70/100
  - Debt Management: 90/100
  - Investing: 65/100
- "View Full Analysis" button

**Quick Stats Grid:**
Display 8 key metrics in 2 rows:

**Row 1:**
1. **Total Income (Period)**
   - Amount with trend vs previous period
2. **Total Expenses (Period)**
   - Amount with trend
3. **Net Savings**
   - Income - Expenses with percentage
4. **Savings Rate**
   - Percentage of income saved

**Row 2:**
5. **Net Worth**
   - Assets - Liabilities with trend
6. **Total Debt**
   - Outstanding loan balances with trend
7. **Investment Returns**
   - Portfolio ROI for period
8. **Budget Adherence**
   - Percentage of budgets on track

---

### Section: Financial Overview Dashboard

**Layout:** 2 columns on desktop, 1 on mobile

**Left Column:**

**1. Net Worth Over Time Chart:**
- Area chart showing net worth progression
- X-axis: Time (daily, weekly, or monthly based on range)
- Y-axis: Amount in MYR
- Two lines:
  - Total Assets (green)
  - Total Liabilities (red)
  - Net Worth (blue, bold)
- Gradient fill under net worth line
- Markers for significant events
- Interactive: Hover for details, click to drill down

**2. Income vs Expense Chart:**
- Grouped bar chart
- X-axis: Months
- Y-axis: Amount
- Two bars per month:
  - Income (green)
  - Expenses (red)
- Gap between bars shows savings
- Average lines (dotted)
- Click bar to see breakdown

**3. Budget Performance Overview:**
- List of all budgets with progress bars
- Each showing:
  - Category name and icon
  - Spent / Budget
  - Progress bar (color-coded)
  - Percentage
  - Trend vs last period
- Sort by: Over budget, At risk, On track

**Right Column:**

**4. Category Breakdown (Pie/Donut Chart):**
- Expense categories
- Interactive segments
- Percentage and amount on hover
- Top 5 categories highlighted
- "Other" for remaining
- Click segment to see transactions
- Toggle between:
  - All categories
  - Top 10 categories
  - Custom selection

**5. Cash Flow Waterfall Chart:**
- Starting balance
- + Income sources (green bars)
- - Expense categories (red bars)
- = Ending balance
- Clear visual of where money came from and went
- Interactive: Click bar for details

**6. Top Insights Card:**
- AI-generated insights
- 5-7 key findings
- Icons and colors
- Examples:
  - "💰 You saved 15% more this month"
  - "⚠️ Food spending up 25% vs last month"
  - "🎯 All budgets on track - great job!"
  - "📈 Net worth increased by RM 5,000"
  - "💡 You could save RM 300 by reducing subscriptions"
- "Get More Insights" button

---

### Section: Income & Expense Analysis

**Income Analysis:**

**1. Income Sources Breakdown:**
- Pie chart showing income categories
- Salary, Business, Investments, Other
- Amount and percentage for each
- Trend indicators

**2. Income Trend Over Time:**
- Line chart showing income over selected period
- Multiple lines for different sources
- Average income line
- Highlight irregular income
- Predictive line for next month (dotted)

**3. Income Stability Score:**
- Gauge showing stability (0-100)
- Based on:
  - Regularity of income
  - Variance month-to-month
  - Number of income sources
- Recommendation: "Your income is stable. Good foundation for planning."

**Expense Analysis:**

**4. Expense Breakdown by Category:**
- Horizontal bar chart
- Categories sorted by amount
- Each bar shows:
  - Amount
  - Percentage of total
  - Trend vs previous period
- Color-coded by category

**5. Expense Trend Over Time:**
- Stacked area chart
- Each category as a colored layer
- Total expense line on top
- Interactive: Toggle categories on/off
- Hover for breakdown

**6. Largest Expenses:**
- Table showing top 20 expenses
- Columns: Date, Description, Category, Amount
- Sortable
- Click to view transaction details

**7. Expense Patterns:**
- Heatmap showing spending by:
  - Day of week (Monday - Sunday)
  - Week of month (1-4)
- Color intensity = amount spent
- Identify patterns: "You spend most on weekends"

---

### Section: Cash Flow Analysis

**1. Cash Flow Statement:**
- Formatted like accounting statement
- **Operating Activities:**
  - Income
  - Operating Expenses
  - Net Operating Cash Flow
- **Investing Activities:**
  - Investment purchases
  - Investment sales
  - Net Investing Cash Flow
- **Financing Activities:**
  - Loan payments
  - New loans
  - Net Financing Cash Flow
- **Net Change in Cash**
- Starting Cash + Net Change = Ending Cash

**2. Monthly Cash Flow Chart:**
- Waterfall chart for each month
- Shows all inflows and outflows
- Color-coded (green = in, red = out)
- Net change highlighted

**3. Cash Flow Forecast:**
- Predictive chart (next 3-6 months)
- Based on historical patterns
- AI-adjusted for known future events
- Scenarios:
  - Best case
  - Expected case
  - Worst case
- Confidence intervals shown

**4. Cash Flow Metrics:**
- Cards showing:
  - Average Monthly Inflow
  - Average Monthly Outflow
  - Net Monthly Cash Flow
  - Cash Flow Volatility (Standard Deviation)
  - Months of Expenses Covered (Emergency Fund)

---

### Section: Net Worth Tracker

**1. Net Worth Over Time:**
- Large line chart
- Monthly snapshots
- Assets line (green)
- Liabilities line (red)
- Net worth line (blue, bold)
- Gradient fill under net worth
- Milestones marked
- Zoom and pan

**2. Asset Breakdown:**
- Donut chart
- Categories:
  - Cash & Bank Accounts
  - Investments
  - Property/Real Estate
  - Vehicles
  - Other Assets
- Amount and percentage
- Click to drill down

**3. Liabilities Breakdown:**
- Donut chart
- Categories:
  - Home Loans
  - Auto Loans
  - Personal Loans
  - Credit Cards
  - Other Debt
- Amount and percentage

**4. Net Worth Growth:**
- Table showing:
  - Period, Assets, Liabilities, Net Worth, Change
- Monthly, Quarterly, Yearly views
- Calculate growth rate
- Compare to goals

**5. Net Worth Goals:**
- Target net worth amount
- Current progress
- Timeline to reach goal
- Required monthly savings
- Visual progress bar

---

### Section: Budget Performance

**1. Overall Budget Health:**
- Gauge showing overall performance
- Percentage of budgets on track
- Color-coded

**2. Budget Variance Analysis:**
- Table for each budget:
  - Category
  - Budgeted Amount
  - Actual Spent
  - Variance (Amount and %)
  - Status (Over, Under, On Track)
- Sort by variance
- Highlight problem areas

**3. Budget vs Actual Chart:**
- Grouped bar chart
- Each category: Budget bar vs Actual bar
- Red if over, green if under
- Click for details

**4. Budget Adherence Over Time:**
- Line chart showing monthly adherence %
- Target line at 100%
- Trend indicator

**5. Budget Recommendations:**
- AI-generated suggestions
- "Reduce [Category] budget by RM X"
- "Increase [Category] budget by RM Y"
- "Your [Category] spending is very consistent - good job!"

---

### Section: Debt Analysis

**1. Total Debt Over Time:**
- Area chart showing debt reduction
- All loans stacked
- Color-coded by loan type
- Payoff projection line (dotted)
- Debt-free date marked

**2. Debt Breakdown:**
- Table showing each loan:
  - Lender
  - Type
  - Original Amount
  - Current Balance
  - Interest Rate
  - Monthly Payment
  - Payoff Date
- Total row at bottom

**3. Debt Payoff Timeline:**
- Gantt chart showing each loan
- Bars from start to projected end
- Current position marked
- Color-coded by loan type
- Compare strategies (overlay)

**4. Interest Analysis:**
- Pie chart: Principal vs Interest
- Total interest paid to date
- Total interest remaining
- Potential savings with extra payments

**5. Debt Metrics:**
- Debt-to-Income Ratio
- Debt Payoff Progress (%)
- Average Interest Rate
- Months to Debt-Free
- Interest Savings Opportunities

---

### Section: Investment Performance

**1. Portfolio Value Over Time:**
- Area chart with gains/losses highlighted
- Compare to benchmarks (KLCI, S&P 500)
- Drawdown periods shaded
- All-time high marked

**2. Asset Allocation:**
- Current vs Target (side-by-side donuts)
- Rebalancing needed highlighted
- Geographic allocation
- Sector allocation (for stocks)

**3. Returns Analysis:**
- Table showing:
  - Investment
  - Purchase Price
  - Current Price
  - ROI %
  - Total Gain/Loss
- Sort by performance
- Color-coded

**4. Investment Metrics:**
- Total Portfolio Value
- Total Invested
- Total Returns (Amount and %)
- Annualized Return
- Best Performer
- Worst Performer
- Dividends Received

**5. Risk Analysis:**
- Portfolio volatility
- Beta (vs market)
- Sharpe ratio
- Maximum drawdown
- Risk-adjusted returns

---

### Section: Category Deep Dive

**Select a Category:**
- Dropdown to choose category

**For Selected Category:**

**1. Spending Trend:**
- Line chart over time
- Compare to other categories
- Seasonal patterns highlighted

**2. Transaction List:**
- All transactions in category
- Sortable, filterable
- Export option

**3. Merchants/Vendors:**
- Pie chart showing spending by merchant
- Top 10 merchants
- Click for transactions

**4. Category Insights:**
- Average transaction amount
- Most frequent day of week
- Most frequent time of day
- Largest transaction
- Smallest transaction
- Unusual transactions flagged

**5. Category Budget Performance:**
- Budget vs Actual
- Variance analysis
- Recommendations

---

### Section: Predictions & Forecasts

**1. Spending Forecast:**
- Chart showing predicted spending next 3-6 months
- AI-generated based on:
  - Historical patterns
  - Seasonal trends
  - Upcoming bills/loans
  - User's goals
- Confidence intervals
- "If you continue current spending..."

**2. Savings Projection:**
- Chart showing projected savings
- Based on income and expense trends
- Goal targets overlaid
- "At this rate, you'll save RM X by [date]"

**3. Net Worth Projection:**
- Chart showing projected net worth
- Scenarios:
  - Conservative (current trend)
  - Moderate (with goals)
  - Aggressive (with optimizations)
- Milestones marked

**4. Budget Predictions:**
- Which budgets at risk next month
- Predicted overspending
- Recommended adjustments

**5. Debt Payoff Forecast:**
- Predicted debt-free date
- If maintain current payments
- If add extra RM X per month
- Compare scenarios

**6. AI Recommendations:**
- Personalized action items
- "Save RM 500 more next month by..."
- "Pay off [Loan] 12 months faster by..."
- "Reach [Goal] 6 months earlier by..."

---

### Section: Custom Reports

**Report Builder:**

**Step 1: Choose Report Type**
- Transaction Report
- Budget Report
- Income/Expense Report
- Net Worth Report
- Debt Report
- Investment Report
- Tax Report (for tax purposes)

**Step 2: Select Date Range**
- Presets or custom

**Step 3: Choose Filters**
- Accounts
- Categories
- Tags
- Amount range
- Transaction type

**Step 4: Select Columns/Metrics**
- Checkboxes for what to include
- Reorder columns (drag-drop)

**Step 5: Choose Visualizations**
- Charts to include
- Chart types (bar, line, pie, etc.)

**Step 6: Preview & Export**
- Preview report
- Export options:
  - PDF (formatted, printable)
  - Excel (.xlsx)
  - CSV
  - Google Sheets (direct export)
- Save as template for reuse
- Schedule (daily, weekly, monthly email)

---

## 📱 MOBILE APPLICATION - ANALYTICS

### Screen: AnalyticsScreen (Tab Navigator)

**Header:**
- Title: "Analytics"
- Period selector (dropdown)
- More options menu (export, schedule)

**Financial Health Score Card:**
- Large card at top
- Score gauge (circular)
- Rating: Excellent, Good, Fair, Poor
- Tap for full breakdown

**Quick Stats:**
- 2x2 grid of key metrics
- Swipeable (shows 8 metrics total)
- Each card:
  - Icon
  - Label
  - Value (large)
  - Trend indicator (+/- %)

**Module Cards:**
- Scrollable list of analytics modules
- Each card:
  - Icon and title
  - Mini chart/visualization
  - Key metric
  - "View Details" button
- Cards:
  1. Income & Expense
  2. Cash Flow
  3. Net Worth
  4. Budget Performance
  5. Debt Analysis
  6. Investment Performance
  7. Predictions

**AI Insights Section:**
- "Top Insights" header
- 3-5 insight cards
- Each showing:
  - Icon
  - Insight text
  - Action button (if applicable)
- "See All Insights" button

### Screen: IncomeExpenseAnalyticsScreen

**Scrollable content:**

**Period Selector:**
- Chips: This Month, Last Month, 3M, 6M, 1Y
- Custom date picker

**Summary Cards:**
- Income, Expenses, Net Savings (horizontal scroll)

**Income vs Expense Chart:**
- Bar chart (Victory Native)
- Monthly comparison
- Toggle between chart types (bar, line, area)

**Category Breakdown:**
- Donut chart
- Tap segments for details
- Legend below

**Top Categories:**
- List of top 5 expense categories
- Each showing:
  - Icon, name, amount, percentage
  - Mini progress bar
  - Trend

**Top Transactions:**
- List of largest transactions
- Tap to view details

**Action Button:**
- "Export Report"

### Screen: CashFlowAnalyticsScreen

**Cash Flow Statement:**
- Formatted statement (scrollable)
- Expandable sections
- Color-coded amounts

**Monthly Cash Flow Chart:**
- Waterfall chart
- Horizontal scroll for multiple months

**Cash Flow Forecast:**
- Line chart with prediction
- Next 3 months
- Confidence band (shaded area)

**Metrics Grid:**
- 2x2 grid
- Avg Inflow, Avg Outflow, Net Flow, Volatility

### Screen: NetWorthTrackerScreen

**Net Worth Card:**
- Large display of current net worth
- Trend (up/down arrow and %)

**Net Worth Chart:**
- Line chart over time
- Assets, Liabilities, Net Worth lines
- Pinch to zoom
- Pan to scroll

**Breakdown Section:**
- Two donut charts side-by-side
- Assets and Liabilities
- Tap for details

**Change Over Time:**
- List showing:
  - This Month: +RM X
  - This Quarter: +RM Y
  - This Year: +RM Z
  - All Time: +RM A

**Net Worth Goal:**
- Progress card
- Target amount
- Current progress
- Timeline

### Screen: BudgetPerformanceScreen

**Overall Health:**
- Large gauge
- Percentage on track

**Budget List:**
- All budgets with progress
- Color-coded
- Sort options (alphabetical, variance, status)

**Budget vs Actual Chart:**
- Horizontal bar chart
- Each budget showing target vs actual

**Variance Analysis:**
- Table showing biggest over/under

**Recommendations:**
- AI suggestions
- Action buttons

### Screen: DebtAnalysisScreen

**Total Debt Card:**
- Large amount
- Debt-free countdown
- Progress bar

**Debt Reduction Chart:**
- Area chart showing decline
- Payoff projection

**Loan List:**
- Cards for each loan
- Balance, payment, rate
- Tap for details

**Payoff Timeline:**
- Visual timeline (horizontal)
- Each loan as segment
- Current position

**Interest Analysis:**
- Donut chart: Principal vs Interest
- Total interest paid
- Total remaining

### Screen: InvestmentPerformanceScreen

**Portfolio Value:**
- Large card
- Current value
- Total gain/loss (colored)
- ROI %

**Performance Chart:**
- Line chart with benchmark
- Time range selector

**Asset Allocation:**
- Donut chart
- Current allocation

**Holdings List:**
- Top 10 holdings
- Each showing symbol, value, gain/loss

**Metrics:**
- Grid of key metrics
- Total Returns, Best Performer, etc.

### Screen: PredictionsScreen

**AI-Powered Forecasts:**

**Spending Forecast:**
- Chart showing next 3 months
- Predicted amounts
- Confidence level

**Savings Projection:**
- Chart with goal overlay
- "You'll save RM X by..."

**Net Worth Forecast:**
- 3 scenario comparison
- Conservative, Moderate, Aggressive

**Recommendations:**
- List of AI-generated actions
- Prioritized
- Impact estimates

### Screen: CustomReportScreen

**Report Builder:**

**Step-by-step wizard:**

1. **Report Type**
   - List of report types
   - Tap to select

2. **Date Range**
   - Preset chips
   - Custom picker

3. **Filters**
   - Multi-select options
   - Accounts, Categories, Tags

4. **Preview**
   - Sample of report data
   - Charts included

5. **Export**
   - Format selector (PDF, Excel, CSV)
   - Email report
   - Share via native share

**Saved Reports:**
- List of saved templates
- Tap to run
- Edit or delete

### Bottom Sheet: ExportOptions

**Content:**
- Export format options:
  - PDF (with charts)
  - Excel (.xlsx)
  - CSV (data only)
  - Google Sheets
- Email report toggle
  - Email address input
- Export button (gradient)

### Bottom Sheet: ScheduleReport

**Content:**
- Report name input
- Frequency selector:
  - Daily
  - Weekly (select day)
  - Monthly (select date)
- Email address
- Include charts toggle
- Format selector
- Schedule button

---

## 🤖 AI-POWERED ANALYTICS

### 1. Financial Health Score

**Edge Function: `calculate-financial-health-score`**

**Runs:** Daily

**Calculation Logic:**
```javascript
function calculateFinancialHealth(user) {
  const scores = {
    budgeting: calculateBudgetingScore(), // 0-100
    saving: calculateSavingScore(), // 0-100
    debtManagement: calculateDebtScore(), // 0-100
    investing: calculateInvestingScore(), // 0-100
    cashFlow: calculateCashFlowScore() // 0-100
  }
  
  // Weighted average
  const overall = (
    scores.budgeting * 0.25 +
    scores.saving * 0.25 +
    scores.debtManagement * 0.25 +
    scores.investing * 0.15 +
    scores.cashFlow * 0.10
  )
  
  return {
    overall: Math.round(overall),
    breakdown: scores,
    rating: getRating(overall),
    insights: generateInsights(scores)
  }
}

function calculateBudgetingScore() {
  const budgets = getUserBudgets()
  const onTrack = budgets.filter(b => b.spent <= b.amount).length
  return (onTrack / budgets.length) * 100
}

function calculateSavingScore() {
  const income = getMonthlyIncome()
  const expenses = getMonthlyExpenses()
  const savingsRate = ((income - expenses) / income) * 100
  
  // Score based on savings rate
  if (savingsRate >= 20) return 100
  if (savingsRate >= 15) return 85
  if (savingsRate >= 10) return 70
  if (savingsRate >= 5) return 50
  return Math.max(savingsRate * 5, 0)
}

function calculateDebtScore() {
  const totalDebt = getTotalDebt()
  const monthlyIncome = getMonthlyIncome()
  const debtToIncome = totalDebt / (monthlyIncome * 12)
  
  // Lower debt-to-income = higher score
  if (debtToIncome === 0) return 100
  if (debtToIncome < 1) return 90
  if (debtToIncome < 2) return 75
  if (debtToIncome < 3) return 60
  if (debtToIncome < 4) return 45
  return Math.max(100 - (debtToIncome * 15), 0)
}
```

### 2. Predictive Analytics

**Edge Function: `generate-financial-forecasts`**

**Runs:** Weekly

**Grok API Prompt:**
You are a financial forecasting AI. Analyze historical data and predict future trends.
User's Financial Data (Last 12 months):
{historicalData}
Income Patterns:
{incomePatterns}
Expense Patterns:
{expensePatterns}
Upcoming Commitments:
{upcomingBills}
{upcomingLoanPayments}
Financial Goals:
{goals}
Current Month: {currentMonth}
Provide forecasts in JSON:
{
"spendingForecast": {
"nextMonth": {
"predicted": 4500,
"confidence": 85,
"range": {
"min": 4200,
"max": 4800
},
"breakdown": {
"Food": 800,
"Transport": 600,
"Bills": 1200
}
},
"next3Months": [
{
"month": "July 2024",
"predicted": 4500,
"confidence": 85
}
]
},
"savingsForecast": {
"nextMonth": {
"predicted": 1500,
"confidence": 80,
"based_on": "Average income RM 6,000 - Predicted expenses RM 4,500"
},
"endOfYear": {
"predicted": 18000,
"confidence": 70
}
},
"netWorthProjection": {
"6months": 125000,
"1year": 135000,
"scenarios": {
"conservative": 130000,
"expected": 135000,
"optimistic": 145000
}
},
"insights": [
"Your spending is typically 20% higher in December - plan accordingly",
"You're on track to save RM 18,000 this year",
"Consider increasing emergency fund by RM 2,000"
],
"risks": [
"Variable bill payments may spike in summer months",
"Irregular income could impact savings goals"
],
"opportunities": [
"Extra RM 500/month could accelerate debt payoff by 8 months",
"Reducing dining budget by 15% could save RM 1,800 annually"
]
}

### 3. Smart Insights Generation

**Edge Function: `generate-analytics-insights`**

**Runs:** Daily

**Grok API Prompt:**
Generate actionable financial insights for this user.
Financial Summary:
{financialSummary}
Recent Activity:
{recentTransactions}
Budgets:
{budgets}
Goals:
{goals}
Debts:
{loans}
Provide insights in JSON:
{
"achievements": [
{
"type": "budget",
"message": "Stayed within all budgets this month - excellent!",
"impact": "positive",
"emoji": "🎉"
}
],
"alerts": [
{
"type": "budget_risk",
"priority": "high",
"message": "Food budget at 95% with 5 days remaining",
"recommendation": "Reduce dining out this week",
"potential_saving": 100
}
],
"opportunities": [
{
"type": "savings",
"message": "You could save RM 300/month by refinancing your home loan",
"action": "Check refinancing options",
"impact": 3600
}
],
"patterns": [
{
"observation": "You spend 40% more on weekends",
"suggestion": "Meal prep on Sundays to reduce weekend spending"
}
],
"milestones": [
{
"achievement": "Net worth crossed RM 100,000!",
"date": "2024-06-15",
"celebration": "Major milestone reached"
}
]
}

---

## 📄 REPORT EXPORT FORMATS

### PDF Report Structure:
Cover Page:

App logo
Report Title: "Financial Report"
Period: June 2024
Generated Date
User Name

Summary Page:

Financial Health Score (gauge)
Key Metrics (4-6 cards)
Quick Stats

Charts Pages:

Income vs Expense (full page chart)
Category Breakdown
Net Worth Over Time
Budget Performance
Debt Overview
Investment Performance

Detailed Tables:

Transaction List (paginated)
Budget Variance
Debt Schedule
Investment Holdings

Insights Page:

AI-Generated Insights
Recommendations
Action Items

Footer on every page:

Page number
Report date
Confidential


**PDF Generation:**
- Use library: jsPDF or Puppeteer
- Include charts as images
- Professional formatting
- Brand colors
- Print-ready

### Excel Export Structure:
Workbook with multiple sheets:

Summary
Income
Expenses
Transactions
Budgets
Accounts
Loans
Investments
Net Worth
Charts (embedded)

Each sheet:

Headers (bold, colored)
Data tables
Formulas (SUM, AVERAGE, etc.)
Conditional formatting
Charts where applicable


---

## 📊 CHART LIBRARY

### Web Charts (Recharts):
- Line Chart
- Area Chart
- Bar Chart
- Pie/Donut Chart
- Scatter Chart
- Waterfall Chart
- Composed Chart (multiple types)
- Radar Chart

### Mobile Charts (Victory Native):
- VictoryLine
- VictoryArea
- VictoryBar
- VictoryPie
- VictoryScatter

**Chart Customization:**
- Use global color palette
- Gradient fills
- Glow effects
- Smooth animations
- Interactive tooltips (glass effect)
- Responsive sizing
- Dark/light theme support

---

## 🗄️ DATABASE ADDITIONS
```sql
-- Analytics snapshots for historical data
CREATE TABLE financial_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  snapshot_date DATE NOT NULL,
  snapshot_type TEXT CHECK (snapshot_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  
  -- Financial Summary
  total_income DECIMAL(15, 2),
  total_expenses DECIMAL(15, 2),
  net_savings DECIMAL(15, 2),
  savings_rate DECIMAL(5, 2),
  -- Net Worth
total_assets DECIMAL(15, 2),
total_liabilities DECIMAL(15, 2),
net_worth DECIMAL(15, 2),
-- Budgets
budgets_on_track INTEGER,
budgets_total INTEGER,
budget_adherence_rate DECIMAL(5, 2),
-- Debt
total_debt DECIMAL(15, 2),
monthly_debt_payments DECIMAL(10, 2),
-- Investments
portfolio_value DECIMAL(15, 2),
portfolio_roi DECIMAL(8, 2),
-- Health Score
financial_health_score INTEGER,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, snapshot_date, snapshot_type)
);
CREATE INDEX idx_financial_snapshots_user_date ON financial_snapshots(user_id, snapshot_date DESC);
-- AI-generated insights storage
CREATE TABLE analytics_insights (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
insight_type TEXT CHECK (insight_type IN ('achievement', 'alert', 'opportunity', 'pattern', 'milestone')),
priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
title TEXT NOT NULL,
message TEXT NOT NULL,
recommendation TEXT,
impact_amount DECIMAL(15, 2),
is_read BOOLEAN DEFAULT FALSE,
is_actioned BOOLEAN DEFAULT FALSE,
metadata JSONB,
created_at TIMESTAMPTZ DEFAULT NOW(),
expires_at TIMESTAMPTZ
);
-- Custom reports templates
CREATE TABLE report_templates (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
template_name TEXT NOT NULL,
report_type TEXT,
filters JSONB,
columns JSONB,
charts JSONB,
is_scheduled BOOLEAN DEFAULT FALSE,
schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly')),
schedule_day INTEGER,
schedule_email TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

## 📦 DELIVERABLES

### Web:
1. ✅ Analytics dashboard with all modules
2. ✅ Financial health score calculation
3. ✅ Interactive charts (10+ chart types)
4. ✅ Income & expense analysis
5. ✅ Cash flow analysis
6. ✅ Net worth tracker
7. ✅ Budget performance analysis
8. ✅ Debt analysis dashboard
9. ✅ Investment performance
10. ✅ Category deep dive
11. ✅ Predictions & forecasts
12. ✅ Custom report builder
13. ✅ PDF export
14. ✅ Excel export
15. ✅ Report scheduling

### Mobile:
16. ✅ Analytics screen with modules
17. ✅ Financial health score
18. ✅ Income/Expense analytics
19. ✅ Cash flow analytics
20. ✅ Net worth tracker
21. ✅ Budget performance
22. ✅ Debt analysis
23. ✅ Investment performance
24. ✅ Predictions screen
25. ✅ Custom reports
26. ✅ Export functionality
27. ✅ Charts (Victory Native)

### Backend & AI:
28. ✅ Daily financial snapshots
29. ✅ Financial health score calculation
30. ✅ Predictive analytics (Grok API)
31. ✅ Insights generation (Grok API)
32. ✅ Report generation engine
33. ✅ PDF generation
34. ✅ Excel generation
35. ✅ Scheduled report emails
36. ✅ Historical data aggregation

---

Create all components following global design rules with comprehensive analytics, AI-powered insights using Grok API, predictive forecasting, and professional report generation capabilities.