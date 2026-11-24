# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

## Brand overrides (take precedence)

These brand tokens override the generic palette and font suggestions generated below across all surfaces (`kurumbar-app`, `kurumbar-web`, `kurumbar-admin`) and any page override files in `design-system/pages/`.

### Brand Color Palette & Verified WCAG Contrast Ratios

| Token | Hex | Role | Verified WCAG Contrast |
|---|---|---|---|
| `primary` | `#15803D` | Primary Green (buttons, active tabs, badges, links) | `5.02:1` on `#FFFFFF` (AA Pass), `4.79:1` on `#FAFAF5` (AA Pass) |
| `primaryDark` | `#14532D` | Dark Green (wordmark, headings on accent, pressed state) | `9.11:1` on `#FFFFFF` (AAA Pass), `5.95:1` on `#FACC15` (AA Pass) |
| `accentYellow` | `#FACC15` | Golden Yellow accent (highlights, badges, banners — **never** use white text on yellow; pair only with `#14532D` or `#1E293B`) | `#1E293B` on `#FACC15` = `9.55:1` (AAA Pass); `#FFFFFF` on `#FACC15` = `1.53:1` (**BANNED**) |
| `background` | `#FAFAF5` | Warm off-white scaffold / page background | `13.97:1` with `#1E293B` |
| `surface` | `#FFFFFF` | Cards, sheets, inputs, dialogs | `14.63:1` with `#1E293B` |
| `textPrimary` | `#1E293B` | Headings, body copy, primary labels | `14.63:1` on `#FFFFFF`, `13.97:1` on `#FAFAF5` (AAA Pass) |
| `textSecondary` | `#475569` | Captions, metadata, helper labels | `7.58:1` on `#FFFFFF`, `7.24:1` on `#FAFAF5` (AAA Pass) |
| `border` | `#E2E8F0` | Card outlines, input borders, dividers | Structural divider |
| `error` | `#DC2626` | Validation errors, destructive actions, reject status | `4.83:1` on `#FFFFFF` (AA Pass) |

### Typography (Bilingual Tamil + English)
- **Tamil Font:** `Noto Sans Tamil` (weights 400, 500, 600, 700)
- **Latin Font:** `Inter` (weights 400, 500, 600, 700)
- **Minimum mobile body font size:** `16px` (`1.0rem`) for comfortable reading by older and first-time smartphone users; line-height `1.5`–`1.75`.

### Radii & Elevation (Aligned with Genie `design_system.md`)
- `radius24` (`24px`): Primary section cards, digital ID card container, bottom sheets
- `radius16` (`16px`): List item cards, media thumbnails, announcement banners
- `radius12` (`12px`) / `radius10` (`10px`): Buttons, form inputs, selection chips
- `radiusPill` (`100px` / `9999px`): Status badges, filter pills, step indicators

### Interaction & Bilingual Standards
- **Languages:** Bilingual Tamil (`ta`) and English (`en`) throughout every screen and form.
- **Touch Targets:** Minimum `44px × 44px` (`44.r` in Flutter) for all buttons, tabs, chips, and icon controls.
- **Forms:** Multi-step wizards with explicit progress indicators, persistent field labels, inline errors adjacent to fields, and disabled/loading button states during async requests.

---

**Project:** Kurumbar
**Generated:** 2026-11-24 14:24:18
**Category:** Community Organization Platform (UI/UX Pro Max Baseline Below)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#7C3AED` | `--color-primary` |
| Secondary | `#A78BFA` | `--color-secondary` |
| CTA/Accent | `#22C55E` | `--color-cta` |
| Background | `#FAF5FF` | `--color-background` |
| Text | `#4C1D95` | `--color-text` |

**Color Notes:** Community purple + join green

### Typography

- **Heading Font:** Noto Serif TC
- **Body Font:** Noto Sans TC
- **Mood:** chinese, traditional, elegant, cultural, multilingual, readable
- **Google Fonts:** [Noto Serif TC + Noto Sans TC](https://fonts.google.com/share?selection.family=Noto+Sans+TC:wght@300;400;500;700|Noto+Serif+TC:wght@400;500;600;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #22C55E;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #7C3AED;
  border: 2px solid #7C3AED;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAF5FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #7C3AED;
  outline: none;
  box-shadow: 0 0 0 3px #7C3AED20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Accessible & Ethical

**Keywords:** High contrast, large text (16px+), keyboard navigation, screen reader friendly, WCAG compliant, focus state, semantic

**Best For:** Government, healthcare, education, inclusive products, large audience, legal compliance, public

**Key Effects:** Clear focus rings (3-4px), ARIA labels, skip links, responsive design, reduced motion, 44x44px touch targets

### Page Pattern

**Pattern Name:** Community/Forum Landing

- **Conversion Strategy:** Show active community (member count, posts today). Highlight benefits. Preview content. Easy onboarding.
- **CTA Placement:** Join button prominent + After member showcase
- **Section Order:** 1. Hero (community value prop), 2. Popular topics/categories, 3. Active members showcase, 4. Join CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Outdated design
- ❌ Hidden info

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
