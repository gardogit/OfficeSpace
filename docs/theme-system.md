# Theme System Documentation

## Overview

The Corporate Intranet Dashboard includes a comprehensive light/dark theme system that provides users with the ability to switch between light and dark color schemes. The system is built with accessibility, performance, and user experience in mind.

## Features

### 🌓 Theme Toggle
- **Location**: Replaces the help button in the header
- **Functionality**: Smooth toggle between light and dark themes
- **Animation**: Animated sun/moon icons with smooth transitions
- **Accessibility**: Full keyboard support and screen reader compatibility

### 💾 Persistence
- **localStorage**: User preference is saved and restored on page reload
- **System Preference**: Respects user's system color scheme preference
- **Fallback**: Defaults to light theme if no preference is set

### 🎨 Comprehensive Styling
- **Components**: All UI components support both themes
- **Colors**: Carefully selected color palettes for optimal contrast
- **Transitions**: Smooth color transitions when switching themes
- **WCAG Compliance**: Maintains accessibility standards in both themes

## Implementation

### Theme Context

The theme system is built around a React Context that provides theme state and controls throughout the application:

```typescript
interface ThemeContextType {
  theme: Theme; // 'light' | 'dark'
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
```

### Theme Provider

Wrap your application with the `ThemeProvider` to enable theme functionality:

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourAppContent />
    </ThemeProvider>
  );
}
```

### Using the Theme Hook

Access theme state and controls in any component:

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark-styles' : 'light-styles'}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}
```

## Theme Toggle Component

### Basic Usage

```tsx
import { ThemeToggle } from './components/ui/ThemeToggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Props

```typescript
interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

### Accessibility Features

- **ARIA Labels**: Descriptive labels for current state
- **ARIA Pressed**: Indicates toggle state
- **Keyboard Support**: Full keyboard navigation
- **Screen Reader**: Announces theme changes
- **Focus Management**: Proper focus indicators

## CSS Implementation

### Tailwind Dark Mode

The system uses Tailwind CSS's class-based dark mode:

```css
/* tailwind.config.js */
module.exports = {
  darkMode: 'class',
  // ... other config
}
```

### CSS Variables

Custom CSS variables provide consistent theming:

```css
:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --text-primary: #111827;
  /* ... other variables */
}

.dark {
  /* Dark theme */
  --bg-primary: #111827;
  --text-primary: #f9fafb;
  /* ... other variables */
}
```

### Component Styling

Components use Tailwind's dark mode utilities:

```css
.card {
  @apply bg-white dark:bg-gray-800 
         text-gray-900 dark:text-gray-100
         border-gray-200 dark:border-gray-700;
}
```

## Color Palettes

