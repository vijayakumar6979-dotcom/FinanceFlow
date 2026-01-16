Following the global rules, redesign the Dashboard with a cutting-edge, futuristic interface that showcases all features (Accounts, Transactions, Bills, Loans, Budgets, Goals, Investments, Analytics) with stunning visuals, 3D elements, advanced animations, and AI-powered insights for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Create an ultra-modern, futuristic dashboard that:
- Showcases all financial data at a glance
- Uses 3D cards with depth and perspective
- Implements advanced glassmorphism and neumorphism
- Features ambient animations and particle effects
- AI-powered smart widgets that adapt to user behavior
- Real-time data updates with smooth transitions
- Holographic-style data visualization
- Gesture-controlled interactions (mobile)
- Voice command support (future-ready)
- Responsive layout that transforms beautifully across devices
- Dark theme with neon accents (primary)
- Light theme with clean, minimalist aesthetics

---

## 🌌 DESIGN PHILOSOPHY - FUTURISTIC AESTHETICS

### Visual Design Language

**"Neo-Fintech" Style:**
- Inspired by: Cyberpunk interfaces, Sci-fi HUDs, Premium fintech apps
- Primary aesthetic: Dark with electric blue/purple/cyan accents
- Secondary aesthetic: Pristine white with subtle color pops
- Depth: Multi-layered 3D cards with parallax
- Effects: Holographic glows, particle systems, ambient animations
- Typography: Sharp, modern, bold headings with thin body text
- Motion: Smooth, purposeful animations (no random movements)

### Core Visual Elements

**1. Glassmorphism 2.0 (Enhanced):**
```css
/* Advanced glass effect with multi-layer depth */
.glass-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

**2. Holographic Glow:**
```css
.holo-glow {
  position: relative;
  overflow: hidden;
}

