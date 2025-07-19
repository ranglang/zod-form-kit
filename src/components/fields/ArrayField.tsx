import React from 'react';
import { FieldProps } from '../../types/form-generator';
import { ParsedField } from '../../utils/schema-parser';
import { FieldRenderer } from '../FieldRenderer';

interface ArrayFieldProps extends FieldProps {
  value: any[];
  onChange: (path: string, value: any) => void;
  itemSchema: ParsedField;
  errors: Record<string, string>;
  path: string;
  options?: {
    minLength?: number;
    maxLength?: number;
  };
}

export function ArrayField({
  name,
  label,
  value = [],
  onChange,
  itemSchema,
  errors,
  path,
  options = {},
  className = ''
}: ArrayFieldProps) {
  const addItem = () => {
    const newValue = [...value, getDefaultValue(itemSchema)];
    onChange(path, newValue);
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(path, newValue);
  };

  const canAddMore = !options.maxLength || value.length < options.maxLength;
  const canRemove = !options.minLength || value.length > options.minLength;

  return (
    <div className={`field array-field ${className}`}>
      <div className="array-header">
        <label className="field-label">{label}</label>
        <button
          type="button"
          onClick={addItem}
          disabled={!canAddMore}
          className="add-button"
        >
          Add Item
        </button>
      </div>
      
      <div className="array-items">
        {value.map((item, index) => (
          <div key={index} className="array-item">
            <FieldRenderer
              schema={itemSchema}
              value={item}
              onChange={onChange}
              errors={errors}
              path={`${path}.${index}`}
              label={`Item ${index + 1}`}
            />
            {canRemove && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getDefaultValue(schema: ParsedField): any {
  if (schema.defaultValue !== undefined) return schema.defaultValue;
  
  switch (schema.type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'date': return new Date();
    case 'array': return [];
    case 'object': return {};
    default: return null;
  }
}