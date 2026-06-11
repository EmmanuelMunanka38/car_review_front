---
name: Apex Narrative
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#5d3f3e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#916e6d'
  outline-variant: '#e6bdbb'
  surface-tint: '#bf0029'
  primary: '#b90027'
  on-primary: '#ffffff'
  primary-container: '#e31837'
  on-primary-container: '#fffaf9'
  inverse-primary: '#ffb3b1'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#4d5c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#65758c'
  on-tertiary-container: '#fcfbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001d'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

The design system is engineered for a premium automotive editorial experience. It balances the raw power of high-performance machinery with the sophisticated precision of luxury journalism. The aesthetic is **Corporate/Modern** with a lean toward **High-Contrast** editorial layouts.

The target audience consists of enthusiasts, investors, and industry professionals who demand technical depth presented through an elegant lens. Every interface element should feel intentional, reflecting the "form follows function" philosophy of automotive engineering. The UI avoids unnecessary flourish, relying instead on bold typography, expansive whitespace, and a high-performance color palette to evoke an emotional response of authority and speed.

## Colors

The palette is anchored by **Racing Red (#E31837)**, a high-chroma accent used sparingly for calls to action, performance metrics, and critical highlights. 

- **Primary:** Racing Red (#E31837) - Used for brand-defining moments and primary interaction points.
- **Secondary:** Deep Slate (#0F172A) - Provides the authoritative weight for typography and heavy structural elements.
- **Tertiary:** Cool Gray (#64748B) - Utilized for secondary information, metadata, and borders.
- **Neutral:** Studio White (#F8FAFC) and Pure Black (#000000) - Defines the high-contrast environment for both light and dark modes.

In **Dark Mode**, the background transitions to a rich Slate Black (#020617), with surface containers using subtle Slate 900 variants to maintain depth without losing the "crisp" editorial feel.

## Typography

Typography drives the editorial hierarchy. **Archivo Narrow** is used for headlines to mimic the condensed, high-impact feel of classic automotive magazine covers. Its verticality allows for aggressive, large-scale titling even on restricted screen widths.

**Inter** provides a neutral, highly legible foundation for long-form editorial content, ensuring technical specifications and car reviews remain easy to digest. 

**JetBrains Mono** is introduced for technical data, specs (0-60 times, horsepower, torque), and labels. This monospaced touch reinforces the "technical/engineering" aspect of the brand, making data tables and performance stats feel like a readout from a high-end dashboard.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to maintain editorial control over line lengths, transitioning to a fluid model for mobile devices.

- **Desktop (1280px+):** 12-column grid with 24px gutters. Margins are generous (48px+) to allow the content to "breathe" like a physical magazine.
- **Tablet (768px - 1279px):** 8-column grid with 24px gutters.
- **Mobile (< 767px):** 4-column fluid grid with 16px gutters and margins.

Spacing follows a strict 8px rhythm (with a 4px sub-grid for tight component internals). Vertical rhythm is prioritized; "Stack" units define the distance between article sections, ensuring a consistent pace as the user scrolls through long-form content.

## Elevation & Depth

To maintain a sophisticated, "flat-premium" look, depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Base):** Studio White or Slate Black.
- **Level 1 (Cards/Containers):** Defined by a 1px solid border (Slate 200 in light mode, Slate 800 in dark mode).
- **Level 2 (Dropdowns/Modals):** Subtle ambient shadows (0 10px 15px -3px rgba(0,0,0,0.1)) with no tinting, ensuring the focus remains on the photography.
- **Glassmorphism:** Reserved exclusively for sticky navigation bars and over-image captions, using a 12px backdrop blur to maintain legibility without obscuring the vehicle imagery.

## Shapes

The shape language is **Soft (0.25rem)**. While modern automotive design involves curves, the editorial framing should feel structural and architectural. 

- **Small elements (Buttons, Inputs, Tags):** 4px (0.25rem) radius.
- **Medium elements (Cards, Images, Modals):** 8px (0.5rem) radius.
- **Large elements (Featured Hero sections):** 12px (0.75rem) radius.

Sharp corners are used for dividers and decorative "slashes" (e.g., a 15-degree angled edge on a button or category tag) to evoke a sense of velocity.

## Components

### Buttons
- **Primary:** Solid Secondary color (Deep Slate) with white text. Racing Red is reserved for "High Performance" actions (Buy, Subscribe, Test Drive).
- **Secondary:** Outlined 1px, using 4px roundedness.
- **Ghost:** Monospaced label-md text with a Racing Red underline on hover.

### Cards
- Editorial cards use a "Full Bleed" image top, with text content padded by `stack-md`. 
- Borders are 1px solid Slate 200. No shadow by default; on hover, a subtle 2px Slate 900 bottom-border "lift" appears.

### Input Fields
- Underlined style or subtle 1px border. Backgrounds are slightly off-white (#F1F5F9) to distinguish from the base page.
- Focus state uses a 2px Racing Red left-border accent.

### Chips & Tags
- Used for "Category" (e.g., SUV, HYPERCAR). These use `label-sm` JetBrains Mono text.
- High-contrast: Black background with white text or white background with black text.

### Data Tables (The Spec Sheet)
- Alternate row striping using Neutral 50. 
- Headers use `label-md` with a solid 2px Deep Slate bottom border. 
- Numerical values should always be right-aligned for easy comparison.

### Navigation
- Global Nav is minimal. Use a centered logo with `label-md` navigation links.
- High-performance mode toggle: A specific UI switch that toggles between "Specs" and "Gallery" views on article pages.