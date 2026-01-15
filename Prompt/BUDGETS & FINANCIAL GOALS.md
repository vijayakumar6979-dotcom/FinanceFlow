Following the global rules, create a comprehensive Budgets and Financial Goals management system with AI-powered recommendations, progress tracking, and smart alerts for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete budgeting and goal-setting system that allows users to:
- Create category-based budgets (monthly, weekly, yearly)
- Set and track financial goals with deadlines
- Get AI-powered budget recommendations using Grok API
- Receive smart alerts when approaching or exceeding budgets
- Visual progress tracking with charts and gauges
- Automatic rollover of unused budget amounts
- Budget vs Actual comparisons
- Goal milestones and celebrations
- Multi-currency support (default: MYR)

---

## 💡 KEY FEATURES

### Budgets:
- Category-based budgeting (Food, Transport, Shopping, etc.)
- Time periods: Daily, Weekly, Monthly, Quarterly, Yearly
- Budget templates (50/30/20 rule, zero-based, etc.)
- Recurring budgets
- Budget rollover (unused amount to next period)
- Budget sharing/family budgets
- Threshold alerts (50%, 75%, 90%, 100%)
- Overspending warnings

### Goals:
- Savings goals (Emergency Fund, Vacation, Down Payment)
- Debt payoff goals
- Investment goals
- Custom goals with milestones
- Target dates with countdown
- Automatic contribution tracking
- Progress visualization (rings, bars, timelines)
- Celebration animations on milestones

### AI Features:
- Smart budget suggestions based on income and spending patterns
- Spending category analysis
- Budget optimization recommendations
- Goal feasibility analysis
- Automated savings suggestions
- Personalized financial advice

---

## 🌐 WEB APPLICATION - BUDGETS

### Page: /budgets

**Layout:**
- Use DashboardLayout
- Header: "Budgets" with subtitle "Plan and track your spending"
- Action buttons: Create Budget, Budget Templates, Settings

**Overview Cards Row:**
Display 4 summary cards:
1. **Total Budget (This Month)**
   - Sum of all category budgets
   - Icon: Target
   - Color: Blue gradient
   
2. **Total Spent**
   - Total expenses this month
   - Percentage of total budget
   - Icon: TrendingDown
   - Color: Red if over budget, green if under
   
3. **Remaining Budget**
   - Total budget - total spent
   - Days remaining in month
   - Icon: Clock
   - Color: Green
   
4. **Budget Health Score**
   - AI-calculated score (0-100)
   - Based on staying within budgets
   - Icon: Heart/Shield
   - Color: Green (90+), Yellow (70-89), Red (<70)

**Period Selector:**
- Tabs: This Month, Last Month, This Quarter, This Year, Custom
- Date range picker for custom
- Month/Year navigation arrows

**Budget Overview Chart:**
- Large donut chart showing:
  - Center: Total budget and spent
  - Segments: Each category with color
  - Percentage and amount on hover
- Legend with category names, budgets, spent, remaining

**Budget Categories Grid:**
Display each budget as a card in grid (3 columns desktop, 2 tablet, 1 mobile)

**Each Budget Card Contains:**
- Category icon with colored background
- Category name (bold, white)
- Budget amount for period (e.g., "RM 500 / month")
- Progress bar (gradient):
  - Green: 0-50%
  - Yellow: 51-75%
  - Orange: 76-90%
  - Red: 91-100%
  - Dark red + pulsing: >100%
- Spent amount vs Budget (e.g., "RM 350 / RM 500")
- Remaining amount (green if positive, red if negative)
- Percentage spent (large number)
- Trend indicator (up/down arrow with % change from last period)
- Last transaction preview
- Quick actions menu: Edit, Delete, View Transactions
- Alert badge if threshold exceeded

**Budget Card States:**
- **On Track** (0-75%): Green border glow
- **Warning** (76-90%): Yellow border glow
- **Critical** (91-100%): Orange border glow, warning icon
- **Over Budget** (>100%): Red border glow, pulsing animation, alert icon

**Empty State:**
- Illustration of target/budget
- "No budgets set yet"
- "Create your first budget to start tracking spending"
- "Create Budget" button
- "Use Templates" button

