Following the global rules, create a comprehensive Loans Management and Debt Tracking system with Malaysian financial institutions, payment schedules, amortization calculators, AI-powered repayment strategies, and automatic payment reminders for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete loan management system that allows users to:
- Track multiple loan types (Mortgage, Auto, Personal, Student, Business)
- Monitor Malaysian bank loans (Maybank, CIMB, Public Bank, etc.)
- Calculate loan amortization and payment schedules
- Track payment history and remaining balance
- Get AI-powered debt payoff strategies using Grok API
- Compare Snowball vs Avalanche methods
- Set payment reminders
- Calculate total interest paid and savings opportunities
- Early payoff calculator
- Refinancing analysis
- Link payments to transactions and accounts
- Multi-currency support (default: MYR)

---

## 🏦 MALAYSIAN LOAN PROVIDERS

### Banks & Financial Institutions
```javascript
const malaysianLoanProviders = [
  // Major Banks
  {
    id: 'maybank',
    name: 'Maybank',
    fullName: 'Malayan Banking Berhad',
    logo: 'maybank-logo.png',
    color: '#FFD700',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    website: 'https://www.maybank.com.my',
    interestRates: {
      home: { min: 3.5, max: 4.5 },
      personal: { min: 5.5, max: 16.0 },
      auto: { min: 2.5, max: 3.5 },
      education: { min: 4.0, max: 6.0 }
    }
  },
  {
    id: 'cimb',
    name: 'CIMB Bank',
    fullName: 'CIMB Bank Berhad',
    logo: 'cimb-logo.png',
    color: '#E31837',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    website: 'https://www.cimb.com.my',
    interestRates: {
      home: { min: 3.4, max: 4.4 },
      personal: { min: 5.0, max: 15.5 },
      auto: { min: 2.4, max: 3.4 }
    }
  },
  {
    id: 'public-bank',
    name: 'Public Bank',
    fullName: 'Public Bank Berhad',
    logo: 'public-bank-logo.png',
    color: '#ED1C24',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    website: 'https://www.pbebank.com',
    interestRates: {
      home: { min: 3.6, max: 4.6 },
      personal: { min: 6.0, max: 16.5 },
      auto: { min: 2.6, max: 3.6 }
    }
  },
  {
    id: 'rhb',
    name: 'RHB Bank',
    fullName: 'RHB Bank Berhad',
    logo: 'rhb-logo.png',
    color: '#003DA5',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    website: 'https://www.rhbgroup.com'
  },
  {
    id: 'hong-leong',
    name: 'Hong Leong Bank',
    fullName: 'Hong Leong Bank Berhad',
    logo: 'hong-leong-logo.png',
    color: '#0047AB',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    website: 'https://www.hlb.com.my'
  },
  {
    id: 'ambank',
    name: 'AmBank',
    fullName: 'AmBank (M) Berhad',
    logo: 'ambank-logo.png',
    color: '#C8102E',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    website: 'https://www.ambank.com.my'
  },
  {
    id: 'bank-islam',
    name: 'Bank Islam',
    fullName: 'Bank Islam Malaysia Berhad',
    logo: 'bank-islam-logo.png',
    color: '#00A651',
    loanTypes: ['home', 'personal', 'auto', 'education'],
    isIslamic: true,
    website: 'https://www.bankislam.com.my'
  },
  
  // Government Agencies
  {
    id: 'ptptn',
    name: 'PTPTN',
    fullName: 'Perbadanan Tabung Pendidikan Tinggi Nasional',
    logo: 'ptptn-logo.png',
    color: '#0066CC',
    loanTypes: ['education'],
    website: 'https://www.ptptn.gov.my',
    description: 'National Higher Education Fund'
  },
  {
    id: 'kwsp',
    name: 'KWSP Housing Loan',
    fullName: 'Kumpulan Wang Simpanan Pekerja',
    logo: 'kwsp-logo.png',
    color: '#006B3F',
    loanTypes: ['home'],
    website: 'https://www.kwsp.gov.my',
    description: 'EPF Housing Loan Withdrawal'
  },
  
  // Other
  {
    id: 'other',
    name: 'Other Lender',
    fullName: 'Custom Financial Institution',
    logo: 'loan-generic-logo.png',
    color: '#6B7280',
    loanTypes: ['home', 'personal', 'auto', 'education', 'business']
  }
]
```

