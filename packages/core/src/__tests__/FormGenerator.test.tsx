import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { FormGenerator } from '../components/FormGenerator';
import { ZodForm } from '../components/ZodForm';

// Mock FieldRenderer for basic rendering tests
vi.mock('../components/FieldRenderer', () => ({
  FieldRenderer: ({ schema, form, path }: any) => {
    // Handle object schemas with multiple fields
    if (schema.type === 'object' && schema.properties) {
      return (
        <div>
          {Object.keys(schema.properties).map((fieldName) => (
            <form.Field
              key={fieldName}
              name={fieldName}
              children={(field: any) => (
                <input
                  aria-label={fieldName}
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          ))}
        </div>
      );
    }
    
    // Handle single field
    return (
      <form.Field
        name={path || 'testField'}
        children={(field: any) => (
          <input
            aria-label={path || 'testField'}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
    );
  },
}));

describe('FormGenerator (Backward Compatibility Alias)', () => {
  it('should be an alias for ZodForm', () => {
    expect(FormGenerator).toBe(ZodForm);
  });

  it('should render and function identically to ZodForm', () => {
    const schema = z.object({
      name: z.string(),
    });
    const onSubmit = vi.fn();

    // Test that FormGenerator renders the same way as ZodForm
    const { rerender } = render(<FormGenerator schema={schema} onSubmit={onSubmit} />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // Should be able to rerender with ZodForm and get the same result
    rerender(<ZodForm schema={schema} onSubmit={onSubmit} />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should accept all ZodForm props', () => {
    const schema = z.object({
      name: z.string().default('Test Name'),
    });
    const onSubmit = vi.fn();
    const defaultValues = { name: 'Override Name' };

    // Should not throw and should render with all props
    expect(() => {
      render(
        <FormGenerator
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          className="test-class"
        />
      );
    }).not.toThrow();

    expect(screen.getByRole('form')).toHaveClass('form-generator', 'test-class');
    expect(screen.getByLabelText('name')).toHaveValue('Override Name');
  });
});