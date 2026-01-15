Following the global rules, create a comprehensive Bills Management system with Malaysian utility providers, payment tracking, reminders, auto-budget sync, and AI-powered bill predictions for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete bill management system that allows users to:
- Track recurring bills (TNB, Indah Water, TIME, TM, Astro, etc.)
- Manage both fixed and variable payment amounts
- Set payment due date reminders
- Auto-sync bills with budgets (Bills & Utilities category)
- Get AI-powered bill amount predictions for variable bills
- Track payment history and trends
- Receive smart notifications before due dates
- Mark bills as paid and link to transactions
- Detect unusual bill amounts
- Multi-currency support (default: MYR)

---

## 🏢 MALAYSIAN BILL PROVIDERS

### Utility & Service Providers (Use Official Logos)
```javascript
const malaysianBillProviders = [
  // Electricity
  {
    id: 'tnb',
    name: 'TNB',
    fullName: 'Tenaga Nasional Berhad',
    category: 'Electricity',
    logo: 'tnb-logo.png', // Yellow lightning logo
    color: '#FFD700',
    website: 'https://www.tnb.com.my',
    paymentMethods: ['Online Banking', 'ATM', 'TNB App', 'Auto Debit'],
    isVariable: true, // Bill amount varies
    averageAmount: 150, // Average monthly bill in MYR
    dueDay: null // Varies by customer
  },
  {
    id: 'sabah-electricity',
    name: 'SESB',
    fullName: 'Sabah Electricity Sdn Bhd',
    category: 'Electricity',
    logo: 'sesb-logo.png',
    color: '#0066CC',
    website: 'https://www.sesb.com.my',
    paymentMethods: ['Online Banking', 'ATM', 'Counter'],
    isVariable: true,
    averageAmount: 120
  },
  {
    id: 'sarawak-electricity',
    name: 'SEB',
    fullName: 'Sarawak Energy Berhad',
    category: 'Electricity',
    logo: 'seb-logo.png',
    color: '#00A651',
    website: 'https://www.sarawakenergy.com',
    paymentMethods: ['Online Banking', 'ATM', 'Counter'],
    isVariable: true,
    averageAmount: 130
  },

  // Water
  {
    id: 'air-selangor',
    name: 'Air Selangor',
    fullName: 'Air Selangor Sdn Bhd',
    category: 'Water',
    logo: 'air-selangor-logo.png',
    color: '#0066CC',
    website: 'https://www.airselangor.com',
    paymentMethods: ['Online Banking', 'ATM', 'JomPAY'],
    isVariable: true,
    averageAmount: 30
  },
  {
    id: 'indah-water',
    name: 'Indah Water',
    fullName: 'Indah Water Konsortium',
    category: 'Sewerage',
    logo: 'indah-water-logo.png',
    color: '#0099CC',
    website: 'https://www.iwk.com.my',
    paymentMethods: ['Online Banking', 'ATM', 'JomPAY'],
    isVariable: false, // Fixed monthly
    averageAmount: 8,
    dueDay: 15 // Usually 15th of month
  },
  {
    id: 'sab',
    name: 'SAJ',
    fullName: 'SAJ Holdings Sdn Bhd',
    category: 'Water',
    logo: 'saj-logo.png',
    color: '#0066CC',
    website: 'https://www.saj.com.my',
    paymentMethods: ['Online Banking', 'Counter'],
    isVariable: true,
    averageAmount: 25
  },
  {
    id: 'pba',
    name: 'PBA',
    fullName: 'Perbadanan Bekalan Air Pulau Pinang',
    category: 'Water',
    logo: 'pba-logo.png',
    color: '#0099FF',
    website: 'https://www.pba.com.my',
    paymentMethods: ['Online Banking', 'Counter'],
    isVariable: true,
    averageAmount: 20
  },

  // Internet & TV
  {
    id: 'time',
    name: 'TIME',
    fullName: 'TIME dotCom Berhad',
    category: 'Internet',
    logo: 'time-logo.png',
    color: '#FF0000',
    website: 'https://www.time.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
    isVariable: false, // Fixed package
    averageAmount: 139,
    dueDay: 1 // Usually 1st of month
  },
  {
    id: 'tm',
    name: 'TM',
    fullName: 'Telekom Malaysia',
    category: 'Internet & Phone',
    logo: 'tm-logo.png',
    color: '#E31937',
    website: 'https://www.tm.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit', 'TM App'],
    isVariable: false,
    averageAmount: 129,
    dueDay: 1
  },
  {
    id: 'maxis',
    name: 'Maxis',
    fullName: 'Maxis Broadband',
    category: 'Internet & Mobile',
    logo: 'maxis-logo.png',
    color: '#00A651',
    website: 'https://www.maxis.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
    isVariable: false,
    averageAmount: 99
  },
  {
    id: 'celcom',
    name: 'Celcom',
    fullName: 'Celcom Axiata Berhad',
    category: 'Mobile & Internet',
    logo: 'celcom-logo.png',
    color: '#0066CC',
    website: 'https://www.celcom.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
    isVariable: false,
    averageAmount: 88
  },
  {
    id: 'digi',
    name: 'Digi',
    fullName: 'Digi Telecommunications',
    category: 'Mobile & Internet',
    logo: 'digi-logo.png',
    color: '#FFD700',
    website: 'https://www.digi.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
    isVariable: false,
    averageAmount: 75
  },
  {
    id: 'unifi',
    name: 'Unifi',
    fullName: 'Unifi by TM',
    category: 'Internet & TV',
    logo: 'unifi-logo.png',
    color: '#E31937',
    website: 'https://unifi.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
    isVariable: false,
    averageAmount: 199
  },
  {
    id: 'astro',
    name: 'Astro',
    fullName: 'Astro Malaysia Holdings',
    category: 'TV & Streaming',
    logo: 'astro-logo.png',
    color: '#FF6600',
    website: 'https://www.astro.com.my',
    paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
    isVariable: false,
    averageAmount: 99
  },

  // Insurance
  {
    id: 'prudential',
    name: 'Prudential',
    fullName: 'Prudential Assurance Malaysia',
    category: 'Insurance',
    logo: 'prudential-logo.png',
    color: '#ED1C24',
    website: 'https://www.prudential.com.my',
    paymentMethods: ['Credit Card', 'Auto Debit', 'Bank Transfer'],
    isVariable: false,
    averageAmount: 300
  },
  {
    id: 'aia',
    name: 'AIA',
    fullName: 'AIA Malaysia',
    category: 'Insurance',
    logo: 'aia-logo.png',
    color: '#E4002B',
    website: 'https://www.aia.com.my',
    paymentMethods: ['Credit Card', 'Auto Debit', 'Bank Transfer'],
    isVariable: false,
    averageAmount: 350
  },
  {
    id: 'great-eastern',
    name: 'Great Eastern',
    fullName: 'Great Eastern Life Assurance',
    category: 'Insurance',
    logo: 'great-eastern-logo.png',
    color: '#D71920',
    website: 'https://www.greateasternlife.com',
    paymentMethods: ['Credit Card', 'Auto Debit', 'Bank Transfer'],
    isVariable: false,
    averageAmount: 280
  },

  // Subscriptions
  {
    id: 'netflix',
    name: 'Netflix',
    fullName: 'Netflix Malaysia',
    category: 'Streaming',
    logo: 'netflix-logo.png',
    color: '#E50914',
    website: 'https://www.netflix.com',
    paymentMethods: ['Credit Card'],
    isVariable: false,
    averageAmount: 55
  },
  {
    id: 'spotify',
    name: 'Spotify',
    fullName: 'Spotify Premium',
    category: 'Music Streaming',
    logo: 'spotify-logo.png',
    color: '#1DB954',
    website: 'https://www.spotify.com',
    paymentMethods: ['Credit Card'],
    isVariable: false,
    averageAmount: 17.90
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    fullName: 'Disney+ Hotstar',
    category: 'Streaming',
    logo: 'disney-plus-logo.png',
    color: '#113CCF',
    website: 'https://www.hotstar.com',
    paymentMethods: ['Credit Card'],
    isVariable: false,
    averageAmount: 54.90
  },

  // Other
  {
    id: 'custom',
    name: 'Custom Bill',
    fullName: 'Other Service Provider',
    category: 'Other',
    logo: 'bill-generic-logo.png',
    color: '#6B7280',
    website: '',
    paymentMethods: ['Custom'],
    isVariable: false,
    averageAmount: 100
  }
]
```

