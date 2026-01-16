Following the global rules, create a comprehensive Transactions Management system that automatically syncs with all modules (Accounts, Bills, Loans, Credit Cards, Budgets, Goals, Investments) with AI-powered categorization, receipt management, and real-time balance updates for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete transaction management system that:
- Records all income and expense transactions
- Auto-creates transactions from bill payments, loan payments, credit card payments
- Syncs with budgets in real-time
- Updates account balances automatically
- Links to goals when contributing
- AI-powered auto-categorization using Grok API
- Receipt capture and OCR
- Recurring transaction automation
- Split transactions
- Transfer between accounts
- Tag-based organization
- Advanced filtering and search
- Export capabilities
- Multi-currency support (default: MYR)

---

## 🔄 AUTO-SYNC INTEGRATION LOGIC

### Transaction Creation Triggers

**1. Bill Payment:**
When user marks bill as paid:

Create transaction:

Type: Expense
Category: Bills & Utilities (or specific category)
Amount: Bill amount
Description: "[Provider] Bill - [Month]"
Date: Payment date
Account: Selected payment account
Tags: ["bill", provider name]
Link: bill_payment_id


Update account balance:

Deduct amount from account
Record transaction in account history


Update budget:

Add to "Bills & Utilities" budget spent
Check threshold alerts


Create notification:

"Bill payment recorded: RM X for [Provider]"




**2. Loan Payment:**
When user makes loan payment:

Create transaction:

Type: Expense
Category: Debt Payments
Amount: Payment amount
Description: "[Lender] Loan Payment - [Month]"
Date: Payment date
Account: Selected payment account
Tags: ["loan", loan type]
Link: loan_payment_id
Notes: "Principal: RM X, Interest: RM Y"


Update loan balance:

Deduct principal from remaining balance
Record in loan_payments table
Recalculate amortization if extra payment


Update account balance:

Deduct amount from account


Update budget:

Add to "Debt Payments" budget
Check if over budget


Update debt-free progress:

Recalculate overall debt percentage
Check milestones


Notification:

"Loan payment recorded: RM X"
"New balance: RM Y"
"You're Z% debt-free!"




**3. Credit Card Payment:**
When user pays credit card bill:

Create transaction:

Type: Expense (from payment account)
Category: Credit Card Payment
Amount: Payment amount
Description: "[Bank] Credit Card Payment"
Date: Payment date
From Account: Bank account
Tags: ["credit_card", card name]
Link: credit_card_account_id


Update credit card balance:

Reduce outstanding balance
Increase available credit
Update utilization percentage


Update bank account balance:

Deduct payment amount


Update budget:

Check if part of budget


AI Analytics update:

Recalculate credit score impact
Update repayment plan progress




**4. Goal Contribution:**
When user contributes to goal:

Create transaction:

Type: Transfer
Category: Savings
Amount: Contribution amount
Description: "Contribution to [Goal Name]"
Date: Contribution date
From Account: Source account
Tags: ["goal", goal name]
Link: goal_contribution_id


Update goal progress:

Add to current_amount
Recalculate percentage
Check milestones


Update account balance:

Deduct from source account
Add to goal-linked account (if any)


Check milestone achievements:

If 25%, 50%, 75%, 100% reached
Trigger celebration notification


Update budget:

Add to "Savings" budget if applicable




**5. Investment Transaction:**
When user buys/sells investment:

Create transaction:

Type: Expense (buy) or Income (sell)
Category: Investments
Amount: Total cost or proceeds
Description: "Buy/Sell [Quantity] [Symbol] @ RM [Price]"
Date: Transaction date
Account: Brokerage account or bank
Tags: ["investment", symbol, "buy/sell"]
Link: investment_transaction_id


Update investment position:

Add/subtract quantity
Update average cost
Calculate profit/loss (if sell)


Update account balance:

Deduct purchase amount (buy)
Add sale proceeds (sell)


Update portfolio value:

Recalculate total value
Update allocation percentages




**6. Budget Rollover:**
At month end (automated):

For each budget with rollover enabled:

Calculate unused amount
Create virtual transaction (memo):

Type: Budget Adjustment
Amount: Unused amount
Description: "Budget rollover from [Previous Month]"
Date: 1st of new month




Add to next month's budget:

New budget amount = Original + Rollover


Notification:

"RM X rolled over to [Category] budget"




---

## 🌐 WEB APPLICATION - TRANSACTIONS

### Page: /transactions

**Layout:**
- Use DashboardLayout
- Header: "Transactions" with subtitle "Track all your financial activity"
- Action buttons: Add Transaction, Import CSV, Export, Filter

