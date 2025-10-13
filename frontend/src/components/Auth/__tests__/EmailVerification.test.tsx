import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailVerification } from '../EmailVerification';
import { VERIFY_EMAIL, RESEND_VERIFICATION } from '../../../graphql/mutations/auth';

// Mock the test matchers
declare global {
  interface JestMatchers<R> {
    toBeInTheDocument(): R;
  }
}

const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams('?token=valid-token');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

describe('EmailVerification', () => {
  const successMock = {
    request: {
      query: VERIFY_EMAIL,
      variables: { token: 'valid-token' },
    },
    result: {
      data: {
        verifyEmail: {
          success: true,
          message: 'Email verified successfully',
        },
      },
    },
  };

  const errorMock = {
    request: {
      query: VERIFY_EMAIL,
      variables: { token: 'invalid-token' },
    },
    error: new Error('Invalid verification token'),
  };

  const resendSuccessMock = {
    request: {
      query: RESEND_VERIFICATION,
    },
    result: {
      data: {
        resendVerificationEmail: {
          success: true,
          message: 'Verification email sent',
        },
      },
    },
  };

  const renderComponent = (mocks: any[]) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <EmailVerification />
        </BrowserRouter>
      </MockedProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    renderComponent([successMock]);
    expect(screen.getByText('Email Verification')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles successful verification', async () => {
    renderComponent([successMock]);

    await waitFor(() => {
      expect(screen.getByText('Email verified successfully')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 4000 });
  });

  it('handles verification error', async () => {
    renderComponent([errorMock]);

    await waitFor(() => {
      expect(screen.getByText('Invalid verification token')).toBeInTheDocument();
    });

    expect(screen.getByText('Resend Verification Email')).toBeInTheDocument();
  });

  it('handles resend verification', async () => {
    renderComponent([errorMock, resendSuccessMock]);

    await waitFor(() => {
      expect(screen.getByText('Invalid verification token')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Resend Verification Email'));

    await waitFor(() => {
      expect(screen.getByText('Verification email sent')).toBeInTheDocument();
    });
  });
}); 