---

## 🌐 WEB APPLICATION - BILLS

### Page: /bills

**Layout:**
- Use DashboardLayout
- Header: "Bills & Payments" with subtitle "Manage recurring bills and never miss a payment"
- Action buttons: Add Bill, Payment Calendar, Settings

**Overview Cards Row:**
Display 4 summary cards:

1. **Total Monthly Bills**
   - Sum of all bills (fixed + average variable)
   - Icon: Receipt
   - Color: Blue gradient
   
2. **Due This Month**
   - Count of bills due
   - Total amount due
   - Icon: Calendar
   - Color: Orange
   
3. **Paid This Month**
   - Count of paid bills
   - Total paid amount
   - Icon: CheckCircle
   - Color: Green
   
4. **Overdue Bills**
   - Count of unpaid bills past due date
   - Total overdue amount
   - Icon: AlertTriangle
   - Color: Red (pulsing if overdue exists)

**Bills Timeline (Current Month):**
- Horizontal timeline showing days of month
- Bill markers on due dates
- Color-coded: Paid (green), Upcoming (blue), Overdue (red)
- Click marker to see bill details
- Today indicator (vertical line)

**Filter & Sort Bar:**
- Status filter: All, Upcoming, Paid, Overdue
- Category filter: Electricity, Water, Internet, Insurance, etc.
- Provider filter: TNB, TIME, TM, etc.
- Sort: Due Date, Amount, Provider