**Summary Cards Row:**
Display 4 stat cards:

1. **Total Income (This Month)**
   - Sum of income transactions
   - Icon: TrendingUp
   - Color: Green gradient
   - Comparison to last month

2. **Total Expenses (This Month)**
   - Sum of expense transactions
   - Icon: TrendingDown
   - Color: Red gradient
   - Comparison to last month

3. **Net Cash Flow**
   - Income - Expenses
   - Icon: ArrowUpDown
   - Color: Green (positive) or Red (negative)
   - Percentage of income

4. **Transaction Count**
   - Number of transactions this month
   - Icon: Hash
   - Color: Blue
   - Average per day

**Cash Flow Chart:**
- Large area chart (full width)
- Two lines: Income (green) and Expenses (red)
- Net area (green fill if positive, red if negative)
- Time range selector: This Month, Last 3 Months, Last 6 Months, This Year
- Daily, Weekly, or Monthly aggregation
- Hover for details

**Search & Filter Bar:**

**Search Input:**
- Full-width search box
- Placeholder: "Search transactions by description, amount, or category..."
- Real-time search with debounce (300ms)
- Search across: Description, Notes, Tags, Category

**Quick Filters (Chips):**
- All Transactions
- Income Only
- Expenses Only
- Today
- This Week
- This Month
- Custom Date Range

**Advanced Filters (Collapsible Panel):**

When "Advanced Filters" clicked, show panel with:

1. **Date Range**
   - Date picker (from - to)
   - Presets: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Quarter, This Year, Custom

2. **Transaction Type**
   - Checkboxes: Income, Expense, Transfer

3. **Categories**
   - Multi-select dropdown with icons
   - Search categories
   - Select All / Deselect All

4. **Accounts**
   - Multi-select dropdown with logos
   - Filter by source account

5. **Amount Range**
   - Min and Max inputs
   - Slider for visual selection

6. **Tags**
   - Multi-select chips
   - Show popular tags
   - Search tags

7. **Linked Modules**
   - Checkboxes:
     - [ ] Bills
     - [ ] Loans
     - [ ] Goals
     - [ ] Investments
     - [ ] Credit Cards

8. **Receipt Status**
   - Radio buttons: All, With Receipt, Without Receipt

9. **Recurring**
   - Radio buttons: All, Recurring Only, One-time Only

**Active Filters Display:**
- Show active filters as dismissible chips below filter bar
- "Clear All Filters" button
- Count: "Showing X transactions"

**Sort Options:**
- Dropdown: Date (Newest), Date (Oldest), Amount (High to Low), Amount (Low to High), Category (A-Z)

**Transactions List:**

**Grouped by Date:**
- Section headers: "Today", "Yesterday", "June 15, 2024", etc.
- Sticky section headers on scroll

**Each Transaction Card:**

**Layout:**
- Glass effect card with hover lift
- Responsive: Table view (desktop), Card view (mobile)

**Card Contents:**

**Left Section:**
- Category icon (32px, colored circle background)
- Transaction description (bold, white)
- Category name (small, gray)
- Date and time (small, gray)
- Tags (small chips, if any)

**Middle Section (Desktop Only):**
- Account name (with icon)
- Payment method badge
- Linked module badge:
  - "Bill" (orange badge)
  - "Loan" (red badge)
  - "Goal" (green badge)
  - "Investment" (purple badge)
- Receipt indicator (attachment icon if has receipt)

**Right Section:**
- Amount (large, bold):
  - Green for income (+ prefix)
  - Red for expense (- prefix)
  - Blue for transfer (→ icon)
- Running balance (small, gray, optional)

**Actions Menu (3-dot icon):**
- View Details
- Edit Transaction
- Duplicate Transaction
- Delete Transaction
- Add to Recurring
- Download Receipt
- Split Transaction

**Transaction Card States:**
- **Normal:** Standard glass effect
- **Hover:** Lift 4px, increase shadow
- **Selected:** Blue border glow (for bulk operations)
- **Pending:** Yellow left border, "Pending" badge
- **Linked:** Badge indicator for linked module

**Bulk Operations:**

**When transactions selected (checkboxes):**
- Show action bar at top:
  - "X transactions selected"
  - Actions: Delete, Change Category, Add Tag, Export, Bulk Edit
  - Cancel Selection button

**Transaction Statistics Panel (Right Sidebar or Expandable):**

**Category Breakdown:**
- Donut chart showing expense categories
- Top 5 categories list
- Percentage and amount for each

**Top Expenses:**
- List of 10 largest expenses this month
- Bar chart visualization

