Following the global rules, create a complete Accounts Management system for bank accounts, credit cards, and wallets with AI-powered analytics, multi-currency support, and real bank logos.

---

## 🎯 OVERVIEW

Build a comprehensive account management system with:
- **Bank Accounts** (Checking, Savings)
- **Credit Cards** (with AI-powered usage analytics and repayment plans)
- **E-Wallets** (Touch 'n Go, GrabPay, Boost, etc.)
- **Cash** (Physical cash tracking)
- Multi-currency support (default: Malaysian Ringgit - MYR)
- Real bank/institution logos
- AI-powered credit card analytics using Grok API
- Smart repayment/settlement planning

---

## 💱 CURRENCY SYSTEM (GLOBAL)

### Default Currency: Malaysian Ringgit (MYR)

**Currency Configuration:**
- Default currency: MYR (RM)
- User can change in Settings
- Store in user profile
- Apply globally across the app

**Supported Currencies (Initial):**
```javascript
const currencies = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
]
```

**Currency Formatting:**
Create utility function `formatCurrency(amount, currency = 'MYR')` that:
- Uses correct symbol (RM for MYR)
- Proper decimal places (2 for most, 0 for JPY)
- Thousands separator (comma)
- Examples:
  - `formatCurrency(1250.50, 'MYR')` → "RM 1,250.50"
  - `formatCurrency(1250.50, 'USD')` → "$1,250.50"
  - `formatCurrency(1250.50, 'JPY')` → "¥1,251"

**Display Across App:**
- All amounts must use formatCurrency()
- Show currency selector in Settings
- Update all displays when currency changed
- Store transactions in their original currency
- Optional: Add conversion rates for multi-currency

---

## 🏦 MALAYSIAN BANKS & INSTITUTIONS

### Bank Logos (Use Official Logos)

**Major Malaysian Banks:**
```javascript
const malaysianBanks = [
  {
    id: 'maybank',
    name: 'Maybank',
    fullName: 'Malayan Banking Berhad',
    logo: 'maybank-logo.png', // Yellow tiger stripes logo
    color: '#FFD700',
    website: 'https://www.maybank.com.my'
  },
  {
    id: 'cimb',
    name: 'CIMB Bank',
    fullName: 'CIMB Bank Berhad',
    logo: 'cimb-logo.png', // Red logo
    color: '#E31837',
    website: 'https://www.cimb.com.my'
  },
  {
    id: 'public-bank',
    name: 'Public Bank',
    fullName: 'Public Bank Berhad',
    logo: 'public-bank-logo.png', // Red/white logo
    color: '#ED1C24',
    website: 'https://www.pbebank.com'
  },
  {
    id: 'rhb',
    name: 'RHB Bank',
    fullName: 'RHB Bank Berhad',
    logo: 'rhb-logo.png', // Blue logo
    color: '#003DA5',
    website: 'https://www.rhbgroup.com'
  },
  {
    id: 'hong-leong',
    name: 'Hong Leong Bank',
    fullName: 'Hong Leong Bank Berhad',
    logo: 'hong-leong-logo.png', // Blue/white logo
    color: '#0047AB',
    website: 'https://www.hlb.com.my'
  },
  {
    id: 'ambank',
    name: 'AmBank',
    fullName: 'AmBank (M) Berhad',
    logo: 'ambank-logo.png', // Red/black logo
    color: '#C8102E',
    website: 'https://www.ambank.com.my'
  },
  {
    id: 'bsn',
    name: 'Bank Simpanan Nasional',
    fullName: 'Bank Simpanan Nasional',
    logo: 'bsn-logo.png', // Blue/yellow logo
    color: '#003DA5',
    website: 'https://www.bsn.com.my'
  },
  {
    id: 'affin',
    name: 'Affin Bank',
    fullName: 'Affin Bank Berhad',
    logo: 'affin-logo.png', // Green logo
    color: '#00A651',
    website: 'https://www.affinbank.com.my'
  },
  {
    id: 'alliance',
    name: 'Alliance Bank',
    fullName: 'Alliance Bank Malaysia Berhad',
    logo: 'alliance-logo.png', // Red logo
    color: '#E31937',
    website: 'https://www.allianceonline.com.my'
  },
  {
    id: 'bank-islam',
    name: 'Bank Islam',
    fullName: 'Bank Islam Malaysia Berhad',
    logo: 'bank-islam-logo.png', // Green logo
    color: '#00A651',
    website: 'https://www.bankislam.com.my'
  },
  {
    id: 'bank-rakyat',
    name: 'Bank Rakyat',
    fullName: 'Bank Rakyat',
    logo: 'bank-rakyat-logo.png', // Orange logo
    color: '#FF6B35',
    website: 'https://www.bankrakyat.com.my'
  },
  {
    id: 'ocbc',
    name: 'OCBC Bank',
    fullName: 'OCBC Bank (Malaysia) Berhad',
    logo: 'ocbc-logo.png', // Red logo
    color: '#EC1C24',
    website: 'https://www.ocbc.com.my'
  },
  {
    id: 'hsbc',
    name: 'HSBC Bank',
    fullName: 'HSBC Bank Malaysia Berhad',
    logo: 'hsbc-logo.png', // Red/white logo
    color: '#DB0011',
    website: 'https://www.hsbc.com.my'
  },
  {
    id: 'standard-chartered',
    name: 'Standard Chartered',
    fullName: 'Standard Chartered Bank Malaysia Berhad',
    logo: 'sc-logo.png', // Green/blue logo
    color: '#007A33',
    website: 'https://www.sc.com/my'
  },
  {
    id: 'uob',
    name: 'UOB Bank',
    fullName: 'United Overseas Bank (Malaysia) Bhd',
    logo: 'uob-logo.png', // Blue logo
    color: '#0B3B8C',
    website: 'https://www.uob.com.my'
  },
  {
    id: 'agro-bank',
    name: 'Agro Bank',
    fullName: 'Bank Pertanian Malaysia Berhad',
    logo: 'agro-bank-logo.png', // Green logo
    color: '#228B22',
    website: 'https://www.agrobank.com.my'
  },
  {
    id: 'muamalat',
    name: 'Bank Muamalat',
    fullName: 'Bank Muamalat Malaysia Berhad',
    logo: 'muamalat-logo.png', // Teal logo
    color: '#008B8B',
    website: 'https://www.muamalat.com.my'
  },
  {
    id: 'other',
    name: 'Other Bank',
    fullName: 'Other Financial Institution',
    logo: 'bank-generic-logo.png', // Generic bank icon
    color: '#6B7280',
    website: ''
  }
]
```

**Credit Card Providers:**
```javascript
const creditCardProviders = [
  {
    id: 'maybank-cc',
    name: 'Maybank Credit Card',
    bank: 'Maybank',
    logo: 'maybank-logo.png',
    color: '#FFD700',
    types: ['Visa', 'Mastercard', 'American Express']
  },
  {
    id: 'cimb-cc',
    name: 'CIMB Credit Card',
    bank: 'CIMB',
    logo: 'cimb-logo.png',
    color: '#E31837',
    types: ['Visa', 'Mastercard']
  },
  {
    id: 'public-bank-cc',
    name: 'Public Bank Credit Card',
    bank: 'Public Bank',
    logo: 'public-bank-logo.png',
    color: '#ED1C24',
    types: ['Visa', 'Mastercard']
  },
  // ... all other banks
  {
    id: 'visa',
    name: 'Visa',
    logo: 'visa-logo.png',
    color: '#1A1F71'
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    logo: 'mastercard-logo.png',
    color: '#EB001B'
  },
  {
    id: 'amex',
    name: 'American Express',
    logo: 'amex-logo.png',
    color: '#006FCF'
  }
]
```

**E-Wallet Providers:**
```javascript
const ewalletProviders = [
  {
    id: 'tng',
    name: 'Touch \'n Go eWallet',
    logo: 'tng-logo.png', // Blue logo
    color: '#1658A6',
    website: 'https://www.touchngo.com.my'
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    logo: 'grabpay-logo.png', // Green logo
    color: '#00B14F',
    website: 'https://www.grab.com/my'
  },
  {
    id: 'boost',
    name: 'Boost',
    logo: 'boost-logo.png', // Purple logo
    color: '#8B21A8',
    website: 'https://www.myboost.com.my'
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    logo: 'shopeepay-logo.png', // Orange logo
    color: '#EE4D2D',
    website: 'https://shopee.com.my'
  },
  {
    id: 'bigpay',
    name: 'BigPay',
    logo: 'bigpay-logo.png', // Blue logo
    color: '#0056D2',
    website: 'https://www.bigpayme.com'
  },
  {
    id: 'mcash',
    name: 'MAE by Maybank',
    logo: 'mae-logo.png', // Yellow logo
    color: '#FFD700',
    website: 'https://www.maybank.com/mae'
  },
  {
    id: 'duitnow',
    name: 'DuitNow',
    logo: 'duitnow-logo.png',
    color: '#FF6B00',
    website: 'https://www.duitnow.my'
  },
  {
    id: 'other-ewallet',
    name: 'Other E-Wallet',
    logo: 'ewallet-generic-logo.png',
    color: '#6B7280',
    website: ''
  }
]
```

**Logo Implementation:**
- Download official logos (PNG with transparent background)
- Store in `/apps/web/public/logos/banks/` and `/apps/mobile/assets/logos/banks/`
- Sizes: 256x256px, 128x128px, 64x64px
- Use `<Image>` component with proper aspect ratio
- Fallback to generic icon if logo not found
- Add subtle shadow/glow effect for glass cards

---

## 🌐 WEB APPLICATION - ACCOUNTS

### Page: /accounts

**Layout:**
- Use DashboardLayout
- Header: "Accounts" title with "Manage your financial accounts" subtitle
- Add Account button (top right, gradient, with + icon)

**Summary Cards Row:**
Display 4 overview cards:
1. **Total Balance** (all accounts combined)
   - Large amount in MYR
   - Trend indicator (+/- vs last month)
   - Icon: Wallet
   
2. **Bank Accounts**
   - Count of bank accounts
   - Total balance in bank accounts
   - Icon: Building/Bank
   
3. **Credit Cards**
   - Count of credit cards
   - Total outstanding balance (in red)
   - Icon: Credit Card
   
4. **E-Wallets**
   - Count of e-wallets
   - Total balance in e-wallets
   - Icon: Smartphone/Mobile

**Account Type Tabs:**
Tabs to filter accounts:
- All Accounts (default)
- Bank Accounts
- Credit Cards
- E-Wallets
- Cash

**Accounts Grid/List:**
Display accounts in grid (desktop: 3 columns, tablet: 2, mobile: 1)

**Each Account Card:**
- Glass effect background
- Bank/Provider logo (top-left, 48px)
- Account type badge (Checking, Savings, Credit, E-Wallet)
- Account name (user-defined, bold)
- Account number (masked: **** **** 1234)
- Current balance (large, colored: green for positive, red for negative/debt)
- Quick actions: View Details, Edit, Delete
- Favorite star icon (toggle)
- Active/Inactive toggle

**Account Card Variants by Type:**

1. **Bank Account Card:**
   - Bank logo
   - Account type (Checking/Savings)
   - Account number
   - Balance
   - Last transaction date
   - "View Transactions" button

2. **Credit Card:**
   - Card provider logo
   - Card network badge (Visa/Mastercard/Amex)
   - Card number (masked)
   - Credit limit progress bar
   - Outstanding balance (red)
   - Available credit (green)
   - Payment due date
   - "View Details" and "Make Payment" buttons
   - AI Insights badge (if available)

3. **E-Wallet Card:**
   - E-wallet provider logo
   - Balance
   - Phone number/email linked
   - Last top-up date
   - "Top Up" button

4. **Cash Account:**
   - Cash icon
   - Current cash on hand
   - Last updated date
   - "Update Balance" button

**Empty State:**
- Large wallet illustration
- "No accounts added yet"
- "Add your first account to start tracking your finances"
- "Add Account" button

### Page: /accounts/new (Add Account)

**Modal Presentation (Full-screen modal)**

**Step 1: Choose Account Type**
Display 4 large cards:
1. Bank Account (Building icon)
2. Credit Card (Credit card icon)
3. E-Wallet (Phone icon)
4. Cash (Banknote icon)

Each card clickable, proceeds to next step

**Step 2A: Bank Account Details**

Form fields:
1. **Bank Selection** (required)
   - Searchable dropdown with logos
   - Display: Logo + Bank Name
   - Options: All Malaysian banks + "Other"
   
2. **Account Type** (required)
   - Radio buttons: Checking, Savings
   
3. **Account Name** (required)
   - Text input
   - Placeholder: "My Salary Account", "Emergency Savings"
   - Max 50 characters
   
4. **Account Number** (optional)
   - Masked input (auto-format with spaces)
   - Last 4 digits shown by default
   
5. **Current Balance** (required)
   - Currency input
   - Default currency: MYR
   - Allow decimal (2 places)
   
6. **Currency** (optional)
   - Dropdown: MYR (default), USD, SGD, etc.
   
7. **Color Theme** (optional)
   - Color picker with presets
   - Default: Bank's brand color
   
8. **Set as Default Account**
   - Toggle switch
   
9. **Include in Total Balance**
   - Toggle switch (default: ON)

**Step 2B: Credit Card Details**

Form fields:
1. **Card Provider/Bank** (required)
   - Searchable dropdown with logos
   
2. **Card Network** (required)
   - Radio buttons with logos: Visa, Mastercard, Amex
   
3. **Card Name** (required)
   - Text input
   - Placeholder: "Maybank Visa Platinum", "CIMB Cash Rebate"
   
4. **Card Number** (optional)
   - Masked input (16 digits, auto-format: **** **** **** 1234)
   - Validation: Luhn algorithm
   
5. **Credit Limit** (required)
   - Currency input in MYR
   
6. **Current Outstanding Balance** (required)
   - Currency input in MYR
   - Cannot exceed credit limit
   
7. **Statement Date** (required)
   - Day of month (1-31)
   - Example: "15th of every month"
   
8. **Payment Due Date** (required)
   - Day of month (1-31)
   - Must be after statement date
   
9. **Minimum Payment Percentage** (optional)
   - Percentage (default: 5%)
   
10. **Interest Rate (APR)** (optional)
    - Percentage (default: 18% for Malaysia)
    
11. **Annual Fee** (optional)
    - Currency input
    - Renewal month
    
12. **Cashback/Rewards Program** (optional)
    - Text area
    - Describe reward structure
    
13. **Enable AI Analytics**
    - Toggle switch (default: ON)
    - "Get smart insights on spending and repayment plans"

**Step 2C: E-Wallet Details**

Form fields:
1. **E-Wallet Provider** (required)
   - Dropdown with logos
   - Options: Touch 'n Go, GrabPay, Boost, ShopeePay, etc.
   
2. **Account Name** (required)
   - Text input
   
3. **Linked Phone/Email** (optional)
   - Text input
   
4. **Current Balance** (required)
   - Currency input in MYR
   
5. **Auto Top-Up** (optional)
   - Toggle switch
   - If ON, show:
     - Top-up amount
     - Trigger threshold
     - Linked payment method

**Step 2D: Cash Account**

Form fields:
1. **Name** (required)
   - Default: "Cash on Hand"
   
2. **Current Amount** (required)
   - Currency input in MYR
   
3. **Location** (optional)
   - Text: "Wallet", "Home Safe", "Office Drawer"

**Actions:**
- Back button
- Cancel button (with confirmation)
- Save button (primary, gradient)

**Validation:**
- All required fields filled
- Balance <= Credit limit (for credit cards)
- Account number format valid
- No duplicate account names

### Page: /accounts/:id (Account Details)

**Layout:**
- Back button to accounts list
- Edit button (top-right)
- Delete button (with confirmation modal)

**Account Header Card:**
- Large bank/provider logo
- Account name (editable inline)
- Account type badge
- Account number (full, with show/hide toggle)
- Created date

**Balance Section:**

For Bank/E-Wallet/Cash:
- Current balance (large, colored)
- Last updated timestamp
- Update Balance button
- Balance history chart (last 30 days line chart)

For Credit Card:
- Credit limit
- Outstanding balance (red, large)
- Available credit (green)
- Utilization percentage (progress bar with color coding:
  - Green: 0-30%
  - Yellow: 31-50%
  - Orange: 51-70%
  - Red: 71-100%)
- Next statement date
- Payment due date countdown
- Minimum payment amount
- Make Payment button (prominent)

**AI Analytics Section (Credit Cards Only):**

Display AI-powered insights:
1. **Spending Pattern Analysis**
   - Most spending categories
   - Average monthly spend
   - Spending trend chart
   
2. **Usage Optimization Tips**
   - "You're using 85% of your credit limit"
   - "Consider requesting a credit limit increase"
   - "Your utilization is high, affecting credit score"
   
3. **Smart Repayment Plan** (See detailed section below)
   - Recommended payment amount
   - Payoff timeline
   - Interest savings
   - Multiple plan options

**Recent Transactions:**
- Last 10 transactions on this account
- Each showing: date, description, category, amount
- "View All Transactions" button

**Account Statistics:**
- Total transactions count
- Most frequent category
- Largest transaction
- Average transaction amount

**Account Settings:**
- Set as default
- Include in total balance
- Color theme
- Notifications preferences
- Archive/Close account

---

## 💳 CREDIT CARD AI ANALYTICS

### AI-Powered Features (Using Grok API)

**1. Spending Pattern Analysis**

**Edge Function: `analyze-credit-card-usage`**

Input:
- Credit card ID
- Date range (last 3-6 months)

Process:
1. Fetch all transactions for this card
2. Group by category
3. Calculate spending trends
4. Call Grok API with transaction data

Grok Prompt:

You are a financial analyst specializing in credit card usage. Analyze this credit card spending data and provide insights.
Credit Card: {cardName}
Credit Limit: RM {creditLimit}
Current Balance: RM {outstandingBalance}
Utilization: {utilization}%
Last 6 months transactions:
{transactionSummary}
Category breakdown:
{categoryBreakdown}
Provide analysis in JSON format:
{
"spendingPatterns": [
{
"category": "Dining",
"percentage": 35,
"trend": "increasing",
"insight": "Your dining expenses have increased by 25% compared to last month"
}
],
"utilizationAnalysis": {
"status": "high" | "moderate" | "healthy",
"recommendation": "string",
"creditScoreImpact": "negative" | "neutral" | "positive"
},
"unusualActivity": [
{
"date": "2024-01-15",
"amount": 500,
"category": "Electronics",
"reason": "Unusually high one-time purchase"
}
],
"topRecommendations": [
"Reduce dining expenses by RM 300 to stay within budget",
"Pay down balance to below 30% utilization for better credit score"
]
}

Display:
- Donut chart showing category breakdown
- Trend line chart (spending over time)
- Alert badges for high utilization
- Insight cards with recommendations

**2. Smart Repayment/Settlement Plan**

**Edge Function: `generate-repayment-plan`**

Input:
- Credit card ID
- Outstanding balance
- Interest rate (APR)
- Monthly income (optional, for affordability check)
- Target payoff timeline (optional)

Process:
1. Calculate minimum payment
2. Generate multiple repayment scenarios
3. Calculate total interest for each scenario
4. Use Grok API for personalized recommendations

Grok Prompt:
You are a debt repayment advisor. Create optimal credit card repayment plans.
Credit Card Details:

Outstanding Balance: RM {balance}
Interest Rate: {apr}% APR
Minimum Payment: RM {minPayment} ({minPaymentPercentage}% of balance)
Monthly Due Date: {dueDate}
User's Monthly Income: RM {income} (optional)

Create 3 repayment plans:

Aggressive (pay off in 6 months)
Balanced (pay off in 12 months)
Conservative (pay off in 24 months)

For each plan, calculate:

Monthly payment amount
Total interest paid
Payoff date
Monthly budget impact

Also provide:

Snowball vs Avalanche strategy recommendation
Money-saving tips
Debt consolidation consideration

Return JSON format:
{
"plans": [
{
"name": "Aggressive",
"monthlyPayment": 850,
"duration": 6,
"totalInterest": 245,
"payoffDate": "2024-07-01",
"pros": ["Save RM XXX in interest", "Debt-free faster"],
"cons": ["Higher monthly commitment"]
}
],
"recommendations": [
"Start with the Balanced plan for sustainable repayment",
"Consider balance transfer to 0% APR card to save interest"
],
"budgetAdjustments": [
"Reduce dining budget by RM 200",
"Cancel unused subscriptions to free up RM 50"
]
}
**Display Components:**

**Repayment Plan Comparison Table:**
| Plan | Monthly Payment | Duration | Total Interest | Savings vs Minimum |
|------|----------------|----------|----------------|-------------------|
| Aggressive | RM 850 | 6 months | RM 245 | RM 1,200 |
| Balanced | RM 450 | 12 months | RM 480 | RM 965 |
| Conservative | RM 250 | 24 months | RM 950 | RM 495 |
| Minimum Only | RM 125 | 48 months | RM 1,445 | - |

**Interactive Slider:**
- User adjusts monthly payment amount
- Real-time calculation of:
  - Payoff timeline
  - Total interest
  - Next payment date
- Visual progress bar showing debt reduction

**Payment Calendar:**
- Monthly view
- Mark payment due dates
- Show declining balance over time
- Celebration milestone badges (25%, 50%, 75%, 100% paid)

**Budget Impact Analysis:**
- Pie chart: Income allocation
  - Repayment amount
  - Essential expenses
  - Discretionary spending
  - Savings
- Alert if repayment > 30% of income

**Smart Notifications:**
- 7 days before due date
- 3 days before due date
- On due date
- If balance increases instead of decreases
- Milestone achievements
- Better repayment opportunity alerts

---

## 📱 MOBILE APPLICATION - ACCOUNTS

### Screen: AccountsScreen (Tab Navigator)

**Header:**
- Title: "Accounts"
- Add FAB (floating, bottom-right)
- Search icon (top-right)

**Total Balance Card:**
- Horizontal scrollable carousel
- Show total across all account types
- Swipe to see breakdown by type

**Account Type Filter:**
- Horizontal scrollable chips
- All, Banks, Credit Cards, E-Wallets, Cash
- Active chip highlighted

**Accounts List:**
- FlatList with account cards
- Pull-to-refresh
- Each card:
  - Bank logo (left)
  - Account name and type
  - Balance (right, colored)
  - Swipe actions: Edit, Delete
  - Tap to view details

**Quick Stats Row:**
- 3 small stat cards
- Total Accounts count
- Total Assets (banks + wallets + cash)
- Total Liabilities (credit cards outstanding)

### Screen: AddAccountScreen (Modal)

**Step 1: Account Type Selection**
- 4 large cards (vertically stacked)
- Each with icon, title, description
- Tap to select and proceed

**Step 2: Account Details Form**
- Scrollable form
- Fields based on account type
- Bank/Provider selector (bottom sheet)
- Currency input with large display
- Save button (sticky bottom)
- Keyboard-aware scroll

**Bank/Provider Selector (Bottom Sheet):**
- Search bar at top
- Grid of logos (3 columns)
- Bank name below each logo
- Popular banks at top
- Alphabetically sorted

### Screen: AccountDetailScreen

**Scrollable Content:**

**Hero Card:**
- Large bank logo
- Account name (editable)
- Account type badge
- Balance (large, centered)

For Credit Cards:
- Credit limit bar
- Outstanding balance
- Available credit
- Utilization percentage ring
- Payment due countdown

**Action Buttons:**
- Edit Account
- View Transactions
- Make Payment (credit cards)
- Update Balance (bank/wallet/cash)
- Share Account Details

**AI Insights Card (Credit Cards):**
- Spending breakdown chart
- Top 3 recommendations
- "View Full Analysis" button → opens full analytics screen

**Repayment Plan Card (Credit Cards):**
- Quick plan summary
- Current recommended payment
- "View All Plans" button

**Recent Transactions:**
- Last 5 transactions
- "View All" button

### Screen: CreditCardAnalyticsScreen (Full Analytics)

**Tabs:**
1. **Overview**
   - Spending pattern chart
   - Category breakdown
   - Month-over-month comparison
   
2. **Repayment Plans**
   - 3 plan options (cards)
   - Interactive payment slider
   - Payment calendar
   
3. **Insights**
   - AI-generated tips
   - Unusual transactions
   - Optimization suggestions

**Charts (using Victory Native):**
- Donut chart for categories
- Line chart for spending trends
- Bar chart for month comparison

### Bottom Sheet: RepaymentPlanSelector

**Content:**
- 3 plan cards (Aggressive, Balanced, Conservative)
- Each showing:
  - Monthly payment
  - Duration
  - Total interest
  - Pros & cons
- Compare button
- Select button for each

---

Please take note - tabels are not created in superbase yet. please guide me to create them according to the requirement.

## 🔄 DATA STRUCTURE

### Database Schema

**accounts table:**
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('bank_checking', 'bank_savings', 'credit_card', 'ewallet', 'cash')),
  
  -- Financial Data
  balance DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'MYR',
  
  -- Bank/Provider Info
  institution_id TEXT, -- Links to malaysianBanks array
  institution_name TEXT,
  institution_logo TEXT,
  institution_color TEXT,
  
  -- Account Details
  account_number TEXT,
  account_number_masked TEXT, -- **** **** 1234

