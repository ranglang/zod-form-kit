import React from 'react';
import { FieldProps } from '../../types/form-generator';
import { ParsedField } from '../../utils/schema-parser';
import { FieldRenderer } from '../FieldRenderer';

interface DiscriminatedUnionFieldProps extends FieldProps {
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
  discriminator: string;
  variants: Record<string, ParsedField>;
  errors: Record<string, string>;
  path: string;
}

export function DiscriminatedUnionField({
  label,
  value = {},
  onChange,
  discriminator,
  variants,
  errors,
  path,
  className = ''
}: DiscriminatedUnionFieldProps) {
  const currentVariant = value[discriminator];
  const variantOptions = Object.keys(variants);

  const handleVariantChange = (newVariant: string) => {
    const newValue = { [discriminator]: newVariant };
    onChange(path, newValue);
  };

  return (
    <div className={`field discriminated-union-field ${className}`}>
      {label && <div className="union-label">{label}</div>}
      
      <div className="variant-selector">
        <label className="field-label">Type</label>
        <select
          value={currentVariant || ''}
          onChange={(e) => handleVariantChange(e.target.value)}
          className="field-input"
        >
          <option value="">Select type...</option>
          {variantOptions.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </div>

      {currentVariant && variants[currentVariant] && (
        <div className="variant-fields">
          <FieldRenderer
            schema={variants[currentVariant]}
            value={value}
            onChange={onChange}
            errors={errors}
            path={path}
          />
        </div>
      )}
    </div>
  );
}