**Budget Templates Section:**
Show popular templates:
1. **50/30/20 Rule**
   - 50% Needs (Food, Bills, Transport)
   - 30% Wants (Entertainment, Shopping)
   - 20% Savings/Debt
   
2. **Zero-Based Budget**
   - Assign every ringgit a purpose
   - Income = Expenses + Savings
   
3. **Envelope System**
   - Cash-based categories
   - Strict limits per category
   
4. **Minimum Budget**
   - Essential expenses only
   - Emergency mode
   
5. **Custom Template**
   - Create your own template
   - Save for reuse

Each template card shows:
- Template name and description
- Sample category breakdown
- "Use This Template" button

### Page: /budgets/new (Create Budget)

**Modal Presentation (slide from right)**

**Step 1: Choose Budget Type**

Two options:
1. **Category Budget** (most common)
   - Budget for specific category
   - Icon grid of categories
   
2. **Template Budget**
   - Use pre-built template
   - Adjust amounts to fit income

**Step 2: Budget Details (Category Budget)**

Form fields:
1. **Category** (required)
   - Dropdown with icons and colors
   - Search to filter
   - "Create New Category" link
   
2. **Budget Amount** (required)
   - Large currency input (MYR)
   - Calculator mode available
   - Show as percentage of income (if income set)
   
3. **Budget Period** (required)
   - Radio buttons: Daily, Weekly, Monthly, Quarterly, Yearly
   - Most common: Monthly (default)
   
4. **Start Date** (required)
   - Date picker
   - Default: 1st of current month
   
5. **End Date** (optional)
   - Date picker
   - If not set, budget continues indefinitely
   
6. **Rollover Unused Amount**
   - Toggle switch
   - If ON: Unused budget adds to next period
   - Example: "RM 50 unused → RM 550 next month"
   
7. **Alert Thresholds**
   - Checkboxes for: 50%, 75%, 90%, 100%
   - Default: 75%, 90%, 100% checked
   - Custom percentage input
   
8. **Notification Preferences**
   - Push notifications
   - Email notifications
   - In-app alerts
   
9. **Notes** (optional)
   - Textarea for budget description/goals
   - Max 500 characters

**Step 3: AI Recommendations (optional)**

Show AI analysis:
- "Based on your last 3 months spending, we suggest:"
- Recommended budget amount
- Justification with data
- Accept or Modify

**Actions:**
- Cancel button
- Back button (to previous step)
- Create Budget button (primary gradient)
- Save as Template checkbox

**Validation:**
- Amount > 0
- Category selected
- Period selected
- Start date valid
- Alert thresholds between 0-100%

### Page: /budgets/:id (Budget Details)

**Layout:**
- Back button
- Edit and Delete buttons (top-right)

**Budget Header Card:**
- Large category icon with gradient background
- Category name (editable inline)
- Period badge (Monthly, Weekly, etc.)
- Status badge (On Track, Warning, Over Budget)

**Current Period Overview:**
- Large circular progress gauge:
  - Outer ring: Budget amount
  - Inner fill: Amount spent (colored by status)
  - Center: Percentage used
  - Animated fill on load
- Budget: RM X
- Spent: RM Y
- Remaining: RM Z (colored)
- Days left in period: X days
- Projected spending at current rate
- Pace indicator: "On pace to..." or "Exceeding by..."

**Spending Breakdown:**
- List of transactions in this category
- Grouped by date (Today, Yesterday, This Week, Earlier)
- Each transaction shows:
  - Description
  - Amount
  - Date
  - Account used
- "View All Transactions" button

**Spending Trends Chart:**
- Line chart: Daily/Weekly spending over current period
- Budget line (horizontal) for comparison
- Bars for actual spending
- Projection line (dotted) showing forecast to end of period
- Color zones: green (under budget), red (over budget)

**Historical Performance:**
- Table showing last 6 periods
- Columns: Period, Budget, Spent, Remaining, Status
- Trend indicators (improving, stable, declining)
- Average spending across periods

**AI Insights Card:**
- "Based on your spending patterns..."
- Top 3 recommendations
- Budget adjustment suggestions
- Spending optimization tips
- "Get More Insights" button