### Loan Types & Characteristics
```javascript
const loanTypes = [
  {
    id: 'home',
    name: 'Home Loan / Mortgage',
    icon: 'home',
    color: '#0066FF',
    typicalTerm: '25-35 years',
    typicalRate: '3.5% - 4.5%',
    description: 'House purchase, refinancing',
    malaysianContext: 'Housing loan for property purchase in Malaysia'
  },
  {
    id: 'auto',
    name: 'Car Loan / Auto Financing',
    icon: 'car',
    color: '#EF4444',
    typicalTerm: '5-9 years',
    typicalRate: '2.5% - 3.5%',
    description: 'New or used vehicle purchase',
    malaysianContext: 'Hire purchase for cars in Malaysia'
  },
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: 'user',
    color: '#10B981',
    typicalTerm: '1-7 years',
    typicalRate: '5% - 16%',
    description: 'Debt consolidation, medical, renovation',
    malaysianContext: 'Unsecured personal financing'
  },
  {
    id: 'education',
    name: 'Education Loan',
    icon: 'book',
    color: '#F59E0B',
    typicalTerm: '10-20 years',
    typicalRate: '4% - 6%',
    description: 'University, college tuition fees',
    malaysianContext: 'PTPTN or bank education financing'
  },
  {
    id: 'business',
    name: 'Business Loan',
    icon: 'briefcase',
    color: '#8B5CF6',
    typicalTerm: '1-10 years',
    typicalRate: '6% - 12%',
    description: 'SME financing, working capital',
    malaysianContext: 'Business term loan or working capital'
  },
  {
    id: 'islamic',
    name: 'Islamic Financing',
    icon: 'star-half',
    color: '#06B6D4',
    typicalTerm: 'Varies',
    typicalRate: 'Profit rate: 3% - 8%',
    description: 'Shariah-compliant financing',
    malaysianContext: 'Murabahah, Ijarah, Musharakah financing'
  }
]
```

---

## 🌐 WEB APPLICATION - LOANS

### Page: /loans

**Layout:**
- Use DashboardLayout
- Header: "Loans & Debt" with subtitle "Manage your loans and become debt-free"
- Action buttons: Add Loan, Debt Payoff Calculator, Refinance Analyzer

**Debt Summary Cards Row:**
Display 4 overview cards:

1. **Total Debt**
   - Sum of all outstanding loan balances
   - Icon: TrendingDown
   - Color: Red gradient
   - Large amount (bold, red)

2. **Monthly Payments**
   - Sum of all monthly loan payments
   - Icon: Calendar
   - Color: Orange
   - "RM X / month"

3. **Total Interest (Lifetime)**
   - Total interest paid + remaining interest
   - Icon: Percent
   - Color: Purple
   - Shocking number to motivate payoff

4. **Debt-Free Date**
   - Projected date when all loans paid off
   - Icon: Flag
   - Color: Green
   - Countdown: "X months to go!"

**Debt Payoff Progress:**
- Large progress bar showing overall debt payoff
- Total original debt → Current balance → $0
- Percentage paid off (e.g., "35% paid")
- Animated fill
- "You've paid RM X so far!"

**Debt Payoff Strategy Selector:**
Tabs to switch strategies:
1. **Current Plan** (as-is, minimum payments)
2. **Snowball Method** (smallest balance first)
3. **Avalanche Method** (highest interest first)
4. **Custom Strategy** (user-defined priority)

For each strategy, show:
- Estimated payoff date
- Total interest savings vs current plan
- Monthly payment allocation
- Payoff order visualization
- "Switch to This Strategy" button

**Loans List:**
Display loans as cards (Grid: 2 columns desktop, 1 mobile)

**Each Loan Card Contains:**
- Lender logo (48px, top-left)
- Loan type badge (Mortgage, Auto, Personal, etc.)
- Loan name/description (user-defined)
- Account number (masked: **** 1234)