**Top Income Sources:**
- List of income transactions
- Total by category

**Spending Trends:**
- Mini line chart showing daily spending
- Average daily spend
- Comparison to last month

**Empty State:**
- Illustration (wallet/transactions themed)
- "No transactions yet"
- "Add your first transaction to start tracking"
- "Add Transaction" button
- "Import Transactions" button

### Page: /transactions/new (Add Transaction)

**Modal Presentation (Full-screen modal or drawer)**

**Header:**
- Close button (X)
- Title: "Add Transaction"
- Save button (disabled until valid)

**Step 1: Transaction Type Selector**

Large segmented control:
- **Income** (Green icon)
- **Expense** (Red icon)
- **Transfer** (Blue icon)

Selected type determines form fields shown.

---

### INCOME / EXPENSE FORM:

**Form Fields:**

1. **Amount** (required)
   - Large, centered currency input
   - Font size: 48px
   - Format: RM 0.00
   - Calculator button (opens calculator modal)
   - Quick amounts: RM 10, 50, 100, 500, 1000

2. **Description** (required)
   - Text input with autocomplete
   - Suggestions from transaction history
   - Max 100 characters
   - AI category suggestion appears as you type

3. **Category** (required)
   - Dropdown with icons and colors
   - Searchable
   - Grouped: Income categories, Expense categories
   - "Add New Category" option
   - Shows AI-suggested category with ✨ badge
   - Accept AI suggestion button

4. **Account** (required)
   - Dropdown showing accounts with:
     - Logo/icon
     - Account name
     - Current balance
   - Filter by account type (Bank, Cash, E-Wallet)

5. **Date & Time**
   - Date picker (default: today)
   - Time picker (default: now)
   - "Now" button for quick entry

6. **Tags** (optional)
   - Multi-select chips
   - Popular tags shown
   - Create new tag inline
   - Max 10 tags

7. **Notes** (optional)
   - Expandable textarea
   - Max 500 characters
   - Markdown support

8. **Receipt** (optional)
   - Upload button
   - Drag & drop area
   - Camera capture (mobile)
   - Multiple files allowed
   - Max 5MB per file
   - Image preview with delete option
   - OCR button (extract amount and date from receipt)

9. **Recurring Transaction** (optional)
   - Toggle switch
   - When enabled, show:

**Recurring Settings:**
- **Frequency:**
  - Dropdown: Daily, Weekly, Bi-weekly, Monthly, Quarterly, Yearly
- **Interval:**
  - Every X [frequency]
  - Example: "Every 2 weeks"
- **Start Date:**
  - Date picker (default: transaction date)
- **End Condition:**
  - Radio buttons:
    - Never end
    - End after X occurrences
    - End on specific date
- **Preview:**
  - "Next 5 occurrences" list
  - Dates and amounts

10. **Linked Module** (optional, auto-detected or manual)
    - If transaction relates to:
      - Bill: Show bill selector
      - Loan: Show loan selector
      - Goal: Show goal selector
      - Investment: Show investment selector
    - Auto-filled if created from those modules

11. **Split Transaction** (optional)
    - Toggle: "Split into multiple categories"
    - When enabled:
      - Add split items
      - Each split: Category, Amount, Note
      - Total must equal transaction amount
      - Minimum 2 splits, maximum 10
    - Example: Grocery shopping split into "Food", "Household", "Personal Care"

**Actions:**
- Cancel button (confirmation if data entered)
- Save button (primary gradient)
- Save & Add Another checkbox

**Validation:**
- Amount > 0
- Description not empty
- Category selected
- Account selected
- If split: Total splits = Total amount

---

### TRANSFER FORM:

**Form Fields:**

1. **Amount** (required)
   - Large currency input

2. **From Account** (required)
   - Dropdown with balances
   - Show warning if insufficient balance

3. **To Account** (required)
   - Dropdown
   - Cannot be same as From Account
   - Filter out credit cards if transferring to

4. **Transfer Fee** (optional)
   - Currency input
   - Deducted from From Account
   - Example: ATM withdrawal fee, transfer charge

5. **Date & Time**
   - Date picker

6. **Description** (optional)
   - Default: "Transfer from [Account A] to [Account B]"
   - Editable

7. **Notes** (optional)
   - Reason for transfer

**Transfer Logic:**
- Creates TWO linked transactions:
  1. Expense from "From Account" (red)
  2. Income to "To Account" (green)
- Both linked via transfer_id
- Category: "Transfer" (special category)
- Updates both account balances

---

### AI-POWERED CATEGORY SUGGESTION