-- Credit Card Specific
credit_limit DECIMAL(15, 2),
statement_date INTEGER, -- Day of month
payment_due_date INTEGER, -- Day of month
minimum_payment_percentage DECIMAL(5, 2) DEFAULT 5.00,
interest_rate DECIMAL(5, 2), -- APR
annual_fee DECIMAL(10, 2),
card_network TEXT, -- visa, mastercard, amex
-- E-Wallet Specific
linked_phone TEXT,
linked_email TEXT,
-- Settings
is_default BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
include_in_total BOOLEAN DEFAULT TRUE,
color TEXT DEFAULT '#0066FF',
-- AI Features
enable_ai_analytics BOOLEAN DEFAULT TRUE,
-- Metadata
notes TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_type ON accounts(account_type);

**credit_card_analytics table:**
```sql
CREATE TABLE credit_card_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  analysis_date DATE DEFAULT CURRENT_DATE,
  
  -- Analysis Data (JSON from Grok)
  spending_patterns JSONB,
  utilization_analysis JSONB,
  unusual_activity JSONB,
  recommendations JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**repayment_plans table:**
```sql
CREATE TABLE repayment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  
  plan_name TEXT, -- aggressive, balanced, conservative
  monthly_payment DECIMAL(10, 2),
  duration_months INTEGER,
  total_interest DECIMAL(10, 2),
  payoff_date DATE,
  
  -- AI Generated
  pros JSONB,
  cons JSONB,
  budget_adjustments JSONB,
  
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🤖 GROK API EDGE FUNCTIONS

