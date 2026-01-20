# Add Transaction Modal Design (Ultra Modern)

## Visual Concept
"Holographic Data Entry": The modal should feel like a floating projection rather than a standard window.

## Core Styles
- **Background**: `bg-[#050511]/90 backdrop-blur-2xl` (Deep Space with high blur).
- **Border**: `border border-white/10` with a subtle top highlight `border-t-white/20`.
- **Shadow**: `shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]` (Large blue glow).
- **Inputs**: Transparent with bottom border only, or "pill" shape glass containers.

## Scrollbar Elimination Strategy
- **Dropdowns**: Use custom-styled `div` based dropdowns or ensure `<select>` has `scrollbar-width: none` (Firefox) and `::-webkit-scrollbar { display: none; }` (Chrome/Safari).
- **Modal Body**: Ensure the content fits within `max-h-[90vh]` and if overflow is absolutely necessary (e.g. mobile), use hidden scrollbars.
- **Controls**: All inner lists (Category select) must have hidden scrollbars.

## Components
1.  **Type Toggle**: Segmented liquid control.
2.  **Amount Display**: Large, central, glowing text (Neon style).
3.  **Smart Fields**: Inputs that glow when focused.
4.  **Action Bar**: Floating buttons at the bottom.

## CSS Utilities
```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
```