**Edge Function: `suggest-transaction-category`**

**Triggered:** When user types description (debounced 500ms)

**Input:**
- Description text
- Amount
- User's historical transactions
- Current date/time

**Grok API Prompt:**
You are a transaction categorization AI. Suggest the most appropriate category for this transaction.
User's Categories:
{userCategories}
Transaction Details:

Description: "{description}"
Amount: RM {amount}
Date: {date}
Time: {time}

User's Historical Patterns:
{recentTransactions}
Rules:

Return ONLY the category name
Use user's existing categories
If no match, suggest closest category
Consider context (amount, time, day of week)

Examples:

"Starbucks coffee" → Food & Dining
"Shell petrol" → Transportation
"Salary" → Salary
"Netflix subscription" → Entertainment

Suggest category for the transaction above:

**Display:**
- Show suggestion badge on category field
- "✨ AI suggests: Food & Dining"
- Click to accept
- User can override

---

### OCR Receipt Scanning

**Edge Function: `extract-receipt-data`**

**When user uploads receipt:**

**Process:**
1. Upload image to Supabase Storage
2. Call OCR API (Google Vision, AWS Textract, or Tesseract)
3. Extract:
   - Merchant name
   - Total amount
   - Date
   - Line items (if possible)
4. Use Grok to parse and structure data
5. Auto-fill form fields

**Grok Parsing Prompt:**
Extract transaction details from this receipt OCR text:
{ocrText}
Return JSON:
{
"merchant": "Merchant name",
"amount": 45.50,
"date": "2024-06-15",
"category": "Suggested category",
"items": [
{"name": "Item 1", "price": 20.00},
{"name": "Item 2", "price": 25.50}
]
}

**User Experience:**
1. User uploads receipt
2. "Processing..." indicator
3. Form auto-fills with extracted data
4. User reviews and confirms
5. Can edit if incorrect

---

### Page: /transactions/:id (Transaction Details)

**Layout:**
- Back button
- Edit and Delete buttons (top-right)
- Duplicate button

**Transaction Header:**
- Large category icon (64px, gradient background)
- Description (large, bold)
- Category name
- Transaction type badge (Income/Expense/Transfer)

**Amount Display:**
- Very large amount (72px)
- Color coded (green/red/blue)
- Currency symbol

**Transaction Details Card:**

**Basic Info:**
- Date: June 15, 2024, 10:30 AM
- Account: [Account name with icon]
- Category: [Category with icon]
- Payment Method: [Method]
- Transaction ID: [Masked ID]

**Additional Info (if present):**
- Tags: [Chips]
- Notes: [Full text]
- Receipt: [Thumbnail with view full option]

**Linked Information:**

**If linked to Bill:**
- Card showing: "Linked to Bill Payment"
- Bill provider logo
- Bill name
- Payment date
- "View Bill Details" button

**If linked to Loan:**
- Card showing: "Linked to Loan Payment"
- Lender logo
- Loan name
- Payment breakdown: Principal RM X, Interest RM Y
- New loan balance
- "View Loan Details" button

**If linked to Goal:**
- Card showing: "Contribution to Goal"
- Goal emoji and name
- Contribution amount
- New goal progress (%)
- Progress ring visualization
- "View Goal Details" button

**If linked to Investment:**
- Card showing: "Investment Transaction"
- Buy/Sell indicator
- Symbol and quantity
- Price per unit
- Total cost/proceeds
- "View Investment Details" button

**If Split Transaction:**
- "Split Transaction" section
- Table showing splits:
  - Category, Amount, Percentage
- Visual pie chart of splits

**If Recurring:**
- "Recurring Transaction" badge
- Frequency: Monthly
- Next occurrence: July 15, 2024
- "View Recurring Schedule" button
- "Edit Recurrence" button
- "Stop Recurring" button

**Budget Impact:**
- Card showing: "Budget Impact"
- Category budget: RM X / RM Y
- This transaction: RM Z
- New spent: RM A
- Progress bar
- "View Budget" button

**Account Balance Impact:**
- "Balance Update" section
- Previous balance: RM X
- Transaction: ± RM Y
- New balance: RM Z
- Arrow visualization

**Related Transactions:**
- "Similar Transactions" section
- Last 5 transactions in same category
- Same merchant/description
- Quick comparison

**Actions:**
- Edit Transaction
- Duplicate Transaction
- Delete Transaction (with confirmation)
- Convert to Recurring
- Add to Budget
- Download Receipt
- Share Transaction Details

---

## 📱 MOBILE APPLICATION - TRANSACTIONS

