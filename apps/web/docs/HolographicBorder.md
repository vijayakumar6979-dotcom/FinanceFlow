# Holographic Border Component

## Overview

The `HolographicBorder` and `NeonBorder` components provide futuristic border effects for the FinanceFlow dashboard, creating stunning visual effects with rotating gradients and glowing borders.

---

## HolographicBorder Component

Creates a rotating conic gradient border effect that simulates a holographic appearance.

### Import

```typescript
import { HolographicBorder } from '@/components/ui/HolographicBorder'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to wrap with holographic border |
| `className` | `string` | `''` | Additional CSS classes |
| `borderWidth` | `number` | `2` | Width of the border in pixels |
| `animationDuration` | `number` | `4` | Duration of rotation animation in seconds |
| `colors` | `string[]` | `['#0066FF', '#8B5CF6', '#EC4899']` | Array of hex colors for gradient |
| `blur` | `number` | `20` | Blur amount for the glow effect |

### Basic Usage

```tsx
<HolographicBorder className="p-6 bg-dark-elevated rounded-3xl">
  <h3 className="text-xl font-bold text-white">Your Content</h3>
  <p className="text-gray-400">This has a holographic border!</p>
</HolographicBorder>
```

### Custom Colors

```tsx
<HolographicBorder
  colors={['#10B981', '#06B6D4', '#8B5CF6']}
  animationDuration={6}
  blur={30}
>
  <div className="p-6 bg-dark-elevated rounded-3xl">
    Custom green-cyan-purple gradient
  </div>
</HolographicBorder>
```

### Use Cases

- **Hero Sections**: Wrap main dashboard cards
- **Important Widgets**: Highlight critical information
- **Call-to-Action Cards**: Draw attention to actions
- **Premium Features**: Indicate premium/pro features

---

## NeonBorder Component

Creates a static gradient border with customizable neon glow effect.

### Import

```typescript
import { NeonBorder } from '@/components/ui/NeonBorder'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to wrap with neon border |
| `className` | `string` | `''` | Additional CSS classes |
| `gradient` | `string` | `'linear-gradient(90deg, #0066FF, #8B5CF6, #EC4899)'` | CSS gradient string |
| `glowIntensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Intensity of the glow effect |
| `animated` | `boolean` | `false` | Enable pulse animation |

### Basic Usage

```tsx
<NeonBorder className="p-6">
  <h3 className="text-xl font-bold text-white">Neon Border</h3>
  <p className="text-gray-400">Static gradient border with glow</p>
</NeonBorder>
```

### High Intensity with Animation

```tsx
<NeonBorder
  glowIntensity="high"
  animated={true}
  gradient="linear-gradient(90deg, #EF4444, #F59E0B, #10B981)"
>
  <div className="p-6">
    Pulsing neon border with custom gradient
  </div>
</NeonBorder>
```

### Use Cases

- **Buttons**: Highlight primary actions
- **Cards**: Add emphasis to important cards
- **Notifications**: Draw attention to alerts
- **Status Indicators**: Show active/selected states

---

## Examples

### Financial Stats Card

```tsx
<HolographicBorder className="p-8 bg-gradient-to-br from-dark-elevated/90 to-dark-surface/90 backdrop-blur-2xl rounded-3xl">
  <div className="grid grid-cols-3 gap-6">
    <div className="text-center">
      <p className="text-gray-400 text-sm">Total Balance</p>
      <h3 className="text-3xl font-bold text-white font-mono">RM 45,230</h3>
      <p className="text-green-400 text-sm">+12.5%</p>
    </div>
    {/* More stats... */}
  </div>
</HolographicBorder>
```

### Premium Feature Card

```tsx
<NeonBorder
  glowIntensity="high"
  gradient="linear-gradient(135deg, #FFD700, #FFA500)"
  animated={true}
>
  <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
    <h3 className="text-xl font-bold text-yellow-400">Premium Feature</h3>
    <p className="text-gray-300">Unlock advanced analytics</p>
  </div>
</NeonBorder>
```

---

## Tailwind Configuration

The components use custom animations defined in `tailwind.config.js`:

```javascript
animation: {
  'holographic-rotate': 'holographic-rotate 4s linear infinite',
  'holographic-rotate-slow': 'holographic-rotate 6s linear infinite',
  'holographic-rotate-fast': 'holographic-rotate 2s linear infinite',
},
keyframes: {
  'holographic-rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
}
```

---

## Performance Considerations

1. **Use Sparingly**: Limit to 2-3 holographic borders per page for best performance
2. **Reduce Blur**: Lower blur values (10-15px) perform better on mobile
3. **Disable on Mobile**: Consider disabling animations on mobile devices
4. **GPU Acceleration**: Components use `transform` for hardware acceleration

---

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ⚠️ Older browsers: Falls back to static border

---

## Accessibility

- Components are purely decorative and don't affect content accessibility
- Ensure sufficient color contrast for text inside bordered elements
- Consider users with motion sensitivity - provide option to disable animations

---

## Related Components

- `ParticleBackground` - Animated particle effects
- `StatCard3D` - 3D stat cards with hover effects
- `Widget3D` - 3D widget container with tilt effects
