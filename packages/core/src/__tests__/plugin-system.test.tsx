import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { ZodForm } from '../components/ZodForm';
import { 
  registerFieldRenderer, 
  registerUIAdapter, 
  getRegisteredRenderer, 
  pluginRegistry,
  registerSchemaPatternRenderer,
  getMatchingPatternRenderer,
  removeSchemaPatternRenderer,
  getAllPatternRenderers,
  clearPatternRenderers
} from '../utils/plugin-registry';
import { StringFieldRendererProps, UIAdapter } from '../types/plugin-system';

// Reset FieldRenderer mock for these tests to use real implementation
vi.doMock('../components/FieldRenderer', async () => {
  const actual = await vi.importActual('../components/FieldRenderer');
  return actual;
});

// Custom field renderer for testing
function CustomStringField({
  name,
  label,
  value = '',
  onChange,
  error,
  required,
  className = ''
}: StringFieldRendererProps) {
  return (
    <div className={`custom-string-field ${className}`}>
      <label htmlFor={name} data-testid={`label-${name}`}>
        {label}
        {required && <span data-testid={`required-${name}`}>*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
        required={required}
        data-testid={`input-${name}`}
      />
      
      {error && <span data-testid={`error-${name}`} className="error">{error}</span>}
    </div>
  );
}

// Custom UI adapter for testing
const customAdapter: UIAdapter = {
  name: 'custom-test',
  components: {
    string: CustomStringField
  }
};

describe('Plugin System', () => {
  beforeEach(() => {
    // Reset the registry before each test
    pluginRegistry.reset();
  });

  describe('Field Renderer Registration', () => {
    it('should register a custom field renderer', () => {
      registerFieldRenderer('string', CustomStringField);
      
      const registeredRenderer = getRegisteredRenderer('string');
      expect(registeredRenderer).toBe(CustomStringField);
    });

    it('should override default field renderer when custom one is registered', () => {
      registerFieldRenderer('string', CustomStringField);
      
      const schema = z.object({
        name: z.string()
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={vi.fn()}
        />
      );

      // Should render custom field renderer
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.getByTestId('label-name')).toBeInTheDocument();
    });

    it('should fall back to default renderer when no custom renderer is registered', () => {
      const schema = z.object({
        name: z.string()
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={vi.fn()}
        />
      );

      // Should render default field renderer
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
  });

  describe('UI Adapter Registration', () => {
    it('should register a complete UI adapter', () => {
      registerUIAdapter(customAdapter);
      
      const registeredAdapter = pluginRegistry.getUIAdapter('custom-test');
      expect(registeredAdapter).toBe(customAdapter);
    });

    it('should use registered UI adapter components', () => {
      registerUIAdapter(customAdapter);
      
      const schema = z.object({
        name: z.string()
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={vi.fn()}
        />
      );

      // Should render custom field renderer from adapter
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
    });

    it('should set first registered adapter as default', () => {
      registerUIAdapter(customAdapter);
      
      const defaultAdapter = pluginRegistry.getDefaultAdapter();
      expect(defaultAdapter).toBe(customAdapter);
    });
  });

  describe('FormGenerator Integration', () => {
    it('should work with custom field renderers and form submission', async () => {
      registerFieldRenderer('string', CustomStringField);
      
      const onSubmit = vi.fn();
      const schema = z.object({
        name: z.string().min(1, 'Name is required')
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ name: 'John' }}
        />
      );

      const input = screen.getByTestId('input-name');
      expect(input).toHaveValue('John');

      // Submit form
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Wait for form submission
      await screen.findByText('Submitting...');
      
      expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should handle validation errors with custom field renderers', async () => {
      registerFieldRenderer('string', CustomStringField);
      
      const onSubmit = vi.fn();
      const schema = z.object({
        name: z.string().min(1, 'Name is required')
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ name: '' }}
        />
      );

      // Submit form with empty name
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Should show validation error
      await screen.findByTestId('error-name');
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('should support all field types with custom renderers', () => {
      // Register custom renderers for all field types
      const CustomNumberField = ({ name, value, onChange }: any) => (
        <input
          data-testid={`number-${name}`}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

      const CustomBooleanField = ({ name, value, onChange }: any) => (
        <input
          data-testid={`boolean-${name}`}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      );

      registerFieldRenderer('number', CustomNumberField);
      registerFieldRenderer('boolean', CustomBooleanField);

      const schema = z.object({
        age: z.number(),
        isActive: z.boolean()
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByTestId('number-age')).toBeInTheDocument();
      expect(screen.getByTestId('boolean-isActive')).toBeInTheDocument();
    });
  });

  describe('Registry Management', () => {
    it('should clear custom field renderers', () => {
      registerFieldRenderer('string', CustomStringField);
      expect(getRegisteredRenderer('string')).toBe(CustomStringField);

      pluginRegistry.clearCustomFieldRenderers();
      
      // Should still have default renderer
      expect(getRegisteredRenderer('string')).toBeDefined();
      expect(getRegisteredRenderer('string')).not.toBe(CustomStringField);
    });

    it('should clear UI adapters', () => {
      registerUIAdapter(customAdapter);
      expect(pluginRegistry.getUIAdapter('custom-test')).toBe(customAdapter);

      pluginRegistry.clearUIAdapters();
      expect(pluginRegistry.getUIAdapter('custom-test')).toBeUndefined();
    });

    it('should reset entire registry', () => {
      registerFieldRenderer('string', CustomStringField);
      registerUIAdapter(customAdapter);

      pluginRegistry.reset();

      expect(getRegisteredRenderer('string')).not.toBe(CustomStringField);
      expect(pluginRegistry.getUIAdapter('custom-test')).toBeUndefined();
    });

    it('should check if field renderer is registered', () => {
      expect(pluginRegistry.hasFieldRenderer('string')).toBe(true);
      expect(pluginRegistry.hasFieldRenderer('custom' as any)).toBe(false);
    });

    it('should check if UI adapter is registered', () => {
      expect(pluginRegistry.hasUIAdapter('custom-test')).toBe(false);
      
      registerUIAdapter(customAdapter);
      expect(pluginRegistry.hasUIAdapter('custom-test')).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should update configuration', () => {
      const config = { fallbackToDefaults: false };
      pluginRegistry.updateConfig(config);
      
      expect(pluginRegistry.getConfig().fallbackToDefaults).toBe(false);
    });

    it('should set default adapter', () => {
      registerUIAdapter(customAdapter);
      pluginRegistry.setDefaultAdapter('custom-test');
      
      expect(pluginRegistry.getDefaultAdapter()).toBe(customAdapter);
    });

    it('should throw error when setting non-existent default adapter', () => {
      expect(() => {
        pluginRegistry.setDefaultAdapter('non-existent');
      }).toThrow('UI adapter "non-existent" not found');
    });
  });

  describe('Backward Compatibility', () => {
    it('should work without any custom renderers registered', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        isActive: z.boolean()
      });

      render(
        <ZodForm
          schema={schema}
          onSubmit={vi.fn()}
        />
      );

      // Should render default form with default field renderers
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should maintain existing FormGenerator API', () => {
      const schema = z.object({
        name: z.string()
      });

      const onSubmit = vi.fn();

      render(
        <ZodForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ name: 'Test' }}
          className="custom-form"
        />
      );

      // Should work exactly as before
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
      expect(screen.getByRole('form')).toHaveClass('custom-form');
    });
  });

  describe('Schema Pattern Registration', () => {
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

    const CustomNumberPatternRenderer = ({ 
      value, 
      onChange, 
      error, 
      label, 
      name 
    }: any) => (
      <div className="custom-number-pattern" data-testid={`pattern-${name}`}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          min="0"
          max="100"
          data-testid={`number-input-${name}`}
          className={error ? 'error' : ''}
        />
        {error && <span data-testid={`pattern-error-${name}`} className="error">{error}</span>}
        <small data-testid="pattern-hint">Custom number pattern (0-100)</small>
      </div>
    );

    beforeEach(() => {
      // Clear pattern renderers before each test
      clearPatternRenderers();
    });

    it('should register a schema pattern renderer with function matcher', () => {
      // Register pattern with function matcher
      registerSchemaPatternRenderer(
        'email-pattern',
        (zodSchema: z.ZodTypeAny) => {
          return zodSchema instanceof z.ZodString && 
                 zodSchema._def.checks?.some((check: any) => check.kind === 'email');
        },
        CustomEmailPatternRenderer,
        100
      );

      // Test that the pattern matches email schemas
      const emailSchema = z.string().email();
      const regularStringSchema = z.string();

      const emailRenderer = getMatchingPatternRenderer(emailSchema, { type: 'string' });
      const stringRenderer = getMatchingPatternRenderer(regularStringSchema, { type: 'string' });

      expect(emailRenderer).toBe(CustomEmailPatternRenderer);
      expect(stringRenderer).toBeUndefined();
    });

    it('should register a schema pattern renderer with Zod schema matcher', () => {
      // Create a specific Zod schema pattern
      const numberRangeSchema = z.number().min(0).max(100);

      // Register pattern with Zod schema matcher
      registerSchemaPatternRenderer(
        'number-range-pattern',
        numberRangeSchema,
        CustomNumberPatternRenderer,
        80
      );

      // Test that the pattern matches similar schemas
      const matchingSchema = z.number().min(0).max(100);
      const nonMatchingSchema = z.number();

      const matchingRenderer = getMatchingPatternRenderer(matchingSchema, { type: 'number' });
      const nonMatchingRenderer = getMatchingPatternRenderer(nonMatchingSchema, { type: 'number' });

      expect(matchingRenderer).toBe(CustomNumberPatternRenderer);
      expect(nonMatchingRenderer).toBeUndefined();
    });

    it('should prioritize pattern renderers by priority value', () => {
      const HighPriorityRenderer = () => <div data-testid="high-priority">High Priority</div>;
      const LowPriorityRenderer = () => <div data-testid="low-priority">Low Priority</div>;

      // Register low priority first
      registerSchemaPatternRenderer(
        'low-priority',
        (zodSchema: z.ZodTypeAny) => zodSchema instanceof z.ZodString,
        LowPriorityRenderer,
        10
      );

      // Register high priority second
      registerSchemaPatternRenderer(
        'high-priority',
        (zodSchema: z.ZodTypeAny) => zodSchema instanceof z.ZodString,
        HighPriorityRenderer,
        100
      );

      const stringSchema = z.string();
      const renderer = getMatchingPatternRenderer(stringSchema, { type: 'string' });

      // Should return the high priority renderer
      expect(renderer).toBe(HighPriorityRenderer);
    });

    it('should replace existing pattern when registering with same ID', () => {
      const OriginalRenderer = () => <div data-testid="original">Original</div>;
      const ReplacementRenderer = () => <div data-testid="replacement">Replacement</div>;

      // Register original pattern
      registerSchemaPatternRenderer(
        'replaceable-pattern',
        (zodSchema: z.ZodTypeAny) => zodSchema instanceof z.ZodString,
        OriginalRenderer,
        50
      );

      // Register replacement with same ID
      registerSchemaPatternRenderer(
        'replaceable-pattern',
        (zodSchema: z.ZodTypeAny) => zodSchema instanceof z.ZodString,
        ReplacementRenderer,
        50
      );

      const stringSchema = z.string();
      const renderer = getMatchingPatternRenderer(stringSchema, { type: 'string' });

      // Should return the replacement renderer
      expect(renderer).toBe(ReplacementRenderer);
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

    it('should support removing pattern renderers', () => {
      // Register a pattern
      registerSchemaPatternRenderer(
        'removable-pattern',
        (zodSchema: z.ZodTypeAny) => zodSchema instanceof z.ZodString,
        CustomEmailPatternRenderer,
        50
      );

      const stringSchema = z.string();
      
      // Should find the pattern initially
      expect(getMatchingPatternRenderer(stringSchema, { type: 'string' })).toBe(CustomEmailPatternRenderer);

      // Remove the pattern
      const removed = removeSchemaPatternRenderer('removable-pattern');
      expect(removed).toBe(true);

      // Should not find the pattern after removal
      expect(getMatchingPatternRenderer(stringSchema, { type: 'string' })).toBeUndefined();
    });

    it('should return false when trying to remove non-existent pattern', () => {
      const removed = removeSchemaPatternRenderer('non-existent-pattern');
      expect(removed).toBe(false);
    });

    it('should support getting all pattern renderers', () => {
      // Register multiple patterns
      registerSchemaPatternRenderer('pattern1', () => true, CustomEmailPatternRenderer, 100);
      registerSchemaPatternRenderer('pattern2', () => true, CustomNumberPatternRenderer, 50);

      const allPatterns = getAllPatternRenderers();

      expect(allPatterns).toHaveLength(2);
      expect(allPatterns[0].id).toBe('pattern1'); // Higher priority first
      expect(allPatterns[0].priority).toBe(100);
      expect(allPatterns[1].id).toBe('pattern2');
      expect(allPatterns[1].priority).toBe(50);
    });

    it('should support clearing all pattern renderers', () => {
      // Register some patterns
      registerSchemaPatternRenderer('pattern1', () => true, CustomEmailPatternRenderer, 100);
      registerSchemaPatternRenderer('pattern2', () => true, CustomNumberPatternRenderer, 50);

      expect(getAllPatternRenderers()).toHaveLength(2);

      // Clear all patterns
      clearPatternRenderers();

      expect(getAllPatternRenderers()).toHaveLength(0);
    });

    it('should debug pattern renderer matching', () => {
      // Enable debug logging
      if (typeof window !== 'undefined') {
        (window as any).__DEBUG_PATTERN_RENDERER = true;
      }

      // Register a simple pattern that should match any string
      registerSchemaPatternRenderer(
        'debug-string-pattern',
        (zodSchema: z.ZodTypeAny) => {
          console.log('Pattern matcher called with:', zodSchema.constructor.name);
          return zodSchema instanceof z.ZodString;
        },
        CustomEmailPatternRenderer,
        100
      );

      // Test direct pattern matching
      const testSchema = z.string().email();
      const result = getMatchingPatternRenderer(testSchema, { type: 'string' });
      
      console.log('Direct pattern matching result:', result?.name || 'none');
      expect(result).toBe(CustomEmailPatternRenderer);

      // Clean up
      if (typeof window !== 'undefined') {
        (window as any).__DEBUG_PATTERN_RENDERER = false;
      }
    });
  });
}); 