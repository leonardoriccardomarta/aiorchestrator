# AI Orchestrator Design System

A comprehensive design system for the AI Orchestrator platform, built with React, TypeScript, and Tailwind CSS. This design system provides consistent, accessible, and beautiful components for building world-class user experiences.

## 🎨 Design Principles

### Accessibility First
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast support
- Focus management

### Mobile-First
- Responsive design
- Touch-friendly interfaces
- Progressive enhancement
- Performance optimization

### Consistency
- Unified design tokens
- Consistent spacing
- Standardized typography
- Cohesive color palette

## 🏗️ Architecture

### Design Tokens
All design tokens are defined in `src/styles/design-tokens.css`:
- **Colors**: Primary, secondary, accent, semantic colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation and depth
- **Border Radius**: Rounded corners
- **Animations**: Transitions and micro-interactions

### Component Structure
```
src/components/ui/design-system/
├── Button.tsx          # Button component with variants
├── Input.tsx           # Input component with validation
├── Typography.tsx      # Typography system
├── Icon.tsx            # Icon component
├── ThemeProvider.tsx   # Theme management
└── README.md          # This documentation
```

## 🧩 Components

### Button
A versatile button component with multiple variants, sizes, and accessibility features.

```tsx
import { Button } from './design-system/Button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary" size="lg">Large Primary</Button>
<Button variant="outline" size="sm">Small Outline</Button>

// With icons
<Button leftIcon={<HomeIcon />}>Go Home</Button>
<Button rightIcon={<ArrowRightIcon />}>Continue</Button>

// Loading state
<Button loading loadingText="Saving...">Save Changes</Button>

// Accessibility
<Button aria-label="Close dialog">×</Button>
```

**Variants**: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `gradient`, `premium`

**Sizes**: `sm`, `default`, `lg`, `xl`, `icon`, `icon-sm`, `icon-lg`, `icon-xl`

### Input
A flexible input component with validation states, icons, and accessibility features.

```tsx
import { Input } from './design-system/Input';

// Basic usage
<Input placeholder="Enter text..." />

// With validation
<Input 
  error="This field is required"
  placeholder="Email"
  type="email"
/>

// With icons
<Input 
  leftIcon={<MailIcon />}
  rightIcon={<EyeIcon />}
  type="password"
  placeholder="Password"
/>

// With helper text
<Input 
  helperText="Must be at least 8 characters"
  placeholder="Password"
  type="password"
/>
```

**Validation States**: `default`, `error`, `success`, `warning`

**Sizes**: `sm`, `default`, `lg`

### Typography
A comprehensive typography system with consistent font sizes, weights, and colors.

```tsx
import { Typography, H1, H2, Body, Caption } from './design-system/Typography';

// Using the main component
<Typography variant="h1" color="primary">Main Title</Typography>

// Using convenience components
<H1>Heading 1</H1>
<H2>Heading 2</H2>
<Body>Body text with normal line height</Body>
<Caption>Small caption text</Caption>

// With variants
<Typography variant="body-lg" weight="semibold" align="center">
  Large, bold, centered text
</Typography>
```

**Variants**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body`, `body-lg`, `body-sm`, `caption`, `caption-sm`, `display-1`, `display-2`, `display-3`, `lead`, `small`, `tiny`

**Colors**: `default`, `muted`, `primary`, `secondary`, `accent`, `success`, `warning`, `error`

**Weights**: `normal`, `medium`, `semibold`, `bold`, `extrabold`

### Icon
A flexible icon component with consistent sizing, colors, and accessibility features.

```tsx
import { Icon } from './design-system/Icon';
import { HomeIcon } from 'lucide-react';

// Basic usage
<Icon icon={HomeIcon} />

// With accessibility
<Icon icon={HomeIcon} title="Home" />

// With description for screen readers
<Icon 
  icon={HomeIcon} 
  title="Home"
  description="Navigate to the home page"
/>

// Decorative icon (hidden from screen readers)
<Icon icon={HeartIcon} decorative />

// With variants
<Icon icon={HomeIcon} size="lg" color="primary" />
```

**Sizes**: `xs`, `sm`, `default`, `lg`, `xl`, `2xl`, `3xl`

**Colors**: `default`, `muted`, `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `white`, `black`

