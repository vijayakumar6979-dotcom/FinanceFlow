Following the global rules, redesign the Dashboard with a cutting-edge, futuristic interface that showcases all features (Accounts, Transactions, Bills, Loans, Budgets, Goals, Investments, Analytics) with stunning visuals, 3D elements, advanced animations, and AI-powered insights for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Create an ultra-modern, futuristic dashboard that:
- Showcases all financial data at a glance
- Implements advanced glassmorphism and neumorphism
- Features ambient animations and particle effects
- AI-powered smart widgets that adapt to user behavior
- Real-time data updates with smooth transitions
- Responsive layout that transforms beautifully across devices
- Dark theme with neon accents (primary)
- Light theme with clean, minimalist aesthetics


Here is my propose Layout 

<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>FinanceFlow | Modular Control Center</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#7C3AED",
                        secondary: "#06B6D4",
                        "background-dark": "#030407",
                        "card-dark": "rgba(10, 12, 18, 0.8)",
                        "accent-green": "#10B981",
                        "accent-red": "#EF4444",
                    },
                    fontFamily: {
                        display: ["Plus Jakarta Sans", "sans-serif"],
                        sans: ["Plus Jakarta Sans", "sans-serif"],
                    },
                    borderRadius: {
                        DEFAULT: "12px",
                        'xl': '18px',
                        '2xl': '24px',
                        '3xl': '32px',
                    },
                },
            },
        };
    </script>
