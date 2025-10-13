import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { SearchIcon, MailIcon, LockIcon, UserIcon, EyeIcon } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with multiple variants, states, and accessibility features. Supports icons, validation states, and various input types.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
      description: 'The type of input',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The size of the input',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'The visual style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    leftIcon: {
      control: 'boolean',
      description: 'Whether to show a left icon',
    },
    rightIcon: {
      control: 'boolean',
      description: 'Whether to show a right icon',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Input Stories
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="input-with-label" className="text-sm font-medium">
        Email Address
      </label>
      <Input
        id="input-with-label"
        type="email"
        placeholder="Enter your email"
        leftIcon={<MailIcon className="h-4 w-4" />}
      />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="input-with-description" className="text-sm font-medium">
        Username
      </label>
      <Input
        id="input-with-description"
        placeholder="Enter your username"
        leftIcon={<UserIcon className="h-4 w-4" />}
        helperText="Username must be at least 3 characters long"
      />
    </div>
  ),
};

// Size Variants
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// Input Types
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
    leftIcon: <MailIcon className="h-4 w-4" />,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    leftIcon: <LockIcon className="h-4 w-4" />,
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    leftIcon: <SearchIcon className="h-4 w-4" />,
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: 'Enter phone number',
  },
};

export const Url: Story = {
  args: {
    type: 'url',
    placeholder: 'Enter URL',
  },
};

export const Date: Story = {
  args: {
    type: 'date',
  },
};

export const Time: Story = {
  args: {
    type: 'time',
  },
};

// Validation States
export const Error: Story = {
  args: {
    error: 'This field is required',
    placeholder: 'Error state',
    defaultValue: 'Invalid input',
  },
};

export const Success: Story = {
  args: {
    success: 'Input is valid',
    placeholder: 'Success state',
    defaultValue: 'Valid input',
  },
};

export const Warning: Story = {
  args: {
    warning: 'Please review this input',
    placeholder: 'Warning state',
    defaultValue: 'Warning input',
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    defaultValue: 'Cannot edit',
  },
};

// Required State
export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field',
  },
  render: (args: StoryObj<typeof meta>) => (
    <div className="space-y-2">
      <label htmlFor="required-input" className="text-sm font-medium">
        Required Field <span className="text-red-500">*</span>
      </label>
      <Input id="required-input" {...args} />
    </div>
  ),
};

// Icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <SearchIcon className="h-4 w-4" />,
    placeholder: 'Search with icon',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <EyeIcon className="h-4 w-4" />,
    type: 'password',
    placeholder: 'Password with visibility toggle',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <MailIcon className="h-4 w-4" />,
    rightIcon: <EyeIcon className="h-4 w-4" />,
    type: 'password',
    placeholder: 'Email password',
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    placeholder: 'Type something...',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => console.log('Input changed:', e.target.value),
  },
};

// Form Examples
export const LoginForm: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<MailIcon className="h-4 w-4" />}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          leftIcon={<LockIcon className="h-4 w-4" />}
          rightIcon={<EyeIcon className="h-4 w-4" />}
          required
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const SearchForm: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
        <Input
          id="search"
          type="search"
          placeholder="Search for anything..."
          leftIcon={<SearchIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Input placeholder="Default variant" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Error</label>
        <Input error="This field has an error" placeholder="Error variant" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Success</label>
        <Input success="This field is valid" placeholder="Success variant" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Warning</label>
        <Input warning="Please review this input" placeholder="Warning variant" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Sizes Grid
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Small</label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Input placeholder="Default size" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Large</label>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All States Grid
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Input placeholder="Default state" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Error</label>
        <Input error="This field is required" placeholder="Error state" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Success</label>
        <Input success="Input is valid" placeholder="Success state" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Warning</label>
        <Input warning="Please review this input" placeholder="Warning state" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Disabled</label>
        <Input disabled placeholder="Disabled state" />
      </div>
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Email (Dark)</label>
          <Input
            type="email"
            placeholder="Enter your email"
            leftIcon={<MailIcon className="h-4 w-4" />}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Password (Dark)</label>
          <Input
            type="password"
            placeholder="Enter your password"
            leftIcon={<LockIcon className="h-4 w-4" />}
            rightIcon={<EyeIcon className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};