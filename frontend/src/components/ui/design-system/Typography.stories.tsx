import type { Meta, StoryObj } from '@storybook/react';
import { 
  Typography, 
  H1, 
  H2, 
  H3, 
  H4, 
  H5, 
  H6, 
  Body, 
  BodySmall as BodySmallComp, 
  BodyLarge as BodyLargeComp, 
  Caption as CaptionComp, 
  CaptionSmall as CaptionSmallComp 
} from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive typography system with consistent font sizes, weights, colors, and alignment options. Includes convenience components for common use cases.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'body', 'body-lg', 'body-sm',
        'caption', 'caption-sm',
        'display-1', 'display-2', 'display-3',
        'lead', 'small', 'tiny'
      ],
      description: 'The typography variant',
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'accent', 'success', 'warning', 'error'],
      description: 'The text color',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
      description: 'The font weight',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'The text alignment',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate long text',
    },
    noWrap: {
      control: 'boolean',
      description: 'Whether to prevent text wrapping',
    },
    breakWords: {
      control: 'boolean',
      description: 'Whether to break long words',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Typography Stories
export const Default: Story = {
  args: {
    children: 'This is default typography text',
  },
};

// Heading Variants
export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1 - Main Title',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2 - Section Title',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3 - Subsection Title',
  },
};

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'Heading 4 - Card Title',
  },
};

export const Heading5: Story = {
  args: {
    variant: 'h5',
    children: 'Heading 5 - Small Title',
  },
};

export const Heading6: Story = {
  args: {
    variant: 'h6',
    children: 'Heading 6 - Tiny Title',
  },
};

// Body Text Variants
export const BodyText: Story = {
  args: {
    variant: 'body',
    children: 'This is body text with normal line height and comfortable reading experience.',
  },
};

export const BodyLarge: Story = {
  args: {
    variant: 'body-lg',
    children: 'This is large body text for better readability in important content sections.',
  },
};

export const BodySmall: Story = {
  args: {
    variant: 'body-sm',
    children: 'This is small body text for secondary content and less important information.',
  },
};

// Caption Variants
export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'This is caption text for labels and small descriptions.',
  },
};

export const CaptionSmall: Story = {
  args: {
    variant: 'caption-sm',
    children: 'This is small caption text for very small labels.',
  },
};

// Display Variants
export const Display1: Story = {
  args: {
    variant: 'display-1',
    children: 'Display 1 - Hero Title',
  },
};

export const Display2: Story = {
  args: {
    variant: 'display-2',
    children: 'Display 2 - Large Title',
  },
};

export const Display3: Story = {
  args: {
    variant: 'display-3',
    children: 'Display 3 - Medium Title',
  },
};

// Special Variants
export const Lead: Story = {
  args: {
    variant: 'lead',
    children: 'This is lead text for introducing content sections with larger, more prominent styling.',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
    children: 'This is small text for secondary information.',
  },
};

export const Tiny: Story = {
  args: {
    variant: 'tiny',
    children: 'This is tiny text for very small labels.',
  },
};

// Color Variants
export const DefaultColor: Story = {
  args: {
    variant: 'h3',
    color: 'default',
    children: 'Default color text',
  },
};

export const MutedColor: Story = {
  args: {
    variant: 'body',
    color: 'muted',
    children: 'Muted color text for secondary information',
  },
};

export const PrimaryColor: Story = {
  args: {
    variant: 'h3',
    color: 'primary',
    children: 'Primary color text',
  },
};

export const SuccessColor: Story = {
  args: {
    variant: 'body',
    color: 'success',
    children: 'Success color text for positive feedback',
  },
};

export const WarningColor: Story = {
  args: {
    variant: 'body',
    color: 'warning',
    children: 'Warning color text for caution messages',
  },
};

export const ErrorColor: Story = {
  args: {
    variant: 'body',
    color: 'error',
    children: 'Error color text for error messages',
  },
};

// Weight Variants
export const NormalWeight: Story = {
  args: {
    variant: 'body',
    weight: 'normal',
    children: 'Normal weight text',
  },
};

export const MediumWeight: Story = {
  args: {
    variant: 'body',
    weight: 'medium',
    children: 'Medium weight text',
  },
};

export const SemiboldWeight: Story = {
  args: {
    variant: 'body',
    weight: 'semibold',
    children: 'Semibold weight text',
  },
};

export const BoldWeight: Story = {
  args: {
    variant: 'body',
    weight: 'bold',
    children: 'Bold weight text',
  },
};

export const ExtraboldWeight: Story = {
  args: {
    variant: 'body',
    weight: 'extrabold',
    children: 'Extrabold weight text',
  },
};