**Alert Settings:**
- Current threshold notifications
- Edit thresholds
- Notification channel preferences

---

## 🎯 WEB APPLICATION - GOALS

### Page: /goals

**Layout:**
- Use DashboardLayout
- Header: "Financial Goals" with subtitle "Track your savings and debt payoff"
- Create Goal button (top-right)

**Goal Categories Tabs:**
- All Goals
- Savings Goals
- Debt Payoff
- Investment Goals
- Completed Goals

**Goals Summary Cards:**
Display 3 cards:
1. **Active Goals**
   - Count of active goals
   - Total target amount
   - Icon: Target
   
2. **Total Progress**
   - Combined progress across all goals
   - Percentage complete
   - Icon: TrendingUp
   
3. **Goals Achieved**
   - Count of completed goals
   - Total amount achieved
   - Icon: Award

**Goals Grid:**
Display goals as large cards (2 columns desktop, 1 mobile)

**Each Goal Card Contains:**
- Goal emoji/icon (user selected)
- Goal name (bold, large)
- Target amount in MYR
- Current saved amount
- Circular progress ring:
  - Outer ring: Target amount
  - Inner fill: Current amount (gradient)
  - Center: Percentage complete
  - Animated on load
- Progress bar (linear backup)
- Remaining amount needed
- Target date with countdown:
  - "X days remaining"
  - "Due in X months"
  - Color: Green (on track), Yellow (at risk), Red (unlikely)
- Monthly contribution needed (if behind)
- Quick contribute button
- Edit and Delete actions menu

**Goal Card Variants by Type:**

1. **Savings Goal:**
   - Piggy bank or custom emoji
   - "Save RM X by Date"
   - Contribution history chart
   - Milestone badges (25%, 50%, 75%)
   
2. **Debt Payoff Goal:**
   - Target icon
   - "Pay off RM X debt by Date"
   - Snowball/Avalanche strategy indicator
   - Interest saved so far
   
3. **Investment Goal:**
   - Chart/growth icon
   - "Invest RM X by Date"
   - Expected returns estimate
   - Risk level indicator

**Milestones Section:**
Show upcoming milestones across all goals:
- Next 3 milestones
- Date, Goal name, Milestone (e.g., "50% of Vacation Fund")
- Progress to milestone
- Celebration countdown

**Goal Templates:**
Pre-built goal templates:
1. Emergency Fund (3-6 months expenses)
2. Vacation
3. Down Payment (House/Car)
4. Wedding
5. Education Fund
6. Retirement Contribution
7. Debt Free
8. Custom Goal

**Empty State:**
- Goal achievement illustration
- "No goals set yet"
- "Set your first financial goal and start saving"
- "Create Goal" button

### Page: /goals/new (Create Goal)

**Modal Presentation**

**Step 1: Choose Goal Type**

Display 4 large cards:
1. **Savings Goal** (Most common)
   - Icon: Piggy bank
   - "Save money for something special"
   
2. **Debt Payoff Goal**
   - Icon: Target with arrow
   - "Eliminate debt and become debt-free"
   
3. **Investment Goal**
   - Icon: Chart trending up
   - "Build wealth through investing"
   
4. **Custom Goal**
   - Icon: Star
   - "Create your own financial goal"

**Step 2: Goal Details**

Form fields:
1. **Goal Name** (required)
   - Text input
   - Placeholder: "Emergency Fund", "Dream Vacation", "New Car"
   - Max 50 characters
   
2. **Goal Emoji/Icon** (optional)
   - Emoji picker
   - Icon library
   - Upload custom image
   - Default: based on goal type
   
3. **Target Amount** (required)
   - Large currency input (MYR)
   - Show equivalent in other currencies
   
4. **Current Amount** (optional)
   - How much already saved
   - Default: 0
   
5. **Target Date** (required)
   - Date picker
   - Minimum: Tomorrow
   - Show: "X months away"
   
6. **Category** (optional)
   - For tracking contributions
   - Dropdown of income categories
   
7. **Priority** (required)
   - Radio buttons: Low, Medium, High
   - Visual indicators (colors)
   - Default: Medium
   