**Financial Summary:**
- Original loan amount (small, gray)
- Current balance (large, bold, red)
- Progress bar (visual):
  - Paid portion (green)
  - Remaining (red)
  - Percentage paid

**Payment Info:**
- Monthly payment: RM X
- Interest rate: Y% APR
- Remaining term: Z months
- Next payment date (countdown)
- Payment status: On-time, Late, Upcoming

**Interest Breakdown:**
- Total interest (lifetime): RM X
- Interest paid so far: RM Y
- Interest remaining: RM Z
- Mini chart showing principal vs interest over time

**Quick Actions:**
- Make Payment (opens payment modal)
- View Details
- Extra Payment Calculator
- Edit Loan
- Delete Loan

**Loan Card States:**
- **Payment Due Soon (< 7 days):** Yellow border glow, warning icon
- **Payment Overdue:** Red border glow, pulsing animation, urgent badge
- **Paid This Month:** Green checkmark, muted
- **High Interest (>10%):** Alert badge, "Refinance opportunity"

**Payment Calendar:**
- Monthly view showing all loan payment due dates
- Color-coded by loan type
- Hover shows loan details
- Click to mark as paid or view loan

**Loans Comparison Table:**
Table view option showing all loans:
- Columns: Lender, Type, Balance, Rate, Monthly Payment, Remaining Term, Total Interest
- Sortable columns
- Export to CSV

**Empty State:**
- Debt-free celebration illustration
- "You have no active loans"
- "Congratulations on being debt-free!"
- Or: "Add a loan to start tracking payments"
- "Add Loan" button

### Page: /loans/new (Add Loan)

**Modal Presentation (Full-screen or large modal)**

**Step 1: Choose Loan Type**

Display 6 large cards:
1. **Home Loan / Mortgage** (House icon)
2. **Car Loan** (Car icon)
3. **Personal Loan** (User icon)
4. **Education Loan** (Book icon)
5. **Business Loan** (Briefcase icon)
6. **Islamic Financing** (Star icon)

Each card shows:
- Icon
- Loan type name
- Typical term and rate
- "Select" button

**Step 2: Loan Details**

Form fields:

1. **Lender/Bank** (required)
   - Dropdown with logos: Malaysian banks + "Other"
   - Search to filter
   - Logo displayed when selected

2. **Loan Name** (required)
   - Auto-filled based on type
   - User can customize
   - Example: "Maybank Home Loan", "CIMB Car Financing"
   - Max 50 characters

3. **Account Number** (optional)
   - Masked input
   - Last 4 digits shown
   - For reference

4. **Original Loan Amount** (required)
   - Currency input (MYR)
   - The principal borrowed
   - Example: RM 350,000

5. **Current Balance** (required)
   - Currency input (MYR)
   - Outstanding balance
   - If new loan: Same as original amount
   - Example: RM 342,500

6. **Interest Rate (APR)** (required)
   - Percentage input (2 decimals)
   - Annual Percentage Rate
   - Example: 3.85%
   - For Islamic: "Profit Rate"
   - Show typical rate range hint

7. **Loan Term** (required)
   - Number input: Months or Years
   - Dropdown: Months / Years
   - Example: 25 years = 300 months
   - Auto-convert

8. **Start Date** (required)
   - Date picker
   - When loan was disbursed
   - Used for amortization calculation

9. **Payment Day** (required)
   - Day of month (1-31)
   - When monthly payment is due
   - Example: 5th of every month

10. **Monthly Payment Amount** (required)
    - Currency input (MYR)
    - Auto-calculate if not provided
    - Formula: PMT(rate/12, term, -principal)
    - User can override

11. **Payment Method** (optional)
    - Dropdown: Auto Debit, Online Banking, Check, Cash
    - Linked account selector (if auto-debit)

12. **Payment Status**
    - Radio buttons: Current, Paid Ahead, Behind
    - If behind: Number of missed payments

**Step 3: Additional Details**

13. **Loan Purpose** (optional)
    - For home: Property address
    - For auto: Vehicle details (make, model, year)
    - For education: Institution name
    - Textarea