.holo-glow::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(0, 102, 255, 0.3),
    transparent 60deg
  );
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}
```

**3. Neon Borders:**
```css
.neon-border {
  border: 2px solid transparent;
  background: 
    linear-gradient(#0A0E27, #0A0E27) padding-box,
    linear-gradient(90deg, #0066FF, #8B5CF6, #EC4899) border-box;
  box-shadow: 
    0 0 20px rgba(0, 102, 255, 0.3),
    inset 0 0 20px rgba(0, 102, 255, 0.1);
}
```

**4. Particle Background:**
```css
/* Animated particle system in background */
.particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Individual particles float and glow */
.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: radial-gradient(circle, #0066FF, transparent);
  animation: float 20s infinite;
}
```

**5. 3D Card Transforms:**
```css
.card-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card-3d:hover {
  transform: translateY(-8px) rotateX(2deg) rotateY(-2deg);
}

.card-3d-inner {
  transform: translateZ(20px);
}
```

---

## 🌐 WEB DASHBOARD - FUTURISTIC REDESIGN

### Layout Structure (Desktop)
┌────────────────────────────────────────────────────────────────┐
│  NAVBAR (Transparent glass, fixed)                             │
│  Logo | Search | Notifications | Profile                       │
├──────┬─────────────────────────────────────────────────────────┤
│      │                                                          │
│  S   │  MAIN CONTENT AREA                                      │
│  I   │                                                          │
│  D   │  ┌─────────────────────────────────────────────┐       │
│  E   │  │ HERO SECTION - Financial Overview          │       │
│  B   │  │ (3D card with holographic glow)             │       │
│  A   │  └─────────────────────────────────────────────┘       │
│  R   │                                                          │
│      │  ┌──────────────┐  ┌──────────────┐  ┌─────────┐      │
│      │  │ Quick Stats  │  │ Quick Stats  │  │ More... │      │
│  80  │  │ (Glass cards │  │ (Animated)   │  │         │      │
│  px  │  └──────────────┘  └──────────────┘  └─────────┘      │
│      │                                                          │
│      │  ┌────────────────────────────────────────────┐        │
│      │  │ WIDGETS GRID (Masonry layout)              │        │
│      │  │ ├─ Accounts ├─ Transactions ├─ Bills ─┤   │        │
│      │  │ ├─ Budgets  ├─ Goals        ├─ Loans ─┤   │        │
│      │  │ ├─ Investments ├─ Analytics ├─ AI ────┤   │        │
│      │  └────────────────────────────────────────────┘        │
│      │                                                          │
└──────┴─────────────────────────────────────────────────────────┘
### Sidebar (Collapsible, 80px collapsed / 280px expanded)

**Enhanced Sidebar Design:**
```typescript
// Sidebar component with futuristic styling

const SidebarNav = () => {
  const [collapsed, setCollapsed] = useState(false)
  
  const navItems = [
    { id: 'dashboard', icon: 'LayoutDashboard', label: 'Dashboard', path: '/' },
    { id: 'accounts', icon: 'Wallet', label: 'Accounts', path: '/accounts', badge: 3 },
    { id: 'transactions', icon: 'ArrowLeftRight', label: 'Transactions', path: '/transactions' },
    { id: 'bills', icon: 'Receipt', label: 'Bills', path: '/bills', badge: 2, badgeColor: 'warning' },
    { id: 'loans', icon: 'TrendingDown', label: 'Loans', path: '/loans' },
    { id: 'budgets', icon: 'Target', label: 'Budgets', path: '/budgets' },
    { id: 'goals', icon: 'Flag', label: 'Goals', path: '/goals' },
    { id: 'investments', icon: 'TrendingUp', label: 'Investments', path: '/investments' },
    { id: 'analytics', icon: 'BarChart3', label: 'Analytics', path: '/analytics' },
  ]
  
  return (
    <aside className={`
      fixed left-0 top-0 h-screen
      ${collapsed ? 'w-20' : 'w-72'}
      bg-dark-surface/80 backdrop-blur-2xl
      border-r border-white/10
      transition-all duration-500 ease-out
      z-40
    `}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        {collapsed ? (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
              <span className="text-white font-bold text-xl">F</span>
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-xl animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">FinanceFlow</h1>
              <p className="text-xs text-gray-400">AI Powered</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Items */}
      <nav className="mt-6 px-3">
        {navItems.map((item, index) => {
          const Icon = item.icon
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 mb-2
                rounded-xl transition-all duration-300
                group relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Active indicator - neon left border */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full">
                  <div className="w-full h-full bg-blue-500 blur-md"></div>
                </div>
              )}
              
              {/* Icon with glow on active */}
              <div className={`
                relative flex items-center justify-center w-6 h-6
                ${isActive ? 'text-blue-400' : ''}
              `}>
                <Icon size={24} />
                {isActive && (
                  <div className="absolute inset-0 bg-blue-500/30 blur-lg animate-pulse"></div>
                )}
              </div>
              
              {/* Label */}
              {!collapsed && (
                <span className="flex-1 font-medium">{item.label}</span>
              )}
              
              {/* Badge */}
              {!collapsed && item.badge && (
                <div className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${item.badgeColor === 'warning' 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }
                  animate-pulse
                `}>
                  {item.badge}
                </div>
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </NavLink>
          )
        })}
      </nav>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-dark-elevated border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
      >
        <ChevronLeft className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} size={20} />
      </button>
    </aside>
  )
}
```

---

### Hero Section - Financial Overview (3D Holographic Card)

**Design:**
- Full-width card with 3D depth
- Holographic border animation
- Particle background effect
- Real-time data updates with smooth transitions
```typescript
const FinancialOverviewHero = () => {
  const { totalBalance, monthlyIncome, monthlyExpenses, netWorth } = useFinancialData()
  
  return (
    <div className="relative mb-8 group">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <ParticleBackground count={50} />
      </div>
      
      {/* Main card with 3D transform */}
      <div className="
        relative p-8 rounded-3xl
        bg-gradient-to-br from-dark-elevated/90 to-dark-surface/90
        backdrop-blur-2xl
        border border-white/10
        transform-gpu
        transition-transform duration-700 ease-out
        hover:scale-[1.01]
        hover:shadow-2xl hover:shadow-blue-500/20
      "
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}>
        {/* Holographic rotating border */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-conic from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-xl animate-spin-slow"></div>
        </div>
        
        {/* Content with depth */}
        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Financial Overview
              </h2>
              <p className="text-gray-400">Real-time snapshot of your wealth</p>
            </div>
            
            {/* AI Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              <span className="text-blue-400 text-sm font-semibold">AI Powered</span>
            </div>
          </div>
          
          {/* Stats Grid with glassmorphism cards */}
          <div className="grid grid-cols-4 gap-6">
            {/* Total Balance */}
            <StatCard
              label="Total Balance"
              value={totalBalance}
              change="+12.5%"
              trend="up"
              icon={<Wallet size={32} />}
              gradient="from-blue-500 to-cyan-500"
            />
            
            {/* Monthly Income */}
            <StatCard
              label="Monthly Income"
              value={monthlyIncome}
              change="+8.2%"
              trend="up"
              icon={<TrendingUp size={32} />}
              gradient="from-green-500 to-emerald-500"
            />
            
            {/* Monthly Expenses */}
            <StatCard
              label="Monthly Expenses"
              value={monthlyExpenses}
              change="-5.4%"
              trend="down"
              icon={<TrendingDown size={32} />}
              gradient="from-red-500 to-pink-500"
            />
            
            {/* Net Worth */}
            <StatCard
              label="Net Worth"
              value={netWorth}
              change="+15.3%"
              trend="up"
              icon={<BarChart3 size={32} />}
              gradient="from-purple-500 to-fuchsia-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Individual stat card with 3D effect
const StatCard = ({ label, value, change, trend, icon, gradient }) => {
  return (
    <div className="
      relative p-6 rounded-2xl
      bg-white/5 backdrop-blur-xl
      border border-white/10
      transform-gpu transition-all duration-500
      hover:scale-105 hover:bg-white/10
      cursor-pointer group
    "
    style={{
      transformStyle: 'preserve-3d'
    }}>
      {/* Gradient glow on hover */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${gradient}
        blur-2xl transition-opacity duration-500
        -z-10
      `}></div>
      
      {/* Icon with gradient */}
      <div className={`
        w-16 h-16 rounded-2xl mb-4
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        shadow-lg
      `}
      style={{ transform: 'translateZ(10px)' }}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      
      {/* Label */}
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      
      {/* Value with counting animation */}
      <h3 className="text-3xl font-bold text-white mb-2 font-mono">
        <CountUp end={value} duration={2} prefix="RM " separator="," />
      </h3>
      
      {/* Trend */}
      <div className={`
        flex items-center gap-1
        ${trend === 'up' ? 'text-green-400' : 'text-red-400'}
      `}>
        {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="text-sm font-semibold">{change}</span>
        <span className="text-gray-500 text-xs ml-1">vs last month</span>
      </div>
    </div>
  )
}
```

---

### Quick Action Cards (Floating)

**Design:**
- 4-5 floating action cards
- Glassmorphism with depth
- Hover effects with 3D rotation
- Icon animations
```typescript
const QuickActions = () => {
  const actions = [
    {
      id: 'add-transaction',
      label: 'Add Transaction',
      icon: <Plus size={24} />,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/transactions/new')
    },
    {
      id: 'pay-bill',
      label: 'Pay Bill',
      icon: <Receipt size={24} />,
      gradient: 'from-orange-500 to-yellow-500',
      badge: 2,
      onClick: () => navigate('/bills')
    },
    {
      id: 'check-budget',
      label: 'Check Budget',
      icon: <Target size={24} />,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/budgets')
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      icon: <BarChart2 size={24} />,
      gradient: 'from-green-500 to-teal-500',
      onClick: () => navigate('/analytics')
    }
  ]
  
  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
      {actions.map((action, index) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="
            relative group
            min-w-[200px] p-4 rounded-2xl
            bg-white/5 backdrop-blur-xl
            border border-white/10
            hover:bg-white/10
            transform-gpu transition-all duration-500
            hover:scale-105 hover:-translate-y-1
            cursor-pointer
          "
          style={{
            animationDelay: `${index * 100}ms`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Gradient glow */}
          <div className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-br ${action.gradient}
            opacity-0 group-hover:opacity-20
            blur-xl transition-opacity duration-500
            -z-10
          `}></div>
          
          {/* Content */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`
              w-12 h-12 rounded-xl
              bg-gradient-to-br ${action.gradient}
              flex items-center justify-center
              shadow-lg
              group-hover:scale-110 transition-transform
            `}>
              <div className="text-white">
                {action.icon}
              </div>
            </div>
            
            {/* Label */}
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">{action.label}</p>
              {action.badge && (
                <span className="text-xs text-orange-400">{action.badge} pending</span>
              )}
            </div>
            
            {/* Arrow */}
            <ChevronRight size={20} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      ))}
    </div>
  )
}
```

---

### Widget Grid (Masonry Layout with 3D Cards)

**Design:**
- Masonry grid layout (responsive columns)
- Each widget is a 3D card with depth
- Hover effects with tilt and glow
- Real-time data updates
- Expandable widgets
```typescript
const DashboardWidgets = () => {
  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1536: 3,
        1280: 2,
        1024: 2,
        768: 1
      }}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {/* Accounts Widget */}
      <AccountsWidget />
      
      {/* Recent Transactions */}
      <TransactionsWidget />
      
      {/* Bills Due */}
      <BillsDueWidget />
      
      {/* Budget Progress */}
      <BudgetProgressWidget />
      
      {/* Goals Progress */}
      <GoalsWidget />
      
      {/* Loan Payoff */}
      <LoansWidget />
      
      {/* Investment Portfolio */}
      <InvestmentsWidget />
      
      {/* AI Insights */}
      <AIInsightsWidget />
      
      {/* Spending Breakdown */}
      <SpendingBreakdownWidget />
      
      {/* Cash Flow */}
      <CashFlowWidget />
    </Masonry>
  )
}
```

**Individual Widget Example - Accounts Widget:**
```typescript
const AccountsWidget = () => {
  const { accounts, totalBalance } = useAccounts()
  const [expanded, setExpanded] = useState(false)
  
  return (
    <Widget3D
      title="Accounts"
      icon={<Wallet size={20} />}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      gradient="from-blue-500/20 to-purple-500/20"
    >
      {/* Total Balance */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Total Balance</p>
        <h3 className="text-4xl font-bold text-white font-mono">
          <CountUp end={totalBalance} duration={2} prefix="RM " separator="," />
        </h3>
      </div>
      
      {/* Account List */}
      <div className="space-y-3">
        {accounts.slice(0, expanded ? accounts.length : 3).map((account) => (
          <div
            key={account.id}
            className="
              flex items-center gap-3 p-3 rounded-xl
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:border-white/20
              transition-all duration-300
              cursor-pointer
            "
          >
            {/* Bank Logo */}
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <img src={account.logo} alt={account.name} className="w-6 h-6" />
            </div>
            
            {/* Account Info */}
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{account.name}</p>
              <p className="text-gray-400 text-xs">{account.type}</p>
            </div>
            
            {/* Balance */}
            <div className="text-right">
              <p className="text-white font-semibold">
                RM {account.balance.toLocaleString()}
              </p>
              <p className={`text-xs ${account.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {account.change > 0 ? '+' : ''}{account.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All */}
      {!expanded && accounts.length > 3 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          View {accounts.length - 3} more accounts
        </button>
      )}
    </Widget3D>
  )
}
```

**Base Widget3D Component:**
```typescript
const Widget3D = ({ title, icon, children, expanded, onToggle, gradient }) => {
  const cardRef = useRef(null)
  
  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
    `
  }
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  }
  
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="
        relative p-6 rounded-3xl
        bg-gradient-to-br from-dark-elevated/90 to-dark-surface/90
        backdrop-blur-2xl
        border border-white/10
        transform-gpu transition-all duration-500
        hover:shadow-2xl
        mb-6
      "
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* Gradient overlay */}
      <div className={`
        absolute inset-0 rounded-3xl
        bg-gradient-to-br ${gradient}
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        pointer-events-none
      `}></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="text-blue-400">{icon}</div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  )
}
```

## 📱 MOBILE DASHBOARD - FUTURISTIC REDESIGN

/* Mobile breakpoints */
- Small: 320px - 374px (iPhone SE, older devices)
- Medium: 375px - 413px (iPhone 12/13/14, standard Android)
- Large: 414px - 428px (iPhone Pro Max, large Android)
- Tablet: 768px+ (iPad, Android tablets)

/* Minimum touch targets */
- Primary buttons: 48px × 48px minimum
- Secondary buttons: 44px × 44px minimum
- List items: 56px height minimum
- Bottom nav items: 64px height
- Floating action button: 56px × 56px
```

### Mobile Layout Structure
```
┌─────────────────────────────────────┐
│  STATUS BAR (System)                │
├─────────────────────────────────────┤
│  HEADER BAR (Fixed, 60px)           │
│  Logo | Notifications | Profile     │
├─────────────────────────────────────┤
│                                     │
│  SCROLLABLE CONTENT AREA            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Financial Overview Card       │ │
│  │ (Swipeable, 3D glass effect)  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│  │Quick│ │Quick│ │Quick│ │More │ │
│  │Act 1│ │Act 2│ │Act 3│ │ ... │ │
│  └─────┘ └─────┘ └─────┘ └─────┘ │
│  (Horizontal scroll)               │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Widget Card 1 - Accounts      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Widget Card 2 - Transactions  │ │
│  └───────────────────────────────┘ │
│                                     │
│  [More widgets stacked vertically] │
│                                     │
├─────────────────────────────────────┤
│  BOTTOM NAVIGATION (Fixed, 64px)   │
│  [Home][Accounts][Add][Goals][More]│
└─────────────────────────────────────┘

🎨 MOBILE UI COMPONENTS
1. Header Bar (Fixed Top)
typescriptconst MobileHeader = () => {
  const { unreadNotifications } = useNotifications()
  
  return (
    <header className="
      fixed top-0 left-0 right-0 z-50
      h-16 px-4
      bg-dark-surface/80 backdrop-blur-2xl
      border-b border-white/10
      flex items-center justify-between
    ">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="
          w-10 h-10 rounded-xl
          bg-gradient-to-br from-blue-500 to-purple-600
          flex items-center justify-center
          relative
        ">
          <span className="text-white font-bold text-xl">F</span>
          <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-lg animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-white font-bold text-base">FinanceFlow</h1>
          <p className="text-xs text-gray-400">Mobile</p>
        </div>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 active:scale-95 transition-all">
          <Bell size={22} className="text-gray-400" />
          {unreadNotifications > 0 && (
            <div className="
              absolute -top-1 -right-1
              w-5 h-5 rounded-full
              bg-red-500 border-2 border-dark-surface
              flex items-center justify-center
              text-white text-xs font-bold
              animate-pulse
            ">
              {unreadNotifications}
            </div>
          )}
        </button>
        
        {/* Profile */}
        <button className="
          w-9 h-9 rounded-full
          bg-gradient-to-br from-blue-500 to-purple-600
          flex items-center justify-center
          active:scale-95 transition-transform
        ">
          <User size={20} className="text-white" />
        </button>
      </div>
    </header>
  )
}

2. Financial Overview Card (Hero, Swipeable)
typescriptconst MobileFinancialOverview = () => {
  const { totalBalance, monthlyIncome, monthlyExpenses, netWorth } = useFinancialData()
  const [activeCard, setActiveCard] = useState(0)
  
  const cards = [
    {
      label: 'Total Balance',
      value: totalBalance,
      change: '+12.5%',
      trend: 'up',
      icon: <Wallet size={24} />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Monthly Income',
      value: monthlyIncome,
      change: '+8.2%',
      trend: 'up',
      icon: <TrendingUp size={24} />,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Monthly Expenses',
      value: monthlyExpenses,
      change: '-5.4%',
      trend: 'down',
      icon: <TrendingDown size={24} />,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      label: 'Net Worth',
      value: netWorth,
      change: '+15.3%',
      trend: 'up',
      icon: <BarChart3 size={24} />,
      gradient: 'from-purple-500 to-fuchsia-500'
    }
  ]
  
  return (
    <div className="px-4 pt-20 pb-4">
      {/* Swipeable Cards Container */}
      <div className="relative">
        {/* Cards */}
        <Swiper
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          onSlideChange={(swiper) => setActiveCard(swiper.activeIndex)}
          className="!pb-10"
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <FinancialCard {...card} isActive={activeCard === index} />
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCard(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${activeCard === index 
                  ? 'w-6 bg-blue-500' 
                  : 'w-2 bg-gray-600'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const FinancialCard = ({ label, value, change, trend, icon, gradient, isActive }) => {
  return (
    <div className={`
      relative p-6 rounded-3xl
      bg-gradient-to-br from-dark-elevated/90 to-dark-surface/90
      backdrop-blur-2xl
      border border-white/10
      transform transition-all duration-500
      ${isActive ? 'scale-100' : 'scale-95 opacity-70'}
    `}>
      {/* Gradient glow */}
      <div className={`
        absolute inset-0 rounded-3xl
        bg-gradient-to-br ${gradient}
        opacity-20 blur-2xl
        transition-opacity duration-500
      `}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`
          w-14 h-14 rounded-2xl mb-4
          bg-gradient-to-br ${gradient}
          flex items-center justify-center
          shadow-lg
        `}>
          <div className="text-white">{icon}</div>
        </div>
        
        {/* Label */}
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        
        {/* Value */}
        <h2 className="text-4xl font-bold text-white mb-2 font-mono">
          <CountUp end={value} duration={2} prefix="RM " separator="," />
        </h2>
        
        {/* Trend */}
        <div className={`
          inline-flex items-center gap-1 px-3 py-1 rounded-full
          ${trend === 'up' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
          }
        `}>
          {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span className="text-sm font-semibold">{change}</span>
          <span className="text-xs opacity-70">vs last month</span>
        </div>
      </div>
    </div>
  )
}

3. Quick Actions (Horizontal Scroll)
typescriptconst MobileQuickActions = () => {
  const actions = [
    {
      id: 'add-transaction',
      label: 'Add Transaction',
      icon: <Plus size={24} />,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/transactions/new')
    },
    {
      id: 'pay-bill',
      label: 'Pay Bill',
      icon: <Receipt size={24} />,
      gradient: 'from-orange-500 to-yellow-500',
      badge: 2,
      onClick: () => navigate('/bills')
    },
    {
      id: 'check-budget',
      label: 'Budget',
      icon: <Target size={24} />,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/budgets')
    },
    {
      id: 'scan',
      label: 'Scan Receipt',
      icon: <Camera size={24} />,
      gradient: 'from-teal-500 to-green-500',
      onClick: () => openCamera()
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 size={24} />,
      gradient: 'from-indigo-500 to-blue-500',
      onClick: () => navigate('/analytics')
    }
  ]
  
  return (
    <div className="px-4 pb-4">
      <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="
              relative flex-shrink-0
              w-28 p-4 rounded-2xl
              bg-white/5 backdrop-blur-xl
              border border-white/10
              active:scale-95 active:bg-white/10
              transition-all duration-200
            "
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            {/* Gradient background */}
            <div className={`
              absolute inset-0 rounded-2xl
              bg-gradient-to-br ${action.gradient}
              opacity-10
            `}></div>
            
            {/* Icon */}
            <div className={`
              relative w-12 h-12 mx-auto mb-2 rounded-xl
              bg-gradient-to-br ${action.gradient}
              flex items-center justify-center
              shadow-lg
            `}>
              <div className="text-white">{action.icon}</div>
              
              {/* Badge */}
              {action.badge && (
                <div className="
                  absolute -top-1 -right-1
                  w-5 h-5 rounded-full
                  bg-red-500 border-2 border-dark-surface
                  flex items-center justify-center
                  text-white text-xs font-bold
                ">
                  {action.badge}
                </div>
              )}
            </div>
            
            {/* Label */}
            <p className="text-white text-xs font-medium text-center leading-tight">
              {action.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

4. Widget Cards (Stacked Vertically)
typescriptconst MobileWidgetStack = () => {
  return (
    <div className="px-4 space-y-4 pb-24">
      {/* Accounts Widget */}
      <MobileAccountsWidget />
      
      {/* Recent Transactions */}
      <MobileTransactionsWidget />
      
      {/* Bills Due */}
      <MobileBillsWidget />
      
      {/* Budget Progress */}
      <MobileBudgetWidget />
      
      {/* Goals */}
      <MobileGoalsWidget />
      
      {/* Loans */}
      <MobileLoansWidget />
      
      {/* Investments */}
      <MobileInvestmentsWidget />
      
      {/* AI Insights */}
      <MobileAIInsightsWidget />
    </div>
  )
}

// Example: Mobile Accounts Widget
const MobileAccountsWidget = () => {
  const { accounts, totalBalance } = useAccounts()
  const [expanded, setExpanded] = useState(false)
  
  return (
    <MobileWidgetCard
      title="Accounts"
      icon={<Wallet size={20} />}
      action={
        <button
          onClick={() => navigate('/accounts')}
          className="text-blue-400 text-sm font-semibold active:scale-95 transition-transform"
        >
          View All
        </button>
      }
    >
      {/* Total Balance */}
      <div className="mb-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-gray-400 text-xs mb-1">Total Balance</p>
        <h3 className="text-3xl font-bold text-white font-mono">
          <CountUp end={totalBalance} duration={2} prefix="RM " separator="," />
        </h3>
      </div>
      
      {/* Account List */}
      <div className="space-y-2">
        {accounts.slice(0, expanded ? accounts.length : 3).map((account) => (
          <button
            key={account.id}
            onClick={() => navigate(`/accounts/${account.id}`)}
            className="
              w-full flex items-center gap-3 p-3 rounded-xl
              bg-white/5 border border-white/10
              active:bg-white/10 active:scale-98
              transition-all duration-200
            "
          >
            {/* Bank Logo */}
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <img src={account.logo} alt={account.name} className="w-6 h-6" />
            </div>
            
            {/* Account Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-medium text-sm truncate">{account.name}</p>
              <p className="text-gray-400 text-xs">{account.type}</p>
            </div>
            
            {/* Balance */}
            <div className="text-right flex-shrink-0">
              <p className="text-white font-semibold text-sm">
                RM {account.balance.toLocaleString()}
              </p>
              <p className={`text-xs ${account.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {account.change > 0 ? '+' : ''}{account.change}%
              </p>
            </div>
            
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
      
      {/* Expand/Collapse */}
      {accounts.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="
            w-full mt-3 py-2 rounded-lg
            bg-white/5 active:bg-white/10
            text-gray-400 text-sm font-medium
            active:scale-98 transition-all
          "
        >
          {expanded ? 'Show Less' : `Show ${accounts.length - 3} More`}
        </button>
      )}
    </MobileWidgetCard>
  )
}

// Base Mobile Widget Card
const MobileWidgetCard = ({ title, icon, action, children }) => {
  return (
    <div className="
      relative p-4 rounded-3xl
      bg-gradient-to-br from-dark-elevated/90 to-dark-surface/90
      backdrop-blur-2xl
      border border-white/10
    ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-blue-400">{icon}</div>
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
        {action}
      </div>
      
      {/* Content */}
      {children}
    </div>
  )
}

5. Bottom Navigation (Fixed)
typescriptconst MobileBottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={24} />,
      path: '/'
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: <Wallet size={24} />,
      path: '/accounts'
    },
    {
      id: 'add',
      label: 'Add',
      icon: <Plus size={28} />,
      path: '/add',
      isSpecial: true
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Flag size={24} />,
      path: '/goals'
    },
    {
      id: 'more',
      label: 'More',
      icon: <MoreHorizontal size={24} />,
      path: '/more'
    }
  ]
  
  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-50
      h-16 px-2
      bg-dark-surface/80 backdrop-blur-2xl
      border-t border-white/10
      flex items-center justify-around
      safe-area-inset-bottom
    ">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        
        if (item.isSpecial) {
          // Special FAB button in center
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="
                relative -mt-8
                w-14 h-14 rounded-full
                bg-gradient-to-br from-blue-500 to-purple-600
                flex items-center justify-center
                shadow-lg shadow-blue-500/50
                active:scale-95 transition-transform
              "
            >
              <div className="text-white">{item.icon}</div>
              <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-lg animate-pulse"></div>
            </button>
          )
        }
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`
              flex flex-col items-center justify-center
              min-w-[60px] py-2
              active:scale-95 transition-all
              ${isActive ? 'text-blue-400' : 'text-gray-400'}
            `}
          >
            <div className="relative">
              {item.icon}
              {isActive && (
                <div className="absolute inset-0 bg-blue-500/30 blur-lg animate-pulse"></div>
              )}
            </div>
            <span className="text-xs font-medium mt-1">{item.label}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="
                absolute bottom-0 left-1/2 -translate-x-1/2
                w-1 h-1 rounded-full
                bg-blue-400
              "></div>
            )}
          </button>
        )
      })}
    </nav>
  )
}

🎭 MOBILE-SPECIFIC ANIMATIONS
Pull-to-Refresh
typescriptconst usePullToRefresh = (onRefresh) => {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  
  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setIsPulling(true)
    }
  }
  
  const handleTouchMove = (e) => {
    if (isPulling) {
      const touch = e.touches[0]
      const distance = Math.min(touch.clientY - startY, 100)
      setPullDistance(distance)
    }
  }
  
  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      onRefresh()
    }
    setIsPulling(false)
    setPullDistance(0)
  }
  
  return { isPulling, pullDistance, handleTouchStart, handleTouchMove, handleTouchEnd }
}
Swipe Gestures
typescriptconst useSwipeGesture = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(null)
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return
    
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }
    
    setTouchStart(null)
  }
  
  return { handleTouchStart, handleTouchEnd }
}
Haptic Feedback
typescriptconst useHaptic = () => {
  const triggerHaptic = (type = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [20, 100, 20]
      }
      navigator.vibrate(patterns[type] || patterns.light)
    }
  }
  
  return { triggerHaptic }
}

🎨 MOBILE COLOR PALETTE
css:root {
  /* Dark Theme (Primary) */
  --dark-bg: #0A0E27;
  --dark-surface: #12162D;
  --dark-elevated: #1A1F3A;
  
  /* Accent Colors */
  --blue-500: #0066FF;
  --purple-500: #8B5CF6;
  --cyan-500: #06B6D4;
  --green-500: #10B981;
  --orange-500: #F59E0B;
  --red-500: #EF4444;
  --pink-500: #EC4899;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: 32px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-glow: 0 0 20px rgba(0, 102, 255, 0.3);
}

📐 MOBILE RESPONSIVE GUIDELINES
Typography Scale
css/* Mobile typography */
h1 { font-size: 32px; line-height: 1.2; } /* Hero headings */
h2 { font-size: 24px; line-height: 1.3; } /* Section headings */
h3 { font-size: 18px; line-height: 1.4; } /* Card titles */
h4 { font-size: 16px; line-height: 1.5; } /* Subsections */
body { font-size: 14px; line-height: 1.6; } /* Body text */
small { font-size: 12px; line-height: 1.5; } /* Captions */
Spacing System
css/* Mobile spacing (16px base) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;

🚀 MOBILE PERFORMANCE OPTIMIZATIONS

Lazy Loading: Load widgets on scroll
Image Optimization: Use WebP format, lazy load images
Virtualization: For long lists (transactions, etc.)
Code Splitting: Route-based code splitting
Service Worker: Offline support, cache API responses
Debouncing: For search and input fields
Memoization: React.memo for expensive components


✨ MOBILE-SPECIFIC FEATURES
1. Biometric Authentication
typescriptconst useBiometric = () => {
  const authenticate = async () => {
    if ('credentials' in navigator) {
      // Use WebAuthn for biometric
      return await navigator.credentials.get({
        publicKey: { /* config */ }
      })
    }
  }
  
  return { authenticate }
}
2. Camera Integration
typescriptconst useCamera = () => {
  const captureReceipt = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    // Handle camera stream
  }
  
  return { captureReceipt }
}
3. Share API
typescriptconst useShare = () => {
  const shareData = async (data) => {
    if (navigator.share) {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      })
    }
  }
  
  return { shareData }
}

🎯 IMPLEMENTATION CHECKLIST

 Bottom navigation with 5 primary sections
 Swipeable financial overview cards
 Horizontal scrolling quick actions
 Vertically stacked widget cards
 Pull-to-refresh functionality
 Swipe gestures for navigation
 Haptic feedback on interactions
 Touch-optimized button sizes (48px minimum)
 Safe area insets for notched devices
 Dark theme with neon accents
 Glassmorphism effects
 3D card transforms on touch
 Smooth page transitions
 Loading states and skeletons
 Error states with retry options
 Offline mode support
 Biometric authentication
 Camera integration for receipts
 Share functionality
 Accessibility (screen readers, contrast)