8. **Auto-Contribute**
   - Toggle switch
   - If ON, show:
     - Contribution amount
     - Frequency (Weekly, Monthly)
     - Source account
     - Start date
   
9. **Linked Account** (optional)
   - Specific savings account for this goal
   - Dropdown of accounts
   
10. **Milestones**
    - Add milestone checkpoints
    - 25%, 50%, 75% (auto-added)
    - Custom milestones
    - Each with optional reward/celebration note
    
11. **Description** (optional)
    - Textarea: Why this goal matters
    - Motivation note
    - Max 500 characters

**Step 3: Goal Plan (AI-Generated)**

Show AI analysis:
- Monthly contribution needed: RM X
- Feasibility score (0-100)
- Based on: Income, expenses, existing commitments
- Alternative timeline suggestions
- Budget adjustments needed
- Tips to reach goal faster

**Display:**
- Timeline visualization
- Monthly contribution breakdown
- Sacrifice/adjustment suggestions
- Accept plan or modify amounts

**Actions:**
- Cancel button
- Back button
- Create Goal button (gradient, primary)

### Page: /goals/:id (Goal Details)

**Layout:**
- Back button
- Edit and Delete buttons
- Mark as Complete button (if target reached)

**Goal Hero Section:**
- Large emoji/icon
- Goal name (editable inline)
- Status badge (In Progress, At Risk, On Track, Completed)

**Progress Display:**
- Large circular progress ring (150px):
  - Gradient fill
  - Animated count-up
  - Center shows percentage
- Current amount (large, bold)
- Target amount
- Remaining amount
- Progress bar (backup)

**Timeline Section:**
- Visual timeline with milestones
- Start date → Target date
- Current position marker
- Milestone markers (25%, 50%, 75%, custom)
- Days elapsed / Days remaining
- Estimated completion date (based on pace)

**Contribution Statistics:**
- Total contributed so far
- Number of contributions
- Average contribution amount
- Largest contribution
- Most recent contribution
- Contribution frequency (actual)

**Contribution Chart:**
- Bar chart: Monthly contributions
- Line: Cumulative progress
- Target line (dotted)
- Projection line
- Color zones (ahead, on track, behind)

**Monthly Plan:**
- Required monthly contribution to stay on track
- Current pace vs required pace
- Adjustments needed
- Quick contribute button (opens modal)

**Contribution History:**
- List of all contributions
- Date, Amount, Source, Note
- "View All" button if >10 contributions

**AI Insights:**
- Goal feasibility analysis
- Suggestions to accelerate progress
- Budget reallocation recommendations
- Side income ideas
- "Your goal is achievable with these adjustments..."

**Milestones List:**
- Upcoming milestones
- Completed milestones (with celebration badges)
- Progress to next milestone
- Add custom milestone button

**Goal Settings:**
- Edit target amount
- Change deadline
- Adjust auto-contribute
- Pause/Resume goal
- Archive goal (if no longer relevant)

---

## 📱 MOBILE APPLICATION - BUDGETS

### Screen: BudgetsScreen (Tab Navigator)

**Header:**
- Title: "Budgets"
- Period selector (This Month dropdown)
- Add FAB (floating action button)

**Summary Cards Carousel:**
- Horizontal scrollable
- 4 cards: Total Budget, Spent, Remaining, Health Score
- Each card: gradient background, icon, value, label

**Budget Overview Chart:**
- Donut chart showing category breakdown
- Tap segments for details
- Legend below (scrollable if many categories)

**Budget Categories List:**
- FlatList with sections
- Section headers: "On Track", "Warning", "Over Budget"
- Pull-to-refresh
- Each budget card:
  - Icon with colored background
  - Category name and period
  - Progress bar (colored by status)
  - Spent / Budget amounts
  - Percentage
  - Tap to view details
  - Swipe actions: Edit, Delete

**Quick Actions:**
- "Review All Budgets" button
- "Get AI Recommendations" button

**Empty State:**
- Illustration
- "Create your first budget"
- Template buttons (50/30/20, Zero-Based, etc.)

### Screen: CreateBudgetScreen (Modal)

**Full-screen modal**

**Step-by-step flow:**

