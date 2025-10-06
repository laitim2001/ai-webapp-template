# UI Design System

Complete UI design system with color palette, components, and styling guidelines.

## 📋 Overview

This design system provides a comprehensive set of UI components and styling utilities based on:

- **Tailwind CSS 3**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **CSS Variables**: Dynamic theming support
- **Dark Mode**: Full dark mode support

## 🎨 Color System

### Color Palette (HSL Format)

The color system uses HSL (Hue, Saturation, Lightness) format for better color manipulation and theme switching.

#### Light Mode Colors

```css
/* Base Colors */
--background: 0 0% 100%;           /* Pure white background */
--foreground: 222.2 84% 4.9%;     /* Deep blue-gray text */

/* Primary Brand Color */
--primary: 221.2 83.2% 53.3%;     /* Blue (#3B82F6) */
--primary-foreground: 210 40% 98%; /* Near white text */

/* Secondary Color */
--secondary: 210 40% 96%;          /* Light gray-blue */
--secondary-foreground: 222.2 84% 4.9%; /* Deep blue-gray text */

/* Muted Color (Low Contrast) */
--muted: 210 40% 96%;              /* Light gray */
--muted-foreground: 215.4 16.3% 46.9%; /* Medium gray */

/* Accent Color */
--accent: 210 40% 96%;             /* Light gray */
--accent-foreground: 222.2 84% 4.9%; /* Deep blue-gray */

/* Destructive (Error/Delete) */
--destructive: 0 84.2% 60.2%;      /* Red */
--destructive-foreground: 210 40% 98%; /* White text */

/* UI Elements */
--border: 214.3 31.8% 91.4%;       /* Light gray border */
--input: 214.3 31.8% 91.4%;        /* Input border */
--ring: 221.2 83.2% 53.3%;         /* Focus ring - primary blue */

/* Component Colors */
--card: 0 0% 100%;                /* White card background */
--card-foreground: 222.2 84% 4.9%; /* Dark text */
--popover: 0 0% 100%;             /* White popover */
--popover-foreground: 222.2 84% 4.9%; /* Dark text */
```

#### Dark Mode Colors

```css
/* Base Colors */
--background: 222.2 84% 4.9%;      /* Deep blue-gray background */
--foreground: 210 40% 98%;         /* Near white text */

/* Primary Brand Color */
--primary: 217.2 91.2% 59.8%;     /* Bright blue */
--primary-foreground: 222.2 84% 4.9%; /* Dark text */

/* Secondary Color */
--secondary: 217.2 32.6% 17.5%;   /* Deep blue */
--secondary-foreground: 210 40% 98%; /* Near white text */

/* Muted Color */
--muted: 217.2 32.6% 17.5%;       /* Deep blue */
--muted-foreground: 215 20.2% 65.1%; /* Medium-light gray */

/* Accent Color */
--accent: 217.2 32.6% 17.5%;      /* Deep blue */
--accent-foreground: 210 40% 98%; /* Near white */

/* Destructive */
--destructive: 0 62.8% 30.6%;     /* Dark red */
--destructive-foreground: 210 40% 98%; /* White text */

/* UI Elements */
--border: 217.2 32.6% 17.5%;      /* Deep blue border */
--input: 217.2 32.6% 17.5%;       /* Input border */
--ring: 224.3 76.3% 94.1%;        /* Light blue-white focus ring */
```

### Color Usage

```tsx
// Using color variables in components
<div className="bg-primary text-primary-foreground">
  Primary Button
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary Button
</div>

<div className="bg-destructive text-destructive-foreground">
  Delete Button
</div>

<div className="bg-muted text-muted-foreground">
  Muted Content
</div>
```

## 🎯 Border Radius System

```css
--radius: 0.5rem; /* 8px default radius */
```

**Tailwind Classes**:
- `rounded-lg`: `var(--radius)` (8px)
- `rounded-md`: `calc(var(--radius) - 2px)` (6px)
- `rounded-sm`: `calc(var(--radius) - 4px)` (4px)

## 📦 UI Components (23 Components)

### Form Components

1. **Button** (`button.tsx.template`)
   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon
   - Full keyboard navigation and accessibility

2. **Input** (`input.tsx.template`)
   - Text input with consistent styling
   - Focus states and validation support

3. **Textarea** (`textarea.tsx.template`)
   - Multi-line text input
   - Auto-resize support

4. **Checkbox** (`checkbox.tsx.template`)
   - Accessible checkbox component
   - Custom styling with Radix UI

5. **Switch** (`switch.tsx.template`)
   - Toggle switch component
   - Smooth animations

6. **Slider** (`slider.tsx.template`)
   - Range slider component
   - Customizable min/max values

7. **Select** (`select.tsx.template`)
   - Dropdown selection component
   - Search and keyboard navigation

8. **Label** (`label.tsx.template`)
   - Form label component
   - Associated with form inputs

### Layout Components

9. **Card** (`card.tsx.template`)
   - Container component
   - Header, content, footer sections

10. **Separator** (`separator.tsx.template`)
    - Horizontal/vertical dividers
    - Customizable orientation