14. **Collateral/Asset** (optional)
    - What secures the loan
    - Property value, vehicle value
    - Currency input

15. **Late Payment Fee** (optional)
    - Currency input
    - Charge if payment late

16. **Prepayment Penalty** (optional)
    - Percentage or fixed amount
    - For early payoff calculation

17. **Payment Reminders**
    - Days before due date: Multi-select chips
    - 7 days, 3 days, 1 day, On due date
    - Notification preferences

18. **Budget Integration**
    - Auto-add to "Debt Payments" budget
    - Toggle switch

19. **Notes** (optional)
    - Textarea for additional info
    - Loan terms, special conditions

**Step 4: Amortization Preview**

Show calculated loan details:
- Monthly payment (if auto-calculated)
- Total interest over life of loan (shocking number)
- Total amount to be paid (principal + interest)
- Amortization chart preview (first 12 months)
- Payoff date
- "These numbers are estimates based on your inputs"

**Actions:**
- Cancel button
- Back button (to previous step)
- Save Loan button (primary gradient)
- Calculate Amortization checkbox

**Validation:**
- All required fields filled
- Interest rate > 0 and < 30%
- Current balance ≤ Original amount
- Monthly payment > 0
- Term > 0

### Page: /loans/:id (Loan Details)

**Layout:**
- Back button to loans list
- Edit and Delete buttons (top-right)
- "Make Extra Payment" button (prominent)

**Loan Header Card:**
- Large lender logo
- Loan name (editable inline)
- Loan type badge
- Account number (full, with show/hide)
- Status badge (Active, Paid Off, Defaulted)

**Current Status Overview:**
- Large circular progress gauge:
  - Outer ring: Original amount
  - Inner fill: Amount paid (green)
  - Remaining: Red
  - Center: Percentage paid
  - Animated

**Financial Summary:**
- Original Amount: RM X
- Current Balance: RM Y (large, bold, red)
- Amount Paid: RM Z (green)
- Remaining: RM A (red)
- Progress: B% paid

**Monthly Payment Breakdown:**
- Monthly Payment: RM X (large)
- Principal Portion: RM Y (green bar)
- Interest Portion: RM Z (red bar)
- Stacked bar chart visualization

**Interest Details:**
- Interest Rate: X% APR
- Total Interest (Lifetime): RM A
- Interest Paid So Far: RM B
- Interest Remaining: RM C
- "You've saved RM D with extra payments" (if applicable)

**Timeline:**
- Start Date: [Date]
- Original Term: X years
- Remaining Term: Y months
- Next Payment Date: [Date with countdown]
- Projected Payoff Date: [Date]

**Amortization Schedule:**
Two views:

1. **Summary Table** (First 12 months + Last 12 months)
   - Columns: Payment #, Date, Payment, Principal, Interest, Balance
   - Expandable to show all payments
   - Export to CSV/Excel

2. **Amortization Chart**
   - Stacked area chart
   - X-axis: Payment number or date
   - Y-axis: Amount
   - Two areas: Principal (green) and Interest (red)
   - Show current position marker
   - Interactive: Hover for details

**Payment History:**
- List of actual payments made
- Date, Amount, Status (On-time, Late)
- Link to transaction (if created)
- "Record Payment" button

**Extra Payment Impact:**
- "What if I pay RM X extra per month?"
- Interactive calculator (slider)
- Show:
  - New payoff date
  - Months saved
  - Interest saved
  - Total savings
- "Apply This Strategy" button

**Early Payoff Calculator:**
- "Pay off loan completely today"
- Current balance + prepayment penalty
- Interest saved
- Confirmation: "Are you sure?"

**Refinancing Analysis:**
- Current loan summary
- "Explore Refinancing Options"
- Shows potential savings with:
  - Lower interest rate scenario
  - Shorter term scenario
  - Compare multiple options
- "Not financial advice - consult advisor"

**AI Insights:**
- Debt payoff recommendations
- Compare to similar loans
- Optimization suggestions
- "Based on your income and expenses, consider..."

**Actions:**
- Make Regular Payment
- Make Extra Payment
- View Full Amortization
- Download Payment Schedule
- Set Payment Reminders
- Refinance Calculator

