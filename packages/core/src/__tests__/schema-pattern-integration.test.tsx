import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';
import { 
  registerSchemaPatternRenderer,
  clearPatternRenderers
} from '../utils/plugin-registry';

// Custom pattern renderer component for testing
const CustomEmailPatternRenderer = ({ 
  value, 
  onChange, 
  error, 
  label, 
  name,
  zodSchema: _zodSchema,
  parsedField: _parsedField 
}: any) => (
  <div className="custom-email-pattern" data-testid={`pattern-${name}`}>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type="email"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter email address"
      data-testid={`email-input-${name}`}
      className={error ? 'error' : ''}
    />
    {error && <span data-testid={`pattern-error-${name}`} className="error">{error}</span>}
    <small data-testid="pattern-hint">This is a custom email pattern renderer</small>
  </div>
);

describe('Schema Pattern Integration', () => {
  beforeEach(() => {
    // Clear pattern renderers before each test
    clearPatternRenderers();
  });

  it('should render custom pattern component in ZodForm', () => {
    // Register email pattern
    registerSchemaPatternRenderer(
      'email-pattern',
      (zodSchema: z.ZodTypeAny) => {
        return zodSchema instanceof z.ZodString && 
               zodSchema._def.checks?.some((check: any) => check.kind === 'email');
      },
      CustomEmailPatternRenderer,
      100
    );

    const schema = z.object({
      email: z.string().email('Invalid email address'),
      name: z.string() // This should use default renderer
    });

    render(
      <ZodForm
        schema={schema}
        onSubmit={vi.fn()}
        defaultValues={{ email: '', name: '' }}
      />
    );

    // Should render custom email pattern component
    expect(screen.getByTestId('pattern-email')).toBeInTheDocument();
    expect(screen.getByTestId('email-input-email')).toBeInTheDocument();
    expect(screen.getByText('This is a custom email pattern renderer')).toBeInTheDocument();

    // Name field should not use pattern renderer (should use default)
    expect(screen.queryByTestId('pattern-name')).not.toBeInTheDocument();
  });

  it('should handle pattern renderer validation and form submission', async () => {
    const onSubmit = vi.fn();

    // Register email pattern
    registerSchemaPatternRenderer(
      'email-pattern',
      (zodSchema: z.ZodTypeAny) => {
        return zodSchema instanceof z.ZodString && 
               zodSchema._def.checks?.some((check: any) => check.kind === 'email');
      },
      CustomEmailPatternRenderer,
      100
    );

    const schema = z.object({
      email: z.string().email('Please enter a valid email')
    });

    render(
      <ZodForm
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={{ email: '' }}
      />
    );

    const emailInput = screen.getByTestId('email-input-email');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByTestId('pattern-error-email')).toBeInTheDocument();
    });

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Should submit successfully
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  it('should render complex form with multiple pattern renderers', () => {
    // Email pattern renderer
    registerSchemaPatternRenderer(
      'email-pattern',
      (zodSchema: z.ZodTypeAny) => {
        return zodSchema instanceof z.ZodString && 
               zodSchema._def.checks?.some((check: any) => check.kind === 'email');
      },
      CustomEmailPatternRenderer,
      100
    );

    // URL pattern renderer
    const CustomUrlPatternRenderer = ({ value, onChange, label, name }: any) => (
      <div className="custom-url-pattern" data-testid={`url-pattern-${name}`}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          data-testid={`url-input-${name}`}
        />
        <small data-testid="url-hint">Enter a valid URL</small>
      </div>
    );

    registerSchemaPatternRenderer(
      'url-pattern',
      (zodSchema: z.ZodTypeAny) => {
        return zodSchema instanceof z.ZodString && 
               zodSchema._def.checks?.some((check: any) => check.kind === 'url');
      },
      CustomUrlPatternRenderer,
      90
    );

    const schema = z.object({
      email: z.string().email(),
      website: z.string().url(),
      name: z.string() // Should use default renderer
    });

    render(
      <ZodForm
        schema={schema}
        onSubmit={vi.fn()}
        defaultValues={{ email: '', website: '', name: '' }}
      />
    );

    // Should render email pattern component
    expect(screen.getByTestId('pattern-email')).toBeInTheDocument();
    expect(screen.getByText('This is a custom email pattern renderer')).toBeInTheDocument();

    // Should render URL pattern component
    expect(screen.getByTestId('url-pattern-website')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid URL')).toBeInTheDocument();

    // Name should use default renderer
    expect(screen.queryByTestId('pattern-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('url-pattern-name')).not.toBeInTheDocument();
  });
}); 