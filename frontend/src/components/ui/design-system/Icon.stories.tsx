import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { 
  HomeIcon, 
  UserIcon, 
  SettingsIcon, 
  BellIcon, 
  SearchIcon,
  MailIcon,
  LockIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  InfoIcon,
  DownloadIcon,
  UploadIcon,
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  VolumeXIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  ShareIcon,
  RefreshCwIcon,
  CameraIcon,
  ImageIcon,
  FileIcon,
  MoveIcon,
  RotateCwIcon,
  GridIcon,
  ListIcon,
  ColumnsIcon,
  RowsIcon,
  LayoutIcon,
  MenuIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CloudIcon,
  RainbowIcon,
  UmbrellaIcon,
  ZapIcon,
  FlowerIcon,
  LeafIcon,
  SproutIcon,
} from 'lucide-react';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible icon component with consistent sizing, colors, and accessibility features. Supports decorative and semantic icons with proper ARIA attributes.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl', '3xl'],
      description: 'The size of the icon',
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'white', 'black'],
      description: 'The color of the icon',
    },
    weight: {
      control: 'select',
      options: ['thin', 'light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'The stroke weight of the icon',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the icon is decorative (hidden from screen readers)',
    },
    title: {
      control: 'text',
      description: 'The title/aria-label for the icon',
    },
    description: {
      control: 'text',
      description: 'The description for screen readers',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Icon Stories
export const Default: Story = {
  args: {
    icon: HomeIcon,
  },
};

export const WithTitle: Story = {
  args: {
    icon: HomeIcon,
    title: 'Home',
  },
};

export const WithDescription: Story = {
  args: {
    icon: HomeIcon,
    title: 'Home',
    description: 'Navigate to the home page',
  },
};

export const Decorative: Story = {
  args: {
    icon: HeartIcon,
    decorative: true,
  },
};

// Size Variants
export const ExtraSmall: Story = {
  args: {
    icon: HomeIcon,
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    icon: HomeIcon,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    icon: HomeIcon,
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    icon: HomeIcon,
    size: 'xl',
  },
};

export const TwoXL: Story = {
  args: {
    icon: HomeIcon,
    size: '2xl',
  },
};

export const ThreeXL: Story = {
  args: {
    icon: HomeIcon,
    size: '3xl',
  },
};

// Color Variants
export const DefaultColor: Story = {
  args: {
    icon: HomeIcon,
    color: 'default',
  },
};

export const MutedColor: Story = {
  args: {
    icon: HomeIcon,
    color: 'muted',
  },
};

export const PrimaryColor: Story = {
  args: {
    icon: HomeIcon,
    color: 'primary',
  },
};

export const SuccessColor: Story = {
  args: {
    icon: CheckIcon,
    color: 'success',
  },
};

export const WarningColor: Story = {
  args: {
    icon: AlertTriangleIcon,
    color: 'warning',
  },
};

export const ErrorColor: Story = {
  args: {
    icon: XIcon,
    color: 'error',
  },
};

export const WhiteColor: Story = {
  args: {
    icon: HomeIcon,
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const BlackColor: Story = {
  args: {
    icon: HomeIcon,
    color: 'black',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// Weight Variants
export const Thin: Story = {
  args: {
    icon: HomeIcon,
    weight: 'thin',
  },
};

export const Light: Story = {
  args: {
    icon: HomeIcon,
    weight: 'light',
  },
};

export const Normal: Story = {
  args: {
    icon: HomeIcon,
    weight: 'normal',
  },
};

export const Medium: Story = {
  args: {
    icon: HomeIcon,
    weight: 'medium',
  },
};

export const Semibold: Story = {
  args: {
    icon: HomeIcon,
    weight: 'semibold',
  },
};

export const Bold: Story = {
  args: {
    icon: HomeIcon,
    weight: 'bold',
  },
};

// Common Icons
export const NavigationIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={HomeIcon} title="Home" />
      <Icon icon={UserIcon} title="User" />
      <Icon icon={SettingsIcon} title="Settings" />
      <Icon icon={BellIcon} title="Notifications" />
      <Icon icon={SearchIcon} title="Search" />
      <Icon icon={MailIcon} title="Email" />
      <Icon icon={LockIcon} title="Security" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const ActionIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={PlusIcon} title="Add" />
      <Icon icon={EditIcon} title="Edit" />
      <Icon icon={TrashIcon} title="Delete" />
      <Icon icon={CopyIcon} title="Copy" />
      <Icon icon={ShareIcon} title="Share" />
      <Icon icon={DownloadIcon} title="Download" />
      <Icon icon={UploadIcon} title="Upload" />
      <Icon icon={RefreshCwIcon} title="Refresh" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const MediaIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={PlayIcon} title="Play" />
      <Icon icon={PauseIcon} title="Pause" />
      <Icon icon={VolumeIcon} title="Volume" />
      <Icon icon={VolumeXIcon} title="Mute" />
      <Icon icon={CameraIcon} title="Camera" />
      <Icon icon={ImageIcon} title="Image" />
      <Icon icon={FileIcon} title="File" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const StatusIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={CheckIcon} title="Success" color="success" />
      <Icon icon={XIcon} title="Error" color="error" />
      <Icon icon={AlertTriangleIcon} title="Warning" color="warning" />
      <Icon icon={InfoIcon} title="Information" color="primary" />
      <Icon icon={HeartIcon} title="Favorite" color="error" />
      <Icon icon={StarIcon} title="Star" color="warning" />
      <Icon icon={ThumbsUpIcon} title="Like" color="success" />
      <Icon icon={ThumbsDownIcon} title="Dislike" color="error" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const DirectionIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={ArrowRightIcon} title="Right" />
      <Icon icon={ArrowLeftIcon} title="Left" />
      <Icon icon={ChevronDownIcon} title="Down" />
      <Icon icon={ChevronUpIcon} title="Up" />
      <Icon icon={ChevronRightIcon} title="Next" />
      <Icon icon={ChevronLeftIcon} title="Previous" />
      <Icon icon={MoveIcon} title="Move" />
      <Icon icon={RotateCwIcon} title="Rotate Clockwise" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const InterfaceIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={MenuIcon} title="Menu" />
      <Icon icon={MoreHorizontalIcon} title="More Options" />
      <Icon icon={MoreVerticalIcon} title="More Actions" />
      <Icon icon={GridIcon} title="Grid View" />
      <Icon icon={ListIcon} title="List View" />
      <Icon icon={ColumnsIcon} title="Columns" />
      <Icon icon={RowsIcon} title="Rows" />
      <Icon icon={LayoutIcon} title="Layout" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const WeatherIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={SunIcon} title="Sunny" color="warning" />
      <Icon icon={MoonIcon} title="Night" color="muted" />
      <Icon icon={CloudIcon} title="Cloudy" color="muted" />
      <Icon icon={RainbowIcon} title="Rainbow" />
      <Icon icon={UmbrellaIcon} title="Rain" color="primary" />
      <Icon icon={ZapIcon} title="Lightning" color="warning" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const NatureIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={FlowerIcon} title="Flower" color="warning" />
      <Icon icon={LeafIcon} title="Leaf" color="success" />
      <Icon icon={SproutIcon} title="Sprout" color="success" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Sizes Grid
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Icon icon={HomeIcon} size="xs" title="Extra Small" />
      <Icon icon={HomeIcon} size="sm" title="Small" />
      <Icon icon={HomeIcon} size="default" title="Default" />
      <Icon icon={HomeIcon} size="lg" title="Large" />
      <Icon icon={HomeIcon} size="xl" title="Extra Large" />
      <Icon icon={HomeIcon} size="2xl" title="2XL" />
      <Icon icon={HomeIcon} size="3xl" title="3XL" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Colors Grid
export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={HomeIcon} color="default" title="Default" />
      <Icon icon={HomeIcon} color="muted" title="Muted" />
      <Icon icon={HomeIcon} color="primary" title="Primary" />
      <Icon icon={HomeIcon} color="secondary" title="Secondary" />
      <Icon icon={HomeIcon} color="accent" title="Accent" />
      <Icon icon={HomeIcon} color="success" title="Success" />
      <Icon icon={HomeIcon} color="warning" title="Warning" />
      <Icon icon={HomeIcon} color="error" title="Error" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Weights Grid
export const AllWeights: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Icon icon={HomeIcon} weight="thin" title="Thin" />
      <Icon icon={HomeIcon} weight="light" title="Light" />
      <Icon icon={HomeIcon} weight="normal" title="Normal" />
      <Icon icon={HomeIcon} weight="medium" title="Medium" />
      <Icon icon={HomeIcon} weight="semibold" title="Semibold" />
      <Icon icon={HomeIcon} weight="bold" title="Bold" />
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
      <div className="flex flex-wrap gap-4">
        <Icon icon={HomeIcon} color="default" title="Default (Dark)" />
        <Icon icon={HomeIcon} color="muted" title="Muted (Dark)" />
        <Icon icon={HomeIcon} color="primary" title="Primary (Dark)" />
        <Icon icon={HomeIcon} color="success" title="Success (Dark)" />
        <Icon icon={HomeIcon} color="warning" title="Warning (Dark)" />
        <Icon icon={HomeIcon} color="error" title="Error (Dark)" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Interactive Example
export const Interactive: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Icon icon={HeartIcon} title="Like" className="cursor-pointer hover:scale-110 transition-transform" />
        <span>Click to like</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={StarIcon} title="Favorite" className="cursor-pointer hover:scale-110 transition-transform" />
        <span>Click to favorite</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={ShareIcon} title="Share" className="cursor-pointer hover:scale-110 transition-transform" />
        <span>Click to share</span>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};