### Debt Payoff Strategies Page: /loans/strategies

**Comparison Dashboard:**

**Strategy 1: Current Plan (Minimum Payments)**
- Pay minimum on all loans
- Longest payoff time
- Highest total interest
- Baseline for comparison

**Strategy 2: Snowball Method**
- Pay minimums on all except smallest balance
- Put extra toward smallest loan first
- Quick wins, psychological boost
- Payoff order list (smallest to largest)

**Strategy 3: Avalanche Method**
- Pay minimums on all except highest interest
- Put extra toward highest rate first
- Maximum interest savings
- Payoff order list (highest rate to lowest)

**Strategy 4: Custom Strategy**
- User defines priority
- Drag-and-drop loan order
- Allocate extra payment amount
- Simulate results

**For Each Strategy, Display:**
- Payoff timeline (Gantt chart)
- Total interest paid
- Savings vs current plan
- Time saved
- Monthly payment allocation breakdown
- "Select This Strategy" button

**Extra Payment Allocation:**
- "How much extra can you pay per month?"
- Slider or input: RM 0 - RM 5,000
- Instantly updates all strategy projections
- "Every extra RM 100 saves X months and RM Y interest"

**Visual Comparison:**
- Side-by-side bar chart
- X-axis: Strategy
- Y-axis: Total interest paid
- Winner highlighted (Avalanche usually)

---

## 📱 MOBILE APPLICATION - LOANS

### Screen: LoansScreen (Tab Navigator)

**Header:**
- Title: "Loans & Debt"
- Calculator icon (payoff calculator)
- Add FAB (floating action button)

**Debt Summary Card:**
- Large card showing total debt
- Debt-free countdown
- Progress ring (debt paid %)
- Swipe to see different metrics

**Quick Stats Row:**
- 3 small cards (horizontal scroll)
- Total Debt, Monthly Payments, Interest Total

**Debt Progress Bar:**
- Visual bar showing overall payoff progress
- Percentage and amount paid
- Animated

**Loans List:**
- FlatList grouped by status (Active, Paid Off)
- Section headers sticky
- Pull-to-refresh
- Each loan card:
  - Lender logo (left, 40px)
  - Loan name and type
  - Current balance (large, red)
  - Progress bar
  - Next payment date
  - Monthly payment amount
  - Swipe actions: Pay, View Details, Edit
  - Tap to view details

**Payment Due Soon:**
- Highlighted section at top
- Loans with payments due in next 7 days
- "Pay Now" button prominent

**Quick Actions:**
- "Make Payment" button
- "Payoff Calculator"
- "View Strategies"

**Empty State:**
- Debt-free illustration
- "No active loans"
- "Add Loan" button

### Screen: AddLoanScreen (Modal)

**Full-screen modal, step-by-step:**

**Step 1: Select Type**
- 6 cards (vertical scroll)
- Home, Auto, Personal, Education, Business, Islamic
- Icon, name, typical rate
- Tap to select

**Step 2: Lender**
- Search bar
- Grid of Malaysian bank logos
- Tap to select

**Step 3: Loan Amounts**
- Scrollable form
- Large inputs for key fields:
  - Original Amount
  - Current Balance
  - Interest Rate
- Visual slider for rate

**Step 4: Payment Info**
- Loan term (months/years selector)
- Start date picker
- Payment day (wheel picker 1-31)
- Monthly payment (auto-calculated, editable)

**Step 5: Additional Details**
- Payment method
- Reminders
- Budget integration toggle
- Notes (expandable)

**Step 6: Review**
- Summary card
- Amortization preview
- Total interest calculation
- "Save Loan" button (gradient, sticky)

**Actions:**
- Close button (top-left, with confirmation)
- Back button (each step)
- Next/Save button (bottom, sticky)

### Screen: LoanDetailScreen

**Scrollable content:**

**Header:**
- Large lender logo
- Loan name and type
- Status badge

**Progress Card:**
- Large circular gauge
- Amount paid vs remaining
- Percentage in center
- Animated