### Screen: TransactionsScreen (Tab Navigator)

**Header:**
- Title: "Transactions"
- Search icon (opens search screen)
- Filter icon (opens filter bottom sheet)
- Add FAB (floating action button, gradient)

**Summary Cards:**
- Horizontal scrollable carousel
- 4 cards: Income, Expenses, Net, Count
- Swipe to see details
- Each with icon, amount, comparison

**Quick Filter Chips:**
- Horizontal scrollable
- All, Today, This Week, This Month
- Income, Expenses
- Tap to filter

**Transactions List:**
- FlatList with sections (grouped by date)
- Section headers: "Today", "Yesterday", "June 14"
- Sticky section headers
- Pull-to-refresh
- Infinite scroll (load more)

**Each Transaction Item:**
- Card layout (80px height)
- Left: Category icon (40px, colored background)
- Middle:
  - Description (bold, 1 line, ellipsis)
  - Category name (gray, small)
  - Date/time (gray, small)
  - Linked module badge (if applicable)
- Right:
  - Amount (colored, bold)
  - Account icon (small)
- Swipe actions:
  - Swipe left: Delete (red)
  - Swipe right: Edit (blue)
- Long press: Select for bulk operations
- Tap: View details

**Floating Action Button (FAB):**
- Position: Bottom-right
- Gradient background (blue to purple)
- Plus icon
- Pulse animation
- Opens Add Transaction screen

**Empty State:**
- Illustration
- "No transactions yet"
- "Tap + to add your first transaction"

### Screen: AddTransactionScreen (Modal)

**Presentation:**
- Full-screen modal
- Slide up animation
- Close button (top-left)
- Save button (top-right, disabled until valid)

**Transaction Type Selector:**
- Segmented control at top
- Income (green), Expense (red), Transfer (blue)
- Smooth animation on switch

---

### INCOME/EXPENSE FORM (Mobile):

**Amount Input:**
- Large, centered
- Custom number pad
  - Numbers 0-9
  - Decimal point
  - Backspace
  - Clear (C)
- Quick amount buttons above pad:
  - +10, +50, +100, +500, +1000
- Amount updates in real-time
- Currency symbol displayed

**Form Fields (Scrollable):**

1. **Description**
   - Text input with autocomplete
   - Suggestions dropdown
   - As you type, AI suggestion badge appears

2. **Category Selector**
   - Tap to open bottom sheet
   - Bottom sheet shows:
     - Search bar
     - Grid of categories (3 columns)
     - Each with icon and name
     - AI suggested category at top (highlighted)
   - Select category, sheet closes

3. **Account Selector**
   - Tap to open bottom sheet
   - List of accounts with:
     - Logo, name, balance
   - Select account

4. **Date & Time**
   - Tap to open date picker
   - Today button for quick select
   - Time picker (wheel)

5. **Tags** (Expandable)
   - Tap "Add Tags" to expand
   - Chip input
   - Popular tags shown

6. **Notes** (Expandable)
   - Tap "Add Notes" to expand
   - Multi-line input

7. **Receipt** (Expandable)
   - Tap "Add Receipt" to expand
   - Options:
     - Take Photo (Camera)
     - Choose from Gallery
     - Scan Receipt (OCR)
   - Shows thumbnail after upload
   - "Processing..." if OCR running

8. **Recurring** (Expandable)
   - Toggle switch
   - If enabled, show recurring settings

**Actions:**
- Cancel (top-left)
- Save (top-right, gradient button when enabled)
- Keyboard aware scroll

---

### TRANSFER FORM (Mobile):

**Amount Input:**
- Same large number pad

**From Account:**
- Tap to select (bottom sheet)
- Shows current balance

**To Account:**
- Tap to select (bottom sheet)
- Filtered (no credit cards, no same account)

**Transfer Fee:**
- Optional field
- Number input

**Date:**
- Date picker

**Description:**
- Auto-filled, editable

**Save Button:**
- Creates linked transactions

---

### Screen: TransactionDetailScreen

**Scrollable Content:**

**Header:**
- Large category icon (80px)
- Description (large, bold)
- Category name and badge

**Amount Card:**
- Huge amount display (56px)
- Colored background (green/red/blue)
- Currency symbol

**Details Section:**
- Card with glass effect
- Rows:
  - Date & Time
  - Account (with icon)
  - Category
  - Payment Method
  - Transaction ID

**Tags (if present):**
- Horizontal scroll chips

**Notes (if present):**
- Card with full note text
- Expandable if long

**Receipt (if present):**
- Image preview
- Tap to view full screen
- Pinch to zoom
- Share button