**Bills List/Grid:**
Display bills as cards (Grid: 3 columns desktop, 2 tablet, 1 mobile)

**Each Bill Card Contains:**
- Provider logo (48px, rounded)
- Provider name (bold)
- Bill category badge (Electricity, Water, Internet, etc.)
- Account number (masked: **** 1234)
- Payment type badge: "Fixed" or "Variable"
- Bill amount:
  - Fixed: Exact amount "RM 139.00"
  - Variable: "~RM 150" with "avg" badge
- Due date (large, bold)
- Days until due (countdown)
- Payment status indicator:
  - Unpaid (gray)
  - Due soon (< 7 days, yellow)
  - Overdue (red, pulsing)
  - Paid (green checkmark)
- Payment history chart (mini sparkline - last 12 months)
- Quick actions menu: Mark as Paid, Edit, Delete, View History
- Auto-pay badge (if enabled)

**Bill Card Variants by Status:**

1. **Unpaid (Upcoming):**
   - Gray border
   - "Due in X days"
   - "Mark as Paid" button

2. **Due Soon (< 7 days):**
   - Yellow border glow
   - Warning icon
   - "Due in X days" (bold, orange)
   - "Pay Now" button (prominent)

3. **Overdue:**
   - Red border glow
   - Pulsing animation
   - "Overdue by X days" (red, bold)
   - "Pay Immediately" button (red, urgent)

4. **Paid:**
   - Green border
   - Checkmark icon
   - "Paid on [date]"
   - Green badge

**Monthly Bills Calendar:**
- Full month calendar view
- Bills shown as colored dots on due dates
- Clicking date shows all bills due that day
- Paid bills have checkmarks
- Overdue bills have warning icons

**Bills by Category Section:**
Accordion or tabs showing:
- Utilities (Electricity, Water, Sewerage)
- Internet & TV
- Mobile & Phone
- Insurance
- Subscriptions
- Other

Each section shows total for category and bill count

