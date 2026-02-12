# BROCO Website — Technical Specification

## 1. Component Inventory

### shadcn/ui Components (built-in)
- **Button** — CTAs (primary accent, secondary ghost)
- **Input** — email capture in footer
- **Card** — feature cards, testimonial cards (will override styles for tile look)

### Custom Components

**Layout Components**
- `Tile` — reusable white panel with border/shadow (props: children, className, hasShadow)
- `Rule` — vertical/horizontal line (props: orientation, className)
- `SectionWrapper` — handles pin state + ScrollTrigger setup

**Section Components**
- `HeroSection` — Section 1 (split hero with auto-play entrance)
- `FeatureHighlightSection` — Section 2 (big tile + text)
- `ThreeUpFeatures` — Section 3 (flowing, 3 cards)
- `DeepFeatureSection` — Section 4 (tall tile + text)
- `WorkflowSection` — Section 5 (steps)
- `GalleryMosaicSection` — Section 6 (2×2 grid)
- `DarkFeatureSection` — Section 7 (dark bg CTA)
- `TestimonialsSection` — Section 8 (flowing, 3 cards)
- `FooterSection` — Section 9 (CTA + links)

**Animation Components**
- `SplitText` — character/word split for headlines (custom implementation)
- `AnimatedTile` — tile with entrance/exit animations

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Hero auto-play entrance** | GSAP timeline | Timeline on mount: rule draw → headline stagger → tile slide → CTA fade | High |
| **Headline character split** | Custom + GSAP | Split text into spans, animate y/opacity with stagger | Medium |
| **Vertical rule draw** | GSAP | scaleY from 0→1, transform-origin: top | Low |
| **Horizontal rule draw** | GSAP | scaleX from 0→1, transform-origin: left | Low |
| **Tile slide + scale entrance** | GSAP ScrollTrigger | fromTo with x/y/opacity/scale, scrub: 0.6 | Medium |
| **Tile slide exit** | GSAP ScrollTrigger | fromTo with x/opacity, keep visible until 95% | Medium |
| **Text block slide** | GSAP ScrollTrigger | fromTo with x/opacity | Low |
| **Mosaic tiles stagger** | GSAP ScrollTrigger | Each tile from nearest edge, stagger 0.06 | Medium |
| **Steps stagger** | GSAP ScrollTrigger | Stagger fromTo with x/opacity | Low |
| **Cards reveal (flowing)** | GSAP ScrollTrigger | Scrubbed fromTo, y/opacity/scale | Low |
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
│   ├── images/           # All lifestyle photos
│   └── noise.png         # Grain overlay
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── Tile.tsx
│   │   ├── Rule.tsx
│   │   ├── SplitText.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── FeatureHighlightSection.tsx
│   │   ├── ThreeUpFeatures.tsx
│   │   ├── DeepFeatureSection.tsx
│   │   ├── WorkflowSection.tsx
│   │   ├── GalleryMosaicSection.tsx
│   │   ├── DarkFeatureSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── FooterSection.tsx
│   ├── hooks/
│   │   └── useScrollTrigger.ts  # Optional helper
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── index.css
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
// Each pinned section follows this structure
<section className="h-screen w-screen relative overflow-hidden">
  {/* Content with z-index layering */}
</section>

// ScrollTrigger setup in useEffect
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "+=130%",
  pin: true,
  scrub: 0.6,
  // animations attached to timeline
});
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
}

// Styles:
// - bg-white
// - border-[3px] border-[#0B0B0D]
// - rounded-[22px]
// - shadow: 0 18px 0 rgba(11,11,13,0.10) (if hasShadow)
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

- Use `will-change: transform` on animated tiles
- Keep shadows static (no animated box-shadow)
- Use transform-only animations (no blur/backdrop-filter)
- Lazy load images below fold
- Respect `prefers-reduced-motion`

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