**Linked Module (if present):**

**Bill Payment:**
- Card with provider logo
- "Bill Payment" title
- Provider name
- Amount and date
- "View Bill" button

**Loan Payment:**
- Card with lender logo
- "Loan Payment" title
- Loan name
- Principal/Interest breakdown
- New balance
- Progress bar
- "View Loan" button

**Goal Contribution:**
- Card with goal emoji
- "Goal Contribution" title
- Goal name
- Amount and new progress
- Progress ring
- "View Goal" button

**Investment:**
- Card with stock/crypto icon
- Buy/Sell badge
- Symbol, quantity, price
- "View Investment" button

**Split Breakdown (if split):**
- List of splits
- Each showing:
  - Category icon and name
  - Amount and percentage
- Pie chart visualization

**Budget Impact:**
- Card showing category budget
- This transaction's impact
- Progress bar
- Over/under budget indicator

**Action Buttons:**
- Edit Transaction (primary)
- Duplicate Transaction
- Delete Transaction (danger)
- Share (via native share)

### Bottom Sheet: FilterTransactions

**Content:**
- Scrollable filter options

**Date Range:**
- Preset chips: Today, Week, Month, Year
- Custom date picker

**Type:**
- Checkboxes: Income, Expense, Transfer

**Categories:**
- Multi-select list with icons
- Search bar
- Select All / None

**Accounts:**
- Multi-select list with logos

**Amount Range:**
- Min/Max inputs with sliders

**Tags:**
- Multi-select chips

**Linked Modules:**
- Checkboxes: Bills, Loans, Goals, Investments

**Receipt:**
- Radio: All, With Receipt, Without Receipt

**Actions:**
- Apply Filters (gradient button, sticky bottom)
- Clear All (text button)

### Bottom Sheet: CategoryPicker

**Content:**
- Search bar at top
- AI suggested category (if available, highlighted)
- Grid of categories (3 columns)
- Each showing:
  - Icon with colored background
  - Category name
- Tap to select and close

### Screen: SearchTransactionsScreen (Modal)

**Full-screen Search:**
- Search bar (auto-focus, large)
- Cancel button (top-right)
- Recent searches (if no input)
  - List of last 10 searches
  - Tap to search again
  - Clear history button

**Search Results:**
- Grouped by relevance
- Sections:
  - Exact matches
  - Description matches
  - Category matches
  - Tag matches
  - Note matches
- Each result: Transaction card
- Tap to view details

**No Results:**
- "No transactions found"
- "Try different keywords"
- Suggestion chips

### Screen: ReceiptScanScreen (Modal)

**Camera View:**
- Full-screen camera
- Overlay guide (rectangle)
- "Align receipt within frame"
- Capture button (large, bottom)
- Flash toggle
- Gallery button

**After Capture:**
- Preview image
- Actions:
  - Retake
  - Use Photo
- "Processing with AI..." if OCR

**OCR Results:**
- "Receipt Scanned!" success message
- Extracted data shown:
  - Merchant
  - Amount
  - Date
  - Items (if detected)
- "Looks good?" confirmation
- Edit button if incorrect
- Create Transaction button

---

## 🤖 AI-POWERED FEATURES

### 1. Smart Categorization

**Edge Function: `auto-categorize-transaction`**

Already covered above, but enhanced with:

**Learning System:**
- Store user's manual corrections
- When user changes AI suggestion
- Learn pattern: Description → Category
- Improve accuracy over time

**Pattern Recognition:**
```javascript
// User corrects: "7-Eleven" from "Shopping" to "Food & Dining"
// System learns: Convenience stores → Food & Dining
// Next time: "Family Mart" automatically → Food & Dining
```

### 2. Duplicate Transaction Detection

**Edge Function: `detect-duplicate-transactions`**

**Triggered:** When new transaction created

**Logic:**
```javascript
function detectDuplicate(newTransaction) {
  // Check transactions within ±3 days
  const recentTransactions = getTransactionsInRange(
    newTransaction.date - 3days,
    newTransaction.date + 3days
  )
  
  // Similar if:
  const duplicates = recentTransactions.filter(t => {
    const amountMatch = Math.abs(t.amount - newTransaction.amount) < 0.01
    const descriptionSimilarity = calculateSimilarity(t.description, newTransaction.description) > 0.8
    const categoryMatch = t.category_id === newTransaction.category_id
    
    return amountMatch && (descriptionSimilarity || categoryMatch)
  })
  
  return duplicates.length > 0
}
```

