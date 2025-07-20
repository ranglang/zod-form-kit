import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StringField } from '../StringField';

describe('StringField', () => {
  const defaultProps = {
    name: 'testField',
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<StringField {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
    expect(input.getAttribute('name')).toBe('testField');
    expect(input.getAttribute('id')).toBe('testField');
  });

  it('renders with label', () => {
    render(<StringField {...defaultProps} label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeDefined();
    expect(label.getAttribute('for')).toBe('testField');
  });

  it('shows required indicator when required', () => {
    render(<StringField {...defaultProps} label="Test Label" required />);
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeDefined();
    expect(requiredIndicator.className).toContain('text-red-500');
  });

  it('displays current value', () => {
    render(<StringField {...defaultProps} value="test value" />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    // Create a test component that manages state properly
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      const handleChange = (newValue: string) => {
        setValue(newValue);
        onChange(newValue);
      };
      return <StringField {...defaultProps} value={value} onChange={handleChange} />;
    };
    
    render(<TestComponent />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    
    expect(onChange).toHaveBeenCalledTimes(5);
    expect((input as HTMLInputElement).value).toBe('hello');
    expect(onChange).toHaveBeenLastCalledWith('hello');
  });

  it('handles input clearing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<StringField {...defaultProps} value="initial" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('supports email format', () => {
    render(
      <StringField 
        {...defaultProps} 
        options={{ format: 'email' }}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('Enter email address');
  });

  it('shows error message', () => {
    render(<StringField {...defaultProps} error="This field is required" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeDefined();
    expect(errorMessage.className).toContain('text-red-500');
  });

  it('applies error styling to input when error exists', () => {
    render(<StringField {...defaultProps} error="Error message" />);
    
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-500');
  });

  it('handles readonly option', () => {
    render(
      <StringField 
        {...defaultProps} 
        options={{ readonly: true }}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.hasAttribute('readonly')).toBe(true);
  });

  it('works with controlled input pattern', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      return (
        <StringField 
          {...defaultProps} 
          value={value}
          onChange={setValue}
        />
      );
    };

    render(<TestComponent />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'controlled');
    
    expect(input.value).toBe('controlled');
  });
}); 