// Alignment Variants
export const LeftAlign: Story = {
  args: {
    variant: 'body',
    align: 'left',
    children: 'Left aligned text is the default alignment for most content.',
  },
};

export const CenterAlign: Story = {
  args: {
    variant: 'body',
    align: 'center',
    children: 'Center aligned text is useful for titles and important messages.',
  },
};

export const RightAlign: Story = {
  args: {
    variant: 'body',
    align: 'right',
    children: 'Right aligned text is often used for numbers and dates.',
  },
};

export const JustifyAlign: Story = {
  args: {
    variant: 'body',
    align: 'justify',
    children: 'Justified text creates even margins on both sides, creating a clean, professional look for longer content blocks.',
  },
};

// Text Behavior Variants
export const Truncated: Story = {
  args: {
    variant: 'body',
    truncate: true,
    children: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width.',
  },
  parameters: {
    layout: 'padded',
  },
};

export const NoWrap: Story = {
  args: {
    variant: 'body',
    noWrap: true,
    children: 'This text will not wrap to the next line even if it exceeds the container width.',
  },
  parameters: {
    layout: 'padded',
  },
};

export const BreakWords: Story = {
  args: {
    variant: 'body',
    breakWords: true,
    children: 'This text contains a verylongwordthatwillbebrokenacrosslines to demonstrate word breaking behavior.',
  },
  parameters: {
    layout: 'padded',
  },
};

// Convenience Components
export const ConvenienceComponents: Story = {
  render: () => (
    <div className="space-y-4">
      <H1>H1 Component</H1>
      <H2>H2 Component</H2>
      <H3>H3 Component</H3>
      <H4>H4 Component</H4>
      <H5>H5 Component</H5>
      <H6>H6 Component</H6>
      <Body>Body Component</Body>
      <BodyLargeComp>BodyLarge Component</BodyLargeComp>
      <BodySmallComp>BodySmall Component</BodySmallComp>
      <CaptionComp>Caption Component</CaptionComp>
      <CaptionSmallComp>CaptionSmall Component</CaptionSmallComp>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
      </div>
      <div>
        <Typography variant="body-lg">Body Large</Typography>
        <Typography variant="body">Body</Typography>
        <Typography variant="body-sm">Body Small</Typography>
      </div>
      <div>
        <Typography variant="caption">Caption</Typography>
        <Typography variant="caption-sm">Caption Small</Typography>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Colors Grid
export const AllColors: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <Typography variant="h3" color="default">Default Color</Typography>
      <Typography variant="body" color="muted">Muted Color</Typography>
      <Typography variant="h3" color="primary">Primary Color</Typography>
      <Typography variant="body" color="secondary">Secondary Color</Typography>
      <Typography variant="body" color="accent">Accent Color</Typography>
      <Typography variant="body" color="success">Success Color</Typography>
      <Typography variant="body" color="warning">Warning Color</Typography>
      <Typography variant="body" color="error">Error Color</Typography>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Weights Grid
export const AllWeights: Story = {
  render: () => (
    <div className="space-y-2 p-4">
      <Typography variant="body" weight="normal">Normal Weight</Typography>
      <Typography variant="body" weight="medium">Medium Weight</Typography>
      <Typography variant="body" weight="semibold">Semibold Weight</Typography>
      <Typography variant="body" weight="bold">Bold Weight</Typography>
      <Typography variant="body" weight="extrabold">Extrabold Weight</Typography>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Alignments Grid
export const AllAlignments: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="border rounded p-4">
        <Typography variant="body" align="left">
          Left aligned text is the default alignment for most content.
        </Typography>
      </div>
      <div className="border rounded p-4">
        <Typography variant="body" align="center">
          Center aligned text is useful for titles and important messages.
        </Typography>
      </div>
      <div className="border rounded p-4">
        <Typography variant="body" align="right">
          Right aligned text is often used for numbers and dates.
        </Typography>
      </div>
      <div className="border rounded p-4">
        <Typography variant="body" align="justify">
          Justified text creates even margins on both sides, creating a clean, professional look for longer content blocks.
        </Typography>
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
        <Typography variant="h3" color="default">Dark Mode Heading</Typography>
        <Typography variant="body" color="muted">Dark mode muted text</Typography>
        <Typography variant="body" color="primary">Dark mode primary text</Typography>
        <Typography variant="body" color="success">Dark mode success text</Typography>
        <Typography variant="body" color="warning">Dark mode warning text</Typography>
        <Typography variant="body" color="error">Dark mode error text</Typography>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Responsive Example
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <Typography variant="h1" className="text-2xl md:text-4xl lg:text-6xl">
        Responsive Heading
      </Typography>
      <Typography variant="body" className="text-sm md:text-base lg:text-lg">
        This text adapts to different screen sizes using responsive classes.
      </Typography>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};