import React from 'react';
import { ParsedField } from '../utils/schema-parser';
import { getRegisteredRenderer, getMatchingPatternRenderer } from '../utils/plugin-registry';
import { FieldType, SchemaPatternRenderer } from '../types/plugin-system';
import { z } from 'zod';

interface FieldRendererProps {
  schema: ParsedField;
  form: any; // TanStack Form instance
  path: string;
  label?: string;
  zodSchema?: z.ZodTypeAny; // Added to support field-level validation
  isRoot?: boolean; // Added to support root-level rendering
}

// Helper function to get field schema from path
const getFieldSchemaAtPath = (zodSchema: z.ZodTypeAny | undefined, path: string): z.ZodTypeAny | undefined => {
  if (!path || !zodSchema) return zodSchema;
  
  const pathParts = path.split('.');
  let currentSchema = zodSchema;
  
  for (const part of pathParts) {
    if (currentSchema instanceof z.ZodObject) {
      currentSchema = currentSchema.shape[part];
    } else {
      return undefined;
    }
  }
  
  return currentSchema;
};

export function FieldRenderer({
  schema,
  form,
  path,
  label,
  zodSchema,
  isRoot = false
}: FieldRendererProps) {
  const fieldName = path || schema.name || '';

  // Special handling for root-level objects
  // Instead of trying to render the root object as a single field,
  // render its properties directly to avoid TanStack Form path issues
  if (isRoot && schema.type === 'object' && schema.properties) {
    return (
      <div className="root-object-fields">
        {Object.entries(schema.properties).map(([key, propertySchema]) => {
          if (!propertySchema) {
            console.warn(`FieldRenderer: Schema for property '${key}' is undefined`);
            return null;
          }

          return (
            <FieldRenderer
              key={key}
              schema={propertySchema as ParsedField}
              form={form}
              path={key}
              label={key}
              zodSchema={zodSchema}
              isRoot={false}
            />
          );
        })}
      </div>
    );
  }

  // Get the specific Zod schema for this field for validation
  const fieldZodSchema = getFieldSchemaAtPath(zodSchema, fieldName);

  // STEP 1: Check for pattern-based custom renderers first
  let PatternComponent: SchemaPatternRenderer | undefined;
  if (fieldZodSchema) {
    PatternComponent = getMatchingPatternRenderer(fieldZodSchema, schema);
  }

  // STEP 2: If pattern renderer found, use it
  if (PatternComponent) {
    return (
      <form.Field
        name={fieldName}
        validators={{
          onChange: fieldZodSchema ? ({ value, fieldApi }: { value: any; fieldApi: any }) => {
            // Always validate if the field has been touched or if the form has been submitted
            const isTouched = fieldApi?.state?.meta?.isTouched;
            const hasErrors = fieldApi?.state?.meta?.errors?.length > 0;
            const isSubmitted = fieldApi?.state?.meta?.isSubmitted;
            const shouldValidate = isTouched || hasErrors || isSubmitted;
            
            if (!shouldValidate) {
              return undefined;
            }
            
            try {
              fieldZodSchema!.parse(value);
              return undefined;
            } catch (error) {
              if (error instanceof z.ZodError) {
                return error.errors[0]?.message || 'Validation error';
              }
              return 'Validation error';
            }
          } : undefined
        }}
        children={(field: any) => {
          const patternProps = {
            value: field.state.value,
            onChange: (newValue: any) => field.handleChange(newValue),
            error: field.state.meta.errors.join(', ') || undefined,
            required: schema.required,
            label: label || path.split('.').pop() || '',
            name: fieldName,
            zodSchema: fieldZodSchema!,
            parsedField: schema,
            form,
            path: fieldName
          };

          return React.createElement(PatternComponent, patternProps);
        }}
      />
    );
  }

  // STEP 3: Fall back to type-based renderers (existing behavior)
  const fieldType = schema.type as FieldType;
  const FieldComponent = getRegisteredRenderer(fieldType);

  if (!FieldComponent) {
    return <div>Unsupported field type: {schema.type}</div>;
  }

  return (
    <form.Field
      name={fieldName}
      validators={{
        onChange: fieldZodSchema ? ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          // Always validate if the field has been touched or if the form has been submitted
          const isTouched = fieldApi?.state?.meta?.isTouched;
          const hasErrors = fieldApi?.state?.meta?.errors?.length > 0;
          const isSubmitted = fieldApi?.state?.meta?.isSubmitted;
          const shouldValidate = isTouched || hasErrors || isSubmitted;
          
          if (!shouldValidate) {
            return undefined;
          }
          
          try {
            fieldZodSchema!.parse(value);
            return undefined;
          } catch (error) {
            if (error instanceof z.ZodError) {
              return error.errors[0]?.message || 'Validation error';
            }
            return 'Validation error';
          }
        } : undefined
      }}
      children={(field: any) => {
        const fieldProps = {
          value: field.state.value,
          onChange: (newValue: any) => field.handleChange(newValue),
          error: field.state.meta.errors.join(', ') || undefined,
          required: schema.required,
          label: label || path.split('.').pop() || '',
          name: fieldName
        };

        switch (schema.type) {
          case 'string':
            return React.createElement(FieldComponent as any, { ...fieldProps, options: schema.options });
          
          case 'number':
            return React.createElement(FieldComponent as any, { ...fieldProps, options: schema.options });
          
          case 'boolean':
            return React.createElement(FieldComponent as any, fieldProps);
          
          case 'date':
            return React.createElement(FieldComponent as any, fieldProps);
          
          case 'enum':
            return React.createElement(FieldComponent as any, { ...fieldProps, values: schema.values });
          
          case 'array':
            return React.createElement(FieldComponent as any, {
              ...fieldProps,
              itemSchema: schema.items!,
              form,
              path: fieldName,
              options: schema.options
            });
          
          case 'object':
            return React.createElement(FieldComponent as any, {
              ...fieldProps,
              properties: schema.properties || {},
              form,
              path: fieldName,
              zodSchema
            });
          
          case 'discriminatedUnion':
            return React.createElement(FieldComponent as any, {
              ...fieldProps,
              discriminator: schema.discriminator!,
              variants: schema.variants!,
              form,
              path: fieldName,
              zodSchema
            });
          
          default:
            return <div>Unsupported field type: {schema.type}</div>;
        }
      }}
    />
  );
}