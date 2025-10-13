import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { 
  HomeIcon, 
  ArrowRightIcon, 
  DownloadIcon,
  SettingsIcon,
  UserIcon,
  BellIcon,
  SearchIcon
} from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and accessibility features. Supports loading states, icons, and tooltips.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'gradient', 'premium'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg', 'icon-xl'],
      description: 'The size of the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
    },
    rounded: {
      control: 'select',
      options: ['default', 'full', 'none'],
      description: 'The border radius style',
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show a loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip text to display on hover',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Button Stories
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: 'Gradient Button',
  },
};

export const Premium: Story = {
  args: {
    variant: 'premium',
    children: 'Premium Feature',
  },
};

// Size Variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Button',
  },
};

// Icon Buttons
export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <SettingsIcon className="h-4 w-4" />,
    'aria-label': 'Settings',
  },
};

export const IconButtonSmall: Story = {
  args: {
    size: 'icon-sm',
    children: <UserIcon className="h-3 w-3" />,
    'aria-label': 'User',
  },
};

export const IconButtonLarge: Story = {
  args: {
    size: 'icon-lg',
    children: <BellIcon className="h-5 w-5" />,
    'aria-label': 'Notifications',
  },
};

// Buttons with Icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <HomeIcon className="h-4 w-4" />,
    children: 'Go Home',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRightIcon className="h-4 w-4" />,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <DownloadIcon className="h-4 w-4" />,
    rightIcon: <ArrowRightIcon className="h-4 w-4" />,
    children: 'Download & Continue',
  },
};

// Loading States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const LoadingWithText: Story = {
  args: {
    loading: true,
    loadingText: 'Saving...',
    children: 'Save Changes',
  },
};

// Disabled States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const DisabledLoading: Story = {
  args: {
    disabled: true,
    loading: true,
    children: 'Processing...',
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Rounded Variants
export const Rounded: Story = {
  args: {
    rounded: 'full',
    children: 'Rounded Button',
  },
};

export const NoRounded: Story = {
  args: {
    rounded: 'none',
    children: 'No Border Radius',
  },
};

// Tooltip Examples
export const WithTooltip: Story = {
  args: {
    tooltip: 'This button performs an important action',
    children: 'Important Action',
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    children: 'Click me!',
    onClick: () => alert('Button clicked!'),
  },
};

// Accessibility Examples
export const WithAriaLabel: Story = {
  args: {
    'aria-label': 'Search for content',
    children: <SearchIcon className="h-4 w-4" />,
    size: 'icon',
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="premium">Premium</Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Sizes Grid
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="icon"><SettingsIcon className="h-4 w-4" /></Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Dark Mode Examples
export const DarkMode: Story = {
  render: () => (
    <div className="dark p-4 bg-gray-900 rounded-lg">
      <div className="space-y-4">
        <Button variant="default">Default (Dark)</Button>
        <Button variant="secondary">Secondary (Dark)</Button>
        <Button variant="outline">Outline (Dark)</Button>
        <Button variant="ghost">Ghost (Dark)</Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};