**Financial Summary:**
- 2x2 grid of stat cards
- Original Amount, Current Balance
- Interest Paid, Interest Remaining

**Monthly Payment Card:**
- Large amount
- Principal vs Interest breakdown
- Stacked bar chart

**Timeline:**
- Visual timeline
- Start → Current → Payoff
- Dates and countdown

**Payment Schedule:**
- Next 6 months preview
- Each month showing:
  - Date, Amount, Principal, Interest
- "View Full Schedule" button

**Action Buttons:**
- Make Payment (gradient, prominent)
- Extra Payment Calculator
- Refinance Analyzer
- View History

**Recent Payments:**
- Last 5 payments
- Date, Amount, Status
- "View All" button

### Bottom Sheet: MakePayment

**Content:**
- Loan name and balance
- Payment type selector:
  - Regular Payment (monthly amount)
  - Extra Payment (additional amount)
  - Lump Sum Payment
- Amount input
  - Pre-filled for regular
  - User input for extra/lump sum
- Payment date picker (default: today)
- Source account selector
- Create transaction toggle
  - If ON: Auto-create expense transaction
- "Impact of this payment" preview:
  - New balance
  - Months saved (if extra payment)
  - Interest saved
- Make Payment button (gradient)
- Cancel button

### Bottom Sheet: ExtraPaymentCalculator

**Content:**
- Current loan summary
- "Extra payment amount" slider
  - RM 0 - RM 5,000
  - Real-time updates
- Results display:
  - New payoff date
  - Months saved
  - Interest saved (large, green)
  - Visual timeline comparison
- "Apply this to my loan" button
- Share results option

### Bottom Sheet: PayoffStrategies

**Content:**
- Swipeable cards showing 3 strategies
  - Current Plan
  - Snowball
  - Avalanche
- Each card shows:
  - Strategy name and description
  - Payoff date
  - Total interest
  - Savings vs current
  - Visual chart
- "Select Strategy" button
- Compare all button (opens full screen)

---

## 🤖 AI-POWERED FEATURES

### 1. Smart Debt Payoff Strategy

**Edge Function: `generate-debt-payoff-strategy`**

**Input:**
- All user loans (balances, rates, payments)
- User's monthly income
- Current expenses and budgets
- Extra payment capacity

**Grok API Prompt:**
You are a debt payoff strategist. Analyze these loans and create optimal repayment strategies.
User's Loans:
{loansData}
Monthly Income: RM {income}
Monthly Expenses: RM {expenses}
Available for Extra Payment: RM {extraCapacity}
Financial Goals:
{goals}
Provide strategies in JSON:
{
"currentPlan": {
"payoffDate": "2035-06-15",
"totalInterest": 125000,
"monthlyPayment": 2500
},
"snowballMethod": {
"description": "Pay off smallest balances first for quick wins",
"payoffOrder": [
{
"loanId": "loan3",
"loanName": "Personal Loan",
"reason": "Smallest balance (RM 8,000)"
},
{
"loanId": "loan2",
"loanName": "Car Loan",
"reason": "Next smallest (RM 45,000)"
}
],
"payoffDate": "2033-02-10",
"totalInterest": 115000,
"interestSaved": 10000,
"timeSaved": "28 months",
"pros": ["Quick psychological wins", "Builds momentum", "Frees up cash flow faster"],
"cons": ["May pay more interest than Avalanche method"]
},
"avalancheMethod": {
"description": "Pay off highest interest rates first for maximum savings",
"payoffOrder": [
{
"loanId": "loan3",
"loanName": "Personal Loan",
"reason": "Highest rate (12.5% APR)"
},
{
"loanId": "loan1",
"loanName": "Home Loan",
"reason": "Second highest rate (4.2% APR)"
}
],
"payoffDate": "2032-11-05",
"totalInterest": 108000,
"interestSaved": 17000,
"timeSaved": "31 months",
"pros": ["Maximum interest savings", "Mathematically optimal", "Faster payoff"],
"cons": ["May take longer to see first loan paid off"]
},
"recommendation": {
"bestStrategy": "avalanche",
"reasoning": "Save RM 17,000 in interest and become debt-free 31 months earlier",
"customAdvice": [
"Focus RM 500 extra per month on Personal Loan (12.5% rate)",
"After Personal Loan paid off, redirect its payment to Car Loan",
"Consider refinancing Home Loan if rate drops below 3.5%"
]
},
"quickWins": [
"Pay RM 200 extra on Personal Loan this month",
"Set up auto-debit to never miss payments",
"Review spending to free up RM 300 more per month"
],
"milestones": [
{
"achievement": "First loan paid off",
"estimatedDate": "2027-03-15",
"impact": "Free up RM 450/month for other loans"
},
{
"achievement": "50% debt-free",
"estimatedDate": "2030-06-20",
"celebration": "Treat yourself to RM 500 celebration"
}
]
}
**Display:**
- Side-by-side strategy comparison
- Interactive charts showing payoff timelines
- Drag-and-drop to customize priority
- "What if" simulator
- Share strategy via email/PDF

