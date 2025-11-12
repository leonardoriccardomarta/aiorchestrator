import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { Button, Card, Text, Heading, colors, spacing } from '../../design-system/DesignSystem';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorContainer = styled(Card)`
  text-align: center;
  padding: ${spacing[8]};
  max-width: 600px;
  margin: ${spacing[8]} auto;
  background: linear-gradient(135deg, ${colors.error[50]} 0%, ${colors.neutral.white} 100%);
  border: 2px solid ${colors.error[200]};
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${spacing[4]};
  color: ${colors.error[500]};
`;

const ErrorActions = styled.div`
  display: flex;
  gap: ${spacing[4]};
  justify-content: center;
  margin-top: ${spacing[6]};
  flex-wrap: wrap;
`;

const ErrorDetails = styled.div`
  background: ${colors.secondary[50]};
  border: 1px solid ${colors.secondary[200]};
  border-radius: 8px;
  padding: ${spacing[4]};
  margin-top: ${spacing[4]};
  text-align: left;
  font-family: monospace;
  font-size: 0.875rem;
  max-height: 200px;
  overflow-y: auto;
`;

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log error to monitoring service
    this.logError(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      console.log('Error logged to monitoring service:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer elevation="lg">
          <ErrorIcon>🚨</ErrorIcon>
          <Heading level={2} color={colors.error[700]}>
            Oops! Something went wrong
          </Heading>
          <Text size="lg" color={colors.secondary[600]} style={{ marginBottom: spacing[4] }}>
            We're sorry, but something unexpected happened. Our team has been notified.
          </Text>
          
          <ErrorActions>
            <Button variant="primary" onClick={this.handleRetry}>
              🔄 Try Again
            </Button>
            <Button variant="secondary" onClick={this.handleGoHome}>
              🏠 Go Home
            </Button>
            <Button variant="ghost" onClick={this.handleReload}>
              🔃 Reload Page
            </Button>
          </ErrorActions>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <Text size="sm" weight="bold" style={{ marginBottom: spacing[2] }}>
                Error Details (Development Only):
              </Text>
              <Text size="sm" color={colors.error[600]}>
                {this.state.error.message}
              </Text>
              {this.state.error.stack && (
                <Text size="sm" color={colors.secondary[600]} style={{ marginTop: spacing[2] }}>
                  {this.state.error.stack}
                </Text>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

// Error Display Component
interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'modal' | 'toast';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  variant = 'inline',
}) => {
  const ErrorWrapper = styled.div<{ variant: string }>`
    ${({ variant }) => {
      switch (variant) {
        case 'modal':
          return `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            max-width: 500px;
            width: 90vw;
          `;
        case 'toast':
          return `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
          `;
        default:
          return '';
      }
    }}
  `;

  return (
    <ErrorWrapper variant={variant}>
      <Card elevation="md" style={{ border: `2px solid ${colors.error[300]}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3] }}>
          <div style={{ fontSize: '1.5rem', color: colors.error[500] }}></div>
          <div style={{ flex: 1 }}>
            <Text weight="semibold" color={colors.error[700]} style={{ marginBottom: spacing[1] }}>
              {error.message || 'An error occurred'}
            </Text>
            <div style={{ display: 'flex', gap: spacing[2], marginTop: spacing[3] }}>
              {onRetry && (
                <Button size="sm" variant="primary" onClick={onRetry}>
                  Retry
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="secondary" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </ErrorWrapper>
  );
}; 
