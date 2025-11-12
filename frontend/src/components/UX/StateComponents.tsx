import React from 'react';
import styled from 'styled-components';
import { Button, Card, Text, Heading, Spinner, colors, spacing, animations } from '../../design-system/DesignSystem';

// Success State Component
interface SuccessStateProps {
  title: string;
  message: string;
  icon?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  onDismiss?: () => void;
}

const SuccessContainer = styled(Card)`
  text-align: center;
  padding: ${spacing[8]};
  max-width: 500px;
  margin: ${spacing[8]} auto;
  background: linear-gradient(135deg, ${colors.success[50]} 0%, ${colors.neutral.white} 100%);
  border: 2px solid ${colors.success[200]};
  ${animations.fadeIn}
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${spacing[4]};
  color: ${colors.success[500]};
  animation: bounce 0.6s ease-in-out;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const SuccessActions = styled.div`
  display: flex;
  gap: ${spacing[4]};
  justify-content: center;
  margin-top: ${spacing[6]};
  flex-wrap: wrap;
`;

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  icon = '',
  actions = [],
  onDismiss,
}) => {
  return (
    <SuccessContainer elevation="lg">
      <SuccessIcon>{icon}</SuccessIcon>
      <Heading level={2} color={colors.success[700]}>
        {title}
      </Heading>
      <Text size="lg" color={colors.secondary[600]} style={{ marginBottom: spacing[4] }}>
        {message}
      </Text>
      
      <SuccessActions>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
        {onDismiss && (
          <Button variant="ghost" onClick={onDismiss}>
            Close
          </Button>
        )}
      </SuccessActions>
    </SuccessContainer>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: string;
  }>;
  illustration?: React.ReactNode;
}

const EmptyContainer = styled(Card)`
  text-align: center;
  padding: ${spacing[8]};
  max-width: 600px;
  margin: ${spacing[8]} auto;
  background: linear-gradient(135deg, ${colors.secondary[50]} 0%, ${colors.neutral.white} 100%);
  border: 2px solid ${colors.secondary[200]};
  ${animations.fadeIn}
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${spacing[4]};
  color: ${colors.secondary[500]};
  opacity: 0.7;
`;

const EmptyActions = styled.div`
  display: flex;
  gap: ${spacing[4]};
  justify-content: center;
  margin-top: ${spacing[6]};
  flex-wrap: wrap;
`;

const IllustrationContainer = styled.div`
  margin-bottom: ${spacing[6]};
  opacity: 0.8;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '📭',
  actions = [],
  illustration,
}) => {
  return (
    <EmptyContainer elevation="md">
      {illustration && (
        <IllustrationContainer>
          {illustration}
        </IllustrationContainer>
      )}
      <EmptyIcon>{icon}</EmptyIcon>
      <Heading level={2} color={colors.secondary[700]}>
        {title}
      </Heading>
      <Text size="lg" color={colors.secondary[600]} style={{ marginBottom: spacing[4] }}>
        {message}
      </Text>
      
      <EmptyActions>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'primary'}
            onClick={action.onClick}
          >
            {action.icon && <span style={{ marginRight: spacing[2] }}>{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </EmptyActions>
    </EmptyContainer>
  );
};

// Loading State Component
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'fullscreen' | 'skeleton';
  progress?: number; // 0-100
}

const LoadingContainer = styled.div<{ variant: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing[4]};
  
  ${({ variant }) => {
    switch (variant) {
      case 'fullscreen':
        return `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          z-index: 1000;
        `;
      case 'skeleton':
        return `
          width: 100%;
          height: 100%;
        `;
      default:
        return `
          padding: ${spacing[8]};
        `;
    }
  }}
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 200px;
  height: 4px;
  background: ${colors.secondary[200]};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${spacing[2]};
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[600]});
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const LoadingText = styled(Text)`
  color: ${colors.secondary[600]};
  font-weight: 500;
`;

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  variant = 'inline',
  progress,
}) => {
  return (
    <LoadingContainer variant={variant}>
      <Spinner size={size} />
      <LoadingText>{message}</LoadingText>
      {progress !== undefined && (
        <ProgressBar progress={progress} />
      )}
    </LoadingContainer>
  );
};

// Skeleton Loading Component
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

const SkeletonBase = styled.div<SkeletonProps>`
  background: linear-gradient(90deg, ${colors.secondary[200]} 25%, ${colors.secondary[100]} 50%, ${colors.secondary[200]} 75%);
  background-size: 200% 100%;
  border-radius: ${({ variant }) => variant === 'circular' ? '50%' : '4px'};
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '20px')};
  
  animation: ${({ animation }) => animation === 'wave' ? 'wave 1.5s ease-in-out infinite' : 'pulse 1.5s ease-in-out infinite'};
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  
  @keyframes wave {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <SkeletonBase {...props} />;
};

// Skeleton Card Component
interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

const SkeletonCardContainer = styled(Card)`
  padding: ${spacing[6]};
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[4]};
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  showImage = false,
}) => {
  return (
    <SkeletonCardContainer elevation="sm">
      {showAvatar && (
        <SkeletonHeader>
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={14} />
          </div>
        </SkeletonHeader>
      )}
      
      {showImage && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}

        />
      )}
      
      <SkeletonContent>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            width={index === lines - 1 ? '60%' : '100%'}
            height={16}
          />
        ))}
      </SkeletonContent>
    </SkeletonCardContainer>
  );
};

// No Results Component
interface NoResultsProps {
  searchTerm?: string;
  suggestions?: string[];
  onClearSearch?: () => void;
  onTrySuggestion?: (suggestion: string) => void;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchTerm,
  suggestions = [],
  onClearSearch,
  onTrySuggestion,
}) => {
  return (
    <EmptyState
      title="No results found"
      message={
        searchTerm
          ? `We couldn't find any results for "${searchTerm}". Try adjusting your search terms.`
          : "No items match your current filters."
      }
      icon="🔍"
      actions={[
        ...(onClearSearch ? [{
          label: 'Clear Search',
          onClick: onClearSearch,
          variant: 'secondary' as const,
          icon: '🗑️',
        }] : []),
        ...suggestions.slice(0, 3).map(suggestion => ({
          label: `Try "${suggestion}"`,
          onClick: () => onTrySuggestion?.(suggestion),
          variant: 'ghost' as const,
        })),
      ]}
    />
  );
};

// Offline State Component
export const OfflineState: React.FC = () => {
  return (
    <EmptyState
      title="You're offline"
      message="Please check your internet connection and try again."
      icon="📡"
      actions={[
        {
          label: 'Retry',
          onClick: () => window.location.reload(),
          variant: 'primary',
          icon: '🔄',
        },
      ]}
    />
  );
};

// Maintenance Mode Component
export const MaintenanceMode: React.FC = () => {
  return (
    <EmptyState
      title="Under Maintenance"
      message="We're currently performing scheduled maintenance. Please check back soon."
      icon=""
      actions={[
        {
          label: 'Check Status',
          onClick: () => window.open('https://status.example.com', '_blank'),
          variant: 'primary',
          icon: '',
        },
      ]}
    />
  );
}; 
