
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import {  useLayoutEffect } from 'react';
import { ZodFormProps, ValidFormSchema } from '../types/form-generator';
import { FieldRenderer } from './FieldRenderer';
import { parseZodSchema } from '../utils/schema-parser';
import { registerUIAdapter as registerUIAdapterFn, setDefaultAdapter } from '../utils/plugin-registry';

// Helper function to extract default values from Zod schema
const extractSchemaDefaults = (zodSchema: z.ZodTypeAny): any => {
  // Don't try to parse empty object - just extract defaults manually
  if (zodSchema instanceof z.ZodObject) {
    const defaults: any = {};
    Object.entries(zodSchema.shape).forEach(([key, fieldSchema]) => {
      if (fieldSchema instanceof z.ZodDefault) {
        defaults[key] = fieldSchema._def.defaultValue();
      } else if (fieldSchema instanceof z.ZodOptional) {
        // Optional fields get undefined
        defaults[key] = undefined;
      } else if (fieldSchema instanceof z.ZodString) {
        // Initialize string fields with empty string to avoid undefined
        defaults[key] = '';
      } else if (fieldSchema instanceof z.ZodNumber) {
        // Initialize number fields with 0
        defaults[key] = 0;
      } else if (fieldSchema instanceof z.ZodBoolean) {
        // Initialize boolean fields with false
        defaults[key] = false;
      } else if (fieldSchema instanceof z.ZodArray) {
        // Initialize arrays with empty array
        defaults[key] = [];
      } else if (fieldSchema instanceof z.ZodObject) {
        // Recursively handle nested objects
        defaults[key] = extractSchemaDefaults(fieldSchema);
      } else if (fieldSchema instanceof z.ZodEnum) {
        // Initialize enum with first option
        defaults[key] = fieldSchema.options[0];
      } else if (fieldSchema instanceof z.ZodDiscriminatedUnion) {
        // Initialize discriminated union with first variant
        const firstVariant = fieldSchema.options[0];
        if (firstVariant instanceof z.ZodObject) {
          const discriminatorKey = fieldSchema.discriminator;
          const discriminatorValue = firstVariant.shape[discriminatorKey].value;
          defaults[key] = {
            [discriminatorKey]: discriminatorValue,
            ...extractSchemaDefaults(firstVariant)
          };
        }
      } else {
        // For other types, use undefined
        defaults[key] = undefined;
      }
    });
    return defaults;
  }
  return {};
};

export function ZodForm<T extends ValidFormSchema>({
  schema,
  onSubmit,
  defaultValues = {},
  className = '',
  registerUIAdapter
}: ZodFormProps<T>) {

  if(registerUIAdapter) {
      registerUIAdapterFn(registerUIAdapter);
      setDefaultAdapter(registerUIAdapter.name);

  }

  // Register UI adapter if provided and set as default
  useLayoutEffect(() => {
    if (registerUIAdapter) {
      registerUIAdapterFn(registerUIAdapter);
      setDefaultAdapter(registerUIAdapter.name);
    }
  }, [registerUIAdapter]);

  // Extract default values from schema and merge with provided defaults
  const schemaDefaults = extractSchemaDefaults(schema);
  const mergedDefaults = { ...schemaDefaults, ...defaultValues };

  // Initialize the form using TanStack Form
  const form = useForm({
    defaultValues: mergedDefaults,
    onSubmit: async ({ value }) => {
      // Validate with Zod before submitting
      try {
        const validatedData = schema.parse(value);
        await onSubmit(validatedData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Don't throw the error - just log it and let the form handle it
          console.error('Validation error:', error);
          return;
        }
        throw error;
      }
    }
  });

  const parsedSchema = parseZodSchema(schema);

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={`form-generator ${className}`}
      role="form"
    >
      <FieldRenderer
        schema={parsedSchema}
        form={form}
        path=""
        zodSchema={schema}
        isRoot={true}
      />
      <form.Subscribe
        selector={(state) => ({ 
          canSubmit: state.canSubmit, 
          isSubmitting: state.isSubmitting 
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <button 
            type="submit" 
            disabled={!canSubmit || isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}