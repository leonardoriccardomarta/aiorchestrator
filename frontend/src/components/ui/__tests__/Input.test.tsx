import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { Input } from '../Input';
import { Icons } from '../Icon';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-gray-300');
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Input variant="error" placeholder="Error input" />);
    expect(screen.getByPlaceholderText('Error input')).toHaveClass('border-error-300');

    rerender(<Input variant="success" placeholder="Success input" />);
    expect(screen.getByPlaceholderText('Success input')).toHaveClass('border-success-300');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" placeholder="Small input" />);
    expect(screen.getByPlaceholderText('Small input')).toHaveClass('h-8');

    rerender(<Input size="lg" placeholder="Large input" />);
    expect(screen.getByPlaceholderText('Large input')).toHaveClass('h-12');
  });

  it('renders with left and right icons', () => {
    render(
      <Input 
        leftIcon={<Icons.Search />} 
        rightIcon={<Icons.Close />}
        placeholder="With icons" 
      />
    );
    
    const input = screen.getByPlaceholderText('With icons');
    expect(input).toHaveClass('pl-10', 'pr-10');
    expect(input.parentElement?.querySelectorAll('svg')).toHaveLength(2);
  });

  it('shows error message', () => {
    render(<Input error="This field is required" placeholder="Error field" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-error-600');
  });

  it('shows helper text', () => {
    render(<Input helperText="This is helpful text" placeholder="Helper field" />);
    expect(screen.getByText('This is helpful text')).toBeInTheDocument();
    expect(screen.getByText('This is helpful text')).toHaveClass('text-gray-500');
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Change test" />);
    
    const input = screen.getByPlaceholderText('Change test');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Focus test" 
      />
    );
    
    const input = screen.getByPlaceholderText('Focus test');
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="Custom input" />);
    expect(screen.getByPlaceholderText('Custom input')).toHaveClass('custom-input');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref).toHaveBeenCalled();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Input 
        label="Test Label"
        error="Test Error"
        helperText="Test Helper"
        placeholder="ARIA test"
      />
    );
    
    const input = screen.getByPlaceholderText('ARIA test');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number');
  });

  it('handles fullWidth prop', () => {
    render(<Input fullWidth={false} placeholder="Not full width" />);
    const container = screen.getByPlaceholderText('Not full width').closest('div');
    expect(container).not.toHaveClass('w-full');
  });

  it('has proper focus styles', () => {
    render(<Input placeholder="Focus styles" />);
    const input = screen.getByPlaceholderText('Focus styles');
    
    fireEvent.focus(input);
    expect(input).toHaveClass('focus-visible:ring-2');
  });

  it('handles keyboard events', () => {
    const handleKeyDown = vi.fn();
    render(<Input onKeyDown={handleKeyDown} placeholder="Keyboard test" />);
    
    const input = screen.getByPlaceholderText('Keyboard test');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
}); 