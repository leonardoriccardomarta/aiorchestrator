import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PasswordResetForm } from '../PasswordResetForm';
import { RESET_PASSWORD, REQUEST_RESET } from '../../../graphql/mutations/auth';

// Mock the test matchers
declare global {
  interface JestMatchers<R> {
    toBeInTheDocument(): R;
  }
}

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useNavigate: () => mockNavigate,
  };
});

describe('PasswordResetForm', () => {
  const requestResetSuccessMock = {
    request: {
      query: REQUEST_RESET,
      variables: { email: 'test@example.com' },
    },
    result: {
      data: {
        requestPasswordReset: {
          success: true,
          message: 'Password reset email sent',
        },
      },
    },
  };

  const resetPasswordSuccessMock = {
    request: {
      query: RESET_PASSWORD,
      variables: { 
        token: 'valid-token',
        password: 'newpassword123',
        confirmPassword: 'newpassword123'
      },
    },
    result: {
      data: {
        resetPassword: {
          success: true,
          message: 'Password reset successfully',
        },
      },
    },
  };

  const renderComponent = (mocks: any[]) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <PasswordResetForm />
        </BrowserRouter>
      </MockedProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders request reset form when no token is present', () => {
    renderComponent([requestResetSuccessMock]);
    expect(screen.getByText('Request Password Reset')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders reset password form when token is present', () => {
    // Mock URLSearchParams to return a token
    Object.defineProperty(window, 'location', {
      value: {
        search: '?token=valid-token',
      },
      writable: true,
    });

    renderComponent([resetPasswordSuccessMock]);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  it('handles password reset request successfully', async () => {
    renderComponent([requestResetSuccessMock]);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Send Reset Email'));

    await waitFor(() => {
      expect(screen.getByText('Password reset email sent')).toBeInTheDocument();
    });
  });

  it('handles password reset successfully', async () => {
    // Mock URLSearchParams to return a token
    Object.defineProperty(window, 'location', {
      value: {
        search: '?token=valid-token',
      },
      writable: true,
    });

    renderComponent([resetPasswordSuccessMock]);

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'newpassword123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'newpassword123' },
    });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Password reset successfully')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error when passwords do not match', async () => {
    // Mock URLSearchParams to return a token
    Object.defineProperty(window, 'location', {
      value: {
        search: '?token=valid-token',
      },
      writable: true,
    });

    renderComponent([resetPasswordSuccessMock]);

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'newpassword123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
}); 