**Step 1: Select Category**
- Grid of category icons (3 columns)
- Search bar at top
- Each category shows current spending this month
- "Create New Category" option

**Step 2: Set Amount**
- Large currency input (centered)
- Number pad (custom, with decimal)
- Show as % of income below
- Quick presets (based on income):
  - 10%, 15%, 20%, 25%, 30%
- "Based on your spending, we suggest RM X" hint

**Step 3: Choose Period**
- Radio buttons with icons
- Daily, Weekly, Monthly (default), Quarterly, Yearly
- Show example: "RM 500 / month"

**Step 4: Settings**
- Start date picker
- Rollover toggle
- Alert thresholds (multi-select chips: 50%, 75%, 90%, 100%)
- Notification preferences toggles

**Step 5: Review & Create**
- Summary card showing all details
- AI recommendation card
- Edit buttons for each section
- Create button (gradient, sticky bottom)

**Actions:**
- Close button (top-left)
- Back button (each step)
- Next/Create button (bottom, sticky)

### Screen: BudgetDetailScreen

**Scrollable content:**

**Header:**
- Large category icon
- Category name
- Period badge
- Status badge

**Progress Card:**
- Circular gauge (large, centered)
- Spent / Budget amounts
- Remaining amount (colored)
- Days left in period
- "On pace" or "Over pace" indicator

**Quick Stats Row:**
- 3 small cards:
  - Avg daily spending
  - Largest transaction
  - Transaction count

**Spending Chart:**
- Line/Bar chart: Daily spending
- Budget line
- Current period only
- Scrollable if many days

**Recent Transactions:**
- Last 5 in this category
- "View All" button

**Action Buttons:**
- Edit Budget
- View All Transactions
- Get AI Insights
- Delete Budget (danger)

### Bottom Sheet: BudgetTemplates

**Content:**
- Template cards (vertically stacked)
- Each shows:
  - Name and description
  - Sample breakdown
  - Use button
- Custom template option at bottom

---

## 🎯 MOBILE APPLICATION - GOALS

### Screen: GoalsScreen (Tab Navigator)

**Header:**
- Title: "Goals"
- Filter dropdown (All, Savings, Debt, Investment)
- Add FAB

**Goals Summary:**
- 3 stat cards (horizontal scroll)
- Active goals, Total progress, Achieved goals

**Goals List:**
- FlatList
- Each goal card:
  - Emoji/icon (large)
  - Goal name
  - Circular progress ring
  - Current / Target amounts
  - Target date countdown
  - Priority badge
  - Tap to view details
  - Swipe actions: Edit, Delete, Contribute

**Milestones Preview:**
- "Upcoming Milestones" section
- Next 3 milestones across all goals
- Horizontal scroll

**Empty State:**
- Goal illustration
- "Set your first financial goal"
- Template buttons

### Screen: CreateGoalScreen (Modal)

**Step-by-step wizard:**

**Step 1: Choose Type**
- 4 large cards (vertically stacked)
- Savings, Debt Payoff, Investment, Custom
- Icon, title, description for each

**Step 2: Goal Details**
- Scrollable form
- Goal name input
- Emoji picker button
- Target amount (large input)
- Current amount
- Target date picker
- Priority selector (chips)

**Step 3: Contribution Plan**
- Auto-contribute toggle
- If ON:
  - Amount slider
  - Frequency picker
  - Source account selector
  - Start date
- Linked account selector

**Step 4: AI Analysis**
- "Analyzing your goal..."
- Loading animation
- Results:
  - Feasibility score gauge
  - Monthly contribution needed
  - Adjustments required
  - Timeline visualization
- Accept or modify

**Step 5: Milestones**
- Auto-milestones (25%, 50%, 75%) pre-added
- Add custom milestone button
- Each with optional note

**Step 6: Review**
- Summary of all details
- Edit buttons for each section
- Create button (sticky bottom)

### Screen: GoalDetailScreen

**Scrollable content:**

**Hero Section:**
- Large emoji (80px)
- Goal name
- Status badge

**Progress Display:**
- Large circular ring (200px)
- Animated progress
- Current / Target amounts
- Percentage in center

