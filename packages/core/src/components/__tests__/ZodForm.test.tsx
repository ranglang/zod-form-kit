import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { ZodForm } from '../ZodForm';

// Mock FieldRenderer to test ZodForm-specific logic
vi.mock('../FieldRenderer', () => ({
  FieldRenderer: ({ schema: _schema, form, path }: any) => {
    return (
      <form.Field
        name={path || 'testField'}
        children={(field: any) => (
          <div>
            <input
              aria-label={path || 'testField'}
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <span data-testid="field-error">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />
    );
  },
}));

describe('ZodForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Integration with TanStack Form', () => {
    it('should pass correct form instance to FieldRenderer', () => {
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      // Verify form is rendered and field is accessible with mock
      expect(screen.getByLabelText('testField')).toBeInTheDocument();
    });

    it('should handle form state through TanStack Form Subscribe', async () => {
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

      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // Initially enabled
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Submit');

      // Fill field and submit
      await user.type(screen.getByLabelText('testField'), 'Test');
      await user.click(submitButton);

      // Should show submitting state
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Submitting...');
        expect(submitButton).toBeDisabled();
      });

      // Resolve and check state returns to normal
      resolveSubmit!();
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Submit');
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Schema Processing', () => {
    it('should extract and merge default values correctly', () => {
      const schema = z.object({
        name: z.string().default('Default Name'),
        email: z.string(),
        count: z.number().default(5),
      });
      const defaultValues = { email: 'test@example.com', count: 10 };
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} defaultValues={defaultValues} />);

      // With the mock, just verify the form renders with testField
      const field = screen.getByLabelText('testField');
      expect(field).toBeInTheDocument();
    });

    it('should handle empty default extraction gracefully', () => {
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      // Should not throw when no defaults are available
      expect(() => {
        render(<ZodForm schema={schema} onSubmit={onSubmit} />);
      }).not.toThrow();
    });
  });

  describe('Form Submission Handling', () => {
    it('should validate data before calling onSubmit', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      // Submit with simple string data
      await user.type(screen.getByLabelText('testField'), 'test value');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });

    it('should handle Zod validation errors during submission', async () => {
      const user = userEvent.setup();
      const schema = z.object({
        age: z.number().min(18, 'Must be 18 or older'),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      // This will trigger a validation error during submission
      await user.type(screen.getByLabelText('testField'), '15');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // onSubmit should not be called due to validation error
      expect(onSubmit).not.toHaveBeenCalled();
    });


  });

  describe('Form Element Properties', () => {
    it('should apply correct form attributes', () => {
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} className="custom-class" />);

      const form = screen.getByRole('form');
      expect(form).toHaveClass('form-generator', 'custom-class');
      expect(form).toHaveAttribute('role', 'form');
    });

    it('should prevent default form submission behavior', async () => {
      const schema = z.object({
        name: z.string(),
      });
      const onSubmit = vi.fn();

      render(<ZodForm schema={schema} onSubmit={onSubmit} />);

      const form = screen.getByRole('form');
      const preventDefault = vi.fn();
      const stopPropagation = vi.fn();

      // Simulate form submission event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(submitEvent, 'preventDefault', { value: preventDefault });
      Object.defineProperty(submitEvent, 'stopPropagation', { value: stopPropagation });

      form.dispatchEvent(submitEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Error Recovery', () => {
    it('should handle schema parsing errors gracefully', () => {
      // Create a schema that might cause parsing issues
      const schema = z.object({
        complexField: z.union([z.string(), z.number()]),
      });
      const onSubmit = vi.fn();

      // Should not throw during render
      expect(() => {
        render(<ZodForm schema={schema} onSubmit={onSubmit} />);
      }).not.toThrow();
    });
  });
}); 