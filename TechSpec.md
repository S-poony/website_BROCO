# BROCO Website — Technical Specification

## 1. Component Inventory

### shadcn/ui Components (built-in)
- **Button** — CTAs (primary accent, secondary ghost)
- **Input** — email capture in footer
- **Card** — feature cards, testimonial cards (will override styles for tile look)

### Custom Components

**Layout Components**
- `Tile` — reusable white panel with border/shadow (props: children, className, hasShadow, noHover)
- `Rule` — vertical/horizontal line (props: orientation, className, light)
- `Navigation` — fixed top nav with scroll-aware styling and GSAP-aware `scrollToSection`

**Section Components**
- `HeroSection` — Section 1 (split hero with auto-play entrance + scroll exit)
- `GalleryMosaicSection` — Section 2 (2×2 mosaic grid with scroll entrance/exit)
- `FooterSection` — Section 3 (CTA + links, scrub reveal)

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Hero auto-play entrance** | GSAP timeline | Timeline on mount: rule draw → headline stagger → tile slide → CTA fade | High |
| **Headline character split** | Custom + GSAP | Split text into spans, animate y/opacity with stagger | Medium |
| **Vertical rule draw** | GSAP | scaleY from 0→1, transform-origin: top | Low |
| **Horizontal rule draw** | GSAP | scaleX from 0→1, transform-origin: left | Low |
| **Mosaic tiles stagger** | GSAP ScrollTrigger | Each tile from nearest corner, stagger 0.02 | Medium |
| **Section autoAlpha exit** | GSAP ScrollTrigger | Section fades to `autoAlpha: 0` at 88–100% to prevent blank space | Medium |
| **Button hover states** | CSS/Tailwind | translateY + scale transitions | Low |
| **Link underline reveal** | CSS | ::after scaleX transform | Low |
| **Global scroll snap** | GSAP ScrollTrigger | Derive pinned ranges, snap to settle centers | High |

---

## 3. Animation Library Choices

### Primary: GSAP + ScrollTrigger
- All pinned section animations
- Scroll-driven transforms with scrub
- Global snap configuration

### Secondary: CSS Transitions
- Hover states (buttons, tiles, links)
- Simple opacity/transform on interaction

### Rationale
- GSAP provides precise scrub control and reverse playback
- ScrollTrigger handles pin/unpin seamlessly
- CSS for lightweight interactions (no JS overhead)

---

## 4. Project File Structure

```
app/
├── public/
│   └── images/           # All lifestyle photos & gifs
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── Tile.tsx
│   │   ├── Rule.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── GalleryMosaicSection.tsx
│   │   └── FooterSection.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx          # Global snap + section composition
│   ├── index.css        # Design tokens + component styles
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 5. Dependencies to Install

```bash
# Core animation
npm install gsap

# Fonts (Google Fonts via CDN in index.html)
# Space Grotesk, Inter, IBM Plex Mono
```

---

## 6. Key Implementation Details

### Pinned Section Pattern
```tsx
// Each pinned section uses gsap.context for safe cleanup
const ctx = gsap.context(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=130%',
      pin: true,
      scrub: 0.3,
      // Safety callbacks for fast-scroll edge cases
      onLeave: () => gsap.set(section, { autoAlpha: 0 }),
      onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
    }
  });

  // Entrance tweens (0 → 0.3)
  // Hold phase (0.3 → 0.7)
  // Exit tweens (0.7 → 1.0)
  // Section autoAlpha fade (0.88 → 1.0)
}, sectionRef);

return () => ctx.revert();
```

### Hero Auto-Play Entrance
```tsx
// On mount, create timeline (NOT scroll-triggered)
const tl = gsap.timeline();
tl.fromTo(ruleRef, { scaleY: 0 }, { scaleY: 1, duration: 0.6 })
  .fromTo(headlineRefs, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08 }, "-=0.3")
  .fromTo(tileRef, { x: "12vw", opacity: 0 }, { x: 0, opacity: 1 }, "-=0.5");
```

### Global Snap Configuration
```tsx
// After all ScrollTriggers created
const pinned = ScrollTrigger.getAll()
  .filter(st => st.vars.pin)
  .sort((a, b) => a.start - b.start);

const maxScroll = ScrollTrigger.maxScroll(window);

// Build ranges and snap targets from actual pinned sections
// (Implementation in App.tsx)
```

### Tile Component Structure
```tsx
interface TileProps {
  children: React.ReactNode;
  className?: string;
  hasShadow?: boolean;
  noHover?: boolean;  // Disable hover lift on gallery tiles
}

// Styles:
// - bg-white, border border-[var(--color-border)]
// - rounded-none (sharp edges per design system)
// - Optional hover: shadow-md + translateY(-2px)
```

### Color Tokens (Tailwind)
```js
// tailwind.config.js extend colors
colors: {
  background: '#F6F5F2',
  backgroundDark: '#0B0B0D',
  accent: '#2F6BFF',
  textPrimary: '#0B0B0D',
  textSecondary: '#6E6E73',
}
```

---

## 7. Performance Considerations

- Use `will-change: transform` on animated elements
- Keep shadows static (no animated box-shadow)
- Use transform-only animations (no blur/backdrop-filter)
- `scrub: 0.3` for responsive scroll tracking without jank
- `autoAlpha` instead of `opacity` on section exit to prevent blank pin-spacer space
- `gsap.context()` for safe cleanup on unmount / HMR / StrictMode
- Lazy load images below fold
- Respect `prefers-reduced-motion` (CSS transitions handled; GSAP requires manual check)

---

## 8. Responsive Breakpoints

```js
// Tailwind defaults
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

- Mobile: Stack layouts (tile top, text bottom)
- Tablet: Adjust column widths, maintain grid
- Desktop: Exact compositions as designed
