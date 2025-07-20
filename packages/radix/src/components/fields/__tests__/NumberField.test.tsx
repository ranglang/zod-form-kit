import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NumberField } from '../NumberField';

describe('NumberField', () => {
  const defaultProps = {
    name: 'testNumber',
    value: 0,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<NumberField {...defaultProps} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDefined();
    expect(input.getAttribute('name')).toBe('testNumber');
    expect(input.getAttribute('type')).toBe('number');
  });

  it('displays current value', () => {
    render(<NumberField {...defaultProps} value={42} />);
    
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('calls onChange when user types a number', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    // Create a test component that manages state properly
    const TestComponent = () => {
      const [value, setValue] = React.useState(0);
      const handleChange = (newValue: number) => {
        setValue(newValue);
        onChange(newValue);
      };
      return <NumberField {...defaultProps} value={value} onChange={handleChange} />;
    };
    
    render(<TestComponent />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '123');
    
    expect((input as HTMLInputElement).value).toBe('123');
    expect(onChange).toHaveBeenLastCalledWith(123);
  });

  it('handles empty input by setting value to 0', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<NumberField {...defaultProps} value={42} onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('handles negative numbers', async () => {
    const onChange = vi.fn();
    
    render(<NumberField {...defaultProps} value={-25} onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    
    // Test that negative values are displayed correctly
    expect(input.value).toBe('-25');
    
    // Test that manual input change events work correctly
    fireEvent.change(input, { target: { value: '-30' } });
    expect(onChange).toHaveBeenCalledWith(-30);
  });

  it('handles decimal numbers', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    // Create a test component that manages state properly
    const TestComponent = () => {
      const [value, setValue] = React.useState(0);
      const handleChange = (newValue: number) => {
        setValue(newValue);
        onChange(newValue);
      };
      return <NumberField {...defaultProps} value={value} onChange={handleChange} />;
    };
    
    render(<TestComponent />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '3.14');
    
    expect((input as HTMLInputElement).value).toBe('3.14');
    expect(onChange).toHaveBeenLastCalledWith(3.14);
  });

  it('renders with label and required indicator', () => {
    render(<NumberField {...defaultProps} label="Age" required />);
    
    const label = screen.getByText('Age');
    expect(label).toBeDefined();
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeDefined();
    expect(requiredIndicator.className).toContain('text-red-500');
  });

  it('shows error message', () => {
    render(<NumberField {...defaultProps} error="Invalid number" />);
    
    const errorMessage = screen.getByText('Invalid number');
    expect(errorMessage).toBeDefined();
    expect(errorMessage.className).toContain('text-red-500');
  });

  it('applies min and max constraints', () => {
    render(
      <NumberField 
        {...defaultProps} 
        options={{ min: 0, max: 100 }}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    expect(input.getAttribute('min')).toBe('0');
    expect(input.getAttribute('max')).toBe('100');
  });

  it('applies step constraint', () => {
    render(
      <NumberField 
        {...defaultProps} 
        options={{ step: 0.1 }}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    expect(input.getAttribute('step')).toBe('0.1');
  });

  it('handles readonly option', () => {
    render(
      <NumberField 
        {...defaultProps} 
        options={{ readonly: true }}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    expect(input.hasAttribute('readonly')).toBe(true);
  });
}); 