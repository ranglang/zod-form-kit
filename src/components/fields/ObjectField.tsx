import React from 'react';
import { FieldProps } from '../../types/form-generator';
import { ParsedField } from '../../utils/schema-parser';
import { FieldRenderer } from '../FieldRenderer';

interface ObjectFieldProps extends FieldProps {
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
  properties: Record<string, ParsedField>;
  errors: Record<string, string>;
  path: string;
}

export function ObjectField({
  label,
  value = {},
  onChange,
  properties,
  errors,
  path,
  className = ''
}: ObjectFieldProps) {
  return (
    <div className={`field object-field ${className}`}>
      {label && <div className="object-label">{label}</div>}
      
      <div className="object-properties">
        {Object.entries(properties).map(([key, schema]) => {
          const fieldPath = path ? `${path}.${key}` : key;
          return (
            <FieldRenderer
              key={key}
              schema={schema}
              value={value[key]}
              onChange={onChange}
              errors={errors}
              path={fieldPath}
              label={key}
            />
          );
        })}
      </div>
    </div>
  );
}