---
name: Service Harmony
colors:
  surface: '#FFFFFF'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success: '#22C55E'
  text-primary: '#111827'
  text-secondary: '#6B7280'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1.5rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  section-gap: 3rem
---

## Brand & Style

The design system is built upon a **Corporate Modern** aesthetic that prioritizes trust, reliability, and clarity. Given the nature of local service booking—where users invite strangers into their homes—the UI must feel professional yet approachable.

The style leverages a **Card-Based Interface** to organize complex service data into digestible units. High contrast between surfaces and backgrounds ensures accessibility, while generous whitespace and a "spacious" layout model reduce cognitive load during the booking process. The visual language is defined by soft geometry, high-quality typography, and a "breathable" interface that scales from simple consumer bookings to complex provider dashboards.

## Colors

The palette is anchored by a trustworthy **Primary Blue (#2563EB)**, used for critical actions and brand presence. **Secondary Teal (#14B8A6)** is utilized for secondary affirmations and utility actions, while **Accent Orange (#F59E0B)** is reserved for highlights, ratings, and attention-grabbing elements like active promos.

The background uses a cool, off-white neutral to allow pure white surface cards to pop with distinct hierarchy. Text colors are strictly tiered: deep charcoal for readability and slate gray for metadata and captions, ensuring WCAG AA compliance across all components.

## Typography

This design system utilizes **Inter** exclusively to maintain a systematic, utilitarian feel that works across both high-density data tables and consumer-facing marketing cards. 

**Headlines** use a bold weight and slightly tighter letter-spacing to create a strong visual anchor. **Body text** is set with generous line-heights to improve legibility on mobile devices. **Labels** utilize medium weights to distinguish them from standard body text, ensuring that even at small sizes (12px), metadata like "Distance" or "Category" remains highly legible.

## Layout & Spacing

The system employs a **Fluid Grid** model. On mobile, a single-column layout with 24px (1.5rem) side margins is standard. As the viewport scales to tablet and desktop, the system transitions to a 12-column grid with 16px gutters.

Spacing follows a strict 8px-based rhythm. Components use internal padding of 16px or 24px to maintain the "spacious" requirement. Layouts should prioritize vertical rhythm, using larger gaps (32px+) between distinct sections (e.g., between "Featured Providers" and "Categories") to allow the design to breathe and reduce visual noise.

## Elevation & Depth

Hierarchy is established using **Tonal Layers** combined with **Ambient Shadows**. 

- **Level 0 (Background):** #F8FAFC. The foundation layer.
- **Level 1 (Cards/Surfaces):** Pure #FFFFFF with a subtle, highly diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)).
- **Level 2 (Interactive/Floating):** Used for sticky bars or active modals, featuring a more pronounced shadow (0px 8px 24px rgba(0, 0, 0, 0.1)).

This design system avoids heavy borders, instead using the contrast between the surface color and the neutral background to define boundaries.

## Shapes

The shape language is consistently **Rounded**, using a base radius of 12px-16px for primary containers and cards. This softens the "corporate" edge of the primary blue, making the interface feel more modern and friendly. 

- Small elements (checkboxes, tags) use a 4px-6px radius.
- Standard buttons and cards use a 12px radius.
- Large hero elements or bottom sheets use a 24px-32px radius on top corners only.

## Components

### Buttons
Primary buttons are high-contrast #2563EB with white text, featuring a minimum tap target height of 48px. Secondary buttons use a ghost style with a 1px border of the primary color or a light-gray fill.

### Cards
The core of the UI. Cards must include 16px-24px of internal padding. Image-led cards (Provider Profiles) should use "Aspect Ratio: 16/9" for cover photos with a top-only 12px corner radius.

### Input Fields
Forms use a soft #F1F5F9 background with a 1px border that turns #2563EB on focus. Labels sit outside the field for maximum accessibility.

### Chips & Filters
Horizontal scrolling chips are used for category selection. Active chips use a solid primary blue fill; inactive chips use a light gray stroke and #6B7280 text.

### Booking Timeline
A custom vertical stepper component should be used for "Provider Booking Details," using the Primary Blue for active states and Success Green for completed milestones.