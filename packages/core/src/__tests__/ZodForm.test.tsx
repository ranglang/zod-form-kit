import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';

// Mock the FieldRenderer component to isolate ZodForm logic and test TanStack Form integration
vi.mock('../components/FieldRenderer', () => ({
  FieldRenderer: ({ schema, form, path, zodSchema }: any) => {
    // Create a simple mock field renderer that works with TanStack Form
    const renderField = (fieldName: string, fieldSchema: any) => {
      return (
        <form.Field
          key={fieldName}
          name={fieldName}
          validators={{
            onChange: ({ value }: { value: any }) => {
              // Validate using the actual zodSchema for this field
              try {
                if (zodSchema && zodSchema instanceof z.ZodObject) {
                  const fieldZodSchema = zodSchema.shape[fieldName];
                  if (fieldZodSchema) {
                    fieldZodSchema.parse(value);
                  }
                }
                return undefined;
              } catch (error) {
                if (error instanceof z.ZodError) {
                  return error.errors[0]?.message || 'Validation error';
                }
                return 'Validation error';
              }
            }
          }}
          children={(field: any) => {
            const fieldType = fieldSchema.type;
            const hasError = field.state.meta.errors.length > 0;
            
            if (fieldType === 'boolean') {
              return (
                <div data-testid={`field-${fieldName}`}>
                  <label>
                    <input
                      type="checkbox"
                      aria-label={fieldName}
                      checked={field.state.value || false}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      onBlur={field.handleBlur}
                    />
                    {fieldName}
                  </label>
                  {hasError && (
                    <span data-testid={`error-${fieldName}`} role="alert">
                      {field.state.meta.errors[0]}
                    </span>
                  )}
                </div>
              );
            }
            
            if (fieldType === 'number') {
              return (
                <div data-testid={`field-${fieldName}`}>
                  <label htmlFor={fieldName}>{fieldName}</label>
                  <input
                    id={fieldName}
                    type="number"
                    aria-label={fieldName}
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(Number(e.target.value) || 0)}
                    onBlur={field.handleBlur}
                  />
                  {hasError && (
                    <span data-testid={`error-${fieldName}`} role="alert">
                      {field.state.meta.errors[0]}
                    </span>
                  )}
                </div>
              );
            }

            if (fieldType === 'enum') {
              return (
                <div data-testid={`field-${fieldName}`}>
                  <label htmlFor={fieldName}>{fieldName}</label>
                  <select
                    id={fieldName}
                    aria-label={fieldName}
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select...</option>
                    {fieldSchema.values?.map((value: string) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {hasError && (
                    <span data-testid={`error-${fieldName}`} role="alert">
                      {field.state.meta.errors[0]}
                    </span>
                  )}
                </div>
              );
            }

            // Default to string/text input
            return (
              <div data-testid={`field-${fieldName}`}>
                <label htmlFor={fieldName}>{fieldName}</label>
                <input
                  id={fieldName}
                  type="text"
                  aria-label={fieldName}
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {hasError && (
                  <span data-testid={`error-${fieldName}`} role="alert">
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            );
          }}
        />
      );
    };

    // Handle object schemas
    if (schema.type === 'object' && schema.properties) {
      return (
        <div data-testid="form-fields">
          {Object.entries(schema.properties).map(([fieldName, fieldSchema]) =>
            renderField(fieldName, fieldSchema)
          )}
        </div>
      );
    }
    
    // Handle primitive schemas (when form has single field)
    return renderField(path || 'field', schema);
  },
}));

describe('ZodForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Initialization', () => {
    it('should initialize form with TanStack Form', () => {
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText('name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should initialize with default values from schema', () => {
      const schema = z.object({
        name: z.string().default('John Doe'),
        age: z.number().default(25),
        active: z.boolean().default(true),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      expect(screen.getByLabelText('name')).toHaveValue('John Doe');
      expect(screen.getByLabelText('age')).toHaveValue(25);
      expect(screen.getByLabelText('active')).toBeChecked();
    });

    it('should override schema defaults with provided defaultValues', () => {
      const schema = z.object({
        name: z.string().default('Schema Default'),
        email: z.string(),
      });
      const defaultValues = {
        name: 'Props Default',
        email: 'test@example.com',
      };
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} defaultValues={defaultValues} />);

      expect(screen.getByLabelText('name')).toHaveValue('Props Default');
      expect(screen.getByLabelText('email')).toHaveValue('test@example.com');
    });
  });

  describe('Field Rendering', () => {
    it('should render different field types correctly', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        active: z.boolean(),
        role: z.enum(['admin', 'user', 'guest']),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      expect(screen.getByLabelText('name')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('age')).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText('active')).toHaveAttribute('type', 'checkbox');
      expect(screen.getByLabelText('role')).toBeInstanceOf(HTMLSelectElement);
    });

    it('should render enum options correctly', () => {
      const schema = z.object({
        role: z.enum(['admin', 'user', 'guest']),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      const select = screen.getByLabelText('role');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(4); // Including "Select..." option
      expect(options[1]).toHaveTextContent('admin');
      expect(options[2]).toHaveTextContent('user');
      expect(options[3]).toHaveTextContent('guest');
    });
  });

  describe('Form Validation', () => {
    it('should validate fields using Zod schema on change', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        email: z.string().email('Invalid email format'),
        age: z.number().min(18, 'Must be at least 18'),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      const emailField = screen.getByLabelText('email');
      const ageField = screen.getByLabelText('age');

      // Test invalid email
      await user.type(emailField, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email format');
      });

      // Test invalid age
      await user.clear(ageField);
      await user.type(ageField, '15');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByTestId('error-age')).toHaveTextContent('Must be at least 18');
      });
    });

    it('should clear validation errors when field becomes valid', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        email: z.string().email('Invalid email format'),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      const emailField = screen.getByLabelText('email');

      // First, create an error
      await user.type(emailField, 'invalid');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByTestId('error-email')).toBeInTheDocument();
      });

      // Then fix it
      await user.clear(emailField);
      await user.type(emailField, 'valid@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should handle successful form submission', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      });
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText('name'), 'John Doe');
      await user.type(screen.getByLabelText('email'), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });
    });

    it('should prevent submission with invalid data', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        email: z.string().email('Invalid email'),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText('email'), 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Should not call onSubmit due to validation errors
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should handle submission errors gracefully', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'));

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText('name'), 'John Doe');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
      });
    });
  });

  describe('Form State Management', () => {
    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        name: z.string(),
      });
      
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      const onSubmit = vi.fn().mockReturnValue(submitPromise);

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText('name'), 'John Doe');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Button should show submitting state
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Submitting...');
        expect(submitButton).toBeDisabled();
      });

      // Resolve the submission
      resolveSubmit!();
      
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Submit');
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should manage form state properly with complex schemas', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        name: z.string().min(1, 'Name required'),
        email: z.string().email('Invalid email'),
        age: z.number().min(18, 'Must be 18+'),
        terms: z.boolean(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      // Fill valid data
      await user.type(screen.getByLabelText('name'), 'John Doe');
      await user.type(screen.getByLabelText('email'), 'john@example.com');
      await user.type(screen.getByLabelText('age'), '25');
      await user.click(screen.getByLabelText('terms'));

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          terms: true,
        });
      });
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className to form', () => {
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} className="custom-form" />);

      const form = screen.getByRole('form');
      expect(form).toHaveClass('form-generator', 'custom-form');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object schema', () => {
      const schema = z.object({});
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should handle optional fields correctly', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        required: z.string().min(1, 'Required field'),
        optional: z.string().optional(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      // Only fill required field
      await user.type(screen.getByLabelText('required'), 'Required value');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          required: 'Required value',
        });
      });
    });
  });
}); 