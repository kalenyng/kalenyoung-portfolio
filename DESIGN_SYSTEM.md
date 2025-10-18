# Design System — 2025 Production-Ready

## 🎨 Visual Language

### Aesthetic
Modern, professional, developer-focused. Inspired by Linear, Vercel, and Framer—clean, purposeful, no decorative flourishes.

---

## 📝 Typography

### Font Stack
```css
Headings: Space Grotesk (600, 700)
Body: Inter (400, 500, 600)
Code: JetBrains Mono (400, 500)
```

### Hierarchy
- **H1**: 6xl (mobile), 8xl (desktop) — `font-bold tracking-tight leading-tight`
- **H2**: 5xl (mobile), 6xl (desktop) — `font-bold tracking-tight leading-tight`
- **H3**: 2xl — `font-semibold tracking-tight leading-tight`
- **Body**: Base size with `leading-relaxed`

### Rules
- Use `tracking-tight` on all headings
- Max width: `65ch` for prose blocks (`.prose-text`)
- Line height: `1.2` for headings, `1.625` for body
- Section labels: `text-xs uppercase tracking-widest font-semibold`

---

## 🎭 Color Tokens

### Light Theme
```css
--ink: #0A0E16        /* Primary text */
--alpine: #1E3A34     /* Secondary text */
--mist: #A8B4B0       /* Muted text */
--ember: #F76C1B      /* Accent (CTAs only) */
--paper: #F9F9F9      /* Background */
```

### Dark Theme
```css
--ink: #F9F9F9        /* Primary text */
--alpine: #7AA99A     /* Secondary text */
--mist: #6B7875       /* Muted text */
--ember: #FF8547      /* Accent (brighter) */
--paper: #0A0E16      /* Background */
```

### Semantic Tokens
- `--bg-primary`: Main background
- `--bg-secondary`: Cards, panels
- `--bg-elevated`: Raised elements
- `--border`: Subtle borders (8-12% opacity)
- `--shadow`: Base shadow (4% light, 20% dark)
- `--shadow-lg`: Hover shadow (10% light, 40% dark)
- `--glow`: Accent shadow (15-20% opacity)

---

## 🔘 Buttons

### Primary Button
```css
Style: Solid fill, ember background
Hover: translateY(-2px) + glow shadow + brightness(1.05)
Active: translateY(0) + instant (0.1s)
Radius: rounded-xl
Padding: px-6 py-3
Font: 500 weight
```

### Secondary Button
```css
Style: 1.5px border, transparent background
Hover: translateY(-2px) + elevated bg + muted border + shadow
Active: translateY(0) + instant (0.1s)
Radius: rounded-xl
Padding: px-6 py-3
Font: 500 weight
```

### Timing
- Default: `0.25s cubic-bezier(0.22, 1, 0.36, 1)`
- Active: `0.1s` (instant feedback)

---

## 🃏 Cards

### Base Card
```css
Border: 1px, rounded-2xl
Shadow: 0 1px 3px var(--shadow)
Backdrop: blur(8px)
Padding: p-6
Transition: 0.4s spring ease
```

### Hover State
```css
Transform: translateY(-4px)
Shadow: 0 20px 40px var(--shadow-lg) + 1px accent outline
Border: var(--accent)
```

### Glass Variant
```css
Background: rgba(255,255,255,0.7) [light]
            rgba(20,25,35,0.7) [dark]
Backdrop: blur(12px)
```

---

## 🔗 Links

### Standard Link
```css
Underline: scaleX(0 → 1) from left
Transform-origin: left
Transition: 0.25s spring ease
Height: 2px
Color: currentColor
```

### Hover Color
```css
Color shift: var(--accent)
Transition: 0.25s spring ease
```

---

## 🎬 Motion System

### Easing
**Universal**: `cubic-bezier(0.22, 1, 0.36, 1)` (spring ease)

### Durations
- Fast interactions: `0.25s` (buttons, links)
- Medium: `0.4s` (cards)
- Slow: `0.6s` (scroll reveals)

### Scroll Reveals
- Opacity: `0 → 1`
- Transform: `translateY(30px) → 0`
- Duration: `0.6s`
- Margin: `-80px` (trigger before visible)

### Stagger
- Delay: `0.06s` per item
- Duration: `0.6s`
- Easing: Spring

### Parallax
- Hero background only
- Speed: `-0.2` (very subtle)

---

## 🧩 Components

### Section
```css
Padding: py-20 (mobile), py-32 (desktop)
Title: Uppercase label + large heading + subtitle
Spacing: mb-16 between header and content
```

### Nav
```css
Blur: Appears at 50px scroll
Backdrop: blur(12px) + 70% opacity background
Border: Transitions in on scroll
Active indicator: scaleX underline
```

### Project Cards
```css
Image: rounded-t-2xl, scale(1.05) on hover (0.5s)
Content: space-y-5
Tech tags: rounded-lg, bordered, px-3 py-1.5
Buttons: Consistent with global button styles
```

---

## ♿ Accessibility

### Focus States
- Ring: `2px var(--ember)`
- Offset: `2px`
- All interactive elements must have visible focus

### Reduced Motion
- All animations skip if `prefers-reduced-motion: reduce`
- Elements show immediately (opacity: 1)
- No transform animations

### Keyboard Nav
- All links and buttons keyboard accessible
- Skip-to-content link (visible on focus)
- Logical tab order

---

## 📐 Spacing Scale

```css
Tight: space-y-4
Normal: space-y-6
Loose: space-y-8
Section gap: space-y-12
Large sections: py-20 → py-32
```

---

## 🎯 Principles

1. **Precision over playfulness** — Movements are exact, predictable
2. **Consistency** — Same easing, same durations, same patterns
3. **Purposeful motion** — Every animation has a reason
4. **Tactile feedback** — Buttons feel responsive, not floaty
5. **Professional polish** — No gimmicks, no decorative fonts, no surprises

---

## 🚀 Performance

- Lighthouse targets: **95+ all metrics**
- Transform-based animations (GPU)
- `will-change` hints on sections
- Passive scroll listeners
- No layout shift (opacity + transform only)
- Lazy-loaded images below fold

---

**This is a production design system, not a concept demo.**