**Timeline Visual:**
- Horizontal timeline
- Start → Today → Milestones → Target
- Progress indicator
- Days remaining

**Stats Row:**
- 4 small cards (2x2 grid)
- Total contributed
- Contributions count
- Average contribution
- Remaining needed

**Contribution Chart:**
- Bar chart (monthly contributions)
- Last 6 months
- Scrollable for more

**Action Buttons:**
- Large "Contribute Now" button (gradient)
- Edit Goal
- View History
- Get AI Tips

**Milestones List:**
- Completed (with checkmarks and dates)
- Upcoming (with progress)
- Add milestone button

**Recent Contributions:**
- Last 5 contributions
- Date, amount, note
- "View All" button

### Bottom Sheet: ContributeToGoal

**Content:**
- Goal name and current progress
- Amount input (large, centered)
- Number pad
- Quick amounts (RM 50, 100, 200, 500)
- Source account selector
- Note input (optional)
- Contribute button (gradient)
- Close button

---

## 🤖 AI-POWERED FEATURES

### 1. Smart Budget Recommendations

**Edge Function: `generate-budget-recommendations`**

**Input:**
- User ID
- Income (monthly)
- Last 3-6 months spending data
- Existing budgets (if any)

**Grok API Prompt:**
You are a financial budgeting expert. Analyze this user's financial data and recommend optimal budget allocations.
Monthly Income: RM {income}
Last 3 months spending by category:
{categoryBreakdown}
Current budgets:
{existingBudgets}
User's financial goals:
{goals}
Provide budget recommendations in JSON:
{
"recommendedBudgets": [
{
"category": "Food & Dining",
"suggestedAmount": 800,
"reasoning": "Your average spending is RM 950, try reducing by 15%",
"difficulty": "moderate",
"tips": ["Meal prep on weekends", "Limit dining out to 2x per week"]
}
],
"budgetStrategy": "50/30/20" | "zero-based" | "envelope",
"totalBudget": 4500,
"savingsPotential": 500,
"priorities": ["Reduce dining", "Optimize transport"],
"overallAdvice": "Focus on reducing discretionary spending by 20%..."
}
**Display:**
- Recommendation cards for each category
- Accept all or individual
- Modify suggested amounts
- See reasoning and tips

### 2. Budget Health Score

**Calculation:**
```javascript
Score = (
  (Categories within budget × 40) +
  (Average budget utilization (inverse) × 30) +
  (Consistency across periods × 20) +
  (Achieving savings goals × 10)
) / 100

Color coding:
- 90-100: Excellent (Green)
- 70-89: Good (Yellow)
- 50-69: Fair (Orange)
- < 50: Needs Improvement (Red)
```

**Edge Function: `calculate-budget-health`**

Returns:
- Overall score
- Category scores
- Improvement suggestions
- Trend (improving, stable, declining)

### 3. Goal Feasibility Analysis

**Edge Function: `analyze-goal-feasibility`**

**Input:**
- Goal target amount
- Target date
- Current saved amount
- User's income and expenses
- Existing goals and budgets

**Grok API Prompt:**
Analyze if this financial goal is achievable.
Goal: Save RM {target} by {date}
Current Amount: RM {current}
Monthly Income: RM {income}
Monthly Expenses: RM {expenses}
Other Active Goals: {otherGoals}
Calculate:

Monthly contribution needed
Feasibility score (0-100)
Required budget adjustments
Alternative timelines if not feasible
Side income suggestions

Return JSON:
{
"feasibilityScore": 85,
"monthlyContributionNeeded": 450,
"isAchievable": true,
"confidenceLevel": "high",
"requiredAdjustments": [
{
"category": "Entertainment",
"currentBudget": 300,
"suggestedBudget": 200,
"freed Amount": 100
}
],
"alternativeTimelines": [
{
"months": 18,
"monthlyContribution": 300,
"moreRealistic": true
}
],
"sideIncomeIdeas": [
"Freelancing (potential: RM 500/month)",
"Part-time gig (potential: RM 800/month)"
],
"advice": "Your goal is achievable with minor budget adjustments..."
}
### 4. Spending Pattern Alerts

