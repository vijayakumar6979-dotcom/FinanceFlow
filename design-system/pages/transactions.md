# Transactions Page Design

## Layout Strategy
- **Structure**: Split view (Desktop) / Stacked (Mobile)
  - Left/Top: **AI Command Center** (Search + High Level Stats)
  - Right/Bottom: **Analysis Stream** (Filters + List)
- **Grid**: 12-column mesh.

## Components

### 1. AI Command Bar
*The new search experience.*
- **Style**: Large floating input, centered or top-aligned.
- **Visual**: Glassmorphic container `bg-black/40 backdrop-blur-2xl`.
- **Placeholder**: "Ask FinanceFlow about your coffee spending..."
- **Interaction**: Glowing border on focus (`ring-2 ring-primary/50`).

### 2. Holographic Stats
*Floating metrics that feel alive.*
- **Background**: Transparent with subtle gradient stroke.
- **Typography**: Large `JetBrains Mono` numbers for values.
- **Trend**: Neon arrow indicators (Green `#4ADE80`, Red `#F87171`).

### 3. Smart Transaction List
- **Row Style**: Compact, high density.
- **Hover**: Reveal "Quick Actions" (Categorize, Split, Flag).
- **Icons**: Dual-tone SVGs or Brand Logos.
- **Date**: Relative (e.g., "2 hours ago") for recent, Date for older.

### 4. AI Insights Sidebar
- **Context**: "You spent 20% more on dining this week."
- **Visual**: Alert-style cards with `border-l-4` accent color.