**Empty State:**
- Bill illustration
- "No bills added yet"
- "Add your first recurring bill to stay on top of payments"
- "Add Bill" button

### Page: /bills/new (Add Bill)

**Modal Presentation (Full-screen or large modal)**

**Step 1: Choose Provider**

**Search Bar:**
- Search by provider name
- Filter by category (dropdown)

**Provider Grid:**
- Display provider logos (4 columns)
- Each showing: Logo, Name, Category
- Popular providers at top
- "Custom Bill" option at bottom

**Step 2: Bill Details**

Form fields:

1. **Provider** (pre-filled from Step 1)
   - Display logo and name
   - Change button if user wants to select different

2. **Bill Name** (required)
   - Auto-filled from provider (e.g., "TNB Electricity Bill")
   - User can customize
   - Max 50 characters

3. **Account Number** (optional)
   - Masked input
   - Last 4 digits shown
   - For reference only

4. **Bill Category** (required)
   - Dropdown: Electricity, Water, Internet, Insurance, etc.
   - Auto-selected based on provider
   - Links to budget category

5. **Payment Type** (required)
   - Radio buttons:
     - **Fixed Amount** (same every month)
     - **Variable Amount** (changes each month)

6. **Bill Amount** (required)
   - If Fixed: Exact amount input
   - If Variable: Estimated/Average amount input
   - Currency: MYR (default)
   - Show: "This will be used for budgeting"

7. **Due Date** (required)
   - **Option A:** Specific day of month (1-31)
     - Dropdown: 1st, 5th, 10th, 15th, 20th, 25th, 30th
     - Custom day input
   - **Option B:** Variable due date
     - "Receive bill notification first"
     - User sets due date when bill arrives

8. **First Bill Date** (required)
   - Date picker
   - Defaults to next occurrence of due day

9. **Payment Method** (optional)
   - Dropdown: Online Banking, Credit Card, Auto Debit, Cash
   - Linked account selector

10. **Auto-Pay Enabled**
    - Toggle switch
    - If ON:
      - Payment account selector
      - Auto-deduct on due date

11. **Reminder Settings**
    - Days before due date: Multi-select chips
      - 7 days, 3 days, 1 day, On due date
    - Notification channels:
      - Push notification
      - Email
      - SMS (optional)

12. **Budget Integration**
    - Auto-create budget toggle
    - If ON:
      - Add to "Bills & Utilities" budget
      - Create separate budget for this bill
    - Budget amount synced with bill amount

13. **Notes** (optional)
    - Textarea for additional info
    - Payment instructions
    - Account details

**Step 3: AI Prediction (Variable Bills Only)**

If bill is variable:
- "Analyzing your estimated amount..."
- AI suggests amount based on:
  - Provider's average
  - User's stated estimate
  - Seasonal patterns (e.g., higher TNB in hot months)
- Show prediction with confidence level
- User can accept or modify

**Actions:**
- Cancel button
- Back button (to Step 1)
- Save Bill button (primary gradient)
- Save & Mark First Payment button

**Validation:**
- Provider selected
- Bill name filled
- Amount > 0
- Due date valid
- Payment type selected

### Page: /bills/:id (Bill Details)

**Layout:**
- Back button to bills list
- Edit and Delete buttons (top-right)

**Bill Header Card:**
- Large provider logo (64px)
- Provider name (editable inline)
- Category badge
- Account number (full, with show/hide toggle)

**Current Bill Status:**
- Payment type: Fixed/Variable
- Current amount (large, bold)
- Due date (countdown if unpaid)
- Status: Paid, Unpaid, Overdue
- If unpaid: "Mark as Paid" button (prominent)
- If paid: Payment date and method
- Link to transaction (if exists)

**Payment Information:**
- Due day of month
- Next payment date
- Payment method
- Auto-pay status
- Reminder settings

**Payment History:**
- Table showing last 12 months
- Columns: Month, Amount, Due Date, Paid Date, Status, Transaction
- Export history button
- Filter by year