**Automated checks (daily cron job):**
- Unusual large transactions
- Category spending spikes
- Budget threshold breaches
- Duplicate transactions
- Forgotten subscriptions

**Edge Function: `analyze-spending-patterns`**

Triggers notifications when:
- Category spending > 90% of budget
- Spending 2x higher than last month
- New recurring charge detected
- Overspending projected by month-end

---

## 🔔 NOTIFICATIONS & ALERTS

### Budget Notifications:

1. **Threshold Alerts:**
   - "You've spent 75% of your Food budget"
   - "Warning: 90% of Shopping budget used"
   - "Budget exceeded: Transport is RM 50 over"

2. **Daily Summaries:**
   - "Today's spending: RM 45 across 3 transactions"
   - "You have RM 300 remaining in budgets today"

3. **Weekly Reviews:**
   - "This week: Spent RM 450, Budget RM 500"
   - "Great job! Under budget by RM 50"

4. **Month-End:**
   - "August summary: 6/8 budgets on track"
   - "You saved RM 200 this month!"

### Goal Notifications:

1. **Milestone Achievements:**
   - "🎉 You've reached 50% of your Vacation Fund!"
   - "Congratulations! Emergency Fund is 75% complete"

2. **Progress Updates:**
   - "Add RM 150 more to stay on track for New Car goal"
   - "You're ahead! Only RM 500 more needed"

3. **Deadline Reminders:**
   - "30 days until your Wedding goal deadline"
   - "Final stretch! 1 week to reach your target"

4. **Contribution Reminders:**
   - "Time to contribute RM 200 to Emergency Fund"
   - "Your auto-contribution of RM 100 was successful"

---

## 📊 CHARTS & VISUALIZATIONS

### Budget Charts:

**1. Budget Overview Donut:**
- Center: Total budget and spent
- Segments: Categories (colored)
- Interactive: Click segment for details

**2. Budget vs Actual Bar Chart:**
- Grouped bars: Budget (light) vs Spent (dark)
- All categories side-by-side
- Color-coded by status

**3. Spending Trend Line:**
- Daily/Weekly spending
- Budget threshold line
- Multiple categories (toggle)
- Zoom and pan

**4. Budget Health Gauge:**
- Semi-circle gauge
- Needle pointing to score
- Color zones (green, yellow, red)

### Goal Charts:

**1. Progress Rings:**
- Circular progress for each goal
- Gradient fill
- Animated
- Percentage in center

**2. Timeline Visualization:**
- Horizontal bars
- Start → Current → Milestones → Target
- Color gradient showing progress

**3. Contribution History:**
- Bar chart: Monthly contributions
- Line chart: Cumulative progress
- Multiple goals comparison

**4. Goal Comparison:**
- Stacked bar: All goals
- Progress by goal
- Priority-sorted

---

## 🗄️ DATA STRUCTURE

### Database Schema