### 2. Refinancing Opportunity Detection

**Edge Function: `analyze-refinancing-opportunities`**

**Runs quarterly or when rates change**

**Logic:**
```javascript
function detectRefinancingOpportunity(loan, currentMarketRates) {
  const rateDifference = loan.interestRate - currentMarketRates.average
  const remainingBalance = loan.currentBalance
  const remainingTerm = loan.remainingMonths
  
  if (rateDifference >= 0.5) { // At least 0.5% lower
    const potentialSavings = calculateRefinanceSavings(
      remainingBalance,
      remainingTerm,
      loan.interestRate,
      currentMarketRates.average
    )
    
    if (potentialSavings.totalSaved > 5000) {
      return {
        isOpportunity: true,
        currentRate: loan.interestRate,
        newRate: currentMarketRates.average,
        monthlySavings: potentialSavings.monthly,
        lifetimeSavings: potentialSavings.total,
        breakEvenMonths: calculateBreakEven(potentialSavings, refinancingCosts)
      }
    }
  }
  
  return { isOpportunity: false }
}
```

**Notification:**
- "💡 Refinancing Opportunity: Save RM 25,000"
- "Your home loan rate is 1.2% higher than current market"
- "Potential monthly savings: RM 350"
- "Learn More" button

### 3. Payment Anomaly Detection

**Edge Function: `detect-payment-issues`**

**Triggers:**
- Missed payment detected
- Payment amount changed significantly
- Interest rate increased
- Balance not decreasing as expected

**Notification:**
- "⚠️ Payment Issue Detected"
- "Your car loan payment was missed on [date]"
- "Late fee may apply: RM 50"
- "Make Payment Now" button

---

## 🔔 NOTIFICATIONS & REMINDERS

### Loan Payment Notifications:

1. **Upcoming Payment:**
   - "💰 Car Loan payment due in 7 days"
   - "Amount: RM850 on June 15th"

"Make Payment" action


Due Today:

"⏰ Home Loan payment due TODAY"
"Amount: RM 2,300"
Urgent notification


Overdue:

"🚨 Personal Loan payment OVERDUE"
"Payment was due 2 days ago"
"Pay Now to avoid late fees"


Payment Successful:

"✅ Car Loan payment recorded"
"New balance: RM 44,150"
"You're on track!"


Milestone Celebrations:

"🎉 50% of Home Loan paid off!"
"You've paid RM 175,000 so far"
"Keep going!"


Interest Savings:

"💸 You saved RM 500 in interest this month"
"By paying extra RM 200"
"Keep it up!"




📊 CHARTS & VISUALIZATIONS
Loan Charts:
1. Debt Payoff Progress (Gauge):

Semi-circle or full circle
Paid portion (green)
Remaining (red)
Percentage in center
Animated

2. Amortization Chart:

Stacked area chart
X-axis: Time (months/years)
Y-axis: Amount
Two areas:

Principal (green, bottom)
Interest (red, top)


Current position marker
Interactive hover

3. Payment Breakdown (Donut):

Monthly payment split
Principal (green segment)
Interest (red segment)
Center: Total payment

4. Payoff Timeline (Gantt):

Horizontal bars for each loan
Start to projected end
Current position marker
Color-coded by loan type
Compare strategies (overlay)