**Weights**: `thin`, `light`, `normal`, `medium`, `semibold`, `bold`

## 🎨 Theming

### Theme Provider
The design system supports light and dark themes with automatic switching.

```tsx
import { ThemeProvider } from './design-system/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Custom Themes
You can create custom themes by extending the design tokens:

```css
/* Custom theme */
[data-theme="custom"] {
  --color-primary-500: #your-color;
  --color-secondary-500: #your-color;
  /* ... other custom tokens */
}
```

## ♿ Accessibility

### WCAG 2.1 AA Compliance
All components are built with accessibility in mind:

- **Semantic HTML**: Proper use of HTML elements
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets WCAG AA standards
- **Screen Reader Support**: Proper ARIA attributes

### Best Practices

1. **Always provide labels**: Use `aria-label` or associated labels
2. **Test with screen readers**: Ensure proper navigation
3. **Keyboard testing**: Verify all interactions work with keyboard
4. **Color contrast**: Use the provided color tokens
5. **Focus indicators**: Don't remove focus styles

## 📱 Responsive Design

### Mobile-First Approach
All components are designed mobile-first with responsive breakpoints:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Touch-Friendly
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Gesture support where appropriate

## 🚀 Performance

### Optimization Strategies
- **Tree shaking**: Only import what you need
- **Lazy loading**: Load components on demand
- **CSS-in-JS**: Minimal runtime overhead
- **Bundle optimization**: Small component sizes

### Best Practices
1. **Import only needed components**
2. **Use React.memo for expensive components**
3. **Optimize images and icons**
4. **Minimize bundle size**

## 🧪 Testing

### Storybook
All components have comprehensive Storybook stories:

```bash
npm run storybook
```

### Accessibility Testing
- Automated testing with axe-core
- Manual testing with screen readers
- Keyboard navigation testing
- Color contrast validation

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

## 📚 Usage Guidelines

### When to Use Each Component

**Button**
- Primary actions: Use `variant="default"`
- Secondary actions: Use `variant="secondary"`
- Destructive actions: Use `variant="destructive"`
- Navigation: Use `variant="link"`

**Input**
- Text input: Use `type="text"`
- Email input: Use `type="email"` with validation
- Password input: Use `type="password"` with visibility toggle
- Search: Use `type="search"` with search icon

**Typography**
- Page titles: Use `variant="h1"`
- Section headers: Use `variant="h2"` or `variant="h3"`
- Body text: Use `variant="body"`
- Captions: Use `variant="caption"`

**Icon**
- Decorative: Use `decorative={true}`
- Interactive: Provide `title` and `aria-label`
- Status indicators: Use semantic colors

### Do's and Don'ts

**Do:**
- ✅ Use semantic HTML elements
- ✅ Provide proper ARIA labels
- ✅ Test with keyboard navigation
- ✅ Use design tokens for consistency
- ✅ Follow mobile-first approach

**Don't:**
- ❌ Remove focus indicators
- ❌ Use color alone to convey information
- ❌ Create custom components without checking existing ones
- ❌ Ignore accessibility requirements
- ❌ Use hardcoded values instead of design tokens

## 🔧 Development

### Adding New Components

1. **Create the component** in `src/components/ui/design-system/`
2. **Add variants** in `src/components/ui/variants/`
3. **Create Storybook stories** with examples
4. **Add tests** for functionality and accessibility
5. **Update documentation** in this README

### Design Token Updates

1. **Update tokens** in `src/styles/design-tokens.css`
2. **Test across themes** (light/dark)
3. **Verify accessibility** (color contrast)
4. **Update components** that use the tokens

### Contributing

1. Follow the existing code style
2. Add comprehensive tests
3. Include Storybook stories
4. Update documentation
5. Ensure accessibility compliance

## 📖 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)

## 🎯 Roadmap

- [ ] More form components (Select, Checkbox, Radio)
- [ ] Data display components (Table, Card, List)
- [ ] Navigation components (Breadcrumb, Pagination)
- [ ] Feedback components (Toast, Alert, Modal)
- [ ] Layout components (Grid, Container, Divider)
- [ ] Advanced theming system
- [ ] Animation system
- [ ] Internationalization support

---

**Built with ❤️ for the AI Orchestrator platform**