**budgets table:**
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  category_id UUID REFERENCES categories(id),
  name TEXT,
  
  -- Budget Details
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Settings
  rollover_enabled BOOLEAN DEFAULT FALSE,
  rollover_amount DECIMAL(15, 2) DEFAULT 0,
  
  -- Alerts
  alert_thresholds INTEGER[] DEFAULT ARRAY[75, 90, 100],
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budgets_user_category ON budgets(user_id, category_id);
CREATE INDEX idx_budgets_period ON budgets(period, start_date);
```

**budget_periods table:**
```sql
CREATE TABLE budget_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  budget_amount DECIMAL(15, 2),
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  remaining_amount DECIMAL(15, 2),
  
  status TEXT CHECK (status IN ('on_track', 'warning', 'critical', 'exceeded')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**goals table:**
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  goal_type TEXT CHECK (goal_type IN ('savings', 'debt_payoff', 'investment', 'custom')),
  
  -- Financial Details
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
currency TEXT DEFAULT 'MYR',
-- Timeline
target_date DATE NOT NULL,
-- Visual
emoji TEXT,
color TEXT DEFAULT '#0066FF',
icon TEXT,
-- Settings
priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
linked_account_id UUID REFERENCES accounts(id),
-- Auto-Contribute
auto_contribute_enabled BOOLEAN DEFAULT FALSE,
auto_contribute_amount DECIMAL(10, 2),
auto_contribute_frequency TEXT CHECK (auto_contribute_frequency IN ('weekly', 'monthly')),
auto_contribute_day INTEGER,
-- Status
status TEXT CHECK (status IN ('active', 'completed', 'paused', 'archived')) DEFAULT 'active',
completed_at TIMESTAMPTZ,
-- Metadata
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_goals_target_date ON goals(target_date);

**goal_milestones table:**
```sql
CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  target_percentage INTEGER,
  
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  celebration_note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**goal_contributions table:**
```sql
CREATE TABLE goal_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  
  amount DECIMAL(10, 2) NOT NULL,
  contribution_date DATE DEFAULT CURRENT_DATE,
  
  source_account_id UUID REFERENCES accounts(id),
  transaction_id UUID REFERENCES transactions(id),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**budget_recommendations table:**
```sql
CREATE TABLE budget_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  category_id UUID REFERENCES categories(id),
  suggested_amount DECIMAL(10, 2),
  reasoning TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  tips JSONB,
  
  is_accepted BOOLEAN DEFAULT FALSE,
  
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 UI/UX SPECIFICATIONS

### Budget Cards

**Web:**
- Card height: auto (min 200px)
- Glass effect with category color tint
- Progress bar: 8px height, rounded, gradient
- Hover: lift 4px, increase glow
- Alert state: pulsing border animation

**Mobile:**
- Card height: 120px
- Swipeable (threshold: 80px)
- Progress bar: 6px
- Tap for details
- Long-press for quick actions

### Goal Cards

**Web:**
- Card width: 400px
- Progress ring: 150px diameter, 12px stroke
- Emoji: 64px
- Hover: scale 1.02, glow
- Completion: confetti animation

**Mobile:**
- Card height: 180px
- Progress ring: 100px diameter, 10px stroke
- Emoji: 48px
- Tap for details
- Swipe for contribute

### Colors by Status
```javascript
const budgetStatusColors = {
  on_track: '#10B981',      // Green
  warning: '#F59E0B',        // Yellow/Amber
  critical: '#FF6B00',       // Orange
  exceeded: '#EF4444'        // Red
}

const goalPriorityColors = {
  low: '#6B7280',           // Gray
  medium: '#F59E0B',         // Amber
  high: '#EF4444'            // Red
}
```

### Animations

**Web:**
- Budget cards: Stagger in (100ms delay)
- Progress bars: Fill animation (1s ease-out)
- Gauge: Rotate needle (1s ease-in-out)
- Goal completion: Confetti explosion
- Milestone reached: Scale pulse + glow

**Mobile:**
- List items: Fade in on scroll
- Progress rings: Stroke animation (1.5s)
- Swipe reveal: Spring animation
- Contribution success: Check mark animation
- Haptic feedback on milestones

---

## 📦 DELIVERABLES

### Web:
1. ✅ Budgets list page with overview
2. ✅ Create budget wizard
3. ✅ Budget detail page with charts
4. ✅ Budget templates
5. ✅ Goals list page
6. ✅ Create goal wizard
7. ✅ Goal detail page with timeline
8. ✅ Contribute to goal modal
9. ✅ Budget vs actual comparisons
10. ✅ AI recommendations dashboard

### Mobile:
11. ✅ Budgets screen with list
12. ✅ Create budget screen
13. ✅ Budget detail screen
14. ✅ Goals screen with list
15. ✅ Create goal screen
16. ✅ Goal detail screen
17. ✅ Contribute bottom sheet
18. ✅ Budget templates sheet
19. ✅ Progress tracking widgets
20. ✅ Milestone celebrations

### Backend:
21. ✅ Database schema and migrations
22. ✅ RLS policies
23. ✅ Edge function: generate-budget-recommendations
24. ✅ Edge function: calculate-budget-health
25. ✅ Edge function: analyze-goal-feasibility
26. ✅ Edge function: analyze-spending-patterns
27. ✅ Cron jobs for notifications
28. ✅ Budget period calculations
29. ✅ Goal contribution tracking

---

Create all components following global design rules with multi-currency support (default MYR), AI-powered insights using Grok API, and celebratory animations for achievements.