**Payment Trend Chart:**
- Line chart showing bill amounts over time
- For variable bills: Shows variation
- For fixed bills: Flat line (any increases noted)
- Average line (dotted)
- Highlight unusual amounts

**Statistics:**
- Average monthly amount (variable bills)
- Total paid this year
- Highest bill (amount and month)
- Lowest bill (amount and month)
- On-time payment rate (percentage)

**AI Insights (Variable Bills):**
- Spending pattern: "Your TNB bills are typically 20% higher in summer months"
- Prediction: "Next month estimated: RM 165 (±10%)"
- Anomaly detection: "Last month's bill was 30% higher than usual"
- Recommendations: "Consider setting up auto-debit to avoid late fees"

**Budget Link:**
- Show associated budget (if linked)
- Budget progress for this bill category
- Quick link to budget details

**Upcoming Payments:**
- Next 6 scheduled payments
- Date and estimated amount
- Set reminders for each

---

## 📱 MOBILE APPLICATION - BILLS

### Screen: BillsScreen (Tab Navigator or Standalone)

**Header:**
- Title: "Bills"
- Calendar icon (opens payment calendar)
- Add FAB (floating action button)

**Summary Cards Carousel:**
- Horizontal scrollable
- 4 cards: Total Monthly, Due This Month, Paid, Overdue
- Each with icon, amount, label
- Gradient backgrounds

**This Month Timeline:**
- Horizontal scrollable timeline
- Days 1-31 of current month
- Bill markers on due dates
- Color-coded by status
- Tap marker to see details
- Today highlighted

**Filter Chips:**
- Horizontal scrollable chips
- All, Upcoming, Paid, Overdue
- By category chips
- Active chip highlighted

**Bills List:**
- FlatList grouped by status (Overdue, Due Soon, Upcoming, Paid)
- Section headers sticky
- Pull-to-refresh
- Each bill card:
  - Provider logo (left, 40px)
  - Provider name and category
  - Amount (right, colored)
  - Due date or "Paid on [date]"
  - Status badge
  - Swipe actions: Mark Paid, Edit, Delete
  - Tap to view details

**Quick Actions:**
- "Pay All Due" button (if multiple unpaid)
- "View Calendar" button

**Empty State:**
- Bill illustration
- "No bills yet"
- "Add Bill" button

### Screen: AddBillScreen (Modal)

**Full-screen modal presentation**

**Step 1: Select Provider**
- Search bar at top
- Category filter chips
- Grid of provider logos (3 columns)
- Each with logo and name
- Tap to select

**Step 2: Bill Details Form**
- Scrollable form
- Provider display (with logo)
- Bill name input
- Account number input
- Category selector (bottom sheet)
- Payment type selector (Fixed/Variable)
- Amount input (large, centered)
- Due date picker (bottom sheet)
- Payment method selector
- Auto-pay toggle
- Reminder settings (expandable)
- Budget integration toggle
- Notes input

**Step 3: Review & Save**
- Summary card showing all details
- Edit buttons for each field
- Save button (gradient, sticky bottom)

**Actions:**
- Close button (top-left)
- Back button (each step)
- Save button (bottom, sticky)

### Screen: BillDetailScreen

**Scrollable content:**

**Header:**
- Large provider logo
- Provider name
- Category badge
- Status badge

**Current Status Card:**
- Payment type (Fixed/Variable)
- Current amount (large)
- Due date countdown
- "Mark as Paid" button (if unpaid)
- Payment method display

**Quick Stats Row:**
- 3 small cards (1 row)
- Avg amount (variable bills)
- Total this year
- On-time rate

**Payment History:**
- Last 6 payments (list)
- Each showing: Month, Amount, Status
- "View All" button

**Trend Chart:**
- Line chart (last 12 months)
- Amount variation
- Victory Native chart

**Action Buttons:**
- Edit Bill
- View Transactions
- Payment History
- Delete Bill (danger)

### Bottom Sheet: MarkAsPaid