**If duplicate detected:**
- Show warning modal:
  - "Possible Duplicate Transaction"
  - List similar transactions
  - Options:
    - "Continue Anyway"
    - "Edit Transaction"
    - "Cancel"

### 3. Unusual Spending Detection

**Edge Function: `detect-spending-anomalies`**

**Runs:** Daily

**Logic:**
```javascript
function detectAnomaly(transaction, history) {
  const categoryHistory = history.filter(t => t.category_id === transaction.category_id)
  const avgAmount = calculateAverage(categoryHistory.map(t => t.amount))
  const stdDev = calculateStdDeviation(categoryHistory.map(t => t.amount))
  
  // Anomaly if > 2 standard deviations
  if (Math.abs(transaction.amount - avgAmount) > 2 * stdDev) {
    return {
      isAnomaly: true,
      severity: transaction.amount > avgAmount + 2*stdDev ? 'high' : 'low',
      message: `This ${transaction.category} expense (RM ${transaction.amount}) is ${Math.round((transaction.amount/avgAmount - 1) * 100)}% ${transaction.amount > avgAmount ? 'higher' : 'lower'} than your usual RM ${avgAmount.toFixed(2)}`
    }
  }
  
  return { isAnomaly: false }
}
```

**Notification:**
- "🔔 Unusual Spending Detected"
- "Your Food & Dining expense today (RM 250) is 150% higher than usual (RM 100)"
- "Review Transaction" button

### 4. Spending Insights

**Edge Function: `generate-spending-insights`**

**Runs:** Weekly

**Grok API Prompt:**
Analyze this user's weekly spending and provide insights.
Weekly Transactions:
{transactions}
Budgets:
{budgets}
Last Week Comparison:
{lastWeekData}
Provide insights in JSON:
{
"summary": "You spent RM 1,450 this week, 15% higher than last week",
"trends": [
{
"category": "Food & Dining",
"change": "+25%",
"insight": "Dining out increased significantly",
"recommendation": "Consider meal prepping to reduce costs"
}
],
"achievements": [
"Stayed within Transportation budget (85% used)",
"No Shopping expenses this week - great control!"
],
"alerts": [
"Entertainment budget exceeded by RM 50"
],
"prediction": "At current rate, you'll spend RM 5,800 this month (budget: RM 6,000)"
}

**Delivered:** Weekly email or push notification with insights

---

## 🔔 NOTIFICATIONS

### Transaction Notifications:

1. **Large Transaction:**
   - "💰 Large Expense: RM 1,500 spent at [Merchant]"
   - Trigger: > RM 1,000 or > 2x average

2. **Budget Threshold:**
   - "⚠️ Food Budget at 90%"
   - "You've spent RM 450 of RM 500 budget"

3. **Unusual Spending:**
   - "🔔 Higher than usual [Category] expense"
   - "RM X spent (usual: RM Y)"

4. **Daily Summary:**
   - "Today: RM X spent across Y transactions"
   - "Largest: RM Z at [Merchant]"

5. **Weekly Recap:**
   - "This week: RM X income, RM Y expenses"
   - "Net: RM Z"
   - "Top category: [Category]"

6. **Recurring Transaction Created:**
   - "✅ Recurring transaction created"
   - "[Description] - RM X every [Frequency]"

---

## 📊 CHARTS & VISUALIZATIONS

### Transaction Charts:

**1. Cash Flow Chart (Area):**
- Income line (green)
- Expense line (red)
- Net area fill (green/red)
- Time-based X-axis
- Hover for daily details

**2. Category Breakdown (Donut):**
- Expense categories
- Color-coded segments
- Percentages and amounts
- Interactive (click to filter)

**3. Income vs Expense (Bar):**
- Grouped bars
- Monthly comparison
- Year-over-year comparison

**4. Spending Trend (Line):**
- Daily spending over month
- Average line (dotted)
- Budget line (if applicable)
- Highlight over-budget days

**5. Account Balance Over Time:**
- Stacked area for multiple accounts
- Total balance line (bold)
- Show effect of transactions

**6. Tag Cloud:**
- Visual representation of popular tags
- Size based on frequency
- Click to filter

---

## 🗄️ DATABASE SCHEMA UPDATES