<style type="text/tailwindcss">
        :root {
            --glass-bg: rgba(255, 255, 255, 0.02);
            --glass-border: rgba(255, 255, 255, 0.08);
            --neon-purple: #7C3AED;
            --neon-blue: #06B6D4;
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #030407;
            background-image: radial-gradient(circle at 20% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 40%),
                              radial-gradient(circle at 80% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 40%);
        }
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(24px);
            border: 1px solid var(--glass-border);
            position: relative;
        }
        .glow-purple { box-shadow: 0 0 30px rgba(124, 58, 237, 0.1); }
        .minimalist-metallic-card {
            background: linear-gradient(135deg, #111111 0%, #222222 50%, #111111 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
        }
        .minimalist-metallic-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.05) 50%, transparent 52%);
            pointer-events: none;
        }
        .ai-pulse {
            animation: pulse-glow 3s infinite;
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 15px rgba(124, 58, 237, 0.2); border-color: rgba(124, 58, 237, 0.3); }
            50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.4); border-color: rgba(6, 182, 212, 0.5); }
        }
        .drag-handle {
            cursor: grab;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .glass-card:hover .drag-handle {
            opacity: 1;
        }
        .module-resize-handle {
            position: absolute;
            bottom: 4px;
            right: 4px;
            width: 12px;
            height: 12px;
            cursor: nwse-resize;
            border-right: 2px solid rgba(255,255,255,0.1);
            border-bottom: 2px solid rgba(255,255,255,0.1);
        }
        .chat-bubble-ai {
            background: rgba(124, 58, 237, 0.08);
            border: 1px solid rgba(124, 58, 237, 0.15);
            border-bottom-left-radius: 4px;
        }
        .chat-bubble-user {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom-right-radius: 4px;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    </style>
</head>
<body class="text-slate-200 min-h-screen">
<div class="flex min-h-screen relative">
<aside class="w-64 border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-50 bg-[#05070A]/90 backdrop-blur-2xl">
<div class="p-8 flex items-center space-x-3">
<div class="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">F</div>
<span class="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">FinanceFlow</span>
</div>
<nav class="flex-1 px-4 space-y-1 mt-4">
<p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-70">Insights</p>
<a class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 text-primary font-bold" href="#">
<span class="material-symbols-outlined text-xl">dashboard</span>
<span>Overview</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span class="material-symbols-outlined text-xl">account_balance_wallet</span>
<span>Assets</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span class="material-symbols-outlined text-xl">swap_horiz</span>
<span>Transactions</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span class="material-symbols-outlined text-xl">insights</span>
<span>Predictions</span>
</a>
<p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-8 mb-4 opacity-70">Management</p>
<a class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span class="material-symbols-outlined text-xl">settings_input_component</span>
<span>Customize UI</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all" href="#">
<span class="material-symbols-outlined text-xl">receipt_long</span>
<span>Reports</span>
</a>
</nav>
<div class="p-6 border-t border-white/5">
<div class="flex items-center p-3 rounded-2xl glass-card">
<img alt="Profile" class="w-9 h-9 rounded-full border border-primary/30 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQhF-PsO1-QWcHtPdPYlPklNoJq98ijt5EUGO25hTuJYsM5M9RPuVk1GTWgtzAn64IXIumY0uI5-O8vb-SIhr7hAWTtrOIQsutefmwjNaq2PdsDFbYpoEcFehpGejeU4vZjE52-O8-h2Vs9lEAMYssCAPivGwQTqoPaREjipg9jTxub5iAooAFrIabDp5BJCLWfg3sN5QZFJhvuJxa5qIvpoanO44D_dWigNPHk5Z6svUAO6Zv8FcnEsjGiNwVdlDU3bAxM4d4D0eK"/>
<div class="ml-3">
<p class="text-xs font-bold text-white">Gustavo Franci</p>
<p class="text-[9px] text-primary font-bold uppercase tracking-wider">Titanium Elite</p>
</div>
</div>
</div>
</aside>
<main class="ml-64 flex-1 p-10">
<header class="flex justify-between items-center mb-8">
<div>
<h1 class="text-2xl font-bold tracking-tight text-white">Control Center <span class="text-primary/60 text-sm ml-2 font-medium tracking-widest uppercase">Modular</span></h1>
<p class="text-slate-400 text-sm mt-0.5">Drag and resize modules to optimize your workspace</p>
</div>
<div class="flex items-center space-x-4">
<button class="flex items-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
<span class="material-symbols-outlined text-lg">add_box</span>
<span class="text-sm font-bold">Add Module</span>
</button>
<div class="w-10 h-10 flex items-center justify-center rounded-xl glass-card text-slate-400 hover:text-white transition-all cursor-pointer">
<span class="material-symbols-outlined">notifications</span>
</div>
</div>
</header>
<div class="grid grid-cols-12 gap-6 items-start">
<div class="col-span-3 glass-card p-5 rounded-2xl group">
<div class="drag-handle absolute top-2 right-2 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Portfolio Value</p>
<p class="text-2xl font-bold text-white">$142,502.20</p>
<div class="flex items-center text-accent-green text-[10px] mt-2 font-bold">
<span class="material-symbols-outlined text-sm mr-0.5">trending_up</span>
<span>+4.2% today</span>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-3 glass-card p-5 rounded-2xl group">
<div class="drag-handle absolute top-2 right-2 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Available Liquidity</p>
<p class="text-2xl font-bold text-white">$18,940.00</p>
<div class="flex items-center text-slate-500 text-[10px] mt-2 font-bold">
<span class="material-symbols-outlined text-sm mr-0.5">history</span>
<span>Updated just now</span>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-3 glass-card p-5 rounded-2xl group">
<div class="drag-handle absolute top-2 right-2 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Monthly Yield</p>
<p class="text-2xl font-bold text-white">$2,410.50</p>
<div class="flex items-center text-accent-green text-[10px] mt-2 font-bold">
<span class="material-symbols-outlined text-sm mr-0.5">add</span>
<span>$120 vs last month</span>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-3 glass-card p-5 rounded-2xl group">
<div class="drag-handle absolute top-2 right-2 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Risk Score</p>
<p class="text-2xl font-bold text-secondary">32/100</p>
<div class="flex items-center text-secondary text-[10px] mt-2 font-bold">
<span class="material-symbols-outlined text-sm mr-0.5">verified_user</span>
<span>Low Volatility Profile</span>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-8 glass-card p-8 rounded-3xl group">
<div class="drag-handle absolute top-4 right-4 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<div class="flex justify-between items-center mb-8">
<h3 class="font-bold text-lg">Card Management</h3>
<div class="flex space-x-2">
<button class="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white px-3 py-1 bg-white/5 rounded-lg">Default</button>
<button class="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white px-3 py-1">Virtual</button>
</div>
</div>
<div class="grid grid-cols-5 gap-8 items-center">
<div class="col-span-3">
<div class="minimalist-metallic-card w-full aspect-[1.58/1] rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
<div class="flex justify-between items-start">
<div class="space-y-1">
<p class="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Titanium Reserve</p>
<p class="text-sm font-bold text-white/80">Active Access Point</p>
</div>
<div class="text-right">
<p class="text-xl font-bold italic text-white/90">VISA</p>
<p class="text-[8px] font-bold text-white/40 tracking-[0.2em]">INFINITE</p>
</div>
</div>
<div class="flex justify-between items-end">
<div class="space-y-4">
<p class="text-xl font-medium tracking-[0.3em] text-white/90">
                                        4520 <span class="mx-0.5"></span> 8821 <span class="mx-0.5"></span> 0092 <span class="mx-0.5"></span> 7281
                                    </p>
<div class="flex space-x-8">
<div>
<p class="text-[8px] uppercase font-bold text-white/30 tracking-widest mb-1">Holder</p>
<p class="text-[10px] font-bold text-white/80 uppercase tracking-wide">G. FRANCI</p>
</div>
<div>
<p class="text-[8px] uppercase font-bold text-white/30 tracking-widest mb-1">Expiry</p>
<p class="text-[10px] font-bold text-white/80 tracking-widest">09/28</p>
</div>
</div>
</div>
<div class="w-10 h-7 rounded bg-white/10 border border-white/5"></div>
</div>
</div>
</div>
<div class="col-span-2 space-y-4">
<div class="p-4 rounded-xl bg-white/5 border border-white/5">
<p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Daily Limit</p>
<div class="flex justify-between items-end">
<p class="text-lg font-bold text-white">$5,000</p>
<p class="text-[10px] text-accent-green font-bold">82% REMAINING</p>
</div>
</div>
<div class="p-4 rounded-xl bg-white/5 border border-white/5">
<p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
<div class="flex items-center space-x-2">
<span class="w-2 h-2 rounded-full bg-accent-green"></span>
<p class="text-sm font-bold text-white">Universal Ready</p>
</div>
</div>
<button class="w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all">
                            Freeze Card
                        </button>
</div>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-4 glass-card p-8 rounded-3xl group h-full">
<div class="drag-handle absolute top-4 right-4 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<div class="flex justify-between items-center mb-6">
<h3 class="font-bold text-lg">Spending Limit</h3>
<button class="text-slate-500 hover:text-white"><span class="material-symbols-outlined text-xl">settings</span></button>
</div>
<div class="relative flex flex-col justify-center items-center py-4">
<svg class="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="44" stroke="rgba(255,255,255,0.05)" stroke-width="8"></circle>
<circle cx="50" cy="50" fill="none" r="44" stroke="url(#budget-grad)" stroke-dasharray="276" stroke-dashoffset="82.8" stroke-linecap="round" stroke-width="8"></circle>
<defs>
<linearGradient id="budget-grad" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" stop-color="var(--neon-purple)"></stop>
<stop offset="100%" stop-color="var(--neon-blue)"></stop>
</linearGradient>
</defs>
</svg>
<div class="absolute text-center">
<p class="text-3xl font-black text-white">70%</p>
<p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">of $8,000</p>
</div>
</div>
<div class="space-y-4 mt-6">
<div class="space-y-2">
<div class="flex justify-between text-[11px] font-bold">
<span class="text-slate-400 uppercase tracking-widest">Housing &amp; Bills</span>
<span class="text-white">$2,400 / $2,500</span>
</div>
<div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-accent-red rounded-full" style="width: 96%"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-[11px] font-bold">
<span class="text-slate-400 uppercase tracking-widest">Lifestyle</span>
<span class="text-white">$1,120 / $2,000</span>
</div>
<div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 56%"></div>
</div>
</div>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-4 glass-card p-6 rounded-3xl border-primary/20 group bg-primary/[0.02]">
<div class="drag-handle absolute top-4 right-4 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<div class="flex items-center space-x-3 mb-6">
<div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center ai-pulse border border-primary/30">
<span class="material-symbols-outlined text-white text-base">auto_awesome</span>
</div>
<div>
<h3 class="font-bold text-white text-md leading-none">Wealth AI</h3>
<p class="text-[9px] text-primary/70 font-bold uppercase tracking-widest mt-1">Grok-Enabled</p>
</div>
</div>
<div class="space-y-4">
<div class="chat-bubble-ai p-4 rounded-2xl text-[11px] leading-relaxed text-slate-200">
                        Tech sector exposure is currently <span class="text-secondary font-bold">15% above target</span>. Rebalancing suggested for portfolio stability.
                    </div>
<div class="chat-bubble-ai p-4 rounded-2xl text-[11px] leading-relaxed text-slate-200">
                        Analyzing 3 premium bonds and 2 ETF options matching your current risk profile...
                    </div>
<div class="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
<div class="flex justify-between text-[10px]">
<span class="text-secondary font-medium">Global Tech ETF</span>
<span class="font-bold text-white">8.2% APY</span>
</div>
</div>
</div>
<div class="module-resize-handle"></div>
</div>
<div class="col-span-8 glass-card p-8 rounded-3xl group">
<div class="drag-handle absolute top-4 right-4 text-slate-600"><span class="material-symbols-outlined text-sm">drag_indicator</span></div>
<div class="flex justify-between items-center mb-8">
<h3 class="font-bold text-xl text-white">Recent Activity</h3>
<div class="flex space-x-2">
<button class="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Filter</button>
<button class="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Export</button>
</div>
</div>
<div class="space-y-1">
<div class="flex items-center justify-between p-4 hover:bg-white/[0.03] rounded-2xl transition-all border-b border-white/5 last:border-0">
<div class="flex items-center space-x-4">
<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-xl">shopping_cart</span>
</div>
<div>
<p class="font-bold text-sm text-white">Apple Store NYC</p>
<p class="text-[11px] text-slate-500 font-medium">Technology • 14:20</p>
</div>
</div>
<div class="text-right">
<p class="font-bold text-white">-$1,299.00</p>
<p class="text-[10px] text-slate-500">Oct 31, 2025</p>
</div>
</div>
<div class="flex items-center justify-between p-4 hover:bg-white/[0.03] rounded-2xl transition-all border-b border-white/5 last:border-0">
<div class="flex items-center space-x-4">
<div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-xl">restaurant</span>
</div>
<div>
<p class="font-bold text-sm text-white">The Grill House</p>
<p class="text-[11px] text-slate-500 font-medium">Dining • 20:15</p>
</div>
</div>
<div class="text-right">
<p class="font-bold text-white">-$142.50</p>
<p class="text-[10px] text-slate-500">Oct 30, 2025</p>
</div>
</div>
</div>
<button class="w-full mt-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all">
                    View Complete Ledger
                </button>
<div class="module-resize-handle"></div>
</div>
</div>
</main>
</div>
<button class="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all z-[100]">
<span class="material-symbols-outlined text-2xl">bolt</span>
</button>

</body></html>