**Content:**
- Bill name and amount
- Payment date picker (default: today)
- Payment method selector
- Paid amount input (pre-filled, editable for variable bills)
- Link to transaction toggle
  - If ON: Create transaction automatically
  - Select account
  - Add notes
- Mark as Paid button (gradient)
- Close button

### Bottom Sheet: PaymentCalendar

**Content:**
- Month selector (swipeable)
- Calendar grid (7x5)
- Bills shown as colored dots on dates
- Legend: Paid, Upcoming, Overdue
- Tap date to see bills due that day
- Bottom section shows tapped date's bills

---

## 🔄 AUTO-SYNC WITH BUDGETS

### Budget Integration Logic

**When Bill is Created:**
1. Check if "Bills & Utilities" budget exists
2. If YES:
   - Add bill amount to budget calculation
   - Update budget alert thresholds
3. If NO:
   - Prompt user to create "Bills & Utilities" budget
   - Auto-fill with total monthly bills amount

**When Bill is Paid:**
1. Automatically create transaction:
   - Type: Expense
   - Category: Bills & Utilities (or specific category)
   - Amount: Bill amount
   - Description: "[Provider] Bill - [Month]"
   - Date: Payment date
   - Account: Selected payment account
2. Link transaction to bill record
3. Update budget spent amount
4. Deduct from account balance

**When Bill Amount Changes (Variable Bills):**
1. Recalculate budget if bill linked
2. Update budget amount if significant change (>20%)
3. Notify user of budget impact
4. Suggest budget adjustment

**Monthly Budget Calculation:**
```javascript
function calculateBillsBudget(bills) {
  const fixedBills = bills.filter(b => !b.isVariable)
  const variableBills = bills.filter(b => b.isVariable)
  
  const fixedTotal = fixedBills.reduce((sum, b) => sum + b.amount, 0)
  const variableAvg = variableBills.reduce((sum, b) => sum + b.estimatedAmount, 0)
  
  // Add 10% buffer for variable bills
  const variableTotal = variableAvg * 1.1
  
  return {
    total: fixedTotal + variableTotal,
    fixed: fixedTotal,
    variable: variableTotal,
    breakdown: {
      electricity: calculateByCategory('Electricity'),
      water: calculateByCategory('Water'),
      internet: calculateByCategory('Internet'),
      // ...
    }
  }
}
```

**Budget Dashboard Integration:**
Show bills section in budget page:
- "Bills Budget: RM X / month"
- Breakdown by category
- Paid vs Unpaid this month
- Click to see all bills

---

## 🤖 AI-POWERED FEATURES

### 1. Bill Amount Prediction (Variable Bills)

**Edge Function: `predict-bill-amount`**

**Input:**
- Bill ID
- Provider
- Historical amounts (last 12 months)
- Current month/season
- User's usage patterns (if available)

**Grok API Prompt:**

You are a utility bill analyst. Predict next month's bill amount based on historical data and patterns.
Provider: {providerName}
Bill Type: {category}
Historical amounts (last 12 months):
{amounts}
Current month: {currentMonth}
User's typical usage: {usagePattern}
Seasonal factors: {seasonalData}
Provide prediction in JSON:
{
"predictedAmount": 165.50,
"confidence": 85,
"range": {
"min": 145,
"max": 185
},
"reasoning": "Based on historical summer usage, expecting 20% increase",
"factors": [
"Summer month - typically higher AC usage",
"Last 3 months trending upward",
"Similar pattern to last year same month"
],
"recommendations": [
"Set budget buffer of RM 20",
"Consider energy-saving measures to reduce cost"
]
}
You are a utility bill analyst. Predict next month's bill amount based on historical data and patterns.
Provider: {providerName}
Bill Type: {category}
Historical amounts (last 12 months):
{amounts}
Current month: {currentMonth}
User's typical usage: {usagePattern}
Seasonal factors: {seasonalData}
Provide prediction in JSON:
{
"predictedAmount": 165.50,
"confidence": 85,
"range": {
"min": 145,
"max": 185
},
"reasoning": "Based on historical summer usage, expecting 20% increase",
"factors": [
"Summer month - typically higher AC usage",
"Last 3 months trending upward",
"Similar pattern to last year same month"
],
"recommendations": [
"Set budget buffer of RM 20",
"Consider energy-saving measures to reduce cost"
]
}
**Display:**
- Predicted amount with confidence gauge
- Range (min-max)
- Reasoning cards
- Compare to last month/year
- Budget impact warning if higher than budget