### 1. Analyze Credit Card Usage

**Function:** `/supabase/functions/analyze-credit-card-usage/index.ts`

**Process:**
1. Get credit card account details
2. Fetch last 6 months of transactions
3. Calculate category totals and trends
4. Call Grok API with structured data
5. Parse JSON response
6. Save to `credit_card_analytics` table
7. Return insights

### 2. Generate Repayment Plans

**Function:** `/supabase/functions/generate-repayment-plan/index.ts`

**Process:**
1. Get credit card balance, APR, minimum payment
2. Calculate 3 plan scenarios
3. Call Grok API for personalized recommendations
4. Calculate interest for each plan
5. Save to `repayment_plans` table
6. Return all plans

---

## 🎨 UI/UX SPECIFICATIONS

### Account Cards Design

**Web:**
- Glass effect with backdrop blur
- Bank logo: 64px, rounded, shadow
- Hover: lift 4px, increase shadow
- Credit card variant: Show utilization bar
- Gradient border for favorite accounts

**Mobile:**
- Card height: 120px
- Logo: 48px
- Swipe threshold: 80px
- Haptic feedback on swipe
- Long-press for quick actions

### Colors by Account Type
```javascript
const accountTypeColors = {
  bank_checking: '#0066FF',
  bank_savings: '#10B981',
  credit_card: '#EF4444',
  ewallet: '#8B5CF6',
  cash: '#F59E0B'
}
```