### Enhanced Transactions Table:
```sql
-- Extend existing transactions table with integration fields

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS bill_payment_id UUID REFERENCES bill_payments(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS loan_payment_id UUID REFERENCES loan_payments(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS goal_contribution_id UUID REFERENCES goal_contributions(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS investment_transaction_id UUID REFERENCES investment_transactions(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS credit_card_payment BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_recurring_instance BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_transaction_id UUID REFERENCES recurring_transactions(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_split BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS parent_transaction_id UUID REFERENCES transactions(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transfer_id UUID;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS receipt_urls TEXT[];
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ocr_data JSONB;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ai_suggested_category UUID REFERENCES categories(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(5, 2);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_anomaly BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS anomaly_reason TEXT;

CREATE INDEX idx_transactions_bill_payment ON transactions(bill_payment_id);
CREATE INDEX idx_transactions_loan_payment ON transactions(loan_payment_id);
CREATE INDEX idx_transactions_goal_contribution ON transactions(goal_contribution_id);
CREATE INDEX idx_transactions_investment ON transactions(investment_transaction_id);
CREATE INDEX idx_transactions_recurring ON transactions(recurring_transaction_id);
CREATE INDEX idx_transactions_transfer ON transactions(transfer_id);
CREATE INDEX idx_transactions_anomaly ON transactions(is_anomaly) WHERE is_anomaly = TRUE;

-- Transaction splits table
CREATE TABLE transaction_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  
  category_id UUID REFERENCES categories(id),
  amount DECIMAL(15, 2) NOT NULL,
  percentage DECIMAL(5, 2),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring transactions template
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Template fields
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  account_id UUID REFERENCES accounts(id),
  amount DECIMAL(15, 2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  
  -- Recurrence settings
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  interval INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE,
  end_after_occurrences INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  next_occurrence_date DATE,
  occurrences_created INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recurring_transactions_user ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_next_date ON recurring_transactions(next_occurrence_date) WHERE is_active = TRUE;

-- Transaction auto-categorization learning
CREATE TABLE transaction_categorization_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  description_pattern TEXT,
  category_id UUID REFERENCES categories(id),
  confidence_score DECIMAL(5, 2),
  usage_count INTEGER DEFAULT 1,
  
  last_used TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 AUTOMATED PROCESSES

### Edge Functions:

**1. `create-recurring-transactions`**
- Runs: Daily at midnight
- Checks recurring_transactions for due occurrences
- Creates actual transaction records
- Updates next_occurrence_date

**2. `sync-account-balances`**
- Runs: After every transaction create/update/delete
- Recalculates account balances
- Updates account.balance field
- Handles transfer double-entry

**3. `update-budget-spent`**
- Runs: After every expense transaction
- Adds amount to budget.spent
- Checks threshold alerts
- Triggers notifications

**4. `check-goal-milestones`**
- Runs: After goal contribution
- Checks if milestone reached (25%, 50%, 75%, 100%)
- Triggers celebration notification
- Updates goal.status if completed

**5. `analyze-spending-patterns`**
- Runs: Daily
- Detects anomalies
- Generates insights
- Queues notifications

---

## 📦 DELIVERABLES

### Web:
1. ✅ Transactions list page with advanced filtering
2. ✅ Add/Edit transaction modal with AI categorization
3. ✅ Transaction detail page with module links
4. ✅ Bulk operations
5. ✅ Split transaction support
6. ✅ Recurring transaction management
7. ✅ Receipt upload and OCR
8. ✅ Cash flow charts and analytics
9. ✅ Export transactions (CSV, Excel, PDF)
10. ✅ Search with autocomplete

### Mobile:
11. ✅ Transactions screen with list
12. ✅ Add transaction screen with number pad
13. ✅ Transaction detail screen
14. ✅ Camera receipt capture
15. ✅ Swipe actions
16. ✅ Filter bottom sheet
17. ✅ Search screen
18. ✅ Category picker
19. ✅ Pull-to-refresh

### Backend & Integration:
20. ✅ Auto-create transactions from bills
21. ✅ Auto-create transactions from loan payments
22. ✅ Auto-create transactions from credit card payments
23. ✅ Auto-create transactions from goal contributions
24. ✅ Auto-create transactions from investments
25. ✅ Real-time account balance updates
26. ✅ Real-time budget updates
27. ✅ Recurring transaction automation
28. ✅ AI categorization with learning
29. ✅ OCR receipt scanning
30. ✅ Duplicate detection
31. ✅ Anomaly detection
32. ✅ Weekly insights generation

---

Create all components following global design rules with complete auto-sync across all modules (Bills, Loans, Credit Cards, Budgets, Goals, Investments), AI-powered categorization using Grok API, receipt OCR, and real-time balance updates.Act as a Senior Software Engineer. Carefully analyze the attached .md documentation to identify all technical requirements and edge cases. Based on this analysis, implement the feature described while ensuring full backward compatibility. Specifically, verify that all existing modules related to this feature are updated or integrated so that the entire system remains stable and functions correctly.