5. Interest Over Time (Line):

Decreasing line chart
Shows interest portion shrinking
Principal portion increasing
Crossover point highlighted

6. Debt Reduction Projection:

Line chart sloping down
Total debt over time
Milestone markers
"Debt-Free" endpoint celebration

DATABASE SCHEMA
-- Already defined in Phase 1, here are additional fields

ALTER TABLE loans ADD COLUMN IF NOT EXISTS lender_id TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lender_name TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lender_logo TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_type TEXT CHECK (loan_type IN ('home', 'auto', 'personal', 'education', 'business', 'islamic'));
ALTER TABLE loans ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS account_number_masked TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS collateral_value DECIMAL(15, 2);
ALTER TABLE loans ADD COLUMN IF NOT EXISTS prepayment_penalty DECIMAL(10, 2);
ALTER TABLE loans ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10, 2);
ALTER TABLE loans ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS linked_account_id UUID REFERENCES accounts(id);
ALTER TABLE loans ADD COLUMN IF NOT EXISTS reminder_days INTEGER[] DEFAULT ARRAY[7, 3, 1];
ALTER TABLE loans ADD COLUMN IF NOT EXISTS auto_create_transaction BOOLEAN DEFAULT TRUE;

-- Loan payment schedules (amortization)
CREATE TABLE loan_amortization_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  
  payment_number INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  
  payment_amount DECIMAL(10, 2),
  principal_amount DECIMAL(10, 2),
  interest_amount DECIMAL(10, 2),
  remaining_balance DECIMAL(15, 2),
  
  is_paid BOOLEAN DEFAULT FALSE,
  actual_payment_date DATE,
  actual_amount DECIMAL(10, 2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(loan_id, payment_number)
);

CREATE INDEX idx_loan_amortization_loan_date ON loan_amortization_schedule(loan_id, payment_date);

-- Payoff strategies
CREATE TABLE loan_payoff_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  strategy_type TEXT CHECK (strategy_type IN ('current', 'snowball', 'avalanche', 'custom')) NOT NULL,
  strategy_name TEXT,
  
  extra_payment_amount DECIMAL(10, 2) DEFAULT 0,
  loan_priority_order JSONB, -- Array of loan IDs in payoff order
  
  projected_payoff_date DATE,
  total_interest DECIMAL(15, 2),
  interest_saved DECIMAL(15, 2),
  months_saved INTEGER,
  
  is_active BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refinancing analysis
CREATE TABLE loan_refinance_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  
  analysis_date DATE DEFAULT CURRENT_DATE,
  
  current_rate DECIMAL(5, 2),
  new_rate DECIMAL(5, 2),
  monthly_savings DECIMAL(10, 2),
  lifetime_savings DECIMAL(15, 2),
  break_even_months INTEGER,
  
  is_recommended BOOLEAN,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
📦 DELIVERABLES
Web:

✅ Loans list page with debt summary
✅ Add loan wizard
✅ Loan detail page with amortization
✅ Debt payoff strategies comparison
✅ Extra payment calculator
✅ Refinancing analyzer
✅ Payment history tracking
✅ Amortization schedule viewer
✅ Make payment modal
✅ AI debt payoff recommendations

Mobile:

✅ Loans screen with list
✅ Add loan screen
✅ Loan detail screen
✅ Make payment bottom sheet
✅ Extra payment calculator
✅ Payoff strategies bottom sheet
✅ Payment reminders
✅ Swipe to pay
✅ Amortization chart (Victory Native)

Backend:

✅ Database schema and migrations
✅ RLS policies
✅ Edge function: generate-debt-payoff-strategy
✅ Edge function: calculate-amortization-schedule
✅ Edge function: analyze-refinancing-opportunities
✅ Edge function: detect-payment-issues
✅ Cron job: Generate monthly payment records
✅ Cron job: Send payment reminders
✅ Auto-create transactions on payment
✅ Interest and principal calculations


Create all components following global design rules with Malaysian lenders, multi-currency support (MYR default), amortization calculations, and AI-powered debt payoff strategies using Grok API.