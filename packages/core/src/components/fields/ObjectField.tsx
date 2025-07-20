import { ParsedField } from '../../utils/schema-parser';
import { FieldRenderer } from '../FieldRenderer';
import { z } from 'zod';

interface ObjectFieldProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  properties: Record<string, ParsedField>;
  form: any;
  path: string;
  zodSchema?: z.ZodTypeAny; // Added to support pattern rendering
}

export function ObjectField({
  error: _error,
  required,
  label,
  properties,
  form,
  path,
  zodSchema
}: ObjectFieldProps) {
  const safeProperties = properties || {};
  
  return (
    <div className="object-field">
      <label className="object-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="object-properties">
        {Object.entries(safeProperties).map(([key, schema]) => {
          // Skip if schema is undefined
          if (!schema) {
            return null;
          }
          
          const fieldPath = path ? `${path}.${key}` : key;
          return (
            <FieldRenderer
              key={key}
              schema={schema}
              form={form}
              path={fieldPath}
              label={key}
              zodSchema={zodSchema}
            />
          );
        })}
      </div>
    </div>
  );
}