### Animations

**Web:**
- Account cards stagger in (100ms delay)
- Balance update: count-up animation
- Charts: animate paths on mount
- Plan comparison: slide in from sides

**Mobile:**
- Pull-to-refresh: smooth rotation
- Card swipe: spring animation
- Balance update: scale pulse
- Plan selector: slide up from bottom

---

## 📊 CHARTS & VISUALIZATIONS

### Credit Card Analytics Charts

**1. Spending Breakdown (Donut Chart)**
- Inner: Total spent
- Outer: Category segments
- Colors from category definitions
- Interactive: tap segment for details

**2. Utilization Gauge**
- Semi-circle gauge
- Color zones:
  - 0-30%: Green
  - 31-50%: Yellow
  - 51-70%: Orange
  - 71-100%: Red
- Needle pointing to current percentage

**3. Spending Trend (Line Chart)**
- Last 6 months
- Smooth curve
- Gradient fill below line
- Show payment dates as markers

**4. Repayment Timeline**
- Horizontal bar showing months
- Progress fills as payments made
- Milestone markers (25%, 50%, 75%)

---

## 📦 DELIVERABLES

### Web:
1. ✅ Accounts list page with all account types
2. ✅ Add account wizard (multi-step)
3. ✅ Account detail pages (different for each type)
4. ✅ Credit card analytics dashboard
5. ✅ Repayment plan comparison
6. ✅ Bank/provider selector with real logos
7. ✅ Currency formatter (global)
8. ✅ Edit account form
9. ✅ Delete confirmation