### 2. Unusual Bill Detection

**Edge Function: `detect-bill-anomalies`**

**Runs when bill is marked as paid with amount**

**Logic:**
```javascript
function detectAnomaly(bill, paidAmount, history) {
  const avgAmount = calculateAverage(history)
  const stdDev = calculateStdDeviation(history)
  
  const percentageDiff = ((paidAmount - avgAmount) / avgAmount) * 100
  
  if (Math.abs(percentageDiff) > 30) {
    return {
      isAnomaly: true,
      severity: Math.abs(percentageDiff) > 50 ? 'high' : 'medium',
      message: `This bill is ${percentageDiff.toFixed(0)}% ${percentageDiff > 0 ? 'higher' : 'lower'} than usual`,
      recommendation: 'Check bill details for errors or unusual usage'
    }
  }
  
  return { isAnomaly: false }
}
```

**Notification:**
- "⚠️ Unusual Bill Amount Detected"
- "Your TNB bill is RM 250 (67% higher than usual RM 150)"
- "Tap to review bill details"

### 3. Payment Optimization

**Edge Function: `optimize-bill-payments`**

**Suggests optimal payment dates based on:**
- User's income schedule (salary date)
- Cash flow patterns
- Due dates of all bills
- Account balances

**Grok API helps create payment plan:**
- Group bills by week
- Ensure sufficient balance
- Minimize late payments
- Suggest auto-pay for reliable bills

---

## 🔔 NOTIFICATIONS & REMINDERS

### Bill Reminder System

**Automated Notifications:**

1. **7 Days Before Due:**
   - "Bill Reminder: TNB bill of RM 150 due on 15th"
   - "7 days to pay"

2. **3 Days Before Due:**
   - "⏰ Payment Reminder: TIME internet bill due in 3 days"
   - "Amount: RM 139"

3. **1 Day Before Due:**
   - "⚠️ Urgent: Indah Water bill due tomorrow"
   - "Amount: RM 8"
   - "Pay Now" action button

4. **On Due Date:**
   - "📅 Today: Pay your Astro bill (RM 99)"
   - Direct link to mark as paid

5. **1 Day Overdue:**
   - "🚨 OVERDUE: TM bill was due yesterday"
   - "Amount: RM 129 + possible late fee"
   - "Pay Immediately" button

**Smart Notification Grouping:**
- If multiple bills due same week: "3 bills due this week (RM 388)"
- Morning of payday: "You have 2 bills to pay this month (RM 279)"

**Notification Preferences:**
- Per-bill reminder settings
- Global notification toggle
- Quiet hours (no notifications 10 PM - 8 AM)
- Channel preferences (Push, Email, SMS)

---

## 📊 CHARTS & VISUALIZATIONS

### Bills Dashboard Charts

**1. Monthly Bills Timeline:**
- Horizontal gantt-style chart
- Days 1-31 on X-axis
- Bills as colored bars on due dates
- Hover shows bill details
- Click to mark as paid

**2. Bills by Category (Pie Chart):**
- Donut chart
- Center: Total monthly bills
- Segments: Categories (Electricity, Water, Internet, etc.)
- Colors match category colors
- Interactive: Click segment for details

**3. Payment History (Line Chart):**
- X-axis: Last 12 months
- Y-axis: Amount
- Lines for each major bill
- Total bills line (bold)
- Identify trends and spikes

**4. Payment Status (Progress Ring):**
- Circular progress
- Paid vs Total bills this month
- Green fill for paid
- Gray for unpaid
- Percentage in center

