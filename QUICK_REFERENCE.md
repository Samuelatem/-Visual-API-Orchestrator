# Visual API Orchestrator — Quick Reference Card

[← Back to Full Documentation](IMPLEMENTATION_SUMMARY.md)

## CSS Variables Quick Lookup

### Spacing (use for margin, padding, gaps)
```
--sp-xs: 4px    --sp-sm: 8px    --sp-md: 16px    --sp-lg: 24px    --sp-xl: 32px
```

### Colors
```
Primary:  --color-primary (#667eea light / #7c8cff dark)
Success:  --color-success (#4caf50 light / #66d966 dark)
Error:    --color-error (#f44336 light / #ff6b6b dark)
Bg:       --color-bg (white / #0f1419 dark)
Text:     --color-text-primary (dark gray / #e8ebf0 dark)
```

### Typography
```
Size:   --font-size-{xs,sm,base,md,lg,xl,2xl,3xl,4xl}
Weight: --font-weight-{regular:400, medium:500, semibold:600, bold:700}
Family: --font-family-base, --font-family-mono
```

### Components
```
Heights:  --button-height-{sm:32px, md:40px, lg:48px}
Radius:   --radius-{xs:2px, sm:4px, md:8px, lg:12px}
Shadow:   --shadow-{xs, sm, md, lg, xl}
Transition: --transition-{fast:0.15s, normal:0.2s, slow:0.3s}
```

---

## HTML Component Patterns

### Button
```html
<button class="button button-primary">Save</button>
<button class="button button-secondary button-lg">Cancel</button>
<button class="button button-danger" disabled>Delete</button>
<button class="button button-primary loading">Processing...</button>
```

### Form Group
```html
<div class="form-group">
  <label class="form-label form-label-required">Name</label>
  <input type="text" placeholder="Your name">
  <div class="form-hint">Enter your full name</div>
</div>
```

### Card
```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content here</div>
  <div class="card-footer">
    <button class="button button-secondary">Cancel</button>
    <button class="button button-primary">Save</button>
  </div>
</div>
```

### Alert
```html
<div class="alert alert-success">
  <div class="alert-icon"><span class="material-icons">check_circle</span></div>
  <div class="alert-content">
    <div class="alert-title">Success!</div>
    <div class="alert-message">Operation completed</div>
  </div>
</div>
```

### Grid Layout
```html
<div class="grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<div class="grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Flex Layout
```html
<div class="flex gap-md">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

<div class="flex flex-between">
  <h2>Title</h2>
  <button>Action</button>
</div>

<div class="flex flex-center">
  <span class="material-icons">check</span>
  Success
</div>
```

---

## Utility Classes

### Spacing
```
.m-xs .m-sm .m-md .m-lg .m-xl          (margin all sides)
.p-xs .p-sm .p-md .p-lg .p-xl          (padding all sides)
.mx-auto .my-auto                        (auto centering)
```

### Text
```
.text-primary .text-secondary .text-error
.text-bold .text-italic
.text-center .text-left .text-right
.truncate .line-clamp-2
```

### Colors
```
.text-primary      (primary text color)
.bg-light          (light background)
.border-primary    (primary border color)
```

### Shadow & Border
```
.shadow-sm .shadow-md .shadow-lg
.border .border-top .border-right
.rounded .rounded-md .rounded-lg
```

### Display
```
.flex .flex-col .flex-center .flex-between
.grid-2 .grid-3 .grid-4
.hidden .block .inline-block
```

---

## Icon Usage

### Sizing
```html
<span class="material-icons xs">edit</span>        <!-- 16px -->
<span class="material-icons sm">save</span>       <!-- 20px -->
<span class="material-icons md">delete</span>     <!-- 24px (default) -->
<span class="material-icons lg">check_circle</span><!-- 32px -->
```

### Colors
```html
<span class="material-icons text-primary">edit</span>
<span class="material-icons text-success">check</span>
<span class="material-icons text-error">warning</span>
```

### Animations
```html
<span class="material-icons spin">refresh</span>     <!-- Spinning -->
<span class="material-icons pulse">settings</span>   <!-- Pulsing -->
<span class="material-icons bounce">arrow_down</span><!-- Bouncing -->
```

---

## Theme Toggle

### Using the Hook
```typescript
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </>
  );
}
```

### Manual Override
```html
<!-- Force dark mode on any element -->
<div style="--color-bg: #0f1419;">Content</div>