### Mobile:
10. ✅ Accounts list screen
11. ✅ Add account screen (step-by-step)
12. ✅ Account detail screen
13. ✅ Credit card analytics screen
14. ✅ Repayment plan bottom sheet
15. ✅ Bank/provider selector bottom sheet
16. ✅ Swipe actions
17. ✅ Pull-to-refresh

### Backend:
18. ✅ Database schema and migrations
19. ✅ Supabase RLS policies
20. ✅ Edge function: analyze-credit-card-usage
21. ✅ Edge function: generate-repayment-plan
22. ✅ CRUD operations for accounts
23. ✅ Balance update triggers

### Assets:
24. ✅ All Malaysian bank logos (PNG, transparent)
25. ✅ Credit card network logos
26. ✅ E-wallet provider logos
27. ✅ Generic fallback icons

---

## 🔐 SECURITY

**Sensitive Data:**
- Encrypt account numbers at rest
- Never expose full account numbers in API responses
- Mask by default, show only last 4 digits
- Require authentication for full number reveal
- Log all access to sensitive fields

**RLS Policies:**
```sql
-- Users can only see their own accounts
CREATE POLICY "Users can view own accounts"
ON accounts FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own accounts
CREATE POLICY "Users can insert own accounts"
ON accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

Create all components following global design rules with Malaysian bank branding, multi-currency support (default MYR), and AI-powered credit card analytics.