11. **Tabs** (`tabs.tsx.template`)
    - Tab navigation component
    - Content switching

### Feedback Components

12. **Alert** (`alert.tsx.template`)
    - Notification component
    - Variants: default, destructive

13. **Alert Dialog** (`alert-dialog.tsx.template`)
    - Modal confirmation dialogs
    - Action buttons

14. **Dialog** (`dialog.tsx.template`)
    - Modal dialog component
    - Overlay and close button

15. **Progress** (`progress.tsx.template`)
    - Progress bar component
    - Percentage display

16. **Skeleton** (`skeleton.tsx.template`)
    - Loading placeholder
    - Shimmer animation

17. **Error Display** (`error-display.tsx.template`)
    - Error message component
    - Stack trace display

### Overlay Components

18. **Dropdown Menu** (`dropdown-menu.tsx.template`)
    - Context menu component
    - Nested menu support

19. **Popover** (`popover.tsx.template`)
    - Floating content container
    - Trigger-based positioning

20. **Command** (`command.tsx.template`)
    - Command palette component
    - Keyboard shortcuts

### Display Components

21. **Avatar** (`avatar.tsx.template`)
    - User avatar component
    - Fallback text support

22. **Badge** (`badge.tsx.template`)
    - Small status indicator
    - Variants: default, secondary, destructive, outline

### Utilities

23. **Toast** (`use-toast.ts.template`)
    - Toast notification hook
    - Queue management

## 🎬 Animations

### Accordion Animations

```css
/* Accordion expand */
@keyframes accordion-down {
  from { height: 0 }
  to { height: var(--radix-accordion-content-height) }
}

/* Accordion collapse */
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height) }
  to { height: 0 }
}
```

**Tailwind Classes**:
- `animate-accordion-down`: Expand animation (0.2s ease-out)
- `animate-accordion-up`: Collapse animation (0.2s ease-out)

## 📐 Container System

```javascript
container: {
  center: true,           // Auto-center containers
  padding: "2rem",        // 32px left/right padding
  screens: {
    "2xl": "1400px",      // Max width on 2xl screens
  },
}
```

## 🌙 Dark Mode

**Activation**: Add `dark` class to HTML element

```tsx
// Example: Dark mode toggle
<html className={isDark ? 'dark' : ''}>
  <body>
    {/* Content automatically adapts to dark mode */}
  </body>
</html>
```

## 📋 Component Usage Examples

### Button

```tsx
import { Button } from '@/components/ui/button';

// Primary button
<Button>Click Me</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// Small size
<Button size="sm">Small Button</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input with Label

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

<Alert>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong.
  </AlertDescription>
</Alert>
```

### Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 🎨 Customization

### Changing Primary Color

Update the CSS variables in `globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Default blue */
  /* Change to green: */
  --primary: 142 71% 45%;
}
```

### Adding Custom Colors

Update `tailwind.config.js`:

```javascript
extend: {
  colors: {
    brand: {
      DEFAULT: "hsl(var(--brand))",
      foreground: "hsl(var(--brand-foreground))",
    }
  }
}
```

Then add to `globals.css`:

```css
:root {
  --brand: 280 100% 70%;
  --brand-foreground: 0 0% 100%;
}
```

## 🔧 Installation

### Required Dependencies

```bash
npm install tailwindcss tailwindcss-animate
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label
npm install @radix-ui/react-popover
npm install @radix-ui/react-progress
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-slider
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
```

### Setup

1. Copy `globals.css.template` to `app/globals.css`
2. Copy `tailwind.config.js.template` to root
3. Copy all components from `components/ui/` to your project
4. Import globals.css in root layout

```tsx
// app/layout.tsx
import '@/app/globals.css';
```

## 📝 Best Practices

1. **Always use CSS variables** - Ensures theme consistency
2. **Prefer Tailwind classes** - Use `className` with Tailwind utilities
3. **Use semantic colors** - `primary`, `secondary`, `destructive` instead of specific colors
4. **Component composition** - Build complex UIs from simple components
5. **Accessibility first** - All components support keyboard navigation and screen readers
6. **Dark mode support** - Test all components in both light and dark modes

## 🔍 Component File Sizes

Total: **23 components**, ~121 KB

- alert.tsx: 6 KB
- alert-dialog.tsx: 4.5 KB
- avatar.tsx: 5.5 KB
- badge.tsx: 5 KB
- button.tsx: 5.3 KB
- card.tsx: 5 KB
- checkbox.tsx: 1.3 KB
- command.tsx: 5 KB
- dialog.tsx: 4 KB
- dropdown-menu.tsx: 11.6 KB
- error-display.tsx: 10.3 KB
- input.tsx: 4.5 KB
- label.tsx: 4 KB
- popover.tsx: 1.3 KB
- progress.tsx: 1 KB
- select.tsx: 10.4 KB
- separator.tsx: 1 KB
- skeleton.tsx: 0.4 KB
- slider.tsx: 1.3 KB
- switch.tsx: 5.9 KB
- tabs.tsx: 4.7 KB
- textarea.tsx: 7 KB
- use-toast.ts: 0.2 KB

## 📄 License

Part of AI Web App Template v5.0