<!-- The app root handles this automatically -->
<html data-theme="dark"> <!-- automatic -->
```

---

## Dark Mode Testing

### In Browser DevTools
1. Open DevTools (F12)
2. Ctrl+Shift+P → Type "Rendering"
3. Select "Emulate CSS media feature prefers-color-scheme"
4. Choose "dark" or "light"

### In App
- Click theme toggle button (top-right of header)
- Cycles: Light → Dark → System → Light
- Preference saved to localStorage

---

## Common Patterns

### Centered Container
```html
<div class="flex flex-center">
  <p>Center this text</p>
</div>
```

### Space Between Header & Content
```html
<header>Title</header>
<main class="mt-lg">Content</main>
```

### Button Group
```html
<div class="flex gap-sm">
  <button class="button button-secondary">Cancel</button>
  <button class="button button-primary">Save</button>
</div>
```

### Form Layout
```html
<form class="flex flex-col gap-md">
  <div class="form-group">
    <label>Name</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Email</label>
    <input type="email">
  </div>
  <button class="button button-primary">Submit</button>
</form>
```

### Card Grid
```html
<div class="grid-3">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

---

## CSS Best Practices

✅ **Always use variables**
```css
/* Good */
padding: var(--sp-md);
background: var(--color-primary);
```

❌ **Never hardcode values**
```css
/* Bad */
padding: 16px;
background: #667eea;
```

✅ **Use utility classes short**
```html
<div class="flex gap-md">content</div>
```

❌ **Don't write custom CSS for layout**
```css
/* Bad */
.my-layout { display: flex; gap: 16px; ... }
```

✅ **Let dark mode work automatically**
```css
color: var(--color-text-primary);
/* Automatically light or dark based on theme */
```

❌ **Don't override theme in component CSS**
```css
/* Bad - breaks dark mode */
.my-button { background: #667eea !important; }
```

---

## File Locations

| What | Where |
|------|-------|
| Design Tokens | `src/variables.css` |
| Button Styles | `src/components.css` (line 50-200) |
| Form Styles | `src/components.css` (line 200-350) |
| Utilities | `src/utilities.css` |
| Dark Mode | `src/dark-mode.css` |
| Icons | `src/icons.css` |
| Theme Hook | `src/hooks/useTheme.ts` |
| Theme Toggle Component | `src/components/ThemeToggle.tsx` |

---

## Troubleshooting

### "Colors not changing in dark mode"
→ Check: Did you use `var(--color-*)` in your CSS?  
→ Solution: Replace hardcoded colors with CSS variables

### "Button doesn't have the right height"
→ Check: Is it using `--button-height-*` or a custom height?  
→ Solution: Use `min-height: var(--button-height-md)` 

### "Spacing is inconsistent"
→ Check: Are you using margins/paddings directly?  
→ Solution: Use utility classes (`.m-md`, `.p-md`) or variables

### "Dark mode not activating"
→ Check: Did you toggle the theme button?  
→ Solution: Click the sun/moon icon in the header

### "Custom CSS not applying"
→ Check: Is it being overridden by another rule?  
→ Solution: Check cascade order in `App.css` (utilities come before dark-mode)

---

## Performance Tips

- Use system fonts (already included) — no font downloads
- Dark mode works with browser media query — no JS runtime cost
- CSS variables cached by browser — efficient theming
- Utility-first approach reduces CSS needed — smaller files
- Vite handles minification and CSS purging automatically

---

## Links

- [Full Documentation](IMPLEMENTATION_SUMMARY.md)
- [Style Guide](UI_STYLE_GUIDE.md)
- [Design Variables](src/variables.css)
- [Light Theme](src/index.css)
- [Dark Theme](src/dark-mode.css)

---

**Quick Ref v1.0** | April 2, 2026 | Updated ✅
