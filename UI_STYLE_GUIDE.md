# Visual API Orchestrator - UI Style Guide

## Table of Contents
1. [Design System](#design-system)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing Scale](#spacing-scale)
5. [Components](#components)
6. [Utilities](#utilities)
7. [Accessibility](#accessibility)
8. [Dark Mode](#dark-mode)
9. [Best Practices](#best-practices)

---

## Design System

Our UI system is built on a modular, variable-based architecture with zero hardcoded values. Every component inherits from a centralized design token system.

### CSS Architecture

```
├── variables.css      → Design tokens (colors, spacing, typography)
├── layout.css         → Main app structure (flex, grid)
├── index.css          → Global styles & typography
├── components.css     → UI components (buttons, cards, forms)
├── interactions.css   → Behaviors (hover, focus, animations)
├── utilities.css      → Utility classes (helpers)
├── icons.css          → Icon system & sizing
└── dark-mode.css      → Dark theme overrides
```

### Design Tokens (variables.css)

All values are CSS variables prefixed with `--`:

- **Spacing**: `--sp-xs` to `--sp-xl`
- **Colors**: `--color-primary`, `--color-success`, etc.
- **Typography**: `--font-size-*`, `--font-weight-*`
- **Radius**: `--radius-xs` to `--radius-lg`
- **Shadows**: `--shadow-xs` to `--shadow-xl`
- **Z-Index**: `--z-base`, `--z-dropdown`, `--z-modal`, etc.

---

## Color Palette

### Primary Colors

| Name | Light | Dark | Usage |
|------|-------|------|-------|
| **Primary** | `#667eea` | `#7c8cff` | Buttons, Links, Accents |
| **Primary Dark** | `#764ba2` | `#6b7de8` | Hover states, Gradients |
| **Accent** | `#aa3bff` | `#c084fc` | Focus rings, Highlights |

### Semantic Colors

| Name | Light | Dark | Usage |
|------|-------|------|-------|
| **Success** | `#4caf50` | `#66d966` | Success messages, Valid states |
| **Error** | `#f44336` | `#ff6b6b` | Errors, Warnings, Danger |
| **Warning** | `#ff9800` | `#ffb366` | Warnings, Caution |
| **Info** | `#2196f3` | `#66b3ff` | Information, Tips |

### Neutral Colors (Light Mode)

- **Background**: `#ffffff`
- **Background Alt**: `#f5f5f5`
- **Background Hover**: `#f9f9f9`
- **Border**: `#e5e7eb`
- **Text Primary**: `#1f2937`
- **Text Secondary**: `#6b7280`
- **Text Tertiary**: `#9ca3af`
- **Text Disabled**: `#d1d5db`

### Neutral Colors (Dark Mode)

- **Background**: `#0f1419`
- **Background Alt**: `#1a1f2e`
- **Background Hover**: `#252d3d`
- **Border**: `#2a2f3a`
- **Text Primary**: `#e8ebf0`
- **Text Secondary**: `#b0b8c1`
- **Text Tertiary**: `#8a92a0`
- **Text Disabled**: `#5a6270`

---

## Typography

### Font Families

```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'Courier New', Courier, monospace;
```

### Font Sizes

| Name | Size | Usage |
|------|------|-------|
| **xs** | 12px | Small labels, captions |
| **sm** | 13px | Form hints, secondary text |
| **base** | 14px | Body text, paragraphs |
| **md** | 16px | Larger body text |
| **lg** | 18px | Subheadings |
| **xl** | 20px | Section titles |
| **2xl** | 24px | Page titles |
| **3xl** | 28px | Large headings |
| **4xl** | 32px | Hero text |

### Font Weights

| Name | Weight | Usage |
|------|--------|-------|
| **Regular** | 400 | Body text |
| **Medium** | 500 | Labels, button text |
| **Semibold** | 600 | Headings, emphasis |
| **Bold** | 700 | Strong emphasis |

### Line Heights

- **tight**: 1.2 (headings)
- **normal**: 1.5 (body)
- **relaxed**: 1.75 (prose)

---

## Spacing Scale

All spacing follows a 4px base unit:

| Name | Value | HTML Class | Usage |
|------|-------|-----------|-------|
| **xs** | 4px | `.m-xs`, `.p-xs` | Minimal spacing |
| **sm** | 8px | `.m-sm`, `.p-sm` | Small gaps |
| **md** | 16px | `.m-md`, `.p-md` | Default spacing |
| **lg** | 24px | `.m-lg`, `.p-lg` | Section gaps |
| **xl** | 32px | `.m-xl`, `.p-xl` | Large separation |

### Border Radius

| Name | Value | Usage |
|------|-------|-------|
| **xs** | 2px | Minimal rounding |
| **sm** | 4px | Input fields, buttons |
| **md** | 8px | Cards, panels |
| **lg** | 12px | Large components |

### Shadows

| Name | Usage |
|------|-------|
| **xs** | Subtle elements |
| **sm** | Cards, inputs (default) |
| **md** | Hovering elements |
| **lg** | Modals, dropdowns |
| **xl** | Floating action buttons |

---

## Components

### Buttons

#### Primary Button
```html
<button class="button button-primary">Save</button>
<button class="button button-primary" disabled>Saving...</button>
```

#### Secondary Button
```html
<button class="button button-secondary">Cancel</button>
```

#### Danger Button
```html
<button class="button button-danger">Delete</button>
```

#### Button Sizes
```html
<button class="button button-primary button-sm">Small</button>
<button class="button button-primary">Medium (default)</button>
<button class="button button-primary button-lg">Large</button>
```

#### Icon Button
```html
<button class="button button-icon">
  <span class="material-icons">delete</span>
</button>
```

#### Button with Loader
```html
<button class="button button-primary loading">Processing...</button>
```

### Forms

#### Input Field
```html
<div class="form-group">
  <label class="form-label form-label-required">Email</label>
  <input type="email" placeholder="you@example.com">
  <div class="form-hint">We'll never share your email</div>
</div>
```

#### Input States
```html
<input class="input-success" value="Valid">
<input class="input-error" value="Invalid">
```

#### Checkbox
```html
<label class="checkbox">
  <input type="checkbox">
  <span>Agree to terms</span>
</label>
```

#### Select Dropdown
```html
<select>
  <option>Choose option</option>
  <option>Option 1</option>
</select>
```

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">Card content goes here</div>
  <div class="card-footer">
    <button class="button button-secondary">Cancel</button>
    <button class="button button-primary">Save</button>
  </div>
</div>
```

### Alerts

#### Success Alert
```html
<div class="alert alert-success">
  <div class="alert-icon">
    <span class="material-icons">check_circle</span>
  </div>
  <div class="alert-content">
    <div class="alert-title">Success!</div>
    <div class="alert-message">Operation completed</div>
  </div>
  <button class="alert-close">&times;</button>
</div>
```

#### Error Alert
```html
<div class="alert alert-error">
  <div class="alert-icon">
    <span class="material-icons">error</span>
  </div>
  <div class="alert-content">
    <div class="alert-title">Error</div>
    <div class="alert-message">Something went wrong</div>
  </div>
</div>
```

### Lists

#### Simple List
```html
<ul class="list">
  <li class="list-item">Item 1</li>
  <li class="list-item">Item 2</li>
  <li class="list-item">Item 3</li>
</ul>
```

#### Menu/Dropdown
```html
<div class="menu">
  <button class="menu-item">Edit</button>
  <button class="menu-item">Delete</button>
  <div class="menu-divider"></div>
  <button class="menu-item">More options</button>
</div>
```

### Accordion

```html
<div class="accordion">
  <button class="accordion-header">
    Section 1
    <span class="accordion-icon material-icons">expand_more</span>
  </button>
  <div class="accordion-content">
    Content for section 1
  </div>
</div>
```

### Tags/Chips

```html
<span class="tag">Science</span>
<span class="chip">
  Python
  <button class="chip-remove">×</button>
</span>
```

---

## Utilities

### Flexbox Utilities
```html
<div class="flex">Column layout</div>
<div class="flex flex-col">Flex column</div>
<div class="flex flex-center">Center both axes</div>
<div class="flex flex-between">Space between</div>
<div class="flex gap-md">With gap</div>
```

### Grid Utilities
```html
<div class="grid-2">Two columns (responsive)</div>
<div class="grid-3">Three columns (responsive)</div>
<div class="grid-4">Four columns (responsive)</div>
```

### Spacing Utilities
```html
<div class="m-md">Margin medium</div>
<div class="p-lg">Padding large</div>
<div class="mx-auto">Horizontal centering</div>
```

### Text Utilities
```html
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-bold">Bold text</p>
<p class="text-center">Centered text</p>
<p class="truncate">Long text truncated...</p>
```

### Color Utilities
```html
<div class="text-primary">Primary color</div>
<div class="text-success">Success color</div>
<div class="text-error">Error color</div>
<div class="bg-light">Light background</div>
```

### Border & Shadow Utilities
```html
<div class="border">Full border</div>
<div class="border-top">Top border only</div>
<div class="rounded">Rounded corners</div>
<div class="shadow-lg">Large shadow</div>
```

---

## Accessibility

### Focus States

Every interactive element supports focus-visible for keyboard navigation:

```html
<button class="button button-primary">
  Keyboard focus will show a blue ring
</button>
```

### ARIA Labels

Use ARIA labels for icon-only buttons:

```html
<button class="button button-icon" aria-label="Delete item">
  <span class="material-icons">delete</span>
</button>
```

### Color Contrast

All text meets WCAG AA standards for contrast:
- Primary text on white: 12.5:1
- Secondary text on white: 5.2:1
- Text on colored backgrounds: 4.5:1+

### Touch Targets

All clickable elements have minimum 44px height on mobile devices.

### Keyboard Navigation

- **Tab**: Move to next element
- **Shift+Tab**: Move to previous element
- **Enter**: Activate button/link
- **Space**: Toggle checkbox
- **Arrow Keys**: Navigate selects/menus

---

## Dark Mode

Dark mode automatically activates based on system preferences:

```css
@media (prefers-color-scheme: dark) {
  /* Dark theme colors */
}
```

### Testing Dark Mode

In browser DevTools:
1. Open DevTools (F12)
2. Press Ctrl+Shift+P
3. Type "Rendering" → "Emulate CSS media feature prefers-color-scheme"
4. Select "prefers-color-scheme: dark"

All colors are automatically adjusted for dark mode with:
- Higher contrast backgrounds
- Adjusted opacity values
- Enhanced shadows
- Softer glows on interactive elements

---

## Best Practices

### 1. Use CSS Variables, Not Hardcoded Values

❌ **Don't:**
```css
.button {
  padding: 10px 16px;
  background: #667eea;
}
```

✅ **Do:**
```css
.button {
  padding: 0 var(--sp-md);
  background: var(--color-primary);
  min-height: var(--button-height-md);
}
```

### 2. Use Utility Classes for Quick Styling

❌ **Don't:**
```html
<div style="margin-top: 16px; display: flex;">
```

✅ **Do:**
```html
<div class="m-md flex">
```

### 3. Maintain Consistent Spacing

Use the 4px scale consistently:
- `var(--sp-xs)` = 4px
- `var(--sp-sm)` = 8px
- `var(--sp-md)` = 16px
- `var(--sp-lg)` = 24px
- `var(--sp-xl)` = 32px

### 4. Use Semantic HTML

Always use proper semantic elements:

```html
<!-- Good -->
<button class="button button-primary">Click me</button>
<input type="email">
<label for="email">Email</label>
<nav>Navigation</nav>
<main>Content</main>
<footer>Footer</footer>

<!-- Avoid -->
<div class="button">Click me</div>
<span class="input">text</span>
```

### 5. Support Dark Mode

All new components should respect dark mode colors:

```css
.my-component {
  background: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

/* Dark mode automatically inherits through variables */
```

### 6. Test Accessibility

- ✅ Use keyboard to navigate
- ✅ Check focus indicators are visible
- ✅ Test with screen readers
- ✅ Maintain 4.5:1 contrast ratio
- ✅ Don't rely on color alone

### 7. Mobile-First Approach

Design for mobile first, then enhance for larger screens:

```css
/* Mobile (base) */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 8. Component Size Consistency

All components follow consistent height standards:

| Component | Height | Variable |
|-----------|--------|----------|
| Button Small | 32px | `--button-height-sm` |
| Button Medium | 40px | `--button-height-md` |
| Button Large | 48px | `--button-height-lg` |
| Input Small | 32px | `--input-height-sm` |
| Input Medium | 40px | `--input-height-md` |
| Input Large | 48px | `--input-height-lg` |
| Touch Target | 44px | Mobile minimum |

### 9. Icon Usage

Always use Material Icons with consistent sizing:

```html
<!-- Small icon in text -->
<span class="material-icons sm">edit</span>

<!-- Medium icon in button -->
<button class="button button-primary">
  <span class="material-icons">save</span>
  Save
</button>

<!-- Large icon standalone -->
<span class="material-icons lg text-primary">check_circle</span>

<!-- Icon with animation -->
<span class="material-icons spin">refresh</span>
```

### 10. Form Validation Pattern

Always follow this pattern for forms:

```html
<div class="form-group">
  <label class="form-label form-label-required">
    Field Name
  </label>
  <input type="text" required>
  <div class="form-hint">Helper text here</div>
  <div class="form-error" style="display: none;">
    Error message appears here
  </div>
</div>
```

---

## Quick Reference: CSS Variables

### Spacing
```
--sp-xs: 4px
--sp-sm: 8px
--sp-md: 16px
--sp-lg: 24px
--sp-xl: 32px
```

### Colors
```
--color-primary: #667eea (light) / #7c8cff (dark)
--color-success: #4caf50 (light) / #66d966 (dark)
--color-error: #f44336 (light) / #ff6b6b (dark)
--color-text-primary: #1f2937 (light) / #e8ebf0 (dark)
--color-bg: #ffffff (light) / #0f1419 (dark)
```

### Typography
```
--font-size-base: 14px
--font-size-md: 16px
--font-size-lg: 18px
--font-weight-medium: 500
--font-weight-semibold: 600
```

### Sizing
```
--button-height-md: 40px
--input-height-md: 40px
--icon-size-md: 24px
--border-radius-md: 8px
```

### Transitions
```
--transition-fast: 0.15s ease-out
--transition-normal: 0.2s ease-out
--transition-slow: 0.3s ease-out
```

---

## File Organization

Organize component CSS files in this order:

```css
/* 1. Layout & Structure */
.component-container { }

/* 2. Base Styling */
.component { }

/* 3. Variants */
.component.variant-1 { }
.component.variant-2 { }

/* 4. States */
.component:hover { }
.component:focus { }
.component:disabled { }
.component.active { }

/* 5. Responsive */
@media (max-width: 768px) {
  .component { }
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 2, 2026 | Initial UI system launch |

---

## Contributing

When adding new components or utilities:

1. Use CSS variables only (no hardcoded values)
2. Support both light and dark modes
3. Include mobile responsiveness
4. Test with keyboard navigation
5. Document with examples
6. Maintain consistent naming conventions
7. Follow the spacing scale

---

## Support

For questions or issues with the UI system, refer to:
- Component CSS files (src/components.css)
- Interaction patterns (src/interactions.css)
- Utility classes (src/utilities.css)
- Icon system (src/icons.css)