### Light Theme
- **Background**: White (#ffffff) to Light Gray (#f9fafb)
- **Text**: Dark Gray (#111827) to Medium Gray (#6b7280)
- **Primary**: Blue (#2563eb)
- **Borders**: Light Gray (#e5e7eb)

### Dark Theme
- **Background**: Dark Gray (#111827) to Medium Dark (#1f2937)
- **Text**: Light Gray (#f9fafb) to Medium Light (#d1d5db)
- **Primary**: Light Blue (#3b82f6)
- **Borders**: Medium Dark (#374151)

### Semantic Colors
Both themes maintain consistent semantic colors:
- **Success**: Green variants
- **Warning**: Yellow/Orange variants
- **Error**: Red variants

## System Integration

### System Preference Detection

The theme system automatically detects and respects the user's system color scheme preference:

```typescript
// Detects system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listens for changes
mediaQuery.addEventListener('change', handleSystemThemeChange);
```

### localStorage Persistence

User preferences are automatically saved and restored:

```typescript
// Save preference
localStorage.setItem('theme', 'dark');

// Restore on load
const savedTheme = localStorage.getItem('theme');
```

### Document Class Management

The system manages the `dark` class on the document element:

```typescript
// Apply dark theme
document.documentElement.classList.add('dark');

// Apply light theme
document.documentElement.classList.remove('dark');
```

## Testing

### Theme Tests

Comprehensive test suite covers:
- Theme provider functionality
- Theme toggle component behavior
- Persistence mechanisms
- System preference detection
- Accessibility features

### Running Tests

```bash
npm run test:run src/test/theme.test.tsx
```

### Test Coverage

- ✅ Theme context provider
- ✅ Theme toggle component
- ✅ localStorage persistence
- ✅ System preference detection
- ✅ Accessibility compliance
- ✅ CSS class management
- ✅ Component integration

## Accessibility

### WCAG Compliance

- **Color Contrast**: Both themes meet WCAG 2.1 AA standards
- **Focus Indicators**: Visible focus rings in both themes
- **Screen Reader Support**: Proper announcements for theme changes
- **Keyboard Navigation**: Full keyboard accessibility

### Screen Reader Support

The theme toggle provides comprehensive screen reader support:

```tsx
<button
  aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
  aria-pressed={isDark}
  title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
>
  {/* Icon content */}
  <span className="sr-only">
    {isDark ? 'Tema oscuro activo' : 'Tema claro activo'}
  </span>
</button>
```

## Performance

### Optimizations

- **CSS Variables**: Efficient color switching without re-rendering
- **Class-based**: Tailwind's class-based approach for optimal performance
- **Minimal Re-renders**: Context optimized to prevent unnecessary updates
- **Smooth Transitions**: Hardware-accelerated CSS transitions

### Bundle Size

The theme system adds minimal overhead:
- **Context**: ~2KB
- **Components**: ~3KB
- **CSS**: Integrated with existing styles

## Browser Support

### Supported Browsers
- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Fallbacks
- **localStorage**: Graceful degradation if not available
- **matchMedia**: Falls back to light theme if not supported
- **CSS Variables**: Fallback values provided

## Migration Guide

### From Existing Components

To add theme support to existing components:

1. **Add dark mode classes**:
```tsx
// Before
<div className="bg-white text-gray-900">

// After
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

2. **Use theme context**:
```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  // Use theme value for conditional logic
}
```

3. **Update CSS variables**:
```css
/* Add dark theme variants */
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

## Best Practices

### Component Development

1. **Always include dark variants** for background and text colors
2. **Test both themes** during development
3. **Use semantic color names** instead of specific colors
4. **Maintain contrast ratios** in both themes

### CSS Guidelines

1. **Use Tailwind dark: prefix** for dark mode styles
2. **Group related styles** together
3. **Test color combinations** for accessibility
4. **Use CSS variables** for complex color logic

### Performance Tips

1. **Avoid inline styles** that depend on theme
2. **Use CSS transitions** for smooth theme switching
3. **Minimize context re-renders** by memoizing values
4. **Leverage Tailwind's purging** to remove unused styles

## Troubleshooting

### Common Issues

1. **Theme not persisting**: Check localStorage availability
2. **Styles not updating**: Ensure dark class is applied to document
3. **Flash of wrong theme**: Implement theme detection before render
4. **Accessibility issues**: Test with screen readers and keyboard navigation

### Debug Tools

1. **React DevTools**: Inspect theme context state
2. **Browser DevTools**: Check document classes and CSS variables
3. **Accessibility Tools**: Verify contrast ratios and ARIA attributes
4. **Console Logs**: Monitor theme changes and persistence

## Future Enhancements

### Planned Features

- **Multiple Themes**: Support for additional color schemes
- **Theme Customization**: User-defined color preferences
- **Automatic Switching**: Time-based theme switching
- **High Contrast Mode**: Enhanced accessibility option

### API Extensions

- **Theme Events**: Callbacks for theme changes
- **Theme Presets**: Predefined theme configurations
- **Component Theming**: Per-component theme overrides
- **Animation Controls**: Customizable transition settings