**5. Variable Bill Trends:**
- Multi-line chart
- Show 3-month moving average
- Prediction line (dotted)
- Seasonal patterns highlighted

---

## 🗄️ DATABASE SCHEMA
```sql
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider_id TEXT, -- Links to malaysianBillProviders
  provider_name TEXT NOT NULL,
  provider_logo TEXT,
  provider_category TEXT,
  
  -- Bill Details
  bill_name TEXT NOT NULL,
account_number TEXT,
account_number_masked TEXT,
-- Amount
is_variable BOOLEAN DEFAULT FALSE,
fixed_amount DECIMAL(10, 2),
estimated_amount DECIMAL(10, 2), -- For variable bills
currency TEXT DEFAULT 'MYR',
-- Schedule
due_day INTEGER CHECK (due_day BETWEEN 1 AND 31),
due_date_variable BOOLEAN DEFAULT FALSE,
first_bill_date DATE,
-- Payment
payment_method TEXT,
linked_account_id UUID REFERENCES accounts(id),
auto_pay_enabled BOOLEAN DEFAULT FALSE,
-- Reminders
reminder_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
notifications_enabled BOOLEAN DEFAULT TRUE,
-- Budget Integration
budget_category_id UUID REFERENCES categories(id),
auto_sync_budget BOOLEAN DEFAULT TRUE,
-- Status
is_active BOOLEAN DEFAULT TRUE,
-- Metadata
notes TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_due_day ON bills(due_day);
CREATE INDEX idx_bills_provider ON bills(provider_id);
CREATE TABLE bill_payments (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
-- Payment Details
amount DECIMAL(10, 2) NOT NULL,
due_date DATE NOT NULL,
paid_date DATE,
payment_method TEXT,
-- Status
status TEXT CHECK (status IN ('unpaid', 'paid', 'overdue', 'partial')) DEFAULT 'unpaid',
-- Links
transaction_id UUID REFERENCES transactions(id),
account_id UUID REFERENCES accounts(id),
-- Anomaly Detection
is_anomaly BOOLEAN DEFAULT FALSE,
anomaly_reason TEXT,
-- Metadata
notes TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_bill_payments_bill_id ON bill_payments(bill_id);
CREATE INDEX idx_bill_payments_due_date ON bill_payments(due_date);
CREATE INDEX idx_bill_payments_status ON bill_payments(status);
CREATE TABLE bill_predictions (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
prediction_month DATE NOT NULL,
predicted_amount DECIMAL(10, 2),
confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
amount_range_min DECIMAL(10, 2),
amount_range_max DECIMAL(10, 2),
reasoning TEXT,
factors JSONB,
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

## 📦 DELIVERABLES

### Web:
1. ✅ Bills list page with timeline
2. ✅ Add bill wizard
3. ✅ Bill detail page with history
4. ✅ Payment calendar view
5. ✅ Mark as paid modal
6. ✅ Bills by category breakdown
7. ✅ Payment history charts
8. ✅ Budget integration dashboard

### Mobile:
9. ✅ Bills screen with timeline
10. ✅ Add bill screen (step-by-step)
11. ✅ Bill detail screen
12. ✅ Mark as paid bottom sheet
13. ✅ Payment calendar bottom sheet
14. ✅ Swipe to mark paid
15. ✅ Bill reminders notifications

### Backend:
16. ✅ Database schema and migrations
17. ✅ RLS policies
18. ✅ Edge function: predict-bill-amount
19. ✅ Edge function: detect-bill-anomalies
20. ✅ Edge function: optimize-bill-payments
21. ✅ Cron job: Generate monthly bill payments
22. ✅ Cron job: Send bill reminders
23. ✅ Auto-create transactions on payment
24. ✅ Budget sync logic

### Assets:
25. ✅ All Malaysian provider logos (TNB, TIME, TM, Indah Water, etc.)
26. ✅ Generic bill icon

---

Create all components following global design rules with Malaysian providers, multi-currency support (MYR default), automatic budget synchronization, and AI-powered predictions for variable bills.